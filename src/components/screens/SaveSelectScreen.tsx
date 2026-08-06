"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { listSaveSlots, deleteSaveSlot, loadSaveSlot, exportSave, importSave, persistSave } from "@/lib/save";
import type { SaveSlotSummary } from "@/types";
import { formatPlaytime, formatTimestamp } from "@/lib/utils";

export function SaveSelectScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const loadGame = useGameStore((s) => s.loadGame);
  const [slots, setSlots] = useState<SaveSlotSummary[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setSlots(await listSaveSlots());
  }
  useEffect(() => {
    listSaveSlots().then(setSlots);
  }, []);

  async function handleExport(slotId: string) {
    const save = await loadSaveSlot(slotId);
    if (!save) return;
    const blob = new Blob([exportSave(save)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anime-sim-${slotId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    const text = await file.text();
    try {
      const save = importSave(text);
      await persistSave(save);
      await refresh();
    } catch {
      alert("That save file couldn't be read. It may be corrupted or from an incompatible version.");
    }
  }

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6">
        <h1 className="font-display mb-6 text-center text-sm text-ink-950">Load Game</h1>

        {slots.length === 0 && <p className="mb-6 text-xs text-ink-500">No saves yet. Start a new story from the title screen.</p>}

        <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          {slots.map((slot) => (
            <Panel key={slot.slotId} accent={slot.thumbnailColor}>
              <div className="flex items-start gap-3">
                <div className="rounded border-2 border-ink-950 p-2" style={{ background: slot.thumbnailColor }}>
                  <Icon name={slot.thumbnailGlyph} size={20} color="var(--paper-0)" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">{slot.playerName}</p>
                  <p className="text-[10px] text-ink-600">{slot.chapterName}</p>
                  <p className="text-[10px] text-ink-500">{slot.levelOrRank}</p>
                  <p className="text-[9px] text-ink-400">
                    {formatPlaytime(slot.playtimeSeconds)} · {formatTimestamp(slot.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <RetroButton variant="primary" onClick={() => loadGame(slot.slotId)} icon={<Icon name="play" size={12} />}>
                  Load
                </RetroButton>
                <RetroButton variant="secondary" onClick={() => handleExport(slot.slotId)} icon={<Icon name="download" size={12} />}>
                  Export
                </RetroButton>
                <RetroButton variant="danger" onClick={() => setPendingDelete(slot.slotId)} icon={<Icon name="trash-2" size={12} />}>
                  Delete
                </RetroButton>
              </div>
            </Panel>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <RetroButton variant="secondary" onClick={() => fileInputRef.current?.click()} icon={<Icon name="upload" size={14} />}>
            Import Save
          </RetroButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
          <RetroButton variant="ghost" onClick={() => setScreen("title")} icon={<Icon name="arrow-left" size={14} />}>
            Back
          </RetroButton>
        </div>
      </div>

      <Modal open={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete Save?">
        <p className="mb-4 text-xs text-ink-700">This can&apos;t be undone. Consider exporting it first if you might want it later.</p>
        <div className="flex justify-end gap-2">
          <RetroButton variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </RetroButton>
          <RetroButton
            variant="danger"
            onClick={async () => {
              if (pendingDelete) await deleteSaveSlot(pendingDelete);
              setPendingDelete(null);
              refresh();
            }}
          >
            Delete
          </RetroButton>
        </div>
      </Modal>
    </ScreenFrame>
  );
}
