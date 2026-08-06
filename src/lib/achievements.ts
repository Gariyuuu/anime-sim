import type { SaveGame } from "@/types/save";
import { CORE_STAT_KEYS } from "@/types/common";

const SECRET_FLAGS = [
  "ea-flag-noticed-rei-discrepancy",
  "ea-flag-clue-format-leak",
  "ai-flag-mei-secret-told",
  "ai-flag-hollow-wipe-mentioned",
];

/** Generic (non-scene-scripted) achievement checks, run after every effect batch. */
export function checkGenericAchievements(save: SaveGame): string[] {
  const unlocked: string[] = [];
  const already = new Set(save.achievementsUnlocked);
  const unlock = (id: string) => {
    if (!already.has(id)) unlocked.push(id);
  };

  if (save.relationships.some((r) => r.trust >= 50 || r.affection >= 50)) unlock("ach-first-ally");
  if (save.player.elite.academicScore >= 100) unlock("ach-perfect-score");
  if (CORE_STAT_KEYS.some((k) => save.player.core[k] >= 20)) unlock("ach-unbreakable");
  if (save.inventory.filter((i) => i.quantity > 0).length >= 10) unlock("ach-collector");
  if (save.player.aincrad.level >= 5) unlock("ach-veteran");
  if (save.flags.includes("ea-flag-chapter1-complete") || save.flags.includes("ai-flag-ch1-complete")) unlock("ach-chapter-closed");
  if (SECRET_FLAGS.filter((f) => save.flags.includes(f)).length >= 2) unlock("ach-secret-keeper");
  if (save.player.elite.privatePoints >= 500 || save.player.aincrad.col >= 500) unlock("ach-well-stocked");

  return unlocked;
}
