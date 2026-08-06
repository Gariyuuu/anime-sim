"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import type { WorldId } from "@/types";

const WORLDS: Array<{
  id: WorldId;
  title: string;
  tag: string;
  color: string;
  glyph: string;
  description: string;
  bullets: string[];
}> = [
  {
    id: "elite-academy",
    title: "Elite Academy",
    tag: "Psychological · Social · Strategic",
    color: "var(--accent-elite)",
    glyph: "graduation-cap",
    description:
      "A government-funded boarding school where class rank decides everything. Win through intelligence, charisma, deception, or calculated risk — not just fighting.",
    bullets: ["Class rankings & special exams", "Trust, suspicion, and hidden motives", "Chapter One: \"The First Ranking\""],
  },
  {
    id: "aincrad",
    title: "Aincrad",
    tag: "Survival · Tactical · Party-Based",
    color: "var(--accent-aincrad)",
    glyph: "sword",
    description:
      "A floating castle MMO where logout has been disabled. Clear floors, build a party or go it alone, and survive boss raids where every decision has weight.",
    bullets: ["Floor-by-floor progression", "Turn-based combat & crafting", "Chapter One: \"The Locked Sky\""],
  },
];

export function WorldSelectScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setPendingWorldId = useGameStore((s) => s.setPendingWorldId);

  function choose(id: WorldId) {
    setPendingWorldId(id);
    setScreen("characterCreator");
  }

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6">
        <h1 className="font-display mb-1 text-center text-sm text-ink-950">Choose Your World</h1>
        <p className="mb-8 text-center text-[10px] uppercase tracking-widest text-ink-500">This choice shapes everything that follows.</p>

        <div className="grid w-full gap-6 sm:grid-cols-2">
          {WORLDS.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Panel title={w.title} accent={w.color} className="flex h-full flex-col">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded border-2 border-ink-950 p-2" style={{ background: w.color }}>
                    <Icon name={w.glyph} size={20} color="var(--paper-0)" />
                  </div>
                  <p className="text-[10px] uppercase tracking-wide text-ink-500">{w.tag}</p>
                </div>
                <p className="mb-3 flex-1 text-xs leading-relaxed text-ink-800">{w.description}</p>
                <ul className="mb-4 space-y-1 text-[10px] text-ink-600">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <Icon name="chevron-right" size={10} />
                      {b}
                    </li>
                  ))}
                </ul>
                <RetroButton className="w-full" onClick={() => choose(w.id)} icon={<Icon name="arrow-right" size={14} />}>
                  Enter {w.title}
                </RetroButton>
              </Panel>
            </motion.div>
          ))}
        </div>

        <RetroButton variant="ghost" className="mt-8" onClick={() => setScreen("title")} icon={<Icon name="arrow-left" size={14} />}>
          Back
        </RetroButton>
      </div>
    </ScreenFrame>
  );
}
