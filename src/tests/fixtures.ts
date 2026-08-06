import { createPlayerFromCreator } from "@/types/character";
import { defaultSettings } from "@/types/settings";
import type { SaveGame } from "@/types/save";

export function makeSave(overrides: Partial<SaveGame> = {}): SaveGame {
  const player = createPlayerFromCreator({
    name: "Test Player",
    pronouns: "they/them",
    personality: "strategist",
    strength: "intelligence",
    weakness: "courage",
    appearance: {
      hairstyle: "short",
      hairColor: "black",
      eyeColor: "dark-brown",
      skinTone: "light",
      face: "gentle",
      outfit: "standard-uniform",
      accessory: "none",
    },
    world: "elite-academy",
    difficulty: "standard",
  });

  return {
    version: 1,
    slotId: "test-slot",
    createdAt: 0,
    updatedAt: 0,
    playtimeSeconds: 0,
    chapterName: "Test Chapter",
    worldId: "elite-academy",
    player,
    flags: [],
    relationships: [],
    inventory: [],
    quests: [],
    codexUnlocked: [],
    achievementsUnlocked: [],
    currentChapterId: "ea-ch1",
    unlockedChapterIds: ["ea-ch1"],
    currentSceneId: undefined,
    currentNodeId: undefined,
    currentMapId: undefined,
    currentSpawnId: undefined,
    mode: "dialogue",
    partyMemberIds: [],
    timeOfDay: "morning",
    dayCount: 1,
    dialogueHistory: [],
    choiceLog: [],
    messages: [],
    settings: defaultSettings(),
    ...overrides,
  };
}
