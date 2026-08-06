import { z } from "zod";

/** Shared core stats every protagonist has, regardless of world. */
export const CORE_STAT_KEYS = [
  "intelligence",
  "charisma",
  "perception",
  "courage",
  "discipline",
  "empathy",
  "deception",
  "combat",
  "agility",
  "luck",
] as const;
export type CoreStatKey = (typeof CORE_STAT_KEYS)[number];

export const ELITE_STAT_KEYS = [
  "academicScore",
  "classContribution",
  "reputation",
  "trust",
  "suspicion",
  "privatePoints",
  "influence",
  "stress",
] as const;
export type EliteStatKey = (typeof ELITE_STAT_KEYS)[number];

export const AINCRAD_STAT_KEYS = [
  "level",
  "experience",
  "health",
  "maxHealth",
  "stamina",
  "maxStamina",
  "strength",
  "defense",
  "swordSkill",
  "crafting",
  "col",
  "floorProgress",
  "threatLevel",
] as const;
export type AincradStatKey = (typeof AINCRAD_STAT_KEYS)[number];

export const PERSONALITY_ARCHETYPES = [
  "strategist",
  "charmer",
  "loner",
  "protector",
  "trickster",
  "scholar",
  "fighter",
  "observer",
] as const;
export type PersonalityArchetype = (typeof PERSONALITY_ARCHETYPES)[number];

export const WORLD_IDS = ["elite-academy", "aincrad"] as const;
export type WorldId = (typeof WORLD_IDS)[number];

export const DIFFICULTY_MODES = ["story", "standard", "strategist", "survival"] as const;
export type DifficultyMode = (typeof DIFFICULTY_MODES)[number];

export const PronounSetSchema = z.enum(["she/her", "he/him", "they/them"]);
export type PronounSet = z.infer<typeof PronounSetSchema>;

export const TimeOfDaySchema = z.enum(["morning", "class", "lunch", "afternoon", "evening", "night"]);
export type TimeOfDay = z.infer<typeof TimeOfDaySchema>;

export const RELATIONSHIP_AXES = [
  "affection",
  "trust",
  "respect",
  "fear",
  "suspicion",
  "rivalry",
  "loyalty",
] as const;
export type RelationshipAxis = (typeof RELATIONSHIP_AXES)[number];

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
