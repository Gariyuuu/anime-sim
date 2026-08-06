import type { EnemyDefinitionInput } from "@/types";

export const aincradEnemies: EnemyDefinitionInput[] = [
  /* ------------------------------- Floor 1: Sylvan Threshold ------------------------------- */
  { id: "en-timber-wolf", name: "Timber Wolf", description: "Fast, packs together, goes for the weakest target.", tier: "common", floorId: "floor-1", health: 40, attack: 8, defense: 2, agility: 9, col: 15, xp: 12, skills: ["sk-slash"], glyph: "paw-print", color: "#6b5a45" },
  { id: "en-thicket-imp", name: "Thicket Imp", description: "Small, erratic, hides in undergrowth.", tier: "common", floorId: "floor-1", health: 28, attack: 6, defense: 1, agility: 12, col: 10, xp: 9, skills: ["sk-slash"], glyph: "sprout", color: "#3f6b3f" },
  { id: "en-wild-boar", name: "Wild Boar", description: "Charges in a straight line. Predictable, dangerous if ignored.", tier: "common", floorId: "floor-1", health: 55, attack: 11, defense: 4, agility: 5, col: 18, xp: 15, skills: ["sk-heavy-cleave"], glyph: "footprints", color: "#5a3d2b" },
  { id: "en-marsh-serpent", name: "Marsh Serpent", description: "Slow but its bite carries poison.", tier: "common", floorId: "floor-1", health: 35, attack: 7, defense: 3, agility: 6, col: 16, xp: 13, skills: ["sk-venom-bite"], weakness: "fire", glyph: "wind", color: "#3d5a4a" },
  { id: "en-alpha-timberwolf", name: "Alpha Timberwolf", description: "Leads the wolf packs. Bigger, meaner, smarter about flanking.", tier: "mini-boss", floorId: "floor-1", health: 180, attack: 16, defense: 6, agility: 10, col: 90, xp: 60, skills: ["sk-slash", "sk-heavy-cleave"], glyph: "paw-print", color: "#4a3a2a", phases: [{ healthThreshold: 0.4, description: "Enrages, attacking faster.", bonusAttack: 5 }] },
  { id: "en-sylvan-guardian", name: "Sylvan Guardian", description: "Floor 1's boss — an ancient construct grown into the forest itself.", tier: "floor-boss", floorId: "floor-1", health: 620, attack: 22, defense: 10, agility: 5, col: 400, xp: 250, skills: ["sk-crushing-slam", "sk-roar", "sk-heavy-cleave"], glyph: "trees", color: "#2f4a2f", phases: [
    { healthThreshold: 0.6, description: "Roots erupt from the arena floor.", bonusAttack: 4 },
    { healthThreshold: 0.25, description: "The Guardian sheds its bark plating, exposing its core.", bonusAttack: 8 },
  ] },

  /* ------------------------------- Floor 2: Mistfallen Reach ------------------------------- */
  { id: "en-mist-stalker", name: "Mist Stalker", description: "Nearly invisible until it's already attacking.", tier: "common", floorId: "floor-2", health: 48, attack: 10, defense: 3, agility: 11, col: 22, xp: 18, skills: ["sk-slash"], glyph: "eye-off", color: "#7a8a99" },
  { id: "en-crag-spider", name: "Crag Spider", description: "Clings to cave walls, drops onto unsuspecting parties.", tier: "common", floorId: "floor-2", health: 42, attack: 9, defense: 5, agility: 8, col: 20, xp: 16, skills: ["sk-venom-bite"], glyph: "bug", color: "#4a4a5a" },
  { id: "en-frost-hare", name: "Frost Hare", description: "Harmless-looking. It is not harmless.", tier: "common", floorId: "floor-2", health: 30, attack: 8, defense: 2, agility: 14, col: 14, xp: 14, skills: ["sk-slash"], glyph: "footprints", color: "#c9d6e0" },
  { id: "en-bog-wisp", name: "Bog Wisp", description: "Floating light that drains stamina on contact.", tier: "common", floorId: "floor-2", health: 36, attack: 7, defense: 2, agility: 10, col: 20, xp: 17, skills: ["sk-guard-break"], glyph: "flame", color: "#5a7a8f" },
  { id: "en-frostfang-alpha", name: "Frostfang Alpha", description: "Mistfallen's apex predator. Hunts in the fog it creates.", tier: "mini-boss", floorId: "floor-2", health: 260, attack: 20, defense: 8, agility: 12, col: 140, xp: 95, skills: ["sk-slash", "sk-guard-break", "sk-heavy-cleave"], glyph: "paw-print", color: "#3a4a5a", phases: [{ healthThreshold: 0.35, description: "Summons a fog that reduces party accuracy.", bonusAttack: 6 }] },
  { id: "en-mistfallen-warden", name: "Mistfallen Warden", description: "Floor 2's boss — a knight-shaped mass of fog and old armor.", tier: "floor-boss", floorId: "floor-2", health: 900, attack: 28, defense: 14, agility: 8, col: 650, xp: 380, skills: ["sk-crushing-slam", "sk-roar", "sk-guard-break"], glyph: "shield", color: "#4a5a6a", phases: [
    { healthThreshold: 0.65, description: "The fog thickens, and it starts attacking twice per turn.", bonusAttack: 5 },
    { healthThreshold: 0.3, description: "Its armor cracks, revealing something that shouldn't move.", bonusAttack: 10 },
  ] },

  /* ------------------------------- Floor 3: Ashen Hollow ------------------------------- */
  { id: "en-cinder-bat", name: "Cinder Bat", description: "Swarms in numbers, individually weak.", tier: "common", floorId: "floor-3", health: 32, attack: 9, defense: 2, agility: 15, col: 25, xp: 20, skills: ["sk-slash"], glyph: "flame", color: "#8f3d2b" },
  { id: "en-ash-golem", name: "Ash Golem", description: "Slow-moving, nearly immune to blunt damage.", tier: "common", floorId: "floor-3", health: 70, attack: 13, defense: 9, agility: 3, col: 30, xp: 24, skills: ["sk-heavy-cleave"], weakness: "piercing", glyph: "mountain", color: "#5a4a3a" },
  { id: "en-molten-sentinel", name: "Molten Sentinel", description: "A guard construct that grows more dangerous as it takes damage.", tier: "mini-boss", floorId: "floor-3", health: 340, attack: 24, defense: 12, agility: 6, col: 200, xp: 130, skills: ["sk-heavy-cleave", "sk-crushing-slam"], glyph: "flame", color: "#7a3a2a", phases: [{ healthThreshold: 0.5, description: "Its core cracks open, radiating heat damage each turn.", bonusAttack: 8 }] },
  { id: "en-ashen-hollow-king", name: "Ashen Hollow King", description: "Floor 3's boss — the self-declared ruler of a hollow no one else wanted.", tier: "floor-boss", floorId: "floor-3", health: 1300, attack: 34, defense: 16, agility: 9, col: 950, xp: 520, skills: ["sk-crushing-slam", "sk-roar", "sk-whirlwind"], glyph: "crown", color: "#6a2a1a", phases: [
    { healthThreshold: 0.7, description: "Summons cinder bats to flank the party.", bonusAttack: 4 },
    { healthThreshold: 0.4, description: "The arena floor begins to crack and glow.", bonusAttack: 9 },
    { healthThreshold: 0.15, description: "A final, desperate assault.", bonusAttack: 14 },
  ] },
];
