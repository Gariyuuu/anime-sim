# ANIME//SIM

> **Note (2026-08-07 checkpoint pass):** this file's content counts below
> (e.g. "10 full floors/chapters", "10 floor bosses") are stale — both
> worlds have shipped a second act since this was last updated: Elite
> Academy Year Two (Chapters 11-20) and Aincrad Floors 11-20 (20 floor
> bosses total, not 10). See `PROJECT_STATE.md`/`CLAUDE.md` for current
> numbers; this file was out of scope for a line-by-line rewrite in that
> pass.

**Choose a world. Rewrite its story.**

ANIME//SIM is an original, unofficial fan-made prototype: a story-driven 2D anime life
simulator that blends a visual novel, a lightweight social-strategy game, and a compact
turn-based RPG. Players build a custom protagonist and drop into one of two original
branching worlds:

- **Elite Academy** — a psychological, competitive boarding-school drama about class
  rankings, private points, trust, and quiet manipulation.
- **Aincrad** — a survival-tactical floating-castle MMO where logout has been disabled and
  every floor boss raid has real consequences.

This is a fan-made, noncommercial prototype. **No copyrighted artwork, music, dialogue,
scripts, or character likenesses are used anywhere in this project.** Every character,
location, item, and line of dialogue is an original creation written to evoke the general
*atmosphere* of competitive-school and trapped-MMO stories — see
[Asset & License Notes](#asset--license-notes) below.

---

## Table of Contents

- [Feature List](#feature-list)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Local Setup](#local-setup)
- [Available Commands](#available-commands)
- [Project Architecture](#project-architecture)
- [Content-Authoring Guide](#content-authoring-guide)
- [Dialogue Format](#dialogue-format)
- [Save System](#save-system)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Asset & License Notes](#asset--license-notes)
- [Current Scope & Roadmap](#current-scope--roadmap)

---

## Feature List

**Shared systems**
- Full character creator (name, pronouns, 7 hairstyles/colors/eyes/skin tones/faces/
  outfits/accessories, 8 personality archetypes, strengths/weaknesses, optional background,
  4 difficulty modes) with a live procedural pixel-avatar preview.
- Data-driven dialogue engine: branching choices, stat/relationship/flag/item/quest
  conditions, hidden vs. visible requirement labels, bluff and silence options, inner
  monologue, interruptions, timed choices, animated typewriter text with adjustable speed,
  skip, auto-advance, and full dialogue history.
- Relationship system tracking **7 independent axes** per NPC (affection, trust, respect,
  fear, suspicion, rivalry, loyalty) plus known secrets, shared memories, and a derived mood
  — not a single heart meter.
- Persistent story-flag and quest system with reusable conditions/effects shared by both
  worlds (`modifyStat`, `modifyRelationship`, `addItem`, `setFlag`, `startQuest`,
  `changeLocation`, `triggerBattle`, `sendMessage`, `unlockCodex`, and more).
- Canvas-based top-down exploration with WASD/arrow movement, click-to-move, on-screen
  mobile D-pad, collision, interactables, hidden items, and map transitions.
- Turn-based combat: attack, skills (with a tap-timing bonus window), guard, dodge, items,
  analyze, escape, status effects, cooldowns, and multi-phase boss fights.
- In-game handheld device (a school phone in Elite Academy, a system window in Aincrad)
  with Messages, Contacts, Quests, Stats, Inventory, and Map tabs.
- Codex, 22 achievements (several hidden), settings (audio, dialogue speed/auto-advance,
  reduced motion, high contrast, dyslexia font, text size, colorblind mode, screen shake,
  minigame assist), chapter recap screens with cross-playthrough comparison, and patch notes.
- IndexedDB-backed saves (Dexie.js) with multiple slots, autosave, JSON import/export, and
  full Zod validation on load/import.
- A development-only debug panel (stat/flag editors, teleport, quest triggers, state export).

**Elite Academy**
- **10 full chapters**, start to finish: *The First Ranking* (Ch.1, deepest — 8 major NPCs, an
  investigation route, a hidden hint-gated subplot, a romance thread, a betrayal path, and the
  **Consensus Trial** special exam with multiple winning strategies) through *The Final Ranking*
  (Ch.10, year's end). Chapters 2–10 each add their own special exam or event — the Nomination
  Exam, the Away Exam, Midterms vs. Class 1-A, the Trade War market exam, the Watcher's identity
  reveal — with a meaningful decision and its own outcome.
- A chapter-progression system: a "Next Chapter" flow from the recap screen, a per-save
  unlocked-chapter list, and a Chapters tab on the in-game device to jump back into any of them.

**Aincrad**
- **10 full floors/chapters**: *The Locked Sky* (Floor 1, deepest — 8 major NPCs, a training
  quest, guild recruitment across 3 original guilds or a solo route, a hidden quest, and a full
  boss raid with pre-raid planning and a mid-raid decision) through *The Tenth Gate* (Floor 10,
  this slice's milestone finale). Each floor has its own town, field/dungeon, mini-boss, floor
  boss, and local NPC.
- 15 major NPCs total, 17 equipment items, 10 consumables, 24 common enemies, 10 mini-bosses,
  10 floor bosses, 3 guilds, and a lightweight crafting-adjacent economy (col, shops, materials).

## Screenshots

*(Add screenshots here — e.g. `docs/screenshots/title.png`, `worldselect.png`,
`dialogue.png`, `exploration.png`, `combat.png`, `device.png`.)*

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, client-rendered SPA shell) |
| Language | TypeScript (strict mode) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| State | Zustand |
| Persistence | Dexie.js (IndexedDB) + `localStorage` fallback for settings |
| Validation | Zod (content, saves, imports) |
| Exploration/Combat rendering | HTML5 Canvas (tile/wall layer) + DOM overlay (icons, portraits) |
| Icons | lucide-react |
| Audio | Howler.js + original synthesized placeholder SFX |
| Testing | Vitest + Testing Library |

Why not Phaser/PixiJS? The exploration and combat "sprites" in this MVP are original flat
geometric placeholders (colored shapes + icons), not sprite sheets, so a full game-engine
dependency wasn't justified — a small custom Canvas + DOM engine (see
[`src/engine/`](src/engine/)) keeps movement, collision, and rendering fast and dependency-light
while staying easy to swap for Phaser later if hand-drawn sprite sheets are added (the engine
and content layers don't know or care how tiles are rendered).

## Local Setup

Requires Node 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The game boots straight into the title
screen sequence — no backend, database server, or API keys required. Everything runs and
saves locally in the browser.

## Available Commands

```bash
pnpm dev          # start the dev server
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint         # ESLint
pnpm test         # run the Vitest suite once
pnpm test:watch   # Vitest in watch mode
```

## Project Architecture

```
src/
  app/                  Next.js App Router shell (layout, globals, single page entry)
  components/
    ui/                 Design-system primitives (Panel, RetroButton, StatBar, Modal, Icon…)
    screens/             Menu-level screens (Title, WorldSelect, CharacterCreator, Codex…)
    game/                In-game views (DialogueView, ExplorationView, CombatView, DeviceMenu…)
    GameRoot.tsx         Top-level screen switch, driven entirely by Zustand state
  engine/
    combat.ts            Pure combat resolution (damage, skills, status effects, boss phases)
    exploration.ts        Pure movement/collision/camera helpers for the Canvas map view
  state/
    gameStore.ts          The single Zustand store: screens, save data, dialogue navigation,
                           combat runtime, notifications, debug actions
  content/
    registry.ts           Aggregates + Zod-validates all content into typed, indexed lookups
    achievements.ts, codex.ts, patchnotes.ts, messages.ts
    worlds/elite-academy/  npcs, items, quests, classes, maps, scenes, chapter definition
    worlds/aincrad/        npcs, items, skills, enemies, guilds, floors, encounters, maps,
                            scenes, chapter definition
  types/                  Zod schemas + inferred TypeScript types for every content shape
  lib/                    conditions.ts, effects.ts, save.ts, db.ts, achievements.ts, utils.ts
  audio/                  Howler.js wrapper
  tests/                  Vitest suite + shared fixtures
public/audio/             Original synthesized placeholder SFX (see below)
```

**Separation of concerns:** narrative content (`content/`) is plain, Zod-validated data — it
imports nothing from `components/` or `state/`. Game rules live in `lib/` (pure functions:
`applyEffects`, `evaluateConditions`) and `engine/` (pure functions: combat resolution,
movement/collision). The Zustand store is the only place that ties content + rules + React
together, and it exposes a small, intentional action surface (`selectChoice`, `interact`,
`startCombat`, …) rather than letting components reach into content or rules directly.

## Content-Authoring Guide

All narrative/world content lives under `src/content/worlds/<world>/` as plain TypeScript
data files, typed against **`*Input`** variants of the Zod schemas (e.g. `SceneInput`,
`NpcDefinitionInput`) so authors don't have to repeat every default value. Everything is
parsed and validated through the full schema in `content/registry.ts` at import time — an
invalid scene, a dangling item reference, or a malformed condition fails loudly during
`pnpm dev`/`pnpm build`, not silently at runtime.

To add a new NPC, quest, item, enemy, map, or scene: add an entry to the relevant file in
`content/worlds/<world>/`, then reference its `id` from wherever it's needed (a map's
`interactables`, a scene's `effects`, an encounter's `enemyIds`, etc.). Nothing needs to be
registered a second time — `registry.ts` aggregates every world's arrays automatically.

To add a new **floor** in Aincrad: add a `FloorDefinitionInput` to `worlds/aincrad/floors.ts`
(set `locked: true` and an `unlockFlag` for a preview-only floor), and optionally its
town/field/dungeon/boss maps, enemies, and an encounter. The floor list UI already reads this
data generically.

## Dialogue Format

A **Scene** (`SceneInput`, see `types/narrative.ts`) is a flat list of **nodes**
(`DialogueLineInput`) with a `startNode` and optional `altEntryNodes`:

```ts
{
  id: "ea-scene-example",
  worldId: "elite-academy",
  chapterId: "ea-ch1",
  title: "Example",
  startNode: "n1",
  nodes: [
    {
      id: "n1",
      speakerId: "ea-rei",             // looked up in content/worlds/elite-academy/npcs.ts
      expression: "cold",
      text: "...",
      effects: [{ type: "setFlag", flag: "met-rei" }],  // applied the moment this node is shown
      choices: [
        {
          id: "c1",
          text: "Push back.",
          conditions: [{ type: "minStat", stat: "courage", value: 6 }],
          requirementLabel: "Requires Courage 6",
          effects: [{ type: "modifyRelationship", npcId: "ea-rei", axis: "respect", delta: 4 }],
          goTo: "n2",                   // node id to jump to; omit to end the scene
        },
      ],
    },
  ],
}
```

Key points:
- **Node-level `effects`** fire automatically the instant that node is entered (flags, codex
  unlocks, stat changes, `changeLocation`, `triggerBattle`, `goToScene`, …). **Choice-level
  `effects`** fire when the player picks that choice. Both go through the same
  `applyEffects`/navigation pipeline in `state/gameStore.ts`, so a node's effects can redirect
  straight into exploration or a battle without any extra wiring.
- A node with no `choices` auto-advances via `next` when clicked, or ends the scene
  (returning to exploration/the device) if `next` is unset.
- **`altEntryNodes`** let one scene serve first-visit vs. revisit content: list candidate
  node ids in priority order, and the engine enters at the first one whose own `conditions`
  pass, falling back to `startNode`. See `ea-scene-ranking-board` for a 3-way example (never
  met the teacher / penalty not yet revealed / already seen).
- Conditions and effects are the same reusable, typed union used everywhere (map
  interactables' `requiresFlag`, quest objectives, etc.) — see `types/narrative.ts` for the
  full `Condition`/`Effect` unions.

## Save System

Saves are persisted to **IndexedDB via Dexie.js** (`lib/db.ts`), validated against
`SaveGameSchema` on every load (`lib/save.ts`). Every meaningful state change autosaves to
the current slot **and** to a dedicated `autosave` slot, so "Continue" from the title screen
always resumes the most recent state regardless of which numbered slot you're on.

- **Multiple slots**, each with a summary (player name, world, chapter, playtime,
  timestamp, thumbnail) shown in the Load Game screen.
- **Export/Import**: export downloads the raw validated JSON; import re-validates it through
  the full Zod schema before it's written to IndexedDB — a corrupted or hand-edited file that
  doesn't match the schema is rejected with an error, not silently accepted.
- **Settings-only `localStorage` fallback**: audio/accessibility/dialogue settings can be
  changed from the title screen (before any save exists) and are read back the next time you
  create or continue a game.
- **Survival mode**: on defeat, if a safe-zone checkpoint has been set, the run rewinds to it
  instead of ending — no save is ever deleted by losing a fight.

## Deployment

The app is a fully client-side SPA (no server routes, no database, no required environment
variables) and deploys to Vercel with zero configuration:

```bash
vercel deploy        # preview
vercel --prod         # production
```

Or connect the repository in the Vercel dashboard and it will build with `next build`
automatically. It also builds to a static-export-compatible client bundle if you need to
host it elsewhere — see [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
if you go that route (not required for Vercel).

## Environment Variables

None are required to run or deploy the game. One optional flag:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_ENABLE_DEBUG` | Set to `"true"` to show the developer debug panel in a production build. It's always shown automatically in `pnpm dev`. |

## Testing

```bash
pnpm test
```

56 Vitest tests cover: condition evaluation (stat/flag/relationship/item/quest checks across
core, world-specific, and currency-style stats), effect application (stat clamping,
relationship deltas + derived mood, inventory add/remove, flag/quest transitions, navigation
commands), save export/import round-tripping and schema rejection of malformed/out-of-range
data, combat (damage, guarding, skills, stamina gating, status effects, boss phase
escalation, victory/defeat detection), dialogue scene-entry routing (`altEntryNodes`), and
chapter-outcome/achievement derivation. See `src/tests/`.

## Asset & License Notes

- **No copyrighted material is included.** All characters, world names, locations, dialogue,
  items, and lore in this repository are original creations. Any resemblance to existing
  anime, manga, or games is unintentional atmospheric homage, not reproduction.
- **Art**: there are no sprite-sheet or illustration assets. Characters and NPCs render as
  procedurally-composed flat SVG/CSS placeholders (`components/game/PixelAvatar.tsx`) and
  colored icon markers, driven entirely by the character-creator/NPC data — this keeps the
  bundle tiny and makes it straightforward to swap in licensed or hand-drawn sprite sheets
  later without touching any game logic.
- **Audio**: `public/audio/*.wav` are short, original tones synthesized directly (sine/
  square/triangle waves), not sourced from any library or recording. No music tracks are
  bundled; the audio system is fully wired for music/ambience categories so tracks can be
  dropped in later. The game is completely playable with audio disabled.
- **Branding**: the ANIME//SIM wordmark and the pixel emblem in `public/favicon.svg` are
  original.

## Current Scope & Roadmap

This is a **vertical slice**, not an infinite 100-floor/many-year game. What's genuinely
playable end-to-end today:

- ✅ Boot → title → character creation → world choice → save/load
- ✅ **20 full chapters in both worlds**, start to finish, each with a meaningful decision and
  its own outcome — Elite Academy's Years One and Two, and Aincrad's climb from Floor 1 to the
  Twentieth Spire
- ✅ Exploration, dialogue, combat, relationships, quests, inventory, codex, achievements
- ✅ Chapter-to-chapter progression: a "Next Chapter" flow, an unlocked-chapter list per save,
  and a Chapters tab on the in-game device
- 🔒 Aincrad Floors 21+ aren't built; this slice's climb ends at the Twentieth Spire
- 🔒 Elite Academy's arc ends at Year Two's close; a third year isn't built
- ✅ Chapters/floors 2–10 in both worlds have been deepened to Chapter One's density — multiple
  NPC beats, hidden/bonus scenes, a 2–4 option decision, and a reactive multi-branch close in
  every chapter
- ℹ️ Chapters/floors 11–20 are moderate-depth (matching how 2–10 first shipped, before being
  deepened) rather than Chapter One's full density — see Patch Notes for specifics

See [`content/patchnotes.ts`](src/content/patchnotes.ts) (rendered in-game under Patch Notes)
for the authoritative, versioned list of what's done, known issues, and what's next.
