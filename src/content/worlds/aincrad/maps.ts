import type { MapDefinitionInput } from "@/types";

function borderWalls(w: number, h: number, extra: Array<[number, number]> = []): Array<[number, number]> {
  const walls: Array<[number, number]> = [];
  for (let x = 0; x < w; x++) {
    walls.push([x, 0]);
    walls.push([x, h - 1]);
  }
  for (let y = 0; y < h; y++) {
    walls.push([0, y]);
    walls.push([w - 1, y]);
  }
  return [...walls, ...extra];
}

export const aincradMaps: MapDefinitionInput[] = [
  /* ================================ FLOOR 1 ================================ */
  {
    id: "ai-map-town1",
    worldId: "aincrad",
    name: "Town of Beginnings",
    widthTiles: 18,
    heightTiles: 12,
    background: "#e6e2d6",
    wallColor: "#242424",
    walls: borderWalls(18, 12),
    spawns: { default: [9, 10], fromField: [9, 2], fromTraining: [3, 10] },
    defaultSpawn: "default",
    ambientLabel: "Stone plazas and half-finished banners. Nobody built this town to be lived in this long.",
    interactables: [
      { id: "door-field1", kind: "door", x: 9, y: 1, label: "To the Field", targetMapId: "ai-map-field1", targetSpawnId: "fromTown", glyph: "trees" },
      { id: "door-training", kind: "door", x: 2, y: 9, label: "Training Field", targetMapId: "ai-map-training-field", targetSpawnId: "fromTown", glyph: "target" },
      { id: "obj-inn", kind: "object", x: 4, y: 4, label: "The Last Light Inn", sceneId: "ai-scene-inn", glyph: "bed" },
      { id: "obj-blacksmith", kind: "shop", x: 8, y: 4, label: "Mei's Forge", npcId: "ai-mei", sceneId: "ai-scene-mei-forge", glyph: "hammer" },
      { id: "obj-mei-secret", kind: "trigger", x: 8, y: 3, label: "Ask Mei about her brother", sceneId: "ai-scene-mei-brother", requiresFlag: "ai-flag-mei-hint", glyph: "eye" },
      { id: "obj-item-shop", kind: "shop", x: 12, y: 4, label: "Item Shop", sceneId: "ai-scene-item-shop", glyph: "shopping-bag" },
      { id: "obj-tavern", kind: "object", x: 12, y: 8, label: "The Cracked Bell Tavern", sceneId: "ai-scene-tavern", glyph: "beer" },
      { id: "obj-guild-board", kind: "quest-marker", x: 15, y: 7, label: "Guild Recruitment Board", sceneId: "ai-scene-guild-board", glyph: "flag" },
      { id: "npc-kirei", kind: "npc", x: 6, y: 7, label: "Kirei Sanjo", npcId: "ai-kirei", sceneId: "ai-scene-kirei-intro", glyph: "zap" },
      { id: "npc-kirei-secret", kind: "trigger", x: 6, y: 6, label: "Talk to Kirei privately", sceneId: "ai-scene-kirei-secret", requiresFlag: "ai-flag-met-kirei", glyph: "eye" },
      { id: "npc-toran", kind: "npc", x: 10, y: 7, label: "Toran Voss", npcId: "ai-toran", sceneId: "ai-scene-toran-intro", glyph: "shield" },
      { id: "npc-hollow", kind: "npc", x: 15, y: 3, label: "\"Hollow\"", npcId: "ai-hollow", sceneId: "ai-scene-hollow-intro", glyph: "user-x" },
      { id: "npc-archivist", kind: "npc", x: 9, y: 6, label: "Archivist", npcId: "ai-arch", sceneId: "ai-scene-archivist-intro", glyph: "sparkles" },
    ],
  },
  {
    id: "ai-map-training-field",
    worldId: "aincrad",
    name: "Training Field",
    widthTiles: 12,
    heightTiles: 9,
    background: "#dde3d2",
    walls: borderWalls(12, 9),
    spawns: { fromTown: [6, 7] },
    defaultSpawn: "fromTown",
    ambientLabel: "Practice dummies and a bored-looking system NPC running the tutorial loop.",
    interactables: [
      { id: "obj-tutorial", kind: "trigger", x: 6, y: 3, label: "Begin Training Quest", sceneId: "ai-scene-tutorial-quest", glyph: "target" },
    ],
  },
  {
    id: "ai-map-field1",
    worldId: "aincrad",
    name: "Floor 1 Field — Sylvan Threshold",
    widthTiles: 20,
    heightTiles: 14,
    background: "#d9e0cc",
    walls: borderWalls(20, 14, [[10, 6], [11, 6], [10, 7], [9, 9], [10, 9], [11, 9]]),
    spawns: { fromTown: [10, 12], fromDungeon: [16, 2] },
    defaultSpawn: "fromTown",
    ambientLabel: "Sunlight through the canopy. Somewhere close, something is watching.",
    interactables: [
      { id: "mon-wolves", kind: "monster", x: 6, y: 8, label: "Timber Wolf pack", encounterId: "ai-enc-field1-wolves", glyph: "paw-print" },
      { id: "mon-imp", kind: "monster", x: 14, y: 9, label: "Thicket Imp", encounterId: "ai-enc-field1-imp", glyph: "sprout" },
      { id: "mon-boar", kind: "monster", x: 4, y: 4, label: "Wild Boar", encounterId: "ai-enc-field1-boar", glyph: "footprints" },
      { id: "mon-serpent", kind: "monster", x: 16, y: 5, label: "Marsh Serpent", encounterId: "ai-enc-field1-serpent", glyph: "wind" },
      { id: "npc-hollow-field", kind: "npc", x: 3, y: 11, label: "\"Hollow\"", npcId: "ai-hollow", sceneId: "ai-scene-hollow-field", requiresFlag: "ai-flag-met-hollow", glyph: "user-x" },
      { id: "hidden-locket", kind: "hidden-item", x: 3, y: 12, label: "Something half-buried in the dirt", itemId: "ai-item-hollow-locket", hidden: true, glyph: "lock" },
      { id: "npc-hollow-recruit", kind: "trigger", x: 3, y: 10, label: "Talk to Hollow about the locket", sceneId: "ai-scene-hollow-recruit", requiresFlag: "ai-flag-hollow-wipe-mentioned", glyph: "heart" },
      { id: "hidden-shrine", kind: "trigger", x: 18, y: 11, label: "A clearing that isn't on the map", sceneId: "ai-scene-hidden-shrine", hidden: true, glyph: "sparkles" },
      { id: "door-dungeon1", kind: "door", x: 17, y: 2, label: "Dungeon Entrance", targetMapId: "ai-map-dungeon1", targetSpawnId: "fromField", glyph: "door-open" },
      { id: "door-town1", kind: "door", x: 10, y: 13, label: "Back to Town", targetMapId: "ai-map-town1", targetSpawnId: "fromField", glyph: "chevrons-down" },
    ],
  },
  {
    id: "ai-map-dungeon1",
    worldId: "aincrad",
    name: "Floor 1 Dungeon — The Root Halls",
    widthTiles: 16,
    heightTiles: 12,
    background: "#c7c2b0",
    wallColor: "#1a1a1a",
    walls: borderWalls(16, 12, [[8, 4], [8, 5], [8, 6], [8, 7]]),
    spawns: { fromField: [8, 10] },
    defaultSpawn: "fromField",
    ambientLabel: "Roots thick as pillars. The air smells like wet stone.",
    interactables: [
      { id: "mon-dungeon-wolf", kind: "monster", x: 4, y: 6, label: "Timber Wolf", encounterId: "ai-enc-field1-wolves", glyph: "paw-print" },
      { id: "mon-dungeon-boar", kind: "monster", x: 12, y: 6, label: "Wild Boar", encounterId: "ai-enc-field1-boar", glyph: "footprints" },
      { id: "mon-alpha", kind: "monster", x: 8, y: 2, label: "Alpha Timberwolf", encounterId: "ai-enc-field1-alpha", glyph: "paw-print" },
      { id: "door-boss1", kind: "door", x: 8, y: 1, label: "Boss Chamber", targetMapId: "ai-map-boss1", targetSpawnId: "fromDungeon", requiresFlag: "ai-flag-alpha-defeated", glyph: "door-open" },
      { id: "door-field1-back", kind: "door", x: 8, y: 11, label: "Back to the Field", targetMapId: "ai-map-field1", targetSpawnId: "fromDungeon", glyph: "chevrons-down" },
    ],
  },
  {
    id: "ai-map-boss1",
    worldId: "aincrad",
    name: "Floor 1 Boss Chamber — The Grove Heart",
    widthTiles: 12,
    heightTiles: 10,
    background: "#b8c4a8",
    walls: borderWalls(12, 10),
    spawns: { fromDungeon: [6, 8] },
    defaultSpawn: "fromDungeon",
    ambientLabel: "A vast round chamber lit by bioluminescent moss. This is where Floor 1 ends, one way or another.",
    interactables: [
      { id: "obj-raid-prep", kind: "trigger", x: 6, y: 6, label: "Prepare for the Boss Raid", sceneId: "ai-scene-boss1-prep", glyph: "alert-triangle" },
    ],
  },

  /* ================================ FLOOR 2 ================================ */
  {
    id: "ai-map-town2",
    worldId: "aincrad",
    name: "Mistfallen Landing",
    widthTiles: 14,
    heightTiles: 10,
    background: "#dbe2e6",
    walls: borderWalls(14, 10),
    spawns: { default: [7, 8], fromField: [7, 1] },
    defaultSpawn: "default",
    ambientLabel: "A smaller, colder town. Fewer players made it this far.",
    interactables: [
      { id: "door-field2", kind: "door", x: 7, y: 1, label: "To the Field", targetMapId: "ai-map-field2", targetSpawnId: "fromTown", glyph: "trees" },
      { id: "obj-item-shop-2", kind: "shop", x: 4, y: 5, label: "Item Shop", sceneId: "ai-scene-item-shop", glyph: "shopping-bag" },
      { id: "obj-inn-2", kind: "object", x: 10, y: 5, label: "Frostkeep Inn", sceneId: "ai-scene-inn", glyph: "bed" },
      { id: "obj-kirei-floor2", kind: "trigger", x: 3, y: 3, label: "Kirei", sceneId: "ai-scene-floor2-kirei-nerves", requiresFlag: "ai-flag-floor2-arrived", glyph: "zap" },
      { id: "obj-toran-floor2", kind: "trigger", x: 11, y: 3, label: "Toran", sceneId: "ai-scene-floor2-toran-read", requiresFlag: "ai-flag-floor2-arrived", glyph: "shield" },
      { id: "obj-nell-floor2", kind: "trigger", x: 6, y: 7, label: "Nell", sceneId: "ai-scene-floor2-nell-check", requiresFlag: "ai-flag-floor2-arrived", glyph: "leaf" },
      { id: "obj-hollow-floor2", kind: "trigger", x: 2, y: 8, label: "Hollow", sceneId: "ai-scene-floor2-hollow-warning", requiresFlag: "ai-flag-floor2-clue-toran", glyph: "user-x" },
    ],
  },
  {
    id: "ai-map-field2",
    worldId: "aincrad",
    name: "Floor 2 Field — Mistfallen Reach",
    widthTiles: 16,
    heightTiles: 12,
    background: "#c9d2d6",
    walls: borderWalls(16, 12),
    spawns: { fromTown: [8, 10], fromDungeon: [13, 2] },
    defaultSpawn: "fromTown",
    ambientLabel: "Mist so thick you can lose a party member three feet away.",
    interactables: [
      { id: "mon-stalker", kind: "monster", x: 5, y: 6, label: "Mist Stalker", encounterId: "ai-enc-field2-stalker", glyph: "eye-off" },
      { id: "mon-spider", kind: "monster", x: 11, y: 7, label: "Crag Spider", encounterId: "ai-enc-field2-spider", glyph: "bug" },
      { id: "mon-hare", kind: "monster", x: 3, y: 3, label: "Frost Hare", encounterId: "ai-enc-field2-hare", glyph: "footprints" },
      { id: "mon-wisp", kind: "monster", x: 12, y: 4, label: "Bog Wisp", encounterId: "ai-enc-field2-wisp", glyph: "flame" },
      { id: "hidden-cache", kind: "hidden-item", x: 14, y: 10, label: "Ice-crusted supply crate", itemId: "ai-item-frost-crystal", hidden: true, glyph: "box" },
      { id: "door-dungeon2", kind: "door", x: 14, y: 2, label: "Dungeon Entrance", targetMapId: "ai-map-dungeon2", targetSpawnId: "fromField", glyph: "door-open" },
      { id: "door-town2", kind: "door", x: 8, y: 11, label: "Back to Town", targetMapId: "ai-map-town2", targetSpawnId: "fromField", glyph: "chevrons-down" },
    ],
  },
  {
    id: "ai-map-dungeon2",
    worldId: "aincrad",
    name: "Floor 2 Dungeon — The Frost Vaults",
    widthTiles: 14,
    heightTiles: 10,
    background: "#b8c2c9",
    walls: borderWalls(14, 10, [[7, 4], [7, 5]]),
    spawns: { fromField: [7, 8] },
    defaultSpawn: "fromField",
    ambientLabel: "Frozen corridors. Every footstep echoes twice.",
    interactables: [
      { id: "mon-vault-spider", kind: "monster", x: 4, y: 5, label: "Crag Spider", encounterId: "ai-enc-field2-spider", glyph: "bug" },
      { id: "mon-frostfang", kind: "monster", x: 7, y: 2, label: "Frostfang Alpha", encounterId: "ai-enc-field2-alpha", glyph: "paw-print" },
      { id: "obj-vault-hint", kind: "object", x: 7, y: 7, label: "Frost-etched instructions", sceneId: "ai-scene-vault-hint", glyph: "scroll" },
      { id: "switch-vault-rime", kind: "puzzle-switch", x: 2, y: 3, label: "Frost Lever (rime-covered)", puzzleId: "ai-puzzle-vaults", puzzleOrder: 1, glyph: "snowflake" },
      { id: "switch-vault-cracked", kind: "puzzle-switch", x: 11, y: 3, label: "Frost Lever (cracked)", puzzleId: "ai-puzzle-vaults", puzzleOrder: 2, glyph: "snowflake" },
      { id: "switch-vault-untouched", kind: "puzzle-switch", x: 5, y: 8, label: "Frost Lever (untouched)", puzzleId: "ai-puzzle-vaults", puzzleOrder: 3, glyph: "snowflake" },
      {
        id: "hidden-warden-seal",
        kind: "hidden-item",
        x: 7,
        y: 3,
        label: "A frost-sealed compartment, now open",
        itemId: "ai-item-warden-seal",
        hidden: true,
        requiresFlag: "ai-flag-vault-unlocked",
        glyph: "gem",
      },
      { id: "door-boss2", kind: "door", x: 7, y: 1, label: "Boss Chamber", targetMapId: "ai-map-boss2", targetSpawnId: "fromDungeon", requiresFlag: "ai-flag-frostfang-defeated", glyph: "door-open" },
    ],
  },
  {
    id: "ai-map-boss2",
    worldId: "aincrad",
    name: "Floor 2 Boss Chamber — The Frozen Court",
    widthTiles: 12,
    heightTiles: 9,
    background: "#a8b8c4",
    walls: borderWalls(12, 9),
    spawns: { fromDungeon: [6, 7] },
    defaultSpawn: "fromDungeon",
    ambientLabel: "A cracked throne of ice sits at the chamber's center. Nobody sits there anymore.",
    interactables: [
      { id: "obj-raid-prep-2", kind: "trigger", x: 6, y: 5, label: "Prepare for the Boss Raid", sceneId: "ai-scene-boss2-prep", glyph: "alert-triangle" },
    ],
  },

  /* ================================ FLOOR 3 ================================ */
  {
    id: "ai-map-town3",
    worldId: "aincrad",
    name: "Ashen Hollow Settlement",
    widthTiles: 13,
    heightTiles: 9,
    background: "#ddd0c4",
    walls: borderWalls(13, 9),
    spawns: { default: [6, 7], fromField: [6, 1] },
    defaultSpawn: "default",
    ambientLabel: "Built into the rock itself, half to survive the heat, half out of superstition.",
    interactables: [
      { id: "door-field3", kind: "door", x: 6, y: 1, label: "To the Field", targetMapId: "ai-map-field3", targetSpawnId: "fromTown", glyph: "trees" },
      { id: "obj-item-shop-3", kind: "shop", x: 3, y: 4, label: "Item Shop", sceneId: "ai-scene-item-shop", glyph: "shopping-bag" },
      { id: "obj-mei-floor3", kind: "trigger", x: 9, y: 3, label: "Mei", sceneId: "ai-scene-floor3-mei-heat", requiresFlag: "ai-flag-floor3-arrived", glyph: "hammer" },
      { id: "obj-hollow-floor3", kind: "trigger", x: 2, y: 6, label: "Hollow", sceneId: "ai-scene-floor3-hollow-distance", requiresFlag: "ai-flag-floor3-arrived", glyph: "user-x" },
      { id: "obj-nell-floor3", kind: "trigger", x: 10, y: 6, label: "Nell", sceneId: "ai-scene-floor3-nell-vigil", requiresFlag: "ai-flag-floor2-met-nell", glyph: "leaf" },
    ],
  },
  {
    id: "ai-map-field3",
    worldId: "aincrad",
    name: "Floor 3 Field — Ashen Hollow",
    widthTiles: 15,
    heightTiles: 11,
    background: "#c9b8a8",
    walls: borderWalls(15, 11),
    spawns: { fromTown: [7, 9], fromDungeon: [12, 2] },
    defaultSpawn: "fromTown",
    ambientLabel: "Heat shimmers over cracked rock. Distant lit candles line the dungeon path.",
    interactables: [
      { id: "mon-bat", kind: "monster", x: 4, y: 6, label: "Cinder Bat", encounterId: "ai-enc-field3-bat", glyph: "flame" },
      { id: "mon-golem", kind: "monster", x: 10, y: 6, label: "Ash Golem", encounterId: "ai-enc-field3-golem", glyph: "mountain" },
      { id: "vigil-candles", kind: "trigger", x: 12, y: 8, label: "A row of lit candles", sceneId: "ai-scene-vigil", glyph: "flame" },
      { id: "door-dungeon3", kind: "door", x: 13, y: 2, label: "Dungeon Entrance", targetMapId: "ai-map-dungeon3", targetSpawnId: "fromField", glyph: "door-open" },
      { id: "door-town3", kind: "door", x: 7, y: 10, label: "Back to Town", targetMapId: "ai-map-town3", targetSpawnId: "fromField", glyph: "chevrons-down" },
    ],
  },
  {
    id: "ai-map-dungeon3",
    worldId: "aincrad",
    name: "Floor 3 Dungeon — The Cinder Depths",
    widthTiles: 13,
    heightTiles: 9,
    background: "#b8a494",
    walls: borderWalls(13, 9, [[6, 4]]),
    spawns: { fromField: [6, 7] },
    defaultSpawn: "fromField",
    ambientLabel: "Heat radiates from the walls themselves.",
    interactables: [
      { id: "mon-sentinel", kind: "monster", x: 6, y: 2, label: "Molten Sentinel", encounterId: "ai-enc-field3-sentinel", glyph: "flame" },
      { id: "door-boss3", kind: "door", x: 6, y: 1, label: "Boss Chamber", targetMapId: "ai-map-boss3", targetSpawnId: "fromDungeon", requiresFlag: "ai-flag-sentinel-defeated", glyph: "door-open" },
    ],
  },
  {
    id: "ai-map-boss3",
    worldId: "aincrad",
    name: "Floor 3 Boss Chamber — The Hollow Throne",
    widthTiles: 12,
    heightTiles: 9,
    background: "#a89484",
    walls: borderWalls(12, 9),
    spawns: { fromDungeon: [6, 7] },
    defaultSpawn: "fromDungeon",
    ambientLabel: "A throne of fused ash and old blades, some still bearing player guild crests.",
    interactables: [
      { id: "obj-raid-prep-3", kind: "trigger", x: 6, y: 5, label: "Prepare for the Boss Raid", sceneId: "ai-scene-boss3-prep", glyph: "alert-triangle" },
    ],
  },
];

/* ============================ FLOORS 4-10 (generated) ============================ */

interface LaterFloorMapSpec {
  floor: number;
  townName: string;
  townAmbient: string;
  townBg: string;
  fieldName: string;
  fieldAmbient: string;
  fieldBg: string;
  npcId: string;
  npcName: string;
  npcGlyph: string;
  commonA: string;
  commonB: string;
  miniBoss: string;
  miniBossLabel: string;
}

const laterFloorMapSpecs: LaterFloorMapSpec[] = [
  { floor: 4, townName: "Canopy Landing", townAmbient: "A town built into the spire's first great branch. The ground floor hasn't seen sunlight in weeks.", townBg: "#dde6d2", fieldName: "Floor 4 — Verdant Spire", fieldAmbient: "The spire climbs out of sight. Rope bridges sway between platforms that shouldn't hold as much weight as they do.", fieldBg: "#c9d9b8", npcId: "ai-sena", npcName: "Sena Kurogane", npcGlyph: "mountain-snow", commonA: "ai-enc-field4-a", commonB: "ai-enc-field4-b", miniBoss: "ai-enc-field4-miniboss", miniBossLabel: "Spire Ape" },
  { floor: 5, townName: "Causeway Landing", townAmbient: "Stilted buildings over black water. Everything smells like salt and old rope.", townBg: "#d2dee2", fieldName: "Floor 5 — The Drowned Causeway", fieldAmbient: "A stone road half-swallowed by a swamp that was never supposed to be here.", fieldBg: "#b8ccd2", npcId: "ai-bram", npcName: "Bram Oyelaran", npcGlyph: "anchor", commonA: "ai-enc-field5-a", commonB: "ai-enc-field5-b", miniBoss: "ai-enc-field5-miniboss", miniBossLabel: "Causeway Broodmaw" },
  { floor: 6, townName: "Gilded Quarter", townAmbient: "The wealthiest town yet built in Aincrad. Every storefront is real col, spent on something that doesn't matter anymore.", townBg: "#e6ddc4", fieldName: "Floor 6 — The Exchange District", fieldAmbient: "Market stalls stretch farther than any single player has ever walked in one day.", fieldBg: "#d4c8a0", npcId: "ai-iris", npcName: "Iris Vantille", npcGlyph: "coins", commonA: "ai-enc-field6-a", commonB: "ai-enc-field6-b", miniBoss: "ai-enc-field6-miniboss", miniBossLabel: "Market Enforcer" },
  { floor: 7, townName: "Rest Stop (Unnamed)", townAmbient: "Nobody agreed on a name for this town. Most players don't stay long enough to suggest one.", townBg: "#dcdce4", fieldName: "Floor 7 — Hollow Choir", fieldAmbient: "Dead silent. Even your own footsteps sound like they're coming from somewhere else.", fieldBg: "#c4c4d4", npcId: "ai-choirkeeper", npcName: "The Choirkeeper", npcGlyph: "music", commonA: "ai-enc-field7-a", commonB: "ai-enc-field7-b", miniBoss: "ai-enc-field7-miniboss", miniBossLabel: "Choir Conductor" },
  { floor: 8, townName: "Maze Camp", townAmbient: "A cluster of tents just outside the maze entrance. Every wall here is chalked with somebody's failed route.", townBg: "#dcdcdc", fieldName: "Floor 8 — The Iron Maze", fieldAmbient: "Corridors that rearrange when you're not looking directly at them. Probably.", fieldBg: "#c8c8c8", npcId: "ai-doc-renner", npcName: "Doc Renner", npcGlyph: "compass", commonA: "ai-enc-field8-a", commonB: "ai-enc-field8-b", miniBoss: "ai-enc-field8-miniboss", miniBossLabel: "Labyrinth Keeper" },
  { floor: 9, townName: "Skybreak Landing", townAmbient: "The highest town in this slice of Aincrad. On a clear day, you can just make out the Town of Beginnings below.", townBg: "#d4e2ec", fieldName: "Floor 9 — Skybreak Terrace", fieldAmbient: "Wind strong enough to knock a careless player off the terrace's edge.", fieldBg: "#c0d6e6", npcId: "ai-wren", npcName: "Wren Castellan", npcGlyph: "feather", commonA: "ai-enc-field9-a", commonB: "ai-enc-field9-b", miniBoss: "ai-enc-field9-miniboss", miniBossLabel: "Storm Harrier" },
  { floor: 10, townName: "Gatewatch", townAmbient: "The staging town for every party that's attempted the Tenth Gate. The mood here is quieter than anywhere else in Aincrad.", townBg: "#dcd4cc", fieldName: "Floor 10 — The Tenth Gate", fieldAmbient: "A vast stone approach leading to a gate that hasn't opened for anyone yet.", fieldBg: "#c8bcae", npcId: "ai-ilyana", npcName: "Ilyana Vasko", npcGlyph: "flag", commonA: "ai-enc-field10-a", commonB: "ai-enc-field10-b", miniBoss: "ai-enc-field10-miniboss", miniBossLabel: "Gate Champion" },
];

const laterFloorMaps: MapDefinitionInput[] = laterFloorMapSpecs.flatMap((spec): MapDefinitionInput[] => [
  {
    id: `ai-map-town${spec.floor}`,
    worldId: "aincrad",
    name: spec.townName,
    widthTiles: 12,
    heightTiles: 9,
    background: spec.townBg,
    walls: borderWalls(12, 9),
    spawns: { default: [6, 7], fromField: [6, 1] },
    defaultSpawn: "default",
    ambientLabel: spec.townAmbient,
    interactables: [
      { id: "door-field", kind: "door", x: 6, y: 1, label: "To the Field", targetMapId: `ai-map-field${spec.floor}`, targetSpawnId: "fromTown", glyph: "trees" },
      { id: "obj-item-shop", kind: "shop", x: 3, y: 4, label: "Item Shop", sceneId: "ai-scene-item-shop", glyph: "shopping-bag" },
      { id: "obj-inn", kind: "object", x: 9, y: 4, label: "Inn", sceneId: "ai-scene-inn", glyph: "bed" },
      { id: "npc-local", kind: "npc", x: 6, y: 5, label: spec.npcName, npcId: spec.npcId, sceneId: `ai-scene-floor${spec.floor}-npc-intro`, glyph: spec.npcGlyph },
    ],
  },
  {
    id: `ai-map-field${spec.floor}`,
    worldId: "aincrad",
    name: spec.fieldName,
    widthTiles: 17,
    heightTiles: 12,
    background: spec.fieldBg,
    wallColor: "#1a1a1a",
    walls: borderWalls(17, 12),
    spawns: { fromTown: [8, 10] },
    defaultSpawn: "fromTown",
    ambientLabel: spec.fieldAmbient,
    interactables: [
      { id: "mon-a", kind: "monster", x: 5, y: 7, label: "Field encounter", encounterId: spec.commonA, glyph: "swords" },
      { id: "mon-b", kind: "monster", x: 11, y: 6, label: "Field encounter", encounterId: spec.commonB, glyph: "swords" },
      { id: "mon-c", kind: "monster", x: 4, y: 3, label: "Field encounter", encounterId: spec.commonA, glyph: "swords" },
      { id: "mon-miniboss", kind: "monster", x: 13, y: 3, label: spec.miniBossLabel, encounterId: spec.miniBoss, glyph: "skull" },
      { id: "obj-raid-prep", kind: "trigger", x: 8, y: 2, label: "Prepare for the Boss Raid", sceneId: `ai-scene-boss${spec.floor}-prep`, requiresFlag: `ai-flag-floor${spec.floor}-miniboss-defeated`, glyph: "alert-triangle" },
      { id: "door-town", kind: "door", x: 8, y: 11, label: "Back to Town", targetMapId: `ai-map-town${spec.floor}`, targetSpawnId: "fromField", glyph: "chevrons-down" },
    ],
  },
]);

aincradMaps.push(...laterFloorMaps);

// Patch: Floor 10's town gets an extra trigger to recruit Ilyana once her secret is known.
const town10 = aincradMaps.find((m) => m.id === "ai-map-town10");
if (town10) {
  town10.interactables = [
    ...(town10.interactables ?? []),
    {
      id: "npc-ilyana-join",
      kind: "trigger",
      x: 4,
      y: 5,
      label: "Ask Ilyana to join the raid",
      sceneId: "ai-scene-ilyana-join",
      requiresFlag: "ai-flag-ilyana-secret",
      glyph: "user-plus",
    },
  ];
}

// Patch: additional traveling-cast beat/hidden scenes added to floors 4-10 town maps during the
// chapter-deepening pass. Kept as post-generation patches (matching the Ilyana pattern above)
// rather than folded into `laterFloorMapSpecs` since each floor's extra interactables differ.
function patchTown(floor: number, extra: import("@/types").InteractableInput[]) {
  const town = aincradMaps.find((m) => m.id === `ai-map-town${floor}`);
  if (town) town.interactables = [...(town.interactables ?? []), ...extra];
}

patchTown(4, [
  { id: "obj-kirei-floor4", kind: "trigger", x: 3, y: 3, label: "Kirei", sceneId: "ai-scene-floor4-kirei-vertigo", requiresFlag: "ai-flag-floor4-arrived", glyph: "zap" },
  { id: "obj-toran-floor4", kind: "trigger", x: 9, y: 3, label: "Toran", sceneId: "ai-scene-floor4-toran-legacy", requiresFlag: "ai-flag-floor4-arrived", glyph: "shield" },
  { id: "obj-guard-reveal-floor4", kind: "trigger", x: 2, y: 7, label: "Toran, alone", sceneId: "ai-scene-floor4-guard-reveal", requiresFlag: "ai-flag-sena-secret", glyph: "shield" },
]);

patchTown(5, [
  { id: "obj-kirei-floor5", kind: "trigger", x: 3, y: 3, label: "Kirei", sceneId: "ai-scene-floor5-kirei-scan", requiresFlag: "ai-flag-floor5-arrived", glyph: "zap" },
  { id: "obj-hollow-floor5", kind: "trigger", x: 9, y: 3, label: "Hollow", sceneId: "ai-scene-floor5-hollow-water", requiresFlag: "ai-flag-floor5-arrived", glyph: "user-x" },
  { id: "obj-hollow-open-floor5", kind: "trigger", x: 2, y: 7, label: "Hollow, alone", sceneId: "ai-scene-floor5-hollow-open", requiresFlag: "ai-flag-bram-secret", glyph: "user-x" },
]);

patchTown(6, [
  { id: "obj-kirei-floor6", kind: "trigger", x: 3, y: 3, label: "Kirei", sceneId: "ai-scene-floor6-kirei-market", requiresFlag: "ai-flag-floor6-arrived", glyph: "zap" },
  { id: "obj-nell-floor6", kind: "trigger", x: 9, y: 3, label: "Nell", sceneId: "ai-scene-floor6-nell-guild-funds", requiresFlag: "ai-flag-floor6-arrived", glyph: "leaf" },
  { id: "obj-iris-followup-floor6", kind: "trigger", x: 2, y: 7, label: "Iris, off the clock", sceneId: "ai-scene-floor6-iris-followup", requiresFlag: "ai-flag-iris-noticed", glyph: "coins" },
]);

patchTown(7, [
  { id: "obj-toran-floor7", kind: "trigger", x: 3, y: 3, label: "Toran", sceneId: "ai-scene-floor7-toran-quiet", requiresFlag: "ai-flag-floor7-arrived", glyph: "shield" },
  { id: "obj-nell-floor7", kind: "trigger", x: 9, y: 3, label: "Nell", sceneId: "ai-scene-floor7-nell-quiet", requiresFlag: "ai-flag-floor7-arrived", glyph: "leaf" },
  { id: "obj-choirkeeper-names-floor7", kind: "trigger", x: 2, y: 7, label: "The Choirkeeper, again", sceneId: "ai-scene-floor7-choirkeeper-names", requiresFlag: "ai-flag-floor7-met-nell", glyph: "music" },
]);

patchTown(8, [
  { id: "obj-kirei-floor8", kind: "trigger", x: 3, y: 3, label: "Kirei", sceneId: "ai-scene-floor8-kirei-lost", requiresFlag: "ai-flag-floor8-arrived", glyph: "zap" },
  { id: "obj-hollow-floor8", kind: "trigger", x: 9, y: 3, label: "Hollow", sceneId: "ai-scene-floor8-hollow-scout", requiresFlag: "ai-flag-floor8-arrived", glyph: "user-x" },
  { id: "obj-hollow-proof-floor8", kind: "trigger", x: 2, y: 7, label: "Hollow, returned", sceneId: "ai-scene-floor8-hollow-proof", requiresFlag: "ai-flag-doc-renner-theory", glyph: "user-x" },
]);

patchTown(9, [
  { id: "obj-mei-floor9", kind: "trigger", x: 3, y: 3, label: "Mei", sceneId: "ai-scene-floor9-mei-wind", requiresFlag: "ai-flag-floor9-arrived", glyph: "hammer" },
  { id: "obj-toran-floor9", kind: "trigger", x: 9, y: 3, label: "Toran", sceneId: "ai-scene-floor9-toran-view", requiresFlag: "ai-flag-floor9-arrived", glyph: "shield" },
  { id: "obj-wren-followup-floor9", kind: "trigger", x: 2, y: 7, label: "Wren", sceneId: "ai-scene-floor9-wren-followup", requiresFlag: "ai-flag-wren-secret", glyph: "feather" },
]);

patchTown(10, [
  { id: "obj-farewell-floor10", kind: "trigger", x: 3, y: 3, label: "The party, gathered", sceneId: "ai-scene-floor10-farewell-round", requiresFlag: "ai-flag-met-ilyana", glyph: "users" },
]);
