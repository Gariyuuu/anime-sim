import type { Interactable, MapDefinition } from "@/types";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function rectIntersectsWalls(rect: Rect, walls: Array<[number, number]>, tileSize: number): boolean {
  const minTx = Math.floor(rect.x / tileSize);
  const maxTx = Math.floor((rect.x + rect.w) / tileSize);
  const minTy = Math.floor(rect.y / tileSize);
  const maxTy = Math.floor((rect.y + rect.h) / tileSize);
  for (const [wx, wy] of walls) {
    if (wx >= minTx && wx <= maxTx && wy >= minTy && wy <= maxTy) return true;
  }
  return false;
}

export function clampCamera(playerX: number, playerY: number, mapWidthPx: number, mapHeightPx: number, viewW: number, viewH: number): { x: number; y: number } {
  let x = playerX - viewW / 2;
  let y = playerY - viewH / 2;
  x = Math.max(0, Math.min(x, Math.max(0, mapWidthPx - viewW)));
  y = Math.max(0, Math.min(y, Math.max(0, mapHeightPx - viewH)));
  return { x, y };
}

export function nearestInteractable(
  playerCenterX: number,
  playerCenterY: number,
  interactables: Interactable[],
  tileSize: number,
  maxDistPx: number,
  unlockedFlags: string[] = [],
): Interactable | null {
  let best: Interactable | null = null;
  let bestDist = Infinity;
  for (const it of interactables) {
    // `hidden` items intentionally stay reachable here (no visible marker, but findable by
    // walking near them and pressing interact) — only flag-gating actually blocks discovery.
    if (it.requiresFlag && !unlockedFlags.includes(it.requiresFlag)) continue;
    const cx = it.x * tileSize + tileSize / 2;
    const cy = it.y * tileSize + tileSize / 2;
    const dist = Math.hypot(cx - playerCenterX, cy - playerCenterY);
    if (dist < maxDistPx && dist < bestDist) {
      best = it;
      bestDist = dist;
    }
  }
  return best;
}

export interface DoorEdge {
  mapId: string;
  interactableId: string;
  targetMapId: string;
}

/** Adjacency list (by source map id) of every door/transition interactable in a world, used by
 * `nextDoorTowardMap` to route the guidance system toward an off-map target. */
export function buildDoorGraph(maps: MapDefinition[]): Map<string, DoorEdge[]> {
  const graph = new Map<string, DoorEdge[]>();
  for (const map of maps) {
    for (const it of map.interactables) {
      if ((it.kind !== "door" && it.kind !== "transition") || !it.targetMapId) continue;
      const edges = graph.get(map.id) ?? [];
      edges.push({ mapId: map.id, interactableId: it.id, targetMapId: it.targetMapId });
      graph.set(map.id, edges);
    }
  }
  return graph;
}

/** BFS shortest path from `fromMapId` to `targetMapId`; returns the first-hop door edge to walk
 * through right now, or `undefined` if they're the same map or no path exists. */
export function nextDoorTowardMap(fromMapId: string, targetMapId: string, graph: Map<string, DoorEdge[]>): DoorEdge | undefined {
  if (fromMapId === targetMapId) return undefined;
  const visited = new Set<string>([fromMapId]);
  const queue: { mapId: string; firstHop: DoorEdge }[] = (graph.get(fromMapId) ?? []).map((edge) => ({ mapId: edge.targetMapId, firstHop: edge }));
  for (const entry of queue) visited.add(entry.mapId);
  let head = 0;
  while (head < queue.length) {
    const { mapId, firstHop } = queue[head++];
    if (mapId === targetMapId) return firstHop;
    for (const edge of graph.get(mapId) ?? []) {
      if (visited.has(edge.targetMapId)) continue;
      visited.add(edge.targetMapId);
      queue.push({ mapId: edge.targetMapId, firstHop });
    }
  }
  return undefined;
}

export interface MoveInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export function directionFromInput(input: MoveInput): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (dx !== 0 && dy !== 0) {
    const norm = Math.SQRT1_2;
    dx *= norm;
    dy *= norm;
  }
  return { dx, dy };
}
