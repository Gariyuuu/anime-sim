"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/state/gameStore";
import { Icon } from "@/components/ui/Icon";
import { audioManager } from "@/audio/audioManager";

const ICONS: Record<string, string> = {
  achievement: "award",
  quest: "scroll-text",
  relationship: "heart",
  levelup: "trending-up",
  info: "info",
};

export function NotificationToasts() {
  const notifications = useGameStore((s) => s.notifications);
  const dismiss = useGameStore((s) => s.dismissNotification);

  useEffect(() => {
    if (notifications.length === 0) return;
    const t = setTimeout(() => dismiss(notifications[0].id), 3600);
    return () => clearTimeout(t);
  }, [notifications, dismiss]);

  const seenIds = useRef(new Set<string>());
  useEffect(() => {
    for (const n of notifications) {
      if (seenIds.current.has(n.id)) continue;
      seenIds.current.add(n.id);
      if (n.kind === "achievement") audioManager.playSfx("achievement");
      else if (n.kind === "levelup") audioManager.playSfx("levelup");
    }
  }, [notifications]);

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {notifications.slice(0, 3).map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="pointer-events-auto flex w-64 items-start gap-2 rounded-md border-2 border-ink-950 bg-paper-0 p-2.5 shadow-[3px_3px_0_0_var(--ink-950)]"
            onClick={() => dismiss(n.id)}
          >
            <Icon name={ICONS[n.kind] ?? "info"} size={16} className="mt-0.5 shrink-0 text-accent-warning" />
            <div>
              <p className="text-[11px] font-bold leading-tight">{n.title}</p>
              {n.detail && <p className="text-[10px] text-ink-600">{n.detail}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
