import type { SaveGame } from "@/types";
import { getChapter } from "@/content/registry";
import { guidance, OBJECTIVE_TARGETS } from "@/content/guidance";
import { getNextObjective } from "@/lib/quests";

export interface GuidanceTarget {
  mapId: string;
  interactableId?: string;
}

/** The two chapters with real per-objective tracking — resolved via `getNextObjective` +
 * `OBJECTIVE_TARGETS` instead of the flat `guidance` table, so they keep their finer-grained
 * step-by-step guidance. See `src/content/guidance.ts` for why. */
const OBJECTIVE_CHAPTER_QUEST: Record<string, string> = {
  "ai-ch1": "ai-q-main-locked-sky",
  "ea-ch1": "ea-q-main-first-ranking",
};

/** Where the player should go next for their current chapter, or `undefined` if nothing
 * resolvable (chapter has no guidance data, or the next objective has no fixed-room target).
 * Purely additive/best-effort — never blocks or requires anything. */
export function getGuidanceTarget(save: SaveGame): GuidanceTarget | undefined {
  const chapterId = save.currentChapterId;
  const chapter = getChapter(chapterId);
  if (!chapter || save.flags.includes(chapter.completionFlag)) return undefined;

  const objectiveQuestId = OBJECTIVE_CHAPTER_QUEST[chapterId];
  if (objectiveQuestId) {
    const nextObjective = getNextObjective(save, objectiveQuestId);
    if (!nextObjective) return undefined;
    return OBJECTIVE_TARGETS[objectiveQuestId]?.[nextObjective.id];
  }

  const chapterGuidance = guidance.find((g) => g.chapterId === chapterId);
  if (!chapterGuidance) return undefined;
  // An empty `doneWhenFlags` means "no flag marks this step done" (the terminal step — stays
  // active until the chapter's own completionFlag fires) — NOT "vacuously already done", which
  // `[].every(...)` would otherwise imply.
  const step = chapterGuidance.steps.find((s) => s.doneWhenFlags.length === 0 || !s.doneWhenFlags.every((f) => save.flags.includes(f)));
  if (!step) return undefined;
  return { mapId: step.targetMapId, interactableId: step.targetInteractableId };
}
