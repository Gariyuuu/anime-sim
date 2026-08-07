import { cn } from "@/lib/utils";
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
  const eyeH = look.eye === "wide" ? 4 : look.eye === "narrow" ? 1.4 : 2.6;
  const eyeY = look.eye === "wide" ? 17.5 : 18.3;

  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={cn(animated ? "pixel-fade-in" : undefined)} shapeRendering="geometricPrecision" role="img" aria-label={`Portrait, expression ${expression}`}>
      {/* shoulders / outfit */}
      <rect x="2" y="31" width="36" height="9" fill={accentColor} />
      {/* neck */}
      <rect x="16" y="25" width="8" height="8" fill={skin} />
      {/* long hair back layer */}
      {isLong && <rect x="6" y="10" width="28" height="24" rx="2" fill={hair} opacity={0.95} />}
      {/* head */}
      <rect x="10" y="8" width="20" height="19" rx="3" fill={skin} />
      {/* ears */}
      <rect x="8.5" y="16" width="2.2" height="4" rx="1" fill={skin} />
      <rect x="29.3" y="16" width="2.2" height="4" rx="1" fill={skin} />
      {/* hair top + sides */}
      <path d="M9,14 Q9,5 20,5 Q31,5 31,14 L31,10 Q20,8 9,10 Z" fill={hair} />
      {hairstyle !== "buzzcut" && (
        <>
          <rect x="9" y="10" width="3.2" height="11" rx="1.2" fill={hair} />
          <rect x="27.8" y="10" width="3.2" height="11" rx="1.2" fill={hair} />
        </>
      )}
      {/* eyebrows */}
      <rect x="13.5" y={19.5 + look.browY} width="5" height="1.3" rx="0.6" fill={hair} transform={`rotate(${look.browAngle} 16 20)`} />
      <rect x="21.5" y={19.5 + look.browY} width="5" height="1.3" rx="0.6" fill={hair} transform={`rotate(${-look.browAngle} 24 20)`} />
      {/* eyes */}
      {look.eye === "happy" ? (
        <>
          <path d="M13.5,18.5 Q16,16 18.5,18.5" stroke={eye} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M21.5,18.5 Q24,16 26.5,18.5" stroke={eye} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="14" y={eyeY} width="3.4" height={eyeH} rx="0.8" fill={eye} className="sprite-blink" />
          <rect x="22.6" y={eyeY} width="3.4" height={eyeH} rx="0.8" fill={eye} className="sprite-blink" />
        </>
      )}
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
