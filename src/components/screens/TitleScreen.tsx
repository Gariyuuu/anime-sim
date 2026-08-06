"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame, Logo } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Icon } from "@/components/ui/Icon";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import { listSaveSlots } from "@/lib/save";
import type { SaveSlotSummary } from "@/types";
import type { Appearance } from "@/types";
import { loadSaveSlot } from "@/lib/save";

const MENU_ITEMS: Array<{ id: string; label: string; icon: string }> = [
  { id: "continue", label: "Continue", icon: "play" },
  { id: "new", label: "New Game", icon: "sparkles" },
  { id: "load", label: "Load Game", icon: "folder-open" },
  { id: "codex", label: "Codex", icon: "book-open" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "patch", label: "Patch Notes", icon: "scroll-text" },
  { id: "credits", label: "Credits", icon: "heart" },
];

export function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const continueFromAutosave = useGameStore((s) => s.continueFromAutosave);
  const [slots, setSlots] = useState<SaveSlotSummary[]>([]);
  const [lastAppearance, setLastAppearance] = useState<Appearance | null>(null);

  useEffect(() => {
    listSaveSlots().then(async (s) => {
      setSlots(s);
      if (s.length > 0) {
        const full = await loadSaveSlot(s[0].slotId);
        if (full) setLastAppearance(full.player.appearance);
      }
    });
  }, []);

  const hasSave = slots.length > 0;

  async function handleSelect(id: string) {
    switch (id) {
      case "continue": {
        const ok = await continueFromAutosave();
        if (!ok && slots[0]) {
          await useGameStore.getState().loadGame(slots[0].slotId);
        } else if (!ok) {
          setScreen("worldSelect");
        }
        return;
      }
      case "new":
        setScreen("worldSelect");
        return;
      case "load":
        setScreen("saveSelect");
        return;
      case "codex":
        setScreen("codex");
        return;
      case "settings":
        setScreen("settings");
        return;
      case "patch":
        setScreen("patchNotes");
        return;
      case "credits":
        setScreen("credits");
        return;
    }
  }

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 sm:pt-12">
        <Logo />

        {lastAppearance && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col items-center gap-1">
            <div className="rounded-full border-2 border-ink-950 bg-ink-100 p-2">
              <PixelAvatar appearance={lastAppearance} size={64} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-ink-500">Welcome back</p>
          </motion.div>
        )}

        <nav className="flex w-full max-w-xs flex-col gap-2">
          {MENU_ITEMS.filter((item) => (item.id === "continue" ? hasSave : true)).map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <RetroButton variant={item.id === "new" ? "primary" : "secondary"} className="w-full justify-start" icon={<Icon name={item.icon} size={14} />} onClick={() => handleSelect(item.id)}>
                {item.label}
              </RetroButton>
            </motion.div>
          ))}
        </nav>

        <p className="mt-10 max-w-md text-center text-[10px] leading-relaxed text-ink-500">
          Unofficial fan-made prototype. Original characters, world, and dialogue only — for private, noncommercial use.
        </p>
      </div>
    </ScreenFrame>
  );
}
