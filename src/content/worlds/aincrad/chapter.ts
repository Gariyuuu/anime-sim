import type { ChapterDefinitionInput } from "@/types";
import type { SaveGame } from "@/types/save";

export const aincradChapter1: ChapterDefinitionInput = {
  id: "ai-ch1",
  worldId: "aincrad",
  index: 1,
  title: "The Locked Sky",
  subtitle: "Floor 1, Week One",
  summary:
    "Logout is gone. A new player wakes up trapped in Aincrad, meets the Town of Beginnings' first survivors, and takes part in the floor's first boss raid.",
  startSceneId: "ai-scene-login",
  completionFlag: "ai-flag-ch1-complete",
  nextChapterId: "ai-ch2",
  outcomes: [
    { id: "ai-outcome-zero-casualties", title: "Nobody Left Behind", description: "Floor 1 falls, and everyone who fought it walks away. That won't always be possible. It was this time, because of you.", requiredFlags: ["ai-flag-zero-casualties"] },
    { id: "ai-outcome-guild-bonded", title: "One of Them Now", description: "You didn't fight this floor alone, and it shows. Whichever banner you chose, Floor 1's survivors know your name for it.", requiredFlags: ["ai-flag-guild-chosen"] },
    { id: "ai-outcome-solo-survivor", title: "Solo Survivor", description: "You cleared Floor 1 answering to no one but yourself. Ninety-nine floors left, and you intend to face every one of them the same way.", requiredFlags: ["ai-flag-guild-solo"] },
  ],
};

const laterChapters: ChapterDefinitionInput[] = [
  {
    id: "ai-ch2",
    worldId: "aincrad",
    index: 2,
    title: "The Frozen Court",
    subtitle: "Floor 2, Mistfallen Reach",
    summary: "The party pushes into a colder, foggier floor and takes the fight to the Mistfallen Warden's throne room.",
    startSceneId: "ai-scene-floor2-arrival",
    completionFlag: "ai-flag-ch2-complete",
    nextChapterId: "ai-ch3",
    outcomes: [
      { id: "ai-ch2-outcome-read", title: "Reading the Throne", description: "You baited its first swing exactly the way Klein predicted and controlled the whole fight from there.", requiredFlags: ["ai-flag-raid2-read"] },
      { id: "ai-ch2-outcome-tight", title: "Never Out of Reach", description: "You kept the party close through the fog, and nobody had to fight the Warden alone.", requiredFlags: ["ai-flag-raid2-tight"] },
      { id: "ai-ch2-outcome-spread", title: "Trusting the Fog", description: "You spread out and flanked it — a riskier read on the fight, and it paid off.", requiredFlags: ["ai-flag-raid2-spread"] },
    ],
  },
  {
    id: "ai-ch3",
    worldId: "aincrad",
    index: 3,
    title: "The Yuuki Throne",
    subtitle: "Floor 3, Ashen Hollow",
    summary: "Volcanic rock, old grief, and a vigil nobody's ever caught being kept — Floor 3 ends at the Ashen Hollow King's throne.",
    startSceneId: "ai-scene-floor3-arrival",
    completionFlag: "ai-flag-ch3-complete",
    nextChapterId: "ai-ch4",
    outcomes: [
      { id: "ai-ch3-outcome-split", title: "Two Fronts at Once", description: "You split the party and handled the summons and the King as two separate, controlled problems.", requiredFlags: ["ai-flag-raid3-split"] },
      { id: "ai-ch3-outcome-bait", title: "Read the Pattern", description: "You baited its summons early and controlled the pace of the whole fight.", requiredFlags: ["ai-flag-raid3-bait"] },
      { id: "ai-ch3-outcome-focus", title: "Straight Through", description: "You ignored the noise and put everything into the King directly.", requiredFlags: ["ai-flag-raid3-focus"] },
    ],
  },
  {
    id: "ai-ch4",
    worldId: "aincrad",
    index: 4,
    title: "The Long Climb",
    subtitle: "Floor 4, Verdant Spire",
    summary: "A vertical floor built from a single impossible tree. Sena Kurogane guides the party up toward the Verdant Warden.",
    startSceneId: "ai-scene-floor4-arrival",
    completionFlag: "ai-flag-ch4-complete",
    nextChapterId: "ai-ch5",
    outcomes: [
      { id: "ai-ch4-outcome-overhang", title: "Sena's Route", description: "You used the overhang route she never quite admitted was combat-viable, and opened the fight before the Warden even knew you were there.", requiredFlags: ["ai-flag-raid4-overhang"] },
      { id: "ai-ch4-outcome-edge", title: "Room to Move", description: "You fought at the platform's edge and used every inch of space the Spire gave you.", requiredFlags: ["ai-flag-raid4-edge"] },
      { id: "ai-ch4-outcome-center", title: "Solid Ground", description: "You held the center and let the Warden come to you.", requiredFlags: ["ai-flag-raid4-center"] },
    ],
  },
  {
    id: "ai-ch5",
    worldId: "aincrad",
    index: 5,
    title: "What the Water Remembers",
    subtitle: "Floor 5, The Drowned Causeway",
    summary: "A swamp that swallowed a road, and a trader who's still making up for the party he lost here. The floor ends at the Drowned Sovereign's court.",
    startSceneId: "ai-scene-floor5-arrival",
    completionFlag: "ai-flag-ch5-complete",
    nextChapterId: "ai-ch6",
    outcomes: [
      { id: "ai-ch5-outcome-drain", title: "Drained the Court", description: "You cranked the causeway's old sluice gates and stripped the Sovereign's footing advantage before the fight even started.", requiredFlags: ["ai-flag-raid5-drain"] },
      { id: "ai-ch5-outcome-shallow", title: "Steady Footing", description: "You kept to the shallows and fought on your own terms.", requiredFlags: ["ai-flag-raid5-shallow"] },
      { id: "ai-ch5-outcome-deep", title: "Cutting Off the Retreat", description: "You pushed into deep water and gave the Sovereign nowhere left to run.", requiredFlags: ["ai-flag-raid5-deep"] },
    ],
  },
  {
    id: "ai-ch6",
    worldId: "aincrad",
    index: 6,
    title: "The Price of Floors",
    subtitle: "Floor 6, Gilded Quarter",
    summary: "The wealthiest floor town yet built, run by guild politics as much as monsters. The floor ends at the Golden Magnate's vault.",
    startSceneId: "ai-scene-floor6-arrival",
    completionFlag: "ai-flag-ch6-complete",
    nextChapterId: "ai-ch7",
    outcomes: [
      { id: "ai-ch6-outcome-intel", title: "Bought Insurance", description: "You paid Iris for the Magnate's attack data, and the fight never got the chance to surprise you.", requiredFlags: ["ai-flag-raid6-intel"] },
      { id: "ai-ch6-outcome-fast", title: "Before It Could Spend", description: "You struck fast, before the Magnate could unload its hoard on the party.", requiredFlags: ["ai-flag-raid6-fast"] },
      { id: "ai-ch6-outcome-patient", title: "Let It Slow Itself", description: "You played patient and let the Magnate's own weight work against it.", requiredFlags: ["ai-flag-raid6-patient"] },
    ],
  },
  {
    id: "ai-ch7",
    worldId: "aincrad",
    index: 7,
    title: "The Silence Between Floors",
    subtitle: "Floor 7, Hollow Choir",
    summary: "A floor that makes no sound, watched over by someone who chose to stop climbing. It ends with the Hollow Chorus.",
    startSceneId: "ai-scene-floor7-arrival",
    completionFlag: "ai-flag-ch7-complete",
    nextChapterId: "ai-ch8",
    outcomes: [
      { id: "ai-ch7-outcome-guided", title: "Every Name in Order", description: "You used the order the Choirkeeper taught you, calling each voice by its place in line.", requiredFlags: ["ai-flag-raid7-guided"] },
      { id: "ai-ch7-outcome-loud", title: "Louder Than the Silence", description: "You drowned the voices out with noise and momentum.", requiredFlags: ["ai-flag-raid7-loud"] },
      { id: "ai-ch7-outcome-listen", title: "Listening for the Gaps", description: "You found the pattern hidden in the silence between its attacks.", requiredFlags: ["ai-flag-raid7-listen"] },
    ],
  },
  {
    id: "ai-ch8",
    worldId: "aincrad",
    index: 8,
    title: "No Correct Path",
    subtitle: "Floor 8, The Iron Maze",
    summary: "A labyrinth that may or may not rearrange itself on purpose. It ends at the Iron Architect's unfinished center chamber.",
    startSceneId: "ai-scene-floor8-arrival",
    completionFlag: "ai-flag-ch8-complete",
    nextChapterId: "ai-ch9",
    outcomes: [
      { id: "ai-ch8-outcome-predict", title: "Reading Its Schedule", description: "You used Yuuki's proof of the maze's pattern to predict every reinforcement wave before it landed.", requiredFlags: ["ai-flag-raid8-predict"] },
      { id: "ai-ch8-outcome-fast", title: "Before It Could Rebuild", description: "You struck before the Architect could reinforce its own armor.", requiredFlags: ["ai-flag-raid8-fast"] },
      { id: "ai-ch8-outcome-patient", title: "Through the Cracks", description: "You waited for the rebuild and punished the exposed frame underneath.", requiredFlags: ["ai-flag-raid8-patient"] },
    ],
  },
  {
    id: "ai-ch9",
    worldId: "aincrad",
    index: 9,
    title: "Views From Higher Up",
    subtitle: "Floor 9, Skybreak Terrace",
    summary: "The highest floor yet, close enough to the Town of Beginnings to see it on a clear day. It ends at the Skybreak Sentinel.",
    startSceneId: "ai-scene-floor9-arrival",
    completionFlag: "ai-flag-ch9-complete",
    nextChapterId: "ai-ch10",
    outcomes: [
      { id: "ai-ch9-outcome-scout", title: "Reading the Break", description: "You called the storm's break before it happened, using the reading Wren carried from a scout she lost on Floor 3.", requiredFlags: ["ai-flag-raid9-scout"] },
      { id: "ai-ch9-outcome-mobile", title: "Outrunning the Storm", description: "You stayed mobile and never let the Sentinel's storm settle.", requiredFlags: ["ai-flag-raid9-mobile"] },
      { id: "ai-ch9-outcome-hold", title: "Weathering It Together", description: "You held your ground and weathered the storm as a party.", requiredFlags: ["ai-flag-raid9-hold"] },
    ],
  },
  {
    id: "ai-ch10",
    worldId: "aincrad",
    index: 10,
    title: "The Tenth Gate",
    subtitle: "Floor 10, The Gate",
    summary: "The milestone floor. Gatewatch's whole population is holding its breath for whoever attempts the Gate next — and this time, that's you.",
    startSceneId: "ai-scene-floor10-arrival",
    completionFlag: "ai-flag-ch10-complete",
    // No nextChapterId: floor 10 is the end of this vertical slice. Floors 11-99 remain unbuilt.
    outcomes: [
      { id: "ai-ch10-outcome-aggressive", title: "Ended It Fast", description: "You went in aggressive and closed the fight before the Gatekeeper could unseal its second weapon.", requiredFlags: ["ai-flag-raid10-aggressive"] },
      { id: "ai-ch10-outcome-patient", title: "Outlasted It", description: "You played the long game and let every phase cost the Gatekeeper something it couldn't get back.", requiredFlags: ["ai-flag-raid10-patient"] },
      { id: "ai-ch10-outcome-ilyana", title: "Finished Together", description: "Ilyana finished what she couldn't the first time — at your side, this time.", requiredFlags: ["ai-flag-ilyana-recruited"] },
    ],
  },
];

export const aincradChapters: ChapterDefinitionInput[] = [aincradChapter1, ...laterChapters];

export function determineAincradChapterOutcome(save: SaveGame): { id: string; title: string; description: string } {
  const flags = save.flags;
  const chapter = aincradChapters.find((c) => c.id === save.currentChapterId) ?? aincradChapter1;

  if (chapter.id === "ai-ch1") {
    if (flags.includes("ai-flag-zero-casualties")) return chapter.outcomes[0];
    if (flags.includes("ai-flag-guild-solo")) return chapter.outcomes[2];
    return chapter.outcomes[1];
  }

  if (chapter.id === "ai-ch10" && flags.includes("ai-flag-ilyana-recruited")) {
    return chapter.outcomes[2];
  }

  // Every later chapter follows the same two-flag raid-strategy pattern.
  const matched = chapter.outcomes.find((o) => (o.requiredFlags ?? []).every((f) => flags.includes(f)));
  return matched ?? chapter.outcomes[0];
}
