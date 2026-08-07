"use client";

import { useMemo } from "react";
import { useGameStore } from "@/state/gameStore";
import { Modal } from "@/components/ui/Modal";
import { RetroButton } from "@/components/ui/RetroButton";
import { Icon } from "@/components/ui/Icon";
import { getMap, getEncounter, getEnemy, floorsSorted } from "@/content/registry";

interface ArenaFight {
  encounterId: string;
  label: string;
  tier: "common" | "mini-boss";
}

/**
 * A repeatable practice/grinding hub: re-fight any common or mini-boss encounter from a floor
 * the player has already reached. Deliberately excludes floor bosses — those carry
 * `victorySceneId` story-progression chains (epilogues, achievement toasts tied to first clear)
 * that shouldn't replay outside the real raid.
 */
export function ArenaModal() {
  const arenaOpen = useGameStore((s) => s.arenaOpen);
  const toggleArena = useGameStore((s) => s.toggleArena);
  const startCombat = useGameStore((s) => s.startCombat);
  const save = useGameStore((s) => s.save);

  const floorFights = useMemo(() => {
    if (!save) return [];
    return floorsSorted()
      .filter((f) => save.flags.includes(`ai-flag-floor${f.index}-arrived`))
      .map((f) => {
        const fieldMap = f.fieldMapId ? getMap(f.fieldMapId) : undefined;
        const seen = new Set<string>();
        const fights: ArenaFight[] = [];
        for (const it of fieldMap?.interactables ?? []) {
          if (it.kind !== "monster" || !it.encounterId || seen.has(it.encounterId)) continue;
          seen.add(it.encounterId);
          const encounter = getEncounter(it.encounterId);
          if (!encounter) continue;
          const isMiniBoss = encounter.enemyIds.some((id) => getEnemy(id)?.tier === "mini-boss");
          fights.push({ encounterId: it.encounterId, label: encounter.name, tier: isMiniBoss ? "mini-boss" : "common" });
        }
        return { floor: f, fights };
      })
      .filter((entry) => entry.fights.length > 0);
  }, [save]);

  if (!save) return null;

  return (
    <Modal open={arenaOpen} onClose={() => toggleArena(false)} title="Combat Arena" wide>
      <p className="mb-3 text-[11px] text-ink-600">
        Re-fight any common encounter or mini-boss from a floor you&apos;ve reached — good for grinding col and XP without waiting on a fresh
        field spawn. Floor bosses stay one-time raids.
      </p>
      <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
        {floorFights.length === 0 && <p className="text-xs text-ink-500">Reach Floor 1&apos;s field to unlock the Arena&apos;s first fights.</p>}
        {floorFights.map(({ floor, fights }) => (
          <div key={floor.id} className="rounded border-2 border-ink-950 p-2.5">
            <p className="mb-2 text-xs font-bold">
              Floor {floor.index} — {floor.name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {fights.map((fight) => (
                <RetroButton
                  key={fight.encounterId}
                  variant={fight.tier === "mini-boss" ? "danger" : "secondary"}
                  className="text-[10px]"
                  icon={<Icon name={fight.tier === "mini-boss" ? "skull" : "swords"} size={12} />}
                  onClick={() => {
                    toggleArena(false);
                    startCombat(fight.encounterId);
                  }}
                >
                  {fight.label}
                </RetroButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
