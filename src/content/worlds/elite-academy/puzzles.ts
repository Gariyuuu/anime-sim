import type { PuzzleDefinitionInput } from "@/types";

export const eliteAcademyPuzzles: PuzzleDefinitionInput[] = [
  {
    id: "ea-puzzle-archive",
    worldId: "elite-academy",
    totalSwitches: 4,
    successFlag: "ea-flag-archive-unlocked",
    successAchievementId: "ach-archive-unlocked",
    hint: "A brass plaque, half-polished: \"Order of ascension — weakest survives longest.\"",
    failMessage: "The levers clunk back to their resting position. Wrong order — try again.",
    successMessage: "Something deep in the wall unlatches.",
  },
];
