import Dexie, { type Table } from "dexie";
import type { SaveGame } from "@/types";

export class AnimeSimDatabase extends Dexie {
  saves!: Table<SaveGame, string>;

  constructor() {
    super("anime-sim-db");
    this.version(1).stores({
      saves: "slotId, worldId, updatedAt",
    });
  }
}

export const db = typeof window !== "undefined" ? new AnimeSimDatabase() : null;
