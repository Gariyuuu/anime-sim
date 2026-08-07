/**
 * Maps a handful of high-frequency/high-confidence interactable `glyph` names to a real
 * hand-picked pixel-art sprite (from the CC0 Kenney.nl packs in `~/Projects/shared-assets`,
 * copied into `public/sprites/kenney/`) instead of the generic lucide-react vector icon.
 *
 * Deliberately NOT exhaustive — only glyphs with an unambiguous, well-matched sprite are listed
 * here (e.g. `flame` -> an actual torch, not a generic flame). Glyphs without an entry keep
 * rendering via `<Icon>` (`components/ui/Icon.tsx`) exactly as before — this is additive, never a
 * behavior change for anything not listed.
 */
export const GLYPH_SPRITES: Record<string, string> = {
  flame: "/sprites/kenney/torch.png",
  sword: "/sprites/kenney/sword.png",
  swords: "/sprites/kenney/sword-alt.png",
  shield: "/sprites/kenney/shield.png",
  hammer: "/sprites/kenney/hammer.png",
  scroll: "/sprites/kenney/scroll.png",
  box: "/sprites/kenney/crate.png",
  package: "/sprites/kenney/crate.png",
  "shopping-bag": "/sprites/kenney/coin-pouch.png",
  coins: "/sprites/kenney/coin-pouch.png",
  gem: "/sprites/kenney/gem.png",
  trees: "/sprites/kenney/tree-pine.png",
  leaf: "/sprites/kenney/bush.png",
  sprout: "/sprites/kenney/mushrooms.png",
  flower: "/sprites/kenney/bush.png",
  flag: "/sprites/kenney/signpost.png",
  target: "/sprites/kenney/compass.png",
  key: "/sprites/kenney/key.png",
  lock: "/sprites/kenney/key.png",
  "door-open": "/sprites/kenney/door-wood.png",
};

/** Same idea as `GLYPH_SPRITES`, but for `engine/scenery.ts`'s procedurally-scattered props —
 * swaps the hand-drawn canvas shapes for real sprites where a clean match exists. Any `PropKind`
 * not listed here keeps rendering via `drawProp`'s canvas primitives exactly as before.
 *
 * `torch` and `rock` are deliberately NOT here: the only Kenney tiles available for them came
 * from the tileset's opaque *tile* rows (meant to be laid edge-to-edge with no gaps, so they have
 * no transparency), not the transparent icon rows — drawn as a floating prop, they rendered as a
 * solid colored block instead of an isolated object. Their procedural (canvas-drawn) versions
 * stay in use until/unless a properly transparent replacement sprite is sourced. */
export const PROP_SPRITES: Record<string, string> = {
  tree: "/sprites/kenney/tree-pine.png",
  bush: "/sprites/kenney/bush.png",
  crate: "/sprites/kenney/crate.png",
};
