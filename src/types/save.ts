import { z } from "zod";
import { PlayerSchema } from "./character";
import { RelationshipStateSchema } from "./npc";
import { InventorySlotSchema } from "./item";
import { QuestProgressSchema } from "./quest";
import { SettingsSchema } from "./settings";

export const GameModeSchema = z.enum(["dialogue", "exploration", "combat", "device", "recap"]);
export type GameMode = z.infer<typeof GameModeSchema>;

export const SaveGameSchema = z.object({
  version: z.literal(1),
  slotId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  playtimeSeconds: z.number().default(0),
  chapterName: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  player: PlayerSchema,
  flags: z.array(z.string()).default([]),
  relationships: z.array(RelationshipStateSchema).default([]),
  inventory: z.array(InventorySlotSchema).default([]),
  quests: z.array(QuestProgressSchema).default([]),
  codexUnlocked: z.array(z.string()).default([]),
  achievementsUnlocked: z.array(z.string()).default([]),
  currentChapterId: z.string(),
  currentSceneId: z.string().optional(),
  currentNodeId: z.string().optional(),
  currentMapId: z.string().optional(),
  currentSpawnId: z.string().optional(),
  mode: GameModeSchema,
  guildId: z.string().optional(),
  partyMemberIds: z.array(z.string()).default([]),
  classId: z.string().optional(),
  timeOfDay: z.string().default("morning"),
  dayCount: z.number().default(1),
  safeZoneCheckpoint: z
    .object({ mapId: z.string(), spawnId: z.string(), chapterId: z.string(), sceneId: z.string().optional() })
    .optional(),
  dialogueHistory: z.array(z.object({ speaker: z.string(), text: z.string() })).default([]),
  messages: z
    .array(z.object({ id: z.string(), messageId: z.string(), npcId: z.string(), timestamp: z.number(), read: z.boolean().default(false) }))
    .default([]),
  choiceLog: z.array(z.object({ sceneId: z.string(), choiceId: z.string(), text: z.string() })).default([]),
  settings: SettingsSchema,
});
export type SaveGame = z.infer<typeof SaveGameSchema>;

export const SaveSlotSummarySchema = z.object({
  slotId: z.string(),
  chapterName: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  playerName: z.string(),
  levelOrRank: z.string(),
  playtimeSeconds: z.number(),
  updatedAt: z.number(),
  thumbnailGlyph: z.string(),
  thumbnailColor: z.string(),
});
export type SaveSlotSummary = z.infer<typeof SaveSlotSummarySchema>;
