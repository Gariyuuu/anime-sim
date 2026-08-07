import type { SaveGame } from "@/types";
import { getQuest } from "@/content/registry";

/** Objective → flag equivalences for quests whose objectives predate per-objective effect
 * tracking (`completeObjective`), or whose natural completion point is a one-time opening
 * cutscene a returning save will never re-enter. Purely additive to a quest's real
 * `completedObjectiveIds` — this only fills gaps so upgrading the game doesn't make an
 * in-progress save's quest tracker look less accurate than it did before the upgrade. */
const INFERRED_OBJECTIVE_FLAGS: Record<string, Record<string, string>> = {
  "ai-q-main-locked-sky": {
    "learn-no-logout": "ai-flag-no-logout-revealed",
    "choose-alone-or-together": "ai-flag-guild-chosen",
    "complete-training": "ai-flag-tutorial-complete",
    "explore-field": "ai-flag-floor1-arrived",
    "clear-dungeon": "ai-flag-alpha-defeated",
  },
};

/** The completed-objective IDs for a quest, merging real tracked progress with the inferred
 * flag-based fallback above. Use this instead of reading `completedObjectiveIds` directly
 * anywhere objective completion is displayed to the player. */
export function getCompletedObjectiveIds(save: SaveGame, questId: string): string[] {
  const quest = save.quests.find((q) => q.questId === questId);
  const tracked = quest?.completedObjectiveIds ?? [];
  if (quest?.state === "complete") {
    // Once a quest is fully complete, every objective counts as done — covers objectives with
    // no dedicated inferred-flag entry (e.g. a final "raid-boss" step) or no effect wiring at all.
    const allIds = getQuest(questId)?.objectives.map((o) => o.id) ?? [];
    return Array.from(new Set([...tracked, ...allIds]));
  }
  const inferredMap = INFERRED_OBJECTIVE_FLAGS[questId];
  const inferred = inferredMap ? Object.entries(inferredMap).filter(([, flag]) => save.flags.includes(flag)).map(([objectiveId]) => objectiveId) : [];
  return Array.from(new Set([...tracked, ...inferred]));
}

/** The first not-yet-completed objective for an active quest, or `undefined` if every objective
 * (that this system can determine) is done. Drives the HUD's "what do I do next" banner. */
export function getNextObjective(save: SaveGame, questId: string) {
  const def = getQuest(questId);
  if (!def) return undefined;
  const completed = new Set(getCompletedObjectiveIds(save, questId));
  return def.objectives.find((o) => !completed.has(o.id));
}
