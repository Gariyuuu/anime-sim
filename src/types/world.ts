import { z } from "zod";

export const InteractableSchema = z.object({
  id: z.string(),
  kind: z.enum(["npc", "object", "door", "quest-marker", "hidden-item", "shop", "trigger", "transition", "monster", "puzzle-switch", "arena"]),
  x: z.number(),
  y: z.number(),
  label: z.string(),
  npcId: z.string().optional(),
  sceneId: z.string().optional(),
  itemId: z.string().optional(),
  targetMapId: z.string().optional(),
  targetSpawnId: z.string().optional(),
  requiresFlag: z.string().optional(),
  encounterId: z.string().optional(),
  respawns: z.boolean().default(true),
  hidden: z.boolean().default(false),
  glyph: z.string().default("circle"),
  /** `kind: "puzzle-switch"` only — which PuzzleDefinition this switch belongs to, and this
   * switch's 1-indexed position in that puzzle's required activation order. */
  puzzleId: z.string().optional(),
  puzzleOrder: z.number().optional(),
});
export type Interactable = z.infer<typeof InteractableSchema>;

export const PuzzleDefinitionSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  /** How many switches must be activated, in order, to solve this puzzle. */
  totalSwitches: z.number().int().min(2),
  /** Story flag set the moment the puzzle is solved — gate a door/interactable on it via
   * `requiresFlag`, exactly like any other flag-gated content. */
  successFlag: z.string(),
  hint: z.string().optional(),
  failMessage: z.string().default("Wrong order — the pattern resets."),
  successMessage: z.string().default("The pattern locks into place."),
  successAchievementId: z.string().optional(),
});
export type PuzzleDefinition = z.infer<typeof PuzzleDefinitionSchema>;

export const MapDefinitionSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  name: z.string(),
  widthTiles: z.number(),
  heightTiles: z.number(),
  tileSize: z.number().default(32),
  background: z.string().default("#e8e6df"),
  wallColor: z.string().default("#3a3630"),
  walls: z.array(z.tuple([z.number(), z.number()])).default([]),
  spawns: z.record(z.string(), z.tuple([z.number(), z.number()])),
  defaultSpawn: z.string(),
  interactables: z.array(InteractableSchema).default([]),
  ambientLabel: z.string().optional(),
});
export type MapDefinition = z.infer<typeof MapDefinitionSchema>;

export const ChapterOutcomeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  requiredFlags: z.array(z.string()).default([]),
});
export type ChapterOutcome = z.infer<typeof ChapterOutcomeSchema>;

export const ChapterDefinitionSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  index: z.number().default(1),
  title: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  startSceneId: z.string(),
  outcomes: z.array(ChapterOutcomeSchema),
  /** Story flag whose presence means this chapter's story content has been finished — checked by
   * the recap trigger. Each chapter's closing scene sets this via a `setFlag` effect. */
  completionFlag: z.string(),
  /** Chapter id to advance into once this one's recap is dismissed. Unset on the final chapter. */
  nextChapterId: z.string().optional(),
  locked: z.boolean().default(false),
});
export type ChapterDefinition = z.infer<typeof ChapterDefinitionSchema>;

export const FloorDefinitionSchema = z.object({
  id: z.string(),
  index: z.number(),
  name: z.string(),
  townMapId: z.string().optional(),
  fieldMapId: z.string().optional(),
  dungeonMapId: z.string().optional(),
  miniBossEnemyId: z.string().optional(),
  floorBossEnemyId: z.string().optional(),
  uniqueItemId: z.string().optional(),
  unlockFlag: z.string().optional(),
  locked: z.boolean().default(true),
  description: z.string(),
});
export type FloorDefinition = z.infer<typeof FloorDefinitionSchema>;

export const GuildDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  motto: z.string(),
  values: z.string(),
  leaderNpcId: z.string(),
  color: z.string(),
  description: z.string(),
});
export type GuildDefinition = z.infer<typeof GuildDefinitionSchema>;

export const ClassDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  points: z.number(),
  description: z.string(),
});
export type ClassDefinition = z.infer<typeof ClassDefinitionSchema>;
