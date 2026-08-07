"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { getMap, getNpc, maps } from "@/content/registry";
import { rectIntersectsWalls, clampCamera, nearestInteractable, directionFromInput, buildDoorGraph, nextDoorTowardMap, type MoveInput } from "@/engine/exploration";
import { getGuidanceTarget } from "@/lib/guidance";
import { generateScenery, type Prop } from "@/engine/scenery";
import { Icon } from "@/components/ui/Icon";
import { HUD } from "@/components/game/HUD";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import { PortraitFace } from "@/components/game/PortraitFace";
import { cn, hashString, shadeColor } from "@/lib/utils";
import type { Interactable } from "@/types";

// Static for the app's lifetime (content never changes at runtime) — build once, not per render.
const DOOR_GRAPH = buildDoorGraph(maps);

const PLAYER_SIZE = 20;
const SPEED = 150; // px/sec
const INTERACT_RANGE = 46;
const MIN_VIEW_W = 320;
const MIN_VIEW_H = 240;

const MAX_ZOOM = 2.2;

/** A deterministic, mottled per-tile tone — replaces a strict alternating checker (which reads
 * as an obvious, rigid "grid of blocks" no matter what's drawn on top of it) with an organic
 * blotchy variation, like natural ground/flooring texture rather than a spreadsheet. Seeded by
 * map id + tile coords, so it's stable across re-renders without needing to store anything. */
function floorTileTone(background: string, mapId: string, tx: number, ty: number): string {
  const h1 = hashString(`${mapId}:${tx}:${ty}`) / 0xffffffff;
  const h2 = hashString(`${mapId}:${tx + 1}:${ty - 1}:b`) / 0xffffffff;
  // Blend two offset hashes so neighboring tiles correlate loosely (soft patches of tone)
  // instead of every tile being fully independent noise (which reads as static/grain).
  const blended = h1 * 0.65 + h2 * 0.35;
  const percent = (blended - 0.5) * 14; // +/-7%
  return shadeColor(background, percent);
}

// Module-level cache so a background image is only ever loaded once, not re-fetched every time
// its map is re-entered. `onLoad` is called once the image is ready, to trigger a repaint.
const imageCache = new Map<string, HTMLImageElement>();
function getCachedImage(url: string, onLoad: () => void): HTMLImageElement | undefined {
  const cached = imageCache.get(url);
  if (cached) return cached.complete ? cached : undefined;
  const img = new Image();
  img.onload = onLoad;
  img.src = url;
  imageCache.set(url, img);
  return undefined;
}

const VARIANT_TONES = ["#4a7a3a", "#3f6a30", "#588a45"];

/** Draws one procedurally-scattered scenery prop, in a coordinate space already translated so
 * (0,0) is the prop's tile-center and scaled to a `ts`-pixel tile — every primitive below is
 * written in that local space, then `drawProp` restores the transform. Purely decorative: never
 * consulted for collision. `now` (ms) drives the torch flicker; everything else is static per
 * prop (its `variant`/`scale` already bake in all the per-prop randomness). */
function drawProp(ctx: CanvasRenderingContext2D, prop: Prop, ts: number, now: number) {
  const s = ts * prop.scale;
  const tone = VARIANT_TONES[prop.variant % VARIANT_TONES.length];
  switch (prop.kind) {
    case "tree": {
      ctx.fillStyle = "#5a4028";
      ctx.fillRect(-s * 0.06, -s * 0.1, s * 0.12, s * 0.4);
      ctx.fillStyle = shadeColor(tone, prop.variant * 4 - 4);
      for (const [dx, dy, r] of [
        [0, -s * 0.55, s * 0.34],
        [-s * 0.2, -s * 0.35, s * 0.26],
        [s * 0.2, -s * 0.4, s * 0.28],
      ] as const) {
        ctx.beginPath();
        ctx.arc(dx, dy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "bush": {
      ctx.fillStyle = shadeColor(tone, 6);
      ctx.beginPath();
      ctx.arc(-s * 0.16, -s * 0.06, s * 0.22, 0, Math.PI * 2);
      ctx.arc(s * 0.14, -s * 0.02, s * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "rock": {
      ctx.fillStyle = "#8a8478";
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.24, s * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6e6a5e";
      ctx.beginPath();
      ctx.ellipse(-s * 0.06, s * 0.03, s * 0.13, s * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "tall-grass": {
      ctx.strokeStyle = shadeColor(tone, 10);
      ctx.lineWidth = Math.max(1, s * 0.03);
      for (const dx of [-s * 0.12, 0, s * 0.12]) {
        ctx.beginPath();
        ctx.moveTo(dx, s * 0.14);
        ctx.quadraticCurveTo(dx + s * 0.04, -s * 0.05, dx, -s * 0.2);
        ctx.stroke();
      }
      break;
    }
    case "window-glow": {
      ctx.fillStyle = "rgba(255, 214, 140, 0.55)";
      ctx.fillRect(-s * 0.2, -s * 0.22, s * 0.4, s * 0.32);
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = Math.max(1, s * 0.025);
      ctx.strokeRect(-s * 0.2, -s * 0.22, s * 0.4, s * 0.32);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.22);
      ctx.lineTo(0, s * 0.1);
      ctx.moveTo(-s * 0.2, -s * 0.06);
      ctx.lineTo(s * 0.2, -s * 0.06);
      ctx.stroke();
      break;
    }
    case "lamppost": {
      ctx.fillStyle = "#2a2a28";
      ctx.fillRect(-s * 0.03, -s * 0.05, s * 0.06, s * 0.4);
      ctx.fillStyle = "rgba(255, 220, 150, 0.85)";
      ctx.beginPath();
      ctx.arc(0, -s * 0.14, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "planter": {
      ctx.fillStyle = "#6a4a30";
      ctx.fillRect(-s * 0.18, -s * 0.05, s * 0.36, s * 0.16);
      ctx.fillStyle = shadeColor(tone, 8);
      ctx.beginPath();
      ctx.arc(-s * 0.08, -s * 0.08, s * 0.1, 0, Math.PI * 2);
      ctx.arc(s * 0.08, -s * 0.1, s * 0.09, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "crate": {
      ctx.fillStyle = "#8a6a3f";
      ctx.fillRect(-s * 0.2, -s * 0.2, s * 0.4, s * 0.4);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = Math.max(1, s * 0.025);
      ctx.strokeRect(-s * 0.2, -s * 0.2, s * 0.4, s * 0.4);
      ctx.beginPath();
      ctx.moveTo(-s * 0.2, -s * 0.2);
      ctx.lineTo(s * 0.2, s * 0.2);
      ctx.moveTo(s * 0.2, -s * 0.2);
      ctx.lineTo(-s * 0.2, s * 0.2);
      ctx.stroke();
      break;
    }
    case "banner": {
      ctx.fillStyle = shadeColor("#8a3a3a", prop.variant * 6);
      ctx.fillRect(-s * 0.1, -s * 0.3, s * 0.2, s * 0.5);
      break;
    }
    case "torch": {
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(-s * 0.03, -s * 0.1, s * 0.06, s * 0.2);
      const flicker = 0.75 + 0.25 * Math.sin(now / 140 + prop.x * 3);
      ctx.fillStyle = `rgba(255, ${Math.round(140 * flicker)}, 60, ${0.6 + 0.3 * flicker})`;
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.18 * flicker, s * 0.07, s * 0.12 * flicker, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "pillar": {
      ctx.fillStyle = "#5a5a52";
      ctx.fillRect(-s * 0.14, -s * 0.5, s * 0.28, s * 0.9);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(-s * 0.14, -s * 0.5, s * 0.06, s * 0.9);
      break;
    }
    case "fountain": {
      ctx.fillStyle = "#8a8478";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6f9fb8";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5a5a52";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "desk":
    case "bookshelf":
    case "bench": {
      const w = prop.kind === "bookshelf" ? s * 0.5 : s * 0.4;
      const h = prop.kind === "bookshelf" ? s * 0.2 : s * 0.28;
      const base = prop.kind === "bookshelf" ? "#6a4a30" : prop.kind === "bench" ? "#7a5f3a" : "#9a8a6a";
      ctx.fillStyle = base;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = Math.max(1, s * 0.02);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      if (prop.kind === "bookshelf") {
        ctx.fillStyle = shadeColor(base, prop.variant % 2 === 0 ? 20 : -15);
        ctx.fillRect(-w / 2 + s * 0.03, -h / 2 + s * 0.03, w - s * 0.06, h * 0.35);
      }
      break;
    }
  }
}

/** Picks a zoom level that fits the room to however much space the view actually has (never
 * shrinking below 1x), then returns the camera position in world units for that zoom — small
 * rooms fill the screen instead of sitting tiny in a corner of an otherwise-empty canvas. */
function computeCameraAndZoom(
  mapWidthTiles: number,
  mapHeightTiles: number,
  tileSize: number,
  posX: number,
  posY: number,
  viewW: number,
  viewH: number,
) {
  const mapPxW = mapWidthTiles * tileSize;
  const mapPxH = mapHeightTiles * tileSize;
  const zoom = Math.min(MAX_ZOOM, Math.max(1, Math.min(viewW / mapPxW, viewH / mapPxH)));
  const worldViewW = viewW / zoom;
  const worldViewH = viewH / zoom;
  const raw = clampCamera(posX, posY, mapPxW, mapPxH, worldViewW, worldViewH);
  const x = mapPxW <= worldViewW ? (mapPxW - worldViewW) / 2 : raw.x;
  const y = mapPxH <= worldViewH ? (mapPxH - worldViewH) / 2 : raw.y;
  return { zoom, camera: { x, y } };
}

export const MARKER_COLOR: Record<Interactable["kind"], string> = {
  npc: "var(--ink-700)",
  monster: "#d6453a",
  object: "#b8842e",
  door: "#4f7fc4",
  transition: "#4f7fc4",
  "quest-marker": "#c73f6a",
  "hidden-item": "#3f9fc7",
  shop: "#2f8f6f",
  trigger: "#7a5fc7",
  "puzzle-switch": "#8a8a86",
  arena: "#c74a1f",
};

export function ExplorationView() {
  const save = useGameStore((s) => s.save);
  const interact = useGameStore((s) => s.interact);
  const toggleDevice = useGameStore((s) => s.toggleDevice);

  const map = save?.currentMapId ? getMap(save.currentMapId) : undefined;
  const spawn = useMemo(() => {
    if (!map) return [0, 0] as [number, number];
    const s = map.spawns[save?.currentSpawnId ?? map.defaultSpawn] ?? map.spawns[map.defaultSpawn];
    return s;
  }, [map, save?.currentSpawnId]);
  // Procedural scenery (trees/furniture/etc) — computed once per map, not per render tick, since
  // the RNG scan is more than trivially cheap. Skipped entirely when `backgroundImageUrl` is set.
  const sceneProps = useMemo(() => (map && !map.backgroundImageUrl ? generateScenery(map) : []), [map]);

  const [pos, setPos] = useState({ x: (spawn?.[0] ?? 0) * (map?.tileSize ?? 32) + (map?.tileSize ?? 32) / 2, y: (spawn?.[1] ?? 0) * (map?.tileSize ?? 32) + (map?.tileSize ?? 32) / 2 });
  const posRef = useRef(pos);
  const keysRef = useRef<MoveInput>({ up: false, down: false, left: false, right: false });
  const clickTargetRef = useRef<{ x: number; y: number } | null>(null);
  const flagsRef = useRef<string[]>(save?.flags ?? []);
  const [walking, setWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewSize, setViewSize] = useState({ w: MIN_VIEW_W, h: MIN_VIEW_H });
  const viewSizeRef = useRef(viewSize);
  const [, forceTick] = useState(0);
  const [compassVisible, setCompassVisible] = useState(false);
  const compassTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showCompass = useCallback(() => {
    setCompassVisible(true);
    if (compassTimeoutRef.current) clearTimeout(compassTimeoutRef.current);
    compassTimeoutRef.current = setTimeout(() => setCompassVisible(false), 4000);
  }, []);
  useEffect(() => () => { if (compassTimeoutRef.current) clearTimeout(compassTimeoutRef.current); }, []);

  // Keep ref mirrors of state the rAF loop reads without re-subscribing to, in sync.
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);
  useEffect(() => {
    flagsRef.current = save?.flags ?? [];
  }, [save?.flags]);
  useEffect(() => {
    viewSizeRef.current = viewSize;
  }, [viewSize]);

  // Fill whatever space the layout actually gives this view, instead of a fixed-size box —
  // tracks the container's real dimensions so the canvas and camera math stay in sync with it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function update() {
      const rect = el!.getBoundingClientRect();
      setViewSize({ w: Math.max(MIN_VIEW_W, Math.floor(rect.width)), h: Math.max(MIN_VIEW_H, Math.floor(rect.height)) });
    }
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset player position when the map changes. Adjusted during render (React's documented
  // pattern for "state that depends on a changing prop") rather than in an effect, since this
  // must happen before the canvas paints the old position on the new map.
  const [lastMapId, setLastMapId] = useState(save?.currentMapId);
  if (save?.currentMapId !== lastMapId) {
    setLastMapId(save?.currentMapId);
    if (map && spawn) {
      setPos({ x: spawn[0] * map.tileSize + map.tileSize / 2, y: spawn[1] * map.tileSize + map.tileSize / 2 });
    }
  }

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === "w" || e.key === "ArrowUp") keysRef.current.up = true;
      if (e.key === "s" || e.key === "ArrowDown") keysRef.current.down = true;
      if (e.key === "a" || e.key === "ArrowLeft") keysRef.current.left = true;
      if (e.key === "d" || e.key === "ArrowRight") keysRef.current.right = true;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (nearbyId) interact(nearbyId);
      }
      if (e.key.toLowerCase() === "i" || e.key === "Escape") toggleDevice();
      if (e.key.toLowerCase() === "g") showCompass();
    }
    function up(e: KeyboardEvent) {
      if (e.key === "w" || e.key === "ArrowUp") keysRef.current.up = false;
      if (e.key === "s" || e.key === "ArrowDown") keysRef.current.down = false;
      if (e.key === "a" || e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "d" || e.key === "ArrowRight") keysRef.current.right = false;
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [nearbyId, interact, toggleDevice, showCompass]);

  // main loop
  useEffect(() => {
    if (!map) return;
    const m = map;
    let raf: number;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const input = keysRef.current;
      let { dx, dy } = directionFromInput(input);

      if (dx === 0 && dy === 0 && clickTargetRef.current) {
        const t = clickTargetRef.current;
        const vx = t.x - posRef.current.x;
        const vy = t.y - posRef.current.y;
        const dist = Math.hypot(vx, vy);
        if (dist < 4) {
          clickTargetRef.current = null;
        } else {
          dx = vx / dist;
          dy = vy / dist;
        }
      } else if (dx !== 0 || dy !== 0) {
        clickTargetRef.current = null;
      }

      setWalking(dx !== 0 || dy !== 0);
      if (dx < 0) setFacingLeft(true);
      else if (dx > 0) setFacingLeft(false);

      if (dx !== 0 || dy !== 0) {
        const nx = posRef.current.x + dx * SPEED * dt;
        const ny = posRef.current.y + dy * SPEED * dt;
        const half = PLAYER_SIZE / 2;
        const testX = { x: nx - half, y: posRef.current.y - half, w: PLAYER_SIZE, h: PLAYER_SIZE };
        const testY = { x: posRef.current.x - half, y: ny - half, w: PLAYER_SIZE, h: PLAYER_SIZE };
        const next = { ...posRef.current };
        if (!rectIntersectsWalls(testX, m.walls, m.tileSize)) next.x = nx;
        if (!rectIntersectsWalls(testY, m.walls, m.tileSize)) next.y = ny;
        next.x = Math.max(half, Math.min(m.widthTiles * m.tileSize - half, next.x));
        next.y = Math.max(half, Math.min(m.heightTiles * m.tileSize - half, next.y));
        posRef.current = next;
        setPos(next);
      }

      const near = nearestInteractable(posRef.current.x, posRef.current.y, m.interactables, m.tileSize, INTERACT_RANGE, flagsRef.current);
      setNearbyId((prev) => {
        const nextId = near?.id ?? null;
        return prev === nextId ? prev : nextId;
      });

      forceTick((t) => (t + 1) % 100000);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [map]);

  // canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w: VIEW_W, h: VIEW_H } = viewSize;
    const { zoom, camera } = computeCameraAndZoom(map.widthTiles, map.heightTiles, map.tileSize, pos.x, pos.y, VIEW_W, VIEW_H);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = map.background;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.save();
    ctx.scale(zoom, zoom);
    const worldViewW = VIEW_W / zoom;
    const worldViewH = VIEW_H / zoom;
    const ts = map.tileSize;
    const wallSet = new Set(map.walls.map(([wx, wy]) => `${wx},${wy}`));
    const now = performance.now();

    const bgImage = map.backgroundImageUrl ? getCachedImage(map.backgroundImageUrl, () => forceTick((t) => (t + 1) % 100000)) : undefined;
    if (bgImage) {
      // Real art override — mirrors the NPC portraitImageUrl pattern. Covers the floor area;
      // procedural scenery is skipped entirely for this map (see the `sceneProps` memo above).
      ctx.drawImage(bgImage, 0, 0, map.widthTiles * ts, map.heightTiles * ts);
    } else {
      // floor: mottled, organic per-tile tone (see floorTileTone) instead of a flat fill or a
      // rigid alternating checker — a strict checker still reads as "a grid of blocks" no matter
      // what's drawn on top of it; this looks like natural ground/flooring variation instead.
      const firstCol = Math.max(0, Math.floor(camera.x / ts) - 1);
      const lastCol = Math.min(map.widthTiles, Math.ceil((camera.x + worldViewW) / ts) + 1);
      const firstRow = Math.max(0, Math.floor(camera.y / ts) - 1);
      const lastRow = Math.min(map.heightTiles, Math.ceil((camera.y + worldViewH) / ts) + 1);
      for (let ty = firstRow; ty < lastRow; ty++) {
        for (let tx = firstCol; tx < lastCol; tx++) {
          if (wallSet.has(`${tx},${ty}`)) continue;
          ctx.fillStyle = floorTileTone(map.background, map.id, tx, ty);
          ctx.fillRect(tx * ts - camera.x, ty * ts - camera.y, ts, ts);
        }
      }

      // fine speckle texture on top — a handful of tiny dots per visible tile, alternating
      // slightly lighter/darker than that tile's own tone, so the floor reads as a textured
      // surface (grass, stone, wood) up close instead of a smooth flat color.
      for (let ty = firstRow; ty < lastRow; ty++) {
        for (let tx = firstCol; tx < lastCol; tx++) {
          if (wallSet.has(`${tx},${ty}`)) continue;
          const seed = hashString(`${map.id}:speck:${tx}:${ty}`);
          const speckCount = 2 + (seed % 3);
          for (let i = 0; i < speckCount; i++) {
            const sx = tx * ts - camera.x + ((seed >> (i * 4 + 1)) % 100) * 0.01 * ts;
            const sy = ty * ts - camera.y + ((seed >> (i * 4 + 5)) % 100) * 0.01 * ts;
            ctx.fillStyle = i % 2 === 0 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)";
            ctx.beginPath();
            ctx.arc(sx, sy, ts * 0.02, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // floor-scattered scenery (trees, furniture, crates, ...) — the actual "real location"
      // upgrade: layered shapes instead of a flat color, deterministically placed per map.
      for (const prop of sceneProps) {
        if (prop.wallMounted) continue;
        ctx.save();
        ctx.translate(prop.x * ts + ts / 2 - camera.x, prop.y * ts + ts / 2 - camera.y);
        drawProp(ctx, prop, ts, now);
        ctx.restore();
      }
    }

    // walls: beveled instead of flat — a lighter top/left edge and a darker bottom/right edge
    // gives each block a slight 3D lift instead of reading as a flat-color rectangle.
    const wallLight = shadeColor(map.wallColor, 22);
    const wallDark = shadeColor(map.wallColor, -22);
    for (const [wx, wy] of map.walls) {
      const px = wx * ts - camera.x;
      const py = wy * ts - camera.y;
      ctx.fillStyle = map.wallColor;
      ctx.fillRect(px, py, ts, ts);
      const bevel = Math.max(2, ts * 0.08);
      ctx.fillStyle = wallLight;
      ctx.fillRect(px, py, ts, bevel);
      ctx.fillRect(px, py, bevel, ts);
      ctx.fillStyle = wallDark;
      ctx.fillRect(px, py + ts - bevel, ts, bevel);
      ctx.fillRect(px + ts - bevel, py, bevel, ts);
    }

    // wall-mounted scenery (windows, torches) — drawn on top of the wall bevels above.
    if (!bgImage) {
      for (const prop of sceneProps) {
        if (!prop.wallMounted) continue;
        ctx.save();
        ctx.translate(prop.x * ts + ts / 2 - camera.x, prop.y * ts + ts / 2 - camera.y);
        drawProp(ctx, prop, ts, now);
        ctx.restore();
      }
    }

    // soft vignette so rooms have a sense of depth/light instead of totally flat, uniform color
    const cx = pos.x - camera.x;
    const cy = pos.y - camera.y;
    const vignetteR = Math.max(worldViewW, worldViewH) * 0.75;
    const vignette = ctx.createRadialGradient(cx, cy, vignetteR * 0.25, cx, cy, vignetteR);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.16)");
    ctx.fillStyle = vignette;
    ctx.fillRect(camera.x, camera.y, worldViewW, worldViewH);

    ctx.restore();
  }, [map, pos, viewSize, sceneProps]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!map) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const { w: VIEW_W, h: VIEW_H } = viewSizeRef.current;
      const { zoom, camera } = computeCameraAndZoom(map.widthTiles, map.heightTiles, map.tileSize, posRef.current.x, posRef.current.y, VIEW_W, VIEW_H);
      const wx = (e.clientX - rect.left) / zoom + camera.x;
      const wy = (e.clientY - rect.top) / zoom + camera.y;
      clickTargetRef.current = { x: wx, y: wy };
    },
    [map],
  );

  if (!map || !save) return null;
  const { w: VIEW_W, h: VIEW_H } = viewSize;
  const { zoom, camera } = computeCameraAndZoom(map.widthTiles, map.heightTiles, map.tileSize, pos.x, pos.y, VIEW_W, VIEW_H);
  const nearby = nearbyId ? map.interactables.find((i) => i.id === nearbyId) : null;

  // Guidance: where the player should go next for their current chapter (see lib/guidance.ts).
  // On-map target -> beacon over that marker below; off-map target -> glow the door that leads
  // toward it, found via BFS over the door graph.
  const guidanceTarget = getGuidanceTarget(save);
  const guidanceDoorHop = guidanceTarget && guidanceTarget.mapId !== map.id ? nextDoorTowardMap(map.id, guidanceTarget.mapId, DOOR_GRAPH) : undefined;

  // Compass overlay (Guide button / "G" key): points at whichever of the above is actually on
  // THIS map right now — the on-map target itself, or the door leading toward an off-map one.
  const compassInteractableId = guidanceTarget?.mapId === map.id ? guidanceTarget.interactableId : guidanceDoorHop?.interactableId;
  const compassInteractable = compassInteractableId ? map.interactables.find((i) => i.id === compassInteractableId) : undefined;
  const compassLabel = compassInteractable
    ? guidanceDoorHop && guidanceTarget?.mapId !== map.id
      ? `Head through: ${compassInteractable.label}`
      : `Go to: ${compassInteractable.label}`
    : guidanceTarget
      ? "That way isn't reachable from here right now."
      : "Nothing urgent right now — try talking to people or checking objects nearby.";
  let compassAngleDeg = 0;
  if (compassInteractable) {
    const targetX = (compassInteractable.x * map.tileSize + map.tileSize / 2 - camera.x) * zoom;
    const targetY = (compassInteractable.y * map.tileSize + map.tileSize / 2 - camera.y) * zoom;
    const playerX = (pos.x - camera.x) * zoom;
    const playerY = (pos.y - camera.y) * zoom;
    compassAngleDeg = (Math.atan2(targetY - playerY, targetX - playerX) * 180) / Math.PI + 90;
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-ink-100">
      <HUD locationLabel={map.name} ambientLabel={map.ambientLabel} onGuide={showCompass} />
      {compassVisible && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-30 flex flex-col items-center gap-2">
          {compassInteractable && (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-paper-0 shadow-lg transition-transform duration-500"
              style={{ background: "var(--accent-warning)", transform: `rotate(${compassAngleDeg}deg)` }}
            >
              <Icon name="arrow-up" size={26} color="var(--paper-0)" />
            </div>
          )}
          <p className="rounded-full border-2 border-ink-950 bg-paper-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-950 shadow-md">{compassLabel}</p>
        </div>
      )}
      <div ref={containerRef} className="relative w-full flex-1 overflow-hidden">
        <canvas ref={canvasRef} width={VIEW_W} height={VIEW_H} onClick={handleClick} className="block h-full w-full cursor-pointer" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {map.interactables
            .filter((it) => !it.hidden && (!it.requiresFlag || save.flags.includes(it.requiresFlag)))
            .map((it) => {
              const x = (it.x * map.tileSize + map.tileSize / 2 - camera.x) * zoom;
              const y = (it.y * map.tileSize + map.tileSize / 2 - camera.y) * zoom;
              if (x < -20 || x > VIEW_W + 20 || y < -20 || y > VIEW_H + 20) return null;
              const npc = it.npcId ? getNpc(it.npcId) : undefined;
              const isSwitch = it.kind === "puzzle-switch";
              const switchLit = isSwitch && it.puzzleId != null && it.puzzleOrder != null && (save.puzzleProgress[it.puzzleId] ?? 0) >= it.puzzleOrder;
              const color = switchLit ? "var(--accent-success)" : npc?.portraitColor ?? MARKER_COLOR[it.kind];
              const isNear = it.id === nearbyId;
              const isLiving = it.kind === "npc" || it.kind === "monster";
              const isDoor = it.kind === "door" || it.kind === "transition";
              const isGuidanceBeacon = guidanceTarget?.mapId === map.id && it.id === guidanceTarget.interactableId;
              const isGuidanceDoor = it.id === guidanceDoorHop?.interactableId;
              return (
                <div
                  key={it.id}
                  className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
                  style={{ left: x, top: y }}
                  onClick={() => interact(it.id)}
                >
                  {(isGuidanceBeacon || isGuidanceDoor) && (
                    <div className="beacon-pulse absolute -top-6">
                      <Icon name="chevron-down" size={18} color="var(--accent-warning)" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 shadow-sm transition-transform",
                      isLiving && "marker-idle",
                      isDoor && !isNear && "marker-idle",
                    )}
                    style={{
                      background: npc ? `color-mix(in srgb, ${color} 25%, var(--paper-0))` : color,
                      borderColor: isNear ? "var(--accent-warning)" : isGuidanceDoor ? "var(--accent-success)" : "var(--paper-0)",
                      transform: isNear ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {npc?.portraitImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={npc.portraitImageUrl} alt={npc.fullName} className="h-full w-full object-cover" />
                    ) : npc ? (
                      <PortraitFace hairColor={npc.hairColor} hairstyle={npc.hairstyle} eyeColor={npc.eyeColor} skinTone={npc.skinTone} accentColor={npc.portraitColor} expression="neutral" size={26} />
                    ) : (
                      <Icon name={it.glyph} size={12} color="var(--paper-0)" />
                    )}
                  </div>
                  {(isNear || isDoor) && (
                    <span
                      className="whitespace-nowrap rounded px-1 py-0.5 text-[9px] text-paper-0"
                      style={{ background: isDoor ? (isGuidanceDoor ? "var(--accent-success)" : "var(--accent-info)") : "var(--ink-950)" }}
                    >
                      {isDoor && !isNear ? `→ ${it.label}` : it.label}
                    </span>
                  )}
                </div>
              );
            })}
          {/* player */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: (pos.x - camera.x) * zoom,
              top: (pos.y - camera.y) * zoom,
              width: PLAYER_SIZE * 1.8 * zoom,
              height: PLAYER_SIZE * 1.8 * zoom,
            }}
          >
            <div className="absolute inset-x-0 bottom-0 mx-auto h-1.5 w-3.5 rounded-full bg-black/25 blur-[1px]" />
            <PixelAvatar appearance={save.player.appearance} size={PLAYER_SIZE * 1.8 * zoom} walking={walking} facingLeft={facingLeft} />
          </div>
        </div>
      </div>

      {nearby && (
        <button
          onClick={() => interact(nearby.id)}
          className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded border-2 border-ink-950 bg-accent-warning px-3 py-1.5 text-[10px] uppercase tracking-widest text-paper-0 shadow-[2px_2px_0_0_var(--ink-950)] sm:hidden"
        >
          Interact: {nearby.label}
        </button>
      )}

      <MobileControls keysRef={keysRef} onInteract={() => nearbyId && interact(nearbyId)} hasNearby={!!nearby} />
    </div>
  );
}

function MobileControls({ keysRef, onInteract, hasNearby }: { keysRef: React.MutableRefObject<MoveInput>; onInteract: () => void; hasNearby: boolean }) {
  function bind(key: keyof MoveInput) {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        keysRef.current[key] = true;
      },
      onPointerUp: () => {
        keysRef.current[key] = false;
      },
      onPointerLeave: () => {
        keysRef.current[key] = false;
      },
    };
  }
  return (
    <div className="fixed inset-x-0 bottom-4 z-20 flex items-end justify-between px-4 sm:hidden">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <button {...bind("up")} className="col-start-2 row-start-1 rounded border-2 border-ink-950 bg-paper-0/90 p-2">
          <Icon name="chevron-up" size={16} />
        </button>
        <div />
        <button {...bind("left")} className="col-start-1 row-start-2 rounded border-2 border-ink-950 bg-paper-0/90 p-2">
          <Icon name="chevron-left" size={16} />
        </button>
        <div />
        <button {...bind("right")} className="col-start-3 row-start-2 rounded border-2 border-ink-950 bg-paper-0/90 p-2">
          <Icon name="chevron-right" size={16} />
        </button>
        <div />
        <button {...bind("down")} className="col-start-2 row-start-3 rounded border-2 border-ink-950 bg-paper-0/90 p-2">
          <Icon name="chevron-down" size={16} />
        </button>
        <div />
      </div>
      {hasNearby && (
        <button onClick={onInteract} className="rounded-full border-2 border-ink-950 bg-accent-warning p-4 text-paper-0">
          <Icon name="hand" size={18} />
        </button>
      )}
    </div>
  );
}
