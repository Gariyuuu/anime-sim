# DEPLOYMENT.md

## Current status: DEPLOYED (superseded the "not deployed" claim below)

**Update, 2026-08-07 checkpoint pass:** this project has since been
deployed. Live at `https://anime-sim-eta.vercel.app` (Vercel project
`anime-sim`, linked via `.vercel/project.json`, which now exists), via a
manual `vercel --prod` run in a later session (not triggered by a git
push). Re-confirmed `200` via `curl` this pass. Deploys are **not**
push-triggered — `main` is currently 11 commits ahead of `origin/main`
(unpushed), so the live deploy can drift from what's on GitHub; nobody has
verified whether the current live build matches `HEAD` (`b0a4dbe`) exactly.
See `PROJECT_STATE.md` for the up-to-date git state. The section below
("No deployment has ever been run…") is the original, now-stale audit —
kept for history, not current fact.

**Original (superseded) audit, 2026-08-06:**

**No deployment has ever been run for this repository**, as far as
anything in the repo can show. Verified this session:
- No `.vercel/` directory (contrast: sibling projects `chamber-seven` and
  `buildstrike-arena` both have `.vercel/project.json` linking them to a
  real Vercel project).
- No `vercel.json`.
- No live URL referenced anywhere in `README.md`, `package.json`, or any
  source file.
- `git remote -v` shows a GitHub remote
  (`https://github.com/Gariyuuu/anime-sim.git`) that the one existing
  commit has been pushed to — so the code is on GitHub, but GitHub-hosted
  ≠ deployed.

Treat any claim that this project is "live" as false until you personally
see a `.vercel/project.json` or a working URL — this differs from this
developer's other repos in the same `~/Projects` directory, several of
which genuinely are live.

## Hosting provider (intended, per README.md)

`README.md`'s "Deployment" section describes Vercel with zero required
configuration:

```bash
vercel deploy        # preview
vercel --prod         # production
```

or connecting the GitHub repo directly in the Vercel dashboard for
automatic `next build`-based deploys. This is plausible and consistent
with the app's architecture (no server, no env vars required — see
`CLAUDE.md`), but it has not actually been exercised in this repo.

## Build / install commands

From `package.json`:
```bash
pnpm install
pnpm build     # next build
pnpm start     # next start — serve the production build locally
```
**As of this audit, `pnpm build` FAILS on the current (uncommitted-diff)
working tree** — see `PROJECT_STATE.md` for the exact TypeScript errors.
It succeeds on the committed baseline (`fa2e70b`), independently verified
via an isolated git worktree this session. **Do not attempt a real deploy
until `pnpm build` passes locally first** — a platform like Vercel would
fail the deploy at the same "Running TypeScript" step.

## Runtime version

- **Node:** `README.md` states "Requires Node 20+." No `.nvmrc` or
  `engines` field exists in `package.json` to enforce this — it's
  documentation only, not enforced by tooling.
- **pnpm:** `11.20.0` (`packageManager` field in `package.json` — Corepack
  would pin to exactly this version if Corepack is enabled in the deploy
  environment).
- **Next.js:** `16.3.0`, using Turbopack for both dev and build (confirmed
  by the build log this session: "▲ Next.js 16.3.0 (Turbopack)").

## Environment configuration

**None required.** `NEXT_PUBLIC_ENABLE_DEBUG` is the only environment
variable the app reads, and it's optional — see `CLAUDE.md` → "Environment
setup." A first deploy needs zero environment variable configuration on
whatever platform is chosen (confirm `NEXT_PUBLIC_ENABLE_DEBUG` is left
unset or explicitly `"false"` for a production deploy — see `SECURITY.md`).

## Domains

None configured — no custom domain evidence found anywhere in the repo
(no `vercel.json`, no DNS config, no domain string referenced).

## Migration order

Not applicable — there is no database migration step in the deploy
process (see `DATABASE.md`; IndexedDB schema lives entirely client-side
and needs no server-side migration coordination).

## Deployment limitations

- The app is a fully static/client-rendered SPA — it should deploy cleanly
  to any static-hosting-capable platform (Vercel, Netlify, Cloudflare
  Pages, plain `next start` on any Node host), not just Vercel
  specifically, though Vercel is what's documented/intended.
- `README.md` also notes it "builds to a static-export-compatible client
  bundle if you need to host it elsewhere" (referencing Next.js static
  exports) — this was not independently verified (no `next export`/
  `output: "export"` config was tested this session; `next.config.ts` is
  currently empty, so static export isn't pre-configured, just claimed as
  possible).
- **The current working tree cannot be deployed as-is** — `pnpm build`
  fails (see "Build / install commands" above). This must be fixed first
  (`TASKS.md` → `TASK-001`).

## Rollback process

Not applicable yet — no deployment history exists to roll back from. Once
a real deploy exists, Vercel's own deployment-history/rollback UI (or
`vercel rollback`) would be the standard mechanism, consistent with this
developer's other Vercel-hosted projects — but this is inferred from
sibling-project convention, not confirmed for this repo specifically.

## Health checks

Not applicable — no server-side health-check endpoint exists (there's no
server). A "health check" for this app is simply "does the page load and
render past the boot screen," which would need to be verified manually or
via a synthetic browser check (e.g. a Vercel deployment's automatic
build-success gate) rather than an `/api/health`-style endpoint.

## Post-deploy verification (once a deploy exists)

Recommended, based on `TESTING.md`'s smoke-test checklist:
1. Load the deployed URL, confirm the boot sequence and title screen
   render without console errors.
2. Confirm `NEXT_PUBLIC_ENABLE_DEBUG` is NOT exposing the debug panel
   (unless intentionally enabled for a preview deployment).
3. Start a new game in each world, confirm saves persist across a page
   reload (IndexedDB works the same in production as in dev — no separate
   verification needed beyond a manual check).
4. Confirm audio SFX play (network tab: `public/audio/*.wav` load with
   200s, not 404s — a common static-asset-path misconfiguration risk on
   some hosts).

## First-deploy checklist (since none has happened yet)

1. Fix `pnpm build` locally first (`TASKS.md` → `TASK-001`) — do not
   attempt to deploy a broken build.
2. Decide on hosting: Vercel is the path of least resistance given
   `README.md`'s existing instructions and this developer's established
   pattern across sibling repos (per the user's own memory notes: "new
   projects default to SSO wall (must disable)" is a known Vercel gotcha
   for this developer — check the Vercel project's deployment protection
   settings if the first deploy appears to 401/redirect to a login wall).
3. Run `vercel deploy` (preview) first, verify via the checklist above,
   then `vercel --prod`.
4. Update `README.md`/`CLAUDE.md`/`HANDOFF.md` with the real live URL
   once confirmed — do not publish an assumed URL.
