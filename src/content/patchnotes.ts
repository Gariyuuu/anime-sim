export interface PatchNote {
  version: string;
  date: string;
  title: string;
  completed: string[];
  knownIssues: string[];
  upcoming: string[];
}

export const patchNotes: PatchNote[] = [
  {
    version: "0.1.0",
    date: "First Login",
    title: "First Login",
    completed: [
      "Boot sequence, title screen, and full character creator.",
      "Two playable worlds: Elite Academy and Aincrad.",
      "Data-driven dialogue engine with conditions, effects, branching choices, bluffs, silence options, and hidden stat checks.",
      "Elite Academy Chapter One — \"The First Ranking\" — fully playable with 8 major NPCs, the Consensus Trial special exam, an investigation route, a romance thread, a betrayal path, and 3 chapter outcomes.",
      "Aincrad Chapter One — \"The Locked Sky\" — fully playable on Floor 1, with 8 major NPCs, guild recruitment, a solo route, a hidden quest, a boss raid, and 3 chapter outcomes.",
      "Floors 2 and 3 of Aincrad are explorable with unique maps, enemies, mini-bosses, and floor bosses, though with lighter narrative content than Floor 1.",
      "Turn-based combat with skills, guarding, dodging, items, analyze, status effects, and boss phases.",
      "Canvas-based top-down exploration with keyboard, click-to-move, and on-screen mobile controls.",
      "Relationship system tracking seven independent axes per NPC, not a single meter.",
      "Persistent saves via IndexedDB (Dexie) with multiple slots, autosave, import/export, and Zod validation.",
      "In-game device (phone / system window) with messages, quests, relationships, inventory, and map.",
      "Codex, 22 achievements, settings, accessibility options, and chapter recap screens.",
      "Developer debug panel (development builds only).",
    ],
    knownIssues: [
      "Floors 2 and 3 have functional gameplay but shorter dialogue content than Floor 1's chapter.",
      "Floors 4 and beyond are locked previews only — data-modeled but not yet built out.",
      "Audio is wired through Howler.js but ships without licensed music; only a few short original UI stingers are included.",
      "Some accessibility settings (dyslexia font, high contrast) affect UI copy but not yet every custom-drawn canvas element.",
    ],
    upcoming: [
      "Deeper narrative content for Aincrad Floors 2 and 3.",
      "Floor 4 unlock and a second Elite Academy chapter.",
      "Player-created guilds in Aincrad.",
      "Expanded academic minigames for Elite Academy.",
    ],
  },
];
