"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/state/gameStore";
import { getScene, getNpc } from "@/content/registry";
import { evaluateConditions } from "@/lib/conditions";
import { Icon } from "@/components/ui/Icon";
import { PortraitFace } from "@/components/game/PortraitFace";
import { Modal } from "@/components/ui/Modal";
import { audioManager } from "@/audio/audioManager";
import { cn } from "@/lib/utils";
import type { Choice, Expression } from "@/types";

const EXPRESSION_ICON: Record<Expression, string> = {
  neutral: "circle",
  smile: "smile",
  laugh: "laugh",
  smirk: "smile-plus",
  frown: "frown",
  angry: "angry",
  shocked: "alert-circle",
  sad: "frown",
  blush: "heart",
  thinking: "help-circle",
  cold: "snowflake",
  worried: "alert-triangle",
  determined: "flame",
};

export function DialogueView() {
  const save = useGameStore((s) => s.save);
  const selectChoice = useGameStore((s) => s.selectChoice);
  const advanceToNode = useGameStore((s) => s.advanceToNode);
  const leaveCurrentNode = useGameStore((s) => s.leaveCurrentNode);
  const logDialogueLine = useGameStore((s) => s.logDialogueLine);
  const toggleDevice = useGameStore((s) => s.toggleDevice);
  const saveGame = useGameStore((s) => s.saveGame);
  const setScreen = useGameStore((s) => s.setScreen);

  const scene = save?.currentSceneId ? getScene(save.currentSceneId) : undefined;
  const node = scene?.nodes.find((n) => n.id === save?.currentNodeId);

  const [autoMode, setAutoMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const nodeKey = `${scene?.id ?? ""}:${node?.id ?? ""}`;

  const speakerNpc = node?.speakerId ? getNpc(node.speakerId) : undefined;
  const speakerName = node?.speakerName ?? speakerNpc?.fullName ?? null;
  const text = node?.text ?? "";
  const dialogueSpeed = save?.settings.dialogueSpeed ?? 5;
  const reducedMotion = save?.settings.reducedMotion ?? false;
  const charInterval = reducedMotion ? 0 : Math.max(6, 42 - dialogueSpeed * 4);

  // Reset (or instant-complete, under reduced motion) the typewriter reveal whenever the node
  // changes. Adjusted during render — the documented pattern for state that must resync with a
  // changing key — rather than in an effect, so the previous line never flashes on the new node.
  const [revealCount, setRevealCount] = useState(charInterval === 0 ? text.length : 0);
  const [lastNodeKey, setLastNodeKey] = useState(nodeKey);
  if (nodeKey !== lastNodeKey) {
    setLastNodeKey(nodeKey);
    setRevealCount(charInterval === 0 ? text.length : 0);
  }

  const visibleChoices = useMemo(() => {
    if (!node || !save) return [];
    return node.choices.filter((c) => !c.hiddenIfUnmet || evaluateConditions(save, c.conditions));
  }, [node, save]);

  const timedChoiceSeconds = useMemo(() => {
    const withTimer = visibleChoices.filter((c) => c.timerSeconds);
    return withTimer.length > 0 ? Math.max(...withTimer.map((c) => c.timerSeconds ?? 0)) : null;
  }, [visibleChoices]);

  useEffect(() => {
    if (revealCount >= text.length || charInterval === 0) return;
    const t = setTimeout(() => {
      setRevealCount((c) => Math.min(text.length, c + 1));
      if (revealCount % 3 === 0) audioManager.playSfx("typing-blip");
    }, charInterval);
    return () => clearTimeout(t);
  }, [revealCount, text, charInterval]);

  const fullyRevealed = revealCount >= text.length;

  useEffect(() => {
    if (fullyRevealed && text) {
      logDialogueLine(speakerName ?? (node?.isInnerMonologue ? "Inner thought" : "..."), text);
    }
  }, [fullyRevealed, text, speakerName, logDialogueLine, node?.isInnerMonologue]);

  // Sync the initial countdown value during render (mirrors the nodeKey pattern above); the
  // effect below owns only the interval subscription itself.
  const timerKey = fullyRevealed && timedChoiceSeconds !== null ? nodeKey : null;
  const [lastTimerKey, setLastTimerKey] = useState<string | null>(null);
  if (timerKey !== lastTimerKey) {
    setLastTimerKey(timerKey);
    setTimeLeft(timerKey ? timedChoiceSeconds : null);
  }

  // timer countdown for timed choices
  useEffect(() => {
    if (!fullyRevealed || timedChoiceSeconds === null) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const remaining = timedChoiceSeconds - (Date.now() - start) / 1000;
      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        const fallback = visibleChoices[visibleChoices.length - 1];
        if (fallback) selectChoice(fallback.id);
      } else {
        setTimeLeft(remaining);
      }
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullyRevealed, nodeKey, timedChoiceSeconds]);

  // auto-advance for plain (no-choice) lines
  useEffect(() => {
    if (!autoMode || !fullyRevealed || !node || node.choices.length > 0) return;
    const t = setTimeout(() => advance(), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMode, fullyRevealed, nodeKey]);

  function advance() {
    if (!fullyRevealed) {
      setRevealCount(text.length);
      return;
    }
    if (!node) return;
    if (node.choices.length > 0) return;
    if (node.next) {
      advanceToNode(node.next);
    } else {
      leaveCurrentNode();
    }
  }

  if (!scene || !node) return null;

  const background = node.background ?? scene.background;
  const worldAccent = save?.worldId === "elite-academy" ? "var(--accent-elite)" : "var(--accent-aincrad)";

  return (
    <div
      className="relative flex h-dvh w-full cursor-pointer flex-col justify-end overflow-hidden bg-ink-950"
      onClick={!fullyRevealed || visibleChoices.length === 0 ? advance : undefined}
    >
      {/* background */}
      <div className="absolute inset-0" style={{ background: background ? "linear-gradient(160deg, var(--ink-800), var(--ink-950))" : "var(--ink-950)" }}>
        <div className="scanlines absolute inset-0 opacity-40" />
      </div>

      {/* top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-3" onClick={(e) => e.stopPropagation()}>
        <span className="rounded border-2 border-paper-0/30 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-widest text-paper-0/80">{scene.title}</span>
        <div className="flex gap-1.5">
          <button onClick={() => setShowHistory(true)} className="rounded border-2 border-paper-0/30 bg-black/30 p-1.5 text-paper-0/80 hover:bg-black/50" aria-label="History">
            <Icon name="scroll-text" size={14} />
          </button>
          <button
            onClick={() => setAutoMode((v) => !v)}
            className={`rounded border-2 p-1.5 ${autoMode ? "border-accent-warning bg-accent-warning text-paper-0" : "border-paper-0/30 bg-black/30 text-paper-0/80"}`}
            aria-label="Auto mode"
          >
            <Icon name="fast-forward" size={14} />
          </button>
          <button onClick={() => saveGame()} className="rounded border-2 border-paper-0/30 bg-black/30 p-1.5 text-paper-0/80 hover:bg-black/50" aria-label="Save">
            <Icon name="save" size={14} />
          </button>
          <button onClick={() => toggleDevice(true)} className="rounded border-2 border-paper-0/30 bg-black/30 p-1.5 text-paper-0/80 hover:bg-black/50" aria-label="Device">
            <Icon name="smartphone" size={14} />
          </button>
          <button onClick={() => setScreen("settings")} className="rounded border-2 border-paper-0/30 bg-black/30 p-1.5 text-paper-0/80 hover:bg-black/50" aria-label="Settings">
            <Icon name="settings" size={14} />
          </button>
        </div>
      </div>

      {/* portrait */}
      <AnimatePresence mode="wait">
        {speakerNpc && (
          <motion.div
            key={speakerNpc.id + (node.expression ?? "neutral")}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-56 right-4 z-10 flex flex-col items-center sm:bottom-64 sm:right-10"
          >
            <div
              className={cn(
                "flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-4 border-paper-0 sm:h-44 sm:w-44",
                fullyRevealed ? "portrait-idle" : "portrait-talk",
              )}
              style={{ background: `color-mix(in srgb, ${speakerNpc.portraitColor} 22%, var(--paper-0))` }}
            >
              {speakerNpc.portraitImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={speakerNpc.portraitImageUrl} alt={speakerNpc.fullName} className="h-full w-full object-cover" />
              ) : (
                <PortraitFace
                  hairColor={speakerNpc.hairColor}
                  hairstyle={speakerNpc.hairstyle}
                  eyeColor={speakerNpc.eyeColor}
                  skinTone={speakerNpc.skinTone}
                  accentColor={speakerNpc.portraitColor}
                  expression={node.expression}
                  size={176}
                />
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 rounded-full border-2 border-paper-0 bg-ink-950 px-2 py-0.5">
              <Icon name={EXPRESSION_ICON[node.expression]} size={10} color="var(--paper-0)" />
              <span className="text-[9px] uppercase text-paper-0">{node.expression}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* textbox */}
      <div className="relative z-10 w-full px-3 pb-5 sm:px-6 sm:pb-8">
        <div
          className={`mx-auto w-full max-w-5xl rounded-md border-2 bg-paper-0 p-5 shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] sm:p-7 ${node.isInnerMonologue ? "border-dashed" : ""}`}
          style={{ borderColor: node.isInnerMonologue ? worldAccent : "var(--ink-950)" }}
        >
          {speakerName && !node.isInnerMonologue && (
            <p className="mb-1.5 text-sm font-bold uppercase tracking-wide sm:text-base" style={{ color: worldAccent }}>
              {speakerName}
            </p>
          )}
          {node.isInnerMonologue && <p className="mb-1.5 text-xs uppercase italic tracking-widest text-ink-500">Inner thought</p>}
          <p className={`min-h-[4em] text-base leading-relaxed sm:min-h-[5em] sm:text-lg ${node.isInnerMonologue ? "italic text-ink-700" : "text-ink-950"}`}>
            {text.slice(0, revealCount)}
            {!fullyRevealed && <span className="animate-pulse">▌</span>}
          </p>
          {fullyRevealed && visibleChoices.length === 0 && (
            <p className="mt-2 text-right text-xs uppercase tracking-widest text-ink-400">click to continue ▸</p>
          )}
        </div>

        {fullyRevealed && visibleChoices.length > 0 && (
          <div className="mx-auto mt-2 flex max-w-5xl flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {timeLeft !== null && (
              <div className="h-1 w-full overflow-hidden rounded bg-ink-300">
                <div className="h-full bg-accent-danger transition-[width] duration-100 linear" style={{ width: `${(timeLeft / (timedChoiceSeconds ?? 1)) * 100}%` }} />
              </div>
            )}
            {visibleChoices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                showRequirement={save?.settings.showStatChecks ?? true}
                met={!save || evaluateConditions(save, choice.conditions)}
                onSelect={() => selectChoice(choice.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="Dialogue History">
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {(save?.dialogueHistory ?? []).slice(-60).map((line, i) => (
            <p key={i} className="text-xs">
              <span className="font-bold" style={{ color: worldAccent }}>
                {line.speaker}:
              </span>{" "}
              <span className="text-ink-700">{line.text}</span>
            </p>
          ))}
          {(save?.dialogueHistory.length ?? 0) === 0 && <p className="text-xs text-ink-500">No history yet.</p>}
        </div>
      </Modal>
    </div>
  );
}

function ChoiceButton({ choice, showRequirement, met, onSelect }: { choice: Choice; showRequirement: boolean; met: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={met ? onSelect : undefined}
      disabled={!met}
      aria-disabled={!met}
      className={cn(
        "flex items-center justify-between gap-2 rounded border-2 px-4 py-3 text-left text-sm transition-colors",
        met ? "border-ink-950 bg-paper-0 hover:bg-ink-100 active:translate-y-[1px]" : "cursor-not-allowed border-ink-300 bg-ink-100 text-ink-400",
      )}
    >
      <span className="flex items-center gap-2">
        {choice.isSilence && <Icon name="volume-x" size={14} className="text-ink-500" />}
        {choice.isBluff && <Icon name="drama" size={14} className="text-accent-warning" />}
        {choice.importantChoice && <Icon name="star" size={14} className={met ? "text-accent-danger" : "text-ink-400"} />}
        {choice.text}
      </span>
      {showRequirement && choice.requirementLabel && (
        <span className={cn("shrink-0 text-[10px] uppercase", met ? "text-ink-400" : "text-accent-danger")}>{choice.requirementLabel}</span>
      )}
    </button>
  );
}
