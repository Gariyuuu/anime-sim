# UI_SYSTEM.md

## Layout / navigation / page structure

There is exactly one Next.js route (`/`, `src/app/page.tsx`). All
"navigation" is in-memory state, not URL-based:
- **Top level:** `GameRoot.tsx` switches on `screen: Screen`
  (`"boot" | "title" | "worldSelect" | "characterCreator" | "saveSelect" |
  "settings" | "codex" | "achievements" | "patchNotes" | "credits" |
  "game"`), each rendering a full-screen component from
  `components/screens/` (or `GameShell` for `"game"`).
- **In-game level:** once `screen === "game"`, `GameShell.tsx` switches on
  `save.mode: GameMode` (`"dialogue" | "exploration" | "combat" | "device"
  | "recap"`) to pick the active view, with `DeviceMenu` (modal),
  `DebugPanel`, and `NotificationToasts` always mounted on top.
- Most menu screens are wrapped in `src/components/ui/ScreenFrame.tsx`
  (full-screen scrollable frame) for a consistent outer layout.

## Reusable components

All in `src/components/ui/` (7 files, all small — 13 to 54 lines):

| Component | File | Purpose |
|---|---|---|
| `Panel` | `Panel.tsx` | Bordered box with an optional colored title bar (`accent` prop), optional `scanlines` texture. |
| `RetroButton` | `RetroButton.tsx` | The one button component. Variants: `primary`/`secondary`/`ghost`/`danger`. Plays the `ui-click` SFX via `audioManager` on every click, before calling the passed `onClick`. |
| `Modal` | `Modal.tsx` | Overlay + centered panel, Framer Motion enter/exit (`initial`/`animate`/`exit` opacity+scale). |
| `StatBar` | `StatBar.tsx` | Labeled horizontal progress bar, `size: "sm" | ...`, optional numeric label. |
| `Badge` | `Badge.tsx` | Small pill/tag. |
| `Icon` | `Icon.tsx` | Renders any `lucide-react` icon by string name via a dynamic lookup (`iconsByName`). |
| `ScreenFrame` | `ScreenFrame.tsx` | Full-height scrollable outer wrapper used by most `screens/*`. |

Game-specific composite components live in `src/components/game/` (see
`FILE_MAP.md` for the full list/purpose table) — these are not meant to be
reused outside their one call site each.

## Theme system

- **Automatic light/dark only** — driven by `@media
  (prefers-color-scheme: dark)` in `src/app/globals.css`. **There is no
  manual theme toggle anywhere in the UI** (verified via grep for
  `data-theme`/`toggleTheme`-style code — none exists). The app simply
  follows the OS/browser preference.
- Both light and dark palettes are full CSS custom-property overrides of
  the same token names (`--ink-950`...`--ink-100`, `--paper-0`), so the
  whole ink/paper ramp inverts as a set rather than being two independently
  authored palettes.

## Colors / typography / spacing

- **Colors** (`src/app/globals.css`): an 11-step grayscale "ink" ramp
  (`--ink-950` darkest → `--ink-100` lightest) plus `--paper-0`
  (background), remapped into Tailwind v4's `@theme inline` as
  `--color-ink-*`/`--color-paper-0`. Semantic accents:
  `--accent-elite`/`--accent-elite-soft` (Elite Academy's world color, a
  dark red), `--accent-aincrad`/`--accent-aincrad-soft` (Aincrad's world
  color, a dark blue), plus `--accent-danger`/`--accent-success`/
  `--accent-warning`/`--accent-info` for status coloring used across HP
  bars, notifications, etc.
- **Typography:** two Google Fonts loaded via `next/font/google` in
  `src/app/layout.tsx`: `Space Mono` (`--font-space-mono`, the default
  body font, applied via `body { font-family: var(--font-body), ... }`)
  and `Press Start 2P` (`--font-press-start`, exposed as the `.font-display`
  utility class for headline/retro-styled text — a genuine pixel-style
  display font, not a generic sans/serif).
- **Spacing/borders:** no custom spacing scale — plain Tailwind v4
  defaults. The visual identity comes mostly from a consistent
  `border-2 border-ink-950` + hard drop-shadow (`shadow-[2px_2px_0_0_var(--ink-950)]`,
  `shadow-[3px_3px_0_0_var(--ink-950)]`) treatment on `Panel`/`RetroButton`
  — a deliberate "retro/pixel UI" look, not a soft/modern one.

## Responsive rules

No documented breakpoint strategy beyond Tailwind's defaults used ad hoc
per component (e.g. `HUD.tsx`'s `hidden w-28 sm:block` for the HP/Stress
bar). `ExplorationView.tsx` includes an on-screen mobile D-pad
specifically for touch devices (per `README.md`'s feature list), in
addition to keyboard/click controls.

## Animation

`framer-motion` (`^12.43.0`), used directly (not via a wrapper) in several
components for enter/exit transitions: `Modal.tsx`, `DialogueView.tsx`
(node-to-node text transitions), `NotificationToasts.tsx`,
`BootScreen.tsx`, `TitleScreen.tsx`, `WorldSelectScreen.tsx`. A CSS
keyframe (`pixel-fade-in`, `globals.css`) provides a "pixelated boot"
style fade using `steps(6)` timing, used for retro-feel element entrances.

**Reduced motion:** `[data-reduced-motion="true"]` (set from
`Settings.reducedMotion`) disables the `.scanlines`/`.pixel-fade-in` CSS
effects; whether it also suppresses the `framer-motion` transitions
listed above was **not verified** in this audit (would need each
component checked for a `settings.reducedMotion` read — not confirmed
present in `DialogueView.tsx`/`Modal.tsx` etc. during the file reads
performed this session). Flag this as **Unable to verify** rather than
assuming full reduced-motion coverage.

**Tab-backgrounded pause:** `[data-tab-hidden="true"] * { animation-play-state:
paused !important; }` — set by `GameShell.tsx`'s `visibilitychange`
listener, pauses all CSS animations (not Framer Motion transitions
specifically) when the tab isn't focused.

## Icons

`lucide-react` (`^1.28.0`) exclusively, via `components/ui/Icon.tsx`'s
dynamic name lookup. Every icon reference in content data (NPC glyphs, item
icons, interactable glyphs, achievement icons) is a plain string matched
against Lucide's export names at render time — an invalid/misspelled icon
name would render nothing rather than crash (not independently verified
this session, but implied by `Icon.tsx`'s lookup pattern using a
`Record<string, ...>` cast rather than a strict union type).

## Assets

- `public/audio/*.wav` — 10 short, original, synthesized SFX (see
  `README.md`/`SECURITY.md`/`CLAUDE.md` for the full asset-license
  statement: no licensed audio anywhere).
- `public/favicon.svg`, `public/manifest.json` — PWA-adjacent manifest
  (`name`, `short_name`, `theme_color: "#171716"`, `icons: [favicon.svg]`),
  referenced from `layout.tsx`'s `metadata`. No service worker exists
  (this is a manifest for installability metadata only, not a full PWA).
- No raster character/sprite art exists — see `PixelAvatar.tsx` in
  `FILE_MAP.md`.

## Modals / forms / loading / empty / error states

- **Modals:** `Modal.tsx`, used by `DeviceMenu.tsx` and (indirectly) the
  full-screen `DeviceMenuFullScreen` variant in `GameShell.tsx`.
- **Forms:** `CharacterCreatorScreen.tsx` is the only real multi-field form
  in the app (name/pronouns/appearance/personality/strength/weakness/
  background/difficulty); `SettingsScreen.tsx` is effectively a form of
  toggles/sliders.
- **Loading states:** minimal — `DeviceMenuFullScreen`'s brief "Loading..."
  placeholder while it immediately opens the device modal is the only
  explicit loading UI found; there is no data-fetching elsewhere to need
  one (everything is synchronous/local).
- **Empty states:** not systematically audited component-by-component this
  session; `SaveSelectScreen.tsx` (130 lines) is the most likely place to
  need one (no saves yet) — **Unable to verify** whether it renders an
  explicit empty-state message versus just an empty list, without a
  browser runtime check.
- **Error states:** no dedicated error-state UI components exist, and no
  React error boundary exists anywhere in the tree — see
  `ARCHITECTURE.md`'s "Major architectural risks" and `TASKS.md` →
  `TASK-002`.

## Accessibility

- **Explicit accessibility settings** (`types/settings.ts`):
  `reducedMotion`, `highContrast`, `dyslexiaFont`, `textSize`
  (`small`/`medium`/`large`), `colorblindMode`, `screenShake`,
  `minigameAssist`, `holdToSkipProtection`, `showStatChecks`. Applied via
  `data-*` attributes on `<html>` (`GameShell.tsx`) and consumed by CSS in
  `globals.css` for `reducedMotion`/`highContrast`/`dyslexiaFont`/
  `textSize`. `colorblindMode`/`minigameAssist`/`screenShake` were **not**
  traced to any actual CSS or behavior change during this audit — flagged
  in `FEATURES.md`/`TASKS.md` as unverified/possibly not-yet-wired.
- **No formal ARIA audit exists.** A handful of `aria-label`s were spotted
  ad hoc (e.g. `HUD.tsx`'s icon-only buttons) but this wasn't
  systematically verified across every interactive element.
- `patchnotes.ts` itself is honest about a known gap here: "Some
  accessibility settings (dyslexia font, high contrast) affect UI copy but
  not yet every custom-drawn canvas element" — i.e. the Canvas-rendered
  exploration view doesn't fully participate in these settings, per the
  developer's own documented admission.
