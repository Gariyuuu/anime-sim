# CHANGELOG.md

This file tracks repository/documentation-level history. For the in-game,
player-facing version history, see `src/content/patchnotes.ts` (rendered
in-app under Patch Notes) — that file's `v0.1.0` entry is the only
existing history and is preserved below verbatim as a reference, not
duplicated as a separate changelog entry, since it already exists in the
repo and predates this file.

## Existing in-game version history (for reference — see `src/content/patchnotes.ts`)

**v0.1.0 — "First Login"**
- Boot sequence, title screen, full character creator.
- Two playable worlds: Elite Academy and Aincrad.
- Data-driven dialogue engine with conditions, effects, branching choices,
  bluffs, silence options, hidden stat checks.
- Elite Academy Chapter One ("The First Ranking") — fully playable.
- Aincrad Chapter One ("The Locked Sky") — fully playable on Floor 1.
- Aincrad Floors 2–3 explorable, lighter narrative content than Floor 1.
- Turn-based combat, Canvas-based exploration, 7-axis relationship system,
  persistent Dexie-backed saves, in-game device, codex, 22 achievements,
  settings/accessibility, chapter recap screens, dev debug panel.
- Known issues (as documented in-app): Floors 2–3 have shorter dialogue
  content than Floor 1; Floors 4+ are locked previews only; no licensed
  music ships; some accessibility settings don't yet reach every
  custom-drawn Canvas element.
- Upcoming (as documented in-app): deeper Floor 2–3 narrative content,
  Floor 4 unlock + a second Elite Academy chapter, player-created guilds,
  expanded academic minigames.

---

## 2026-08-06 — Documentation and handoff audit

**No product behavior was intentionally changed.** This was a
documentation-only pass: full repository audit + creation/revision of the
17-file memory system (`CLAUDE.md` and 16 new files), matching the
standard already established in this developer's sibling repos
(`chamber-seven`, `buildstrike-arena`).

**Files created:** `PROJECT_STATE.md`, `ARCHITECTURE.md`, `FILE_MAP.md`,
`FEATURES.md`, `TASKS.md`, `ROADMAP.md`, `DECISIONS.md`, `DATABASE.md`,
`API_REFERENCE.md`, `UI_SYSTEM.md`, `SECURITY.md`, `TESTING.md`,
`DEPLOYMENT.md`, `CHANGELOG.md` (this file), `SESSION_LOG.md`,
`HANDOFF.md`.

**Files revised:** `CLAUDE.md` (previously a 1-line placeholder,
`@AGENTS.md`; rewritten into the full operating manual).

**Files read but not modified:** `README.md` (verified accurate for the
committed baseline, not updated since no product change occurred),
`AGENTS.md` (Next.js-auto-generated, left alone), `package.json`,
`pnpm-lock.yaml`, `tsconfig.json`, `eslint.config.mjs`,
`vitest.config.mts`, `next.config.ts`, `postcss.config.mjs`,
`pnpm-workspace.yaml`, `.gitignore`, `public/manifest.json`, and the full
`src/` tree (every `.ts`/`.tsx` file was either fully read or grep-searched
for the audit's specific checks — see `SESSION_LOG.md` for the exact list).

**Problems discovered (all pre-existing in the working tree, none caused
by this audit):**
1. The working tree has a substantial uncommitted diff (10 modified files)
   implementing Aincrad Floor 4–10 content and multi-chapter navigation
   infrastructure. This diff currently fails `tsc`/`next build` (2 errors)
   and has 1 failing Vitest test, and is not wired into any UI. See
   `PROJECT_STATE.md` and `TASKS.md` → `TASK-001` for full detail.
2. The Floor 4–10 content references 21 scene IDs that don't exist
   anywhere in `scenes.ts`.
3. `nextChapterId: "ea-ch2"`/`"ai-ch2"` reference chapters that don't
   exist.
4. No deployment has ever been run for this repo, despite `README.md`
   documenting a ready deploy process — no `.vercel/`, no `vercel.json`,
   no live URL found anywhere.
5. A handful of smaller pre-existing gaps not connected to the uncommitted
   diff: `changeClassPoints` effect is a documented no-op; no React error
   boundaries exist anywhere; `engine/exploration.ts` has no dedicated
   tests; `colorblindMode`/`minigameAssist` settings weren't traced to any
   actual behavior.

**Verification performed:** `npx tsc --noEmit -p tsconfig.json`, `pnpm
lint`, `pnpm test`, `npx next build` were all run against the actual
working tree (uncommitted changes included) and their real output is
recorded in `PROJECT_STATE.md`. The committed baseline (`fa2e70b`) was
separately verified clean on all four via an isolated, temporary `git
worktree` (created and removed this session, never touching the real
working tree).

**Nothing was committed, pushed, deployed, reset, or discarded.**

**One notable wrinkle:** the working tree's uncommitted changes were NOT
static during this session — a `git status` re-check partway through
found the diff had grown from 10 modified files (~278 lines) to 20
modified files (~3,154 lines), consistent with someone (likely the user,
possibly another agent) actively working on the same in-progress feature
(TASK-001) concurrently with this documentation pass. This is documented
in full, with both states preserved as labeled snapshots, in
`PROJECT_STATE.md`, `SESSION_LOG.md`, `TASKS.md`, `CLAUDE.md`, and
`HANDOFF.md` — each carries an explicit warning not to trust exact file/
line counts or error messages without re-checking `git status` and
re-running the verification commands.
