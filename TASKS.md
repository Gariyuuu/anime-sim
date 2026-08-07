# TASKS.md

## Current task

**None in progress.** The prior current task (`TASK-001`, below) is now
**complete** — it was committed as `4f6ac3e` ("Expand to 10 full
chapters/floors in both worlds") since the last documentation pass. See
"Recently completed" for the record, and "Next up" for what to pick up
next. This session (a documentation-only re-sync pass) did not start any
new application-code task.

---

### TASK-001 — Fix the uncommitted Floor 4–10 / multi-chapter work so the tree typechecks, lints, tests, and builds clean again — ✅ COMPLETE (committed as `4f6ac3e`)

- **Status:** Done. What was an in-progress, moving-target uncommitted
  diff (10 → 20 modified files, ~278 → ~3,154 lines) during the prior
  documentation session has since been finished and committed as
  `4f6ac3e` — "Expand to 10 full chapters/floors in both worlds" (26 files
  changed, +2,688/−102).
- **What actually shipped (verified this session, not assumed from the
  commit message):**
  1. Both worlds now have a full 10-chapter chain (`ea-ch1`…`ea-ch10`,
     `ai-ch1`…`ai-ch10`), each with `startSceneId`/`completionFlag`/
     `nextChapterId`/outcomes.
  2. All 21 previously-missing Floor 4–10 scene IDs
     (`ai-scene-floor{4-10}-npc-intro`, `ai-scene-boss{4-10}-prep`,
     `ai-scene-boss{4-10}-aftermath`) are authored in `scenes.ts` —
     verified via grep, 3/3 present per floor.
  3. All 18 non-ch1 chapter `startSceneId`s (9 per world) resolve to real
     scenes — verified via grep.
  4. `ChapterRecapScreen.tsx` now calls `advanceChapter()` from a "Next
     Chapter" button; `DeviceMenu.tsx` gained a `ChaptersTab` calling
     `chaptersForWorld()`/`jumpToChapter()`. Both were previously unwired
     — verified this session that they now are, by reading the component
     source directly.
  5. Two real bugs fixed (per commit message, browser-tested): deferred
     node-level navigation effects (`pendingNodeNavigation` +
     `leaveCurrentNode()`), and the Floor 1 boss raid not actually
     starting combat. New regression test file
     `src/tests/dialogueNavigation.test.ts` covers the first fix.
  6. `npx tsc --noEmit -p tsconfig.json`, `pnpm lint`, `pnpm test` (62/62
     passing, up from 56), and `pnpm build` all pass clean — re-run fresh
     this session against the current `HEAD`.
- **Acceptance criteria:** met in full — the feature is reachable
  end-to-end (chapter recap → "Next Chapter" → next floor/chapter's
  arrival scene; device menu → Chapters tab → jump to any unlocked
  chapter), all four verification commands pass, no dangling
  scene/chapter references remain.
- **Not yet done as part of this task:** a manual browser playthrough
  (see "Testing needed" below) — everything above was verified by code
  inspection + the automated test suite, not by clicking through the app.

---

## Next up

- **TASK-002 — Add a React error boundary.** No error boundary exists
  anywhere in the component tree (verified via grep, still true after
  `4f6ac3e`). An uncaught exception in any game-mode view currently
  crashes the whole app instead of degrading one screen. Priority:
  Medium. Files: `src/components/GameRoot.tsx` or a new wrapper
  component. No dependencies. Not started.
- **TASK-003 — Add a content cross-reference integrity check.** Zod
  validates shape but not that a referenced `sceneId`/`npcId`/`itemId`/
  `mapId` actually exists — this is exactly how the Floor 4–10
  dangling-scene bug (now fixed) went unnoticed for a while during
  development. Priority: Medium, arguably worth promoting to High given
  it just prevented a real bug from being caught earlier. Files:
  `src/content/registry.ts` (add a post-`parseAll` integrity pass).
  Depends on: nothing. Not started.
- **TASK-004 — First deploy.** No deploy has ever been run for this repo
  (no `.vercel/`, no `vercel.json`, no live URL found anywhere). There is
  now substantially more finished, playable content than at the last
  audit (10 chapters/floors in both worlds vs. 1). Priority: Low
  (user-driven — only do this when asked). See `DEPLOYMENT.md`. Not
  started.
- **TASK-006 — Manual browser playthrough of the new content.** No
  automated test covers UI/runtime behavior; Floors 4–10 and Elite
  Academy chapters 2–10 have never been clicked through in a live
  browser by an agent session (per available records). Priority: Medium —
  this is the largest remaining unverified claim now that
  typecheck/lint/test/build are all green. See `TESTING.md`'s smoke-test
  checklist. Not started.

## Blocked

None.

## High priority

- TASK-003 (content cross-reference integrity check — see "Next up").

## Medium priority

- TASK-002, TASK-006 (see "Next up" above).

## Low priority

- TASK-004 (see "Next up" above).
- **TASK-005 — Reconcile `colorblindMode`/`minigameAssist` settings with
  actual behavior.** Both exist in `SettingsSchema` and are exposed in
  `SettingsScreen.tsx`, but neither was traced to any CSS/behavior change
  during the prior audit, and there is no minigame system anywhere in the
  codebase for "minigame assist" to assist. Not touched by `4f6ac3e`.
  Either wire them up or note in `SettingsScreen.tsx`/`patchnotes.ts` that
  they're reserved for future use. Not started.
- **TASK-007 — `floors.ts`'s `locked` field is unread.** Verified this
  session via grep: the `locked: boolean` field on `FloorDefinition` is
  set in content (`true` for Floors 2–10, `false` for Floor 1) but never
  read by `gameStore.ts` or any component — floor progression is actually
  driven entirely by chapter/scene navigation
  (`advanceChapter()`/`nextChapterId`/`startSceneId`), not by a
  floor-select UI gated on this field. Not a functional bug (nothing
  breaks), but it's dead/misleading data — either wire it into a real
  floor-select UI or remove it. Not started.

## Bugs

- **BUG-001** through **BUG-005** (the `maps.ts` typecheck error,
  `fixtures.ts` typecheck error, `save.test.ts` round-trip failure, 21
  missing scene IDs, and dangling `nextChapterId`s tracked in the prior
  audit) — **all fixed**, resolved as part of `4f6ac3e`. Verified this
  session: `tsc`/`test` both pass clean, all 21 scene IDs and both
  `ch2` chapters now exist.
- **BUG-006** — Floor 4–10 flavor-text no longer says "Locked." while
  `locked: true` remains set — **downgraded from "minor content
  inconsistency" to "not a bug"** this session: the `locked` field isn't
  read anywhere in the app (see TASK-007), so there's no UI where the
  mismatch would actually be visible to a player. Tracked as tech debt
  (TASK-007) instead.

## Technical debt

- `changeClassPoints` effect (`src/lib/effects.ts`) is a documented
  no-op. Not touched by `4f6ac3e` (confirmed not in the commit's changed
  file list). Either implement it or remove the effect type from the
  schema/content if truly unused (verify no scene content references it
  before removing).
- No error boundaries anywhere (see TASK-002).
- No content cross-reference integrity validation (see TASK-003).
- `floors.ts`'s `locked` field is unread by any consumer (see TASK-007,
  new finding this session).
- `src/engine/exploration.ts`'s pure functions (`rectIntersectsWalls`,
  `clampCamera`, `nearestInteractable`, `directionFromInput`) have zero
  dedicated unit tests, unlike every other pure-function module in the
  codebase (`combat.ts`, `conditions.ts`, `effects.ts` all have full
  coverage). Low risk (the functions are simple and used consistently),
  but an inconsistency worth closing. Not touched by `4f6ac3e`.

## Testing needed

- Manual browser smoke-test of the current `HEAD` (`4f6ac3e`), covering
  both worlds' full 10-chapter/10-floor content — never performed by an
  agent session per available records. See TASK-006 and `TESTING.md`'s
  checklist. This documentation pass verified typecheck/lint/test/build
  only, not actual runtime behavior in a browser.
- Unit tests for `src/engine/exploration.ts` (see "Technical debt"
  above).

## Documentation needed

- None outstanding as of this pass — this session re-synced all 17
  standard files against the current committed state. Keep `README.md`
  in sync going forward (it was updated as part of `4f6ac3e` itself, per
  the commit's file list, so it should already reflect the current
  content — spot-checked, not line-by-line diffed, this session).

## Recently completed

- **Commit `4f6ac3e` — "Expand to 10 full chapters/floors in both
  worlds"** (2026-08-06): see "TASK-001" above for the full breakdown.
  26 files changed, +2,688/−102.
- **This documentation re-sync pass** (2026-08-06, same day, later
  session): re-verified the repo against `4f6ac3e` and corrected
  `PROJECT_STATE.md`, `TASKS.md`, `HANDOFF.md`, `FEATURES.md`,
  `SESSION_LOG.md`, and spot-checked `ARCHITECTURE.md`/`ROADMAP.md`/
  `DECISIONS.md`. No application code was changed; nothing was committed,
  pushed, deployed, reset, or discarded.
- **The prior full documentation audit** (2026-08-06, earlier same day):
  created all 17 standard memory files from a direct repo audit, but was
  writing them while the working tree was being edited live underneath
  it — see `SESSION_LOG.md` for both entries in full.

## Deferred

None currently — the prior deferred item (TASK-001's scope decision) was
resolved by the work being finished and committed.

## Rejected ideas

None found recorded anywhere in the repo.
