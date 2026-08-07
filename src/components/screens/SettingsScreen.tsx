"use client";

import { useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import { defaultSettings, type Settings } from "@/types/settings";
import { saveSettingsToLocalStorage, loadSettingsFromLocalStorage } from "@/lib/save";

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mb-2 flex cursor-pointer items-center justify-between gap-3 rounded border-2 border-ink-200 px-3 py-2 hover:border-ink-950">
      <span>
        <span className="block text-xs">{label}</span>
        {hint && <span className="block text-[10px] text-ink-500">{hint}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-ink-950" />
    </label>
  );
}

function Slider({ label, value, onChange, min = 0, max = 1, step = 0.05 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-ink-500">
        <span>{label}</span>
        <span>{Math.round(((value - min) / (max - min)) * 100)}%</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-ink-950" />
    </div>
  );
}

export function SettingsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const saveGame = useGameStore((s) => s.saveGame);
  const returnToTitle = useGameStore((s) => s.returnToTitle);
  const [localSettings, setLocalSettings] = useState<Settings>(() => save?.settings ?? (loadSettingsFromLocalStorage() as Settings | null) ?? defaultSettings());
  const [justSaved, setJustSaved] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...localSettings, [key]: value };
    setLocalSettings(next);
    if (save) {
      updateSettings({ [key]: value });
      saveGame();
    } else {
      saveSettingsToLocalStorage(next);
    }
  }

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-6 pb-10">
        <h1 className="font-display mb-6 text-center text-sm text-ink-950">Settings</h1>

        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          <Panel title="Audio">
            <Toggle label="Audio Enabled" checked={localSettings.audioEnabled} onChange={(v) => set("audioEnabled", v)} />
            <Slider label="Music Volume" value={localSettings.musicVolume} onChange={(v) => set("musicVolume", v)} />
            <Slider label="SFX Volume" value={localSettings.sfxVolume} onChange={(v) => set("sfxVolume", v)} />
            <Slider label="Ambience Volume" value={localSettings.ambienceVolume} onChange={(v) => set("ambienceVolume", v)} />
          </Panel>

          <Panel title="Dialogue">
            <Slider label="Dialogue Speed" value={localSettings.dialogueSpeed} onChange={(v) => set("dialogueSpeed", v)} min={1} max={10} step={1} />
            <Toggle label="Auto Advance" checked={localSettings.autoAdvance} onChange={(v) => set("autoAdvance", v)} />
            <Toggle label="Hold-to-Skip Protection" hint="Requires a longer hold to skip, so you don't miss a line." checked={localSettings.holdToSkipProtection} onChange={(v) => set("holdToSkipProtection", v)} />
            <Toggle label="Show Stat Checks" hint="Display requirement labels on choices." checked={localSettings.showStatChecks} onChange={(v) => set("showStatChecks", v)} />
            <Toggle label="Show Relationship Changes" checked={localSettings.showRelationshipChanges} onChange={(v) => set("showRelationshipChanges", v)} />
          </Panel>

          <Panel title="Accessibility">
            <Toggle label="Reduced Motion" checked={localSettings.reducedMotion} onChange={(v) => set("reducedMotion", v)} />
            <Toggle label="High Contrast" checked={localSettings.highContrast} onChange={(v) => set("highContrast", v)} />
            <Toggle label="Dyslexia-Friendly Font" checked={localSettings.dyslexiaFont} onChange={(v) => set("dyslexiaFont", v)} />
            <Toggle label="Colorblind-Friendly Indicators" checked={localSettings.colorblindMode} onChange={(v) => set("colorblindMode", v)} />
            <Toggle label="Screen Shake" checked={localSettings.screenShake} onChange={(v) => set("screenShake", v)} />
            <Toggle label="Minigame Assist" hint="Reduces or skips difficult minigames while keeping story consequences." checked={localSettings.minigameAssist} onChange={(v) => set("minigameAssist", v)} />
            <div className="mt-2">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-ink-500">Text Size</p>
              <div className="flex gap-1.5">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => set("textSize", size)}
                    className={`rounded border-2 px-2 py-1 text-[10px] uppercase ${localSettings.textSize === size ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {save && (
            <Panel title="Game">
              <div className="flex flex-col gap-2">
                <RetroButton
                  variant="secondary"
                  icon={<Icon name="save" size={14} />}
                  onClick={() => {
                    saveGame();
                    setJustSaved(true);
                    setTimeout(() => setJustSaved(false), 2000);
                  }}
                >
                  {justSaved ? "Saved!" : "Save Game"}
                </RetroButton>
                <RetroButton
                  variant="danger"
                  icon={<Icon name="home" size={14} />}
                  onClick={() => {
                    saveGame();
                    returnToTitle();
                  }}
                >
                  Save &amp; Return to Main Menu
                </RetroButton>
              </div>
            </Panel>
          )}
        </div>

        <RetroButton variant="ghost" className="mt-8" onClick={() => setScreen(save ? "game" : "title")} icon={<Icon name="arrow-left" size={14} />}>
          Back
        </RetroButton>
      </div>
    </ScreenFrame>
  );
}
