# API_REFERENCE.md

## There is no HTTP API

No `src/app/api/` directory exists (verified via `find`). No REST
endpoints, no GraphQL, no Server Actions, no webhooks, no outbound
third-party API calls at runtime. The entire application is a static/
client-rendered Next.js SPA with one route (`/`) that renders one React
component tree. See `ARCHITECTURE.md`.

## Closest equivalent: the Zustand store's public action surface

The `useGameStore` actions (`src/state/gameStore.ts`) are the app's only
"interface" — every user interaction and every screen calls one of these.
Documented here in the same shape an API reference would use, since this
is the actual boundary components code against.

Internal-only actions prefixed `_` (`_resolveEffects`, `_settleAtNode`) are
excluded — they're implementation details of other actions, never called
directly from a component.

| Action | Params | Side effects | Persists? |
|---|---|---|---|
| `setScreen(screen)` | `Screen` | Sets `screen`. | No |
| `setPendingWorldId(worldId)` | `WorldId \| null` | Sets `pendingWorldId` (world chosen but not yet confirmed in the character creator). | No |
| `startNewGame(input)` | `CharacterCreatorInput` | Builds a new `SaveGame`, enters Chapter One's start scene. | Yes (via `_settleAtNode` → `saveGame`) |
| `continueFromAutosave()` | — | Loads the `autosave` slot, returns `boolean` (found or not). | No (read-only) |
| `loadGame(slotId)` | `string` | Loads that slot into `save`. | No (read-only) |
| `saveGame(slotIdOverride?)` | `string?` | Persists current `save` to the given/current slot **and** to `autosave`. | Yes |
| `returnToTitle()` | — | Clears `save`/`combat`, `screen: "title"`. | No |
| `goToScene(sceneId, nodeId?)` | strings | Enters a scene at the resolved/given node. | Yes |
| `selectChoice(choiceId)` | `string` | Applies the choice's effects, logs it, navigates per `goTo`/ends the scene. | Yes |
| `advanceToNode(nodeId)` | `string` | Jumps within the current scene. | Yes |
| `endDialogue()` | — | Exits dialogue mode into exploration/device. | Yes |
| `logDialogueLine(speaker, text)` | strings | Appends to `dialogueHistory` (deduped against the immediately-previous line, capped at 200). | No (folded into the next `saveGame()`) |
| `moveToMap(mapId, spawnId?)` | strings | Changes `currentMapId`/`currentSpawnId`, `mode: "exploration"`. | Yes |
| `interact(interactableId)` | `string` | Dispatches by interactable `kind` (door/transition → `moveToMap`; monster → `startCombat`; hidden-item → grant + notify; else → `goToScene`). Respects `requiresFlag`. | Yes (for hidden-item/scene paths) |
| `startCombat(encounterId)` | `string` | Builds `CombatRuntimeState` via `engine/combat.ts`, `mode: "combat"`. | No (combat state itself is never persisted — see `ARCHITECTURE.md` risk #4) |
| `doPlayerAttack/doPlayerSkill/doPlayerGuard/doPlayerDodge/doPlayerItem/doPlayerAnalyze/doPlayerEscape` | varies | Delegates to the matching `engine/combat.ts` function; all guarded by `combat.phase === "player-turn"` (except escape). | No |
| `resolveCombatEnd()` | — | Applies XP/col/victory effects and leveling on victory; HP penalty + possible survival-mode checkpoint rewind on defeat; cleanup on escape. | Yes |
| `toggleDevice(open?)` | `boolean?` | Opens/closes/toggles the device modal. | No |
| `toggleDebug(open?)` | `boolean?` | Opens/closes/toggles the debug panel. | No |
| `updateSettings(partial)` | `Partial<Settings>` | Merges into `save.settings`. | No (caller must call `saveGame()` separately; `SettingsScreen.tsx` also writes to `localStorage` via `lib/save.ts` helpers) |
| `applyEffectsBatch(effects)` | `Effect[]` | Generic entry point for applying arbitrary effects (used by the debug panel). | Yes |
| `pushNotification(n)` / `dismissNotification(id)` | — | Toast queue management. | No |
| `markMessagesRead()` | — | Marks all device messages read. | No |
| `debugSetFlag/debugClearFlag/debugTeleport/debugModifyStat/debugResetSave` | varies | Dev-only shortcuts, gated by `DebugPanel.tsx`'s render guard (not by the store itself — the actions exist regardless of `NEXT_PUBLIC_ENABLE_DEBUG`). | Varies |
| `showChapterRecapIfDue()` | — | Checks the current chapter's `completionFlag`, enters `mode: "recap"` once. | Yes |
| `advanceChapter()` **(uncommitted, unwired)** | — | Advances to `currentChapter.nextChapterId` if it resolves to a real chapter; else falls back to free play. | Yes |
| `jumpToChapter(chapterId)` **(uncommitted, unwired)** | `string` | Jumps to an already-unlocked chapter. | No explicit `saveGame()` call in the current implementation — verify before relying on this persisting immediately. |

## Content registry lookups (`src/content/registry.ts`)

Not an API in the network sense, but the other half of the app's data
boundary — every ID string stored in a `SaveGame` (an `npcId`, `sceneId`,
`itemId`, etc.) is resolved through one of these:

`getNpc`, `getItem`, `getQuest`, `getMap`, `getScene`, `getChapter`,
`getClass`, `getSkill`, `getEnemy`, `getGuild`, `getFloor`, `getEncounter`,
`getAchievement`, `getCodexEntry`, `getMessageDefinition` (in
`content/messages.ts`), plus list helpers `npcsForWorld`, `itemsForWorld`,
`questsForWorld`, `floorsSorted`, and (uncommitted) `chaptersForWorld`. All
return `undefined`/`[]` on a missing ID rather than throwing — callers
must handle the not-found case (most do via optional chaining / early
`return`).

## Errors

No HTTP status codes exist. The closest analogues:
- Zod `.parse()` throws (uncaught, by design) on invalid **content** —
  surfaces as a build/dev-time crash.
- Zod `.safeParse()` returns `null`/falls back to defaults on invalid
  **runtime** data (corrupted save, bad settings blob) — see
  `DATABASE.md`.
- Store actions that can't find their target (e.g. `selectChoice` with an
  unknown `choiceId`, `interact` with an unknown `interactableId`) simply
  `return` early and no-op — no error is surfaced to the UI in these
  cases (verified by reading each action's guard clauses in
  `gameStore.ts`).

## Secrets in this document

None — there is nothing to leak. No API keys, tokens, or credentials exist
anywhere in this app.
