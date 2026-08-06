import { describe, it, expect } from "vitest";
import { determineEliteChapterOutcome, determineAincradChapterOutcome } from "@/content/registry";
import { checkGenericAchievements } from "@/lib/achievements";
import { makeSave } from "./fixtures";

describe("determineEliteChapterOutcome", () => {
  it("resolves to Trusted Ally when the notebook was protected and no betrayal occurred", () => {
    const save = makeSave({ flags: ["ea-flag-notebook-protected", "ea-flag-daichi-reported"] });
    save.player.elite.trust = 70;
    expect(determineEliteChapterOutcome(save).id).toBe("ea-outcome-trusted-ally");
  });

  it("resolves to Isolated Outsider when the player betrayed Yuzuki and trust is low", () => {
    const save = makeSave({ flags: ["ea-flag-betrayed-yuzuki"] });
    save.player.elite.trust = 20;
    expect(determineEliteChapterOutcome(save).id).toBe("ea-outcome-isolated-outsider");
  });

  it("falls back to Quiet Operator otherwise", () => {
    const save = makeSave({ flags: [] });
    save.player.elite.trust = 50;
    expect(determineEliteChapterOutcome(save).id).toBe("ea-outcome-quiet-operator");
  });
});

describe("determineAincradChapterOutcome", () => {
  it("prioritizes Nobody Left Behind when the raid had zero casualties", () => {
    const save = makeSave({ worldId: "aincrad", flags: ["ai-flag-zero-casualties", "ai-flag-guild-solo"] });
    expect(determineAincradChapterOutcome(save).id).toBe("ai-outcome-zero-casualties");
  });

  it("resolves to Solo Survivor when the player stayed unaffiliated", () => {
    const save = makeSave({ worldId: "aincrad", flags: ["ai-flag-guild-solo"] });
    expect(determineAincradChapterOutcome(save).id).toBe("ai-outcome-solo-survivor");
  });

  it("defaults to the guild-bonded ending otherwise", () => {
    const save = makeSave({ worldId: "aincrad", flags: ["ai-flag-guild-chosen", "ai-flag-guild-hearthlight"] });
    expect(determineAincradChapterOutcome(save).id).toBe("ai-outcome-guild-bonded");
  });
});

describe("checkGenericAchievements", () => {
  it("unlocks First Ally once any relationship crosses the trust/affection threshold", () => {
    const save = makeSave({
      relationships: [
        { npcId: "ea-rei", affection: 0, trust: 50, respect: 0, fear: 0, suspicion: 0, rivalry: 0, loyalty: 0, knownSecrets: [], sharedMemories: [], mood: "warm", metPlayer: true },
      ],
    });
    expect(checkGenericAchievements(save)).toContain("ach-first-ally");
  });

  it("does not re-suggest an achievement the save already has", () => {
    const save = makeSave({ achievementsUnlocked: ["ach-well-stocked"] });
    save.player.elite.privatePoints = 5000;
    expect(checkGenericAchievements(save)).not.toContain("ach-well-stocked");
  });

  it("unlocks Chapter Closed once a chapter-completion flag is present", () => {
    const save = makeSave({ flags: ["ea-flag-chapter1-complete"] });
    expect(checkGenericAchievements(save)).toContain("ach-chapter-closed");
  });
});
