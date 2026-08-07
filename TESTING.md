# TESTING.md

## Frameworks

- **Vitest** `^4.1.10` (`vitest.config.mts`: `jsdom` environment, `globals:
  true`, `@/*` alias resolved to `./src`, `@vitejs/plugin-react` for JSX)
- **Testing Library**: `@testing-library/react` `^16.3.2`,
  `@testing-library/jest-dom` `^7.0.0` — **installed but not currently
  used** (see below).
- No E2E framework (no Playwright/Cypress) is installed or configured.

## Test structure

All tests live in `src/tests/` (flat, no nested suites-by-feature
directories), matched by `vitest.config.mts`'s `include:
["src/tests/**/*.test.ts", "src/tests/**/*.test.tsx"]`. Six test files, one
shared fixture file:

| File | Covers |
|---|---|
| `src/tests/fixtures.ts` | `makeSave(overrides?)` — shared `SaveGame` builder used by every other test file. **Currently missing the `unlockedChapterIds` field, causing 1 `tsc` error and 1 `vitest` failure — see `PROJECT_STATE.md`.** |
| `src/tests/conditions.test.ts` | `evaluateConditions`/`evaluateCondition` (`lib/conditions.ts`) — stat/flag/relationship/item/quest checks across core, world-specific, and currency-style stats. |
| `src/tests/effects.test.ts` | `applyEffects` (`lib/effects.ts`) — stat clamping, relationship deltas + derived mood, inventory add/remove, flag/quest transitions, navigation commands. |
| `src/tests/combat.test.ts` | `engine/combat.ts` — damage, guarding, skills, stamina gating, status effects, boss phase escalation, victory/defeat detection. |
| `src/tests/save.test.ts` | `lib/save.ts`'s `exportSave`/`importSave` round-tripping and schema rejection of malformed/out-of-range data. **1 of these tests currently fails.** |
| `src/tests/dialogueEngine.test.ts` | `resolveSceneEntry`'s `altEntryNodes` first-visit/revisit routing (`gameStore.ts`). |
| `src/tests/chapterOutcomes.test.ts` | `determineEliteChapterOutcome`/`determineAincradChapterOutcome` (`content/worlds/*/chapter.ts`). |

**No test imports anything from `src/components/`** — despite Testing
Library being installed, zero component-render tests exist. Everything
tested is a pure function (engine/lib) or a pure derivation
(chapter-outcome logic). This is a real coverage gap for anything UI-level
— see "Coverage gaps" below.

## Existing test results (this audit, 2026-08-06)

```
$ pnpm test   (vitest run)

 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 55 passed (56)
```

The one failure: `src/tests/save.test.ts` → "round-trips a save through
export/import without loss." Root cause: `SaveGameSchema` now fills in
`unlockedChapterIds: []` on parse (from the uncommitted schema change),
but the test's input `save` object (built via `fixtures.ts`'s `makeSave()`)
doesn't have that field, so `expect(imported).toEqual(save)` fails on an
extra key. See `PROJECT_STATE.md` for the exact diff output.

## Coverage gaps

- **No component/UI tests** — `DialogueView`, `ExplorationView`,
  `CombatView`, `DeviceMenu`, every `screens/*` component, etc. are
  entirely untested beyond what the pure `lib`/`engine` functions they
  call cover indirectly.
- **`src/engine/exploration.ts` has zero dedicated tests** — inconsistent
  with every other pure-function module in the codebase (`combat.ts`,
  `conditions.ts`, `effects.ts` are all fully covered). See `TASKS.md`.
- **No test covers the Floor 4–10 content** (uncommitted) at all — it's
  new content on top of an already-tested engine, but the content itself
  (correct enemy IDs referenced, correct map wiring) has no automated
  check, which is part of why its dangling-scene-reference bug wasn't
  caught by `pnpm test`.
- **No content cross-reference integrity test** — e.g. nothing asserts
  every `sceneId` referenced by a map interactable actually resolves via
  `getScene()`. Adding one (even as a simple test, separate from a runtime
  registry check — see `ARCHITECTURE.md` risk #3 / `TASKS.md` `TASK-003`)
  would have caught the Floor 4–10 issue immediately.
- **`gameStore.ts`'s store actions themselves are not directly unit
  tested** — `dialogueEngine.test.ts` tests `resolveSceneEntry` (an
  exported plain function within `gameStore.ts`), but the Zustand actions
  themselves (`selectChoice`, `interact`, `startCombat`, etc.) have no
  direct test coverage; they're only exercised transitively through
  whatever `lib`/`engine` functions they call.

## Manual test steps / fixtures

No documented manual test script existed before this audit. `fixtures.ts`
(`makeSave()`) is the only test fixture and contains no secrets (a
synthetic `"Test Player"` character).

## Commands

```bash
pnpm test          # vitest run — run once
pnpm test:watch    # vitest — watch mode
npx tsc --noEmit -p tsconfig.json   # not a package.json script; run directly
pnpm lint
pnpm build          # also runs the TypeScript check as part of `next build`
```

## Known flaky tests

None identified — the test suite is deterministic (no `Math.random()`-
dependent assertions were found in the failing/passing test set; where
`Math.random()` is used in production code, e.g.
`engine/combat.ts`'s enemy target selection and status-effect chance, the
tests avoid asserting on those specific outcomes based on a spot-check of
`combat.test.ts`'s structure — not exhaustively re-verified line by line
this session).

## Pre-release checklist

Not previously documented. Recommended, based on what's actually
verifiable in this repo:

1. `npx tsc --noEmit -p tsconfig.json` — 0 errors.
2. `pnpm lint` — 0 errors/warnings.
3. `pnpm test` — all tests pass.
4. `pnpm build` — completes without error.
5. Manual smoke test (below) in an actual browser — none of the above
   catch a runtime-only bug (e.g. a broken click handler, a CSS layout
   break, an unhandled exception).
6. Confirm `NEXT_PUBLIC_ENABLE_DEBUG` is unset in the target deploy
   environment (see `SECURITY.md`).

## Manual smoke-test checklist for core user flows

Not run this session (no dev server was started, per the audit's
non-destructive/no-long-running-process constraint). This checklist is
recommended for whoever next has a running browser available:

- [ ] `pnpm dev`, confirm the boot sequence plays and reaches the title
      screen without console errors.
- [ ] "New Game" → World Select → pick Elite Academy → Character Creator →
      confirm the game enters Chapter One's opening scene.
- [ ] Make a dialogue choice with a visible condition/requirement label;
      confirm it's correctly enabled/disabled based on current stats.
- [ ] Move around an exploration map with WASD, then with click-to-move,
      then with the on-screen mobile D-pad (resize/emulate a touch
      viewport).
- [ ] Trigger a combat encounter; use attack, a skill, guard, dodge, an
      item, analyze, and (in a non-boss encounter) escape.
- [ ] Open the device (Messages/Contacts/Quests/Stats/Inventory/Map/
      Awards/System tabs) and confirm each tab renders without error.
- [ ] Reach Chapter One's ending in Elite Academy; confirm the recap
      screen shows the correct outcome and "Return to Title" works.
- [ ] Repeat "New Game" for Aincrad; confirm the training quest, guild
      recruitment (or solo route), and Floor 1 boss raid all work,
      including the pre-raid planning step and the mid-raid decision.
- [ ] Save mid-playthrough, reload the page, "Continue" from the title
      screen; confirm state resumes exactly.
- [ ] Export a save, then import it back (into a different slot);
      confirm it round-trips.
- [ ] Toggle each accessibility setting (reduced motion, high contrast,
      dyslexia font, text size, colorblind mode) and visually confirm
      each one's effect — this is also how to resolve the "Unable to
      verify" flags in `UI_SYSTEM.md`/`FEATURES.md` around
      `colorblindMode`/`minigameAssist`.
- [ ] **If TASK-001 (Floor 4–10 work) has been fixed:** walk from Floor 3
      into Floor 4, confirm the town/field maps load, fight a common
      encounter and the mini-boss, and confirm the boss-raid-prep trigger
      leads somewhere real (not a silent no-op).
