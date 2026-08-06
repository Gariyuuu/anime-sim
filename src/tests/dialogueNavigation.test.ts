import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "@/state/gameStore";
import { makeSave } from "./fixtures";

// Regression coverage for a real bug: a dialogue node whose own `effects` include a navigation
// command (changeLocation/triggerBattle/goToScene) used to navigate away *immediately* on entry,
// so the node's own text never had a chance to display. The fix defers navigation until the
// player actually advances past the node (`leaveCurrentNode`), via `pendingNodeNavigation`.

describe("node-level navigation effects are deferred until the player advances", () => {
  beforeEach(() => {
    useGameStore.setState({ save: null, combat: null, pendingNodeNavigation: null });
  });

  it("keeps the node displayed (mode: dialogue) when its own effects include changeLocation", () => {
    const save = makeSave({ currentChapterId: "ea-ch1" });
    useGameStore.setState({ save });

    // ea-scene-arrival's node "n3" has a changeLocation effect directly on the node.
    useGameStore.getState()._settleAtNode(save, "ea-scene-arrival", "n3");

    const state = useGameStore.getState();
    expect(state.save?.mode).toBe("dialogue");
    expect(state.save?.currentSceneId).toBe("ea-scene-arrival");
    expect(state.save?.currentNodeId).toBe("n3");
    expect(state.pendingNodeNavigation).not.toBeNull();
    expect(state.pendingNodeNavigation?.[0]).toMatchObject({ type: "changeLocation", mapId: "ea-map-classroom" });
  });

  it("fires the deferred navigation only once the player leaves the node", () => {
    const save = makeSave({ currentChapterId: "ea-ch1" });
    useGameStore.setState({ save });
    useGameStore.getState()._settleAtNode(save, "ea-scene-arrival", "n3");

    // still on the node, not yet navigated
    expect(useGameStore.getState().save?.mode).toBe("dialogue");

    useGameStore.getState().leaveCurrentNode();

    const state = useGameStore.getState();
    expect(state.save?.mode).toBe("exploration");
    expect(state.save?.currentMapId).toBe("ea-map-classroom");
    expect(state.pendingNodeNavigation).toBeNull();
  });

  it("applies the node's non-navigation effects (flags) immediately, before the deferred nav fires", () => {
    const save = makeSave({ currentChapterId: "ea-ch1", flags: [] });
    useGameStore.setState({ save });
    useGameStore.getState()._settleAtNode(save, "ea-scene-arrival", "n2"); // sets ea-flag-arrived, has `next`, no nav effect

    expect(useGameStore.getState().save?.flags).toContain("ea-flag-arrived");
  });

  it("clears any stale pending navigation when settling into a node with none", () => {
    const save = makeSave({ currentChapterId: "ea-ch1" });
    useGameStore.setState({ save });
    useGameStore.getState()._settleAtNode(save, "ea-scene-arrival", "n3");
    expect(useGameStore.getState().pendingNodeNavigation).not.toBeNull();

    const save2 = useGameStore.getState().save!;
    useGameStore.getState()._settleAtNode(save2, "ea-scene-arase-intro", "n1"); // no nav effect on this node
    expect(useGameStore.getState().pendingNodeNavigation).toBeNull();
  });
});

describe("resolveSceneEntry: multi-branch chapter scenes", () => {
  it("ch7's Daichi-aftermath scene routes to the right branch per prior chapter-1 outcome flag", async () => {
    const { resolveSceneEntry } = await import("@/state/gameStore");
    const reported = makeSave({ flags: ["ea-flag-daichi-reported"] });
    expect(resolveSceneEntry("ea-scene-ch7-daichi-consequence", reported)).toBe("reported");

    const leveraged = makeSave({ flags: ["ea-flag-daichi-leveraged"] });
    expect(resolveSceneEntry("ea-scene-ch7-daichi-consequence", leveraged)).toBe("leveraged");

    const neither = makeSave({ flags: [] });
    expect(resolveSceneEntry("ea-scene-ch7-daichi-consequence", neither)).toBe("default");
  });

  it("ch6's Rei scene falls back when the player never noticed her hidden secret", async () => {
    const { resolveSceneEntry } = await import("@/state/gameStore");
    const noticed = makeSave({ flags: ["ea-flag-noticed-rei-discrepancy"] });
    expect(resolveSceneEntry("ea-scene-ch6-rei-risk", noticed)).toBe("n1");

    const missed = makeSave({ flags: [] });
    expect(resolveSceneEntry("ea-scene-ch6-rei-risk", missed)).toBe("fallback");
  });
});
