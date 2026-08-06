import type { Condition } from "@/types";
import type { SaveGame } from "@/types";

function readStat(save: SaveGame, stat: string): number {
  if (stat in save.player.core) return (save.player.core as Record<string, number>)[stat];
  if (stat in save.player.elite) return (save.player.elite as Record<string, number>)[stat];
  if (stat in save.player.aincrad) return (save.player.aincrad as Record<string, number>)[stat];
  return 0;
}

export function evaluateCondition(save: SaveGame, condition: Condition): boolean {
  switch (condition.type) {
    case "minStat":
      return readStat(save, condition.stat) >= condition.value;
    case "maxStat":
      return readStat(save, condition.stat) <= condition.value;
    case "relationship": {
      const rel = save.relationships.find((r) => r.npcId === condition.npcId);
      if (!rel) return condition.min <= 0;
      return rel[condition.axis] >= condition.min;
    }
    case "hasItem": {
      const slot = save.inventory.find((i) => i.itemId === condition.itemId);
      return (slot?.quantity ?? 0) >= condition.quantity;
    }
    case "questState": {
      const q = save.quests.find((q) => q.questId === condition.questId);
      const state = q?.state ?? "not_started";
      return state === condition.state;
    }
    case "flag":
      return save.flags.includes(condition.flag);
    case "missingFlag":
      return !save.flags.includes(condition.flag);
    case "timeOfDay":
      return save.timeOfDay === condition.time;
    case "difficulty":
      return save.player.difficulty === condition.difficulty;
    case "personality":
      return save.player.personality === condition.personality;
    default:
      return true;
  }
}

export function evaluateConditions(save: SaveGame, conditions: Condition[]): boolean {
  return conditions.every((c) => evaluateCondition(save, c));
}
