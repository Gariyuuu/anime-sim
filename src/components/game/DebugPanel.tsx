"use client";

import { useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { Modal } from "@/components/ui/Modal";
import { RetroButton } from "@/components/ui/RetroButton";
import { maps, quests } from "@/content/registry";
import { CORE_STAT_KEYS } from "@/types/common";

const DEBUG_ENABLED = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true";

export function DebugPanel() {
  const debugOpen = useGameStore((s) => s.debugOpen);
  const toggleDebug = useGameStore((s) => s.toggleDebug);
  const save = useGameStore((s) => s.save);
  const debugSetFlag = useGameStore((s) => s.debugSetFlag);
  const debugClearFlag = useGameStore((s) => s.debugClearFlag);
  const debugTeleport = useGameStore((s) => s.debugTeleport);
  const debugModifyStat = useGameStore((s) => s.debugModifyStat);
  const applyEffectsBatch = useGameStore((s) => s.applyEffectsBatch);
  const [flagInput, setFlagInput] = useState("");

  if (!DEBUG_ENABLED || !save) return null;

  return (
    <>
      <button
        onClick={() => toggleDebug()}
        className="fixed bottom-2 right-2 z-40 rounded border-2 border-ink-950 bg-accent-warning px-2 py-1 text-[9px] uppercase tracking-widest text-paper-0 opacity-70 hover:opacity-100"
      >
        Debug
      </button>
      <Modal open={debugOpen} onClose={() => toggleDebug(false)} title="Developer Debug Panel" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <section>
            <p className="mb-1 text-[10px] font-bold uppercase text-ink-500">Core Stats</p>
            <div className="flex flex-wrap gap-1.5">
              {CORE_STAT_KEYS.map((k) => (
                <div key={k} className="flex items-center gap-1 rounded border border-ink-300 px-1.5 py-0.5 text-[10px]">
                  <span>
                    {k}: {save.player.core[k]}
                  </span>
                  <button onClick={() => debugModifyStat(k, 1)} className="px-1">
                    +
                  </button>
                  <button onClick={() => debugModifyStat(k, -1)} className="px-1">
                    -
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-1 text-[10px] font-bold uppercase text-ink-500">Teleport</p>
            <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
              {maps
                .filter((m) => m.worldId === save.worldId)
                .map((m) => (
                  <button key={m.id} onClick={() => debugTeleport(m.id)} className="rounded border border-ink-300 px-1.5 py-0.5 text-[10px] hover:border-ink-950">
                    {m.name}
                  </button>
                ))}
            </div>
          </section>

          <section>
            <p className="mb-1 text-[10px] font-bold uppercase text-ink-500">Story Flags ({save.flags.length})</p>
            <div className="mb-1 flex gap-1">
              <input
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="flag-id"
                className="flex-1 rounded border-2 border-ink-300 px-1.5 py-0.5 text-[10px]"
              />
              <RetroButton
                onClick={() => {
                  if (flagInput) debugSetFlag(flagInput);
                  setFlagInput("");
                }}
              >
                Set
              </RetroButton>
            </div>
            <div className="max-h-32 overflow-y-auto rounded border border-ink-200 p-1">
              {save.flags.map((f) => (
                <div key={f} className="flex items-center justify-between text-[10px]">
                  <span className="truncate">{f}</span>
                  <button onClick={() => debugClearFlag(f)} className="text-accent-danger">
                    clear
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-1 text-[10px] font-bold uppercase text-ink-500">Quests</p>
            <div className="max-h-32 overflow-y-auto">
              {quests
                .filter((q) => q.worldId === save.worldId)
                .map((q) => (
                  <div key={q.id} className="flex items-center justify-between text-[10px]">
                    <span className="truncate">{q.title}</span>
                    <div className="flex gap-1">
                      <button onClick={() => applyEffectsBatch([{ type: "startQuest", questId: q.id }])}>start</button>
                      <button onClick={() => applyEffectsBatch([{ type: "completeQuest", questId: q.id }])}>complete</button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="sm:col-span-2">
            <p className="mb-1 text-[10px] font-bold uppercase text-ink-500">Export State</p>
            <textarea readOnly value={JSON.stringify(save, null, 2)} className="h-32 w-full rounded border-2 border-ink-300 p-1 font-mono text-[9px]" />
          </section>

          <section className="sm:col-span-2">
            <RetroButton
              variant="danger"
              onClick={() => {
                if (confirm("Reset the current save? This cannot be undone.")) useGameStore.getState().debugResetSave();
              }}
            >
              Reset Save
            </RetroButton>
          </section>
        </div>
      </Modal>
    </>
  );
}
