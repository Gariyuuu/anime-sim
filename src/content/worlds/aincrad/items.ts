import type { ItemDefinitionInput } from "@/types";

export const aincradItems: ItemDefinitionInput[] = [
  /* ---------------------------------- Weapons ---------------------------------- */
  { id: "ai-item-training-sword", name: "Training Sword", description: "Standard-issue starter blade. Reliable, unremarkable.", kind: "equipment", slot: "weapon", rarity: "common", value: 50, icon: "sword", statBonuses: { attack: 3 } },
  { id: "ai-item-iron-blade", name: "Iron Blade", description: "A step up from the starter sword — better balance, better edge.", kind: "equipment", slot: "weapon", rarity: "uncommon", value: 300, icon: "sword", statBonuses: { attack: 7 } },
  { id: "ai-item-hunters-dagger", name: "Hunter's Dagger", description: "Light and fast. Rewards players who dodge more than they block.", kind: "equipment", slot: "weapon", rarity: "uncommon", value: 280, icon: "sword", statBonuses: { attack: 5, agility: 3 } },
  { id: "ai-item-vanguard-greatsword", name: "Vanguard Greatsword", description: "Heavy blade favored by the Iron Vanguard. Slow, devastating.", kind: "equipment", slot: "weapon", rarity: "rare", value: 900, icon: "sword", statBonuses: { attack: 14, agility: -3 } },
  { id: "ai-item-forest-fang", name: "Forest Fang", description: "A curved blade recovered from Floor 1's deep woods. Faintly warm to the touch.", kind: "equipment", slot: "weapon", rarity: "rare", value: 1100, icon: "sword", statBonuses: { attack: 12, swordSkill: 4 }, passiveEffect: "Bonus damage against beast-type enemies." },
  { id: "ai-item-mistguard-blade", name: "Mistguard Blade", description: "Floor 2's unique weapon drop. Wreathed in a faint chill.", kind: "equipment", slot: "weapon", rarity: "epic", value: 2200, icon: "sword", statBonuses: { attack: 18, defense: 4 }, passiveEffect: "Small chance to inflict Guard Break on hit." },

  /* ---------------------------------- Armor ---------------------------------- */
  { id: "ai-item-leather-vest", name: "Leather Vest", description: "Basic protection. Better than a hoodie.", kind: "equipment", slot: "armor", rarity: "common", value: 60, icon: "shirt", statBonuses: { defense: 4 } },
  { id: "ai-item-reinforced-coat", name: "Reinforced Coat", description: "Padded and plated in the right places.", kind: "equipment", slot: "armor", rarity: "uncommon", value: 350, icon: "shirt", statBonuses: { defense: 8 } },
  { id: "ai-item-vanguard-plate", name: "Vanguard Plate", description: "Guild-crafted heavy armor. Marked with the Iron Vanguard emblem whether you like it or not.", kind: "equipment", slot: "armor", rarity: "rare", value: 950, icon: "shirt", statBonuses: { defense: 15, agility: -2 } },
  { id: "ai-item-hearthlight-robe", name: "Hearthlight Robe", description: "Support-focused robe favored by Sachi's guild.", kind: "equipment", slot: "armor", rarity: "rare", value: 800, icon: "shirt", statBonuses: { defense: 9, maxStamina: 15 } },
  { id: "ai-item-floorguard-mail", name: "Floorguard Mail", description: "Floor 2 unique armor. Slows you down, but you'll live longer.", kind: "equipment", slot: "armor", rarity: "epic", value: 2100, icon: "shirt", statBonuses: { defense: 20 } },

  /* -------------------------------- Gloves / Boots -------------------------------- */
  { id: "ai-item-worn-gloves", name: "Worn Gloves", description: "Slightly better grip on your weapon.", kind: "equipment", slot: "gloves", rarity: "common", value: 40, icon: "hand", statBonuses: { attack: 1 } },
  { id: "ai-item-gripweave-gloves", name: "Gripweave Gloves", description: "Woven fiber gloves that reduce skill miss chance.", kind: "equipment", slot: "gloves", rarity: "uncommon", value: 220, icon: "hand", statBonuses: { swordSkill: 3 } },
  { id: "ai-item-scout-boots", name: "Scout Boots", description: "Light boots built for covering field distance fast.", kind: "equipment", slot: "boots", rarity: "common", value: 45, icon: "footprints", statBonuses: { agility: 3 } },
  { id: "ai-item-runners-greaves", name: "Runner's Greaves", description: "Favored by solo players who plan to be somewhere else very quickly.", kind: "equipment", slot: "boots", rarity: "uncommon", value: 260, icon: "footprints", statBonuses: { agility: 6 } },

  /* --------------------------------- Accessories --------------------------------- */
  { id: "ai-item-beginner-ring", name: "Beginner's Ring", description: "Handed out to every player who survives the tutorial.", kind: "equipment", slot: "accessory", rarity: "common", value: 30, icon: "circle", statBonuses: { luck: 2 } },
  { id: "ai-item-guild-pendant", name: "Guild Pendant", description: "Marks you as a member in good standing of whichever guild issued it.", kind: "equipment", slot: "accessory", rarity: "uncommon", value: 150, icon: "gem", statBonuses: { charisma: 2 } },

  /* -------------------------------- Consumables -------------------------------- */
  { id: "ai-item-healing-crystal", name: "Healing Crystal", description: "Standard-issue restorative. Every player carries a few.", kind: "consumable", slot: "none", rarity: "common", value: 30, icon: "gem", useEffect: { healthRestore: 40 } },
  { id: "ai-item-greater-healing-crystal", name: "Greater Healing Crystal", description: "A stronger restorative, harder to find in bulk.", kind: "consumable", slot: "none", rarity: "uncommon", value: 120, icon: "gem", useEffect: { healthRestore: 100 } },
  { id: "ai-item-stamina-draught", name: "Stamina Draught", description: "Bitter, effective, faintly metallic.", kind: "consumable", slot: "none", rarity: "common", value: 25, icon: "flask", useEffect: { staminaRestore: 50 } },
  { id: "ai-item-antidote-herb", name: "Antidote Herb", description: "Cures poison. Smells worse than the poison does.", kind: "consumable", slot: "none", rarity: "common", value: 20, icon: "leaf", useEffect: { cureStatus: true } },
  { id: "ai-item-field-rations", name: "Field Rations", description: "Simple cooked food. Restores a little of everything.", kind: "consumable", slot: "none", rarity: "common", value: 15, icon: "utensils", useEffect: { healthRestore: 10, staminaRestore: 20 } },
  { id: "ai-item-mei-stew", name: "Lisbeth's Stew", description: "Lisbeth's own recipe. Tastes like someone still cares whether you eat well.", kind: "consumable", slot: "none", rarity: "uncommon", value: 60, icon: "utensils", useEffect: { healthRestore: 30, staminaRestore: 30 } },
  { id: "ai-item-teleport-crystal", name: "Teleport Crystal", description: "One-way ticket back to the last town you registered at.", kind: "consumable", slot: "none", rarity: "uncommon", value: 200, icon: "sparkles" },
  { id: "ai-item-whetstone", name: "Whetstone", description: "Temporary attack boost for the next fight.", kind: "consumable", slot: "none", rarity: "common", value: 40, icon: "flask" },
  { id: "ai-item-guard-tonic", name: "Guard Tonic", description: "Temporary defense boost for the next fight.", kind: "consumable", slot: "none", rarity: "common", value: 40, icon: "flask" },
  { id: "ai-item-revival-charm", name: "Revival Charm", description: "Prevents a killing blow from being fatal — once. Extremely rare.", kind: "consumable", slot: "none", rarity: "legendary", value: 3000, icon: "sparkles", useEffect: { cureStatus: true } },

  /* --------------------------------- Materials --------------------------------- */
  { id: "ai-item-iron-ore", name: "Iron Ore", description: "Raw crafting material dropped by field enemies.", kind: "material", slot: "none", rarity: "common", value: 10, icon: "box" },
  { id: "ai-item-beast-hide", name: "Beast Hide", description: "Tough hide used in armor crafting.", kind: "material", slot: "none", rarity: "common", value: 15, icon: "box" },
  { id: "ai-item-frost-crystal", name: "Frost Crystal", description: "Floor 2 crafting material. Cold enough to hurt.", kind: "material", slot: "none", rarity: "uncommon", value: 40, icon: "box" },
  { id: "ai-item-warden-seal", name: "Warden's Seal", description: "Sealed behind three frost-locked levers in the Vaults. Whoever built this mechanism didn't want it found by accident.", kind: "equipment", slot: "accessory", rarity: "epic", value: 0, icon: "gem", statBonuses: { defense: 6, agility: 3 } },

  /* --------------------------------- Quest items --------------------------------- */
  { id: "ai-item-torans-tags", name: "Klein's Old Tags", description: "Dog tags from a guild that no longer exists. He never talks about them.", kind: "quest", slot: "none", rarity: "rare", value: 0, icon: "tag" },
  { id: "ai-item-hollow-locket", name: "Cracked Locket", description: "Found near the site of a wipe on Floor 1's field. It won't open.", kind: "quest", slot: "none", rarity: "rare", value: 0, icon: "lock" },
  { id: "ai-item-floor1-unique", name: "Sylvan Guardian's Core", description: "Unique drop from Floor 1's boss. Warm, faintly pulsing.", kind: "quest", slot: "none", rarity: "epic", value: 0, icon: "gem" },
];
