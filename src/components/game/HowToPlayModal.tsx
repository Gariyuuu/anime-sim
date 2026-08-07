"use client";

import { useGameStore } from "@/state/gameStore";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";

const STEPS: { icon: string; title: string; body: string }[] = [
  {
    icon: "move",
    title: "Move around",
    body: "WASD or the arrow keys move your character. You can also click/tap anywhere on the map to walk there.",
  },
  {
    icon: "hand",
    title: "Interact",
    body: "Walk up to a glowing marker — a person, an object, a door — until its label pops up, then press SPACE, ENTER, or click it to interact.",
  },
  {
    icon: "door-open",
    title: "Doors lead to new rooms",
    body: "Blue circular markers are always doors or stairs. Interact with one the same way to travel there — that's how you leave a room.",
  },
  {
    icon: "message-square",
    title: "Dialogue",
    body: "Click, tap, or press SPACE to advance a line. When choices appear, pick one — some are timed, so don't wait too long.",
  },
  {
    icon: "smartphone",
    title: "Check your device",
    body: "Press I, or tap the phone icon, to open your device: quests, relationships, inventory, the map, and — once unlocked — a Chapters tab to jump back to any chapter you've reached.",
  },
  {
    icon: "swords",
    title: "Combat",
    body: "Turn-based: attack, use a skill, guard, dodge, or use an item. Timing your attack input right after selecting it adds bonus damage.",
  },
];

export function HowToPlayModal() {
  const helpOpen = useGameStore((s) => s.helpOpen);
  const toggleHelp = useGameStore((s) => s.toggleHelp);

  return (
    <Modal open={helpOpen} onClose={() => toggleHelp(false)} title="How to Play" wide>
      <div className="grid gap-3 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.title} className="flex items-start gap-2.5 rounded border-2 border-ink-950 bg-paper-0 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink-950" style={{ background: "var(--accent-warning)" }}>
              <Icon name={step.icon} size={16} color="var(--paper-0)" />
            </div>
            <div>
              <p className="text-xs font-bold">{step.title}</p>
              <p className="text-[11px] leading-snug text-ink-600">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-ink-400">
        Reopen this anytime from the ? button next to your location name.
      </p>
    </Modal>
  );
}
