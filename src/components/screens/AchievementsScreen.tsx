"use client";

import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import { achievements } from "@/content/registry";

export function AchievementsScreen({ onBack }: { onBack?: () => void }) {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const unlocked = new Set(save?.achievementsUnlocked ?? []);

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 pb-10">
        <h1 className="font-display mb-1 text-center text-sm text-ink-950">Achievements</h1>
        <p className="mb-6 text-[10px] uppercase tracking-widest text-ink-500">
          {unlocked.size}/{achievements.length} unlocked
        </p>

        <div className="grid w-full max-w-3xl gap-2 sm:grid-cols-2">
          {achievements.map((a) => {
            const isUnlocked = unlocked.has(a.id);
            const showHidden = a.hidden && !isUnlocked;
            return (
              <Panel key={a.id} className={!isUnlocked ? "opacity-60" : undefined}>
                <div className="flex items-start gap-3">
                  <div className="rounded border-2 border-ink-950 p-2" style={{ background: isUnlocked ? "var(--accent-warning)" : "var(--ink-200)" }}>
                    <Icon name={a.icon} size={16} color={isUnlocked ? "var(--paper-0)" : "var(--ink-500)"} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{showHidden ? "Hidden Achievement" : a.title}</p>
                    <p className="text-[10px] text-ink-600">{showHidden ? "Keep playing to discover this one." : a.description}</p>
                  </div>
                </div>
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
