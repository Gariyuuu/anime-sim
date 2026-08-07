# PROJECT_STATE.md — Exact Snapshot

**Audit timestamp: 2026-08-07 — "final transfer checkpoint" pass.** This
is now the third layer of updates to this file; everything below the next
"---" predates this pass and is historical record only (each older layer
already says the same about the layer before it — this is a documented
pattern in this repo, not a one-off). See "Current state (checkpoint pass,
2026-08-07)" immediately below for what's actually true now.

## Current state (checkpoint pass, 2026-08-07)

- **Latest commit:** `b0a4dbe` — "Add background music, a compass/guide
  system, and another visual pass" (**25 commits total** in
  `git log --oneline`, up from the 10 described in the layer below).
- **Branch `main` is 11 commits ahead of `origin/main`, unpushed.**
  Confirmed via `git status` and `git log origin/main..HEAD --oneline`.
  **This number will drift** — re-run those two commands yourself before
  trusting it; do not assume it's still 11 by the time you read this.
  The 11 unpushed commits, oldest first: `bfbe3fa` (Aincrad Floors 11-20),
  `63b80f5` (Elite Academy Chapters 11-20 + v0.4.0 patch notes),
  `97bbfa5` (colorize menu-level screens), `46bcebe` (portrait/background
  art-override support + repeatable Combat Arena), `5ca6ab3` (docs sync),
  `92e211f` (fixed invisible-hair portrait bug, textured exploration
  rooms, persistent objective HUD), `1207fe9` (docs: log Session 4),
  `12296ff` (redesigned PortraitFace eyes/hair/neck — prior fix still read
  as "old man"), `0f72792` (fixed a dead-end room trapping players after
  the training quest, added real per-objective quest tracking),
  `33d7967` (guided navigation/waypoint system, dialogue-UI redesign,
  better fonts, procedural scenery), `b0a4dbe` (background music, a
  compass/"Guide" HUD button + G-keybind, another visual pass — current
  `HEAD`). None of this has reached `origin/main` yet.
- **Working tree at the start of this pass had exactly 2 untracked items**
  (no modified-tracked-file diffs at all): `docs/PORTRAIT_PROMPTS.md` (a
  complete, ready-to-use AI-image-prompt reference sheet for all ~29
  characters, generated directly from the real in-game NPC data — not
  partial/WIP) and `public/backgrounds/.gitkeep` (an empty placeholder
  directory for the `MapDefinition.backgroundImageUrl` override system
  that already shipped, working, in commit `33d7967` — it mirrors the
  already-tracked `public/portraits/.gitkeep` placeholder exactly). Both
  were finished, not mid-work, so **both were committed as their own
  commit** this pass (kept separate from the documentation-only commit —
  see `SESSION_LOG.md` for the exact commit hash).
- **Deployed and live:** `https://anime-sim-eta.vercel.app` re-confirmed
  `200` via `curl` this pass. No new `vercel --prod` was run — this just
  re-checks the deploy from a prior session is still up. Whether that live
  deploy reflects `HEAD` (`b0a4dbe`) or an earlier commit was **not**
  independently verified this pass (Vercel deploys are triggered manually,
  not by git push/pull, and there's no build-id output surfaced to check
  against).
- **Verification this pass, run fresh against `b0a4dbe`:** `npx tsc
  --noEmit -p tsconfig.json` — 0 errors. `pnpm lint` — 0 errors/warnings.
  `pnpm test` — **83/83 passing (12 test files**, up from 66/8). `pnpm
  build` — clean (Turbopack, static pages generated). **No browser/runtime
  testing was performed this pass** — this was a documentation/git-hygiene
  checkpoint, not a feature session; do not read the "verification" above
  as covering the new guidance/music/dialogue-redesign systems in a live
  browser. See "Not yet verified" below.
- **Not yet verified by this pass specifically:** whether the
  guidance/waypoint BFS system (`33d7967`), the "Guide" HUD button/keybind
  and background music (`b0a4dbe`), the per-objective quest tracking fix
  (`0f72792`), or the second portrait redesign (`12296ff`) actually work
  correctly in a real browser — each was reportedly Playwright-verified in
  its own originating session per `SESSION_LOG.md`, but this checkpoint
  pass did not re-run any of that, only the four automated commands above.
  `FEATURES.md` still describes the project as a 10-chapter/10-floor arc
  (`4f6ac3e`-era) and has **not** been re-audited feature-by-feature for
  Chapters/Floors 11-20 or any of the systems added since — flagged there,
  not fixed line-by-line, given this pass's scope.
- **No secrets found in tracked files.** `.env.local` (a short-lived
  Vercel OIDC dev token) exists locally but is untracked and correctly
  covered by `.gitignore`'s `.env*` rule — never committed. A repo-wide
  `git grep` for common secret patterns across tracked non-doc files
  turned up nothing but game-content strings (NPC "secret" codex entries,
  achievement names) — no real API keys/passwords/tokens committed
  anywhere in this repo.
- **IMPORTANT — new mid-work change appeared DURING this checkpoint pass,
  from what is clearly a concurrent live session (file timestamps landed
  minutes apart while this pass was already running):** a partially-wired
  sprite-icon system. `src/content/iconSprites.ts` (new, untracked) maps
  a subset of `glyph` names to real CC0 pixel-art PNGs (Kenney.nl packs,
  copied from `~/Projects/shared-assets` into `public/sprites/kenney/`,
  18 PNGs present as of this note, new files still appearing as this was
  being written — do not assume the count is final). `src/components/game/ExplorationView.tsx`
  has an in-progress, uncommitted modification wiring `GLYPH_SPRITES`
  into the interactable-marker render path (falls back to the existing
  `<Icon>` for any glyph without an entry — additive by design per the
  file's own doc comment). **None of this was touched, finished, or
  committed by this checkpoint pass** — it is not this pass's work, its
  intent wasn't confirmed with the user, and per this repo's own
  documented history (see `SESSION_LOG.md`'s prior sessions) treating a
  moving concurrent diff as if it were a stable snapshot has caused real
  problems before. `git status` at the moment this pass's own commits
  were made will show this diff/these untracked files still present —
  that is expected and correct, not a sign this pass did something wrong.
  Whoever picks this up next: run `git status` fresh, don't assume this
  work is either finished or abandoned, and ask before committing it.

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

Everything in this section and above (except "Current state (checkpoint
pass, 2026-08-07)" at the very top) is historical record from earlier
sessions and is known to be stale — do not use it to judge current repo
state.

Before any further work: run `git status`, `git log --oneline -5`, and
`git log origin/main..HEAD --oneline` and confirm they match the
"Current state (checkpoint pass, 2026-08-07)" section at the top of this
file (`HEAD` at `b0a4dbe`, 25 commits total, 11 ahead of `origin/main`,
working tree clean). If they don't match — especially the ahead-of-origin
count, which is expected to change as soon as the user pushes — something
has changed since this pass and even that top section is now stale:
re-run the four verification commands fresh and act on their actual
current output, and update this file before ending your session.
