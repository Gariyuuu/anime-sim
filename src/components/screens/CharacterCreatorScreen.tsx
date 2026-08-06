"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/state/gameStore";
import { ScreenFrame } from "@/components/ui/ScreenFrame";
import { RetroButton } from "@/components/ui/RetroButton";
import { Panel } from "@/components/ui/Panel";
import { Icon } from "@/components/ui/Icon";
import { PixelAvatar } from "@/components/game/PixelAvatar";
import {
  HAIRSTYLES,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_TONES,
  FACE_OPTIONS,
  OUTFITS,
  ACCESSORIES,
  type Appearance,
} from "@/types/character";
import { CORE_STAT_KEYS, DIFFICULTY_MODES, PERSONALITY_ARCHETYPES, type CoreStatKey, type PersonalityArchetype, type DifficultyMode, type PronounSet } from "@/types/common";
import { CharacterCreatorSchema } from "@/types/character";

const PRONOUNS: PronounSet[] = ["she/her", "he/him", "they/them"];

const PERSONALITY_BLURB: Record<PersonalityArchetype, string> = {
  strategist: "Thinks three moves ahead. +Intelligence, +Deception.",
  charmer: "Wins people over fast. +Charisma, +Empathy.",
  loner: "Trusts results, not crowds. +Discipline, +Perception.",
  protector: "Shields the people around them. +Courage, +Empathy.",
  trickster: "Plays every angle. +Deception, +Agility.",
  scholar: "Prepares harder than anyone. +Intelligence, +Discipline.",
  fighter: "Meets problems head-on. +Combat, +Courage.",
  observer: "Notices what others miss. +Perception, +Intelligence.",
};

const DIFFICULTY_BLURB: Record<DifficultyMode, string> = {
  story: "Easier stat checks & combat, reduced stress, optional puzzle hints.",
  standard: "The intended balance.",
  strategist: "Choices matter more; stat checks are stricter.",
  survival: "Harder combat, costlier items — defeat rewinds to your last safe zone instead of ending the run.",
};

function labelize(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function OptionRow<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-3">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-ink-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded border-2 px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${
              opt === value ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300 bg-paper-0 text-ink-700 hover:border-ink-950"
            }`}
          >
            {labelize(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CharacterCreatorScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const pendingWorldId = useGameStore((s) => s.pendingWorldId);
  const startNewGame = useGameStore((s) => s.startNewGame);

  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState<PronounSet>("they/them");
  const [personality, setPersonality] = useState<PersonalityArchetype>("strategist");
  const [strength, setStrength] = useState<CoreStatKey>("intelligence");
  const [weakness, setWeakness] = useState<CoreStatKey>("courage");
  const [background, setBackground] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyMode>("standard");
  const [appearance, setAppearance] = useState<Appearance>({
    hairstyle: "short",
    hairColor: "black",
    eyeColor: "dark-brown",
    skinTone: "light",
    face: "gentle",
    outfit: "standard-uniform",
    accessory: "none",
  });
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const world = pendingWorldId ?? "elite-academy";

  const canSubmit = name.trim().length > 0 && strength !== weakness;

  const validation = useMemo(
    () =>
      CharacterCreatorSchema.safeParse({
        name: name.trim(),
        pronouns,
        personality,
        strength,
        weakness,
        background: background.trim() || undefined,
        appearance,
        world,
        difficulty,
      }),
    [name, pronouns, personality, strength, weakness, background, appearance, world, difficulty],
  );

  function updateAppearance<K extends keyof Appearance>(key: K, value: Appearance[K]) {
    setAppearance((a) => ({ ...a, [key]: value }));
  }

  async function handleBegin() {
    if (!validation.success) {
      setError("Check the highlighted fields — something's missing or invalid.");
      return;
    }
    setStarting(true);
    setError(null);
    await startNewGame(validation.data);
  }

  return (
    <ScreenFrame>
      <div className="flex flex-col items-center pt-4 pb-10">
        <h1 className="font-display mb-1 text-center text-sm text-ink-950">Create Your Character</h1>
        <p className="mb-6 text-center text-[10px] uppercase tracking-widest text-ink-500">
          Entering: {world === "elite-academy" ? "Elite Academy" : "Aincrad"}
        </p>

        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <Panel className="flex flex-col items-center gap-2">
              <PixelAvatar appearance={appearance} size={120} />
              <p className="max-w-[180px] truncate text-center text-xs font-bold">{name.trim() || "Unnamed"}</p>
              <p className="text-[10px] text-ink-500">{pronouns}</p>
            </Panel>
          </div>

          <div className="flex flex-col gap-4">
            <Panel title="Identity">
              <label className="mb-3 block">
                <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-500">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 24))}
                  placeholder="Enter a name"
                  className="w-full rounded border-2 border-ink-950 bg-paper-0 px-2 py-1.5 text-sm outline-none focus:border-accent-info"
                />
              </label>
              <OptionRow label="Pronouns" options={PRONOUNS} value={pronouns} onChange={setPronouns} />
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-500">Optional Background</span>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value.slice(0, 280))}
                  placeholder="A sentence or two about who they were before this story starts..."
                  className="h-16 w-full resize-none rounded border-2 border-ink-950 bg-paper-0 px-2 py-1.5 text-xs outline-none focus:border-accent-info"
                />
              </label>
            </Panel>

            <Panel title="Appearance">
              <OptionRow label="Hairstyle" options={HAIRSTYLES} value={appearance.hairstyle} onChange={(v) => updateAppearance("hairstyle", v)} />
              <OptionRow label="Hair Color" options={HAIR_COLORS} value={appearance.hairColor} onChange={(v) => updateAppearance("hairColor", v)} />
              <OptionRow label="Eye Color" options={EYE_COLORS} value={appearance.eyeColor} onChange={(v) => updateAppearance("eyeColor", v)} />
              <OptionRow label="Skin Tone" options={SKIN_TONES} value={appearance.skinTone} onChange={(v) => updateAppearance("skinTone", v)} />
              <OptionRow label="Face" options={FACE_OPTIONS} value={appearance.face} onChange={(v) => updateAppearance("face", v)} />
              <OptionRow label="Outfit" options={OUTFITS} value={appearance.outfit} onChange={(v) => updateAppearance("outfit", v)} />
              <OptionRow label="Accessory" options={ACCESSORIES} value={appearance.accessory} onChange={(v) => updateAppearance("accessory", v)} />
            </Panel>

            <Panel title="Personality">
              <div className="grid gap-2 sm:grid-cols-2">
                {PERSONALITY_ARCHETYPES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPersonality(p)}
                    className={`rounded border-2 p-2 text-left transition-colors ${
                      p === personality ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300 bg-paper-0 text-ink-800 hover:border-ink-950"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide">{p}</p>
                    <p className={`text-[10px] ${p === personality ? "text-ink-200" : "text-ink-500"}`}>{PERSONALITY_BLURB[p]}</p>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Strengths & Weakness">
              <p className="mb-2 text-[10px] text-ink-500">Pick a starting strength and a starting weakness — they can&apos;t be the same stat.</p>
              <OptionRow label="Strength" options={CORE_STAT_KEYS} value={strength} onChange={setStrength} />
              <OptionRow label="Weakness" options={CORE_STAT_KEYS} value={weakness} onChange={setWeakness} />
              {strength === weakness && <p className="text-[10px] text-accent-danger">Strength and weakness must differ.</p>}
            </Panel>

            <Panel title="Difficulty Mode">
              <div className="grid gap-2 sm:grid-cols-2">
                {DIFFICULTY_MODES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`rounded border-2 p-2 text-left transition-colors ${
                      d === difficulty ? "border-ink-950 bg-ink-950 text-paper-0" : "border-ink-300 bg-paper-0 text-ink-800 hover:border-ink-950"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide">{d}</p>
                    <p className={`text-[10px] ${d === difficulty ? "text-ink-200" : "text-ink-500"}`}>{DIFFICULTY_BLURB[d]}</p>
                  </button>
                ))}
              </div>
            </Panel>

            {error && <p className="text-xs text-accent-danger">{error}</p>}

            <div className="flex justify-between gap-2">
              <RetroButton variant="ghost" onClick={() => setScreen("worldSelect")} icon={<Icon name="arrow-left" size={14} />}>
                Back
              </RetroButton>
              <RetroButton disabled={!canSubmit || starting} onClick={handleBegin} icon={<Icon name="sparkles" size={14} />}>
                {starting ? "Entering..." : "Begin Story"}
              </RetroButton>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
