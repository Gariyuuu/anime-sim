import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  title,
  accent,
  scanlines = false,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  accent?: string;
  scanlines?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md border-2 border-ink-950 bg-paper-0 text-ink-950 shadow-[3px_3px_0_0_var(--ink-950)]",
        scanlines && "scanlines overflow-hidden",
        className,
      )}
    >
      {title && (
        <div
          className="flex items-center justify-between border-b-2 border-ink-950 px-3 py-1.5 text-xs uppercase tracking-widest"
          style={accent ? { background: accent, color: "var(--paper-0)" } : { background: "var(--ink-950)", color: "var(--paper-0)" }}
        >
          <span className="font-display text-[10px]">{title}</span>
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}
