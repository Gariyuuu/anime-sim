# HANDOFF.md — Start Here

You are picking up **ANIME//SIM** with no memory of any prior conversation.
This file is your fastest path to being useful. Everything here is backed
by the other memory files in this repo root. The memory system was
originally written 2026-08-06 from a direct audit of the actual code, and
has been **re-synced twice since**: same-day on 2026-08-06 after
in-progress work got committed, and again 2026-08-07 as a "final transfer
checkpoint" pass (documentation/git-hygiene only — see "What was the
previous agent doing?" below and `PROJECT_STATE.md`'s top section for
current truth). **`HEAD` is now `b0a4dbe`, 25 commits total, 11 of them
unpushed to `origin/main`** — re-verify that count yourself
(`git log origin/main..HEAD --oneline`) before trusting it; it will have
changed as soon as the user pushes. Both worlds now run **20**
chapters/floors, not 10 (see below) — don't trust the older parts of this
file's "10-chapter" framing without checking `PROJECT_STATE.md` first.

## What is this project?

An original, unofficial fan-made prototype — a story-driven 2D anime life
simulator (visual novel + light social-strategy + compact turn-based RPG)
across two original branching worlds: **Elite Academy** (competitive
boarding-school drama) and **Aincrad** (trapped floating-castle MMO). No
copyrighted material anywhere — everything is original content. Fully
client-side Next.js app: no backend, no database server, no accounts,
saves persist locally via IndexedDB (Dexie). **Both worlds now have a full
20-chapter/20-floor arc** (grown from 10 since the last full re-audit) —
Elite Academy chapters 1–20 (a full two-year run, Year Two added in commit
`63b80f5`) and Aincrad Floors 1–20 (added in `bfbe3fa`), chained together
via chapter-navigation infrastructure wired into the recap screen and
device menu, plus a newer guidance/waypoint system (`33d7967`) that points
players at their next objective. The Chapters/Floors 11-20 content and the
guidance system have **not** been re-verified feature-by-feature in
`FEATURES.md` yet — see `PROJECT_STATE.md`. Full detail: `CLAUDE.md` (read
this in full before doing anything else).

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

**No task is currently in progress.** `TASKS.md`'s TASK-001 (the Floor
4-10/multi-chapter work described below) has been done for a while — 15
more commits have landed on top of it since, taking `HEAD` from `4f6ac3e`
to `b0a4dbe`. The 2026-08-07 checkpoint pass re-verified fresh against
current `HEAD`:

- Both worlds have a real **20**-chapter chain (`ea-ch1`…`ea-ch20`,
  `ai`/`floor-1`…`floor-20`), not 10 — confirmed by grepping
  `chapter.ts`/`floors.ts` this pass.
- `npx tsc --noEmit`, `pnpm lint`, `pnpm test` (**83/83**, up from 62/62),
  and `pnpm build` all pass clean on the current `HEAD` (`b0a4dbe`).
- `main` is **11 commits ahead of `origin/main`**, unpushed — re-verify
  this yourself, it changes every session.

**`TASK-004` (first deploy) is done** — live at
`https://anime-sim-eta.vercel.app`, re-confirmed `200` this pass, though
whether the live build matches current `HEAD` was not checked (deploys
are manual `vercel --prod` runs, not push-triggered). **Pick your own next
task from `TASKS.md` → "Next up."** Strongest candidates, in rough
priority order: `TASK-003` (content cross-reference integrity check —
still not implemented, and the content surface has doubled since it was
written), `TASK-006` (manual browser playthrough — Chapters/Floors 11-20
and the newer guidance/music systems have never been clicked through by
an agent), `TASK-002` (React error boundary — still doesn't exist).

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
3. **15 more application-code commits landed** (across several later
   sessions, per `SESSION_LOG.md`'s "Session 4" entry and `git log`)
   without a full doc re-sync each time — Chapters/Floors 11-20, real
   cast names, colorization, portrait/background art overrides, a Combat
   Arena, two portrait bug-fix rounds, objective tracking, a guidance
   system, and background music. `HEAD` moved from `4f6ac3e` to `b0a4dbe`.
4. **This 2026-08-07 "final transfer checkpoint" pass.** Confirmed 2
   untracked-but-finished items (`docs/PORTRAIT_PROMPTS.md`,
   `public/backgrounds/.gitkeep`) and committed them separately from a
   documentation-only commit; corrected stale HEAD/commit-count/
   test-count/chapter-count numbers across `CLAUDE.md`, `PROJECT_STATE.md`,
   `TASKS.md`, and this file; ran a repo-wide secret scan (nothing found);
   re-ran `tsc`/`lint`/`test`/`build` fresh (all clean, 83/83 tests). Did
   **not** rewrite `FEATURES.md` line-by-line (flagged as stale instead —
   see its header note) and did **not** push to `origin`.

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
a much larger surface area at 20 chapters/floors per world instead of 1).

## Which commands should I run first?

```bash
cd ~/Projects/anime-sim
git status                                     # should be clean (no modified/untracked files)
git log --oneline -5                           # HEAD should be b0a4dbe
git log origin/main..HEAD --oneline            # should list 11 commits — re-verify, don't trust this number
npx tsc --noEmit -p tsconfig.json && pnpm lint && pnpm test && pnpm build
```
Expect `tsc`/`lint`/`build` clean and `test` at 83/83. If any of this
differs — especially the ahead-of-origin count, which changes the moment
the user pushes — something has changed since this pass; figure out what
before proceeding, and update `PROJECT_STATE.md`.

## How do I verify the app still works?

```bash
pnpm dev
```
Then open whatever port it binds to (usually `http://localhost:3000`) and
walk `TESTING.md`'s manual smoke-test checklist. Some individual sessions
have Playwright-verified specific slices (Combat Arena, portrait fixes,
textured rooms — see `SESSION_LOG.md`), but **no session has done a full
playthrough of Chapters/Floors 11-20 or the newer guidance/music systems**
— every verification of that newer content has been code inspection + the
automated test suite. That remains the single biggest unverified claim in
this memory system — prioritize a real browser check of the guidance
waypoint/"Guide" button flow and the 11-20 content if you touch either.

---

## Prompt for the next Claude Code account

Copy-paste this to start a new session cleanly:

```
Read CLAUDE.md, PROJECT_STATE.md, and TASKS.md in full before doing
anything else. Then:

1. Run `git status`, `git log --oneline -5`, and
   `git log origin/main..HEAD --oneline`. As of the 2026-08-07 "final
   transfer checkpoint" pass, the expected state was: working tree
   completely clean (no modified or untracked files), HEAD at commit
   b0a4dbe ("Add background music, a compass/guide system, and another
   visual pass"), 25 commits total, and **11 commits ahead of
   origin/main, unpushed**.
   DO NOT TRUST THAT "11" NUMBER. It is a snapshot from one point in
   time, not a fact about the repo — the user may have pushed, or added
   more commits, since this was written. Re-run
   `git log origin/main..HEAD --oneline` yourself and use whatever it
   actually says. If anything else about the repo state doesn't match
   (different HEAD, dirty tree), stop and tell me what's different before
   proceeding — don't silently reconcile it.
2. Run the verification suite: `npx tsc --noEmit -p tsconfig.json && pnpm
   lint && pnpm test && pnpm build`. Confirm all four pass clean (83/83
   tests as of this snapshot — re-verify the count, don't quote it back
   to me from memory) — or tell me if the picture has changed.
3. In 3-5 sentences, summarize your understanding of: what this project
   is, what's actually playable right now (both worlds' full 20-chapter/
   floor arcs plus the guidance/music systems), and what TASKS.md lists
   as the next candidate task. I want to confirm you've actually absorbed
   the memory files, not just skimmed them.
4. Flag anything in CLAUDE.md/PROJECT_STATE.md/TASKS.md/FEATURES.md that
   looks stale or contradicts what you find in the actual code — don't
   silently work around a contradiction, surface it. FEATURES.md in
   particular is known to still describe a 10-chapter/10-floor arc and
   has not been re-audited feature-by-feature since Chapters/Floors
   11-20 and the newer systems (guidance, music, art overrides, Combat
   Arena) landed — treat its specifics as unverified until you check.
5. No task is currently in progress — pick one from TASKS.md → "Next up"
   with me before starting significant work, rather than assuming.
6. Preserve the existing architecture (single Zustand store, Zod-validated
   plain-data content, pure-function lib/engine layers, IndexedDB-only
   persistence, no backend) unless you find a genuinely strong reason to
   change it — and if you do, write it up in DECISIONS.md rather than
   changing it silently.
7. Before pushing anything to origin (11+ commits are currently sitting
   local-only), confirm with me first — that's my call, not something to
   do as a side effect of another task.
8. After completing any meaningful work, update PROJECT_STATE.md,
   TASKS.md, and append to SESSION_LOG.md before ending your session —
   don't let the next handoff start from a stale snapshot. Re-run the
   ahead-of-origin check one more time right before you stop, in case the
   user pushed mid-session.
```
