import { describe, it, expect } from "vitest";
import { generateScenery } from "@/engine/scenery";
import type { MapDefinition } from "@/types";

function forestMap(overrides: Partial<MapDefinition> = {}): MapDefinition {
  return {
    id: "test-forest",
    worldId: "aincrad",
    name: "Test Forest",
    widthTiles: 20,
    heightTiles: 14,
    tileSize: 32,
    background: "#fff",
    wallColor: "#000",
    walls: [
      ...Array.from({ length: 20 }, (_, x) => [x, 0] as [number, number]),
      ...Array.from({ length: 20 }, (_, x) => [x, 13] as [number, number]),
      ...Array.from({ length: 14 }, (_, y) => [0, y] as [number, number]),
      ...Array.from({ length: 14 }, (_, y) => [19, y] as [number, number]),
    ],
    spawns: { default: [10, 7] },
    defaultSpawn: "default",
    interactables: [{ id: "npc-1", kind: "npc", x: 5, y: 5, label: "Someone", respawns: true, hidden: false, glyph: "circle" }],
    arrivalEffects: [],
    sceneType: "forest",
    ...overrides,
  };
}

describe("generateScenery", () => {
  it("is deterministic — same map produces identical output", () => {
    const map = forestMap();
    expect(generateScenery(map)).toEqual(generateScenery(map));
  });

  it("never places a prop on a wall tile", () => {
    const map = forestMap();
    const wallSet = new Set(map.walls.map(([x, y]) => `${x},${y}`));
    for (const prop of generateScenery(map)) {
      expect(wallSet.has(`${Math.round(prop.x)},${Math.round(prop.y)}`)).toBe(false);
    }
  });

  it("never places a prop outside the map bounds", () => {
    const map = forestMap();
    for (const prop of generateScenery(map)) {
      expect(prop.x).toBeGreaterThanOrEqual(0);
      expect(prop.x).toBeLessThanOrEqual(map.widthTiles);
      expect(prop.y).toBeGreaterThanOrEqual(0);
      expect(prop.y).toBeLessThanOrEqual(map.heightTiles);
    }
  });

  it("produces grid-aligned furniture (no jitter) for classroom scene type", () => {
    const map = forestMap({ sceneType: "classroom" });
    const props = generateScenery(map);
    for (const prop of props) {
      expect(Number.isInteger(prop.x)).toBe(true);
      expect(Number.isInteger(prop.y)).toBe(true);
    }
  });

  it("respects maxProps", () => {
    const map = forestMap();
    expect(generateScenery(map, 5).length).toBeLessThanOrEqual(5);
  });
});
