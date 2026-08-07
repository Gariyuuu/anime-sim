import { useId } from "react";
import { cn, shadeColor as shadeHex } from "@/lib/utils";
import { SKIN, HAIR, EYE } from "@/components/game/spriteColors";
import type { Appearance, Expression } from "@/types";

interface ExpressionLook {
  mouth: string;
  mouthFill: "stroke" | "fill";
  browAngle: number;
  browY: number;
  eye: "normal" | "wide" | "happy" | "narrow";
  extra?: "blush" | "sweat" | "spark" | "tear";
}

const LOOK: Record<Expression, ExpressionLook> = {
  neutral: { mouth: "M15,28 H25", mouthFill: "stroke", browAngle: 0, browY: 0, eye: "normal" },
  determined: { mouth: "M15,28 H25", mouthFill: "stroke", browAngle: -8, browY: -1, eye: "narrow", extra: "spark" },
  cold: { mouth: "M16,28 H24", mouthFill: "stroke", browAngle: -4, browY: 0, eye: "narrow" },
  thinking: { mouth: "M18,27 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0", mouthFill: "fill", browAngle: 10, browY: -1, eye: "normal" },
  smile: { mouth: "M14,26 Q20,32 26,26", mouthFill: "stroke", browAngle: 0, browY: 0, eye: "happy" },
  smirk: { mouth: "M18,27 Q23,31 27,25", mouthFill: "stroke", browAngle: 6, browY: 0, eye: "normal" },
  laugh: { mouth: "M13,25 Q20,35 27,25 Z", mouthFill: "fill", browAngle: 0, browY: -1, eye: "happy" },
  blush: { mouth: "M15,27 Q20,31 25,27", mouthFill: "stroke", browAngle: 0, browY: 0, eye: "happy", extra: "blush" },
  frown: { mouth: "M14,30 Q20,25 26,30", mouthFill: "stroke", browAngle: 14, browY: 1, eye: "normal" },
  sad: { mouth: "M14,29 Q20,26 26,29", mouthFill: "stroke", browAngle: 18, browY: 2, eye: "narrow", extra: "tear" },
  worried: { mouth: "M15,29 Q20,27 25,29", mouthFill: "stroke", browAngle: 16, browY: 1, eye: "wide", extra: "sweat" },
  angry: { mouth: "M14,28 H26", mouthFill: "stroke", browAngle: -22, browY: 2, eye: "narrow" },
  shocked: { mouth: "M17,25 a3,4 0 1,0 6,0 a3,4 0 1,0 -6,0", mouthFill: "fill", browAngle: -14, browY: -3, eye: "wide" },
};

/**
 * A close-up "bust" portrait face — the same flat, original geometric-layer art direction as
 * `PixelAvatar`, but zoomed in and driven by `Expression`, so dialogue portraits read as an
 * actual (procedurally drawn) face instead of an icon in a colored box.
 */
export function PortraitFace({
  hairColor,
  hairstyle,
  eyeColor,
  skinTone,
  accentColor,
  expression,
  size = 140,
  animated = false,
}: {
  hairColor: Appearance["hairColor"];
  hairstyle: Appearance["hairstyle"];
  eyeColor: Appearance["eyeColor"];
  skinTone: Appearance["skinTone"];
  accentColor: string;
  expression: Expression;
  size?: number;
  animated?: boolean;
}) {
  const skin = SKIN[skinTone];
  const hair = HAIR[hairColor];
  const eye = EYE[eyeColor];
  const isLong = hairstyle === "long" || hairstyle === "wavy" || hairstyle === "twintails" || hairstyle === "braided";
  const look = LOOK[expression] ?? LOOK.neutral;
  const isBuzz = hairstyle === "buzzcut";
  const isPonytail = hairstyle === "ponytail";
  const isTwintails = hairstyle === "twintails";
  const isBraided = hairstyle === "braided";
  const isWavy = hairstyle === "wavy";
  // Gradient ids must be unique per instance — many portraits render on screen at once (map
  // markers, dialogue, device menu), and SVG gradient ids share one document-wide namespace.
  const gid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  // Hair renders as a silhouette *behind* the face (slightly bigger than the face rect), then the
  // face is drawn on top — guarantees a visible hair "frame" no matter the exact curve math,
  // instead of relying on a thin top sliver that used to render as functionally invisible (the
  // "bald" bug). Kept small (1.5-2 units of overhang) so it reads as a hairline, not a hood — an
  // earlier, larger version swallowed the whole face. A thin dark outline keeps hair readable even
  // when hair color and card background land close together (e.g. silver hair, light card).
  const hairOutline = "rgba(0,0,0,0.28)";
  // Eyebrows sit clearly above the eyes (smaller Y = higher up); a prior version had them at a
  // larger Y than the eyes, so they rendered UNDER/overlapping the eyes instead of above them.
  const browY = 14 + look.browY;
  const eyeCenterY = look.eye === "wide" ? 18.5 : 19;
  const eyeH = look.eye === "wide" ? 4.6 : look.eye === "narrow" ? 1.3 : 3.2;

  // A plain function returning elements (called as `{eyeAt(cx)}`), not a nested component
  // (`<Eye cx={cx} />`) — the latter creates a fresh component identity every render, which the
  // react-hooks/static-components lint rule rejects.
  function eyeAt(cx: number) {
    if (look.eye === "narrow") {
      // Squinting/sharp look: a curved upper-lid line with a thin iris-colored sliver beneath it
      // reads as "narrowed eye" — a single flat bar (the prior version) was indistinguishable
      // from the eyebrow above it at a glance, especially since "cold" is Suzune's default look.
      return (
        <g>
          <path d={`M${cx - 2.1},${eyeCenterY} Q${cx},${eyeCenterY - 1.3} ${cx + 2.1},${eyeCenterY}`} stroke="var(--ink-950,#171716)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <rect x={cx - 1.7} y={eyeCenterY} width="3.4" height="1.1" rx="0.5" fill={eye} />
        </g>
      );
    }
    const irisR = Math.min(1.55, eyeH / 2 - 0.35);
    return (
      <g className="sprite-blink" style={{ transformOrigin: `${cx}px ${eyeCenterY}px` }}>
        <rect x={cx - 2.3} y={eyeCenterY - eyeH / 2} width="4.6" height={eyeH} rx={eyeH / 2.4} fill="#f8f4ec" />
        <circle cx={cx} cy={eyeCenterY} r={irisR} fill={eye} />
        <circle cx={cx} cy={eyeCenterY} r={irisR * 0.42} fill="var(--ink-950,#171716)" />
        <circle cx={cx - irisR * 0.35} cy={eyeCenterY - irisR * 0.4} r={irisR * 0.3} fill="#ffffff" opacity="0.9" />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={cn(animated ? "pixel-fade-in" : undefined)} shapeRendering="geometricPrecision" role="img" aria-label={`Portrait, expression ${expression}`}>
      <defs>
        {/* Skin/hair gradients — the single biggest lever for "flat procedural shapes" reading as
            actual rendered art instead of a color swatch: a soft light-to-shadow falloff gives
            the face and hair real form instead of one uniform tone each. */}
        <radialGradient id={`${gid}-skin`} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor={shadeHex(skin, 10)} />
          <stop offset="65%" stopColor={skin} />
          <stop offset="100%" stopColor={shadeHex(skin, -12)} />
        </radialGradient>
        <linearGradient id={`${gid}-hair`} x1="0%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%" stopColor={shadeHex(hair, 22)} />
          <stop offset="45%" stopColor={hair} />
          <stop offset="100%" stopColor={shadeHex(hair, -18)} />
        </linearGradient>
      </defs>
      {/* long hair back layer — drawn FIRST so the neck/shoulders below paint over its center,
          leaving it visible only where it peeks out past their edges (hair draping down behind
          the shoulders). It used to be drawn after the neck, which painted the entire neck (and
          the mouth sitting just above it) over in solid hair color — invisible dark mouth on a
          same-color dark "neck". */}
      {isLong && <path d={isWavy ? "M5,9 Q3,20 6,36 L34,36 Q37,20 35,9 Q28,14 20,13 Q12,14 5,9 Z" : "M5,9 L5,36 L35,36 L35,9 Q28,13 20,12 Q12,13 5,9 Z"} fill={`url(#${gid}-hair)`} stroke={hairOutline} strokeWidth={0.5} opacity={0.97} />}
      {/* twintails: two bunches at ear height, ponytail: a single sweep off to one side */}
      {isTwintails && (
        <>
          <ellipse cx="6" cy="20" rx="3.4" ry="7" fill={`url(#${gid}-hair)`} stroke={hairOutline} strokeWidth={0.5} transform="rotate(-18 6 20)" />
          <ellipse cx="34" cy="20" rx="3.4" ry="7" fill={`url(#${gid}-hair)`} stroke={hairOutline} strokeWidth={0.5} transform="rotate(18 34 20)" />
        </>
      )}
      {isPonytail && <ellipse cx="32" cy="16" rx="3" ry="8.5" fill={`url(#${gid}-hair)`} stroke={hairOutline} strokeWidth={0.5} transform="rotate(24 32 16)" />}
      {isBraided && <rect x="19" y="24" width="2.4" height="11" rx="1.1" fill={`url(#${gid}-hair)`} stroke={hairOutline} strokeWidth={0.4} />}
      {/* shoulders / outfit */}
      <rect x="2" y="31" width="36" height="9" fill={accentColor} />
      {/* neck, with a soft shadow where it meets the jaw for a little roundness */}
      <rect x="16" y="25" width="8" height="8" fill={skin} />
      <rect x="16" y="25" width="8" height="2.5" fill="black" opacity={0.08} />
      {/* hair silhouette — a thin frame around the face, not a full dome (see note above) */}
      <rect x={isBuzz ? 9.3 : 8.3} y={isBuzz ? 7 : 6} width={isBuzz ? 21.4 : 23.4} height={isBuzz ? 16 : 19} rx={isBuzz ? 4 : 5} fill={`url(#${gid}-hair)`} stroke={hairOutline} strokeWidth={0.5} />
      {/* subtle hair shine so it doesn't read as a flat, dull cap */}
      {!isBuzz && <path d="M11,10 Q15,6.5 21,6.2" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1" fill="none" strokeLinecap="round" />}
      {/* head (face) */}
      <rect x="10" y="8" width="20" height="19" rx="4" fill={`url(#${gid}-skin)`} />
      {/* soft jaw/cheek shadow along the bottom edge — the flat rect used to end abruptly with no
          sense of a chin; a thin gradient-free shadow band suggests a rounded jaw cheaply. */}
      <path d="M11,24 Q20,29 29,24 L29,26.5 Q20,31 11,26.5 Z" fill="black" opacity={0.07} />
      {/* ears */}
      <rect x="8.5" y="16" width="2.2" height="4" rx="1" fill={skin} />
      <rect x="29.3" y="16" width="2.2" height="4" rx="1" fill={skin} />
      {/* bangs — frame the temples/upper cheek only, not the whole jaw */}
      {!isBuzz && (
        <>
          <rect x="9" y="10" width="3" height="7.5" rx="1.2" fill={`url(#${gid}-hair)`} />
          <rect x="28" y="10" width="3" height="7.5" rx="1.2" fill={`url(#${gid}-hair)`} />
        </>
      )}
      {/* eyebrows */}
      <rect x="13.5" y={browY} width="4.6" height="1" rx="0.5" fill={hair} transform={`rotate(${look.browAngle} 15.8 14.5)`} />
      <rect x="21.9" y={browY} width="4.6" height="1" rx="0.5" fill={hair} transform={`rotate(${-look.browAngle} 24.2 14.5)`} />
      {/* eyes */}
      {look.eye === "happy" ? (
        <>
          <path d="M13.3,19 Q15.8,16.4 18.3,19" stroke={eye} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M21.7,19 Q24.2,16.4 26.7,19" stroke={eye} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {eyeAt(15.8)}
          {eyeAt(24.2)}
        </>
      )}
      {/* nose — a faint single stroke; the face had no nose at all before, which is a big part of
          why it read as "just eyes floating on a color swatch" rather than an actual face. */}
      <path d="M20,20.5 L19.3,24 Q20,24.9 20.9,24" stroke="black" strokeOpacity={0.16} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* mouth */}
      {look.mouthFill === "fill" ? (
        <path d={look.mouth} fill="var(--ink-950,#171716)" opacity={0.85} />
      ) : (
        <path d={look.mouth} stroke="var(--ink-950,#171716)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      )}
      {/* expression extras */}
      {look.extra === "blush" && (
        <>
          <circle cx="12.5" cy="23.5" r="2" fill="var(--accent-danger, #c0546a)" opacity={0.35} />
          <circle cx="27.5" cy="23.5" r="2" fill="var(--accent-danger, #c0546a)" opacity={0.35} />
        </>
      )}
      {look.extra === "sweat" && <path d="M29,10 q2,3 0,5 q-2,-2 0,-5" fill="var(--accent-info, #4a6a8a)" opacity={0.7} />}
      {look.extra === "tear" && <path d="M14,22 q1.2,2.4 0,4 q-1.2,-1.6 0,-4" fill="var(--accent-info, #4a6a8a)" opacity={0.7} />}
      {look.extra === "spark" && <rect x="30" y="9" width="2" height="2" fill="var(--accent-warning, #a3762c)" transform="rotate(45 31 10)" />}
    </svg>
  );
}
