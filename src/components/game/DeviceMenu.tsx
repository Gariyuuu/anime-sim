"use client";

import { useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { StatBar } from "@/components/ui/StatBar";
import { RetroButton } from "@/components/ui/RetroButton";
import { getNpc, getItem, getQuest, getMap } from "@/content/registry";
import { getMessageDefinition } from "@/content/messages";
import { CORE_STAT_KEYS } from "@/types/common";
import { RELATIONSHIP_AXES } from "@/types/common";
import { cn } from "@/lib/utils";

type Tab = "messages" | "contacts" | "quests" | "stats" | "inventory" | "map" | "achievements" | "settings";

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "messages", label: "Messages", icon: "mail" },
  { id: "contacts", label: "Contacts", icon: "users" },
  { id: "quests", label: "Quests", icon: "scroll-text" },
  { id: "stats", label: "Stats", icon: "bar-chart-2" },
  { id: "inventory", label: "Inventory", icon: "backpack" },
  { id: "map", label: "Map", icon: "map" },
  { id: "achievements", label: "Awards", icon: "award" },
  { id: "settings", label: "System", icon: "settings" },
];

export function DeviceMenu() {
  const deviceOpen = useGameStore((s) => s.deviceOpen);
  const toggleDevice = useGameStore((s) => s.toggleDevice);
  const save = useGameStore((s) => s.save);
  const setScreen = useGameStore((s) => s.setScreen);
  const [tab, setTab] = useState<Tab>("messages");

  if (!save) return null;
  const isElite = save.worldId === "elite-academy";

  return (
    <Modal open={deviceOpen} onClose={() => toggleDevice(false)} title={isElite ? "School Device" : "System Window"} wide>
      <div className="mb-3 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1 rounded border-2 px-2 py-1 text-[10px] uppercase tracking-wide",
              tab === t.id ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300 text-ink-700 hover:border-ink-950",
            )}
          >
            <Icon name={t.icon} size={11} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-h-[55vh] overflow-y-auto pr-1">
        {tab === "messages" && <MessagesTab />}
        {tab === "contacts" && <ContactsTab />}
        {tab === "quests" && <QuestsTab />}
        {tab === "stats" && <StatsTab />}
        {tab === "inventory" && <InventoryTab />}
        {tab === "map" && <MapTab />}
        {tab === "achievements" && (
          <div className="text-center">
            <p className="mb-2 text-xs text-ink-600">Open the full achievements list from the menu.</p>
            <RetroButton
              onClick={() => {
                toggleDevice(false);
                setScreen("achievements");
              }}
            >
              Open Achievements
            </RetroButton>
          </div>
        )}
        {tab === "settings" && (
          <div className="text-center">
            <RetroButton
              onClick={() => {
                toggleDevice(false);
                setScreen("settings");
              }}
            >
              Open Settings
            </RetroButton>
          </div>
        )}
      </div>
    </Modal>
  );
}

function MessagesTab() {
  const save = useGameStore((s) => s.save)!;
  const markMessagesRead = useGameStore((s) => s.markMessagesRead);
  if (save.messages.length === 0) return <p className="text-xs text-ink-500">No messages yet.</p>;
  return (
    <div className="space-y-2">
      {[...save.messages].reverse().map((m) => {
        const npc = getNpc(m.npcId);
        const def = getMessageDefinition(m.messageId);
        return (
          <div key={m.id} className="rounded border-2 border-ink-300 p-2">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-bold">{npc?.fullName ?? m.npcId}</p>
              {!m.read && <Badge color="var(--accent-warning)">new</Badge>}
            </div>
            {def && <p className="mb-0.5 text-[10px] italic text-ink-500">{def.subject}</p>}
            <p className="text-[11px] text-ink-700">{def?.text ?? m.messageId}</p>
          </div>
        );
      })}
      <RetroButton variant="secondary" onClick={markMessagesRead}>
        Mark all read
      </RetroButton>
    </div>
  );
}

function ContactsTab() {
  const save = useGameStore((s) => s.save)!;
  if (save.relationships.length === 0) return <p className="text-xs text-ink-500">No relationships tracked yet — go meet people.</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {save.relationships.map((rel) => {
        const npc = getNpc(rel.npcId);
        if (!npc) return null;
        return (
          <div key={rel.npcId} className="rounded border-2 border-ink-300 p-2">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink-950" style={{ background: npc.portraitColor }}>
                <Icon name={npc.portraitGlyph} size={12} color="var(--paper-0)" />
              </div>
              <div>
                <p className="text-xs font-bold">{npc.fullName}</p>
                <p className="text-[9px] uppercase text-ink-500">{rel.mood}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {RELATIONSHIP_AXES.map((axis) => (
                <StatBar key={axis} label={axis} value={rel[axis] + 100} max={200} size="sm" showNumbers={false} color="var(--accent-info)" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestsTab() {
  const save = useGameStore((s) => s.save)!;
  if (save.quests.length === 0) return <p className="text-xs text-ink-500">No active quests yet.</p>;
  return (
    <div className="space-y-2">
      {save.quests.map((qp) => {
        const def = getQuest(qp.questId);
        if (!def) return null;
        return (
          <div key={qp.questId} className="rounded border-2 border-ink-300 p-2">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-bold">{def.title}</p>
              <Badge color={qp.state === "complete" ? "var(--accent-success)" : qp.state === "failed" ? "var(--accent-danger)" : "var(--accent-info)"}>{qp.state}</Badge>
            </div>
            <p className="mb-1 text-[10px] text-ink-500">{def.type} quest</p>
            <ul className="space-y-0.5">
              {def.objectives.map((o) => (
                <li key={o.id} className="flex items-center gap-1.5 text-[11px] text-ink-700">
                  <Icon name={qp.state === "complete" ? "check-square" : "square"} size={11} />
                  {o.text}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function StatsTab() {
  const save = useGameStore((s) => s.save)!;
  const isElite = save.worldId === "elite-academy";
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {CORE_STAT_KEYS.map((k) => (
          <StatBar key={k} label={k} value={save.player.core[k]} max={20} color="var(--ink-800)" size="sm" />
        ))}
      </div>
      <div className="border-t-2 border-ink-200 pt-2">
        {isElite ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <StatBar label="Academic Score" value={save.player.elite.academicScore} max={150} color="var(--accent-elite)" size="sm" />
            <StatBar label="Reputation" value={save.player.elite.reputation} max={150} color="var(--accent-elite)" size="sm" />
            <StatBar label="Trust" value={save.player.elite.trust} max={150} color="var(--accent-success)" size="sm" />
            <StatBar label="Suspicion" value={save.player.elite.suspicion} max={150} color="var(--accent-danger)" size="sm" />
            <StatBar label="Influence" value={save.player.elite.influence} max={100} color="var(--accent-info)" size="sm" />
            <StatBar label="Stress" value={save.player.elite.stress} max={100} color="var(--accent-warning)" size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <StatBar label="Level" value={save.player.aincrad.level} max={20} color="var(--accent-aincrad)" size="sm" />
            <StatBar label="Health" value={save.player.aincrad.health} max={save.player.aincrad.maxHealth} color="var(--accent-danger)" size="sm" />
            <StatBar label="Stamina" value={save.player.aincrad.stamina} max={save.player.aincrad.maxStamina} color="var(--accent-info)" size="sm" />
            <StatBar label="Strength" value={save.player.aincrad.strength} max={60} color="var(--ink-800)" size="sm" />
            <StatBar label="Defense" value={save.player.aincrad.defense} max={60} color="var(--ink-800)" size="sm" />
            <StatBar label="Sword Skill" value={save.player.aincrad.swordSkill} max={30} color="var(--ink-800)" size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}

function InventoryTab() {
  const save = useGameStore((s) => s.save)!;
  const slots = save.inventory.filter((s) => s.quantity > 0);
  if (slots.length === 0) return <p className="text-xs text-ink-500">Empty.</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {slots.map((slot) => {
        const def = getItem(slot.itemId);
        if (!def) return null;
        return (
          <div key={slot.itemId} className="flex items-center gap-2 rounded border-2 border-ink-300 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-ink-950 bg-ink-100">
              <Icon name={def.icon} size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate text-xs font-bold">{def.name}</p>
                {slot.equipped && <Badge color="var(--accent-success)">equipped</Badge>}
              </div>
              <p className="truncate text-[10px] text-ink-500">{def.description}</p>
            </div>
            <p className="shrink-0 text-xs tabular-nums">x{slot.quantity}</p>
          </div>
        );
      })}
    </div>
  );
}

function MapTab() {
  const save = useGameStore((s) => s.save)!;
  const map = save.currentMapId ? getMap(save.currentMapId) : undefined;
  if (!map) return <p className="text-xs text-ink-500">No location data available.</p>;
  return (
    <div>
      <p className="mb-1 text-xs font-bold">{map.name}</p>
      <p className="mb-2 text-[10px] text-ink-500">{map.ambientLabel}</p>
      <ul className="space-y-1">
        {map.interactables
          .filter((i) => !i.hidden)
          .map((i) => (
            <li key={i.id} className="flex items-center gap-1.5 text-[11px] text-ink-700">
              <Icon name={i.glyph} size={11} />
              {i.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
