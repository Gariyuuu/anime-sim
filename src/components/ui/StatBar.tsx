import { cn } from "@/lib/utils";
import { clamp } from "@/types/common";

export function StatBar({
  label,
  value,
  max,
  color = "var(--ink-800)",
  showNumbers = true,
  className,
  size = "md",
}: {
  label?: string;
  value: number;
  max: number;
  color?: string;
  showNumbers?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  const pct = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
  return (
    <div className={cn("w-full", className)}>
      {(label || showNumbers) && (
        <div className="mb-0.5 flex items-center justify-between text-[10px] uppercase tracking-wide text-ink-600">
          {label && <span>{label}</span>}
          {showNumbers && (
            <span className="tabular-nums">
              {Math.max(0, Math.round(value))}/{max}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-sm border-2 border-ink-950 bg-ink-100", size === "sm" ? "h-2" : "h-3")}>
        <div className="h-full transition-[width] duration-300 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
