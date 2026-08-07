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

export type MusicTrack = "title" | "elite-academy" | "aincrad" | "battle";

const MUSIC_FILES: Record<MusicTrack, string> = {
  title: "/audio/music-title.wav",
  "elite-academy": "/audio/music-elite-academy.wav",
  aincrad: "/audio/music-aincrad.wav",
  battle: "/audio/music-battle.wav",
};

/**
 * Thin Howler.js wrapper. All original, synthesized UI/SFX/music — no licensed audio is
 * bundled anywhere (see README asset-license notes). Music tracks are short, seamless-loop
 * chiptune-style pieces generated the same way the SFX were (direct waveform synthesis),
 * not sourced from any existing work.
 */
class AudioManager {
  private sfxCache = new Map<SfxName, Howl>();
  private musicCache = new Map<MusicTrack, Howl>();
  private currentMusic: { track: MusicTrack; howl: Howl } | null = null;
  private settings: Pick<Settings, "audioEnabled" | "sfxVolume" | "musicVolume" | "ambienceVolume"> = {
    audioEnabled: true,
    sfxVolume: 0.7,
    musicVolume: 0.6,
    ambienceVolume: 0.5,
  };

  updateSettings(settings: Partial<typeof this.settings>) {
    this.settings = { ...this.settings, ...settings };
    this.currentMusic?.howl.volume(this.settings.audioEnabled ? this.settings.musicVolume : 0);
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

  /** Crossfades to `track`, looping. No-ops if it's already the current track. Safe to call on
   * every screen/world change — idempotent for the currently-playing track. */
  playMusic(track: MusicTrack) {
    if (typeof window === "undefined") return;
    if (this.currentMusic?.track === track) return;
    const prev = this.currentMusic;
    let howl = this.musicCache.get(track);
    if (!howl) {
      howl = new Howl({ src: [MUSIC_FILES[track]], loop: true, volume: 0, onloaderror: () => {} });
      this.musicCache.set(track, howl);
    }
    this.currentMusic = { track, howl };
    const targetVolume = this.settings.audioEnabled ? this.settings.musicVolume : 0;
    howl.play();
    howl.fade(0, targetVolume, 900);
    if (prev && prev.howl !== howl) {
      prev.howl.fade(prev.howl.volume(), 0, 700);
      setTimeout(() => prev.howl.stop(), 750);
    }
  }

  stopMusic() {
    if (!this.currentMusic) return;
    const { howl } = this.currentMusic;
    howl.fade(howl.volume(), 0, 500);
    setTimeout(() => howl.stop(), 550);
    this.currentMusic = null;
  }
}

export const audioManager = new AudioManager();
