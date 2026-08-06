import type { ChapterDefinitionInput } from "@/types";
import type { SaveGame } from "@/types/save";

export const aincradChapter1: ChapterDefinitionInput = {
  id: "ai-ch1",
  worldId: "aincrad",
  title: "The Locked Sky",
  subtitle: "Floor 1, Week One",
  summary:
    "Logout is gone. A new player wakes up trapped in Aincrad, meets the Town of Beginnings' first survivors, and takes part in the floor's first boss raid.",
  startSceneId: "ai-scene-login",
  outcomes: [
    {
      id: "ai-outcome-zero-casualties",
      title: "Nobody Left Behind",
      description: "Floor 1 falls, and everyone who fought it walks away. That won't always be possible. It was this time, because of you.",
      requiredFlags: ["ai-flag-zero-casualties"],
    },
    {
      id: "ai-outcome-guild-bonded",
      title: "One of Them Now",
      description: "You didn't fight this floor alone, and it shows. Whichever banner you chose, Floor 1's survivors know your name for it.",
      requiredFlags: ["ai-flag-guild-chosen"],
    },
    {
      id: "ai-outcome-solo-survivor",
      title: "Solo Survivor",
      description: "You cleared Floor 1 answering to no one but yourself. Ninety-nine floors left, and you intend to face every one of them the same way.",
      requiredFlags: ["ai-flag-guild-solo"],
    },
  ],
};

export function determineAincradChapterOutcome(save: SaveGame): { id: string; title: string; description: string } {
  const flags = save.flags;
  if (flags.includes("ai-flag-zero-casualties")) return aincradChapter1.outcomes[0];
  if (flags.includes("ai-flag-guild-solo")) return aincradChapter1.outcomes[2];
  return aincradChapter1.outcomes[1];
}
