import type { ChapterDefinitionInput } from "@/types";
import type { SaveGame } from "@/types/save";

export const eliteAcademyChapter1: ChapterDefinitionInput = {
  id: "ea-ch1",
  worldId: "elite-academy",
  index: 1,
  title: "The First Ranking",
  subtitle: "Class 1-C, Week One",
  summary:
    "A transfer student arrives at the Advanced Integrated Academy, meets Class 1-C, and uncovers who's been quietly bleeding the class of points.",
  startSceneId: "ea-scene-arrival",
  completionFlag: "ea-flag-chapter1-complete",
  nextChapterId: "ea-ch2",
  outcomes: [
    { id: "ea-outcome-trusted-ally", title: "Trusted Ally", description: "You protected the people who trusted you, even when it cost you leverage. 1-C trusts you — and that trust is worth more than points.", requiredFlags: ["ea-flag-notebook-protected", "ea-flag-daichi-reported"] },
    { id: "ea-outcome-quiet-operator", title: "Quiet Operator", description: "You collected secrets instead of spending them loudly. Nobody fully trusts you, but everybody's a little afraid of what you know.", requiredFlags: ["ea-flag-daichi-leveraged"] },
    { id: "ea-outcome-isolated-outsider", title: "Isolated Outsider", description: "Whatever you did to get through the first exam, it cost you. 1-C survived — but you're on the outside of it now.", requiredFlags: ["ea-flag-betrayed-yuzuki"] },
  ],
};

const laterChapters: ChapterDefinitionInput[] = [
  {
    id: "ea-ch2",
    worldId: "elite-academy",
    index: 2,
    title: "The Watcher's Game",
    subtitle: "Class 1-C, Week Three",
    summary: "A second message from the unlisted account arrives. The player decides whether chasing its source is worth the risk.",
    startSceneId: "ea-scene-ch2-arrival",
    completionFlag: "ea-flag-ch2-complete",
    nextChapterId: "ea-ch3",
    outcomes: [
      { id: "ea-ch2-outcome-pinpointed", title: "Rattled Them", description: "You pieced together every clue and pushed hard enough that the watcher actually reacted. Someone up there is not as untouchable as they thought.", requiredFlags: ["ea-flag-ch2-pinpointed"] },
      { id: "ea-ch2-outcome-investigated", title: "Closing In", description: "You didn't find a name, but you narrowed the search to someone with real institutional access.", requiredFlags: ["ea-flag-ch2-investigated"] },
      { id: "ea-ch2-outcome-bluffed", title: "A Convincing Lie", description: "You bluffed your way to a reaction without ever having real proof. It worked anyway.", requiredFlags: ["ea-flag-ch2-bluffed"] },
      { id: "ea-ch2-outcome-ignored", title: "Staying Focused", description: "You let the mystery wait and put your effort into the ranking board instead.", requiredFlags: ["ea-flag-ch2-ignored"] },
    ],
  },
  {
    id: "ea-ch3",
    worldId: "elite-academy",
    index: 3,
    title: "Silent Majority",
    subtitle: "Class 1-C, The Nomination Exam",
    summary: "Each class must anonymously nominate a member to have their private points seized. The vote turns the classroom against itself.",
    startSceneId: "ea-scene-ch3-arrival",
    completionFlag: "ea-flag-ch3-complete",
    nextChapterId: "ea-ch4",
    outcomes: [
      { id: "ea-ch3-outcome-protected", title: "Nobody Nominated", description: "You steered the vote away from Souta entirely. He knows exactly what that cost you.", requiredFlags: ["ea-flag-ch3-protected-souta"] },
      { id: "ea-ch3-outcome-cold", title: "Cold Numbers", description: "You let the vote run on pure numbers. It wasn't personal. It still landed on someone.", requiredFlags: ["ea-flag-ch3-cold-numbers"] },
      { id: "ea-ch3-outcome-deflected", title: "A Convenient Lie", description: "You deflected the vote onto Rei with a bluff that worked — and that she now, rightly, suspects.", requiredFlags: ["ea-flag-ch3-deflected-rei"] },
    ],
  },
  {
    id: "ea-ch4",
    worldId: "elite-academy",
    index: 4,
    title: "Paper Trails",
    subtitle: "Class 1-C, A Rumor Campaign",
    summary: "A specific, damaging rumor starts circulating — one the player never said and never did.",
    startSceneId: "ea-scene-ch4-arrival",
    completionFlag: "ea-flag-ch4-complete",
    nextChapterId: "ea-ch5",
    outcomes: [
      { id: "ea-ch4-outcome-pinpointed", title: "Not a Classmate", description: "You followed the pattern all the way to its source and confirmed what you suspected: someone's been watching you since before this rumor ever started.", requiredFlags: ["ea-flag-ch4-pinpointed"] },
      { id: "ea-ch4-outcome-confronted", title: "Faced It Head-On", description: "You denied it publicly and loudly. Not everyone believed you. Enough did.", requiredFlags: ["ea-flag-ch4-confronted"] },
      { id: "ea-ch4-outcome-traced", title: "Followed the Trail", description: "You traced the rumor quietly instead of reacting to it — and the trail led somewhere uncomfortable.", requiredFlags: ["ea-flag-ch4-traced"] },
      { id: "ea-ch4-outcome-ignored", title: "Let It Pass", description: "You didn't react at all. Most of it faded. Some of it stuck anyway.", requiredFlags: ["ea-flag-ch4-ignored"] },
    ],
  },
  {
    id: "ea-ch5",
    worldId: "elite-academy",
    index: 5,
    title: "The Away Exam",
    subtitle: "Off-Campus Retreat",
    summary: "A multi-day survival exam with randomly assigned teams. Kenta's past catches up to him on the trail.",
    startSceneId: "ea-scene-ch5-arrival",
    completionFlag: "ea-flag-ch5-complete",
    nextChapterId: "ea-ch6",
    outcomes: [
      { id: "ea-ch5-outcome-helped", title: "Nobody Left Behind", description: "You slowed your own team down to help a struggling Class 1-D team finish. It cost you standing. It was worth it.", requiredFlags: ["ea-flag-ch5-helped-1d"] },
      { id: "ea-ch5-outcome-focused", title: "Results First", description: "You focused on your own team's score. It worked exactly as the exam intended it to.", requiredFlags: ["ea-flag-ch5-focused-own"] },
    ],
  },
  {
    id: "ea-ch6",
    worldId: "elite-academy",
    index: 6,
    title: "Midterm Reckoning",
    subtitle: "Class 1-C vs. Class 1-A",
    summary: "Midterms pit 1-C directly against the top-ranked class. Rei's hidden standing is on the line whether she says so or not.",
    startSceneId: "ea-scene-ch6-arrival",
    completionFlag: "ea-flag-ch6-complete",
    nextChapterId: "ea-ch7",
    outcomes: [
      { id: "ea-ch6-outcome-exploited", title: "An Unfair Advantage", description: "You used Daichi's insider intel to target exactly where 1-A was weakest. The class won bigger than anyone expected — and you're the only one who knows why.", requiredFlags: ["ea-flag-ch6-exploited-intel"] },
      { id: "ea-ch6-outcome-individual", title: "Top of the Class", description: "You pushed for the highest individual score you could manage, and got it.", requiredFlags: ["ea-flag-ch6-individual"] },
      { id: "ea-ch6-outcome-tutored", title: "Carried Them Up", description: "You spent your study time tutoring the weaker scorers instead of chasing your own mark.", requiredFlags: ["ea-flag-ch6-tutored"] },
    ],
  },
  {
    id: "ea-ch7",
    worldId: "elite-academy",
    index: 7,
    title: "Cracks in the Board",
    subtitle: "The Council, After Daichi",
    summary: "Whatever the player did with what they learned about Daichi has consequences now — and an opening in the council's influence besides.",
    startSceneId: "ea-scene-ch7-arrival",
    completionFlag: "ea-flag-ch7-complete",
    nextChapterId: "ea-ch8",
    outcomes: [
      { id: "ea-ch7-outcome-backed-rei", title: "A Partner in the Council", description: "You backed Rei for the open seat instead of taking it yourself. She won't forget it.", requiredFlags: ["ea-flag-ch7-backed-rei"] },
      { id: "ea-ch7-outcome-took", title: "New Influence", description: "You stepped into the gap Daichi's fall left behind. People bring you information now.", requiredFlags: ["ea-flag-ch7-took-influence"] },
      { id: "ea-ch7-outcome-stayed-out", title: "Staying Clean", description: "You saw exactly what that kind of influence costs, up close, and chose to stay out of it.", requiredFlags: ["ea-flag-ch7-stayed-out"] },
    ],
  },
  {
    id: "ea-ch8",
    worldId: "elite-academy",
    index: 8,
    title: "The Trade War",
    subtitle: "The Point Exchange",
    summary: "Private points become an open market between all four classes for one exam window — and someone is always going to get exploited.",
    startSceneId: "ea-scene-ch8-arrival",
    completionFlag: "ea-flag-ch8-complete",
    nextChapterId: "ea-ch9",
    outcomes: [
      { id: "ea-ch8-outcome-fair", title: "Fair Trade", description: "You bought points from Class 1-D at a fair rate, at real cost to yourself.", requiredFlags: ["ea-flag-ch8-fair-trade"] },
      { id: "ea-ch8-outcome-exploited", title: "The Same Game Everyone Else Played", description: "You bought in at the exploitative rate everyone else was offering, and came out ahead for it.", requiredFlags: ["ea-flag-ch8-exploited"] },
      { id: "ea-ch8-outcome-abstained", title: "Watched It Happen", description: "You sat the market out and watched the exam's real lesson play out around you instead.", requiredFlags: ["ea-flag-ch8-abstained"] },
    ],
  },
  {
    id: "ea-ch9",
    worldId: "elite-academy",
    index: 9,
    title: "Unmasking",
    subtitle: "The Watcher, Revealed",
    summary: "The pattern behind the unlisted account's messages finally resolves to a name the player already knows.",
    startSceneId: "ea-scene-ch9-arrival",
    completionFlag: "ea-flag-ch9-complete",
    nextChapterId: "ea-ch10",
    outcomes: [
      { id: "ea-ch9-outcome-confronted", title: "Said It Out Loud", description: "You named her directly. She respected that more than she expected to.", requiredFlags: ["ea-flag-ch9-confronted"] },
      { id: "ea-ch9-outcome-silent", title: "Let Her Say It", description: "You said nothing and let her be the one to admit it.", requiredFlags: ["ea-flag-ch9-silent"] },
    ],
  },
  {
    id: "ea-ch10",
    worldId: "elite-academy",
    index: 10,
    title: "The Final Ranking",
    subtitle: "Year's End",
    summary: "The year-end exam settles final class standing — and, unofficially, what kind of student the player actually turned out to be.",
    startSceneId: "ea-scene-ch10-arrival",
    completionFlag: "ea-flag-ch10-complete",
    // No nextChapterId: this is the end of this vertical slice's Elite Academy arc.
    outcomes: [
      { id: "ea-ch10-outcome-solo", title: "Your Own Story", description: "You maximized your own individual ranking and finished the year on your own terms.", requiredFlags: ["ea-flag-ch10-solo-finish"] },
      { id: "ea-ch10-outcome-class", title: "Carried the Class", description: "You carried the whole of 1-C up with you, at real cost to your own individual score.", requiredFlags: ["ea-flag-ch10-class-finish"] },
      { id: "ea-ch10-outcome-safe", title: "Exactly as Calculated", description: "You played it safe and controlled, right to the very end.", requiredFlags: ["ea-flag-ch10-safe-finish"] },
    ],
  },
];

export const eliteAcademyChapters: ChapterDefinitionInput[] = [eliteAcademyChapter1, ...laterChapters];

export function determineEliteChapterOutcome(save: SaveGame): { id: string; title: string; description: string } {
  const flags = save.flags;
  const chapter = eliteAcademyChapters.find((c) => c.id === save.currentChapterId) ?? eliteAcademyChapter1;

  if (chapter.id === "ea-ch1") {
    if (flags.includes("ea-flag-betrayed-yuzuki") && save.player.elite.trust < 45) return chapter.outcomes[2];
    if (flags.includes("ea-flag-notebook-protected") && !flags.includes("ea-flag-betrayed-yuzuki") && save.player.elite.trust >= 55) return chapter.outcomes[0];
    return chapter.outcomes[1];
  }

  const matched = chapter.outcomes.find((o) => (o.requiredFlags ?? []).every((f) => flags.includes(f)));
  return matched ?? chapter.outcomes[0];
}
