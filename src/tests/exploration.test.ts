import { describe, it, expect } from "vitest";
import { buildDoorGraph, nextDoorTowardMap } from "@/engine/exploration";
import type { MapDefinition } from "@/types";

function map(id: string, doors: Array<{ id: string; targetMapId: string }>): MapDefinition {
  return {
    id,
    worldId: "aincrad",
    name: id,
    widthTiles: 10,
    heightTiles: 10,
    tileSize: 32,
    background: "#fff",
    wallColor: "#000",
    walls: [],
    spawns: { default: [1, 1] },
    defaultSpawn: "default",
    interactables: doors.map((d) => ({
      id: d.id,
      kind: "door",
      x: 0,
      y: 0,
      label: d.id,
      targetMapId: d.targetMapId,
      respawns: true,
      hidden: false,
      glyph: "circle",
    })),
    arrivalEffects: [],
    sceneType: "generic",
  };
}

describe("buildDoorGraph / nextDoorTowardMap", () => {
  const maps = [
    map("a", [{ id: "door-a-b", targetMapId: "b" }]),
    map("b", [
      { id: "door-b-a", targetMapId: "a" },
      { id: "door-b-c", targetMapId: "c" },
    ]),
    map("c", [{ id: "door-c-b", targetMapId: "b" }]),
    map("isolated", []),
  ];
  const graph = buildDoorGraph(maps);

  it("returns the direct door for a 1-hop path", () => {
    const hop = nextDoorTowardMap("a", "b", graph);
    expect(hop?.interactableId).toBe("door-a-b");
  });

  it("returns the first-hop door for a multi-hop path", () => {
    const hop = nextDoorTowardMap("a", "c", graph);
    expect(hop?.interactableId).toBe("door-a-b");
  });

  it("returns undefined for the same map", () => {
    expect(nextDoorTowardMap("a", "a", graph)).toBeUndefined();
  });

  it("returns undefined when no path exists", () => {
    expect(nextDoorTowardMap("a", "isolated", graph)).toBeUndefined();
  });
});
