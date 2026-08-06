import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, color, className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border-2 border-ink-950 px-2 py-0.5 text-[9px] uppercase tracking-widest", className)}
      style={color ? { background: color, color: "var(--paper-0)" } : { background: "var(--ink-100)" }}
    >
      {children}
    </span>
  );
}
