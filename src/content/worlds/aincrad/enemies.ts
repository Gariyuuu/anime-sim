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

  /* ------------------------------- Floor 4: Verdant Spire ------------------------------- */
  { id: "en-vine-stalker", name: "Vine Stalker", description: "Climbs the spire's inner walls, drops on anything below.", tier: "common", floorId: "floor-4", health: 85, attack: 15, defense: 5, agility: 13, col: 35, xp: 30, skills: ["sk-slash"], glyph: "sprout", color: "#3d6b2f" },
  { id: "en-canopy-hawk", name: "Canopy Hawk", description: "Dive-bombs from the spire's upper terraces.", tier: "common", floorId: "floor-4", health: 65, attack: 18, defense: 3, agility: 18, col: 32, xp: 28, skills: ["sk-piercing-thrust"], glyph: "bird", color: "#8a6a3a" },
  { id: "en-spire-ape", name: "Spire Ape", description: "Territorial and enormous. Throws whatever it can reach.", tier: "mini-boss", floorId: "floor-4", health: 460, attack: 32, defense: 14, agility: 9, col: 260, xp: 190, skills: ["sk-heavy-cleave", "sk-guard-break"], glyph: "footprints", color: "#5a4530", phases: [{ healthThreshold: 0.4, description: "Beats the spire wall, dropping debris on the party.", bonusAttack: 8 }] },
  { id: "en-verdant-warden", name: "Verdant Warden", description: "Floor 4's boss — a colossal treant fused into the spire's living core.", tier: "floor-boss", floorId: "floor-4", health: 1750, attack: 40, defense: 18, agility: 7, col: 1200, xp: 640, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-roar"], glyph: "trees", color: "#2a4a1f", phases: [
    { healthThreshold: 0.65, description: "Vines erupt across the arena floor.", bonusAttack: 6 },
    { healthThreshold: 0.3, description: "The spire itself begins to sway.", bonusAttack: 12 },
  ] },

  /* ------------------------------- Floor 5: The Drowned Causeway ------------------------------- */
  { id: "en-marsh-eel", name: "Marsh Eel", description: "Hides beneath the causeway's flooded stones.", tier: "common", floorId: "floor-5", health: 90, attack: 17, defense: 6, agility: 11, col: 38, xp: 33, skills: ["sk-venom-bite"], glyph: "wind", color: "#3a5a4a" },
  { id: "en-bog-crawler", name: "Bog Crawler", description: "Armored and slow, but its pincers don't miss twice.", tier: "common", floorId: "floor-5", health: 110, attack: 16, defense: 10, agility: 5, col: 40, xp: 35, skills: ["sk-guard-break"], glyph: "bug", color: "#4a5a3a" },
  { id: "en-causeway-broodmaw", name: "Causeway Broodmaw", description: "Something large enough to swallow the causeway path whole.", tier: "mini-boss", floorId: "floor-5", health: 560, attack: 36, defense: 16, agility: 6, col: 300, xp: 220, skills: ["sk-heavy-cleave", "sk-venom-bite"], glyph: "waves", color: "#2a4a4a", phases: [{ healthThreshold: 0.45, description: "Drags the fight into deeper water, slowing the party.", bonusAttack: 7 }] },
  { id: "en-drowned-sovereign", name: "Drowned Sovereign", description: "Floor 5's boss — a crowned amphibious ruler of a court that flooded a century of game-time ago.", tier: "floor-boss", floorId: "floor-5", health: 2250, attack: 46, defense: 20, agility: 8, col: 1500, xp: 780, skills: ["sk-crushing-slam", "sk-venom-bite", "sk-roar"], glyph: "crown", color: "#1f3a4a", phases: [
    { healthThreshold: 0.6, description: "Floods the arena to the knee.", bonusAttack: 7 },
    { healthThreshold: 0.3, description: "Summons the causeway's drowned court to flank.", bonusAttack: 13 },
  ] },

  /* ------------------------------- Floor 6: Gilded Quarter ------------------------------- */
  { id: "en-gilded-automaton", name: "Gilded Automaton", description: "A decorative guard construct with a very undecorative swing.", tier: "common", floorId: "floor-6", health: 130, attack: 20, defense: 12, agility: 6, col: 55, xp: 40, skills: ["sk-heavy-cleave"], glyph: "cog", color: "#8a7530" },
  { id: "en-counterfeit-wraith", name: "Counterfeit Wraith", description: "Wears the illusion of a friendly NPC until it's too late.", tier: "common", floorId: "floor-6", health: 95, attack: 22, defense: 5, agility: 14, col: 58, xp: 42, skills: ["sk-piercing-thrust"], glyph: "drama", color: "#5a4a6a" },
  { id: "en-market-enforcer", name: "Market Enforcer", description: "Muscle for whichever guild controls the Quarter's prices this week.", tier: "mini-boss", floorId: "floor-6", health: 680, attack: 42, defense: 18, agility: 10, col: 340, xp: 260, skills: ["sk-guard-break", "sk-heavy-cleave"], glyph: "coins", color: "#7a6520", phases: [{ healthThreshold: 0.4, description: "Calls in a second wave of hired blades.", bonusAttack: 9 }] },
  { id: "en-golden-magnate", name: "Golden Magnate", description: "Floor 6's boss — a corrupted construct built from every col the Quarter's players ever spent.", tier: "floor-boss", floorId: "floor-6", health: 2800, attack: 52, defense: 24, agility: 8, col: 2000, xp: 950, skills: ["sk-crushing-slam", "sk-guard-break", "sk-whirlwind"], glyph: "gem", color: "#9a7a20", phases: [
    { healthThreshold: 0.6, description: "Its plating sheds col in a glittering, blinding burst.", bonusAttack: 8 },
    { healthThreshold: 0.25, description: "The construct cracks down to its ugly iron core.", bonusAttack: 14 },
  ] },

  /* ------------------------------- Floor 7: Hollow Choir ------------------------------- */
  { id: "en-silent-wisp", name: "Silent Wisp", description: "Makes no sound at all. Neither does anything it kills.", tier: "common", floorId: "floor-7", health: 100, attack: 24, defense: 7, agility: 15, col: 60, xp: 45, skills: ["sk-guard-break"], glyph: "flame", color: "#6a6a8a" },
  { id: "en-echo-shade", name: "Echo Shade", description: "Repeats the last sound it heard — usually a scream.", tier: "common", floorId: "floor-7", health: 115, attack: 23, defense: 8, agility: 12, col: 62, xp: 47, skills: ["sk-piercing-thrust"], glyph: "ghost", color: "#4a4a6a" },
  { id: "en-choir-conductor", name: "Choir Conductor", description: "Directs the floor's silence like an orchestra.", tier: "mini-boss", floorId: "floor-7", health: 760, attack: 48, defense: 20, agility: 11, col: 400, xp: 300, skills: ["sk-roar", "sk-guard-break"], glyph: "music", color: "#3a3a5a", phases: [{ healthThreshold: 0.4, description: "The silence deepens; the party's stamina drains faster.", bonusAttack: 9 }] },
  { id: "en-hollow-chorus", name: "Hollow Chorus", description: "Floor 7's boss — dozens of voices that were never given the chance to log out safely, now speaking as one.", tier: "floor-boss", floorId: "floor-7", health: 3400, attack: 58, defense: 26, agility: 10, col: 2600, xp: 1150, skills: ["sk-roar", "sk-crushing-slam", "sk-whirlwind"], glyph: "users", color: "#2a2a4a", phases: [
    { healthThreshold: 0.65, description: "The chorus splits into overlapping voices, each attacking separately.", bonusAttack: 8 },
    { healthThreshold: 0.35, description: "For one moment, the voices go quiet — then scream at once.", bonusAttack: 15 },
    { healthThreshold: 0.1, description: "Every voice it ever carried joins the final verse.", bonusAttack: 20 },
  ] },

  /* ------------------------------- Floor 8: The Iron Maze ------------------------------- */
  { id: "en-maze-sentry", name: "Maze Sentry", description: "A wall-mounted turret that rotates faster than it should.", tier: "common", floorId: "floor-8", health: 120, attack: 27, defense: 14, agility: 4, col: 68, xp: 50, skills: ["sk-piercing-thrust"], glyph: "target", color: "#5a5a5a" },
  { id: "en-rust-hound", name: "Rust Hound", description: "Hunts in the maze's dead-end corridors, where nobody can retreat.", tier: "common", floorId: "floor-8", health: 105, attack: 26, defense: 9, agility: 17, col: 65, xp: 48, skills: ["sk-slash"], glyph: "paw-print", color: "#6a5040" },
  { id: "en-labyrinth-keeper", name: "Labyrinth Keeper", description: "Rearranges the maze's walls to keep parties from ever backtracking.", tier: "mini-boss", floorId: "floor-8", health: 840, attack: 52, defense: 24, agility: 9, col: 440, xp: 340, skills: ["sk-guard-break", "sk-heavy-cleave"], glyph: "key", color: "#4a4a4a", phases: [{ healthThreshold: 0.45, description: "Seals off half the arena, forcing a tighter fight.", bonusAttack: 10 }] },
  { id: "en-iron-architect", name: "Iron Architect", description: "Floor 8's boss — the machine that designed the maze, and has never once let anyone see its true shape.", tier: "floor-boss", floorId: "floor-8", health: 4050, attack: 64, defense: 30, agility: 8, col: 3200, xp: 1400, skills: ["sk-crushing-slam", "sk-guard-break", "sk-roar"], glyph: "cog", color: "#3a3a3a", phases: [
    { healthThreshold: 0.6, description: "Rebuilds part of its own armor mid-fight.", bonusAttack: 9 },
    { healthThreshold: 0.3, description: "Abandons its defensive plating entirely for raw offense.", bonusAttack: 16 },
  ] },

  /* ------------------------------- Floor 9: Skybreak Terrace ------------------------------- */
  { id: "en-gale-serpent", name: "Gale Serpent", description: "Rides the terrace's permanent windstorm.", tier: "common", floorId: "floor-9", health: 135, attack: 30, defense: 10, agility: 20, col: 75, xp: 55, skills: ["sk-piercing-thrust"], glyph: "wind", color: "#7a9ab0" },
  { id: "en-cloud-raptor", name: "Cloud Raptor", description: "Nests above the cloud line, well out of most parties' reach.", tier: "common", floorId: "floor-9", health: 120, attack: 32, defense: 8, agility: 19, col: 72, xp: 53, skills: ["sk-slash"], glyph: "bird", color: "#9ab0c0" },
  { id: "en-storm-harrier", name: "Storm Harrier", description: "A lightning-wreathed avian that circles before it strikes.", tier: "mini-boss", floorId: "floor-9", health: 920, attack: 58, defense: 26, agility: 16, col: 480, xp: 380, skills: ["sk-piercing-thrust", "sk-guard-break"], glyph: "zap", color: "#5a7a9a", phases: [{ healthThreshold: 0.4, description: "Calls down a lightning strike on a random party member each round.", bonusAttack: 10 }] },
  { id: "en-skybreak-sentinel", name: "Skybreak Sentinel", description: "Floor 9's boss — a storm given armor, said to be visible from Floor 1 on clear days.", tier: "floor-boss", floorId: "floor-9", health: 4750, attack: 70, defense: 32, agility: 14, col: 3800, xp: 1650, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-roar"], glyph: "cloud-lightning", color: "#3a5a7a", phases: [
    { healthThreshold: 0.65, description: "The wind picks up, reducing the party's accuracy.", bonusAttack: 9 },
    { healthThreshold: 0.35, description: "Calls a full storm down over the terrace.", bonusAttack: 16 },
    { healthThreshold: 0.12, description: "Channels everything it has left into one final gale.", bonusAttack: 22 },
  ] },

  /* ------------------------------- Floor 10: The Tenth Gate ------------------------------- */
  { id: "en-gatekeeper-drone", name: "Gatekeeper Drone", description: "System-issued security, standard on every milestone floor.", tier: "common", floorId: "floor-10", health: 160, attack: 34, defense: 16, agility: 10, col: 90, xp: 65, skills: ["sk-piercing-thrust"], glyph: "shield", color: "#6a6a6a" },
  { id: "en-oathbound-knight", name: "Oathbound Knight", description: "A former player's gear, still moving, still fighting whatever it's told to.", tier: "common", floorId: "floor-10", health: 175, attack: 36, defense: 20, agility: 7, col: 92, xp: 68, skills: ["sk-heavy-cleave"], glyph: "sword", color: "#4a4a5a" },
  { id: "en-gate-champion", name: "Gate Champion", description: "Undefeated so far. Every guild on Floor 9 has a theory about who it used to be.", tier: "mini-boss", floorId: "floor-10", health: 1150, attack: 66, defense: 30, agility: 13, col: 620, xp: 480, skills: ["sk-heavy-cleave", "sk-guard-break", "sk-piercing-thrust"], glyph: "sword", color: "#3a3a4a", phases: [{ healthThreshold: 0.4, description: "Drops its shield entirely and commits to an all-out assault.", bonusAttack: 12 }] },
  { id: "en-the-tenth-gatekeeper", name: "The Tenth Gatekeeper", description: "Floor 10's boss — the first of Aincrad's confirmed milestone guardians, and the hardest fight this slice of the climb has to offer.", tier: "floor-boss", floorId: "floor-10", health: 6000, attack: 82, defense: 36, agility: 14, col: 5000, xp: 2200, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-roar", "sk-guard-break"], glyph: "gem", color: "#2a2a3a", phases: [
    { healthThreshold: 0.7, description: "Unseals its second weapon.", bonusAttack: 8 },
    { healthThreshold: 0.45, description: "The gate itself begins to glow behind it.", bonusAttack: 14 },
    { healthThreshold: 0.2, description: "Everything it's held back until now.", bonusAttack: 22 },
  ] },
];
