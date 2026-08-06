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
    victorySceneId: "ai-scene-boss2-aftermath",
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
    victorySceneId: "ai-scene-boss3-aftermath",
  },
];

interface FloorEncounterSpec {
  floor: 4 | 5 | 6 | 7 | 8 | 9 | 10;
  bossName: string;
  common: [string, string];
  commonNames: [string, string];
  miniBoss: string;
  miniBossName: string;
  floorBoss: string;
}

const laterFloorSpecs: FloorEncounterSpec[] = [
  { floor: 4, bossName: "Verdant Warden", common: ["en-vine-stalker", "en-canopy-hawk"], commonNames: ["Vine Stalker", "Canopy Hawk"], miniBoss: "en-spire-ape", miniBossName: "Spire Ape", floorBoss: "en-verdant-warden" },
  { floor: 5, bossName: "Drowned Sovereign", common: ["en-marsh-eel", "en-bog-crawler"], commonNames: ["Marsh Eel", "Bog Crawler"], miniBoss: "en-causeway-broodmaw", miniBossName: "Causeway Broodmaw", floorBoss: "en-drowned-sovereign" },
  { floor: 6, bossName: "Golden Magnate", common: ["en-gilded-automaton", "en-counterfeit-wraith"], commonNames: ["Gilded Automaton", "Counterfeit Wraith"], miniBoss: "en-market-enforcer", miniBossName: "Market Enforcer", floorBoss: "en-golden-magnate" },
  { floor: 7, bossName: "Hollow Chorus", common: ["en-silent-wisp", "en-echo-shade"], commonNames: ["Silent Wisp", "Echo Shade"], miniBoss: "en-choir-conductor", miniBossName: "Choir Conductor", floorBoss: "en-hollow-chorus" },
  { floor: 8, bossName: "Iron Architect", common: ["en-maze-sentry", "en-rust-hound"], commonNames: ["Maze Sentry", "Rust Hound"], miniBoss: "en-labyrinth-keeper", miniBossName: "Labyrinth Keeper", floorBoss: "en-iron-architect" },
  { floor: 9, bossName: "Skybreak Sentinel", common: ["en-gale-serpent", "en-cloud-raptor"], commonNames: ["Gale Serpent", "Cloud Raptor"], miniBoss: "en-storm-harrier", miniBossName: "Storm Harrier", floorBoss: "en-skybreak-sentinel" },
  { floor: 10, bossName: "The Tenth Gatekeeper", common: ["en-gatekeeper-drone", "en-oathbound-knight"], commonNames: ["Gatekeeper Drone", "Oathbound Knight"], miniBoss: "en-gate-champion", miniBossName: "Gate Champion", floorBoss: "en-the-tenth-gatekeeper" },
];

const laterFloorEncounters: EncounterDefinitionInput[] = laterFloorSpecs.flatMap((spec) => [
  { id: `ai-enc-field${spec.floor}-a`, worldId: "aincrad", name: spec.commonNames[0], enemyIds: [spec.common[0]] },
  { id: `ai-enc-field${spec.floor}-b`, worldId: "aincrad", name: spec.commonNames[1], enemyIds: [spec.common[1]] },
  { id: `ai-enc-field${spec.floor}-miniboss`, worldId: "aincrad", name: spec.miniBossName, enemyIds: [spec.miniBoss], victoryEffects: [`ai-flag-floor${spec.floor}-miniboss-defeated`] },
  {
    id: `ai-enc-boss${spec.floor}`,
    worldId: "aincrad",
    name: `Floor ${spec.floor} Boss Raid — ${spec.bossName}`,
    enemyIds: [spec.floorBoss],
    isBossRaid: true,
    preRaidPlanning: true,
    victoryEffects: [`ai-flag-floor${spec.floor}-cleared`],
    victorySceneId: `ai-scene-boss${spec.floor}-aftermath`,
  },
]);

aincradEncounters.push(...laterFloorEncounters);
