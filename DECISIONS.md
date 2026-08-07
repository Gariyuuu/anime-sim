# DECISIONS.md

Architectural decisions recoverable from the repository. Each is labeled
**Verified** (the repo/README/comments directly state the reasoning) or
**Inferred** (reasoning inferred from the code's shape/structure — the
original developer's actual reasoning is not stated anywhere and is not
fabricated here).

## No backend, fully client-side app

- **Decision:** No server routes, no database server, no auth — everything
  runs in the browser, persisted to IndexedDB.
- **Label:** Verified. `README.md` states directly: "Open
  http://localhost:3000. The game boots straight into the title screen
  sequence — no backend, database server, or API keys required. Everything
  runs and saves locally in the browser," and "The app is a fully
  client-side SPA (no server routes, no database, no required environment
  variables)."

## Custom Canvas + DOM engine instead of Phaser/PixiJS

- **Decision:** Exploration/combat rendering uses a small custom Canvas +
  DOM engine (`src/engine/`) rather than a full game-engine dependency.
- **Label:** Verified. `README.md`'s "Technology Stack" section states the
  reasoning directly: the "sprites" are original flat geometric
  placeholders, not sprite sheets, so a full game-engine dependency wasn't
  justified, and the custom engine keeps the door open to swap in Phaser
  later "if hand-drawn sprite sheets are added (the engine and content
  layers don't know or care how tiles are rendered)."

## Content as plain, Zod-validated TypeScript data, not JSON/CMS/database

- **Decision:** Every NPC/item/quest/map/scene/enemy is a plain TS object
  literal in `src/content/worlds/<world>/*.ts`, validated once at import
  time via `content/registry.ts`'s `parseAll`.
- **Label:** Verified. `README.md`: "Everything is parsed and validated
  through the full schema in `content/registry.ts` at import time — an
  invalid scene, a dangling item reference, or a malformed condition fails
  loudly during `pnpm dev`/`pnpm build`, not silently at runtime." (Note:
  the original documentation audit found that the "dangling item
  reference" claim is *not* actually true for cross-references like scene
  IDs referenced from map interactables — Zod validates shape, not
  existence of a referenced ID elsewhere in the registry. That specific
  gap (21 dangling Floor 4–10 scene references) has since been fixed by
  authoring the missing content, in commit `4f6ac3e`, but the underlying
  architectural gap — nothing *automatically* catches a dangling
  reference — remains; see `ARCHITECTURE.md`'s "Major architectural
  risks" #3 and `TASKS.md` → `TASK-003`. This appears to be either an
  inaccuracy in the README's claim, or a distinction the original author
  didn't intend to draw between "shape-invalid" and "reference-invalid"
  content.)

## `*Input` types (`z.input`) separate from full inferred types

- **Decision:** Content authors write against `NpcDefinitionInput`,
  `SceneInput`, etc. (aliases of `z.input<typeof Schema>`) rather than the
  full `z.infer` type, so fields with a Zod `.default()` don't need to be
  repeated in every hand-authored object.
- **Label:** Verified. `src/types/content-input.ts`'s doc comment states
  this directly: "'Input' variants of content schemas: fields with a zod
  `.default()` become optional, so hand-authored content files don't need
  to repeat every default value."

## Single Zustand store, no Context/Redux

- **Decision:** One `useGameStore` (Zustand) holds all runtime state;
  components subscribe via selectors.
- **Label:** Inferred. No comment states this explicitly, but it's
  consistent and total across the codebase — every stateful component
  reads via `useGameStore((s) => ...)`, and no `React.Context` provider or
  second store exists anywhere (verified via grep for `createContext` and
  `create(` — only one `create()` call, in `gameStore.ts`).

## `applyEffects`/`evaluateConditions` as the single execution path for all game-rule mutations/checks

- **Decision:** Every stat/relationship/flag/quest/inventory mutation and
  every conditional check across both worlds' entire content routes
  through two functions (`lib/effects.ts`'s `applyEffects`,
  `lib/conditions.ts`'s `evaluateConditions`), rather than being
  special-cased per scene or per world.
- **Label:** Inferred from the consistent shape of `Effect`/`Condition` as
  a single shared discriminated union (`types/narrative.ts`) used
  identically by dialogue-node effects, choice effects, map-interactable
  `requiresFlag` checks, and quest objectives. `README.md`'s
  "Content-Authoring Guide" section describes this pattern (shared,
  reusable conditions/effects) as intentional, supporting the inference.

## `SaveGame` fields default-safe for forward compatibility

- **Decision:** New optional `SaveGame` fields are added with `.default()`
  or `.optional()` in `SaveGameSchema`, not as required fields, so old
  saves keep loading after a schema change.
- **Label:** Inferred. The pattern holds for every optional-looking field
  in `types/save.ts` (e.g. `safeZoneCheckpoint`, `guildId`, `classId`, and
  `unlockedChapterIds`, added and committed correctly in `4f6ac3e`), and
  the failure mode if this
  discipline were dropped (existing saves silently fail `safeParse` and
  return `null` from `loadSaveSlot`) is severe enough that it reads as a
  deliberate practice rather than coincidence. No comment states this
  explicitly as a rule — see `CLAUDE.md`'s "DO NOT CHANGE WITHOUT REVIEW"
  section, which promotes this inference to an explicit rule for future
  work regardless of whether it was originally deliberate.

## `structuredClone` for immutable-style updates, not Immer

- **Decision:** `applyEffects` and `engine/combat.ts`'s action functions
  use `structuredClone`/manual spread-and-mutate-the-clone rather than a
  library like Immer.
- **Label:** Inferred from the absence of `immer` in `package.json` and
  the consistent hand-rolled clone-then-mutate pattern across
  `lib/effects.ts` and `engine/combat.ts`. No stated reasoning found;
  plausible (not asserted as fact) that this was to avoid an extra
  dependency for a codebase already using Zustand's plain `set()`.

## No test framework beyond Vitest + Testing Library; no E2E framework

- **Decision:** Unit/pure-function tests via Vitest, no Playwright/
  Cypress/E2E setup, no component-render tests despite
  `@testing-library/react` being installed.
- **Label:** Inferred. `@testing-library/react`/`jest-dom` are installed
  (`package.json` devDependencies) but zero test files under `src/tests/`
  actually render a component (verified: all 7 test files, including the
  `dialogueNavigation.test.ts` file added in `4f6ac3e`, import only from
  `lib/`, `engine/`, `state/gameStore`, or `content/registry`, never from
  `components/`) — suggesting component testing was set up for but never
  actually used, or was planned and deferred. Not stated anywhere as an
  explicit decision.

## No CI/CD pipeline

- **Decision:** No GitHub Actions workflow, no automated deploy pipeline.
- **Label:** Inferred from the simple absence of a `.github/workflows/`
  directory (verified). No stated reasoning; consistent with this being a
  solo/personal project at the "vertical slice" stage per `README.md`.

## No deployment has actually been run yet

- **Decision (or rather, current state, not necessarily a deliberate
  decision):** despite `README.md` documenting a ready-to-go Vercel deploy
  process, no `.vercel/` directory or `vercel.json` exists, and no live
  URL is referenced anywhere in the repo.
- **Label:** Inferred (as a fact about current state, not a stated
  decision) from the absence of deployment artifacts, contrasted against
  this developer's sibling projects (`chamber-seven`, `buildstrike-arena`)
  which DO have `.vercel/project.json` and documented live URLs. This
  reads as "not yet done" rather than "deliberately not deployed," but
  that's an inference, not a fact stated in the repo.
