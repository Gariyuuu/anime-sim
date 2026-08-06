import { z } from "zod";

export const SettingsSchema = z.object({
  musicVolume: z.number().min(0).max(1).default(0.6),
  sfxVolume: z.number().min(0).max(1).default(0.7),
  ambienceVolume: z.number().min(0).max(1).default(0.5),
  audioEnabled: z.boolean().default(true),
  dialogueSpeed: z.number().min(1).max(10).default(5),
  autoAdvance: z.boolean().default(false),
  showStatChecks: z.boolean().default(true),
  showRelationshipChanges: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  dyslexiaFont: z.boolean().default(false),
  textSize: z.enum(["small", "medium", "large"]).default("medium"),
  screenShake: z.boolean().default(true),
  minigameAssist: z.boolean().default(false),
  holdToSkipProtection: z.boolean().default(true),
  colorblindMode: z.boolean().default(false),
});
export type Settings = z.infer<typeof SettingsSchema>;

export function defaultSettings(): Settings {
  return SettingsSchema.parse({});
}
