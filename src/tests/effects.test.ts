import { describe, it, expect } from "vitest";
import { applyEffects } from "@/lib/effects";
import { makeSave } from "./fixtures";
import type { Effect } from "@/types";

describe("applyEffects: stats", () => {
  it("modifies a core stat and clamps to [0, 20]", () => {
    const save = makeSave();
    save.player.core.courage = 19;
    const { save: next } = applyEffects(save, [{ type: "modifyStat", stat: "courage", delta: 5 }]);
    expect(next.player.core.courage).toBe(20);
  });

  it("modifies an elite stat without clamping to the core stat range", () => {
    const save = makeSave();
    const { save: next } = applyEffects(save, [{ type: "modifyStat", stat: "reputation", delta: 15 }]);
    expect(next.player.elite.reputation).toBe(65); // starts at 50
  });

  it("never drops a non-core stat below zero", () => {
    const save = makeSave();
    save.player.elite.suspicion = 5;
    const { save: next } = applyEffects(save, [{ type: "modifyStat", stat: "suspicion", delta: -20 }]);
    expect(next.player.elite.suspicion).toBe(0);
  });

  it("leaves the original save untouched (immutability)", () => {
    const save = makeSave();
    const before = save.player.core.intelligence;
    applyEffects(save, [{ type: "modifyStat", stat: "intelligence", delta: 3 }]);
    expect(save.player.core.intelligence).toBe(before);
  });
});

describe("applyEffects: relationships", () => {
  it("creates a fresh relationship on first contact and clamps to [-100, 100]", () => {
    const save = makeSave();
    const { save: next } = applyEffects(save, [{ type: "modifyRelationship", npcId: "ea-yuzuki", axis: "affection", delta: 500 }]);
    const rel = next.relationships.find((r) => r.npcId === "ea-yuzuki");
    expect(rel).toBeDefined();
    expect(rel!.affection).toBe(100);
    expect(rel!.metPlayer).toBe(true);
  });

  it("derives mood from the resulting relationship values", () => {
    const save = makeSave();
    const { save: next } = applyEffects(save, [
      { type: "modifyRelationship", npcId: "ea-yuzuki", axis: "affection", delta: 65 },
      { type: "modifyRelationship", npcId: "ea-yuzuki", axis: "trust", delta: 45 },
    ]);
    const rel = next.relationships.find((r) => r.npcId === "ea-yuzuki")!;
    expect(rel.mood).toBe("affectionate");
  });

  it("accumulates on an existing relationship instead of duplicating it", () => {
    const save = makeSave({
      relationships: [
        { npcId: "ea-rei", affection: 0, trust: 10, respect: 0, fear: 0, suspicion: 0, rivalry: 0, loyalty: 0, knownSecrets: [], sharedMemories: [], mood: "neutral", metPlayer: true },
      ],
    });
    const { save: next } = applyEffects(save, [{ type: "modifyRelationship", npcId: "ea-rei", axis: "trust", delta: 10 }]);
    expect(next.relationships).toHaveLength(1);
    expect(next.relationships[0].trust).toBe(20);
  });
});

describe("applyEffects: inventory", () => {
  it("adds a new item slot with the given quantity", () => {
    const save = makeSave();
    const { save: next } = applyEffects(save, [{ type: "addItem", itemId: "ea-item-hairpin", quantity: 1 }]);
    expect(next.inventory).toEqual([{ itemId: "ea-item-hairpin", quantity: 1, equipped: false }]);
  });

  it("stacks additional quantity onto an existing slot", () => {
    const save = makeSave({ inventory: [{ itemId: "ai-item-healing-crystal", quantity: 2, equipped: false }] });
    const { save: next } = applyEffects(save, [{ type: "addItem", itemId: "ai-item-healing-crystal", quantity: 3 }]);
    expect(next.inventory.find((i) => i.itemId === "ai-item-healing-crystal")?.quantity).toBe(5);
  });

  it("removes quantity and drops the slot once it reaches zero (never goes negative)", () => {
    const save = makeSave({ inventory: [{ itemId: "ai-item-healing-crystal", quantity: 2, equipped: false }] });
    const { save: next } = applyEffects(save, [{ type: "removeItem", itemId: "ai-item-healing-crystal", quantity: 5 }]);
    expect(next.inventory.find((i) => i.itemId === "ai-item-healing-crystal")).toBeUndefined();
  });
});

describe("applyEffects: flags and quests", () => {
  it("setFlag is idempotent", () => {
    const save = makeSave({ flags: ["a"] });
    const { save: next } = applyEffects(save, [{ type: "setFlag", flag: "a" }]);
    expect(next.flags).toEqual(["a"]);
  });

  it("clearFlag removes a flag if present", () => {
    const save = makeSave({ flags: ["a", "b"] });
    const { save: next } = applyEffects(save, [{ type: "clearFlag", flag: "a" }]);
    expect(next.flags).toEqual(["b"]);
  });

  it("startQuest sets an active quest, and completeQuest finalizes it with an outcome", () => {
    const save = makeSave();
    const { save: started } = applyEffects(save, [{ type: "startQuest", questId: "ea-q-daichi-leak" }]);
    expect(started.quests[0]).toMatchObject({ questId: "ea-q-daichi-leak", state: "active" });

    const { save: completed } = applyEffects(started, [{ type: "completeQuest", questId: "ea-q-daichi-leak", outcome: "exposed" }]);
    expect(completed.quests[0]).toMatchObject({ questId: "ea-q-daichi-leak", state: "complete", outcome: "exposed" });
    expect(completed.quests).toHaveLength(1);
  });
});

describe("applyEffects: navigation commands", () => {
  it("emits a changeLocation command instead of mutating location directly", () => {
    const save = makeSave();
    const { commands } = applyEffects(save, [{ type: "changeLocation", mapId: "ea-map-classroom", spawnId: "fromHallway" }]);
    expect(commands).toEqual([{ type: "changeLocation", mapId: "ea-map-classroom", spawnId: "fromHallway" }]);
  });

  it("emits a goToScene command", () => {
    const save = makeSave();
    const { commands } = applyEffects(save, [{ type: "goToScene", sceneId: "ea-scene-chapter-decision" }]);
    expect(commands).toEqual([{ type: "goToScene", sceneId: "ea-scene-chapter-decision", nodeId: undefined }]);
  });

  it("applies non-navigation effects in the same batch as a navigation command", () => {
    const save = makeSave();
    const effects: Effect[] = [{ type: "setFlag", flag: "exam-complete" }, { type: "triggerBattle", encounterId: "ai-enc-boss1" }];
    const { save: next, commands } = applyEffects(save, effects);
    expect(next.flags).toContain("exam-complete");
    expect(commands).toEqual([{ type: "triggerBattle", encounterId: "ai-enc-boss1" }]);
  });
});
