import type { Appearance } from "@/types";

const SKIN: Record<Appearance["skinTone"], string> = {
  porcelain: "#f2ddc9",
  light: "#e8c3a0",
  tan: "#c68e5f",
  deep: "#8a5a35",
  olive: "#b89468",
};
const HAIR: Record<Appearance["hairColor"], string> = {
  black: "#1a1a1a",
  brown: "#4a2f1f",
  auburn: "#7a3320",
  silver: "#c7c5bb",
  "ash-blonde": "#c9b98a",
  charcoal: "#333333",
};
const EYE: Record<Appearance["eyeColor"], string> = {
  "dark-brown": "#3a2412",
  gray: "#6b6b6b",
  hazel: "#7a6030",
  "steel-blue": "#4a6a8a",
  amber: "#a8701f",
  onyx: "#0c0c0c",
};
const OUTFIT: Record<Appearance["outfit"], string> = {
  "standard-uniform": "#2a2a5a",
  "casual-layered": "#4a5a3a",
  "sport-fit": "#5a2a2a",
  tailored: "#1a1a1a",
};

/**
 * Original, modular placeholder "sprite" built from flat geometric layers driven by
 * character-creator data — not derived from any copyrighted artwork. Layers are simple
 * enough to swap for licensed/hand-drawn sprites later without touching the data model.
 */
export function PixelAvatar({ appearance, size = 96, animated = false }: { appearance: Appearance; size?: number; animated?: boolean }) {
  const skin = SKIN[appearance.skinTone];
  const hair = HAIR[appearance.hairColor];
  const eye = EYE[appearance.eyeColor];
  const outfit = OUTFIT[appearance.outfit];
  const isLong = appearance.hairstyle === "long" || appearance.hairstyle === "wavy" || appearance.hairstyle === "twintails";

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={animated ? "pixel-fade-in" : undefined}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Character portrait"
    >
      <rect x="0" y="0" width="32" height="32" fill="none" />
      {/* body / outfit */}
      <rect x="9" y="20" width="14" height="10" fill={outfit} />
      {/* accessory: accent trim */}
      {appearance.accessory !== "none" && <rect x="9" y="20" width="14" height="2" fill="var(--accent-warning, #a3762c)" />}
      {/* neck */}
      <rect x="13" y="17" width="6" height="4" fill={skin} />
      {/* head */}
      <rect x="10" y="7" width="12" height="11" fill={skin} />
      {/* long hair back layer */}
      {isLong && <rect x="8" y="9" width="16" height="14" fill={hair} opacity={0.95} />}
      {/* head redraw on top of long hair back layer */}
      {isLong && <rect x="10" y="7" width="12" height="11" fill={skin} />}
      {/* hair top */}
      <rect x="9" y="5" width="14" height="5" fill={hair} />
      {appearance.hairstyle === "buzzcut" ? null : <rect x="9" y="7" width="3" height="6" fill={hair} />}
      <rect x="20" y="7" width="3" height="6" fill={hair} />
      {/* eyes */}
      <rect x="13" y="12" width="2" height="2" fill={eye} />
      <rect x="18" y="12" width="2" height="2" fill={eye} />
      {/* accessory: glasses */}
      {appearance.accessory === "glasses" && (
        <>
          <rect x="12" y="11" width="4" height="4" fill="none" stroke="var(--ink-950,#171716)" strokeWidth="0.5" />
          <rect x="17" y="11" width="4" height="4" fill="none" stroke="var(--ink-950,#171716)" strokeWidth="0.5" />
        </>
      )}
    </svg>
  );
}
