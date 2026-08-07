import type { GuildDefinitionInput } from "@/types";

export const aincradGuilds: GuildDefinitionInput[] = [
  {
    id: "guild-iron-vanguard",
    name: "Iron Vanguard",
    motto: "Strength clears floors.",
    values: "Front-line combat focus. Fast clears, high risk, glory-driven. Kibaou expects results, not excuses.",
    leaderNpcId: "ai-ryo",
    color: "#8f2e2e",
    description: "The largest combat guild on Floor 1, obsessed with being remembered as the guild that cleared Aincrad.",
  },
  {
    id: "guild-hearthlight",
    name: "Hearthlight",
    motto: "No one clears alone.",
    values: "Support and survival focus. Small, careful, protective of newer players. Sachi won't send anyone into a fight she wouldn't take herself.",
    leaderNpcId: "ai-nell",
    color: "#5b8f6f",
    description: "A small guild built around keeping people alive first and clearing floors second.",
  },
  {
    id: "guild-stonebreakers",
    name: "Stonebreakers",
    motto: "Someone has to keep the lights on.",
    values: "Economic and logistics focus. Crafting, trading, market control. Agil believes surviving Aincrad is a supply problem, not a combat one.",
    leaderNpcId: "ai-dask",
    color: "#6b6b3d",
    description: "A guild of crafters and traders who rarely fight but keep every other guild equipped.",
  },
];
