"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { Panel } from "@/components/ui/Panel";
import { RetroButton } from "@/components/ui/RetroButton";
import { Icon } from "@/components/ui/Icon";
import { determineEliteChapterOutcome, determineAincradChapterOutcome, achievements, getChapter } from "@/content/registry";
import { RELATIONSHIP_AXES } from "@/types/common";
import { getNpc } from "@/content/registry";

export function ChapterRecapScreen() {
  const save = useGameStore((s) => s.save)!;
  const setScreen = useGameStore((s) => s.setScreen);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const isElite = save.worldId === "elite-academy";

  const currentChapterDef = getChapter(save.currentChapterId);
  const nextChapter = currentChapterDef?.nextChapterId ? getChapter(currentChapterDef.nextChapterId) : undefined;

  const outcome = useMemo(() => (isElite ? determineEliteChapterOutcome(save) : determineAincradChapterOutcome(save)), [save, isElite]);

  const topRelationships = [...save.relationships]
    .map((r) => ({ r, total: RELATIONSHIP_AXES.reduce((s, a) => s + Math.abs(r[a]), 0) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  const chapterAchievements = save.achievementsUnlocked.map((id) => achievements.find((a) => a.id === id)).filter((a): a is (typeof achievements)[number] => !!a);

  const historyKey = `anime-sim-playthroughs-${save.currentChapterId}`;
  const [previousOutcomes] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(historyKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(historyKey, JSON.stringify([...previousOutcomes, outcome.title].slice(-10)));
    } catch {
      // localStorage unavailable — recap still works, just without cross-playthrough history
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 pb-10">
        <p className="mb-1 text-[10px] uppercase tracking-widest text-ink-500">Chapter Complete</p>
        <h1 className="font-display mb-6 text-center text-sm text-ink-950">{save.chapterName}</h1>

        <Panel title="Ending" accent={isElite ? "var(--accent-elite)" : "var(--accent-aincrad)"} className="mb-4 w-full max-w-2xl">
          <p className="mb-1 text-sm font-bold">{outcome.title}</p>
          <p className="text-xs leading-relaxed text-ink-700">{outcome.description}</p>
        </Panel>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <Panel title="Key Choices">
            <ul className="space-y-1.5">
              {save.choiceLog
                .slice(-8)
                .map((c, i) => (
                  <li key={i} className="text-[11px] text-ink-700">
                    <Icon name="chevron-right" size={10} className="mr-1 inline" />
                    {c.text}
                  </li>
                ))}
              {save.choiceLog.length === 0 && <p className="text-[11px] text-ink-500">No major choices logged.</p>}
            </ul>
          </Panel>

          <Panel title="Relationships">
            <ul className="space-y-1.5">
              {topRelationships.map(({ r }) => {
                const npc = getNpc(r.npcId);
                return (
                  <li key={r.npcId} className="flex items-center justify-between text-[11px] text-ink-700">
                    <span>{npc?.fullName ?? r.npcId}</span>
                    <span className="text-ink-500">{r.mood}</span>
                  </li>
                );
              })}
              {topRelationships.length === 0 && <p className="text-[11px] text-ink-500">No relationships formed.</p>}
            </ul>
          </Panel>

          <Panel title="Secrets & Codex">
            <p className="text-[11px] text-ink-700">{save.codexUnlocked.length} codex entries discovered.</p>
            <p className="text-[11px] text-ink-500">Some optional content may still be waiting to be found.</p>
          </Panel>

          <Panel title="Achievements This Chapter">
            <ul className="space-y-1">
              {chapterAchievements.slice(-6).map((a) => (
                <li key={a.id} className="flex items-center gap-1.5 text-[11px] text-ink-700">
                  <Icon name="award" size={11} className="text-accent-warning" />
                  {a.title}
                </li>
              ))}
              {chapterAchievements.length === 0 && <p className="text-[11px] text-ink-500">None yet.</p>}
            </ul>
          </Panel>

          {previousOutcomes.length > 0 && (
            <Panel title="Previous Playthroughs" className="sm:col-span-2">
              <div className="flex flex-wrap gap-1.5">
                {previousOutcomes.map((title, i) => (
                  <span key={i} className="rounded border-2 border-ink-300 px-2 py-0.5 text-[10px]">
                    {title}
                  </span>
                ))}
              </div>
            </Panel>
          )}
        </div>

        <div className="mt-8 flex gap-2">
          {nextChapter ? (
            <RetroButton onClick={advanceChapter} icon={<Icon name="arrow-right" size={14} />}>
              Next Chapter: {nextChapter.title}
            </RetroButton>
          ) : (
            <RetroButton
              onClick={() => {
                useGameStore.setState({ save: { ...save, mode: save.currentMapId ? "exploration" : "device" } });
              }}
              icon={<Icon name="play" size={14} />}
            >
              Continue Playing
            </RetroButton>
          )}
          <RetroButton variant="secondary" onClick={() => setScreen("title")} icon={<Icon name="home" size={14} />}>
            Title Screen
          </RetroButton>
        </div>
      </div>
    </ScreenFrame>
  );
}
