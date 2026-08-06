import type { ClassDefinition } from "@/types";

export const eliteAcademyClasses: ClassDefinition[] = [
  { id: "class-1a", name: "Class 1-A", points: 1180, description: "The academy's top performers. Consistent, disciplined, insufferably confident." },
  { id: "class-1b", name: "Class 1-B", points: 960, description: "Close behind 1-A, hungry to overtake them." },
  { id: "class-1c", name: "Class 1-C", points: 720, description: "Your class. Uneven, underestimated, and about to take an unexplained penalty." },
  { id: "class-1d", name: "Class 1-D", points: 640, description: "Written off by the school. They have nothing left to lose, which makes them dangerous." },
];

export const PLAYER_CLASS_ID = "class-1c";
