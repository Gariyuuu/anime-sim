"use client";

import { useGameStore } from "@/state/gameStore";
import { ScreenFrame, Logo } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";

export function CreditsScreen({ onBack }: { onBack?: () => void }) {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 pb-10 text-center">
        <Logo subtitle={false} />
        <Panel className="max-w-lg text-left">
          <p className="mb-3 text-xs leading-relaxed text-ink-700">
            <strong>ANIME//SIM</strong> is an unofficial, noncommercial fan-made prototype built as a story-driven anime life simulator across
            two original worlds. It is not affiliated with, endorsed by, or connected to any existing anime, manga, light novel, or game
            franchise.
          </p>
          <p className="mb-3 text-xs leading-relaxed text-ink-700">
            All characters, locations, dialogue, items, and world lore are original creations, written to evoke the general atmosphere of
            competitive-school and trapped-MMO stories without reproducing any copyrighted material — no official artwork, music, scripts,
            or character likenesses were used.
          </p>
          <p className="mb-3 text-xs leading-relaxed text-ink-700">
            Built with Next.js, TypeScript, React, Tailwind CSS, Framer Motion, Zustand, Dexie.js, Zod, and Howler.js.
          </p>
          <p className="text-xs leading-relaxed text-ink-700">Thank you for playing this vertical slice.</p>
        </Panel>
        <RetroButton variant="ghost" className="mt-8" onClick={() => (onBack ? onBack() : setScreen(save ? "game" : "title"))} icon={<Icon name="arrow-left" size={14} />}>
          Back
        </RetroButton>
      </div>
    </ScreenFrame>
  );
}
