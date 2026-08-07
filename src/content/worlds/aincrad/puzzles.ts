import type { PuzzleDefinitionInput } from "@/types";

export const aincradPuzzles: PuzzleDefinitionInput[] = [
  {
    id: "ai-puzzle-vaults",
    worldId: "aincrad",
    totalSwitches: 3,
    successFlag: "ai-flag-vault-unlocked",
    successAchievementId: "ach-vault-cracked",
    hint: "Frost-etched instructions, half-legible: \"Rime-covered first. Cracked, second. Untouched, last.\"",
    failMessage: "The levers seize back into place with a grinding click. Wrong order — the mechanism resets.",
    successMessage: "Ice shears off the far wall as something ancient unseals.",
  },
];
