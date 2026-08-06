import { describe, it, expect } from "vitest";
import { resolveSceneEntry } from "@/state/gameStore";
import { makeSave } from "./fixtures";

describe("resolveSceneEntry: revisit routing via altEntryNodes", () => {
  it("routes the ranking-board scene to its penalty-reveal node once flags line up", () => {
    const notYetMet = makeSave({ flags: [] });
    expect(resolveSceneEntry("ea-scene-ranking-board", notYetMet)).toBe("gate");

    const metArase = makeSave({ flags: ["ea-flag-met-arase"] });
    expect(resolveSceneEntry("ea-scene-ranking-board", metArase)).toBe("n1");

    const penaltyRevealed = makeSave({ flags: ["ea-flag-met-arase", "ea-flag-penalty-revealed"] });
    expect(resolveSceneEntry("ea-scene-ranking-board", penaltyRevealed)).toBe("seen");
  });

  it("routes Yuzuki's rooftop scene between first-visit, revisit, and post-resolution content", () => {
    const firstVisit = makeSave({ flags: [] });
    expect(resolveSceneEntry("ai-scene-yuzuki-rooftop", firstVisit)).toBe("n1");
  });

  it("falls back to the scene's declared startNode when no candidate matches and no altEntryNodes are declared", () => {
    const save = makeSave();
    expect(resolveSceneEntry("ea-scene-rei-intro", save)).toBe("n1");
  });

  it("an explicit override node id always wins", () => {
    const save = makeSave();
    expect(resolveSceneEntry("ea-scene-ranking-board", save, "n3")).toBe("n3");
  });
});
