"use client";

import { useEffect } from "react";
import { useGameStore } from "@/state/gameStore";
import { audioManager } from "@/audio/audioManager";
import { loadSettingsFromLocalStorage } from "@/lib/save";
import { defaultSettings, SettingsSchema } from "@/types/settings";
import { BootScreen } from "@/components/screens/BootScreen";
import { TitleScreen } from "@/components/screens/TitleScreen";
import { WorldSelectScreen } from "@/components/screens/WorldSelectScreen";
import { CharacterCreatorScreen } from "@/components/screens/CharacterCreatorScreen";
import { SaveSelectScreen } from "@/components/screens/SaveSelectScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { CodexScreen } from "@/components/screens/CodexScreen";
import { AchievementsScreen } from "@/components/screens/AchievementsScreen";
import { PatchNotesScreen } from "@/components/screens/PatchNotesScreen";
import { CreditsScreen } from "@/components/screens/CreditsScreen";
import { GameShell } from "@/components/game/GameShell";

export function GameRoot() {
  const screen = useGameStore((s) => s.screen);
  const save = useGameStore((s) => s.save);

  useEffect(() => {
    if (save) return;
    const parsed = SettingsSchema.safeParse(loadSettingsFromLocalStorage());
    const settings = parsed.success ? parsed.data : defaultSettings();
    audioManager.updateSettings(settings);
  }, [save]);

  // Menu-level screens all share the title theme; in-game music (world/battle) is handled by
  // GameShell, which knows the active save's worldId/mode.
  useEffect(() => {
    if (screen !== "game") audioManager.playMusic("title");
  }, [screen]);

  switch (screen) {
    case "boot":
      return <BootScreen />;
    case "title":
      return <TitleScreen />;
    case "worldSelect":
      return <WorldSelectScreen />;
    case "characterCreator":
      return <CharacterCreatorScreen />;
    case "saveSelect":
      return <SaveSelectScreen />;
    case "settings":
      return <SettingsScreen />;
    case "codex":
      return <CodexScreen />;
    case "achievements":
      return <AchievementsScreen />;
    case "patchNotes":
      return <PatchNotesScreen />;
    case "credits":
      return <CreditsScreen />;
    case "game":
      return <GameShell />;
    default:
      return null;
  }
}
