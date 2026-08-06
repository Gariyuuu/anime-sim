import { z } from "zod";

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  power: z.number(),
  staminaCost: z.number().default(0),
  cooldown: z.number().default(0),
  targetType: z.enum(["single", "self", "party", "all-enemies"]).default("single"),
  statusEffect: z.enum(["none", "stun", "poison", "guard-break", "bleed", "regen", "shield"]).default("none"),
  timingBonusWindowMs: z.number().optional(),
});
export type Skill = z.infer<typeof SkillSchema>;

export const EnemyDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tier: z.enum(["common", "elite", "mini-boss", "floor-boss"]),
  floorId: z.string(),
  health: z.number(),
  attack: z.number(),
  defense: z.number(),
  agility: z.number(),
  col: z.number(),
  xp: z.number(),
  skills: z.array(z.string()).default([]),
  weakness: z.string().optional(),
  glyph: z.string().default("skull"),
  color: z.string().default("#555555"),
  phases: z
    .array(
      z.object({
        healthThreshold: z.number(),
        description: z.string(),
        bonusAttack: z.number().default(0),
      }),
    )
    .default([]),
});
export type EnemyDefinition = z.infer<typeof EnemyDefinitionSchema>;

export const CombatActionSchema = z.enum(["attack", "skill", "guard", "dodge", "item", "analyze", "party-command", "escape"]);
export type CombatAction = z.infer<typeof CombatActionSchema>;

export const StatusEffectInstanceSchema = z.object({
  effect: z.string(),
  turnsRemaining: z.number(),
  magnitude: z.number().default(0),
});
export type StatusEffectInstance = z.infer<typeof StatusEffectInstanceSchema>;

export const CombatantSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPlayerSide: z.boolean(),
  health: z.number(),
  maxHealth: z.number(),
  stamina: z.number(),
  maxStamina: z.number(),
  attack: z.number(),
  defense: z.number(),
  agility: z.number(),
  statuses: z.array(StatusEffectInstanceSchema).default([]),
  skillCooldowns: z.record(z.string(), z.number()).default({}),
  isGuarding: z.boolean().default(false),
  glyph: z.string().default("user"),
  color: z.string().default("#333333"),
  /** Links a combat instance back to its EnemyDefinition, for phase lookups. Unset for player-side combatants. */
  defId: z.string().optional(),
});
export type Combatant = z.infer<typeof CombatantSchema>;

export const EncounterDefinitionSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  name: z.string(),
  enemyIds: z.array(z.string()),
  isBossRaid: z.boolean().default(false),
  preRaidPlanning: z.boolean().default(false),
  /** Story flags set automatically on victory (kept as flag ids for simplicity). */
  victoryEffects: z.array(z.string()).default([]),
  /** Scene to jump into immediately after a win/loss, if the encounter has narrative follow-up. */
  victorySceneId: z.string().optional(),
  defeatSceneId: z.string().optional(),
});
export type EncounterDefinition = z.infer<typeof EncounterDefinitionSchema>;
