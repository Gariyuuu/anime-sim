import { z } from "zod";
import { ExpressionSchema } from "./narrative";
import { RELATIONSHIP_AXES } from "./common";
import { HAIRSTYLES, HAIR_COLORS, EYE_COLORS, SKIN_TONES } from "./character";

export const NpcRoleSchema = z.enum([
  "classmate",
  "rival",
  "mentor",
  "party-member",
  "guild-member",
  "shopkeeper",
  "authority",
  "romance",
  "neutral",
]);
export type NpcRole = z.infer<typeof NpcRoleSchema>;

export const NpcDefinitionSchema = z.object({
  id: z.string(),
  worldId: z.enum(["elite-academy", "aincrad"]),
  fullName: z.string(),
  shortName: z.string(),
  role: NpcRoleSchema,
  personality: z.string(),
  motivation: z.string(),
  secret: z.string(),
  strength: z.string(),
  weakness: z.string(),
  speechStyle: z.string(),
  portraitColor: z.string(),
  portraitGlyph: z.string(),
  /** Drives the procedural face portrait (`PortraitFace`) — same trait vocabulary as the
   * player's own character-creator `Appearance`, so NPC and player art stay consistent. */
  hairColor: z.enum(HAIR_COLORS),
  hairstyle: z.enum(HAIRSTYLES),
  eyeColor: z.enum(EYE_COLORS),
  skinTone: z.enum(SKIN_TONES),
  expressionsAvailable: z.array(ExpressionSchema).default(["neutral", "smile", "frown", "shocked"]),
  romanceable: z.boolean().default(false),
  canJoinParty: z.boolean().default(false),
  personalQuestId: z.string().optional(),
  codexUnlockedByDefault: z.boolean().default(false),
});
export type NpcDefinition = z.infer<typeof NpcDefinitionSchema>;

export const RelationshipStateSchema = z.object({
  npcId: z.string(),
  affection: z.number().default(0),
  trust: z.number().default(0),
  respect: z.number().default(0),
  fear: z.number().default(0),
  suspicion: z.number().default(0),
  rivalry: z.number().default(0),
  loyalty: z.number().default(0),
  knownSecrets: z.array(z.string()).default([]),
  sharedMemories: z.array(z.string()).default([]),
  mood: z.enum(["warm", "neutral", "cold", "tense", "hostile", "affectionate"]).default("neutral"),
  metPlayer: z.boolean().default(false),
});
export type RelationshipState = z.infer<typeof RelationshipStateSchema>;

export function freshRelationship(npcId: string): RelationshipState {
  return {
    npcId,
    affection: 0,
    trust: 0,
    respect: 0,
    fear: 0,
    suspicion: 0,
    rivalry: 0,
    loyalty: 0,
    knownSecrets: [],
    sharedMemories: [],
    mood: "neutral",
    metPlayer: false,
  };
}

export const RELATIONSHIP_AXIS_LIST = RELATIONSHIP_AXES;
