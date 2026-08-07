import { create } from "zustand";
import type { CharacterCreatorInput, SaveGame, WorldId } from "@/types";
import { createPlayerFromCreator } from "@/types/character";
import { defaultSettings } from "@/types/settings";
import { evaluateConditions } from "@/lib/conditions";
import { applyEffects, type EffectCommand } from "@/lib/effects";
import type { Effect } from "@/types/narrative";
import { checkGenericAchievements } from "@/lib/achievements";
import { persistSave, loadSaveSlot, AUTOSAVE_SLOT_ID } from "@/lib/save";
import { uid } from "@/lib/utils";
import {
  getChapter,
  getScene,
  getMap,
  getEncounter,
  getAchievement,
  getEnemy,
  getItem,
  getPuzzle,
} from "@/content/registry";
import {
  buildEncounter,
  playerCombatant,
  companionCombatant,
  playerAttack,
  playerUseSkill,
  playerGuard,
  playerDodge,
  playerUseItem,
  playerAnalyze,
  playerEscape,
  type CombatRuntimeState,
} from "@/engine/combat";

export type Screen =
  | "boot"
  | "title"
  | "worldSelect"
  | "characterCreator"
  | "saveSelect"
  | "settings"
  | "codex"
  | "achievements"
  | "patchNotes"
  | "credits"
  | "game";

export interface Notification {
  id: string;
  kind: "achievement" | "quest" | "relationship" | "levelup" | "info";
  title: string;
  detail?: string;
}

interface GameStoreState {
  screen: Screen;
  save: SaveGame | null;
  combat: CombatRuntimeState | null;
  pendingEncounterId: string | null;
  deviceOpen: boolean;
  helpOpen: boolean;
  debugOpen: boolean;
  notifications: Notification[];
  pendingWorldId: WorldId | null;
  /** Navigation command(s) queued by the current node's own `effects`, held back until the
   * player advances past the node so its text actually gets a chance to display first. */
  pendingNodeNavigation: EffectCommand[] | null;

  setScreen: (screen: Screen) => void;
  setPendingWorldId: (worldId: WorldId | null) => void;
  startNewGame: (input: CharacterCreatorInput) => Promise<void>;
  continueFromAutosave: () => Promise<boolean>;
  loadGame: (slotId: string) => Promise<void>;
  saveGame: (slotIdOverride?: string) => Promise<void>;
  returnToTitle: () => void;

  goToScene: (sceneId: string, nodeId?: string) => void;
  selectChoice: (choiceId: string) => void;
  advanceToNode: (nodeId: string) => void;
  endDialogue: () => void;
  /** Called when the player advances past a node that has no `next` and no `choices`. Fires any
   * navigation the node's own effects queued up (see `pendingNodeNavigation`), or ends the scene. */
  leaveCurrentNode: () => void;
  logDialogueLine: (speaker: string, text: string) => void;

  moveToMap: (mapId: string, spawnId?: string) => void;
  interact: (interactableId: string) => void;
  triggerPuzzleSwitch: (puzzleId: string, order: number) => void;

  startCombat: (encounterId: string) => void;
  doPlayerAttack: (targetId: string, timingBonus?: boolean) => void;
  doPlayerSkill: (skillId: string, targetId: string | null, timingBonus?: boolean) => void;
  doPlayerGuard: () => void;
  doPlayerDodge: () => void;
  doPlayerItem: (itemId: string) => void;
  doPlayerAnalyze: (targetId: string) => void;
  doPlayerEscape: () => void;
  resolveCombatEnd: () => void;

  toggleDevice: (open?: boolean) => void;
  toggleHelp: (open?: boolean) => void;
  toggleDebug: (open?: boolean) => void;
  updateSettings: (partial: Partial<SaveGame["settings"]>) => void;

  applyEffectsBatch: (effects: Parameters<typeof applyEffects>[1]) => void;
  pushNotification: (n: Omit<Notification, "id">) => void;
  dismissNotification: (id: string) => void;
  markMessagesRead: () => void;

  debugSetFlag: (flag: string) => void;
  debugClearFlag: (flag: string) => void;
  debugTeleport: (mapId: string, spawnId?: string) => void;
  debugModifyStat: (stat: string, delta: number) => void;
  debugResetSave: () => void;
  showChapterRecapIfDue: () => void;
  advanceChapter: () => void;
  jumpToChapter: (chapterId: string) => void;

  /** Internal: apply a computed save + side-effect commands, resolving navigation/achievements.
   * If nothing navigates away, `onSettle` decides where to land (stay put, enter a dialogue node, or end the scene). */
  _resolveEffects: (save: SaveGame, commands: EffectCommand[], onSettle: (save: SaveGame) => void) => void;
  /** Internal: enter a specific scene node — applies ITS OWN `effects` (flags, codex unlocks, stat
   * changes, etc. authored directly on that line) before displaying it. This is what makes
   * node-level `effects` (as opposed to choice-level effects) actually take effect. Any
   * navigation the node's effects request is held in `pendingNodeNavigation` rather than fired
   * immediately, so the node's own text always gets displayed first. */
  _settleAtNode: (save: SaveGame, sceneId: string, nodeId: string) => void;
  /** Internal: pushes achievement-unlock toasts for both scripted (`unlockAchievement` effect)
   * and generic (stat-threshold) unlocks, and returns the save with generic unlocks recorded. */
  _toastAchievements: (save: SaveGame, commands: EffectCommand[]) => SaveGame;
}

export function resolveSceneEntry(sceneId: string, save: SaveGame, overrideNodeId?: string): string {
  const scene = getScene(sceneId);
  if (!scene) return overrideNodeId ?? "n1";
  if (overrideNodeId) return overrideNodeId;
  for (const candidateId of scene.altEntryNodes) {
    const node = scene.nodes.find((n) => n.id === candidateId);
    if (node && evaluateConditions(save, node.conditions)) return candidateId;
  }
  return scene.startNode;
}

function xpToNextLevel(level: number): number {
  return 60 + level * 40;
}

function applyAincradLeveling(save: SaveGame, pushNotif: (n: Omit<Notification, "id">) => void): SaveGame {
  let next = structuredClone(save);
  let leveled = false;
  while (next.player.aincrad.experience >= xpToNextLevel(next.player.aincrad.level)) {
    next = {
      ...next,
      player: {
        ...next.player,
        aincrad: {
          ...next.player.aincrad,
          experience: next.player.aincrad.experience - xpToNextLevel(next.player.aincrad.level),
          level: next.player.aincrad.level + 1,
          maxHealth: next.player.aincrad.maxHealth + 15,
          health: next.player.aincrad.maxHealth + 15,
          maxStamina: next.player.aincrad.maxStamina + 8,
          strength: next.player.aincrad.strength + 3,
          defense: next.player.aincrad.defense + 2,
        },
      },
    };
    leveled = true;
  }
  if (leveled) pushNotif({ kind: "levelup", title: `Level Up! Now Level ${next.player.aincrad.level}`, detail: "Stats increased." });
  return next;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  screen: "boot",
  save: null,
  combat: null,
  pendingEncounterId: null,
  pendingNodeNavigation: null,
  deviceOpen: false,
  helpOpen: false,
  debugOpen: false,
  notifications: [],
  pendingWorldId: null,

  setScreen: (screen) => set({ screen }),
  setPendingWorldId: (worldId) => set({ pendingWorldId: worldId }),

  startNewGame: async (input) => {
    const player = createPlayerFromCreator(input);
    const chapter = getChapter(input.world === "elite-academy" ? "ea-ch1" : "ai-ch1");
    const now = Date.now();
    const slotId = uid("save");
    const save: SaveGame = {
      version: 1,
      slotId,
      createdAt: now,
      updatedAt: now,
      playtimeSeconds: 0,
      chapterName: chapter?.title ?? "Chapter One",
      worldId: input.world,
      player,
      flags: [],
      relationships: [],
      inventory:
        input.world === "aincrad"
          ? [
              { itemId: "ai-item-training-sword", quantity: 1, equipped: true },
              { itemId: "ai-item-leather-vest", quantity: 1, equipped: true },
              { itemId: "ai-item-healing-crystal", quantity: 3, equipped: false },
            ]
          : [],
      quests: [],
      codexUnlocked: [],
      achievementsUnlocked: [],
      currentChapterId: chapter?.id ?? "",
      unlockedChapterIds: chapter ? [chapter.id] : [],
      currentSceneId: chapter?.startSceneId,
      currentNodeId: undefined,
      currentMapId: undefined,
      currentSpawnId: undefined,
      mode: "dialogue",
      partyMemberIds: [],
      timeOfDay: "morning",
      dayCount: 1,
      dialogueHistory: [],
      choiceLog: [],
      messages: [],
      puzzleProgress: {},
      settings: defaultSettings(),
    };
    set({ screen: "game" });
    if (chapter) {
      const entry = resolveSceneEntry(chapter.startSceneId, save);
      get()._settleAtNode(save, chapter.startSceneId, entry);
    } else {
      set({ save });
      await persistSave(save);
    }
  },

  continueFromAutosave: async () => {
    const save = await loadSaveSlot(AUTOSAVE_SLOT_ID);
    if (!save) return false;
    set({ save, screen: "game" });
    return true;
  },

  loadGame: async (slotId) => {
    const save = await loadSaveSlot(slotId);
    if (!save) return;
    set({ save, screen: "game" });
  },

  saveGame: async (slotIdOverride) => {
    const { save } = get();
    if (!save) return;
    const toSave = slotIdOverride ? { ...save, slotId: slotIdOverride } : save;
    await persistSave(toSave);
    if (toSave.slotId !== AUTOSAVE_SLOT_ID) await persistSave({ ...toSave, slotId: AUTOSAVE_SLOT_ID });
    set({ save: toSave });
  },

  returnToTitle: () => set({ save: null, screen: "title", combat: null }),

  goToScene: (sceneId, nodeId) => {
    const { save } = get();
    if (!save) return;
    const entry = resolveSceneEntry(sceneId, save, nodeId);
    get()._settleAtNode(save, sceneId, entry);
  },

  selectChoice: (choiceId) => {
    const { save } = get();
    if (!save?.currentSceneId || !save.currentNodeId) return;
    const scene = getScene(save.currentSceneId);
    const node = scene?.nodes.find((n) => n.id === save.currentNodeId);
    const choice = node?.choices.find((c) => c.id === choiceId);
    if (!scene || !node || !choice) return;
    // Defense in depth: the UI already disables choices whose conditions aren't met, but never
    // trust that alone — a stat-gated choice must not be selectable through any other path either.
    if (!evaluateConditions(save, choice.conditions)) return;

    const savedWithLog: SaveGame = {
      ...save,
      choiceLog: [...save.choiceLog, { sceneId: scene.id, choiceId: choice.id, text: choice.text }],
    };
    const { save: afterEffects, commands } = applyEffects(savedWithLog, choice.effects);
    const goTo = choice.goTo;
    get()._resolveEffects(afterEffects, commands, (settled) => {
      if (goTo) {
        get()._settleAtNode(settled, scene.id, goTo);
      } else {
        set({ save: { ...settled, mode: settled.currentMapId ? "exploration" : "device", currentSceneId: undefined, currentNodeId: undefined } });
        get().saveGame();
      }
    });
  },

  advanceToNode: (nodeId) => {
    const { save } = get();
    if (!save?.currentSceneId) return;
    get()._settleAtNode(save, save.currentSceneId, nodeId);
  },

  endDialogue: () => {
    const { save } = get();
    if (!save) return;
    set({ save: { ...save, mode: save.currentMapId ? "exploration" : "device", currentSceneId: undefined, currentNodeId: undefined }, pendingNodeNavigation: null });
    get().saveGame();
    get().showChapterRecapIfDue();
  },

  logDialogueLine: (speaker, text) => {
    const { save } = get();
    if (!save) return;
    const last = save.dialogueHistory[save.dialogueHistory.length - 1];
    if (last && last.speaker === speaker && last.text === text) return;
    set({ save: { ...save, dialogueHistory: [...save.dialogueHistory, { speaker, text }].slice(-200) } });
  },

  moveToMap: (mapId, spawnId) => {
    const { save } = get();
    if (!save) return;
    const map = getMap(mapId);
    const spawn = spawnId ?? map?.defaultSpawn ?? "default";
    set({
      save: { ...save, currentMapId: mapId, currentSpawnId: spawn, mode: "exploration", currentSceneId: undefined, currentNodeId: undefined },
    });
    get().saveGame();
  },

  interact: (interactableId) => {
    const { save } = get();
    if (!save?.currentMapId) return;
    const map = getMap(save.currentMapId);
    const it = map?.interactables.find((i) => i.id === interactableId);
    if (!map || !it) return;
    if (it.requiresFlag && !save.flags.includes(it.requiresFlag)) return;

    if (it.kind === "door" || it.kind === "transition") {
      if (it.targetMapId) get().moveToMap(it.targetMapId, it.targetSpawnId);
      return;
    }
    if (it.kind === "monster" && it.encounterId) {
      get().startCombat(it.encounterId);
      return;
    }
    if (it.kind === "hidden-item" && it.itemId) {
      const { save: afterEffects, commands } = applyEffects(save, [{ type: "addItem", itemId: it.itemId, quantity: 1 }]);
      get().pushNotification({ kind: "info", title: "Item found", detail: it.label });
      get()._resolveEffects(afterEffects, commands, (settled) => {
        set({ save: settled });
        get().saveGame();
      });
      return;
    }
    if (it.kind === "puzzle-switch" && it.puzzleId && it.puzzleOrder != null) {
      get().triggerPuzzleSwitch(it.puzzleId, it.puzzleOrder);
      return;
    }
    if (it.sceneId) {
      get().goToScene(it.sceneId);
    }
  },

  triggerPuzzleSwitch: (puzzleId, order) => {
    const { save } = get();
    if (!save) return;
    const puzzle = getPuzzle(puzzleId);
    if (!puzzle) return;
    if (save.flags.includes(puzzle.successFlag)) return; // already solved — switches go inert

    const progress = save.puzzleProgress[puzzleId] ?? 0;
    if (order === progress) return; // re-confirming the last correct switch — harmless no-op

    if (order !== progress + 1) {
      // wrong order — reset back to the start
      if (progress === 0) return;
      set({ save: { ...save, puzzleProgress: { ...save.puzzleProgress, [puzzleId]: 0 } } });
      get().pushNotification({ kind: "info", title: "Wrong order", detail: puzzle.failMessage });
      return;
    }

    const nextProgress = progress + 1;
    if (nextProgress < puzzle.totalSwitches) {
      set({ save: { ...save, puzzleProgress: { ...save.puzzleProgress, [puzzleId]: nextProgress } } });
      return;
    }

    // final switch — solved
    const effects: Effect[] = [{ type: "setFlag", flag: puzzle.successFlag }];
    if (puzzle.successAchievementId) effects.push({ type: "unlockAchievement", achievementId: puzzle.successAchievementId });
    const { save: afterEffects, commands } = applyEffects(
      { ...save, puzzleProgress: { ...save.puzzleProgress, [puzzleId]: nextProgress } },
      effects,
    );
    get().pushNotification({ kind: "info", title: "Solved", detail: puzzle.successMessage });
    get()._resolveEffects(afterEffects, commands, (settled) => {
      set({ save: settled });
      get().saveGame();
    });
  },

  startCombat: (encounterId) => {
    const { save } = get();
    if (!save) return;
    const encounter = getEncounter(encounterId);
    if (!encounter) return;
    const party = [playerCombatant(save.player.name, save.player.core, save.player.aincrad)];
    for (const npcId of save.partyMemberIds) {
      party.push(companionCombatant(npcId, npcId, save.player.aincrad.level, "user", "#4a4a4a"));
    }
    const combat = buildEncounter(encounter, party);
    set({ combat, pendingEncounterId: encounterId, save: { ...save, mode: "combat" } });
  },

  doPlayerAttack: (targetId, timingBonus) => {
    const { combat } = get();
    if (!combat || combat.phase !== "player-turn") return;
    set({ combat: playerAttack(combat, targetId, timingBonus) });
  },
  doPlayerSkill: (skillId, targetId, timingBonus) => {
    const { combat } = get();
    if (!combat || combat.phase !== "player-turn") return;
    set({ combat: playerUseSkill(combat, skillId, targetId, timingBonus) });
  },
  doPlayerGuard: () => {
    const { combat } = get();
    if (!combat || combat.phase !== "player-turn") return;
    set({ combat: playerGuard(combat) });
  },
  doPlayerDodge: () => {
    const { combat } = get();
    if (!combat || combat.phase !== "player-turn") return;
    set({ combat: playerDodge(combat) });
  },
  doPlayerItem: (itemId) => {
    const { combat, save } = get();
    if (!combat || !save || combat.phase !== "player-turn") return;
    const slot = save.inventory.find((s) => s.itemId === itemId && s.quantity > 0);
    if (!slot) return;
    const def = getItem(itemId);
    const heal = def?.useEffect?.healthRestore ?? 0;
    const stam = def?.useEffect?.staminaRestore ?? 0;
    set({ combat: playerUseItem(combat, heal, stam, def?.name ?? itemId) });
    const { save: afterEffects } = applyEffects(save, [{ type: "removeItem", itemId, quantity: 1 }]);
    set({ save: afterEffects });
  },
  doPlayerAnalyze: (targetId) => {
    const { combat } = get();
    if (!combat || combat.phase !== "player-turn") return;
    set({ combat: playerAnalyze(combat, targetId) });
  },
  doPlayerEscape: () => {
    const { combat } = get();
    if (!combat) return;
    set({ combat: playerEscape(combat) });
  },

  resolveCombatEnd: () => {
    const { combat, save, pendingEncounterId } = get();
    if (!combat || !save || !pendingEncounterId) return;
    const encounter = getEncounter(pendingEncounterId);

    if (combat.phase === "victory") {
      const xp = encounter?.enemyIds.reduce((sum, id) => sum + (getEnemy(id)?.xp ?? 0), 0) ?? 0;
      const col = encounter?.enemyIds.reduce((sum, id) => sum + (getEnemy(id)?.col ?? 0), 0) ?? 0;
      const effects = [
        { type: "modifyStat" as const, stat: "experience", delta: xp },
        { type: "modifyStat" as const, stat: "col", delta: col },
        ...(encounter?.victoryEffects ?? []).map((flag) => ({ type: "setFlag" as const, flag })),
      ];
      const playerCombatantState = combat.party.find((p) => p.id === "player");
      const survivedSave: SaveGame = {
        ...save,
        player: { ...save.player, aincrad: { ...save.player.aincrad, health: Math.max(1, playerCombatantState?.health ?? save.player.aincrad.health) } },
      };
      const { save: afterEffects, commands } = applyEffects(survivedSave, effects);
      const leveled = applyAincradLeveling(afterEffects, get().pushNotification);
      get().pushNotification({ kind: "info", title: "Victory", detail: `+${xp} XP, +${col} Col (Grade ${combat.grade})` });
      set({ combat: null, pendingEncounterId: null });
      const victoryScene = encounter?.victorySceneId;
      get()._resolveEffects(leveled, commands, (settled) => {
        if (victoryScene) {
          const entry = resolveSceneEntry(victoryScene, settled);
          get()._settleAtNode(settled, victoryScene, entry);
        } else {
          set({ save: { ...settled, mode: settled.currentMapId ? "exploration" : "device" } });
          get().saveGame();
        }
      });
    } else if (combat.phase === "defeat") {
      const survivalMode = save.player.difficulty === "survival";
      if (survivalMode && save.safeZoneCheckpoint) {
        const cp = save.safeZoneCheckpoint;
        set({
          combat: null,
          pendingEncounterId: null,
          save: {
            ...save,
            currentMapId: cp.mapId,
            currentSpawnId: cp.spawnId,
            mode: "exploration",
            player: { ...save.player, aincrad: { ...save.player.aincrad, health: Math.round(save.player.aincrad.maxHealth * 0.5) } },
          },
        });
      } else {
        set({
          combat: null,
          pendingEncounterId: null,
          save: {
            ...save,
            player: { ...save.player, aincrad: { ...save.player.aincrad, health: Math.round(save.player.aincrad.maxHealth * 0.3) } },
            mode: save.currentMapId ? "exploration" : "device",
          },
        });
      }
      get().pushNotification({ kind: "info", title: "Defeated", detail: "You retreat, battered but alive." });
      get().saveGame();
    } else if (combat.phase === "escaped") {
      set({ combat: null, pendingEncounterId: null, save: { ...save, mode: save.currentMapId ? "exploration" : "device" } });
      get().saveGame();
    }
  },

  toggleDevice: (open) => set((s) => ({ deviceOpen: open ?? !s.deviceOpen })),
  toggleHelp: (open) => set((s) => ({ helpOpen: open ?? !s.helpOpen })),
  toggleDebug: (open) => set((s) => ({ debugOpen: open ?? !s.debugOpen })),

  updateSettings: (partial) => {
    const { save } = get();
    if (!save) return;
    set({ save: { ...save, settings: { ...save.settings, ...partial } } });
  },

  applyEffectsBatch: (effects) => {
    const { save } = get();
    if (!save) return;
    const { save: afterEffects, commands } = applyEffects(save, effects);
    get()._resolveEffects(afterEffects, commands, (settled) => {
      set({ save: settled });
      get().saveGame();
    });
  },

  pushNotification: (n) => set((s) => ({ notifications: [...s.notifications, { ...n, id: uid("notif") }] })),
  dismissNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  markMessagesRead: () => {
    const { save } = get();
    if (!save) return;
    set({ save: { ...save, messages: save.messages.map((m) => ({ ...m, read: true })) } });
  },

  debugSetFlag: (flag) => get().applyEffectsBatch([{ type: "setFlag", flag }]),
  debugClearFlag: (flag) => get().applyEffectsBatch([{ type: "clearFlag", flag }]),
  debugTeleport: (mapId, spawnId) => get().moveToMap(mapId, spawnId),
  debugModifyStat: (stat, delta) => get().applyEffectsBatch([{ type: "modifyStat", stat, delta }]),
  debugResetSave: () => set({ save: null, screen: "title", combat: null }),

  showChapterRecapIfDue: () => {
    const { save } = get();
    // Deliberately excludes "dialogue": a chapter's completion flag is typically set partway
    // through its closing scene, and we don't want the recap to cut off the scene's remaining
    // lines. Callers trigger this once dialogue actually ends (see endDialogue/leaveCurrentNode).
    if (!save || save.mode === "combat" || save.mode === "recap" || save.mode === "dialogue") return;
    const chapter = getChapter(save.currentChapterId);
    if (!chapter) return;
    const recapShownFlag = `meta-recap-shown-${chapter.id}`;
    if (save.flags.includes(chapter.completionFlag) && !save.flags.includes(recapShownFlag)) {
      const unlocked = save.unlockedChapterIds.includes(chapter.id) ? save.unlockedChapterIds : [...save.unlockedChapterIds, chapter.id];
      set({ save: { ...save, mode: "recap", flags: [...save.flags, recapShownFlag], unlockedChapterIds: unlocked } });
      get().saveGame();
    }
  },

  advanceChapter: () => {
    const { save } = get();
    if (!save) return;
    const current = getChapter(save.currentChapterId);
    const next = current?.nextChapterId ? getChapter(current.nextChapterId) : undefined;
    if (!next) {
      // no further chapter authored yet — just drop back into free play at the current location
      set({ save: { ...save, mode: save.currentMapId ? "exploration" : "device" } });
      get().saveGame();
      return;
    }
    const unlocked = save.unlockedChapterIds.includes(next.id) ? save.unlockedChapterIds : [...save.unlockedChapterIds, next.id];
    const advanced: SaveGame = { ...save, currentChapterId: next.id, chapterName: next.title, unlockedChapterIds: unlocked };
    const entry = resolveSceneEntry(next.startSceneId, advanced);
    get()._settleAtNode(advanced, next.startSceneId, entry);
  },

  jumpToChapter: (chapterId) => {
    const { save } = get();
    if (!save || !save.unlockedChapterIds.includes(chapterId)) return;
    const chapter = getChapter(chapterId);
    if (!chapter) return;
    const jumped: SaveGame = { ...save, currentChapterId: chapter.id, chapterName: chapter.title };
    const entry = resolveSceneEntry(chapter.startSceneId, jumped);
    get()._settleAtNode(jumped, chapter.startSceneId, entry);
  },

  _toastAchievements: (save, commands) => {
    let workingSave = save;
    const genericUnlocks = checkGenericAchievements(workingSave);
    if (genericUnlocks.length > 0) {
      workingSave = { ...workingSave, achievementsUnlocked: [...workingSave.achievementsUnlocked, ...genericUnlocks] };
    }
    const scriptedUnlocks = commands.filter((c) => c.type === "unlockAchievement").map((c) => (c as { achievementId: string }).achievementId);
    for (const id of [...scriptedUnlocks, ...genericUnlocks]) {
      const def = getAchievement(id);
      if (def) get().pushNotification({ kind: "achievement", title: `Achievement Unlocked: ${def.title}`, detail: def.description });
    }
    return workingSave;
  },

  _resolveEffects: (save, commands, onSettle) => {
    const workingSave = get()._toastAchievements(save, commands);

    for (const cmd of commands) {
      if (cmd.type === "changeLocation") {
        set({
          save: { ...workingSave, currentMapId: cmd.mapId, currentSpawnId: cmd.spawnId, mode: "exploration", currentSceneId: undefined, currentNodeId: undefined },
          pendingNodeNavigation: null,
        });
        get().saveGame();
        get().showChapterRecapIfDue();
        return;
      } else if (cmd.type === "goToScene") {
        const entry = resolveSceneEntry(cmd.sceneId, workingSave, cmd.nodeId);
        get()._settleAtNode(workingSave, cmd.sceneId, entry);
        return;
      } else if (cmd.type === "triggerBattle") {
        set({ save: workingSave, pendingNodeNavigation: null });
        get().startCombat(cmd.encounterId);
        return;
      }
    }

    onSettle(workingSave);
  },

  _settleAtNode: (save, sceneId, nodeId) => {
    const scene = getScene(sceneId);
    const node = scene?.nodes.find((n) => n.id === nodeId);
    if (!scene || !node) {
      set({ save: { ...save, mode: save.currentMapId ? "exploration" : "device", currentSceneId: undefined, currentNodeId: undefined }, pendingNodeNavigation: null });
      get().saveGame();
      return;
    }
    const { save: afterEffects, commands } = applyEffects(save, node.effects);
    const workingSave = get()._toastAchievements(afterEffects, commands);
    const navCommands = commands.filter((c) => c.type === "changeLocation" || c.type === "triggerBattle" || c.type === "goToScene");
    set({
      save: { ...workingSave, currentSceneId: sceneId, currentNodeId: nodeId, mode: "dialogue" },
      pendingNodeNavigation: navCommands.length > 0 ? navCommands : null,
    });
    get().saveGame();
  },

  leaveCurrentNode: () => {
    const { save, pendingNodeNavigation } = get();
    if (!save) return;
    const cmd = pendingNodeNavigation?.[0];
    if (cmd) {
      set({ pendingNodeNavigation: null });
      if (cmd.type === "changeLocation") {
        set({ save: { ...save, currentMapId: cmd.mapId, currentSpawnId: cmd.spawnId, mode: "exploration", currentSceneId: undefined, currentNodeId: undefined } });
        get().saveGame();
        get().showChapterRecapIfDue();
      } else if (cmd.type === "goToScene") {
        const entry = resolveSceneEntry(cmd.sceneId, save, cmd.nodeId);
        get()._settleAtNode(save, cmd.sceneId, entry);
      } else if (cmd.type === "triggerBattle") {
        get().startCombat(cmd.encounterId);
      }
      return;
    }
    get().endDialogue();
  },
}));

// Expose the store for local debugging/E2E scripts only — never in production.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as { __ANIME_SIM_STORE__: typeof useGameStore }).__ANIME_SIM_STORE__ = useGameStore;
}
