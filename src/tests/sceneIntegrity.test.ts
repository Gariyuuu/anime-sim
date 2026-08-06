import { describe, it, expect } from "vitest";
import { scenes } from "@/content/registry";

// Regression guard for a real, previously-shipped bug: `node.conditions` is only ever evaluated
// by `resolveSceneEntry()` when the node's id appears in that scene's `altEntryNodes` list. A node
// reached via `next:` chaining (or as a scene's plain `startNode`) with a non-empty `conditions`
// array is dead code that silently never branches — see gameStore.ts's `resolveSceneEntry` doc
// comment. Any conditional mid-scene branching must go through a separate scene entered via a
// `goToScene` effect instead.
describe("scene content: node.conditions are only meaningful on altEntryNodes candidates", () => {
  it("has no node with non-empty conditions outside its scene's altEntryNodes list", () => {
    const offenders: string[] = [];
    for (const scene of scenes) {
      const altEntrySet = new Set(scene.altEntryNodes);
      for (const node of scene.nodes) {
        if (node.conditions.length > 0 && !altEntrySet.has(node.id)) {
          offenders.push(`${scene.id} -> node "${node.id}"`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("every altEntryNodes id and every next/goTo target actually resolves to a node in the same scene", () => {
    const offenders: string[] = [];
    for (const scene of scenes) {
      const nodeIds = new Set(scene.nodes.map((n) => n.id));
      for (const altId of scene.altEntryNodes) {
        if (!nodeIds.has(altId)) offenders.push(`${scene.id}: altEntryNodes references missing node "${altId}"`);
      }
      for (const node of scene.nodes) {
        if (node.next && !nodeIds.has(node.next)) offenders.push(`${scene.id}: node "${node.id}" next -> missing node "${node.next}"`);
        for (const choice of node.choices) {
          if (choice.goTo && !nodeIds.has(choice.goTo)) offenders.push(`${scene.id}: node "${node.id}" choice "${choice.id}" goTo -> missing node "${choice.goTo}"`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
