import { describe, it, expect } from "vitest";
import { evaluateCondition, evaluateConditions } from "@/lib/conditions";
import { makeSave } from "./fixtures";
import type { Condition } from "@/types";

describe("evaluateCondition: stat checks", () => {
  it("minStat passes when a core stat meets the threshold", () => {
    const save = makeSave();
    save.player.core.intelligence = 8;
    const cond: Condition = { type: "minStat", stat: "intelligence", value: 6 };
    expect(evaluateCondition(save, cond)).toBe(true);
  });

  it("minStat fails when below the threshold", () => {
    const save = makeSave();
    save.player.core.courage = 2;
    expect(evaluateCondition(save, { type: "minStat", stat: "courage", value: 6 })).toBe(false);
  });

  it("minStat reads across core, elite, and aincrad stat groups", () => {
    const save = makeSave();
    save.player.elite.privatePoints = 5000;
    save.player.aincrad.col = 200;
    expect(evaluateCondition(save, { type: "minStat", stat: "privatePoints", value: 1000 })).toBe(true);
    expect(evaluateCondition(save, { type: "minStat", stat: "col", value: 500 })).toBe(false);
  });

  it("maxStat passes when at or below the ceiling", () => {
    const save = makeSave();
    save.player.elite.stress = 20;
    expect(evaluateCondition(save, { type: "maxStat", stat: "stress", value: 30 })).toBe(true);
    expect(evaluateCondition(save, { type: "maxStat", stat: "stress", value: 10 })).toBe(false);
  });
});

describe("evaluateCondition: flags", () => {
  it("flag passes only when present", () => {
    const save = makeSave({ flags: ["seen-intro"] });
    expect(evaluateCondition(save, { type: "flag", flag: "seen-intro" })).toBe(true);
    expect(evaluateCondition(save, { type: "flag", flag: "missing-flag" })).toBe(false);
  });

  it("missingFlag is the exact inverse of flag", () => {
    const save = makeSave({ flags: ["seen-intro"] });
    expect(evaluateCondition(save, { type: "missingFlag", flag: "seen-intro" })).toBe(false);
    expect(evaluateCondition(save, { type: "missingFlag", flag: "unseen" })).toBe(true);
  });
});

describe("evaluateCondition: relationships", () => {
  it("treats an untracked NPC as a relationship of 0", () => {
    const save = makeSave();
    expect(evaluateCondition(save, { type: "relationship", npcId: "ea-rei", axis: "trust", min: 0 })).toBe(true);
    expect(evaluateCondition(save, { type: "relationship", npcId: "ea-rei", axis: "trust", min: 1 })).toBe(false);
  });

  it("reads the correct axis once a relationship exists", () => {
    const save = makeSave({
      relationships: [
        { npcId: "ea-rei", affection: 0, trust: 40, respect: 10, fear: 0, suspicion: 0, rivalry: 0, loyalty: 0, knownSecrets: [], sharedMemories: [], mood: "neutral", metPlayer: true },
      ],
    });
    expect(evaluateCondition(save, { type: "relationship", npcId: "ea-rei", axis: "trust", min: 35 })).toBe(true);
    expect(evaluateCondition(save, { type: "relationship", npcId: "ea-rei", axis: "respect", min: 35 })).toBe(false);
  });
});

describe("evaluateCondition: items and quests", () => {
  it("hasItem checks quantity thresholds", () => {
    const save = makeSave({ inventory: [{ itemId: "ea-item-hairpin", quantity: 2, equipped: false }] });
    expect(evaluateCondition(save, { type: "hasItem", itemId: "ea-item-hairpin", quantity: 2 })).toBe(true);
    expect(evaluateCondition(save, { type: "hasItem", itemId: "ea-item-hairpin", quantity: 3 })).toBe(false);
    expect(evaluateCondition(save, { type: "hasItem", itemId: "unowned-item", quantity: 1 })).toBe(false);
  });

  it("questState matches the tracked state, defaulting to not_started", () => {
    const save = makeSave({ quests: [{ questId: "ea-q-daichi-leak", state: "active", completedObjectiveIds: [] }] });
    expect(evaluateCondition(save, { type: "questState", questId: "ea-q-daichi-leak", state: "active" })).toBe(true);
    expect(evaluateCondition(save, { type: "questState", questId: "unstarted-quest", state: "not_started" })).toBe(true);
  });
});

describe("evaluateConditions: AND semantics", () => {
  it("requires every condition to pass", () => {
    const save = makeSave({ flags: ["a"] });
    save.player.core.perception = 5;
    const conditions: Condition[] = [
      { type: "flag", flag: "a" },
      { type: "minStat", stat: "perception", value: 5 },
    ];
    expect(evaluateConditions(save, conditions)).toBe(true);
    expect(evaluateConditions(save, [...conditions, { type: "flag", flag: "b" }])).toBe(false);
  });

  it("an empty condition list always passes", () => {
    expect(evaluateConditions(makeSave(), [])).toBe(true);
  });
});
