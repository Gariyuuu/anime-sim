"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { getMap, getNpc } from "@/content/registry";
import { rectIntersectsWalls, clampCamera, nearestInteractable, directionFromInput, type MoveInput } from "@/engine/exploration";
import { Icon } from "@/components/ui/Icon";
import { HUD } from "@/components/game/HUD";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import { PortraitFace } from "@/components/game/PortraitFace";
import { cn } from "@/lib/utils";
import type { Interactable } from "@/types";

const PLAYER_SIZE = 20;
const SPEED = 150; // px/sec
const INTERACT_RANGE = 46;
const MIN_VIEW_W = 320;
const MIN_VIEW_H = 240;

const MAX_ZOOM = 2.2;

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
  }, [nearbyId, interact, toggleDevice]);

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

    // subtle grid
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    for (let x = 0; x < map.widthTiles * map.tileSize; x += map.tileSize) {
      ctx.beginPath();
      ctx.moveTo(x - camera.x, 0);
      ctx.lineTo(x - camera.x, worldViewH);
      ctx.stroke();
    }
    for (let y = 0; y < map.heightTiles * map.tileSize; y += map.tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y - camera.y);
      ctx.lineTo(worldViewW, y - camera.y);
      ctx.stroke();
    }

    ctx.fillStyle = map.wallColor;
    for (const [wx, wy] of map.walls) {
      ctx.fillRect(wx * map.tileSize - camera.x, wy * map.tileSize - camera.y, map.tileSize, map.tileSize);
    }
    ctx.restore();
  }, [map, pos, viewSize]);

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

  return (
    <div className="flex h-dvh w-full flex-col bg-ink-100">
      <HUD locationLabel={map.name} ambientLabel={map.ambientLabel} />
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
              return (
                <div
                  key={it.id}
                  className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
                  style={{ left: x, top: y }}
                  onClick={() => interact(it.id)}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 shadow-sm transition-transform",
                      isLiving && "marker-idle",
                      isDoor && !isNear && "marker-idle",
                    )}
                    style={{ background: npc ? `color-mix(in srgb, ${color} 25%, var(--paper-0))` : color, borderColor: isNear ? "var(--accent-warning)" : "var(--paper-0)", transform: isNear ? "scale(1.15)" : "scale(1)" }}
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
                      style={{ background: isDoor ? "var(--accent-info)" : "var(--ink-950)" }}
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
