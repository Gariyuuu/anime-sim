"use client";

import { useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { codexEntries } from "@/content/registry";

const CATEGORIES = ["character", "location", "term", "monster", "item", "guild", "class", "recap", "secret"] as const;

export function CodexScreen({ onBack }: { onBack?: () => void }) {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number] | "all">("all");

  const isUnlocked = (id: string, byDefault: boolean) => byDefault || (save?.codexUnlocked.includes(id) ?? false);

  const entries = codexEntries.filter((e) => category === "all" || e.category === category);
  const unlockedCount = codexEntries.filter((e) => isUnlocked(e.id, e.unlockedByDefault)).length;

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 pb-10">
        <h1 className="font-display mb-1 text-center text-sm text-ink-950">Codex</h1>
        <p className="mb-6 text-[10px] uppercase tracking-widest text-ink-500">
          {unlockedCount}/{codexEntries.length} entries discovered
        </p>

        <div className="mb-4 flex flex-wrap justify-center gap-1.5">
          <button onClick={() => setCategory("all")} className={`rounded border-2 px-2 py-1 text-[10px] uppercase ${category === "all" ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300"}`}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`rounded border-2 px-2 py-1 text-[10px] uppercase ${category === c ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid w-full max-w-3xl gap-2 sm:grid-cols-2">
          {entries.map((entry) => {
            const unlocked = isUnlocked(entry.id, entry.unlockedByDefault);
            return (
              <Panel key={entry.id} className={!unlocked ? "opacity-60" : undefined}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-bold">{unlocked ? entry.title : "???"}</p>
                  <Badge color={entry.worldId === "elite-academy" ? "var(--accent-elite)" : entry.worldId === "aincrad" ? "var(--accent-aincrad)" : undefined}>{entry.category}</Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-ink-700">{unlocked ? entry.body : "Discover this through play to reveal its entry."}</p>
              </Panel>
            );
          })}
        </div>

        <RetroButton variant="ghost" className="mt-8" onClick={() => (onBack ? onBack() : setScreen(save ? "game" : "title"))} icon={<Icon name="arrow-left" size={14} />}>
          Back
        </RetroButton>
      </div>
    </ScreenFrame>
  );
}
