import type { Combatant, EncounterDefinition, EnemyDefinition, Skill, StatusEffectInstance } from "@/types";
import { getEnemy, getSkill } from "@/content/registry";
import { clamp } from "@/types/common";

export interface CombatLogEntry {
  id: string;
  text: string;
  kind: "info" | "damage" | "heal" | "status" | "victory" | "defeat";
}

export interface CombatRuntimeState {
  encounterId: string;
  isBossRaid: boolean;
  round: number;
  party: Combatant[];
  enemies: Combatant[];
  log: CombatLogEntry[];
  turnOrder: string[];
  activeIndex: number;
  phase: "player-turn" | "enemy-turn" | "victory" | "defeat" | "escaped";
  triggeredPhases: Record<string, number[]>;
  grade: "S" | "A" | "B" | "C" | null;
  startingPartyHealth: number;
}

let logCounter = 0;
function logId(): string {
  logCounter += 1;
  return `log-${logCounter}`;
}

function makeCombatant(
  source: { id: string; name: string },
  stats: Omit<Combatant, "id" | "name" | "isPlayerSide" | "statuses" | "skillCooldowns" | "isGuarding" | "glyph" | "color">,
  isPlayerSide: boolean,
  glyph = "user",
  color = "#333333",
): Combatant {
  return {
    id: source.id,
    name: source.name,
    isPlayerSide,
    statuses: [],
    skillCooldowns: {},
    isGuarding: false,
    glyph,
    color,
    ...stats,
  };
}

export function playerCombatant(name: string, core: { combat: number; agility: number }, aincrad: { health: number; maxHealth: number; stamina: number; maxStamina: number; strength: number; defense: number }): Combatant {
  return makeCombatant(
    { id: "player", name },
    {
      health: aincrad.health,
      maxHealth: aincrad.maxHealth,
      stamina: aincrad.stamina,
      maxStamina: aincrad.maxStamina,
      attack: aincrad.strength + core.combat,
      defense: aincrad.defense,
      agility: core.agility,
    },
    true,
    "user",
    "#1a1a1a",
  );
}

export function companionCombatant(npcId: string, name: string, levelScale: number, glyph: string, color: string): Combatant {
  const base = 20 + levelScale * 6;
  return makeCombatant(
    { id: npcId, name },
    {
      health: 80 + levelScale * 15,
      maxHealth: 80 + levelScale * 15,
      stamina: 60,
      maxStamina: 60,
      attack: base,
      defense: 8 + levelScale * 2,
      agility: 8 + levelScale,
    },
    true,
    glyph,
    color,
  );
}

function enemyCombatant(def: EnemyDefinition, suffix = ""): Combatant {
  const c = makeCombatant(
    { id: `${def.id}${suffix}`, name: def.name },
    {
      health: def.health,
      maxHealth: def.health,
      stamina: 999,
      maxStamina: 999,
      attack: def.attack,
      defense: def.defense,
      agility: def.agility,
    },
    false,
    def.glyph,
    def.color,
  );
  c.defId = def.id;
  return c;
}

/** Sums bonus attack from every phase threshold the enemy has crossed, and announces newly-entered phases. */
function applyPhaseEscalation(state: CombatRuntimeState, enemy: Combatant): number {
  if (!enemy.defId) return 0;
  const def = getEnemy(enemy.defId);
  if (!def || def.phases.length === 0) return 0;
  const fraction = enemy.health / enemy.maxHealth;
  const alreadyTriggered = state.triggeredPhases[enemy.id] ?? [];
  let bonus = 0;
  const newlyTriggered: number[] = [];
  def.phases.forEach((phase, i) => {
    if (fraction <= phase.healthThreshold) {
      bonus += phase.bonusAttack;
      if (!alreadyTriggered.includes(i)) newlyTriggered.push(i);
    }
  });
  if (newlyTriggered.length > 0) {
    state.triggeredPhases = { ...state.triggeredPhases, [enemy.id]: [...alreadyTriggered, ...newlyTriggered] };
    for (const i of newlyTriggered) pushLog(state, `${enemy.name}: ${def.phases[i].description}`, "status");
  }
  return bonus;
}

export function buildEncounter(encounter: EncounterDefinition, party: Combatant[]): CombatRuntimeState {
  const enemyDefs = encounter.enemyIds.map((id) => getEnemy(id)).filter((e): e is EnemyDefinition => !!e);
  const enemies = enemyDefs.map((def, i) => enemyCombatant(def, enemyDefs.filter((d) => d.id === def.id).length > 1 ? `-${i}` : ""));
  const startingPartyHealth = party.reduce((sum, c) => sum + c.health, 0);
  return {
    encounterId: encounter.id,
    isBossRaid: encounter.isBossRaid,
    round: 1,
    party: party.map((p) => ({ ...p })),
    enemies,
    log: [{ id: logId(), text: encounter.isBossRaid ? `The raid begins: ${encounter.name}.` : `A wild encounter begins: ${encounter.name}.`, kind: "info" }],
    turnOrder: [],
    activeIndex: 0,
    phase: "player-turn",
    triggeredPhases: {},
    grade: null,
    startingPartyHealth,
  };
}

function aliveParty(state: CombatRuntimeState): Combatant[] {
  return state.party.filter((c) => c.health > 0);
}
function aliveEnemies(state: CombatRuntimeState): Combatant[] {
  return state.enemies.filter((c) => c.health > 0);
}

function computeDamage(attacker: Combatant, defender: Combatant, power: number, timingBonus: boolean): number {
  const guardMult = defender.isGuarding ? 0.5 : 1;
  const timingMult = timingBonus ? 1.3 : 1;
  const raw = (attacker.attack + power - defender.defense * 0.6) * guardMult * timingMult;
  return Math.max(1, Math.round(raw));
}

function pushLog(state: CombatRuntimeState, text: string, kind: CombatLogEntry["kind"] = "info") {
  state.log = [...state.log, { id: logId(), text, kind }];
}

export function playerAttack(state: CombatRuntimeState, targetId: string, timingBonus = false): CombatRuntimeState {
  const next = structuredCloneState(state);
  const attacker = next.party[0];
  const target = next.enemies.find((e) => e.id === targetId);
  if (!attacker || !target || attacker.health <= 0 || target.health <= 0) return next;
  const dmg = computeDamage(attacker, target, 10, timingBonus);
  target.health = clamp(target.health - dmg, 0, target.maxHealth);
  pushLog(next, `${attacker.name} strikes ${target.name} for ${dmg} damage.`, "damage");
  return advanceAfterPlayerAction(next);
}

export function playerUseSkill(state: CombatRuntimeState, skillId: string, targetId: string | null, timingBonus = false): CombatRuntimeState {
  const next = structuredCloneState(state);
  const skill = getSkill(skillId);
  const attacker = next.party[0];
  if (!skill || !attacker || attacker.stamina < skill.staminaCost || (attacker.skillCooldowns[skillId] ?? 0) > 0) return next;
  attacker.stamina = clamp(attacker.stamina - skill.staminaCost, 0, attacker.maxStamina);
  attacker.skillCooldowns[skillId] = skill.cooldown;

  const targets: Combatant[] =
    skill.targetType === "all-enemies"
      ? next.enemies.filter((e) => e.health > 0)
      : skill.targetType === "self"
        ? [attacker]
        : skill.targetType === "party"
          ? next.party.filter((p) => p.health > 0)
          : [next.enemies.find((e) => e.id === targetId)].filter((e): e is Combatant => !!e);

  for (const target of targets) {
    if (skill.targetType === "self" || skill.targetType === "party") {
      if (skill.power > 0) {
        target.health = clamp(target.health + skill.power, 0, target.maxHealth);
        pushLog(next, `${attacker.name} uses ${skill.name} — ${target.name} recovers ${skill.power} HP.`, "heal");
      }
      if (skill.statusEffect !== "none") applyStatus(target, skill.statusEffect, 2);
    } else {
      const dmg = computeDamage(attacker, target, skill.power, timingBonus);
      target.health = clamp(target.health - dmg, 0, target.maxHealth);
      pushLog(next, `${attacker.name} uses ${skill.name} on ${target.name} for ${dmg} damage.`, "damage");
      if (skill.statusEffect !== "none" && Math.random() < 0.6) applyStatus(target, skill.statusEffect, 2);
    }
  }
  return advanceAfterPlayerAction(next);
}

function applyStatus(target: Combatant, effect: string, turns: number) {
  target.statuses = target.statuses.filter((s) => s.effect !== effect);
  target.statuses.push({ effect, turnsRemaining: turns, magnitude: 1 });
}

export function playerGuard(state: CombatRuntimeState): CombatRuntimeState {
  const next = structuredCloneState(state);
  next.party[0].isGuarding = true;
  pushLog(next, `${next.party[0].name} braces to guard.`, "info");
  return advanceAfterPlayerAction(next);
}

export function playerDodge(state: CombatRuntimeState): CombatRuntimeState {
  const next = structuredCloneState(state);
  applyStatus(next.party[0], "evasive", 1);
  pushLog(next, `${next.party[0].name} readies to dodge.`, "info");
  return advanceAfterPlayerAction(next);
}

export function playerUseItem(state: CombatRuntimeState, healthRestore: number, staminaRestore: number, itemName: string): CombatRuntimeState {
  const next = structuredCloneState(state);
  const p = next.party[0];
  p.health = clamp(p.health + healthRestore, 0, p.maxHealth);
  p.stamina = clamp(p.stamina + staminaRestore, 0, p.maxStamina);
  pushLog(next, `${p.name} uses ${itemName}.`, "heal");
  return advanceAfterPlayerAction(next);
}

export function playerAnalyze(state: CombatRuntimeState, targetId: string): CombatRuntimeState {
  const next = structuredCloneState(state);
  const target = next.enemies.find((e) => e.id === targetId);
  if (target) pushLog(next, `Analysis: ${target.name} — ${target.health}/${target.maxHealth} HP, ATK ${target.attack}, DEF ${target.defense}.`, "info");
  return advanceAfterPlayerAction(next);
}

export function playerEscape(state: CombatRuntimeState): CombatRuntimeState {
  const next = structuredCloneState(state);
  if (next.isBossRaid) {
    pushLog(next, "There's no escaping a boss raid once it starts.", "info");
    return next;
  }
  const chance = 0.6 + (next.party[0]?.agility ?? 0) * 0.01;
  if (Math.random() < chance) {
    next.phase = "escaped";
    pushLog(next, "You disengage and retreat.", "info");
  } else {
    pushLog(next, "Couldn't get away!", "info");
    return enemyTurn(next);
  }
  return next;
}

function advanceAfterPlayerAction(state: CombatRuntimeState): CombatRuntimeState {
  if (aliveEnemies(state).length === 0) {
    return finishVictory(state);
  }
  return enemyTurn(state);
}

function enemyAiAct(state: CombatRuntimeState, enemy: Combatant) {
  const targets = aliveParty(state);
  if (targets.length === 0) return;
  const target = targets[Math.floor(Math.random() * targets.length)];
  const stunned = enemy.statuses.some((s) => s.effect === "stun");
  if (stunned) {
    pushLog(state, `${enemy.name} is stunned and can't act.`, "status");
    return;
  }
  const phaseBonus = applyPhaseEscalation(state, enemy);
  const dmg = computeDamage({ ...enemy, attack: enemy.attack + phaseBonus }, target, 6, false);
  if (target.statuses.some((s) => s.effect === "evasive") && Math.random() < 0.5) {
    pushLog(state, `${target.name} dodges ${enemy.name}'s attack!`, "info");
    return;
  }
  target.health = clamp(target.health - dmg, 0, target.maxHealth);
  pushLog(state, `${enemy.name} hits ${target.name} for ${dmg} damage.`, "damage");
}

export function enemyTurn(state: CombatRuntimeState): CombatRuntimeState {
  const next = state;
  for (const enemy of aliveEnemies(next)) {
    enemyAiAct(next, enemy);
    if (aliveParty(next).length === 0) break;
  }
  // tick statuses & cooldowns, clear guard
  next.party.forEach((p) => {
    p.isGuarding = false;
    p.statuses = p.statuses.map((s) => ({ ...s, turnsRemaining: s.turnsRemaining - 1 })).filter((s) => s.turnsRemaining > 0);
    Object.keys(p.skillCooldowns).forEach((k) => {
      if (p.skillCooldowns[k] > 0) p.skillCooldowns[k] -= 1;
    });
  });
  next.enemies.forEach((e) => {
    e.statuses = e.statuses.map((s) => ({ ...s, turnsRemaining: s.turnsRemaining - 1 })).filter((s) => s.turnsRemaining > 0);
  });
  next.round += 1;

  if (aliveParty(next).length === 0) {
    next.phase = "defeat";
    pushLog(next, "Your party has fallen.", "defeat");
    return next;
  }
  next.phase = "player-turn";
  return next;
}

function finishVictory(state: CombatRuntimeState): CombatRuntimeState {
  const next = state;
  next.phase = "victory";
  const healthRatio = aliveParty(next).reduce((s, c) => s + c.health, 0) / Math.max(1, next.startingPartyHealth);
  const noLosses = aliveParty(next).length === next.party.length;
  next.grade = healthRatio > 0.8 && noLosses ? "S" : healthRatio > 0.55 ? "A" : healthRatio > 0.3 ? "B" : "C";
  pushLog(next, "Victory.", "victory");
  return next;
}

function structuredCloneState(state: CombatRuntimeState): CombatRuntimeState {
  return {
    ...state,
    party: state.party.map((p) => ({ ...p, statuses: [...p.statuses], skillCooldowns: { ...p.skillCooldowns } })),
    enemies: state.enemies.map((e) => ({ ...e, statuses: [...e.statuses], skillCooldowns: { ...e.skillCooldowns } })),
    log: [...state.log],
  };
}

export type { Skill, StatusEffectInstance };
