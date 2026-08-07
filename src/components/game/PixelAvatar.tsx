import { cn, shadeColor } from "@/lib/utils";
import { SKIN, HAIR, EYE, OUTFIT } from "@/components/game/spriteColors";
import type { Appearance } from "@/types";

/**
 * Original, modular placeholder "sprite" built from flat geometric layers driven by
 * character-creator data — not derived from any copyrighted artwork. Layers are simple
 * enough to swap for licensed/hand-drawn sprites later without touching the data model.
 *
 * `walking` / `facingLeft` drive small CSS-keyframe motion (leg-swing, idle bob, blink,
 * horizontal mirror) — compositor-driven, no per-frame JS, so it stays cheap at 60fps.
 */
export function PixelAvatar({
  appearance,
  size = 96,
  animated = false,
  walking = false,
  facingLeft = false,
}: {
  appearance: Appearance;
  size?: number;
  animated?: boolean;
  walking?: boolean;
  facingLeft?: boolean;
}) {
  const skin = SKIN[appearance.skinTone];
  const skinShadow = shadeColor(skin, -14);
  const hair = HAIR[appearance.hairColor];
  const hairHighlight = shadeColor(hair, 24);
  const outfitShadow = shadeColor(OUTFIT[appearance.outfit], -18);
  const eye = EYE[appearance.eyeColor];
  const outfit = OUTFIT[appearance.outfit];
  const isLong = appearance.hairstyle === "long" || appearance.hairstyle === "wavy" || appearance.hairstyle === "twintails";

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn(animated ? "pixel-fade-in" : undefined, facingLeft ? "sprite-facing-left" : undefined, !walking ? "sprite-idle" : undefined)}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Character sprite"
    >
      <rect x="0" y="0" width="32" height="32" fill="none" />
      {/* legs, animated independently so they swing while walking; a shadow block on the trailing
          edge of each gives the sprite a light source instead of reading as flat pixel blocks */}
      <rect x="10" y="25" width="5" height="5" fill={outfit} className={walking ? "sprite-leg-a" : undefined} />
      <rect x="13" y="25" width="2" height="5" fill={outfitShadow} className={walking ? "sprite-leg-a" : undefined} />
      <rect x="17" y="25" width="5" height="5" fill={outfit} className={walking ? "sprite-leg-b" : undefined} />
      <rect x="20" y="25" width="2" height="5" fill={outfitShadow} className={walking ? "sprite-leg-b" : undefined} />
      {/* torso, same light/shadow-block shading */}
      <rect x="9" y="19" width="14" height="7" fill={outfit} />
      <rect x="19" y="19" width="4" height="7" fill={outfitShadow} />
      {/* accessory: accent trim */}
      {appearance.accessory !== "none" && <rect x="9" y="19" width="14" height="2" fill="var(--accent-warning, #a3762c)" />}
      {/* neck */}
      <rect x="13" y="17" width="6" height="4" fill={skin} />
      {/* head, with a shadow block down one side for form */}
      <rect x="10" y="7" width="12" height="11" fill={skin} />
      <rect x="18" y="7" width="4" height="11" fill={skinShadow} />
      {/* long hair back layer */}
      {isLong && <rect x="8" y="9" width="16" height="14" fill={hair} opacity={0.95} />}
      {/* head redraw on top of long hair back layer */}
      {isLong && (
        <>
          <rect x="10" y="7" width="12" height="11" fill={skin} />
          <rect x="18" y="7" width="4" height="11" fill={skinShadow} />
        </>
      )}
      {/* hair top, with a highlight strip so it doesn't read as one flat block */}
      <rect x="9" y="5" width="14" height="5" fill={hair} />
      <rect x="10" y="5" width="6" height="1.4" fill={hairHighlight} />
      {appearance.hairstyle === "buzzcut" ? null : <rect x="9" y="7" width="3" height="6" fill={hair} />}
      <rect x="20" y="7" width="3" height="6" fill={hair} />
      {/* eyes, blink periodically */}
      <rect x="13" y="12" width="2" height="2" fill={eye} className="sprite-blink" />
      <rect x="18" y="12" width="2" height="2" fill={eye} className="sprite-blink" />
      {/* mouth — previously absent, leaving just two eye-dots on a blank block */}
      <rect x="14.5" y="15" width="3" height="1" fill="var(--ink-950,#171716)" opacity={0.5} />
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
