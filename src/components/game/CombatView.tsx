"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/state/gameStore";
import { getEncounter, getItem, skills as allSkills } from "@/content/registry";
import { StatBar } from "@/components/ui/StatBar";
import { RetroButton } from "@/components/ui/RetroButton";
import { Icon } from "@/components/ui/Icon";
import { audioManager } from "@/audio/audioManager";
import type { Combatant } from "@/types";

type Action = "attack" | "skill" | "guard" | "dodge" | "item" | "analyze" | "escape";

export function CombatView() {
  const combat = useGameStore((s) => s.combat);
  const save = useGameStore((s) => s.save);
  const pendingEncounterId = useGameStore((s) => s.pendingEncounterId);
  const doPlayerAttack = useGameStore((s) => s.doPlayerAttack);
  const doPlayerSkill = useGameStore((s) => s.doPlayerSkill);
  const doPlayerGuard = useGameStore((s) => s.doPlayerGuard);
  const doPlayerDodge = useGameStore((s) => s.doPlayerDodge);
  const doPlayerItem = useGameStore((s) => s.doPlayerItem);
  const doPlayerAnalyze = useGameStore((s) => s.doPlayerAnalyze);
  const doPlayerEscape = useGameStore((s) => s.doPlayerEscape);
  const resolveCombatEnd = useGameStore((s) => s.resolveCombatEnd);

  const [menu, setMenu] = useState<"root" | "skill" | "item" | "target">("root");
  const [pendingAction, setPendingAction] = useState<{ kind: "attack" | "skill" | "analyze"; skillId?: string } | null>(null);
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);
  const [timing, setTiming] = useState<{ open: boolean; zone: [number, number] } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [combat?.log.length]);

  useEffect(() => {
    const last = combat?.log[combat.log.length - 1];
    if (!last) return;
    if (last.kind === "damage") audioManager.playSfx("damage-hit");
    else if (last.kind === "heal") audioManager.playSfx("heal");
    else if (last.kind === "victory") audioManager.playSfx("victory-fanfare");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combat?.log.length]);

  // Reset the action menu once combat ends. Adjusted during render (keyed on `combat.phase`)
  // rather than in an effect, so the ended-state screen never flashes a stale target menu.
  const [lastPhase, setLastPhase] = useState(combat?.phase);
  if (combat?.phase !== lastPhase) {
    setLastPhase(combat?.phase);
    if (combat && combat.phase !== "player-turn" && combat.phase !== "enemy-turn" && (menu !== "root" || pendingAction)) {
      setMenu("root");
      setPendingAction(null);
    }
  }

  if (!combat) return null;
  const encounter = pendingEncounterId ? getEncounter(pendingEncounterId) : undefined;
  const player = combat.party.find((p) => p.id === "player");
  const requiresTiming = pendingAction?.kind === "skill" && (allSkills.find((s) => s.id === pendingAction.skillId)?.timingBonusWindowMs ?? 0) > 0;

  function chooseAction(action: Action) {
    if (action === "guard") return doPlayerGuard();
    if (action === "dodge") return doPlayerDodge();
    if (action === "escape") return doPlayerEscape();
    if (action === "skill") return setMenu("skill");
    if (action === "item") return setMenu("item");
    if (action === "attack") {
      setPendingAction({ kind: "attack" });
      setMenu("target");
    }
  }

  function pickSkill(skillId: string) {
    const skill = allSkills.find((s) => s.id === skillId);
    if (!skill) return;
    if (skill.targetType === "self" || skill.targetType === "party" || skill.targetType === "all-enemies") {
      doPlayerSkill(skillId, null);
      setMenu("root");
      return;
    }
    setPendingAction({ kind: "skill", skillId });
    setMenu("target");
  }

  function confirmTarget(targetId: string) {
    if (!pendingAction) return;
    if (requiresTiming) {
      setPendingTargetId(targetId);
      setTiming({ open: true, zone: [40, 60] });
      return;
    }
    executeTargeted(targetId, false);
  }

  function executeTargeted(targetId: string, bonus: boolean) {
    if (!pendingAction) return;
    if (pendingAction.kind === "attack") doPlayerAttack(targetId, bonus);
    else if (pendingAction.kind === "skill" && pendingAction.skillId) doPlayerSkill(pendingAction.skillId, targetId, bonus);
    else if (pendingAction.kind === "analyze") doPlayerAnalyze(targetId);
    setPendingAction(null);
    setPendingTargetId(null);
    setMenu("root");
    setTiming(null);
  }

  const isOver = combat.phase === "victory" || combat.phase === "defeat" || combat.phase === "escaped";

  return (
    <div className="flex h-dvh w-full flex-col bg-ink-950 text-paper-0">
      <div className="flex items-center justify-between border-b-2 border-paper-0/20 px-3 py-2">
        <p className="text-xs uppercase tracking-widest">{encounter?.name ?? "Battle"}</p>
        <p className="text-[10px] uppercase text-paper-0/60">Round {combat.round}</p>
      </div>

      {/* enemies */}
      <div className="flex flex-wrap justify-center gap-4 px-4 py-4">
        {combat.enemies.map((e) => (
          <EnemyCard
            key={e.id}
            enemy={e}
            selectable={menu === "target" && !!pendingAction}
            onSelect={() => confirmTarget(e.id)}
          />
        ))}
      </div>

      {/* combat log */}
      <div ref={logRef} className="mx-3 mb-2 h-24 flex-1 overflow-y-auto rounded border-2 border-paper-0/20 bg-black/30 p-2 text-[11px] leading-relaxed">
        {combat.log.map((entry) => (
          <p
            key={entry.id}
            className={
              entry.kind === "damage"
                ? "text-accent-danger"
                : entry.kind === "heal"
                  ? "text-accent-success"
                  : entry.kind === "victory"
                    ? "font-bold text-accent-warning"
                    : entry.kind === "defeat"
                      ? "font-bold text-accent-danger"
                      : "text-paper-0/80"
            }
          >
            {entry.text}
          </p>
        ))}
      </div>

      {/* party */}
      <div className="flex flex-wrap justify-center gap-3 border-t-2 border-paper-0/20 px-3 py-2">
        {combat.party.map((p) => (
          <div key={p.id} className="w-36 rounded border-2 border-paper-0/30 bg-black/20 p-2">
            <p className="mb-1 flex items-center gap-1 truncate text-[10px] font-bold">
              <Icon name={p.glyph} size={10} /> {p.name}
              {p.isGuarding && <Icon name="shield" size={10} className="text-accent-info" />}
            </p>
            <StatBar value={p.health} max={p.maxHealth} color="var(--accent-danger)" size="sm" showNumbers={false} />
            <div className="mt-1">
              <StatBar value={p.stamina} max={p.maxStamina} color="var(--accent-info)" size="sm" showNumbers={false} />
            </div>
          </div>
        ))}
      </div>

      {/* action menu / end state */}
      <div className="border-t-2 border-paper-0/20 p-3">
        {isOver ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-bold uppercase tracking-widest">
              {combat.phase === "victory" ? `Victory — Grade ${combat.grade}` : combat.phase === "defeat" ? "Defeated" : "Escaped"}
            </p>
            <RetroButton onClick={resolveCombatEnd} icon={<Icon name="arrow-right" size={14} />}>
              Continue
            </RetroButton>
          </div>
        ) : menu === "root" ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {(["attack", "skill", "guard", "dodge", "item", "analyze", "escape"] as Action[]).map((a) => (
              <RetroButton key={a} variant="secondary" className="!bg-paper-0" disabled={combat.phase !== "player-turn"} onClick={() => chooseAction(a)}>
                {a}
              </RetroButton>
            ))}
          </div>
        ) : menu === "skill" ? (
          <div className="flex flex-wrap gap-2">
            {(player ? Object.keys(player.skillCooldowns) : []).length >= 0 &&
              allSkills.slice(0, 6).map((skill) => {
                const cd = player?.skillCooldowns[skill.id] ?? 0;
                const disabled = cd > 0 || (player?.stamina ?? 0) < skill.staminaCost;
                return (
                  <button
                    key={skill.id}
                    disabled={disabled}
                    onClick={() => pickSkill(skill.id)}
                    className="rounded border-2 border-paper-0/40 bg-black/20 px-2 py-1.5 text-left text-[10px] disabled:opacity-30"
                  >
                    <p className="font-bold uppercase">{skill.name}</p>
                    <p className="text-paper-0/60">{skill.staminaCost} SP{cd > 0 ? ` · CD ${cd}` : ""}</p>
                  </button>
                );
              })}
            <RetroButton variant="ghost" className="!text-paper-0" onClick={() => setMenu("root")}>
              Back
            </RetroButton>
          </div>
        ) : menu === "item" ? (
          <div className="flex flex-wrap gap-2">
            {(save?.inventory ?? [])
              .filter((slot) => slot.quantity > 0 && getItem(slot.itemId)?.kind === "consumable")
              .map((slot) => {
                const def = getItem(slot.itemId);
                return (
                  <button
                    key={slot.itemId}
                    onClick={() => {
                      doPlayerItem(slot.itemId);
                      setMenu("root");
                    }}
                    className="rounded border-2 border-paper-0/40 bg-black/20 px-2 py-1.5 text-left text-[10px]"
                  >
                    <p className="font-bold uppercase">{def?.name ?? slot.itemId}</p>
                    <p className="text-paper-0/60">x{slot.quantity}</p>
                  </button>
                );
              })}
            <RetroButton variant="ghost" className="!text-paper-0" onClick={() => setMenu("root")}>
              Back
            </RetroButton>
          </div>
        ) : (
          <p className="text-center text-[10px] uppercase tracking-widest text-paper-0/70">Select a target above.</p>
        )}
      </div>

      {timing?.open && pendingTargetId && <TimingOverlay zone={timing.zone} onResolve={(bonus) => executeTargeted(pendingTargetId, bonus)} />}
    </div>
  );
}

function EnemyCard({ enemy, selectable, onSelect }: { enemy: Combatant; selectable: boolean; onSelect: () => void }) {
  const dead = enemy.health <= 0;
  return (
    <motion.button
      onClick={selectable && !dead ? onSelect : undefined}
      animate={dead ? { opacity: 0.25, scale: 0.9 } : { opacity: 1, scale: 1 }}
      whileTap={selectable && !dead ? { scale: 0.96 } : undefined}
      className={`flex w-32 flex-col items-center gap-1 rounded border-2 p-2 ${selectable && !dead ? "cursor-pointer border-accent-warning" : "border-paper-0/30"}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper-0" style={{ background: enemy.color }}>
        <Icon name={enemy.glyph} size={22} color="var(--paper-0)" />
      </div>
      <p className="truncate text-[10px] font-bold">{enemy.name}</p>
      <StatBar value={enemy.health} max={enemy.maxHealth} color="var(--accent-danger)" size="sm" showNumbers={false} />
    </motion.button>
  );
}

function TimingOverlay({ zone, onResolve }: { zone: [number, number]; onResolve: (bonus: boolean) => void }) {
  const [pos, setPos] = useState(0);
  const dirRef = useRef(1);
  useEffect(() => {
    let raf: number;
    function tick() {
      setPos((p) => {
        let next = p + dirRef.current * 2.2;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70" onClick={() => onResolve(pos >= zone[0] && pos <= zone[1])}>
      <div className="w-72 rounded-md border-2 border-paper-0 bg-ink-950 p-4 text-center">
        <p className="mb-3 text-xs uppercase tracking-widest text-paper-0">Tap to time your strike!</p>
        <div className="relative h-4 w-full overflow-hidden rounded border-2 border-paper-0 bg-ink-800">
          <div className="absolute top-0 h-full bg-accent-warning/50" style={{ left: `${zone[0]}%`, width: `${zone[1] - zone[0]}%` }} />
          <div className="absolute top-0 h-full w-1 bg-paper-0" style={{ left: `${pos}%` }} />
        </div>
        <RetroButton className="mt-3" onClick={() => onResolve(pos >= zone[0] && pos <= zone[1])}>
          Strike
        </RetroButton>
      </div>
    </div>
  );
}
