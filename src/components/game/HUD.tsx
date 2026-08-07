"use client";

import { useGameStore } from "@/state/gameStore";
import { getQuest } from "@/content/registry";
import { getNextObjective } from "@/lib/quests";
import { Icon } from "@/components/ui/Icon";
import { StatBar } from "@/components/ui/StatBar";

export function HUD({ locationLabel, ambientLabel }: { locationLabel?: string; ambientLabel?: string }) {
  const save = useGameStore((s) => s.save);
  const toggleDevice = useGameStore((s) => s.toggleDevice);
  const toggleHelp = useGameStore((s) => s.toggleHelp);
  const setScreen = useGameStore((s) => s.setScreen);
  if (!save) return null;
  const isElite = save.worldId === "elite-academy";
  const activeQuests = save.quests.filter((q) => q.state === "active");
  // Prefer the main story quest over side/character quests when both are active — that's the
  // one a lost player most needs pointed out.
  const activeQuest = activeQuests.find((q) => getQuest(q.questId)?.type === "main") ?? activeQuests[0];
  const activeQuestDef = activeQuest ? getQuest(activeQuest.questId) : undefined;
  const nextObjective = activeQuest ? getNextObjective(save, activeQuest.questId) : undefined;

  return (
    <div className="border-b-2 border-ink-950 bg-paper-0 text-ink-950">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
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
      {/* Persistent objective strip — the quest log used to live only inside the phone menu, so a
          player exploring with no active quest (or unsure what to do next within one) had
          nothing on screen telling them. Shows the specific next incomplete objective when one
          can be determined (see `lib/quests.ts`), falling back to the quest's overall
          description for quests/objectives this system can't resolve. */}
      <button
        onClick={() => toggleDevice(true)}
        className="flex w-full items-center gap-1.5 border-t border-ink-200 bg-ink-100 px-3 py-1 text-left hover:bg-ink-200"
      >
        <Icon name={activeQuestDef ? "target" : "compass"} size={11} className="shrink-0 text-ink-500" />
        {activeQuestDef ? (
          <span className="truncate text-[10px] text-ink-700">
            <span className="font-bold uppercase tracking-wide">{activeQuestDef.title}:</span> {nextObjective?.text ?? activeQuestDef.description}
          </span>
        ) : (
          <span className="truncate text-[10px] text-ink-500">No active lead — talk to people and interact with objects around you to find your next step.</span>
        )}
      </button>
    </div>
  );
}
