# FILE_MAP.md

Practical map of the important files/groups in this repo. "Edit risk" is
relative to this codebase, not absolute.

## Core app shell

| Path | Purpose | Called by | Calls | Edit risk |
|---|---|---|---|---|
| `src/app/layout.tsx` | Root layout: fonts, metadata, viewport, imports `globals.css` | Next.js router | — | Low |
| `src/app/page.tsx` | The entire route; renders `GameRoot` | Next.js router | `GameRoot` | Low |
| `src/components/GameRoot.tsx` | Top-level screen switch, driven by `screen` in the store | `page.tsx` | every top-level screen component, `useGameStore` | Medium — touched by any new top-level screen |

## State

| Path | Purpose | Called by | Calls | Edit risk |
|---|---|---|---|---|
| `src/state/gameStore.ts` | The single Zustand store: screens, save data, dialogue/scene navigation, combat runtime, notifications, debug actions, chapter navigation | Nearly every component | `content/registry.ts`, `lib/conditions.ts`, `lib/effects.ts`, `lib/achievements.ts`, `lib/save.ts`, `engine/combat.ts` | **High** — central orchestration; `_resolveEffects`/`_settleAtNode` are the scene-navigation pipeline every scene routes through |

## Content (data, not code)

| Path | Purpose | Called by | Calls | Edit risk |
|---|---|---|---|---|
| `src/content/registry.ts` | Aggregates + Zod-validates every world's content into typed, indexed `Map` lookups (`getNpc`, `getScene`, `getMap`, `getItem`, `getEnemy`, `getEncounter`, `getChapter`, `getAchievement`, `chaptersForWorld`, `floorsSorted`, …) | `gameStore.ts`, most `components/game/*` and `components/screens/*` | every `content/worlds/*` file | **High** — a bug here breaks content lookups app-wide; adding a new content array requires wiring it through here |
| `src/content/worlds/elite-academy/*.ts` | Elite Academy's NPCs, items, quests, classes, maps, scenes, chapter definition | `registry.ts` | — (plain data) | Low to add new entries; Medium to restructure existing ones (scene/quest IDs are referenced elsewhere by string) |
| `src/content/worlds/aincrad/*.ts` | Aincrad's NPCs, items, skills, enemies, guilds, floors, encounters, maps, scenes, chapter definition | `registry.ts` | — (plain data) | Same as above. **`floors.ts`/`maps.ts`/`enemies.ts`/`encounters.ts` currently have uncommitted, partially-broken Floor 4–10 additions — see `PROJECT_STATE.md` before touching these** |
| `src/content/achievements.ts` | 22 achievement definitions | `registry.ts`, `lib/achievements.ts` | — | Low |
| `src/content/codex.ts` | Codex/lore entries | `registry.ts` | — | Low |
| `src/content/messages.ts` | In-device message templates | `lib/effects.ts` (`sendMessage` effect), `DeviceMenu.tsx` | — | Low |
| `src/content/patchnotes.ts` | Versioned patch-notes data, rendered in `PatchNotesScreen` — the authoritative in-app "what's done / known issues / upcoming" list | `PatchNotesScreen.tsx` | — | Low, but **keep in sync with reality** — it currently describes the committed baseline accurately but not the uncommitted Floor 4–10 work |

## Game rules (pure functions)

| Path | Purpose | Called by | Calls | Edit risk |
|---|---|---|---|---|
| `src/lib/conditions.ts` | `evaluateCondition(s)` — the single implementation of every `Condition` type (`minStat`, `relationship`, `hasItem`, `flag`, …) | `gameStore.ts` (scene entry routing), scene/map content indirectly via the store | `registry.ts` types only | **High** — a change here changes what every authored scene/choice/interactable considers "available" |
| `src/lib/effects.ts` | `applyEffects(save, effects)` — the single implementation of every `Effect` type (`modifyStat`, `modifyRelationship`, `addItem`, `setFlag`, `startQuest`, `changeLocation`, `triggerBattle`, `sendMessage`, `unlockCodex`, `changeReputation`, `goToScene`, `unlockAchievement`, `changeClassPoints` [no-op, see `CLAUDE.md` known issues]) | `gameStore.ts` | `registry.ts` (`getMessageDefinition`), `types/npc.ts` (`freshRelationship`) | **High** — same reasoning as above; this is the entire consequence engine |
| `src/lib/achievements.ts` | `checkGenericAchievements(save)` — non-scene-scripted achievement unlock checks, run after every effect batch | `gameStore.ts`'s `_resolveEffects` | — | Low to add a new generic check; verify the achievement ID also exists in `content/achievements.ts` |
| `src/lib/save.ts` | Save CRUD + validation (`persistSave`, `loadSaveSlot`, `deleteSaveSlot`, `exportSave`, `importSave`, `listSaveSlots`, `toSummary`), settings `localStorage` helpers | `gameStore.ts`, `SaveSelectScreen.tsx`, `GameRoot.tsx` | `lib/db.ts`, `types/save.ts` | **High** — see `CLAUDE.md` → "DO NOT CHANGE WITHOUT REVIEW" re: `SaveGameSchema` backward compatibility |
| `src/lib/db.ts` | The Dexie database class + singleton instance | `lib/save.ts` | — | Medium — schema/version changes need a Dexie `.version(N).stores(...)` migration, not an in-place edit |
| `src/lib/utils.ts` | `cn()` (class-name join), `formatPlaytime`, `formatTimestamp`, `uid()` (monotonic-ish ID generator) | Widely used across components | — | Low |

## Engine (pure functions, runtime state)

| Path | Purpose | Called by | Calls | Edit risk |
|---|---|---|---|---|
| `src/engine/combat.ts` | Turn-based combat resolution: damage formula, skills, guard/dodge, items, analyze, escape, status effects, boss phase escalation, victory grading (S/A/B/C) | `gameStore.ts`'s `doPlayer*`/`startCombat`/`resolveCombatEnd` actions | `registry.ts` (`getEnemy`, `getSkill`) | **High** — game balance lives here (`computeDamage`'s formula, phase bonuses) |
| `src/engine/exploration.ts` | Collision (`rectIntersectsWalls`), camera clamping, nearest-interactable lookup, input→direction vector | `ExplorationView.tsx` | — | Medium |

## Types (Zod schemas + inferred TS types)

| Path | Purpose | Edit risk |
|---|---|---|
| `src/types/save.ts` | `SaveGameSchema` — the on-disk save format | **Critical** — see `CLAUDE.md` |
| `src/types/world.ts` | `MapDefinitionSchema`, `ChapterDefinitionSchema`, `FloorDefinitionSchema`, `GuildDefinitionSchema`, `ClassDefinitionSchema`, `InteractableSchema` | High |
| `src/types/narrative.ts` | `Scene`/`DialogueLine`/`Choice` schemas, `Condition`/`Effect` unions | **Critical** — the entire dialogue/effect vocabulary |
| `src/types/character.ts` | Player/character-creator schemas, `createPlayerFromCreator` | High |
| `src/types/npc.ts` | NPC + relationship-state schemas, `freshRelationship` | Medium |
| `src/types/quest.ts` | Quest definition/progress schemas | Medium |
| `src/types/item.ts` | Item + inventory-slot schemas | Medium |
| `src/types/combat.ts` | Skill/enemy/encounter schemas | Medium |
| `src/types/achievements.ts` | Achievement/codex schemas | Low |
| `src/types/settings.ts` | `SettingsSchema` + `defaultSettings()` | Medium |
| `src/types/common.ts` | Shared stat-key constants (`CORE_STAT_KEYS`, `ELITE_STAT_KEYS`, `AINCRAD_STAT_KEYS`, `RELATIONSHIP_AXES`), `clamp()` | Medium — widely imported |
| `src/types/content-input.ts` | The `*Input` (`z.input<...>`) type aliases content authors write against | Low to extend, Medium to restructure |
| `src/types/index.ts` | Barrel re-export of every `types/*` module | Low |

## Components — screens (menu-level)

| Path | Purpose | Edit risk |
|---|---|---|
| `src/components/screens/BootScreen.tsx` | Boot sequence animation | Low |
| `src/components/screens/TitleScreen.tsx` | Title screen: Continue/New Game/Settings/Codex/Achievements/Patch Notes/Credits | Low |
| `src/components/screens/WorldSelectScreen.tsx` | Elite Academy vs. Aincrad choice | Low |
| `src/components/screens/CharacterCreatorScreen.tsx` | Full character creator (name, pronouns, appearance, personality, strengths/weaknesses, background, difficulty) | Medium — largest screen file (235 lines) |
| `src/components/screens/SaveSelectScreen.tsx` | Load Game screen: slot list, summaries, delete, import | Medium — touches `lib/save.ts` CRUD directly |
| `src/components/screens/SettingsScreen.tsx` | Audio/dialogue/accessibility settings | Low |
| `src/components/screens/CodexScreen.tsx` | Codex/lore browser | Low |
| `src/components/screens/AchievementsScreen.tsx` | Achievements list | Low |
| `src/components/screens/PatchNotesScreen.tsx` | Renders `content/patchnotes.ts` | Low |
| `src/components/screens/CreditsScreen.tsx` | Credits | Low |

## Components — game (in-game views)

| Path | Purpose | Edit risk |
|---|---|---|
| `src/components/game/GameShell.tsx` | Mode switch + autosave/playtime timer + accessibility attr sync + tab-visibility tracking | **High** — central orchestration for the "game" screen |
| `src/components/game/DialogueView.tsx` | Renders the current scene node: speaker, expression, text (typewriter), choices, inner monologue, interruptions | Medium (266 lines) |
| `src/components/game/ExplorationView.tsx` | Canvas-based top-down map rendering + WASD/click-to-move + mobile D-pad | Medium–High (285 lines, the only Canvas-rendering code in the app) |
| `src/components/game/CombatView.tsx` | Turn-based combat UI: party/enemy panels, action buttons, tap-timing bonus window, log | Medium–High (297 lines) |
| `src/components/game/DeviceMenu.tsx` | In-game handheld device modal: Messages/Contacts/Quests/Stats/Inventory/Map/Awards/System tabs | Medium (266 lines) |
| `src/components/game/HUD.tsx` | Top HUD bar during exploration (location label, HP/Stress bar, device/settings buttons) | Low |
| `src/components/game/ChapterRecapScreen.tsx` | Chapter-end recap: outcome, top relationships, achievements unlocked, cross-playthrough history. **Currently only offers "Return to Title" — does not call the new `advanceChapter()` action** | Medium — this is where the in-progress chapter-nav feature needs wiring |
| `src/components/game/DebugPanel.tsx` | Dev-only debug panel (flag/stat editors, teleport, quest triggers, state export). Gated by `NODE_ENV === "development" \|\| NEXT_PUBLIC_ENABLE_DEBUG === "true"` | Low — dev-only, but be careful not to widen the gate accidentally |
| `src/components/game/NotificationToasts.tsx` | Renders `notifications` from the store as toasts | Low |
| `src/components/game/PixelAvatar.tsx` | Procedural flat SVG/CSS "sprite" from character-creator data | Low–Medium |

## Components — ui (design-system primitives)

| Path | Purpose | Edit risk |
|---|---|---|
| `src/components/ui/Panel.tsx` | Bordered panel with optional title bar | Low |
| `src/components/ui/RetroButton.tsx` | The one button component (4 variants), plays `ui-click` SFX on every click | Low–Medium — widely used, changing its click behavior affects every button in the app |
| `src/components/ui/Modal.tsx` | Modal wrapper (Framer Motion enter/exit) | Low |
| `src/components/ui/StatBar.tsx` | Labeled progress bar | Low |
| `src/components/ui/Badge.tsx` | Small pill badge | Low |
| `src/components/ui/Icon.tsx` | Dynamic `lucide-react` icon-by-name lookup | Low |
| `src/components/ui/ScreenFrame.tsx` | Full-screen scrollable frame wrapper used by most screens | Low |

## Audio

| Path | Purpose | Edit risk |
|---|---|---|
| `src/audio/audioManager.ts` | Thin Howler.js wrapper, SFX-only, no-ops without `window`/if disabled | Low |

## Tests

| Path | Purpose | Edit risk |
|---|---|---|
| `src/tests/fixtures.ts` | `makeSave()` — shared test fixture. **Currently missing `unlockedChapterIds`, causing a `tsc` error and a `vitest` failure — see `PROJECT_STATE.md`** | Low to fix, but must be kept in sync with `SaveGameSchema` |
| `src/tests/conditions.test.ts` | `evaluateConditions` coverage | Low |
| `src/tests/effects.test.ts` | `applyEffects` coverage | Low |
| `src/tests/combat.test.ts` | `engine/combat.ts` coverage | Low |
| `src/tests/save.test.ts` | Save export/import round-trip + schema rejection | Low, but currently has 1 failing test |
| `src/tests/dialogueEngine.test.ts` | Scene-entry routing (`altEntryNodes`) coverage | Low |
| `src/tests/chapterOutcomes.test.ts` | Chapter-outcome derivation coverage | Low |

## Where to make common changes

- **Add a new NPC/item/quest/enemy/map/scene:** add an entry to the
  relevant `src/content/worlds/<world>/*.ts` file, typed against the
  matching `*Input` type from `src/types/content-input.ts`, then reference
  its `id` from wherever needed. No second registration step —
  `src/content/registry.ts` aggregates every world's arrays automatically.
  See `README.md` → "Content-Authoring Guide" for the full spec.
- **Add a new floor in Aincrad:** add a `FloorDefinitionInput` to
  `src/content/worlds/aincrad/floors.ts` (`locked: true` +
  `unlockFlag` for a preview-only floor). Optionally add its
  town/field/dungeon maps, enemies, and encounters. **Before doing this,
  fix and finish the uncommitted Floor 4–10 work already in progress
  rather than starting a parallel approach** — see `PROJECT_STATE.md`.
- **Change game/combat balance:** `src/engine/combat.ts`'s
  `computeDamage()` (the core formula) and each enemy's stats/`phases` in
  `src/content/worlds/aincrad/enemies.ts`.
- **Change dialogue/branching logic:** `src/types/narrative.ts` (schema),
  `src/lib/conditions.ts`/`src/lib/effects.ts` (behavior), the relevant
  `content/worlds/<world>/scenes.ts` (content).
- **Change routing/screens:** there is no URL-based routing —
  `GameRoot.tsx`'s `switch` on `screen` and `gameStore.ts`'s `setScreen()`.
  Add a new `Screen` union member in `gameStore.ts`, a `case` in
  `GameRoot.tsx`, and the screen component itself.
- **Add an environment variable:** none currently needed; if one is added,
  document it in `CLAUDE.md`'s "Environment setup" table, and if it's
  meant to be committed as a template, remember `.gitignore`'s `.env*`
  pattern will swallow a `.env.example` unless a `!.env.example` negation
  line is added.
- **Change styling/design tokens:** `src/app/globals.css` (CSS custom
  properties + Tailwind v4 `@theme inline` block). See `UI_SYSTEM.md`.
- **Change deployment:** none exists yet to change — see `DEPLOYMENT.md`
  for what a first deploy would involve.
