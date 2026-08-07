# FEATURES.md

**Re-synced 2026-08-06** against commit `4f6ac3e` ("Expand to 10 full
chapters/floors in both worlds"). The prior version of this file was
written against an in-progress, uncommitted diff that has since been
finished and committed — the "Aincrad Floors 4–10" and "Multi-chapter
navigation" sections below were rewritten from scratch this pass; other
sections were spot-checked and left as-is where still accurate.

Status classifications used below: **Verified complete** / **Mostly
complete** / **Partially implemented** / **UI only** / **Backend only** /
**Mocked** / **Planned** / **Broken** / **Deprecated** / **Unable to
verify**. Nothing is marked "Verified complete" unless its full flow (data
→ engine/lib → store → UI → persistence) was actually traced through the
code. No runtime/browser testing was performed this session either (no dev
server was started) — features below are verified by code inspection and
by the automated test suite (62/62 passing), not by clicking through the
app. Where that distinction matters it's called out explicitly.

---

## Character Creator

- **Purpose:** Build a custom protagonist (name, pronouns, appearance,
  personality, strengths/weaknesses, optional background, difficulty).
- **User flow:** `WorldSelectScreen` → `CharacterCreatorScreen` → fills
  form → `startNewGame()`.
- **Status: Mostly complete.** Full UI form
  (`CharacterCreatorScreen.tsx`, 235 lines) → `CharacterCreatorInput` (Zod,
  `types/character.ts`) → `createPlayerFromCreator()` builds the initial
  `Player` object → `gameStore.ts`'s `startNewGame()` builds the initial
  `SaveGame` and persists it. Traced end-to-end through the code.
  Downgraded from "Verified complete" only because no runtime/browser
  click-through was performed this session.
- **Frontend:** `src/components/screens/CharacterCreatorScreen.tsx`.
- **Backend/logic:** `src/types/character.ts` (`createPlayerFromCreator`),
  `src/state/gameStore.ts` (`startNewGame`).
- **DB dependencies:** writes the first save via `persistSave`.
- **Validation:** `CharacterCreatorInput`/`PlayerSchema` (Zod).
- **Known issues:** none found.

## Data-driven dialogue engine

- **Purpose:** Branching dialogue with conditions/effects, hidden vs.
  visible requirement labels, bluff/silence options, inner monologue,
  interruptions, timed choices, typewriter text, skip/auto-advance,
  history.
- **Status: Mostly complete** for the mechanics actually exercised by
  Chapter One content in both worlds (traced via `DialogueView.tsx`,
  `gameStore.ts`'s `selectChoice`/`advanceToNode`/`_settleAtNode`,
  `lib/conditions.ts`, `lib/effects.ts`, and the `dialogueEngine.test.ts`
  suite, which specifically covers `altEntryNodes` first-visit/revisit
  routing). Not independently verified: every combination of bluff/
  silence/timed-choice UI states in a live browser.
- **Frontend:** `src/components/game/DialogueView.tsx`.
- **Backend/logic:** `src/state/gameStore.ts` (`selectChoice`,
  `advanceToNode`, `_settleAtNode`, `_resolveEffects`,
  `resolveSceneEntry`), `src/lib/conditions.ts`, `src/lib/effects.ts`.
- **Content:** `src/types/narrative.ts` (schema), `content/worlds/*/scenes.ts`.
- **Tests:** `src/tests/dialogueEngine.test.ts`, `src/tests/conditions.test.ts`,
  `src/tests/effects.test.ts`.
- **Known issues:** none currently found. (Prior known issue — Floor 4–10
  map interactables referencing nonexistent scene IDs — was fixed in
  commit `4f6ac3e`; verified this session via grep, all 21 previously-
  missing scene IDs now exist.) A real navigation-timing bug (a node's own
  `effects` navigating away before its own text displayed) was found and
  fixed in the same commit — see `src/tests/dialogueNavigation.test.ts`
  for the regression coverage.

## Relationship system (7 axes)

- **Purpose:** Track affection, trust, respect, fear, suspicion, rivalry,
  loyalty per NPC, plus a derived mood, rather than one heart-meter.
- **Status: Verified complete** for the mechanism. `RelationshipStateSchema`
  (`types/npc.ts`), `modifyRelationship` effect (`lib/effects.ts`, clamps
  to ±100, recomputes `mood` via `moodFromRelationship`), consumed by
  `relationship` conditions (`lib/conditions.ts`) and rendered in
  `DeviceMenu.tsx`'s Contacts tab and `ChapterRecapScreen.tsx`'s "top
  relationships" summary. No automated test directly targets
  `moodFromRelationship`'s thresholds, but `effects.test.ts` covers the
  delta/clamp logic.
- **Known issues:** none found.

## Story-flag and quest system

- **Purpose:** Persistent flags and quests with shared, reusable
  conditions/effects across both worlds.
- **Status: Verified complete** for the mechanism. `flags: string[]` +
  `quests: QuestProgress[]` on `SaveGame`, mutated only via
  `setFlag`/`clearFlag`/`startQuest`/`completeQuest` effects
  (`lib/effects.ts`), read via `flag`/`missingFlag`/`questState`
  conditions (`lib/conditions.ts`). Covered by `effects.test.ts` and
  `conditions.test.ts`.
- **Known issues:** `changeClassPoints` effect type exists in the schema
  but its handler in `lib/effects.ts` is a documented no-op (`// class
  points tracked separately in world content registry / store extension`)
  — if any authored scene uses it, it silently does nothing. Not touched
  by the uncommitted diff; found via a full read of `effects.ts`.

## Canvas-based exploration

- **Purpose:** Top-down movement (WASD/arrows, click-to-move, mobile
  D-pad), collision, interactables, hidden items, map transitions.
- **Status: Mostly complete.** `ExplorationView.tsx` (285 lines, the app's
  only Canvas-rendering code) + `engine/exploration.ts` (collision,
  camera, nearest-interactable, input vector — all pure, easily testable
  functions, though none currently have dedicated unit tests — see
  `TESTING.md` coverage gaps) + `gameStore.ts`'s `moveToMap`/`interact`.
  Not runtime-verified in a browser this session.
- **Known issues:** none currently found. (Prior known issue — Floor 4–10
  field maps' "Prepare for the Boss Raid" and town maps' NPC-intro
  triggers pointing at nonexistent scene IDs — was fixed in `4f6ac3e`.)

## Turn-based combat

- **Purpose:** Attack, skills (with a tap-timing bonus window), guard,
  dodge, items, analyze, escape, status effects, cooldowns, multi-phase
  boss fights.
- **Status: Verified complete** for the mechanism (Floors 1–3's content).
  `engine/combat.ts` (339 lines, pure) fully covered by
  `src/tests/combat.test.ts` (damage, guarding, skills, stamina gating,
  status effects, boss phase escalation, victory/defeat detection) and
  wired end-to-end through `gameStore.ts`'s `doPlayer*`/`startCombat`/
  `resolveCombatEnd` actions and `CombatView.tsx`.
- **Known issues:** none found for Floors 1–3. Floor 4–10 enemies/
  encounters are now committed (`4f6ac3e`) and reachable from the UI via
  the chapter-navigation flow (see "Aincrad Floors 4–10" below) — the
  data has been verified structurally (present, internally consistent
  with the Floor 1–3 pattern, chapters/scenes reference real
  encounter/enemy IDs) but not runtime-verified in a live combat
  encounter, since no browser session has been run — **Unable to verify**
  is downgraded to that narrower claim only (not "unreachable").

## In-game device (phone / system window)

- **Purpose:** Messages, Contacts, Quests, Chapters, Stats, Inventory,
  Map, Achievements, Settings tabs, in one modal.
- **Status: Mostly complete.** `DeviceMenu.tsx` reads from the
  store/registry across all 9 tabs (`getNpc`, `getItem`, `getQuest`,
  `getMap`, `getMessageDefinition`, `chaptersForWorld`). The **Chapters
  tab is new as of `4f6ac3e`** — lists every chapter for the save's
  world sorted by `index`, shows locked chapters as `"???"` with a lock
  icon, and lets the player `jumpToChapter()` into any chapter already in
  `save.unlockedChapterIds`. Not runtime-verified in a browser.
- **Known issues:** none found via code inspection.

## Codex, achievements, settings, chapter recap, patch notes

- **Codex:** `CodexScreen.tsx` + `content/codex.ts` + `codexUnlocked` on
  `SaveGame`, unlocked via `unlockCodex` effect. **Mostly complete.**
- **22 achievements:** `content/achievements.ts` + `lib/achievements.ts`
  (generic checks) + scripted `unlockAchievement` effects +
  `AchievementsScreen.tsx`. **Verified complete** for the unlock mechanism
  (both generic and scripted paths traced and partially test-covered).
- **Settings (audio, dialogue speed/auto-advance, reduced motion, high
  contrast, dyslexia font, text size, colorblind mode, screen shake,
  minigame assist, hold-to-skip protection):** `SettingsScreen.tsx` +
  `types/settings.ts` + `localStorage` persistence. **Mostly complete** —
  every listed setting exists in `SettingsSchema` and is read somewhere
  (accessibility ones via `GameShell.tsx`'s `data-*` attribute sync,
  audio ones via `audioManager.updateSettings`); `colorblindMode` and
  `minigameAssist` were not traced to any actual CSS/behavior change
  beyond being stored — **Unable to verify** whether they currently do
  anything visible, since there's no minigame system found anywhere in
  the codebase to be "assisted."
- **Chapter recap + cross-playthrough comparison:**
  `ChapterRecapScreen.tsx` + `localStorage` history. **Mostly complete**
  and now chains across the full 10-chapter arc in both worlds — as of
  `4f6ac3e`, dismissing a recap via the "Next Chapter" button calls
  `advanceChapter()`, which routes to the next chapter's `startSceneId`
  (or falls back to free play gracefully if there's no further chapter,
  e.g. after chapter 10). See "Multi-chapter navigation" below.
- **Patch notes:** `PatchNotesScreen.tsx` + `content/patchnotes.ts`.
  **Verified complete**, and (per this audit) accurate for the committed
  baseline.

## Debug panel

- **Purpose:** Dev-only stat/flag editors, teleport, quest triggers, state
  export.
- **Status: Verified complete**, gated correctly by
  `NODE_ENV === "development" || NEXT_PUBLIC_ENABLE_DEBUG === "true"`
  (`DebugPanel.tsx` line 10).

## Save system (IndexedDB via Dexie)

- **Purpose:** Multiple slots, autosave, JSON import/export with full Zod
  validation, survival-mode checkpoint rewind.
- **Status: Mostly complete.** Traced end-to-end (`lib/db.ts`,
  `lib/save.ts`, `gameStore.ts`'s `saveGame`/`loadGame`/
  `continueFromAutosave`, `SaveSelectScreen.tsx`) and covered by
  `src/tests/save.test.ts` — **except** that test suite currently has 1
  failing test (the export/import round-trip test, broken by the
  uncommitted `unlockedChapterIds` schema change not being reflected in
  the test fixture — see `PROJECT_STATE.md`). Downgraded from "Verified
  complete" specifically because of that failing test.
- **Known issues:** see `PROJECT_STATE.md` for the exact failure.

## Audio

- **Purpose:** SFX via Howler.js; music/ambience categories wired but
  unauthored.
- **Status: Verified complete** for what exists (10 original synthesized
  `.wav` SFX, played via `audioManager.playSfx`, called from
  `RetroButton.tsx` and a few specific game moments). **Planned** for
  music/ambience — the settings and volume sliders exist
  (`musicVolume`/`ambienceVolume` in `SettingsSchema`) but no music/
  ambience files exist in `public/audio/` and no code plays any (verified:
  `AudioManager` class has no `playMusic`/`playAmbience` method, only
  `playSfx`).

---

## World: Elite Academy

### Chapters One through Ten — "The First Ranking" → "The Final Ranking"

- **Purpose:** A full school-year arc across 10 chapters. Chapter One
  ("The First Ranking"): psychological-drama chapter with 8 major NPCs,
  10 locations, an investigation route, a hidden hint-gated subplot, a
  romance thread, a betrayal path, the Consensus Trial special exam, 3
  chapter outcomes. Chapters 2–10 (added in `4f6ac3e`) each add their own
  special exam/event, a meaningful branching decision, and their own
  outcome set — e.g. Ch.2 "The Watcher's Game" (an investigation
  sub-thread), through Ch.10 "The Final Ranking" (3 outcomes: solo
  finish, carry-the-class finish, safe finish).
- **Status: Verified complete** for the chapter chain and navigation
  mechanism specifically (upgraded from "Mostly complete" for that
  narrower claim): all 10 chapters are registered
  (`content/worlds/elite-academy/chapter.ts`, `ea-ch1`…`ea-ch10`), each
  with a real `startSceneId` that resolves to an authored scene in
  `scenes.ts` (verified via grep — all 9 non-ch1 arrival scenes present),
  a `completionFlag`, and a `nextChapterId` chaining to the next (or
  `undefined` at `ea-ch10`, which `advanceChapter()` handles gracefully
  by falling back to free play). `determineEliteChapterOutcome` is
  covered by `src/tests/chapterOutcomes.test.ts` for Chapter One.
  **Mostly complete** remains the right label for the *content depth* of
  chapters 2–10 individually (no runtime playthrough has walked their
  full branching content the way the prior audit's reasoning applied to
  Chapter One) — this is a narrower, more precise split than the prior
  single "Mostly complete" label covered.
- **DB dependencies:** none beyond the standard save system.
- **Known issues:** none currently found for the chain/navigation
  mechanism. (Prior known issue — `nextChapterId: "ea-ch2"` pointing at a
  nonexistent chapter — fixed in `4f6ac3e`; `ea-ch2`...`ea-ch10` all now
  exist.)

## World: Aincrad

### Floors One through Ten — "The Locked Sky" → "The Tenth Gate"

- **Purpose:** A full 10-floor climb. Floor 1 ("The Locked Sky"):
  survival-tactical chapter with 8 major NPCs, a training quest, guild
  recruitment (3 guilds) or solo route, a hidden quest, a full boss raid
  with pre-raid planning and a mid-raid decision, 3 chapter outcomes.
  Floors 2–3 previously offered lighter-depth exploration; Floors 4–10
  (added in `4f6ac3e`) now match the same full pattern as Floors 1–3 —
  each with its own town, field/dungeon, mini-boss, floor boss, and local
  NPC (7 new NPCs, 28 new enemies total across the expansion).
- **Status: Verified complete** for the chapter chain and navigation
  mechanism (same upgrade reasoning as Elite Academy above): all 10
  chapters registered (`content/worlds/aincrad/chapter.ts`, `ai-ch1`…
  `ai-ch10`), each `startSceneId` resolving to a real authored scene
  (verified via grep). All 21 previously-missing Floor 4–10 interactable
  scene IDs (`ai-scene-floor{4-10}-npc-intro`,
  `ai-scene-boss{4-10}-prep`, `ai-scene-boss{4-10}-aftermath`) now exist —
  verified via grep, 3/3 present per floor. The Floor 1 boss raid
  previously had a real bug (never actually started combat); fixed in
  `4f6ac3e` per the commit message (browser-tested, not just
  typechecked).
- **`locked` field note:** floors 2–10 still have `locked: true` in
  `floors.ts` with a progressive `unlockFlag` chain
  (`ai-flag-floor{n-1}-cleared`). This is **not a functional bug** — the
  `locked` field is never actually read by `gameStore.ts` or any
  component (verified via grep); floor-to-floor progression is entirely
  driven by chapter navigation (`advanceChapter()` → `nextChapterId` →
  `startSceneId`), not by a floor-select UI gated on this field. Tracked
  as unused/dead-data tech debt in `TASKS.md` → `TASK-007`, not a
  content-consistency bug.
- **Frontend:** reachable end-to-end via the chapter-navigation flow
  (`ChapterRecapScreen.tsx`'s "Next Chapter" button, or `DeviceMenu.tsx`'s
  new Chapters tab for jumping back to an already-unlocked floor).
- **Backend/logic:** `content/worlds/aincrad/{floors,maps,enemies,
  encounters,chapter,scenes}.ts`, `src/state/gameStore.ts`
  (`advanceChapter`/`jumpToChapter`).
- **Tests:** no test targets Floor 4–10 content specifically (combat/
  encounter data isn't exercised by any existing test), but the shared
  navigation mechanism (`advanceChapter`, node-level navigation deferral)
  is covered by `src/tests/dialogueNavigation.test.ts`.
- **Unable to verify:** actual combat balance/playability of Floor 4–10's
  28 new enemies and their encounters — structurally present and
  internally consistent with the Floor 1–3 pattern, but not run in a live
  combat session by any recorded agent session.

### Multi-chapter navigation

- **Purpose:** Let a chapter's recap dismissal advance into a
  `nextChapterId`, and track which chapters a save has unlocked
  (`unlockedChapterIds`), so both worlds progress through their full
  10-chapter/floor arc rather than stopping after Chapter/Floor One.
- **Status: Verified complete.** (Upgraded from "Backend only / Broken":
  the prior blockers — no UI caller, no `ch2` to advance into — are both
  resolved as of `4f6ac3e`.)
  - `ChapterRecapScreen.tsx` now calls `advanceChapter()` from a "Next
    Chapter" button (previously only offered "Return to Title") —
    verified by reading the component source.
  - `DeviceMenu.tsx` gained a `ChaptersTab` calling `chaptersForWorld()`
    and `jumpToChapter()`, letting a player revisit any chapter already
    in `save.unlockedChapterIds` — verified by reading the component
    source.
  - Both worlds' full `ch1`...`ch10` chains are registered in
    `content/registry.ts`'s `chapters` array; no dangling
    `nextChapterId` remains (`ch10` in each world has no
    `nextChapterId`, and `advanceChapter()` handles that by falling back
    to free play rather than crashing).
  - `gameStore.ts`'s `GameStoreState` interface additions
    (`leaveCurrentNode`, `_toastAchievements`) — found declared-but-
    unimplemented in the prior audit's Snapshot B — are both implemented
    now (verified by reading the store).
- **Known issues:** none found. Not yet runtime-verified in a live
  browser session (see `TASKS.md` → `TASK-006`).
