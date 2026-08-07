# SECURITY.md

Defensive review only. No destructive testing was performed; findings are
from static code inspection and the automated test/lint/typecheck runs
documented in `PROJECT_STATE.md`.

## Auth / authz boundaries

**None exist, and none are needed.** There is no login, no user accounts,
no session, no server to authorize against. The app has exactly one
"user" per browser profile, implicitly. This is a deliberate architectural
choice (see `DECISIONS.md`), not a gap — flagging it as a "finding" would
be inaccurate; it's correctly scoped to a single-player, local-only game.

## Secret handling

No secrets exist anywhere in this repository. Verified this session via:
- Repo-wide `grep` for `process.env` — the only match is
  `NEXT_PUBLIC_ENABLE_DEBUG` (a public, non-sensitive feature flag).
- No `.env`/`.env.local`/`.env.example` file exists.
- No API keys, tokens, connection strings, or credentials of any kind
  found in source, config, or documentation.
- `.gitignore` already excludes `.env*` (standard hygiene, currently
  unexercised since no such file exists).

**This documentation audit itself introduced no secrets** — every new
memory file was checked for accidental inclusion of real values; only
placeholder/example values (and the one real, non-sensitive
`NEXT_PUBLIC_ENABLE_DEBUG` flag name, not a value) appear anywhere.

## Client-exposed variables

`NEXT_PUBLIC_ENABLE_DEBUG` is the only environment variable in the app,
and it's `NEXT_PUBLIC_*` by design (it needs to be readable client-side to
gate the debug panel's render). It carries no sensitive information — at
worst, setting it to `"true"` in a production deploy exposes the developer
debug panel (flag/stat editors, teleport, state export) to end users. See
"Admin access" below.

## Input validation

Every piece of data that crosses a trust boundary is validated by Zod:
- **Content** (authored by the developer, not user input) — validated at
  import time (`content/registry.ts`).
- **Saves loaded from IndexedDB** — `SaveGameSchema.safeParse` (fails
  closed: returns `null` rather than loading malformed data).
- **Imported save files** (user-supplied JSON, via `importSave` /
  `SaveSelectScreen.tsx`'s import flow) — `SaveGameSchema.parse()`, throws
  on invalid/tampered JSON. This is the one place genuinely
  "untrusted"/user-supplied data enters the app (a player could hand-edit
  an exported save file and re-import it), and it IS validated —
  correctly rejects a structurally invalid file. **Not validated:**
  whether ID *values* inside a validated-shape save (e.g.
  `currentSceneId`, item IDs in `inventory`, `flags`) actually correspond
  to real content — an imported save with a syntactically valid but
  semantically bogus `currentSceneId` would pass Zod validation and then
  hit `gameStore.ts`'s existing "not found" fallback (returns to
  exploration/device silently) rather than crash. Low severity: this is a
  single-player local game — the only person who could "attack" their own
  save file is the player themselves, and the worst outcome is a broken
  save, not any data compromise.
- **Character creator input** — `CharacterCreatorInput`/`PlayerSchema`.

## Injection / XSS / CSRF risk

- **XSS:** all text rendered from content/save data goes through normal
  React JSX text interpolation (`{value}`), which auto-escapes — no
  `dangerouslySetInnerHTML` usage found anywhere in `src/` (verified via
  grep). Since all narrative text is developer-authored (not user-
  submitted and re-displayed to other users — there are no other users),
  XSS risk is effectively nil even before considering React's escaping.
- **SQL/NoSQL injection:** not applicable — no SQL/query language of any
  kind is used; IndexedDB access is entirely through Dexie's typed API
  (`db.saves.get/put/delete`), never raw queries built from strings.
- **CSRF:** not applicable — there is no server session/cookie-based auth
  to forge a request against.

## File upload risk

The closest analogue is the save-file **import** feature
(`SaveSelectScreen.tsx` → `importSave`). It's a client-side `FileReader`-
style JSON read (not verified to be exactly this API, but functionally
equivalent — no upload to any server occurs), validated by
`SaveGameSchema.parse()` before being written to IndexedDB. No file is
ever transmitted anywhere; "upload" here just means "read a local file
into memory." Risk: low, same reasoning as "Input validation" above.

## Webhook verification

Not applicable — no webhooks exist.

## Rate limiting

Not applicable — no server, no API to rate-limit. The only "abuse" surface
is a player spamming their own browser's IndexedDB writes (e.g. rapidly
triggering `saveGame()`), which is self-limited by normal UI interaction
speed and has no impact beyond the player's own local storage quota.

## Admin access

The **debug panel** (`DebugPanel.tsx`) is the closest thing to an
"admin" surface — flag/stat editors, teleport, quest triggers, state
export. Gated by `NODE_ENV === "development" || NEXT_PUBLIC_ENABLE_DEBUG
=== "true"` (verified, `DebugPanel.tsx:10`). **This is correctly
production-safe by default** — a standard `next build && next start`
without setting `NEXT_PUBLIC_ENABLE_DEBUG` will not expose it (`NODE_ENV`
is `"production"` in that case). The only way to accidentally expose it in
production is to explicitly set `NEXT_PUBLIC_ENABLE_DEBUG=true` in the
deploy's environment — a real but low-severity risk (it lets a player
freely edit their own local save state, which they could already do more
crudely by hand-editing an exported save file and re-importing it).

## DB policies

Not applicable in the traditional sense — see `DATABASE.md`. IndexedDB is
already scoped per-browser-origin by the browser itself; there's no
server-side policy layer (RLS, etc.) to configure because there's no
server-side database.

## Logging of sensitive data

No logging framework exists, and zero `console.*` calls exist anywhere in
`src/` (verified via grep) — so there is no risk of sensitive data (there
is none) leaking into logs, because there are no logs.

## Dependency concerns

Not independently audited via `npm audit`/`pnpm audit` this session (out
of scope for a documentation-only pass, and running it would hit the
network). Notable from `package.json` alone:
- All dependencies are well-known, actively maintained libraries (Next.js,
  React, Zustand, Dexie, Zod, Framer Motion, Howler, lucide-react) — no
  obscure/abandoned packages found.
- `pnpm-workspace.yaml`'s `allowBuilds: { sharp: false, unrs-resolver: false
  }` explicitly disables native build scripts for `sharp` and
  `unrs-resolver` — these are pnpm's post-2024 "block untrusted postinstall
  scripts by default" allowlist entries, and here they're explicitly
  denied, meaning neither package's install script runs. This is a
  conservative, security-positive default (not a gap).
- **Recommendation:** run `pnpm audit` periodically (not done this
  session) to check for known CVEs in the dependency tree, especially
  before any future deploy.

## Production security gaps

1. No error boundaries — an uncaught exception surfaces Next.js's default
   error UI (which in production shows a generic message, not a stack
   trace, so this is a UX gap more than an information-disclosure risk,
   but still worth fixing — see `TASKS.md` → `TASK-002`).
2. `NEXT_PUBLIC_ENABLE_DEBUG` misconfiguration risk (see "Admin access"
   above) — low severity, but worth a deploy-checklist reminder (see
   `DEPLOYMENT.md`).
3. No dependency audit has been run recently (see "Dependency concerns").

## Recommended fixes

- Add a top-level React error boundary (`TASKS.md` → `TASK-002`).
- Add `pnpm audit` to a pre-deploy checklist once deployment is actually
  set up (`DEPLOYMENT.md`).
- Before any production deploy, explicitly confirm
  `NEXT_PUBLIC_ENABLE_DEBUG` is unset (or `"false"`) in the hosting
  provider's environment variable configuration.
- Consider the content cross-reference integrity check already recommended
  in `ARCHITECTURE.md`/`TASKS.md` (`TASK-003`) — not a security fix per
  se, but it would catch the kind of dangling-reference bug currently
  present in the uncommitted Floor 4–10 work before it ships.
