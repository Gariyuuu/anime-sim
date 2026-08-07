import { describe, it, expect } from "vitest";
import { guidance, OBJECTIVE_TARGETS } from "@/content/guidance";
import { getMap, getChapter } from "@/content/registry";

describe("guidance content integrity", () => {
  it("every chapterId in the guidance table resolves to a real chapter", () => {
    for (const g of guidance) {
      expect(getChapter(g.chapterId), `unknown chapter ${g.chapterId}`).toBeDefined();
    }
  });

  it("every step's targetMapId/targetInteractableId resolves against the real content", () => {
    for (const g of guidance) {
      for (const step of g.steps) {
        const map = getMap(step.targetMapId);
        expect(map, `${g.chapterId}/${step.id}: unknown map ${step.targetMapId}`).toBeDefined();
        if (step.targetInteractableId) {
          const found = map?.interactables.some((it) => it.id === step.targetInteractableId);
          expect(found, `${g.chapterId}/${step.id}: interactable ${step.targetInteractableId} not found on ${step.targetMapId}`).toBe(true);
        }
      }
    }
  });

  it("every OBJECTIVE_TARGETS entry resolves against the real content", () => {
    for (const [questId, objectives] of Object.entries(OBJECTIVE_TARGETS)) {
      for (const [objectiveId, target] of Object.entries(objectives)) {
        const map = getMap(target.mapId);
        expect(map, `${questId}/${objectiveId}: unknown map ${target.mapId}`).toBeDefined();
        if (target.interactableId) {
          const found = map?.interactables.some((it) => it.id === target.interactableId);
          expect(found, `${questId}/${objectiveId}: interactable ${target.interactableId} not found on ${target.mapId}`).toBe(true);
        }
      }
    }
  });
});
