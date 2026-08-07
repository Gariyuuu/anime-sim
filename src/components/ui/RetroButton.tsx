import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { audioManager } from "@/audio/audioManager";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent-warning text-paper-0 hover:brightness-110 border-ink-950",
  secondary: "bg-paper-0 text-ink-950 hover:bg-ink-100 border-ink-950",
  ghost: "bg-transparent text-ink-950 hover:bg-ink-100 border-transparent",
  danger: "bg-accent-danger text-paper-0 hover:brightness-110 border-ink-950",
};

export function RetroButton({
  children,
  variant = "primary",
  className,
  icon,
  onClick,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={(e) => {
        audioManager.playSfx("ui-click");
        onClick?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded border-2 px-4 py-2 text-xs uppercase tracking-wider transition-all",
        "active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0_0_var(--ink-950)]",
        "disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-info",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
