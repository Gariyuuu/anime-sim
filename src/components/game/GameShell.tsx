"use client";

import { useEffect } from "react";
import { useGameStore } from "@/state/gameStore";
import { DialogueView } from "./DialogueView";
import { ExplorationView } from "./ExplorationView";
import { CombatView } from "./CombatView";
import { DeviceMenu } from "./DeviceMenu";
import { DebugPanel } from "./DebugPanel";
import { ChapterRecapScreen } from "./ChapterRecapScreen";
import { NotificationToasts } from "./NotificationToasts";
import { HowToPlayModal } from "./HowToPlayModal";
import { ArenaModal } from "./ArenaModal";
import { audioManager } from "@/audio/audioManager";

const TUTORIAL_SEEN_KEY = "anime-sim-tutorial-seen";

export function GameShell() {
  const save = useGameStore((s) => s.save);
  const showChapterRecapIfDue = useGameStore((s) => s.showChapterRecapIfDue);
  const saveGame = useGameStore((s) => s.saveGame);
  const toggleHelp = useGameStore((s) => s.toggleHelp);

  useEffect(() => {
    showChapterRecapIfDue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save?.flags.length]);

  // Show the How to Play modal once, automatically, the first time this browser ever reaches
  // gameplay — after that it's only reachable via the HUD's help button.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(TUTORIAL_SEEN_KEY)) {
        window.localStorage.setItem(TUTORIAL_SEEN_KEY, "true");
        toggleHelp(true);
      }
    } catch {
      // localStorage unavailable (private mode, quota) — tutorial just won't auto-show once
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // playtime tracking + periodic autosave
  useEffect(() => {
    if (!save) return;
    const interval = setInterval(() => {
      const current = useGameStore.getState().save;
      if (!current) return;
      useGameStore.setState({ save: { ...current, playtimeSeconds: current.playtimeSeconds + 20 } });
      saveGame();
    }, 20000);
    return () => clearInterval(interval);
    // Intentionally keyed on slotId, not the whole `save` object — this interval should persist
    // across a playthrough and only reset when switching to a different save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save?.slotId, saveGame]);

  useEffect(() => {
    function applyDocFlags() {
      const s = useGameStore.getState().save?.settings;
      const root = document.documentElement;
      root.setAttribute("data-reduced-motion", String(s?.reducedMotion ?? false));
      root.setAttribute("data-high-contrast", String(s?.highContrast ?? false));
      root.setAttribute("data-dyslexia-font", String(s?.dyslexiaFont ?? false));
      root.style.fontSize = s?.textSize === "small" ? "14px" : s?.textSize === "large" ? "18px" : "16px";
    }
    applyDocFlags();
  }, [save?.settings]);

  useEffect(() => {
    if (!save) return;
    audioManager.updateSettings({
      audioEnabled: save.settings.audioEnabled,
      sfxVolume: save.settings.sfxVolume,
      musicVolume: save.settings.musicVolume,
      ambienceVolume: save.settings.ambienceVolume,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save?.settings]);

  useEffect(() => {
    function onVisibility() {
      document.documentElement.setAttribute("data-tab-hidden", String(document.hidden));
    }
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!save) return null;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {save.mode === "dialogue" && <DialogueView />}
      {save.mode === "exploration" && <ExplorationView />}
      {save.mode === "combat" && <CombatView />}
      {save.mode === "device" && <DeviceMenuFullScreen />}
      {save.mode === "recap" && <ChapterRecapScreen />}
      <DeviceMenu />
      <DebugPanel />
      <NotificationToasts />
      <HowToPlayModal />
      <ArenaModal />
    </div>
  );
}

function DeviceMenuFullScreen() {
  const toggleDevice = useGameStore((s) => s.toggleDevice);
  useEffect(() => {
    toggleDevice(true);
  }, [toggleDevice]);
  return <div className="flex h-dvh w-full items-center justify-center bg-ink-950 text-paper-0 text-xs">Loading...</div>;
}
