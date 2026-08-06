import { z } from "zod";

export const QuestTypeSchema = z.enum([
  "main",
  "side",
  "character",
  "hidden",
  "guild",
  "collection",
  "investigation",
  "rescue",
]);
export type QuestType = z.infer<typeof QuestTypeSchema>;

export const QuestStateSchema = z.enum(["not_started", "active", "complete", "failed"]);
export type QuestState = z.infer<typeof QuestStateSchema>;

export const QuestObjectiveSchema = z.object({
  id: z.string(),
  text: z.string(),
  optional: z.boolean().default(false),
});
export type QuestObjective = z.infer<typeof QuestObjectiveSchema>;

export const QuestDefinitionSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  title: z.string(),
  type: QuestTypeSchema,
  giverNpcId: z.string().optional(),
  description: z.string(),
  objectives: z.array(QuestObjectiveSchema),
  hidden: z.boolean().default(false),
  rewardSummary: z.string().optional(),
});
export type QuestDefinition = z.infer<typeof QuestDefinitionSchema>;

export const QuestProgressSchema = z.object({
  questId: z.string(),
  state: QuestStateSchema,
  completedObjectiveIds: z.array(z.string()).default([]),
  outcome: z.string().optional(),
});
export type QuestProgress = z.infer<typeof QuestProgressSchema>;
