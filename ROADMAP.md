# ROADMAP.md

**Re-synced 2026-08-06** against commit `4f6ac3e` ("Expand to 10 full
chapters/floors in both worlds") and `patchnotes.ts`'s new `v0.2.0` entry,
which shipped as part of that same commit. The prior version of this file
described the Floor 4–10 / multi-chapter work as an in-progress,
uncommitted "current milestone" (`TASK-001`) — that milestone is done; the
sections below are rewritten to reflect `patchnotes.ts`'s own `v0.2.0`
"upcoming" list as the new current roadmap.

No time estimates are given anywhere below — none exist in the repo and
none are invented here. Priorities and statuses are derived from
`src/content/patchnotes.ts` (the in-app, versioned, authoritative
"completed / known issues / upcoming" list) cross-checked against the
actual current code.

## Current milestone

**None in progress.** The prior current milestone — finishing and
stabilizing the Floor 4–10 / multi-chapter work — is **done**, shipped as
`patchnotes.ts`'s `v0.2.0` ("The Long Climb") and verified this session:
`tsc`/`lint`/`test`(62/62)/`build` all pass clean, both worlds have full
10-chapter/floor arcs, and the chapter-navigation UI (recap screen "Next
Chapter" button, device menu Chapters tab) is wired and working.

## Next milestone

Per `patchnotes.ts`'s `v0.2.0` `upcoming` list (the authoritative
in-app source, cross-checked against the code — none of these exist yet,
verified via grep for related content IDs):

**Deeper character-quest content for the new Aincrad floor-local NPCs.**
- **Objective:** The 7 new Floor 4–10 NPCs currently get an intro scene
  each but no dedicated quest content, unlike Floor 1's NPCs (which have
  personal quests/secrets). Give them the same depth.
- **Priority:** Medium (explicitly first on `patchnotes.ts`'s `v0.2.0`
  upcoming list).
- **Status:** Not started.
- **Dependencies:** none — the NPCs and their intro scenes already exist
  (`content/worlds/aincrad/npcs.ts`, `scenes.ts`).
- **Difficulty:** Medium (writing volume using an established pattern,
  not new architecture).
- **Risk:** Low.
- **Definition of done:** each of the 7 new NPCs has at least one
  quest/secret thread comparable in depth to a Floor 1 NPC's.

**A second Elite Academy year**, and **Floors 11+ of Aincrad** are also
listed in `v0.2.0`'s `upcoming` — both are larger, not-yet-scoped
expansions of the now-complete 10-chapter/floor arcs. Neither has any
content in the repo yet (verified via grep for `ea-ch11`/`ai-ch11`/
`floor-11` — zero matches).

## MVP completion

Per `patchnotes.ts` and `README.md`, the original "vertical slice" MVP bar
(both worlds' Chapter One playable, Floors 2–3 explorable) was met by the
`fa2e70b` baseline, and the project has since gone well past it: both
worlds now have **full 10-chapter/floor arcs** (`4f6ac3e`), all shared
systems (dialogue, relationships, quests, exploration, combat, device,
codex, achievements, settings, saves, chapter-navigation) are implemented
and test-covered where automatable (62/62 tests passing). This project is
solidly in post-MVP content expansion, now a full arc deeper than at the
last roadmap pass.

## Post-MVP

- **Deeper character-quest content for the new Aincrad floor-local
  NPCs** — see "Next milestone" above; this is now the top of
  `patchnotes.ts`'s own `upcoming` list.
- **A second Elite Academy year** — explicitly listed in `patchnotes.ts`'s
  `v0.2.0` `upcoming`. Priority: Medium. Status: not started. Difficulty:
  Very High — comparable in scope to the entire `4f6ac3e` expansion (9 new
  chapters) again, for a second year. Risk: Low technically (established
  content pattern), main risk is scope/time.
- **Floors 11+ of Aincrad** — explicitly listed in `patchnotes.ts`'s
  `v0.2.0` `upcoming`. Priority: Medium. Status: not started. Difficulty:
  Very High (same reasoning as above — 7+ more floors at the `4f6ac3e`
  depth level each). Risk: Low technically, main risk is scope/time.
- **Player-created guilds in Aincrad** — still listed in `patchnotes.ts`
  history (`v0.1.0` `upcoming`, carried forward, not yet superseded).
  Priority: Low/Medium. Status: not started (only the 3 pre-authored
  guilds exist, `content/worlds/aincrad/guilds.ts`). Dependencies: none
  identified. Difficulty: Medium–High (would need new UI, new
  save-schema fields, new content-authoring pattern). Risk: Medium (a
  genuinely new system, not just more content).
- **Expanded academic minigames for Elite Academy** — still listed in
  `patchnotes.ts` history (`v0.1.0` `upcoming`). Priority: Low. Status:
  not started — no minigame system exists anywhere in the codebase today
  (the `minigameAssist` setting exists but has nothing to assist, per
  `FEATURES.md`/`TASKS.md` → `TASK-005`). Dependencies: none. Difficulty:
  Medium–High (new gameplay system). Risk: Medium.
- **Music tracks** — the audio system is fully wired for `musicVolume`/
  `ambienceVolume` categories, but `AudioManager` has no `playMusic`/
  `playAmbience` method and no music/ambience files exist. Priority: Low.
  Status: not started. Difficulty: Low–Medium (mostly asset creation/
  sourcing plus a small `AudioManager` extension). Risk: Low.

## Long-term ideas

- **Sprite-sheet art**, replacing the current procedural flat-geometry
  placeholders (`PixelAvatar.tsx`) — `README.md` explicitly designed the
  engine/content split to make this swap possible later without touching
  game logic. Status: not started, no assets exist.

## Optional improvements

- React error boundaries (`TASKS.md` → `TASK-002`).
- Content cross-reference integrity validation (`TASKS.md` → `TASK-003`).
- `engine/exploration.ts` unit tests (`TASKS.md` → technical debt).
- Resolve the unused `floors.ts` `locked` field — either wire it into a
  real floor-select UI or remove it (`TASKS.md` → `TASK-007`, new finding
  this session).

## Out of scope

- **Multiplayer/shared state of any kind** — this is explicitly a
  single-player, fully client-side, no-backend game by design (see
  `ARCHITECTURE.md`). Adding this would be a fundamental architecture
  change, not a feature addition.
- **User accounts / authentication** — no evidence anywhere in the repo
  that this was ever planned; the save system is deliberately local-only.
- **Licensed/commercial anime IP** — explicitly and repeatedly disclaimed
  in `README.md` as never in scope; the project is committed to 100%
  original content.
- **Monetization/payments** — no evidence anywhere in the repo that this
  was ever planned; `README.md` describes the project as "noncommercial."
