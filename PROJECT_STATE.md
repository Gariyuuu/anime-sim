# PROJECT_STATE.md — Exact Snapshot

**Audit timestamp:** 2026-08-06, later same-day pass (this session).
Everything below the "Superseded" notice further down predates a large
burst of work done later on 2026-08-06 that is **not** reflected in that
older narrative — real anime character names, chapters/floors 11-20 in
both worlds, full colorization of menus + exploration maps, a dynamic
viewport fix, a first-time tutorial, Save/Main Menu buttons, a
`portraitImageUrl` override system (drop a file in `public/portraits/` to
replace an NPC's procedural art), a repeatable Combat Arena (re-fight any
reached floor's common/mini-boss encounters), and the project's **first
deploy**. See "Current state (this pass)" immediately below for what's
actually true now; treat everything after it as historical record only.

## Current state (this pass)

- **Latest commit:** `46bcebe` — "Add real-portrait override support and a
  repeatable Combat Arena" (10 commits total in `git log --oneline`, up
  from the 2 described in the older sections below).
- **Branch `main` is 4 commits ahead of `origin/main`** (not pushed this
  pass — push is a user-driven action, not done automatically).
- **Working tree: clean.** No uncommitted `src/` or doc changes.
- **Deployed and live:** `https://anime-sim-eta.vercel.app` (Vercel
  project `anime-sim`, already linked via `.vercel/project.json` from an
  earlier point in this same day's work) — confirmed `200` via `curl`
  immediately after this pass's `vercel --prod` run. The "Production
  status: Not deployed" claim elsewhere in this file (and in `CLAUDE.md`)
  is now **stale** — update `CLAUDE.md`'s "Production status" line
  next time it's touched.
- **Verification this pass, run fresh against `46bcebe`:** `npx tsc
  --noEmit` — 0 errors. `pnpm lint` — 0 errors/warnings. `pnpm test` —
  66/66 passing (8 test files, up from 62/7). `pnpm build` — clean.
  Additionally **live-browser-verified** (Playwright, real UI clicks, not
  store manipulation) end-to-end: New Game → World Select → Aincrad →
  Character Creator → dialogue → Debug Panel flag/teleport → exploration
  view (confirmed it now fills the full viewport with a colorful map and
  distinct per-kind marker icons, not the old fixed 640×420 box) →
  clicked the Combat Arena marker in Town of Beginnings → modal opened →
  selected a fight → `startCombat` fired and CombatView rendered with
  live HP bars and the full action menu (Attack/Skill/Guard/Dodge/Item/
  Analyze/Escape). Zero console errors across the whole run.
- **Not yet verified:** the `portraitImageUrl` override itself rendering a
  real image (no NPC has one set yet — no image files exist in
  `public/portraits/` beyond the placeholder `.gitkeep`). Only the
  fallback path (procedural `PortraitFace`) has been confirmed to still
  render correctly with the new conditional in place.

---

## Superseded — narrative below is from an earlier point in 2026-08-06

**Audit timestamp:** 2026-08-06, re-sync pass. The 2026-08-06
documentation session (same calendar day, earlier) wrote this file while
the working tree was being edited live underneath it. That in-flight work
has since been **committed** as `4f6ac3e` — "Expand to 10 full
chapters/floors in both worlds." This pass re-verified the repo against
the actual committed state and rewrote the sections below that had gone
stale. Everything below was re-checked directly against the repository at
that (earlier) timestamp — it has since been superseded by "Current state
(this pass)" above.

## What happened between the last write of this file and now

The prior session's `PROJECT_STATE.md` described a **moving target**: an
uncommitted working tree that grew from 10 modified files (~278 lines) to
20 modified files (~3,154 lines) while that session was writing
documentation about it, and flagged 2 (then 5) typecheck errors, 1 failing
test, and "not wired to any UI" for both the chapter-navigation
infrastructure and the Aincrad Floor 4–10 content. That work has now
**landed as a real commit**, `4f6ac3e`, on top of the original
`fa2e70b`. It is materially different from — and more complete than — what
either snapshot A or B described:

- 26 files changed, **2,688 insertions(+), 102 deletions(-)**.
- Both worlds now have a full **10-chapter chain** (`ea-ch1`…`ea-ch10`,
  `ai-ch1`…`ai-ch10`), each with its own `startSceneId`, `completionFlag`,
  `nextChapterId`, and outcomes — not just `ch1` with a dangling
  `nextChapterId` pointing at nothing.
- Every chapter's `startSceneId` (e.g. `ea-scene-ch4-arrival`,
  `ai-scene-floor7-arrival`) is now defined in `scenes.ts` — verified via
  grep, all 18 non-ch1 arrival scenes present (9 per world).
- The 21 previously-missing Floor 4–10 scene IDs
  (`ai-scene-floor{4-10}-npc-intro`, `ai-scene-boss{4-10}-prep`,
  `ai-scene-boss{4-10}-aftermath`) are now all authored — verified via
  grep, 3/3 present for every floor 4–10.
- **The chapter-navigation UI wiring that was missing is now in place**:
  `ChapterRecapScreen.tsx` calls `advanceChapter()` from a "Next Chapter"
  button; `DeviceMenu.tsx` gained a `ChaptersTab` that calls
  `chaptersForWorld()`/`jumpToChapter()` to let a player jump back into any
  unlocked chapter.
- Two real bugs (found via live browser testing, per the commit message,
  not just typecheck) were fixed: (1) a dialogue node whose own `effects`
  included a navigation command used to navigate away before its own text
  ever displayed — navigation now defers via `pendingNodeNavigation` until
  `leaveCurrentNode()` is called; (2) the Floor 1 boss raid never actually
  started combat. A new regression test file,
  `src/tests/dialogueNavigation.test.ts` (87 lines), covers the first fix.
- `gameStore.ts`'s `GameStoreState` interface additions
  (`leaveCurrentNode`, `_toastAchievements`) that Snapshot B found
  declared-but-unimplemented are now both implemented (verified by
  reading the store).
- `floors.ts` floors 4–10 remain `locked: true` with a progressive
  `unlockFlag` chain (`ai-flag-floor{n-1}-cleared`) — this was flagged in
  the prior audit as possibly-broken content/copy inconsistency, but on
  closer inspection this session, the `locked` boolean field is **not
  read anywhere** in `gameStore.ts` or any component (verified via grep) —
  floor progression is driven entirely by chapter/scene navigation
  (`advanceChapter()` → `nextChapterId` → `startSceneId`), not by a
  floor-select UI gated on `.locked`. The field appears to be
  descriptive/future-UI metadata rather than an active gate, so this is
  **not** a functional bug — just an unused field, worth flagging in
  `TASKS.md` as tech debt rather than a broken-content issue.

## Git state

- **Branch:** `main`
- **Remote:** `origin` → `https://github.com/Gariyuuu/anime-sim.git`
  (both fetch and push)
- **Latest commit:** `4f6ac3e` — "Expand to 10 full chapters/floors in both
  worlds" (on top of `fa2e70b`, "Initial commit: ANIME//SIM vertical
  slice" — 2 commits total in `git log --oneline`).
- **Branch vs. remote:** "up to date with 'origin/main'" per `git status`.
- **Working tree: clean except documentation files.** `git status`
  reports:
  ```
  modified:   CLAUDE.md
  Untracked:  API_REFERENCE.md, ARCHITECTURE.md, CHANGELOG.md,
              DATABASE.md, DECISIONS.md, DEPLOYMENT.md, FEATURES.md,
              FILE_MAP.md, HANDOFF.md, PROJECT_STATE.md, ROADMAP.md,
              SECURITY.md, SESSION_LOG.md, TASKS.md, TESTING.md,
              UI_SYSTEM.md
  ```
  **No `src/` files are modified or untracked.** All of the former
  in-progress application work is now inside commit `4f6ac3e`. Only this
  memory-system's own files (all doc-only) are outstanding, exactly as
  expected for a documentation-only repo.

## Verification actually run this session

Run fresh against the current tree (commit `4f6ac3e`, clean except docs):

```
$ npx tsc --noEmit -p tsconfig.json
```
**PASSES** — exit code 0, no errors.

```
$ pnpm lint   (eslint .)
```
**PASSES** — 0 errors, 0 warnings.

```
$ pnpm test   (vitest run)
```
**PASSES** — 7 test files, **62/62 tests pass** (up from 56 in the prior
baseline — the new `dialogueNavigation.test.ts` file adds coverage for
the navigation-defer bug fix).

```
$ pnpm build   (next build)
```
**PASSES** — Turbopack compiles successfully, TypeScript check passes,
static pages generate (`/` and `/_not-found`), no errors.

**All four verification commands are clean on the current `HEAD`.** The
prior session's warnings about a 2-then-5-error moving target no longer
apply — that work is finished and committed in a green state.

## Active objective

This session's objective: **re-sync the repo's documentation** (written
2026-08-06, earlier the same day, against a moving/uncommitted target)
against the now-committed `4f6ac3e`. This is again a
**documentation-only session** — no application code was changed, nothing
was committed/pushed/deployed/reset/discarded by this pass.

## Last completed task (in the codebase, not this doc pass)

**Commit `4f6ac3e` — "Expand to 10 full chapters/floors in both worlds."**
See "What happened between the last write of this file and now" above for
the full breakdown. This was the prior `TASK-001` (see `TASKS.md`),
now complete: both worlds have a full 10-chapter/10-floor chain, the
chapter-navigation infrastructure is wired into the UI, all previously-
missing scenes are authored, and the tree typechecks/lints/tests/builds
clean.

## Current unfinished task (in the codebase, not this doc pass)

No in-progress application work is currently uncommitted. See `TASKS.md`
for the next queued items (React error boundary, content
cross-reference integrity validation, first deploy, the `changeClassPoints`
no-op, the unused `floors.ts` `locked` field, exploration-engine test
coverage). None of these are blocked; all are candidate "next task" picks,
not currently in progress.

## Next three recommended actions

1. **Manual browser playthrough of the new content.** No automated test
   covers UI/runtime behavior end-to-end (component tests don't exist —
   see `TESTING.md`), and this pass, like the prior one, verified via code
   inspection + the automated suite, not by running `pnpm dev` and
   clicking through Floors 4–10 / Elite Academy chapters 2–10 in a real
   browser. This is the single largest unverified claim in this memory
   system now that typecheck/lint/test/build are all green.
2. **Decide on `TASK-003` (content cross-reference integrity check).** The
   Floor 4–10 dangling-scene-ID gap that existed in the prior uncommitted
   diff would have been caught immediately by a post-`parseAll` check that
   every referenced `sceneId`/`npcId`/`itemId`/`mapId` actually resolves.
   Worth adding now, while the pattern that caused the gap is fresh,
   before the next content expansion (if any) repeats it.
3. **Consider a first deploy** (`TASK-004`) now that there's substantially
   more finished content to show — still a user-driven decision, not
   something to do unprompted, but worth surfacing given the project has
   grown from "one chapter" to "ten chapters/floors in both worlds" and
   has never been deployed anywhere.

## Verification required before continuing

Before any further work: run `git status` and `git log --oneline -5` and
confirm they match this file (2 commits, `HEAD` at `4f6ac3e`, working
tree clean except the 17 doc files). If they don't match, something has
changed since this pass and this file is stale — re-run the four
verification commands fresh and act on their actual current output.
