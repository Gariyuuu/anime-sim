import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared full-viewport backdrop for menu-level screens (title, creator, codex, etc). */
export function ScreenFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("scanlines flex h-dvh w-full flex-col items-center overflow-y-auto bg-paper-0 px-4 py-6 text-ink-950", className)}>
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}

export function Logo({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2 text-center">
      <div className="flex items-center gap-1 rounded-md border-2 border-ink-950 bg-ink-950 px-4 py-3 shadow-[3px_3px_0_0_var(--ink-950)]">
        <span className="font-display text-lg text-paper-0 sm:text-2xl">ANIME</span>
        <span className="font-display text-lg text-accent-warning sm:text-2xl">{"//"}</span>
        <span className="font-display text-lg text-paper-0 sm:text-2xl">SIM</span>
      </div>
      {subtitle && <p className="text-xs uppercase tracking-[0.2em] text-ink-600">Choose a world. Rewrite its story.</p>}
    </div>
  );
}
