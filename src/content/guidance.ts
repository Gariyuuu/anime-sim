/**
 * Chapter-level "where do I go next" waypoint data, driving the in-world guidance beacon/door-glow
 * in `ExplorationView.tsx`. Purely additive/best-effort — a chapter with no entry here (or a
 * step whose target isn't resolvable) simply shows no beacon, never blocks anything.
 *
 * Most chapters get ONE step (their single "main beat" quest-marker). Aincrad's multi-room floors
 * get several steps, each active until its `doneWhenFlags` are all set, at which point guidance
 * advances to the next step. The two chapters with real per-objective tracking (`ea-ch1`/`ai-ch1`)
 * are NOT listed here — they're resolved in `lib/guidance.ts` by composing with the existing
 * `lib/quests.ts` objective system via `OBJECTIVE_TARGETS` below, so they keep their finer-grained
 * per-objective guidance instead of being flattened to one coarse target.
 */

export interface GuidanceStep {
  id: string;
  targetMapId: string;
  /** Omitted => a map-level pointer only (walk toward this map, no specific on-map beacon). */
  targetInteractableId?: string;
  /** All present in save.flags => this step is done; guidance advances to the next step (or, if
   * this is the last step, stops showing a beacon for this chapter entirely). */
  doneWhenFlags: string[];
}

export interface ChapterGuidance {
  chapterId: string;
  steps: GuidanceStep[];
}

/** Elite Academy ch2-20: one step each, pointing at that chapter's single "main beat"
 * quest-marker interactable (`obj-ch{N}-event`), gated behind the chapter's own `arrived` flag
 * per its `requiresFlag` (so the beacon only appears once the marker is actually visible/clickable
 * — matches the existing `requiresFlag` filtering in `ExplorationView.tsx`). */
const EA_CHAPTER_TARGETS: Record<number, { mapId: string; interactableId: string }> = {
  2: { mapId: "ea-map-classroom", interactableId: "obj-ch2-event" },
  3: { mapId: "ea-map-classroom", interactableId: "obj-ch3-event" },
  4: { mapId: "ea-map-courtyard", interactableId: "obj-ch4-event" },
  5: { mapId: "ea-map-gym", interactableId: "obj-ch5-event" },
  6: { mapId: "ea-map-library", interactableId: "obj-ch6-event" },
  7: { mapId: "ea-map-classroom", interactableId: "obj-ch7-event" },
  8: { mapId: "ea-map-store", interactableId: "obj-ch8-event" },
  9: { mapId: "ea-map-classroom", interactableId: "obj-ch9-event" },
  10: { mapId: "ea-map-classroom", interactableId: "obj-ch10-event" },
  11: { mapId: "ea-map-classroom", interactableId: "obj-ch11-event" },
  12: { mapId: "ea-map-classroom", interactableId: "obj-ch12-event" },
  13: { mapId: "ea-map-classroom", interactableId: "obj-ch13-event" },
  14: { mapId: "ea-map-cafeteria", interactableId: "obj-ch14-event" },
  15: { mapId: "ea-map-council", interactableId: "obj-ch15-event" },
  16: { mapId: "ea-map-classroom", interactableId: "obj-ch16-event" },
  17: { mapId: "ea-map-classroom", interactableId: "obj-ch17-event" },
  18: { mapId: "ea-map-classroom", interactableId: "obj-ch18-event" },
  19: { mapId: "ea-map-classroom", interactableId: "obj-ch19-event" },
  20: { mapId: "ea-map-classroom", interactableId: "obj-ch20-event" },
};

const eaGuidance: ChapterGuidance[] = Object.entries(EA_CHAPTER_TARGETS).map(([n, target]) => ({
  chapterId: `ea-ch${n}`,
  steps: [{ id: "main-beat", targetMapId: target.mapId, targetInteractableId: target.interactableId, doneWhenFlags: [] }],
}));

/** Aincrad floors 2-3: hand-authored 4-map chain (town -> field -> dungeon -> boss chamber). */
const aincradEarlyFloors: ChapterGuidance[] = [
  {
    chapterId: "ai-ch2",
    steps: [
      { id: "go-field", targetMapId: "ai-map-town2", targetInteractableId: "door-field2", doneWhenFlags: ["ai-flag-floor2-field-entered"] },
      { id: "beat-alpha", targetMapId: "ai-map-dungeon2", targetInteractableId: "mon-frostfang", doneWhenFlags: ["ai-flag-frostfang-defeated"] },
      { id: "go-boss", targetMapId: "ai-map-dungeon2", targetInteractableId: "door-boss2", doneWhenFlags: ["ai-flag-floor2-boss-entered"] },
      { id: "raid-prep", targetMapId: "ai-map-boss2", targetInteractableId: "obj-raid-prep-2", doneWhenFlags: [] },
    ],
  },
  {
    chapterId: "ai-ch3",
    steps: [
      { id: "go-field", targetMapId: "ai-map-town3", targetInteractableId: "door-field3", doneWhenFlags: ["ai-flag-floor3-field-entered"] },
      { id: "beat-sentinel", targetMapId: "ai-map-dungeon3", targetInteractableId: "mon-sentinel", doneWhenFlags: ["ai-flag-sentinel-defeated"] },
      { id: "go-boss", targetMapId: "ai-map-dungeon3", targetInteractableId: "door-boss3", doneWhenFlags: ["ai-flag-floor3-boss-entered"] },
      { id: "raid-prep", targetMapId: "ai-map-boss3", targetInteractableId: "obj-raid-prep-3", doneWhenFlags: [] },
    ],
  },
];

/** Aincrad floors 4-20: generated 2-map chain (town -> field, raid-prep sits directly in the
 * field once the miniboss is down — see `laterFloorMapSpecs` in `worlds/aincrad/maps.ts`). */
const aincradLaterFloors: ChapterGuidance[] = Array.from({ length: 17 }, (_, i) => {
  const floor = i + 4;
  return {
    chapterId: `ai-ch${floor}`,
    steps: [
      { id: "go-field", targetMapId: `ai-map-town${floor}`, targetInteractableId: "door-field", doneWhenFlags: [`ai-flag-floor${floor}-field-entered`] },
      { id: "beat-miniboss", targetMapId: `ai-map-field${floor}`, targetInteractableId: "mon-miniboss", doneWhenFlags: [`ai-flag-floor${floor}-miniboss-defeated`] },
      { id: "raid-prep", targetMapId: `ai-map-field${floor}`, targetInteractableId: "obj-raid-prep", doneWhenFlags: [] },
    ],
  };
});

export const guidance: ChapterGuidance[] = [...eaGuidance, ...aincradEarlyFloors, ...aincradLaterFloors];

/** Per-objective targets for the two chapters with real objective tracking (`ea-q-main-first-ranking`
 * for ea-ch1, `ai-q-main-locked-sky` for ai-ch1) — composed with `lib/quests.ts`'s `getNextObjective`
 * in `lib/guidance.ts` instead of a coarse chapter-level row, so these two intro chapters keep
 * step-by-step guidance instead of one blunt target for the whole chapter. Objectives with no
 * single fixed-room target (e.g. open-ended "meet your classmates") are simply omitted — guidance
 * falls through to no beacon for that objective, which is fine, it's still shown via the HUD text. */
export const OBJECTIVE_TARGETS: Record<string, Record<string, { mapId: string; interactableId?: string }>> = {
  "ai-q-main-locked-sky": {
    "choose-alone-or-together": { mapId: "ai-map-town1", interactableId: "obj-guild-board" },
    "complete-training": { mapId: "ai-map-town1", interactableId: "door-training" },
    "explore-field": { mapId: "ai-map-town1", interactableId: "door-field1" },
    "clear-dungeon": { mapId: "ai-map-field1", interactableId: "door-dungeon1" },
    "raid-boss": { mapId: "ai-map-dungeon1", interactableId: "door-boss1" },
  },
  "ea-q-main-first-ranking": {
    "learn-points": { mapId: "ea-map-classroom", interactableId: "obj-ranking-board" },
    "investigate-penalty": { mapId: "ea-map-classroom", interactableId: "obj-ranking-board" },
  },
};
