"use client";

import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import { patchNotes } from "@/content/registry";

export function PatchNotesScreen({ onBack }: { onBack?: () => void }) {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 pb-10">
        <h1 className="font-display mb-6 text-center text-sm text-ink-950">Patch Notes</h1>

        <div className="w-full max-w-2xl space-y-4">
          {patchNotes.map((note) => (
            <Panel key={note.version} title={`v${note.version} — ${note.title}`}>
              <p className="mb-3 text-[10px] uppercase tracking-widest text-ink-500">{note.date}</p>

              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent-success">Completed</p>
              <ul className="mb-3 space-y-1">
                {note.completed.map((line) => (
                  <li key={line} className="flex gap-1.5 text-[11px] text-ink-700">
                    <Icon name="check" size={12} className="mt-0.5 shrink-0 text-accent-success" />
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent-warning">Known Issues</p>
              <ul className="mb-3 space-y-1">
                {note.knownIssues.map((line) => (
                  <li key={line} className="flex gap-1.5 text-[11px] text-ink-700">
                    <Icon name="alert-triangle" size={12} className="mt-0.5 shrink-0 text-accent-warning" />
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent-info">Upcoming</p>
              <ul className="space-y-1">
                {note.upcoming.map((line) => (
                  <li key={line} className="flex gap-1.5 text-[11px] text-ink-700">
                    <Icon name="arrow-right" size={12} className="mt-0.5 shrink-0 text-accent-info" />
                    {line}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>

        <RetroButton variant="ghost" className="mt-8" onClick={() => (onBack ? onBack() : setScreen(save ? "game" : "title"))} icon={<Icon name="arrow-left" size={14} />}>
          Back
        </RetroButton>
      </div>
    </ScreenFrame>
  );
}
