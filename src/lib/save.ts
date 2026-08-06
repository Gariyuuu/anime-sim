import { db } from "./db";
import { SaveGameSchema, SaveSlotSummarySchema, type SaveGame, type SaveSlotSummary } from "@/types/save";

export const AUTOSAVE_SLOT_ID = "autosave";

export async function listSaveSlots(): Promise<SaveSlotSummary[]> {
  if (!db) return [];
  const all = await db.saves.orderBy("updatedAt").reverse().toArray();
  return all.map(toSummary);
}

export function toSummary(save: SaveGame): SaveSlotSummary {
  const isElite = save.worldId === "elite-academy";
  return SaveSlotSummarySchema.parse({
    slotId: save.slotId,
    chapterName: save.chapterName,
    worldId: save.worldId,
    playerName: save.player.name,
    levelOrRank: isElite ? `Reputation ${save.player.elite.reputation}` : `Level ${save.player.aincrad.level} · Floor ${save.player.aincrad.floorProgress}`,
    playtimeSeconds: save.playtimeSeconds,
    updatedAt: save.updatedAt,
    thumbnailGlyph: isElite ? "graduation-cap" : "sword",
    thumbnailColor: isElite ? "#3b3b3b" : "#7a5cff",
  });
}

export async function persistSave(save: SaveGame): Promise<void> {
  if (!db) return;
  const validated = SaveGameSchema.parse({ ...save, updatedAt: Date.now() });
  await db.saves.put(validated);
}

export async function loadSaveSlot(slotId: string): Promise<SaveGame | null> {
  if (!db) return null;
  const raw = await db.saves.get(slotId);
  if (!raw) return null;
  const result = SaveGameSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export async function deleteSaveSlot(slotId: string): Promise<void> {
  if (!db) return;
  await db.saves.delete(slotId);
}

export function exportSave(save: SaveGame): string {
  return JSON.stringify(save, null, 2);
}

export function importSave(json: string): SaveGame {
  const parsed = JSON.parse(json);
  return SaveGameSchema.parse(parsed);
}

const SETTINGS_LOCALSTORAGE_KEY = "anime-sim-settings";

export function saveSettingsToLocalStorage(settings: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable (private mode, quota) — settings simply won't persist
  }
}

export function loadSettingsFromLocalStorage(): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETTINGS_LOCALSTORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
