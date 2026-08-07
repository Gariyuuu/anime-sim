# TASKS.md

## Current task

**None in progress.** As of the 2026-08-07 "final transfer checkpoint"
pass, `HEAD` is `b0a4dbe` — 15 commits past `4f6ac3e` (the commit this
file's TASK-001 write-up below was originally written against), 11 of
them unpushed to `origin/main`. Both worlds now run 20 chapters/floors,
not 10 (Elite Academy Year Two + Aincrad Floors 11-20), plus a guidance/
waypoint system, background music, a dialogue-UI redesign, real-art
override support (portraits and now backgrounds), a repeatable Combat
Arena, and two rounds of portrait-rendering bug fixes — see
`PROJECT_STATE.md`'s "Current state (checkpoint pass, 2026-08-07)" for the
full commit-by-commit list. `npx tsc --noEmit`, `pnpm lint`, `pnpm test`
(83/83, up from 62/62), and `pnpm build` all re-verified clean against
`b0a4dbe` this pass. This checkpoint pass itself was documentation/
git-hygiene only (see "Recently completed") — it did not start or
continue any application-code task; pick one from "Next up" below, after
first checking whether any of them were already addressed by the 15
commits landed since this section was last accurate (some were — see the
per-item notes below).

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

**Re-checked 2026-08-07:** TASK-002, TASK-003, and TASK-007 below are
confirmed still genuinely open (re-grepped `src/` this pass — no
`ErrorBoundary`, no integrity-check pass in `registry.ts`, no reader of
`FloorDefinition.locked` anywhere). **TASK-004 (first deploy) is done** —
see `PROJECT_STATE.md`, live at `https://anime-sim-eta.vercel.app`,
re-confirmed `200` this pass — left below with a status note instead of
being deleted, since deploy *maintenance* (does the live build match
`HEAD`?) is still an open question nobody has checked.

- **TASK-002 — Add a React error boundary.** No error boundary exists
  anywhere in the component tree (re-verified via grep 2026-08-07, still
  true 15 commits later). An uncaught exception in any game-mode view
  currently crashes the whole app instead of degrading one screen.
  Priority: Medium. Files: `src/components/GameRoot.tsx` or a new wrapper
  component. No dependencies. Not started.
- **TASK-003 — Add a content cross-reference integrity check.** Zod
  validates shape but not that a referenced `sceneId`/`npcId`/`itemId`/
  `mapId` actually exists — this is exactly how the Floor 4–10
  dangling-scene bug (fixed in `4f6ac3e`) went unnoticed for a while
  during development. Re-verified 2026-08-07: still no such check exists
  in `registry.ts`, and the content surface has since roughly doubled
  (Chapters/Floors 11-20 added in `63b80f5`/`bfbe3fa`), making this more
  valuable, not less. Priority: Medium, arguably High. Files:
  `src/content/registry.ts` (add a post-`parseAll` integrity pass).
  Depends on: nothing. Not started.
- **TASK-004 — First deploy. STATUS: DONE**, superseded by an actual
  deploy — live at `https://anime-sim-eta.vercel.app`, re-confirmed `200`
  2026-08-07. Open follow-up (new, not the original task): nobody has
  verified whether the live deploy actually reflects current `HEAD`
  (`b0a4dbe`) — deploys are manual `vercel --prod` runs, not triggered by
  git push, so drift is possible. Low priority; check by running
  `vercel --prod` again or inspecting deploy history in the Vercel
  dashboard if it matters for a demo.
- **TASK-006 — Manual browser playthrough of the new content.** Several
  individual sessions have Playwright-verified specific slices since this
  was written (per `SESSION_LOG.md`): the Combat Arena flow, the
  portrait-rendering fixes, textured exploration rooms. **No session has
  done a full playthrough of Chapters/Floors 11-20**, the guidance/
  waypoint system (`33d7967`), or the background-music/Guide-button
  additions (`b0a4dbe`) — those remain unverified beyond
  typecheck/lint/test/build. Priority: Medium. See `TESTING.md`'s
  smoke-test checklist. Not started for the 11-20 content or the newest
  systems.

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

- **2026-08-07 "final transfer checkpoint" pass** (documentation/
  git-hygiene only, no application code changed): re-verified `HEAD`
  (`b0a4dbe`, 25 commits total, 11 unpushed to `origin/main`) against
  `tsc`/`lint`/`test` (83/83)/`build` — all clean. Committed the 2
  finished-but-untracked items found in the working tree
  (`docs/PORTRAIT_PROMPTS.md`, `public/backgrounds/.gitkeep`) as their own
  commit. Corrected stale HEAD/commit-count/test-count/chapter-count
  claims in `CLAUDE.md`, `PROJECT_STATE.md`, `TASKS.md` (this file), and
  `HANDOFF.md`; flagged (but did not line-by-line rewrite) staleness in
  `FEATURES.md`. Ran a repo-wide secret scan — nothing found in tracked
  files. Committed doc changes separately from the asset commit. Did not
  push (user's call — 11 commits is a lot to push unreviewed).
- 15 commits landed between `4f6ac3e` and `b0a4dbe` covering: Elite
  Academy Year Two (Chapters 11-20, `63b80f5`), Aincrad Floors 11-20
  (`bfbe3fa`), full menu/exploration colorization (`97bbfa5`, `f29e992`),
  real anime-cast names (`75bd892`), a viewport-fill fix (`e115b74`),
  sprite animation + switch puzzles (`7915b66`), a `portraitImageUrl`
  override system + repeatable Combat Arena (`46bcebe`), two portrait-
  rendering bug-fix passes (`92e211f`, `12296ff`), a dead-end-room fix +
  real per-objective quest tracking (`0f72792`), a guidance/waypoint
  system + dialogue-UI redesign (`33d7967`), and background music + a
  Guide HUD button (`b0a4dbe`) — plus 2 documentation-sync commits
  (`c7d8ffb`, `5ca6ab3`) and one logged-but-not-doc-synced session
  (`1207fe9`, "Session 4"). None of this work's individual commit
  sessions are re-described task-by-task here; see `git log --oneline` and
  `SESSION_LOG.md` for the full record.
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
