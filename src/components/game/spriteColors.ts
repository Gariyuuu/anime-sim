import type { Appearance } from "@/types";

/** Shared palette maps for every procedural sprite/portrait (PixelAvatar, PortraitFace) — keeps
 * player and NPC art visually consistent since they're built from the same layer system. */
export const SKIN: Record<Appearance["skinTone"], string> = {
  porcelain: "#f2ddc9",
  light: "#e8c3a0",
  tan: "#c68e5f",
  deep: "#8a5a35",
  olive: "#b89468",
};
export const HAIR: Record<Appearance["hairColor"], string> = {
  black: "#1a1a1a",
  brown: "#4a2f1f",
  auburn: "#7a3320",
  silver: "#dde1e8",
  "ash-blonde": "#c9b98a",
  charcoal: "#333333",
};
export const EYE: Record<Appearance["eyeColor"], string> = {
  "dark-brown": "#3a2412",
  gray: "#6b6b6b",
  hazel: "#7a6030",
  "steel-blue": "#4a6a8a",
  amber: "#a8701f",
  onyx: "#0c0c0c",
};
export const OUTFIT: Record<Appearance["outfit"], string> = {
  "standard-uniform": "#2a2a5a",
  "casual-layered": "#4a5a3a",
  "sport-fit": "#5a2a2a",
  tailored: "#1a1a1a",
};
