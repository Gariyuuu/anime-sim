export interface MessageDefinition {
  id: string;
  npcId: string;
  worldId: "elite-academy" | "aincrad";
  subject: string;
  text: string;
}

export const messageDefinitions: MessageDefinition[] = [
  {
    id: "ea-msg-hikari-quiet",
    npcId: "ea-hikari",
    worldId: "elite-academy",
    subject: "keep this between us??",
    text: "ok so I probably said too much back there. please don't repeat where you heard it from, I like having a face that isn't on anyone's suspicious list lol",
  },
  {
    id: "ea-msg-watcher",
    npcId: "ea-daichi",
    worldId: "elite-academy",
    subject: "(unlisted contact)",
    text: "You handled that better than expected. I'll be watching what you do next.",
  },
  {
    id: "ai-msg-kirei-checklist",
    npcId: "ai-kirei",
    worldId: "aincrad",
    subject: "before the raid",
    text: "checklist: healing crystals (get at least 3), stamina draughts, and DO NOT skip the tutorial drill. beta players who skipped it front-loaded most of the wipes I saw.",
  },
  {
    id: "ai-msg-mei-thanks",
    npcId: "ai-mei",
    worldId: "aincrad",
    subject: "thank you",
    text: "Come by the forge before the raid. On the house, whatever you need. Just — come back after, okay?",
  },
];

export function getMessageDefinition(id: string): MessageDefinition | undefined {
  return messageDefinitions.find((m) => m.id === id);
}
