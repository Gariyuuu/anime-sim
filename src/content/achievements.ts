import type { AchievementDefinitionInput } from "@/types";

/**
 * 22 achievements. Most are unlocked directly by narrative `unlockAchievement` effects
 * (see content/worlds/*\/scenes.ts). The rest ("generic" ones, marked below) are checked
 * by `lib/achievements.ts` against live save state after every effect batch.
 */
export const achievements: AchievementDefinitionInput[] = [
  // --- Elite Academy (scene-triggered) ---
  { id: "ach-first-mystery", title: "First Mystery", description: "Discover the unexplained class-point penalty.", worldId: "elite-academy", icon: "search" },
  { id: "ach-nobody-left-behind", title: "Nobody Left Behind", description: "Protect Yuzuki's notebook without exposing anyone.", worldId: "elite-academy", icon: "shield" },
  { id: "ach-broken-promise", title: "Broken Promise", description: "Betray a confidence for personal gain.", worldId: "elite-academy", icon: "heart-crack", hidden: true },
  { id: "ach-master-manipulator", title: "Master Manipulator", description: "Publicly expose a scheme at exactly the right moment.", worldId: "elite-academy", icon: "drama" },
  { id: "ach-five-steps-ahead", title: "Five Steps Ahead", description: "Come out ahead of a special exam that was designed to test loyalty.", worldId: "elite-academy", icon: "footprints", hidden: true },
  { id: "ach-class-savior", title: "Class Savior", description: "Resolve the point-leak investigation the honest way.", worldId: "elite-academy", icon: "graduation-cap" },
  { id: "ach-unreadable", title: "Unreadable", description: "Keep a secret as leverage instead of spending it.", worldId: "elite-academy", icon: "eye-off", hidden: true },
  { id: "ach-hidden-truth", title: "Hidden Truth", description: "Reach the end of Chapter One and learn someone's been watching.", worldId: "elite-academy", icon: "eye" },

  // --- Aincrad (scene-triggered) ---
  { id: "ach-locked-in", title: "Locked In", description: "Learn the truth about logout on Floor 1.", worldId: "aincrad", icon: "lock" },
  { id: "ach-floor-pioneer", title: "Floor Pioneer", description: "Defeat a floor boss for the first time.", worldId: "aincrad", icon: "flag" },
  { id: "ach-zero-casualties", title: "Zero Casualties", description: "Get everyone through a boss raid alive.", worldId: "aincrad", icon: "users" },
  { id: "ach-one-floor-down", title: "One Floor Down", description: "Clear Floor 1 and reach the Chapter One ending.", worldId: "aincrad", icon: "check-circle" },
  { id: "ach-lone-swordsman", title: "Lone Swordsman", description: "Refuse all three guilds and stay solo.", worldId: "aincrad", icon: "sword" },
  { id: "ach-unlikely-ally", title: "Unlikely Ally", description: "Recruit a player who swore off partying entirely.", worldId: "aincrad", icon: "user-plus", hidden: true },
  { id: "ach-off-the-map", title: "Off the Map", description: "Find a location that isn't on any quest marker.", worldId: "aincrad", icon: "map-pin", hidden: true },

  // --- Generic (checked live against save state, see lib/achievements.ts) ---
  { id: "ach-first-ally", title: "First Ally", description: "Reach 50 trust or affection with an NPC for the first time.", worldId: "shared", icon: "handshake" },
  { id: "ach-perfect-score", title: "Perfect Score", description: "Reach an Academic Score of 100.", worldId: "elite-academy", icon: "star" },
  { id: "ach-unbreakable", title: "Unbreakable", description: "Max out a core stat at 20.", worldId: "shared", icon: "trending-up" },
  { id: "ach-collector", title: "Collector", description: "Hold 10 or more distinct items at once.", worldId: "shared", icon: "package" },
  { id: "ach-veteran", title: "Veteran", description: "Reach Level 5 in Aincrad.", worldId: "aincrad", icon: "sword" },
  { id: "ach-chapter-closed", title: "Chapter Closed", description: "Complete a first chapter in either world.", worldId: "shared", icon: "book-check" },
  { id: "ach-secret-keeper", title: "Secret Keeper", description: "Learn two or more hidden secrets about the people around you.", worldId: "shared", icon: "key", hidden: true },
  { id: "ach-well-stocked", title: "Well Stocked", description: "Carry 500 or more currency at once (Private Points or Col).", worldId: "shared", icon: "coins" },
  { id: "ach-tenth-gate", title: "The Tenth Gate", description: "Clear Floor 10 and open the Tenth Gate.", worldId: "aincrad", icon: "gem" },
];
