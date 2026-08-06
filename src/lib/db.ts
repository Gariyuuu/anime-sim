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

// Guards on indexedDB specifically (not just `window`) so this stays null under jsdom-based
// tests, which define `window` but don't implement IndexedDB.
export const db = typeof indexedDB !== "undefined" ? new AnimeSimDatabase() : null;
