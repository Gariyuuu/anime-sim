import { z } from "zod";

export const ItemRaritySchema = z.enum(["common", "uncommon", "rare", "epic", "legendary"]);
export type ItemRarity = z.infer<typeof ItemRaritySchema>;

export const ItemSlotSchema = z.enum(["weapon", "armor", "gloves", "boots", "accessory", "none"]);
export type ItemSlot = z.infer<typeof ItemSlotSchema>;

export const ItemKindSchema = z.enum(["equipment", "consumable", "quest", "material"]);
export type ItemKind = z.infer<typeof ItemKindSchema>;

export const ItemDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  kind: ItemKindSchema,
  slot: ItemSlotSchema.default("none"),
  rarity: ItemRaritySchema.default("common"),
  value: z.number().default(0),
  icon: z.string().default("box"),
  passiveEffect: z.string().optional(),
  statBonuses: z.record(z.string(), z.number()).default({}),
  useEffect: z
    .object({
      healthRestore: z.number().optional(),
      staminaRestore: z.number().optional(),
      stressRelief: z.number().optional(),
      cureStatus: z.boolean().optional(),
    })
    .optional(),
});
export type ItemDefinition = z.infer<typeof ItemDefinitionSchema>;

export const InventorySlotSchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(0),
  equipped: z.boolean().default(false),
});
export type InventorySlot = z.infer<typeof InventorySlotSchema>;
