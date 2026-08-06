import type { Effect, SaveGame } from "@/types";
import { freshRelationship } from "@/types/npc";
import { clamp } from "@/types/common";
import { getMessageDefinition } from "@/content/messages";
import { uid } from "./utils";

export type EffectCommand =
  | { type: "changeLocation"; mapId: string; spawnId?: string }
  | { type: "triggerBattle"; encounterId: string }
  | { type: "goToScene"; sceneId: string; nodeId?: string }
  | { type: "sendMessage"; npcId: string; messageId: string }
  | { type: "unlockAchievement"; achievementId: string };

/** Applies a batch of effects to a save, mutating a clone. Returns the new save and
 * any side-effect commands the caller (store) must act on (navigation, combat, etc). */
export function applyEffects(save: SaveGame, effects: Effect[]): { save: SaveGame; commands: EffectCommand[] } {
  const next: SaveGame = structuredClone(save);
  const commands: EffectCommand[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case "modifyStat": {
        const stat = effect.stat;
        if (stat in next.player.core) {
          (next.player.core as Record<string, number>)[stat] = clamp(
            (next.player.core as Record<string, number>)[stat] + effect.delta,
            0,
            20,
          );
        } else if (stat in next.player.elite) {
          (next.player.elite as Record<string, number>)[stat] = Math.max(
            0,
            (next.player.elite as Record<string, number>)[stat] + effect.delta,
          );
        } else if (stat in next.player.aincrad) {
          (next.player.aincrad as Record<string, number>)[stat] = Math.max(
            0,
            (next.player.aincrad as Record<string, number>)[stat] + effect.delta,
          );
        }
        break;
      }
      case "modifyRelationship": {
        let rel = next.relationships.find((r) => r.npcId === effect.npcId);
        if (!rel) {
          rel = freshRelationship(effect.npcId);
          next.relationships.push(rel);
        }
        rel.metPlayer = true;
        rel[effect.axis] = clamp(rel[effect.axis] + effect.delta, -100, 100);
        rel.mood = moodFromRelationship(rel);
        break;
      }
      case "addItem": {
        const slot = next.inventory.find((i) => i.itemId === effect.itemId);
        if (slot) slot.quantity += effect.quantity;
        else next.inventory.push({ itemId: effect.itemId, quantity: effect.quantity, equipped: false });
        break;
      }
      case "removeItem": {
        const slot = next.inventory.find((i) => i.itemId === effect.itemId);
        if (slot) {
          slot.quantity = Math.max(0, slot.quantity - effect.quantity);
          next.inventory = next.inventory.filter((i) => i.quantity > 0);
        }
        break;
      }
      case "setFlag":
        if (!next.flags.includes(effect.flag)) next.flags.push(effect.flag);
        break;
      case "clearFlag":
        next.flags = next.flags.filter((f) => f !== effect.flag);
        break;
      case "startQuest": {
        const existing = next.quests.find((q) => q.questId === effect.questId);
        if (existing) existing.state = "active";
        else next.quests.push({ questId: effect.questId, state: "active", completedObjectiveIds: [] });
        break;
      }
      case "completeQuest": {
        const existing = next.quests.find((q) => q.questId === effect.questId);
        if (existing) {
          existing.state = "complete";
          existing.outcome = effect.outcome;
        } else {
          next.quests.push({ questId: effect.questId, state: "complete", completedObjectiveIds: [], outcome: effect.outcome });
        }
        break;
      }
      case "changeLocation":
        commands.push({ type: "changeLocation", mapId: effect.mapId, spawnId: effect.spawnId });
        break;
      case "triggerBattle":
        commands.push({ type: "triggerBattle", encounterId: effect.encounterId });
        break;
      case "sendMessage": {
        const def = getMessageDefinition(effect.messageId);
        if (def) {
          next.messages.push({ id: uid("msg"), messageId: effect.messageId, npcId: effect.npcId, timestamp: Date.now(), read: false });
        }
        commands.push({ type: "sendMessage", npcId: effect.npcId, messageId: effect.messageId });
        break;
      }
      case "unlockCodex":
        if (!next.codexUnlocked.includes(effect.entryId)) next.codexUnlocked.push(effect.entryId);
        break;
      case "changeClassPoints":
        // class points tracked separately in world content registry / store extension
        break;
      case "changeReputation":
        next.player.elite.reputation = Math.max(0, next.player.elite.reputation + effect.delta);
        break;
      case "goToScene":
        commands.push({ type: "goToScene", sceneId: effect.sceneId, nodeId: effect.nodeId });
        break;
      case "unlockAchievement":
        if (!next.achievementsUnlocked.includes(effect.achievementId)) {
          next.achievementsUnlocked.push(effect.achievementId);
        }
        commands.push({ type: "unlockAchievement", achievementId: effect.achievementId });
        break;
    }
  }

  return { save: next, commands };
}

function moodFromRelationship(rel: { affection: number; trust: number; fear: number; rivalry: number }): "warm" | "neutral" | "cold" | "tense" | "hostile" | "affectionate" {
  if (rel.affection >= 60 && rel.trust >= 40) return "affectionate";
  if (rel.fear >= 50) return "hostile";
  if (rel.rivalry >= 50) return "tense";
  if (rel.affection >= 25 || rel.trust >= 25) return "warm";
  if (rel.affection <= -25 || rel.trust <= -25) return "cold";
  return "neutral";
}
