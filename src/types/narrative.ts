import { z } from "zod";
import { DIFFICULTY_MODES, PERSONALITY_ARCHETYPES, RELATIONSHIP_AXES, TimeOfDaySchema } from "./common";

/* ---------------------------------- Conditions --------------------------------- */

export const ConditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("minStat"), stat: z.string(), value: z.number() }),
  z.object({ type: z.literal("maxStat"), stat: z.string(), value: z.number() }),
  z.object({ type: z.literal("relationship"), npcId: z.string(), axis: z.enum(RELATIONSHIP_AXES), min: z.number() }),
  z.object({ type: z.literal("hasItem"), itemId: z.string(), quantity: z.number().default(1) }),
  z.object({ type: z.literal("questState"), questId: z.string(), state: z.enum(["not_started", "active", "complete", "failed"]) }),
  z.object({ type: z.literal("flag"), flag: z.string() }),
  z.object({ type: z.literal("missingFlag"), flag: z.string() }),
  z.object({ type: z.literal("timeOfDay"), time: TimeOfDaySchema }),
  z.object({ type: z.literal("difficulty"), difficulty: z.enum(DIFFICULTY_MODES) }),
  z.object({ type: z.literal("personality"), personality: z.enum(PERSONALITY_ARCHETYPES) }),
]);
export type Condition = z.infer<typeof ConditionSchema>;

/* ----------------------------------- Effects ------------------------------------ */

export const EffectSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("modifyStat"), stat: z.string(), delta: z.number() }),
  z.object({ type: z.literal("modifyRelationship"), npcId: z.string(), axis: z.enum(RELATIONSHIP_AXES), delta: z.number() }),
  z.object({ type: z.literal("addItem"), itemId: z.string(), quantity: z.number().default(1) }),
  z.object({ type: z.literal("removeItem"), itemId: z.string(), quantity: z.number().default(1) }),
  z.object({ type: z.literal("setFlag"), flag: z.string() }),
  z.object({ type: z.literal("clearFlag"), flag: z.string() }),
  z.object({ type: z.literal("startQuest"), questId: z.string() }),
  z.object({ type: z.literal("completeQuest"), questId: z.string(), outcome: z.string().optional() }),
  z.object({ type: z.literal("changeLocation"), mapId: z.string(), spawnId: z.string().optional() }),
  z.object({ type: z.literal("triggerBattle"), encounterId: z.string() }),
  z.object({ type: z.literal("sendMessage"), npcId: z.string(), messageId: z.string() }),
  z.object({ type: z.literal("unlockCodex"), entryId: z.string() }),
  z.object({ type: z.literal("changeClassPoints"), classId: z.string(), delta: z.number() }),
  z.object({ type: z.literal("changeReputation"), delta: z.number() }),
  z.object({ type: z.literal("goToScene"), sceneId: z.string(), nodeId: z.string().optional() }),
  z.object({ type: z.literal("unlockAchievement"), achievementId: z.string() }),
]);
export type Effect = z.infer<typeof EffectSchema>;

/* ---------------------------------- Dialogue ------------------------------------ */

export const ExpressionSchema = z.enum([
  "neutral",
  "smile",
  "laugh",
  "smirk",
  "frown",
  "angry",
  "shocked",
  "sad",
  "blush",
  "thinking",
  "cold",
  "worried",
  "determined",
]);
export type Expression = z.infer<typeof ExpressionSchema>;

export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  conditions: z.array(ConditionSchema).default([]),
  hiddenIfUnmet: z.boolean().default(false),
  requirementLabel: z.string().optional(),
  isBluff: z.boolean().default(false),
  isSilence: z.boolean().default(false),
  personalityHint: z.enum(PERSONALITY_ARCHETYPES).optional(),
  timerSeconds: z.number().optional(),
  effects: z.array(EffectSchema).default([]),
  goTo: z.string().optional(),
  importantChoice: z.boolean().default(false),
});
export type Choice = z.infer<typeof ChoiceSchema>;

export const DialogueLineSchema = z.object({
  id: z.string(),
  speakerId: z.string().optional(),
  speakerName: z.string().optional(),
  expression: ExpressionSchema.default("neutral"),
  text: z.string(),
  isInnerMonologue: z.boolean().default(false),
  isInterruption: z.boolean().default(false),
  soundCue: z.string().optional(),
  background: z.string().optional(),
  effects: z.array(EffectSchema).default([]),
  choices: z.array(ChoiceSchema).default([]),
  next: z.string().optional(),
  conditions: z.array(ConditionSchema).default([]),
});
export type DialogueLine = z.infer<typeof DialogueLineSchema>;

export const SceneSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  chapterId: z.string(),
  title: z.string(),
  startNode: z.string(),
  /** Ordered list of node ids to test (by their `conditions`) when re-entering a scene;
   * the first one whose conditions pass becomes the entry point. Falls back to `startNode`
   * if none match. Lets one scene definition serve "first visit" vs "revisit" content. */
  altEntryNodes: z.array(z.string()).default([]),
  background: z.string().optional(),
  nodes: z.array(DialogueLineSchema),
});
export type Scene = z.infer<typeof SceneSchema>;
