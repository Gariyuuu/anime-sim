import { Howl } from "howler";
import type { Settings } from "@/types/settings";

export type SfxName =
  | "ui-click"
  | "ui-confirm"
  | "ui-back"
  | "boot-startup"
  | "achievement"
  | "typing-blip"
  | "levelup"
  | "damage-hit"
  | "heal"
  | "victory-fanfare";

const SFX_FILES: Record<SfxName, string> = {
  "ui-click": "/audio/ui-click.wav",
  "ui-confirm": "/audio/ui-confirm.wav",
  "ui-back": "/audio/ui-back.wav",
  "boot-startup": "/audio/boot-startup.wav",
  achievement: "/audio/achievement.wav",
  "typing-blip": "/audio/typing-blip.wav",
  levelup: "/audio/levelup.wav",
  "damage-hit": "/audio/damage-hit.wav",
  heal: "/audio/heal.wav",
  "victory-fanfare": "/audio/victory-fanfare.wav",
};

/**
 * Thin Howler.js wrapper. All original, synthesized UI/SFX placeholders — no licensed
 * music is bundled (see README asset-license notes). Music/ambience categories are wired
 * for future tracks; without files loaded they simply no-op, so the game stays fully
 * playable with audio on, off, or entirely un-authored.
 */
class AudioManager {
  private sfxCache = new Map<SfxName, Howl>();
  private settings: Pick<Settings, "audioEnabled" | "sfxVolume" | "musicVolume" | "ambienceVolume"> = {
    audioEnabled: true,
    sfxVolume: 0.7,
    musicVolume: 0.6,
    ambienceVolume: 0.5,
  };

  updateSettings(settings: Partial<typeof this.settings>) {
    this.settings = { ...this.settings, ...settings };
  }

  playSfx(name: SfxName) {
    if (!this.settings.audioEnabled || typeof window === "undefined") return;
    let howl = this.sfxCache.get(name);
    if (!howl) {
      howl = new Howl({ src: [SFX_FILES[name]], volume: this.settings.sfxVolume, onloaderror: () => {} });
      this.sfxCache.set(name, howl);
    }
    howl.volume(this.settings.sfxVolume);
    howl.play();
  }
}

export const audioManager = new AudioManager();
