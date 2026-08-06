import { z } from "zod";

export const AchievementDefinitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  hidden: z.boolean().default(false),
  worldId: z.enum(["elite-academy", "aincrad", "shared"]).default("shared"),
  icon: z.string().default("award"),
});
export type AchievementDefinition = z.infer<typeof AchievementDefinitionSchema>;

export const CodexEntrySchema = z.object({
  id: z.string(),
  category: z.enum(["character", "location", "term", "monster", "item", "guild", "class", "recap", "secret"]),
  title: z.string(),
  body: z.string(),
  worldId: z.enum(["elite-academy", "aincrad", "shared"]).default("shared"),
  unlockedByDefault: z.boolean().default(false),
});
export type CodexEntry = z.infer<typeof CodexEntrySchema>;
