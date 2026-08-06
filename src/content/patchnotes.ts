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
    version: "0.3.0",
    date: "Every Chapter, In Full",
    title: "Every Chapter, In Full",
    completed: [
      "Elite Academy Chapters 2–10 deepened to Chapter One's density: each chapter now has 5–10 scenes (an arrival beat, multiple NPC beats across different classroom/campus locations, a hidden scene gated on exploration, a 2–4 option decision point, and a reactive multi-branch closing scene), instead of the single arrival/beat/decision/close skeleton they shipped with.",
      "Aincrad Floors 2–10 deepened the same way: each floor now has 2–4 traveling-cast beat scenes (Kirei, Toran, Mei, Nell, Hollow, Wren — rotated across floors), a hidden lore/payoff scene unlocked by an earlier scene's clue flag, a third tactical option on the floor's boss-prep scene unlocked by exploration, and a reactive multi-branch boss-aftermath scene instead of one static line.",
      "Floor 10's finale specifically got extra treatment: a full-party farewell scene the night before the Tenth Gate raid, and a post-victory epilogue chain that reacts to whether Ilyana was recruited earlier in the floor.",
      "New character throughlines across floors: Toran's anonymous Guard-skill rescues of Sena (Floor 4), Nell's secret vigil for a player she once turned away (Floor 3), Hollow opening up about his own lost party after hearing Bram's story (Floor 5), and Wren's storm-reading passed down from a scout she lost on Floor 3, called back on Floor 9.",
      "Added src/tests/sceneIntegrity.test.ts, a permanent regression test enforcing that a dialogue node's `conditions` field is only ever meaningful when that node is listed in its scene's `altEntryNodes` — the exact bug class caught and fixed during this pass (see Known Issues in v0.2.0). Running it against the full content set also surfaced and fixed 4 leftover dead-condition nodes in the original Floor 1 content.",
    ],
    knownIssues: [
      "Floors 11+ of Aincrad and a second Elite Academy year both remain unbuilt; this slice still ends at the Tenth Gate / Year's End.",
      "The new hidden/bonus scenes in each chapter and floor are optional content gated behind exploration or specific dialogue choices — a player who beelines the main decision points in each chapter will still see the lighter v0.2.0-era version of the story beats.",
    ],
    upcoming: [
      "Chapters/floors 11+ for both worlds.",
      "Deeper personal-quest resolution content for the newer NPCs introduced in Floors 4–10.",
    ],
  },
  {
    version: "0.2.0",
    date: "The Long Climb",
    title: "The Long Climb",
    completed: [
      "Full 10-chapter story arcs for both worlds, not just Chapter One.",
      "Elite Academy: Chapters 2–10 (\"The Watcher's Game\" through \"The Final Ranking\") covering a full school year — the Nomination Exam, the Away Exam, Midterms vs. Class 1-A, the Trade War market exam, the Watcher's identity reveal, and the year-end Final Ranking exam, each with its own meaningful decision and outcome.",
      "Aincrad: Floors 4–10 (\"Verdant Spire\" through \"The Tenth Gate\") are now fully playable, not locked previews — each with its own town, field/dungeon, mini-boss, floor boss, and local NPC, culminating in the Tenth Gate milestone raid.",
      "7 new Aincrad NPCs and 28 new enemies (14 common, 7 mini-bosses, 7 floor bosses) across the new floors.",
      "New chapter-progression system: a \"Next Chapter\" flow from the chapter recap screen, a per-save unlocked-chapter list, and a Chapters tab in the in-game device to review or jump back into any unlocked chapter.",
      "Fixed a real bug where a dialogue line whose own effects triggered a location/scene/battle change would navigate away before its own text ever displayed — navigation now correctly waits until the player advances past the line.",
      "Fixed the Floor 1 boss raid never actually starting combat (a leftover gap from the original slice) and gave Floors 2–3's boss raids proper aftermath scenes.",
    ],
    knownIssues: [
      "Chapters 2–10 in both worlds are moderate-depth (one arrival beat, one or two character beats, one decision, one close) rather than Chapter One's full density — by design, matching how Aincrad's original Floors 2–3 were scoped.",
      "Floors 11 and beyond remain unbuilt; this slice's climb ends at the Tenth Gate.",
      "Elite Academy's arc ends at Year's End; a second full school year isn't built.",
    ],
    upcoming: [
      "Deeper character-quest content for the new Aincrad floor-local NPCs.",
      "A second Elite Academy year.",
      "Floors 11+ of Aincrad.",
    ],
  },
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
