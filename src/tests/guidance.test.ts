import { describe, it, expect } from "vitest";
import { getGuidanceTarget } from "@/lib/guidance";
import { makeSave } from "./fixtures";

describe("getGuidanceTarget", () => {
  it("points at a chapter's single-step main beat", () => {
    const save = makeSave({ currentChapterId: "ea-ch2", flags: ["ea-flag-ch2-arrived"] });
    const target = getGuidanceTarget(save);
    expect(target).toEqual({ mapId: "ea-map-classroom", interactableId: "obj-ch2-event" });
  });

  it("returns undefined once the chapter's completionFlag is set", () => {
    const save = makeSave({ currentChapterId: "ea-ch2", flags: ["ea-flag-ch2-complete"] });
    expect(getGuidanceTarget(save)).toBeUndefined();
  });

  it("advances a multi-step Aincrad floor as flags are set", () => {
    const base = makeSave({ worldId: "aincrad", currentChapterId: "ai-ch4" });
    expect(getGuidanceTarget(base)).toEqual({ mapId: "ai-map-town4", interactableId: "door-field" });

    const inField = makeSave({ worldId: "aincrad", currentChapterId: "ai-ch4", flags: ["ai-flag-floor4-field-entered"] });
    expect(getGuidanceTarget(inField)).toEqual({ mapId: "ai-map-field4", interactableId: "mon-miniboss" });

    const minibossDown = makeSave({
      worldId: "aincrad",
      currentChapterId: "ai-ch4",
      flags: ["ai-flag-floor4-field-entered", "ai-flag-floor4-miniboss-defeated"],
    });
    expect(getGuidanceTarget(minibossDown)).toEqual({ mapId: "ai-map-field4", interactableId: "obj-raid-prep" });
  });

  it("composes with the real objective system for ai-ch1", () => {
    const save = makeSave({ worldId: "aincrad", currentChapterId: "ai-ch1", flags: ["ai-flag-no-logout-revealed"] });
    const target = getGuidanceTarget(save);
    expect(target).toEqual({ mapId: "ai-map-town1", interactableId: "obj-guild-board" });
  });

  it("returns undefined for a chapter with no guidance data and no objective composition", () => {
    // ea-ch1 IS objective-composed, but its objectives with no listed target (e.g. once past
    // "investigate-penalty") should fall through to undefined, not throw.
    const save = makeSave({
      currentChapterId: "ea-ch1",
      flags: ["ea-flag-met-rei", "ea-flag-met-arase", "ea-flag-penalty-revealed", "ea-flag-exam-complete"],
    });
    expect(getGuidanceTarget(save)).toBeUndefined();
  });
});
