import type { ChapterDefinitionInput } from "@/types";
import type { SaveGame } from "@/types/save";

export const eliteAcademyChapter1: ChapterDefinitionInput = {
  id: "ea-ch1",
  worldId: "elite-academy",
  title: "The First Ranking",
  subtitle: "Class 1-C, Week One",
  summary:
    "A transfer student arrives at the Advanced Integrated Academy, meets Class 1-C, and uncovers who's been quietly bleeding the class of points.",
  startSceneId: "ea-scene-arrival",
  outcomes: [
    {
      id: "ea-outcome-trusted-ally",
      title: "Trusted Ally",
      description: "You protected the people who trusted you, even when it cost you leverage. 1-C trusts you — and that trust is worth more than points.",
      requiredFlags: ["ea-flag-notebook-protected", "ea-flag-daichi-reported"],
    },
    {
      id: "ea-outcome-quiet-operator",
      title: "Quiet Operator",
      description: "You collected secrets instead of spending them loudly. Nobody fully trusts you, but everybody's a little afraid of what you know.",
      requiredFlags: ["ea-flag-daichi-leveraged"],
    },
    {
      id: "ea-outcome-isolated-outsider",
      title: "Isolated Outsider",
      description: "Whatever you did to get through the first exam, it cost you. 1-C survived — but you're on the outside of it now.",
      requiredFlags: ["ea-flag-betrayed-yuzuki"],
    },
  ],
};

export function determineEliteChapterOutcome(save: SaveGame): { id: string; title: string; description: string } {
  const flags = save.flags;
  if (flags.includes("ea-flag-betrayed-yuzuki") && save.player.elite.trust < 45) {
    return eliteAcademyChapter1.outcomes[2];
  }
  if (flags.includes("ea-flag-notebook-protected") && !flags.includes("ea-flag-betrayed-yuzuki") && save.player.elite.trust >= 55) {
    return eliteAcademyChapter1.outcomes[0];
  }
  return eliteAcademyChapter1.outcomes[1];
}
