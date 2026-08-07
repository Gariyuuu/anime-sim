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
    nextChapterId: "ai-ch11",
    outcomes: [
      { id: "ai-ch10-outcome-aggressive", title: "Ended It Fast", description: "You went in aggressive and closed the fight before the Gatekeeper could unseal its second weapon.", requiredFlags: ["ai-flag-raid10-aggressive"] },
      { id: "ai-ch10-outcome-patient", title: "Outlasted It", description: "You played the long game and let every phase cost the Gatekeeper something it couldn't get back.", requiredFlags: ["ai-flag-raid10-patient"] },
      { id: "ai-ch10-outcome-ilyana", title: "Finished Together", description: "Ilyana finished what she couldn't the first time — at your side, this time.", requiredFlags: ["ai-flag-ilyana-recruited"] },
    ],
  },
  {
    id: "ai-ch11",
    worldId: "aincrad",
    index: 11,
    title: "The Sunken Archive",
    subtitle: "Floor 11, Waterline Camp",
    summary: "Ninety floors left past the Tenth Gate, and the first of them is a flooded library nobody's finished reading. It ends at the Archive Warden.",
    startSceneId: "ai-scene-floor11-arrival",
    completionFlag: "ai-flag-ch11-complete",
    nextChapterId: "ai-ch12",
    outcomes: [
      { id: "ai-ch11-outcome-fast", title: "Before the Flood Rose", description: "You struck before the archive's water level could climb any higher.", requiredFlags: ["ai-flag-raid11-fast"] },
      { id: "ai-ch11-outcome-careful", title: "Read Before You Fight", description: "You took the time to read the Warden's own posted archive rules first — and used them against it.", requiredFlags: ["ai-flag-raid11-careful"] },
    ],
  },
  {
    id: "ai-ch12",
    worldId: "aincrad",
    index: 12,
    title: "Ember Foundry",
    subtitle: "Floor 12, Forgeside",
    summary: "A floor built around a furnace that's never gone cold, tended by a smith who's never told anyone why. It ends at the Foundry Heart.",
    startSceneId: "ai-scene-floor12-arrival",
    completionFlag: "ai-flag-ch12-complete",
    nextChapterId: "ai-ch13",
    outcomes: [
      { id: "ai-ch12-outcome-cool", title: "Cooled It First", description: "You forced the furnace's heat down before committing to the fight.", requiredFlags: ["ai-flag-raid12-cool"] },
      { id: "ai-ch12-outcome-heat", title: "Fought Through the Heat", description: "You fought at full furnace heat and simply outlasted it.", requiredFlags: ["ai-flag-raid12-heat"] },
    ],
  },
  {
    id: "ai-ch13",
    worldId: "aincrad",
    index: 13,
    title: "Glasswind Reach",
    subtitle: "Floor 13, Dunerest",
    summary: "A desert of wind-carved glass, gorgeous and unforgiving in equal measure. It ends at the Wind-Cut Colossus.",
    startSceneId: "ai-scene-floor13-arrival",
    completionFlag: "ai-flag-ch13-complete",
    nextChapterId: "ai-ch14",
    outcomes: [
      { id: "ai-ch13-outcome-low", title: "Stayed Low", description: "You kept below the worst of the wind and fought on stable ground.", requiredFlags: ["ai-flag-raid13-low"] },
      { id: "ai-ch13-outcome-ride", title: "Rode the Wind", description: "You used the wind's own momentum against the Colossus.", requiredFlags: ["ai-flag-raid13-ride"] },
    ],
  },
  {
    id: "ai-ch14",
    worldId: "aincrad",
    index: 14,
    title: "The Hanging Gardens",
    subtitle: "Floor 14, Rootrest",
    summary: "Terraced gardens suspended over open air, tended by someone who believes they're the last living thing in Aincrad. It ends at the Garden Sovereign.",
    startSceneId: "ai-scene-floor14-arrival",
    completionFlag: "ai-flag-ch14-complete",
    nextChapterId: "ai-ch15",
    outcomes: [
      { id: "ai-ch14-outcome-spare", title: "Spared the Garden", description: "You fought carefully to avoid burning down the garden around you.", requiredFlags: ["ai-flag-raid14-spare"] },
      { id: "ai-ch14-outcome-burn", title: "Burned a Path Through", description: "You accepted the cost and cut straight through.", requiredFlags: ["ai-flag-raid14-burn"] },
    ],
  },
  {
    id: "ai-ch15",
    worldId: "aincrad",
    index: 15,
    title: "Duskmarch",
    subtitle: "Floor 15, Lastlight",
    summary: "The second confirmed milestone floor — a twilight march for the dead, kept by someone determined that none of them are forgotten. It ends at the Duskmarch Sovereign.",
    startSceneId: "ai-scene-floor15-arrival",
    completionFlag: "ai-flag-ch15-complete",
    nextChapterId: "ai-ch16",
    outcomes: [
      { id: "ai-ch15-outcome-aggressive", title: "Broke the March", description: "You went in hard and scattered the march before it could close ranks.", requiredFlags: ["ai-flag-raid15-aggressive"] },
      { id: "ai-ch15-outcome-patient", title: "Outlasted the Dusk", description: "You played the long game and let the dusk work against the Sovereign instead of you.", requiredFlags: ["ai-flag-raid15-patient"] },
      { id: "ai-ch15-outcome-corvin", title: "Every Name Recorded", description: "Corvin stood with you at the end of the march, ledger in hand.", requiredFlags: ["ai-flag-corvin-recruited"] },
    ],
  },
  {
    id: "ai-ch16",
    worldId: "aincrad",
    index: 16,
    title: "Ironclad Docks",
    subtitle: "Floor 16, Drydock Row",
    summary: "A harbor floor guarding a dry-docked warship hull nobody's supposed to still be inside of. It ends at the Dreadnought Hull.",
    startSceneId: "ai-scene-floor16-arrival",
    completionFlag: "ai-flag-ch16-complete",
    nextChapterId: "ai-ch17",
    outcomes: [
      { id: "ai-ch16-outcome-board", title: "Boarded It Directly", description: "You boarded the hull directly and fought it from the inside out.", requiredFlags: ["ai-flag-raid16-board"] },
      { id: "ai-ch16-outcome-sink", title: "Flooded It First", description: "You flooded the dry dock first and let the hull's own weight work against it.", requiredFlags: ["ai-flag-raid16-sink"] },
    ],
  },
  {
    id: "ai-ch17",
    worldId: "aincrad",
    index: 17,
    title: "The Silent Orchard",
    subtitle: "Floor 17, Quietrow",
    summary: "Rows of blossoming trees that make no sound at all, guarded by whatever the silence is actually protecting. It ends at the Withered Root.",
    startSceneId: "ai-scene-floor17-arrival",
    completionFlag: "ai-flag-ch17-complete",
    nextChapterId: "ai-ch18",
    outcomes: [
      { id: "ai-ch17-outcome-quiet", title: "Kept the Silence", description: "You fought as quietly as the orchard itself, out of a respect you didn't expect to feel.", requiredFlags: ["ai-flag-raid17-quiet"] },
      { id: "ai-ch17-outcome-loud", title: "Broke the Silence", description: "You broke the orchard's silence on purpose, and it changed the fight entirely.", requiredFlags: ["ai-flag-raid17-loud"] },
    ],
  },
  {
    id: "ai-ch18",
    worldId: "aincrad",
    index: 18,
    title: "Stormwatch Bastion",
    subtitle: "Floor 18, Stormwatch Garrison",
    summary: "A fortress floor mid-siege by a storm that's never actually broken, held by a captain who refuses to let it fall on his watch. It ends at the Stormwatch Warlord.",
    startSceneId: "ai-scene-floor18-arrival",
    completionFlag: "ai-flag-ch18-complete",
    nextChapterId: "ai-ch19",
    outcomes: [
      { id: "ai-ch18-outcome-formation", title: "Held Formation", description: "You held tight formation and let the bastion's own defenses do half the work.", requiredFlags: ["ai-flag-raid18-formation"] },
      { id: "ai-ch18-outcome-break", title: "Broke Formation", description: "You broke formation on purpose to hit the Warlord from an angle it never planned for.", requiredFlags: ["ai-flag-raid18-break"] },
    ],
  },
  {
    id: "ai-ch19",
    worldId: "aincrad",
    index: 19,
    title: "The Withering Court",
    subtitle: "Floor 19, Court's Edge",
    summary: "A palace floor built for a royal court that never had any actual subjects, one floor short of the next confirmed gate. It ends at the Faded Monarch.",
    startSceneId: "ai-scene-floor19-arrival",
    completionFlag: "ai-flag-ch19-complete",
    nextChapterId: "ai-ch20",
    outcomes: [
      { id: "ai-ch19-outcome-honor", title: "Honored the Court", description: "You played by the court's own faded rules of engagement, and it respected that more than force.", requiredFlags: ["ai-flag-raid19-honor"] },
      { id: "ai-ch19-outcome-ignore", title: "Ignored the Ceremony", description: "You ignored every ceremonial rule and just won.", requiredFlags: ["ai-flag-raid19-ignore"] },
    ],
  },
  {
    id: "ai-ch20",
    worldId: "aincrad",
    index: 20,
    title: "The Twentieth Spire",
    subtitle: "Floor 20, Spirebase",
    summary: "The third confirmed milestone floor. From its peak you can see farther up Aincrad than anyone's ever confirmed reaching — and this time, that's about to be you.",
    startSceneId: "ai-scene-floor20-arrival",
    completionFlag: "ai-flag-ch20-complete",
    // No nextChapterId: floor 20 is the end of this vertical slice. Floors 21-99 remain unbuilt.
    outcomes: [
      { id: "ai-ch20-outcome-aggressive", title: "Ended It Fast", description: "You went in aggressive and closed the fight before the Warden could unseal a weapon nobody's seen it use.", requiredFlags: ["ai-flag-raid20-aggressive"] },
      { id: "ai-ch20-outcome-patient", title: "Outlasted It", description: "You played the long game and let every phase cost the Warden something it couldn't get back.", requiredFlags: ["ai-flag-raid20-patient"] },
      { id: "ai-ch20-outcome-renn", title: "Finished Together", description: "Renn finally didn't have to attempt this floor alone.", requiredFlags: ["ai-flag-renn-recruited"] },
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
  if (chapter.id === "ai-ch15" && flags.includes("ai-flag-corvin-recruited")) {
    return chapter.outcomes[2];
  }
  if (chapter.id === "ai-ch20" && flags.includes("ai-flag-renn-recruited")) {
    return chapter.outcomes[2];
  }

  // Every later chapter follows the same two-flag raid-strategy pattern.
  const matched = chapter.outcomes.find((o) => (o.requiredFlags ?? []).every((f) => flags.includes(f)));
  return matched ?? chapter.outcomes[0];
}
