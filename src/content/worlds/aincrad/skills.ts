import type { SkillInput } from "@/types";

export const aincradSkills: SkillInput[] = [
  { id: "sk-slash", name: "Slash", description: "A basic sword skill. Reliable damage, short cooldown.", power: 14, staminaCost: 10, cooldown: 0, targetType: "single" },
  { id: "sk-heavy-cleave", name: "Heavy Cleave", description: "A slow, powerful overhead strike.", power: 26, staminaCost: 22, cooldown: 2, targetType: "single", timingBonusWindowMs: 400 },
  { id: "sk-piercing-thrust", name: "Piercing Thrust", description: "Bypasses a portion of enemy defense.", power: 18, staminaCost: 16, cooldown: 1, targetType: "single" },
  { id: "sk-guard-break", name: "Guard Break", description: "A skill built to shatter an enemy's guard stance.", power: 12, staminaCost: 14, cooldown: 2, targetType: "single", statusEffect: "guard-break" },
  { id: "sk-whirlwind", name: "Whirlwind", description: "Strikes all enemies in a wide arc.", power: 16, staminaCost: 28, cooldown: 3, targetType: "all-enemies" },
  { id: "sk-focus-heal", name: "Focus Heal", description: "A brief moment of composure. Restores a small amount of health.", power: 20, staminaCost: 20, cooldown: 3, targetType: "self" },
  { id: "sk-rallying-shout", name: "Rallying Shout", description: "Steadies the whole party's nerve.", power: 0, staminaCost: 15, cooldown: 3, targetType: "party", statusEffect: "shield" },
  { id: "sk-venom-bite", name: "Venom Bite", description: "An enemy skill that poisons on hit.", power: 10, staminaCost: 0, cooldown: 2, targetType: "single", statusEffect: "poison" },
  { id: "sk-crushing-slam", name: "Crushing Slam", description: "A heavy boss attack with a long tell.", power: 32, staminaCost: 0, cooldown: 3, targetType: "single", timingBonusWindowMs: 500 },
  { id: "sk-roar", name: "Roar", description: "A boss skill that briefly stuns the party.", power: 0, staminaCost: 0, cooldown: 4, targetType: "party", statusEffect: "stun" },
];
