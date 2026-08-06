import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import { Icon } from "./Icon";

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={`relative ${wide ? "w-full max-w-3xl" : "w-full max-w-md"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {onClose && (
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute -right-2 -top-2 z-10 rounded-full border-2 border-ink-950 bg-paper-0 p-1 text-ink-950 hover:bg-ink-100"
              >
                <Icon name="x" size={14} />
              </button>
            )}
            <Panel title={title} className="max-h-[85vh] overflow-y-auto">
              {children}
            </Panel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
