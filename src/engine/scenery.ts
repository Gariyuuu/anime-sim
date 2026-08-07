import type { MapDefinition } from "@/types";
import { hashString, mulberry32 } from "@/lib/utils";

export type PropKind =
  | "tree"
  | "bush"
  | "rock"
  | "tall-grass"
  | "window-glow"
  | "lamppost"
  | "planter"
  | "crate"
  | "banner"
  | "torch"
  | "pillar"
  | "desk"
  | "bookshelf"
  | "bench"
  | "fountain";

export interface Prop {
  kind: PropKind;
  x: number;
  y: number;
  scale: number;
  variant: number;
  wallMounted?: boolean;
}

interface SceneConfig {
  mode: "scatter" | "grid";
  floorProps: PropKind[];
  floorDensity: number;
  wallProps?: PropKind[];
  wallDensity?: number;
}

const SCENE_CONFIG: Record<MapDefinition["sceneType"], SceneConfig> = {
  forest: { mode: "scatter", floorProps: ["tree", "tree", "tree", "bush", "rock", "tall-grass"], floorDensity: 0.16 },
  dungeon: { mode: "scatter", floorProps: ["pillar", "rock"], floorDensity: 0.05, wallProps: ["torch"], wallDensity: 0.15 },
  boss: { mode: "scatter", floorProps: ["pillar"], floorDensity: 0.03, wallProps: ["torch"], wallDensity: 0.12 },
  courtyard: { mode: "scatter", floorProps: ["tree", "bench", "planter", "fountain"], floorDensity: 0.09 },
  town: { mode: "scatter", floorProps: ["planter", "crate", "lamppost", "banner"], floorDensity: 0.05, wallProps: ["window-glow"], wallDensity: 0.18 },
  classroom: { mode: "grid", floorProps: ["desk"], floorDensity: 0 },
  library: { mode: "grid", floorProps: ["bookshelf"], floorDensity: 0 },
  gym: { mode: "grid", floorProps: ["bench"], floorDensity: 0 },
  cafeteria: { mode: "grid", floorProps: ["desk"], floorDensity: 0 },
  dorm: { mode: "scatter", floorProps: ["crate", "planter"], floorDensity: 0.04 },
  shop: { mode: "scatter", floorProps: ["crate", "planter"], floorDensity: 0.05 },
  generic: { mode: "scatter", floorProps: ["crate", "planter"], floorDensity: 0.02 },
};

/** Deterministically scatters cosmetic props across a map's open floor (and, for some scene
 * types, its walls) so rooms read as an actual place instead of a flat color. Pure function of
 * the map's own data — seeded off `hashString(map.id)`, so the same map always produces the same
 * layout across re-renders without ever calling `Math.random()`. Purely visual: props never
 * affect collision (`engine/exploration.ts`'s wall-collision check is untouched by this). */
export function generateScenery(map: MapDefinition, maxProps = 48): Prop[] {
  const config = SCENE_CONFIG[map.sceneType];
  const rng = mulberry32(hashString(map.id));
  const props: Prop[] = [];

  const occupied = new Set<string>();
  for (const [wx, wy] of map.walls) occupied.add(`${wx},${wy}`);
  const reserve = (cx: number, cy: number, radius: number) => {
    for (let dx = -radius; dx <= radius; dx++) for (let dy = -radius; dy <= radius; dy++) occupied.add(`${cx + dx},${cy + dy}`);
  };
  // Only the interactable's own tile, not a padded buffer — some maps (the classroom especially)
  // pack 40+ interactables into one small room, and a 3x3 buffer per marker used to reserve the
  // entire floor, leaving zero space for any prop at all. A prop sharing a tile with a marker is
  // fine visually (the marker div renders on top of the canvas anyway).
  for (const it of map.interactables) reserve(it.x, it.y, 0);
  // The player's spawn point still gets a small buffer so they don't spawn standing inside a tree.
  for (const spawn of Object.values(map.spawns)) reserve(spawn[0], spawn[1], 1);

  if (config.wallProps?.length && config.wallDensity) {
    for (const [wx, wy] of map.walls) {
      if (props.length >= maxProps) break;
      if (rng() > config.wallDensity) continue;
      const kind = config.wallProps[Math.floor(rng() * config.wallProps.length)];
      props.push({ kind, x: wx, y: wy, scale: 1, variant: Math.floor(rng() * 3), wallMounted: true });
    }
  }

  if (config.mode === "grid") {
    for (let ty = 2; ty < map.heightTiles - 2 && props.length < maxProps; ty += 2) {
      for (let tx = 2; tx < map.widthTiles - 2 && props.length < maxProps; tx += 2) {
        if (occupied.has(`${tx},${ty}`)) continue;
        if (rng() > 0.7) continue;
        const kind = config.floorProps[Math.floor(rng() * config.floorProps.length)];
        props.push({ kind, x: tx, y: ty, scale: 0.9 + rng() * 0.2, variant: Math.floor(rng() * 3) });
      }
    }
    return props;
  }

  for (let ty = 1; ty < map.heightTiles - 1 && props.length < maxProps; ty++) {
    for (let tx = 1; tx < map.widthTiles - 1 && props.length < maxProps; tx++) {
      if (occupied.has(`${tx},${ty}`)) continue;
      if (rng() > config.floorDensity) continue;
      const kind = config.floorProps[Math.floor(rng() * config.floorProps.length)];
      props.push({ kind, x: tx + (rng() - 0.5) * 0.4, y: ty + (rng() - 0.5) * 0.4, scale: 0.85 + rng() * 0.3, variant: Math.floor(rng() * 3) });
    }
  }
  return props;
}
