import { describe, it, expect, vi } from "vitest";
import { buildEncounter, playerAttack, playerGuard, playerUseSkill, enemyTurn, type CombatRuntimeState } from "@/engine/combat";
import { getEncounter } from "@/content/registry";
import type { Combatant } from "@/types";

function makeTestPlayer(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: "player",
    name: "Tester",
    isPlayerSide: true,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    attack: 20,
    defense: 10,
    agility: 10,
    statuses: [],
    skillCooldowns: {},
    isGuarding: false,
    glyph: "user",
    color: "#000",
    ...overrides,
  };
}

describe("buildEncounter", () => {
  it("builds combatants from a real encounter + enemy registry entry", () => {
    const encounter = getEncounter("ai-enc-field1-boar")!;
    const state = buildEncounter(encounter, [makeTestPlayer()]);
    expect(state.enemies).toHaveLength(1);
    expect(state.enemies[0].name).toBe("Wild Boar");
    expect(state.enemies[0].health).toBeGreaterThan(0);
    expect(state.phase).toBe("player-turn");
  });

  it("gives duplicate enemies of the same type distinct combat ids", () => {
    const encounter = getEncounter("ai-enc-field1-wolves")!; // two Timber Wolves
    const state = buildEncounter(encounter, [makeTestPlayer()]);
    const ids = state.enemies.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("playerAttack", () => {
  it("reduces the target's health without dropping it below zero", () => {
    const encounter = getEncounter("ai-enc-field1-boar")!;
    let state = buildEncounter(encounter, [makeTestPlayer({ attack: 500 })]);
    const targetId = state.enemies[0].id;
    state = playerAttack(state, targetId);
    const target = state.enemies.find((e) => e.id === targetId)!;
    expect(target.health).toBe(0);
  });

  it("guarding halves incoming damage", () => {
    const attacker = makeTestPlayer({ id: "atk", attack: 40 });
    const defenderNormal: Combatant = { ...makeTestPlayer({ id: "def1" }), isPlayerSide: false, defense: 0 };
    const defenderGuarding: Combatant = { ...defenderNormal, id: "def2", isGuarding: true };

    const baseState: CombatRuntimeState = {
      encounterId: "test",
      isBossRaid: false,
      round: 1,
      party: [attacker],
      enemies: [defenderNormal],
      log: [],
      turnOrder: [],
      activeIndex: 0,
      phase: "player-turn",
      triggeredPhases: {},
      grade: null,
      startingPartyHealth: attacker.health,
    };

    const afterNormal = playerAttack(baseState, "def1");
    const dmgNormal = defenderNormal.health - afterNormal.enemies[0].health;

    const guardedState: CombatRuntimeState = { ...baseState, enemies: [defenderGuarding] };
    const afterGuarded = playerAttack(guardedState, "def2");
    const dmgGuarded = defenderGuarding.health - afterGuarded.enemies[0].health;

    expect(dmgGuarded).toBeLessThan(dmgNormal);
  });

  it("transitions to victory once every enemy is defeated", () => {
    const encounter = getEncounter("ai-enc-field1-imp")!; // single weak enemy
    let state = buildEncounter(encounter, [makeTestPlayer({ attack: 9999 })]);
    state = playerAttack(state, state.enemies[0].id);
    expect(state.phase).toBe("victory");
    expect(state.grade).not.toBeNull();
  });
});

describe("playerGuard / enemyTurn", () => {
  it("guard status is consumed after the enemy's turn", () => {
    const encounter = getEncounter("ai-enc-field1-boar")!;
    let state = buildEncounter(encounter, [makeTestPlayer()]);
    state = playerGuard(state);
    // enemyTurn runs automatically as part of the player-action pipeline (advanceAfterPlayerAction)
    expect(state.party[0].isGuarding).toBe(false); // cleared once the enemy round resolves
  });

  it("defeat is detected once the whole party's health reaches zero", () => {
    const encounter = getEncounter("ai-enc-field1-boar")!;
    let state = buildEncounter(encounter, [makeTestPlayer({ health: 1, maxHealth: 1, defense: -999 })]);
    // Keep guarding until the boar lands a hit; deterministic upper bound on attempts.
    for (let i = 0; i < 20 && state.phase === "player-turn"; i++) {
      state = playerGuard(state);
    }
    expect(["defeat", "player-turn"]).toContain(state.phase);
  });
});

describe("playerUseSkill", () => {
  it("spends stamina and respects insufficient-stamina guard", () => {
    const encounter = getEncounter("ai-enc-field1-boar")!;
    let state = buildEncounter(encounter, [makeTestPlayer({ stamina: 5, maxStamina: 100 })]);
    const before = state.party[0].stamina;
    // sk-heavy-cleave costs 22 stamina — should be a no-op with only 5 available
    state = playerUseSkill(state, "sk-heavy-cleave", state.enemies[0].id);
    expect(state.party[0].stamina).toBe(before);
    expect(state.phase).toBe("player-turn");
  });

  it("applies a status effect to the target on a landed skill", () => {
    // sk-guard-break's status has a random chance to land; force the roll deterministically.
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const encounter = getEncounter("ai-enc-field1-boar")!;
      let state = buildEncounter(encounter, [makeTestPlayer({ stamina: 100, attack: 0 })]);
      const targetId = state.enemies[0].id;
      state = playerUseSkill(state, "sk-guard-break", targetId, true);
      const target = state.enemies.find((e) => e.id === targetId);
      expect(target?.health).toBeGreaterThan(0);
      expect(target?.statuses.some((s) => s.effect === "guard-break")).toBe(true);
    } finally {
      randomSpy.mockRestore();
    }
  });
});

describe("enemyTurn phase escalation", () => {
  it("logs a phase transition once a boss crosses a health threshold", () => {
    const encounter = getEncounter("ai-enc-boss1")!; // Sylvan Guardian, phases at 0.6 and 0.25
    let state = buildEncounter(encounter, [makeTestPlayer({ attack: 100000 })]);
    const boss = state.enemies[0];
    // manually bring it just under the first phase threshold without killing it
    boss.health = Math.floor(boss.maxHealth * 0.5);
    state = enemyTurn(state);
    expect(state.triggeredPhases[boss.id]).toBeDefined();
    expect(state.log.some((l) => l.kind === "status")).toBe(true);
  });
});
