"use client";

import { useGameStore } from "@/state/gameStore";
import { Icon } from "@/components/ui/Icon";
import { StatBar } from "@/components/ui/StatBar";

export function HUD({ locationLabel, ambientLabel }: { locationLabel?: string; ambientLabel?: string }) {
  const save = useGameStore((s) => s.save);
  const toggleDevice = useGameStore((s) => s.toggleDevice);
  const toggleHelp = useGameStore((s) => s.toggleHelp);
  const setScreen = useGameStore((s) => s.setScreen);
  if (!save) return null;
  const isElite = save.worldId === "elite-academy";

  return (
    <div className="flex items-center justify-between gap-2 border-b-2 border-ink-950 bg-paper-0 px-3 py-2 text-ink-950">
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          onClick={() => toggleHelp(true)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink-950 text-[11px] font-bold hover:bg-ink-100"
          style={{ background: "var(--accent-warning)", color: "var(--paper-0)" }}
          aria-label="How to play"
        >
          ?
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold">{locationLabel}</p>
          {ambientLabel && <p className="truncate text-[10px] text-ink-500">{ambientLabel}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {isElite ? (
          <div className="hidden w-28 sm:block">
            <StatBar label="Stress" value={save.player.elite.stress} max={100} color="var(--accent-danger)" size="sm" showNumbers={false} />
          </div>
        ) : (
          <div className="hidden w-28 sm:block">
            <StatBar label="HP" value={save.player.aincrad.health} max={save.player.aincrad.maxHealth} color="var(--accent-danger)" size="sm" showNumbers={false} />
          </div>
        )}
        <button onClick={() => toggleDevice(true)} className="rounded border-2 border-ink-950 p-1.5 hover:bg-ink-100" aria-label="Open device">
          <Icon name="smartphone" size={14} />
        </button>
        <button onClick={() => setScreen("settings")} className="rounded border-2 border-ink-950 p-1.5 hover:bg-ink-100" aria-label="Settings">
          <Icon name="settings" size={14} />
        </button>
      </div>
    </div>
  );
}
