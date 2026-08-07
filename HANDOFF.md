# HANDOFF.md — Start Here

You are picking up **ANIME//SIM** with no memory of any prior conversation.
This file is your fastest path to being useful. Everything here is backed
by the other memory files in this repo root. The memory system was
originally written 2026-08-06 from a direct audit of the actual code, and
was **re-synced the same day** after the in-progress work it described got
committed — see "What was the previous agent doing?" below for why that
matters.

## What is this project?

An original, unofficial fan-made prototype — a story-driven 2D anime life
simulator (visual novel + light social-strategy + compact turn-based RPG)
across two original branching worlds: **Elite Academy** (competitive
boarding-school drama) and **Aincrad** (trapped floating-castle MMO). No
copyrighted material anywhere — everything is original content. Fully
client-side Next.js app: no backend, no database server, no accounts,
saves persist locally via IndexedDB (Dexie). **Both worlds now have a full
10-chapter/10-floor arc** — Elite Academy chapters 1–10 (a full school
year) and Aincrad Floors 1–10 (Town of Beginnings through The Tenth Gate),
each fully playable and chained together via chapter-navigation
infrastructure wired into the recap screen and device menu. Full detail:
`CLAUDE.md` (read this in full before doing anything else).

## What should I read first?

In order:
1. `CLAUDE.md` — identity, stack, conventions, critical rules.
2. `PROJECT_STATE.md` — the exact stopping point, right now, including the
   exact `git log`/verification-command output.
3. `TASKS.md` — what's queued; there is no task currently in progress, so
   this is "next up" (TASK-002/003/004/006), not a resume-mid-task file.
4. Whichever of `ARCHITECTURE.md` / `FEATURES.md` / `DATABASE.md` /
   `UI_SYSTEM.md` / `SECURITY.md` / `DEPLOYMENT.md` / `DECISIONS.md` is
   relevant to what you're about to do.

## What is the current task?

**No task is currently in progress.** The task described by the prior
version of this file — finishing and wiring the Floor 4–10 / multi-chapter
work — is **done**. It was committed as `4f6ac3e`, "Expand to 10 full
chapters/floors in both worlds" (26 files, +2,688/−102), and this session
independently re-verified (not just trusted the commit message):

- Both worlds have a real 10-chapter chain, each chapter's `startSceneId`
  resolving to an actual authored scene.
- All 21 previously-dangling Floor 4–10 scene references now exist.
- `ChapterRecapScreen.tsx` calls `advanceChapter()`; `DeviceMenu.tsx` has a
  working `ChaptersTab` calling `jumpToChapter()`/`chaptersForWorld()` —
  both were unwired before, both are wired now (confirmed by reading the
  component source).
- `npx tsc --noEmit`, `pnpm lint`, `pnpm test` (62/62), and `pnpm build`
  all pass clean on the current `HEAD`.

**Pick your own next task from `TASKS.md` → "Next up."** The strongest
candidates, in rough priority order: `TASK-003` (content cross-reference
integrity check — would have caught the Floor 4–10 dangling-scene bug
automatically), `TASK-006` (manual browser playthrough — nothing has
verified this content runs correctly in an actual browser yet), `TASK-002`
(React error boundary), `TASK-004` (first deploy, user-driven only).

## What was the previous agent doing?

Two sessions, same calendar day (2026-08-06):

1. **The original documentation audit.** Wrote all 17 memory files from a
   direct repo audit — but the working tree was being edited live
   underneath it while it worked (grew from 10 to 20 modified files,
   ~278 to ~3,154 uncommitted lines, in the span of that one session).
   That session did not touch the uncommitted diff itself, did not fix
   anything, and did not commit anything — pure documentation.
2. **This re-sync session.** The in-flight work session 1 was describing
   got finished and committed (as `4f6ac3e`) sometime after session 1
   ended. This session re-verified the repo against that commit — re-ran
   `git log`/`git status`/`tsc`/`lint`/`test`/`build`, re-read the changed
   files (chapter definitions, scenes, `DeviceMenu.tsx`,
   `ChapterRecapScreen.tsx`, `floors.ts`) — and corrected
   `PROJECT_STATE.md`, `TASKS.md`, `HANDOFF.md` (this file), `FEATURES.md`,
   and appended to `SESSION_LOG.md`. It also spot-checked
   `ARCHITECTURE.md`/`ROADMAP.md`/`DECISIONS.md` for staleness. **This
   session also did not touch application code or commit anything** — see
   `SESSION_LOG.md`'s second entry for the complete record.

## What works right now?

**Everything in the committed baseline (`4f6ac3e`)** typechecks, lints,
tests (62/62), and builds clean — independently re-verified this session,
not assumed. Per `README.md`/`patchnotes.ts`/direct code inspection: full
character creator; data-driven dialogue engine (now with a fixed
node-level-navigation-effect bug); 7-axis relationship system; story-flag/
quest system; Canvas-based exploration; turn-based combat; in-game device
(Messages/Contacts/Quests/Stats/Inventory/Map/Achievements/Settings, plus
the new Chapters tab); codex; achievements; settings/accessibility; Dexie-
backed saves with slots/autosave/import-export; dev-only debug panel;
**Elite Academy chapters 1–10, fully playable and chained**; **Aincrad
Floors 1–10, fully playable and chained**, including the multi-chapter
navigation system itself (recap → "Next Chapter", device menu → "jump to
any unlocked chapter"). See `FEATURES.md` for the individually verified
status of each.

## What is broken?

**Nothing found broken in the committed baseline** as of this session's
verification. The prior session's "broken/unwired" findings (Floor 4–10
dangling scenes, unwired chapter-nav actions, typecheck/test failures) were
all specific to the *uncommitted* diff at that time and do not apply to
current `HEAD`. Known non-broken gaps: no manual browser playthrough has
ever been recorded (see "What should I do next?"), and a few small items
in `TASKS.md`'s "Technical debt" (unread `floors.ts` `locked` field,
`changeClassPoints` no-op, no error boundaries, no content
cross-reference validation) remain open — none of these fail any
automated check.

## What should I do next?

1. Confirm this file's claims still hold: `git status`, `git log
   --oneline -5`, then the four verification commands (see below).
2. Pick a task from `TASKS.md` → "Next up" — nothing is currently
   in-progress, so this is a fresh choice, not a resume. `TASK-003`
   (content integrity check) or `TASK-006` (manual playthrough) are the
   strongest candidates given what this pass found.
3. Do **not** re-do `TASK-001`'s work — it's finished and committed; re-
   verify before assuming otherwise, but don't re-author chapters/scenes
   that already exist.

## Which files are most important?

- `src/state/gameStore.ts` — the entire runtime orchestration layer,
  including the newer `advanceChapter`/`jumpToChapter`/`leaveCurrentNode`
  actions.
- `src/content/registry.ts` — the content validation/lookup boundary,
  including `chaptersForWorld()`.
- `src/lib/effects.ts` / `src/lib/conditions.ts` — the consequence engine
  every scene's choices route through.
- `src/types/save.ts` — the on-disk save format; see `CLAUDE.md` before
  touching it.

Full annotated map: `FILE_MAP.md` (note: written before `4f6ac3e` — the
directory-level structure it describes is still accurate, but it predates
the new `ChaptersTab` in `DeviceMenu.tsx` and the expanded chapter/scene
content; not corrected line-by-line this session since the structural
claims still hold).

## Which areas are dangerous to modify?

See `CLAUDE.md` → "DO NOT CHANGE WITHOUT REVIEW". Headline:
`SaveGameSchema` backward-compatibility (a required-field addition
silently breaks every existing save), and the shared
`applyEffects`/`evaluateConditions` functions (a behavior change there
silently changes the outcome of every authored scene in both worlds — now
a much larger surface area at 10 chapters/floors per world instead of 1).

## Which commands should I run first?

```bash
cd ~/Projects/anime-sim
git status                                     # should show only doc files modified/untracked
git log --oneline -5                           # HEAD should be 4f6ac3e
npx tsc --noEmit -p tsconfig.json && pnpm lint && pnpm test && pnpm build
```
Expect all four to pass clean. If any fails, something has changed since
this pass — figure out what before proceeding, and update
`PROJECT_STATE.md`.

## How do I verify the app still works?

```bash
pnpm dev
```
Then open whatever port it binds to (usually `http://localhost:3000`) and
walk `TESTING.md`'s manual smoke-test checklist. **No session on record has
started the dev server and clicked through the app** — every verification
in this memory system, across both documentation sessions, has been code
inspection + the automated test suite. That remains the single biggest
unverified claim in this memory system, and it's now a larger claim than
before (10 chapters/floors per world, not 1) — prioritize a real browser
check, especially of the new "Next Chapter" flow and the Chapters tab.

---

## Prompt for the next Claude Code account

Copy-paste this to start a new session cleanly:

```
Read CLAUDE.md, PROJECT_STATE.md, and TASKS.md in full before doing
anything else. Then:

1. Run `git status` and `git log --oneline -5` and confirm the repo state
   matches what PROJECT_STATE.md describes — working tree clean except
   documentation files (CLAUDE.md modified, 16 other .md files
   untracked), HEAD at commit 4f6ac3e ("Expand to 10 full chapters/floors
   in both worlds"), 2 commits total, in sync with origin/main. If it
   doesn't match (something has changed since), stop and tell me what's
   different before proceeding.
2. Run the verification suite: `npx tsc --noEmit -p tsconfig.json && pnpm
   lint && pnpm test && pnpm build`. Confirm all four pass clean (62/62
   tests) — or tell me if the picture has changed.
3. In 3-5 sentences, summarize your understanding of: what this project
   is, what's actually playable right now (both worlds' full 10-chapter/
   floor arcs), and what TASKS.md lists as the next candidate task. I
   want to confirm you've actually absorbed the memory files, not just
   skimmed them.
4. Flag anything in CLAUDE.md/PROJECT_STATE.md/TASKS.md/FEATURES.md that
   looks stale or contradicts what you find in the actual code — don't
   silently work around a contradiction, surface it.
5. No task is currently in progress — pick one from TASKS.md → "Next up"
   with me before starting significant work, rather than assuming.
6. Preserve the existing architecture (single Zustand store, Zod-validated
   plain-data content, pure-function lib/engine layers, IndexedDB-only
   persistence, no backend) unless you find a genuinely strong reason to
   change it — and if you do, write it up in DECISIONS.md rather than
   changing it silently.
7. After completing any meaningful work, update PROJECT_STATE.md,
   TASKS.md, and append to SESSION_LOG.md before ending your session —
   don't let the next handoff start from a stale snapshot.
```
