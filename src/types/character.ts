import { z } from "zod";
import {
  AINCRAD_STAT_KEYS,
  CORE_STAT_KEYS,
  DIFFICULTY_MODES,
  ELITE_STAT_KEYS,
  PERSONALITY_ARCHETYPES,
  PronounSetSchema,
  WORLD_IDS,
} from "./common";

export const HAIRSTYLES = ["short", "long", "ponytail", "twintails", "buzzcut", "wavy", "braided"] as const;
export const HAIR_COLORS = ["black", "brown", "auburn", "silver", "ash-blonde", "charcoal"] as const;
export const EYE_COLORS = ["dark-brown", "gray", "hazel", "steel-blue", "amber", "onyx"] as const;
export const SKIN_TONES = ["porcelain", "light", "tan", "deep", "olive"] as const;
export const FACE_OPTIONS = ["gentle", "sharp", "round", "angular", "soft"] as const;
export const OUTFITS = ["standard-uniform", "casual-layered", "sport-fit", "tailored"] as const;
export const ACCESSORIES = ["none", "glasses", "earpiece", "hairpin", "wristband", "choker"] as const;

export const AppearanceSchema = z.object({
  hairstyle: z.enum(HAIRSTYLES),
  hairColor: z.enum(HAIR_COLORS),
  eyeColor: z.enum(EYE_COLORS),
  skinTone: z.enum(SKIN_TONES),
  face: z.enum(FACE_OPTIONS),
  outfit: z.enum(OUTFITS),
  accessory: z.enum(ACCESSORIES),
});
export type Appearance = z.infer<typeof AppearanceSchema>;

export const CharacterCreatorSchema = z.object({
  name: z.string().min(1).max(24),
  pronouns: PronounSetSchema,
  personality: z.enum(PERSONALITY_ARCHETYPES),
  strength: z.enum(CORE_STAT_KEYS),
  weakness: z.enum(CORE_STAT_KEYS),
  background: z.string().max(280).optional(),
  appearance: AppearanceSchema,
  world: z.enum(WORLD_IDS),
  difficulty: z.enum(DIFFICULTY_MODES),
});
export type CharacterCreatorInput = z.infer<typeof CharacterCreatorSchema>;

export const CoreStatsSchema = z.object(
  Object.fromEntries(CORE_STAT_KEYS.map((k) => [k, z.number().int().min(0).max(20)])) as Record<
    (typeof CORE_STAT_KEYS)[number],
    z.ZodNumber
  >,
);
export type CoreStats = z.infer<typeof CoreStatsSchema>;

export const EliteStatsSchema = z.object(
  Object.fromEntries(ELITE_STAT_KEYS.map((k) => [k, z.number().int().min(0).max(999)])) as Record<
    (typeof ELITE_STAT_KEYS)[number],
    z.ZodNumber
  >,
).extend({
  // Private points is a spendable currency, not a capped meter — it needs a much wider range.
  privatePoints: z.number().int().min(0).max(999999),
});
export type EliteStats = z.infer<typeof EliteStatsSchema>;

export const AincradStatsSchema = z.object(
  Object.fromEntries(AINCRAD_STAT_KEYS.map((k) => [k, z.number().int().min(0).max(99999)])) as Record<
    (typeof AINCRAD_STAT_KEYS)[number],
    z.ZodNumber
  >,
);
export type AincradStats = z.infer<typeof AincradStatsSchema>;

export const PlayerSchema = z.object({
  name: z.string().min(1).max(24),
  pronouns: PronounSetSchema,
  personality: z.enum(PERSONALITY_ARCHETYPES),
  strength: z.enum(CORE_STAT_KEYS),
  weakness: z.enum(CORE_STAT_KEYS),
  background: z.string().max(280).optional(),
  appearance: AppearanceSchema,
  world: z.enum(WORLD_IDS),
  difficulty: z.enum(DIFFICULTY_MODES),
  core: CoreStatsSchema,
  elite: EliteStatsSchema,
  aincrad: AincradStatsSchema,
});
export type Player = z.infer<typeof PlayerSchema>;

export function baseCoreStats(strength: string, weakness: string): CoreStats {
  const stats = Object.fromEntries(CORE_STAT_KEYS.map((k) => [k, 5])) as CoreStats;
  if (strength in stats) (stats as Record<string, number>)[strength] = 8;
  if (weakness in stats) (stats as Record<string, number>)[weakness] = 2;
  return stats;
}

const PERSONALITY_BONUS: Record<(typeof PERSONALITY_ARCHETYPES)[number], Partial<CoreStats>> = {
  strategist: { intelligence: 2, deception: 1 },
  charmer: { charisma: 2, empathy: 1 },
  loner: { discipline: 2, perception: 1 },
  protector: { courage: 2, empathy: 1 },
  trickster: { deception: 2, agility: 1 },
  scholar: { intelligence: 2, discipline: 1 },
  fighter: { combat: 2, courage: 1 },
  observer: { perception: 2, intelligence: 1 },
};

export function applyPersonalityBonus(stats: CoreStats, personality: (typeof PERSONALITY_ARCHETYPES)[number]): CoreStats {
  const bonus = PERSONALITY_BONUS[personality];
  const next = { ...stats };
  for (const [k, v] of Object.entries(bonus)) {
    const key = k as keyof CoreStats;
    next[key] = Math.min(20, next[key] + (v ?? 0));
  }
  return next;
}

export function createPlayerFromCreator(input: CharacterCreatorInput): Player {
  const core = applyPersonalityBonus(baseCoreStats(input.strength, input.weakness), input.personality);
  const easy = input.difficulty === "story";
  return {
    name: input.name,
    pronouns: input.pronouns,
    personality: input.personality,
    strength: input.strength,
    weakness: input.weakness,
    background: input.background,
    appearance: input.appearance,
    world: input.world,
    difficulty: input.difficulty,
    core,
    elite: {
      academicScore: 50,
      classContribution: 0,
      reputation: 50,
      trust: 50,
      suspicion: 0,
      privatePoints: 1000,
      influence: 10,
      stress: easy ? 10 : 20,
    },
    aincrad: {
      level: 1,
      experience: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      strength: 10,
      defense: 10,
      swordSkill: 5,
      crafting: 0,
      col: 500,
      floorProgress: 1,
      threatLevel: 0,
    },
  };
}
