import { describe, it, expect } from "vitest";
import { SaveGameSchema } from "@/types/save";
import { exportSave, importSave } from "@/lib/save";
import { makeSave } from "./fixtures";

describe("save serialization", () => {
  it("round-trips a save through export/import without loss", () => {
    const save = makeSave({ flags: ["a", "b"], playtimeSeconds: 4200 });
    const json = exportSave(save);
    const imported = importSave(json);
    expect(imported).toEqual(save);
  });

  it("throws on structurally invalid JSON (missing required fields)", () => {
    expect(() => importSave(JSON.stringify({ hello: "world" }))).toThrow();
  });

  it("throws on malformed JSON text", () => {
    expect(() => importSave("{not valid json")).toThrow();
  });

  it("rejects an out-of-range stat instead of silently accepting it", () => {
    const save = makeSave();
    const corrupted = { ...save, player: { ...save.player, core: { ...save.player.core, intelligence: 999 } } };
    expect(() => importSave(JSON.stringify(corrupted))).toThrow();
  });

  it("SaveGameSchema.safeParse reports failure without throwing, for load-time handling", () => {
    const result = SaveGameSchema.safeParse({ not: "a save" });
    expect(result.success).toBe(false);
  });
});
