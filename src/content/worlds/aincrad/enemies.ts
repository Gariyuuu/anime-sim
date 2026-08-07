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

  /* ------------------------------- Floor 11: The Sunken Archive ------------------------------- */
  { id: "en-drowned-page", name: "Drowned Page", description: "Loose sheets of waterlogged text that move like they're still trying to be read.", tier: "common", floorId: "floor-11", health: 195, attack: 38, defense: 17, agility: 12, col: 100, xp: 72, skills: ["sk-slash"], glyph: "file-text", color: "#3a6a6a" },
  { id: "en-archive-eel", name: "Archive Eel", description: "Nests in the flooded stacks, strikes from between the shelves.", tier: "common", floorId: "floor-11", health: 210, attack: 40, defense: 14, agility: 16, col: 105, xp: 75, skills: ["sk-venom-bite"], glyph: "wind", color: "#2a5a5a" },
  { id: "en-drowned-cataloguer", name: "Drowned Cataloguer", description: "Still sorting texts nobody will ever read again, with a filing system that ends in violence.", tier: "mini-boss", floorId: "floor-11", health: 1350, attack: 72, defense: 32, agility: 14, col: 700, xp: 540, skills: ["sk-guard-break", "sk-piercing-thrust"], glyph: "book", color: "#1f4a4a", phases: [{ healthThreshold: 0.4, description: "Summons a swarm of drowned pages to flank.", bonusAttack: 11 }] },
  { id: "en-archive-warden", name: "Archive Warden", description: "Floor 11's boss — built to protect the collection from everyone, including the people who built it.", tier: "floor-boss", floorId: "floor-11", health: 7000, attack: 90, defense: 38, agility: 12, col: 5800, xp: 2500, skills: ["sk-crushing-slam", "sk-guard-break", "sk-roar"], glyph: "book-marked", color: "#153a3a", phases: [
    { healthThreshold: 0.65, description: "Floods the archive floor to the waist.", bonusAttack: 9 },
    { healthThreshold: 0.3, description: "Tears pages from its own armor to summon reinforcements.", bonusAttack: 16 },
  ] },

  /* ------------------------------- Floor 12: Ember Foundry ------------------------------- */
  { id: "en-slag-hound", name: "Slag Hound", description: "Runs on foundry heat instead of blood.", tier: "common", floorId: "floor-12", health: 220, attack: 41, defense: 15, agility: 17, col: 112, xp: 78, skills: ["sk-slash"], glyph: "flame", color: "#8a3a1f" },
  { id: "en-cinder-press", name: "Cinder Press", description: "An industrial stamping rig that decided it liked hunting better than pressing.", tier: "common", floorId: "floor-12", health: 250, attack: 39, defense: 22, agility: 6, col: 115, xp: 80, skills: ["sk-heavy-cleave"], glyph: "hammer", color: "#6a3010" },
  { id: "en-slag-brute", name: "Slag Brute", description: "Forged, not born, and clearly resentful about it.", tier: "mini-boss", floorId: "floor-12", health: 1550, attack: 78, defense: 36, agility: 9, col: 780, xp: 610, skills: ["sk-heavy-cleave", "sk-crushing-slam"], glyph: "flame", color: "#5a2a10", phases: [{ healthThreshold: 0.45, description: "Its core overheats, dealing burn damage each turn.", bonusAttack: 12 }] },
  { id: "en-foundry-heart", name: "Foundry Heart", description: "Floor 12's boss — the forge's own furnace, given a shape it was never meant to have.", tier: "floor-boss", floorId: "floor-12", health: 8200, attack: 98, defense: 42, agility: 10, col: 6600, xp: 2850, skills: ["sk-crushing-slam", "sk-heavy-cleave", "sk-roar"], glyph: "flame", color: "#4a1f0a", phases: [
    { healthThreshold: 0.6, description: "The foundry floor itself starts glowing white-hot.", bonusAttack: 10 },
    { healthThreshold: 0.28, description: "Vents everything it has left in one molten surge.", bonusAttack: 18 },
  ] },

  /* ------------------------------- Floor 13: Glasswind Reach ------------------------------- */
  { id: "en-shard-wisp", name: "Shard Wisp", description: "A drifting cloud of glass dust with genuinely bad intentions.", tier: "common", floorId: "floor-13", health: 250, attack: 44, defense: 16, agility: 20, col: 128, xp: 85, skills: ["sk-piercing-thrust"], glyph: "wind", color: "#a8c8c8" },
  { id: "en-glass-scorpion", name: "Glass Scorpion", description: "Every joint on its body is a cutting edge.", tier: "common", floorId: "floor-13", health: 265, attack: 43, defense: 20, agility: 13, col: 130, xp: 87, skills: ["sk-venom-bite"], glyph: "bug", color: "#8ab0b0" },
  { id: "en-glass-serpent", name: "Glass Serpent", description: "Coils through the dunes leaving a trail of cut sand behind it.", tier: "mini-boss", floorId: "floor-13", health: 1800, attack: 84, defense: 38, agility: 18, col: 900, xp: 700, skills: ["sk-piercing-thrust", "sk-venom-bite"], glyph: "wind", color: "#6a9a9a", phases: [{ healthThreshold: 0.4, description: "Shatters part of itself into a cutting sandstorm.", bonusAttack: 13 }] },
  { id: "en-wind-cut-colossus", name: "Wind-Cut Colossus", description: "Floor 13's boss — a towering formation of fused glass, carved sharp by a century of wind.", tier: "floor-boss", floorId: "floor-13", health: 9600, attack: 106, defense: 46, agility: 13, col: 7600, xp: 3200, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-piercing-thrust"], glyph: "mountain", color: "#4a7a7a", phases: [
    { healthThreshold: 0.6, description: "The wind picks up, flinging glass shards across the arena.", bonusAttack: 11 },
    { healthThreshold: 0.25, description: "Cracks down its whole length, exposing a glowing core.", bonusAttack: 19 },
  ] },

  /* ------------------------------- Floor 14: The Hanging Gardens ------------------------------- */
  { id: "en-thornvine-crawler", name: "Thornvine Crawler", description: "Grows faster than anyone's willing to keep cutting it back.", tier: "common", floorId: "floor-14", health: 280, attack: 47, defense: 18, agility: 14, col: 142, xp: 92, skills: ["sk-slash"], glyph: "sprout", color: "#3a7a2f" },
  { id: "en-bloom-wasp", name: "Bloom Wasp", description: "Nests in the hanging gardens' highest, prettiest, most dangerous flowers.", tier: "common", floorId: "floor-14", health: 260, attack: 49, defense: 12, agility: 22, col: 144, xp: 94, skills: ["sk-venom-bite"], glyph: "bug", color: "#c04a7a" },
  { id: "en-thornback-matriarch", name: "Thornback Matriarch", description: "Guards the gardens' oldest bloom like it's her own child.", tier: "mini-boss", floorId: "floor-14", health: 2050, attack: 90, defense: 40, agility: 16, col: 1050, xp: 780, skills: ["sk-heavy-cleave", "sk-venom-bite"], glyph: "flower", color: "#2a5a1f", phases: [{ healthThreshold: 0.4, description: "Calls a swarm of bloom wasps to defend her.", bonusAttack: 14 }] },
  { id: "en-garden-sovereign", name: "Garden Sovereign", description: "Floor 14's boss — root and thorn grown into something that used to just be a garden.", tier: "floor-boss", floorId: "floor-14", health: 11200, attack: 115, defense: 50, agility: 11, col: 8800, xp: 3650, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-roar"], glyph: "flower", color: "#1f4a15", phases: [
    { healthThreshold: 0.65, description: "The garden platform itself begins tilting underfoot.", bonusAttack: 12 },
    { healthThreshold: 0.3, description: "Every root in the garden reaches for the party at once.", bonusAttack: 20 },
  ] },

  /* ------------------------------- Floor 15: Duskmarch ------------------------------- */
  { id: "en-grave-lantern", name: "Grave Lantern", description: "A floating light that leads travelers exactly where they shouldn't go.", tier: "common", floorId: "floor-15", health: 320, attack: 51, defense: 19, agility: 18, col: 165, xp: 105, skills: ["sk-guard-break"], glyph: "flame", color: "#4a3a6a" },
  { id: "en-marchbound-wraith", name: "Marchbound Wraith", description: "Walks the dusk in an endless column, never quite arriving anywhere.", tier: "common", floorId: "floor-15", health: 300, attack: 53, defense: 16, agility: 20, col: 168, xp: 108, skills: ["sk-piercing-thrust"], glyph: "ghost", color: "#3a2a5a" },
  { id: "en-grave-captain", name: "Grave Captain", description: "Still commands a column of soldiers who stopped needing orders a long time ago.", tier: "mini-boss", floorId: "floor-15", health: 2350, attack: 97, defense: 44, agility: 15, col: 1250, xp: 900, skills: ["sk-guard-break", "sk-heavy-cleave"], glyph: "flag", color: "#2a1f4a", phases: [{ healthThreshold: 0.4, description: "Calls the march to close ranks around him.", bonusAttack: 15 }] },
  { id: "en-duskmarch-sovereign", name: "Duskmarch Sovereign", description: "Floor 15's boss — the second confirmed milestone guardian. Leads a march that's been going nowhere for a very long time.", tier: "floor-boss", floorId: "floor-15", health: 13000, attack: 125, defense: 54, agility: 14, col: 10500, xp: 4300, skills: ["sk-crushing-slam", "sk-roar", "sk-whirlwind", "sk-guard-break"], glyph: "crown", color: "#1a1240", phases: [
    { healthThreshold: 0.7, description: "Calls the whole march forward at once.", bonusAttack: 12 },
    { healthThreshold: 0.4, description: "The dusk deepens toward true dark.", bonusAttack: 19 },
    { healthThreshold: 0.15, description: "Leads one final charge, alone.", bonusAttack: 27 },
  ] },

  /* ------------------------------- Floor 16: Ironclad Docks ------------------------------- */
  { id: "en-rust-diver", name: "Rust Diver", description: "Patrols the flooded dry-docks in gear nobody's maintained in years.", tier: "common", floorId: "floor-16", health: 360, attack: 55, defense: 24, agility: 13, col: 185, xp: 118, skills: ["sk-piercing-thrust"], glyph: "anchor", color: "#5a6a7a" },
  { id: "en-chain-hauler", name: "Chain Hauler", description: "Swings dock chains with more precision than something that size should have.", tier: "common", floorId: "floor-16", health: 400, attack: 53, defense: 27, agility: 8, col: 190, xp: 120, skills: ["sk-heavy-cleave"], glyph: "link", color: "#4a4a5a" },
  { id: "en-harbor-brute", name: "Harbor Brute", description: "Foreman of a dock crew that never actually finishes loading anything.", tier: "mini-boss", floorId: "floor-16", health: 2700, attack: 104, defense: 48, agility: 10, col: 1450, xp: 1050, skills: ["sk-heavy-cleave", "sk-guard-break"], glyph: "package", color: "#3a3a4a", phases: [{ healthThreshold: 0.42, description: "Calls the whole dry-dock crew in to swarm the party.", bonusAttack: 16 }] },
  { id: "en-dreadnought-hull", name: "Dreadnought Hull", description: "Floor 16's boss — a dry-docked warship hull, still crewed by something that never disembarked.", tier: "floor-boss", floorId: "floor-16", health: 15000, attack: 135, defense: 58, agility: 9, col: 12200, xp: 5000, skills: ["sk-crushing-slam", "sk-guard-break", "sk-roar"], glyph: "ship", color: "#2a3540", phases: [
    { healthThreshold: 0.6, description: "Its gun ports creak open along the whole hull.", bonusAttack: 13 },
    { healthThreshold: 0.28, description: "The hull itself starts to list, flooding the arena.", bonusAttack: 21 },
  ] },

  /* ------------------------------- Floor 17: The Silent Orchard ------------------------------- */
  { id: "en-hushblossom", name: "Hushblossom", description: "Blooms in total silence. So does whatever it does to you.", tier: "common", floorId: "floor-17", health: 400, attack: 58, defense: 22, agility: 16, col: 205, xp: 130, skills: ["sk-venom-bite"], glyph: "flower", color: "#c8d8c0" },
  { id: "en-quiet-stalker", name: "Quiet Stalker", description: "Moves between the orchard rows without ever disturbing a single leaf.", tier: "common", floorId: "floor-17", health: 380, attack: 60, defense: 19, agility: 22, col: 208, xp: 132, skills: ["sk-slash"], glyph: "eye-off", color: "#8aa088" },
  { id: "en-orchard-warden", name: "Orchard Warden", description: "Tends the silent rows the way a gardener tends something it doesn't want disturbed.", tier: "mini-boss", floorId: "floor-17", health: 3100, attack: 112, defense: 52, agility: 17, col: 1650, xp: 1180, skills: ["sk-guard-break", "sk-venom-bite"], glyph: "sprout", color: "#4a6a3f", phases: [{ healthThreshold: 0.4, description: "The whole orchard goes still — even stiller than before.", bonusAttack: 17 }] },
  { id: "en-the-withered-root", name: "The Withered Root", description: "Floor 17's boss — whatever's actually keeping the orchard silent, finally surfacing.", tier: "floor-boss", floorId: "floor-17", health: 17300, attack: 146, defense: 62, agility: 12, col: 14000, xp: 5750, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-venom-bite"], glyph: "trees", color: "#2f4a25", phases: [
    { healthThreshold: 0.65, description: "Every tree in sight sheds its blossoms at once.", bonusAttack: 14 },
    { healthThreshold: 0.3, description: "The silence breaks — briefly, and very badly.", bonusAttack: 23 },
  ] },

  /* ------------------------------- Floor 18: Stormwatch Bastion ------------------------------- */
  { id: "en-bastion-pikeman", name: "Bastion Pikeman", description: "A century of garrison drilling, none of it wasted.", tier: "common", floorId: "floor-18", health: 450, attack: 63, defense: 30, agility: 12, col: 230, xp: 145, skills: ["sk-piercing-thrust"], glyph: "sword", color: "#5a6a80" },
  { id: "en-storm-drake", name: "Storm Drake", description: "Circles the bastion walls on wings made of the storm itself.", tier: "common", floorId: "floor-18", health: 420, attack: 66, defense: 24, agility: 20, col: 235, xp: 148, skills: ["sk-piercing-thrust"], glyph: "cloud-lightning", color: "#4a6a9a" },
  { id: "en-bastion-lieutenant", name: "Bastion Lieutenant", description: "Second-in-command of a garrison that's stopped waiting for relief.", tier: "mini-boss", floorId: "floor-18", health: 3550, attack: 120, defense: 56, agility: 14, col: 1900, xp: 1350, skills: ["sk-heavy-cleave", "sk-guard-break", "sk-piercing-thrust"], glyph: "shield", color: "#3a4a60", phases: [{ healthThreshold: 0.4, description: "Signals the whole garrison to converge.", bonusAttack: 18 }] },
  { id: "en-stormwatch-warlord", name: "Stormwatch Warlord", description: "Floor 18's boss — commands a siege that's lasted so long it stopped being a siege and became a way of life.", tier: "floor-boss", floorId: "floor-18", health: 19900, attack: 158, defense: 66, agility: 13, col: 16000, xp: 6500, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-roar", "sk-guard-break"], glyph: "flag", color: "#2a3550", phases: [
    { healthThreshold: 0.6, description: "Calls down the storm itself onto the bastion walls.", bonusAttack: 15 },
    { healthThreshold: 0.25, description: "Abandons formation for a last, all-out charge.", bonusAttack: 24 },
  ] },

  /* ------------------------------- Floor 19: The Withering Court ------------------------------- */
  { id: "en-faded-attendant", name: "Faded Attendant", description: "Still serving a court that stopped having anyone to serve a long time ago.", tier: "common", floorId: "floor-19", health: 500, attack: 68, defense: 28, agility: 15, col: 255, xp: 160, skills: ["sk-slash"], glyph: "user", color: "#7a6a8a" },
  { id: "en-court-wisp", name: "Court Wisp", description: "A memory of candlelight that never quite goes out.", tier: "common", floorId: "floor-19", health: 470, attack: 70, defense: 22, agility: 19, col: 260, xp: 163, skills: ["sk-guard-break"], glyph: "flame", color: "#9a7ac0" },
  { id: "en-court-enforcer", name: "Court Enforcer", description: "Enforces a code of conduct nobody living remembers the rules of.", tier: "mini-boss", floorId: "floor-19", health: 4050, attack: 129, defense: 60, agility: 16, col: 2150, xp: 1550, skills: ["sk-guard-break", "sk-heavy-cleave"], glyph: "gavel", color: "#4a3a5a", phases: [{ healthThreshold: 0.4, description: "Invokes an old court ritual, hastening its own attacks.", bonusAttack: 19 }] },
  { id: "en-the-faded-monarch", name: "The Faded Monarch", description: "Floor 19's boss — ruler of a court with no subjects, defending a throne no one else wants.", tier: "floor-boss", floorId: "floor-19", health: 22800, attack: 171, defense: 70, agility: 13, col: 18500, xp: 7400, skills: ["sk-crushing-slam", "sk-roar", "sk-whirlwind"], glyph: "crown", color: "#3a2a4a", phases: [
    { healthThreshold: 0.65, description: "Summons the faded court to stand at attention around the throne.", bonusAttack: 16 },
    { healthThreshold: 0.3, description: "The throne room itself starts to crumble.", bonusAttack: 25 },
  ] },

  /* ------------------------------- Floor 20: The Twentieth Spire ------------------------------- */
  { id: "en-spire-sentinel", name: "Spire Sentinel", description: "System-issued security, upgraded twice since Floor 10's version.", tier: "common", floorId: "floor-20", health: 560, attack: 73, defense: 32, agility: 14, col: 285, xp: 180, skills: ["sk-piercing-thrust"], glyph: "shield", color: "#5a5a7a" },
  { id: "en-ascendant-knight", name: "Ascendant Knight", description: "Gear from a player who made it further than anyone thought possible, still moving.", tier: "common", floorId: "floor-20", health: 590, attack: 71, defense: 36, agility: 10, col: 290, xp: 183, skills: ["sk-heavy-cleave"], glyph: "sword", color: "#4a4a6a" },
  { id: "en-spire-vanguard", name: "Spire Vanguard", description: "The best fighter this stretch of the climb has produced. Nobody's beaten it yet.", tier: "mini-boss", floorId: "floor-20", health: 4600, attack: 139, defense: 64, agility: 17, col: 2500, xp: 1800, skills: ["sk-heavy-cleave", "sk-guard-break", "sk-piercing-thrust"], glyph: "sword", color: "#3a3a5a", phases: [{ healthThreshold: 0.4, description: "Drops all defensive posture for a pure offensive gambit.", bonusAttack: 20 }] },
  { id: "en-the-twentieth-warden", name: "The Twentieth Warden", description: "Floor 20's boss — the third confirmed milestone guardian, and the hardest fight this slice of the climb has to offer.", tier: "floor-boss", floorId: "floor-20", health: 26000, attack: 185, defense: 76, agility: 15, col: 21000, xp: 8600, skills: ["sk-crushing-slam", "sk-whirlwind", "sk-roar", "sk-guard-break"], glyph: "gem", color: "#242440", phases: [
    { healthThreshold: 0.7, description: "Unseals a weapon nobody's seen it use before.", bonusAttack: 14 },
    { healthThreshold: 0.45, description: "The spire itself begins to hum.", bonusAttack: 22 },
    { healthThreshold: 0.18, description: "Everything it has, all at once.", bonusAttack: 30 },
  ] },
];
