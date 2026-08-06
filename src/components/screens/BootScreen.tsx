"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/state/gameStore";
import { audioManager } from "@/audio/audioManager";

const BOOT_LINES = [
  "ANIME//SIM HANDHELD SYSTEM",
  "INITIALIZING NARRATIVE ENGINE...",
  "LOADING WORLD DATA: ELITE ACADEMY, AINCRAD...",
  "MOUNTING LOCAL SAVE VOLUME...",
  "READY.",
];

export function BootScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    audioManager.playSfx("boot-startup");
  }, []);

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) {
      const t = setTimeout(() => setScreen("title"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 260);
    return () => clearTimeout(t);
  }, [visibleLines, setScreen]);

  return (
    <div
      className="flex h-dvh w-full cursor-pointer flex-col items-center justify-center bg-ink-950 px-6 text-paper-0"
      onClick={() => setScreen("title")}
    >
      <div className="w-full max-w-md font-mono text-xs sm:text-sm">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1 tracking-wide">
            <span className="text-accent-warning">&gt;</span> {line}
          </motion.p>
        ))}
        {visibleLines < BOOT_LINES.length && <span className="inline-block h-3 w-2 animate-pulse bg-paper-0 align-middle" />}
      </div>
      <p className="mt-10 text-[10px] uppercase tracking-widest text-ink-500">click / press any key to skip</p>
    </div>
  );
}
