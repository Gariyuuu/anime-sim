import type { EncounterDefinitionInput } from "@/types";

export const aincradEncounters: EncounterDefinitionInput[] = [
  /* Floor 1 field/dungeon */
  { id: "ai-enc-field1-wolves", worldId: "aincrad", name: "Timber Wolf Pack", enemyIds: ["en-timber-wolf", "en-timber-wolf"] },
  { id: "ai-enc-field1-imp", worldId: "aincrad", name: "Thicket Imp", enemyIds: ["en-thicket-imp"] },
  { id: "ai-enc-field1-boar", worldId: "aincrad", name: "Wild Boar", enemyIds: ["en-wild-boar"] },
  { id: "ai-enc-field1-serpent", worldId: "aincrad", name: "Marsh Serpent", enemyIds: ["en-marsh-serpent"] },
  { id: "ai-enc-field1-alpha", worldId: "aincrad", name: "Alpha Timberwolf", enemyIds: ["en-alpha-timberwolf"], victoryEffects: ["ai-flag-alpha-defeated"] },
  {
    id: "ai-enc-boss1",
    worldId: "aincrad",
    name: "Floor 1 Boss Raid — Sylvan Guardian",
    enemyIds: ["en-sylvan-guardian"],
    isBossRaid: true,
    preRaidPlanning: true,
    victoryEffects: ["ai-flag-floor1-cleared"],
    victorySceneId: "ai-scene-boss1-aftermath",
  },

  /* Floor 2 field/dungeon */
  { id: "ai-enc-field2-stalker", worldId: "aincrad", name: "Mist Stalker", enemyIds: ["en-mist-stalker"] },
  { id: "ai-enc-field2-spider", worldId: "aincrad", name: "Crag Spider", enemyIds: ["en-crag-spider"] },
  { id: "ai-enc-field2-hare", worldId: "aincrad", name: "Frost Hare", enemyIds: ["en-frost-hare"] },
  { id: "ai-enc-field2-wisp", worldId: "aincrad", name: "Bog Wisp", enemyIds: ["en-bog-wisp"] },
  { id: "ai-enc-field2-alpha", worldId: "aincrad", name: "Frostfang Alpha", enemyIds: ["en-frostfang-alpha"], victoryEffects: ["ai-flag-frostfang-defeated"] },
  {
    id: "ai-enc-boss2",
    worldId: "aincrad",
    name: "Floor 2 Boss Raid — Mistfallen Warden",
    enemyIds: ["en-mistfallen-warden"],
    isBossRaid: true,
    preRaidPlanning: true,
    victoryEffects: ["ai-flag-floor2-cleared"],
  },

  /* Floor 3 field/dungeon */
  { id: "ai-enc-field3-bat", worldId: "aincrad", name: "Cinder Bat", enemyIds: ["en-cinder-bat"] },
  { id: "ai-enc-field3-golem", worldId: "aincrad", name: "Ash Golem", enemyIds: ["en-ash-golem"] },
  { id: "ai-enc-field3-sentinel", worldId: "aincrad", name: "Molten Sentinel", enemyIds: ["en-molten-sentinel"], victoryEffects: ["ai-flag-sentinel-defeated"] },
  {
    id: "ai-enc-boss3",
    worldId: "aincrad",
    name: "Floor 3 Boss Raid — Ashen Hollow King",
    enemyIds: ["en-ashen-hollow-king"],
    isBossRaid: true,
    preRaidPlanning: true,
    victoryEffects: ["ai-flag-floor3-cleared"],
  },
];
