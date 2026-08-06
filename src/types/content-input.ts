import type { z } from "zod";
import type {
  NpcDefinitionSchema,
  RelationshipStateSchema,
} from "./npc";
import type { ItemDefinitionSchema } from "./item";
import type { QuestDefinitionSchema } from "./quest";
import type {
  MapDefinitionSchema,
  ChapterDefinitionSchema,
  FloorDefinitionSchema,
  GuildDefinitionSchema,
  ClassDefinitionSchema,
  InteractableSchema,
} from "./world";
import type { SceneSchema, DialogueLineSchema, ChoiceSchema } from "./narrative";
import type { AchievementDefinitionSchema, CodexEntrySchema } from "./achievements";
import type { SkillSchema, EnemyDefinitionSchema, EncounterDefinitionSchema } from "./combat";

/**
 * "Input" variants of content schemas: fields with a zod `.default()` become optional,
 * so hand-authored content files don't need to repeat every default value.
 * Content is parsed through the full schema (see content/registry.ts) before use,
 * which fills defaults and validates shape at load time.
 */
export type NpcDefinitionInput = z.input<typeof NpcDefinitionSchema>;
export type RelationshipStateInput = z.input<typeof RelationshipStateSchema>;
export type ItemDefinitionInput = z.input<typeof ItemDefinitionSchema>;
export type QuestDefinitionInput = z.input<typeof QuestDefinitionSchema>;
export type MapDefinitionInput = z.input<typeof MapDefinitionSchema>;
export type InteractableInput = z.input<typeof InteractableSchema>;
export type ChapterDefinitionInput = z.input<typeof ChapterDefinitionSchema>;
export type FloorDefinitionInput = z.input<typeof FloorDefinitionSchema>;
export type GuildDefinitionInput = z.input<typeof GuildDefinitionSchema>;
export type ClassDefinitionInput = z.input<typeof ClassDefinitionSchema>;
export type SceneInput = z.input<typeof SceneSchema>;
export type DialogueLineInput = z.input<typeof DialogueLineSchema>;
export type ChoiceInput = z.input<typeof ChoiceSchema>;
export type AchievementDefinitionInput = z.input<typeof AchievementDefinitionSchema>;
export type CodexEntryInput = z.input<typeof CodexEntrySchema>;
export type SkillInput = z.input<typeof SkillSchema>;
export type EnemyDefinitionInput = z.input<typeof EnemyDefinitionSchema>;
export type EncounterDefinitionInput = z.input<typeof EncounterDefinitionSchema>;
