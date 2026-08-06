import {
  NpcDefinitionSchema,
  ItemDefinitionSchema,
  QuestDefinitionSchema,
  MapDefinitionSchema,
  ChapterDefinitionSchema,
  FloorDefinitionSchema,
  GuildDefinitionSchema,
  SceneSchema,
  SkillSchema,
  EnemyDefinitionSchema,
  EncounterDefinitionSchema,
  AchievementDefinitionSchema,
  CodexEntrySchema,
  type NpcDefinition,
  type ItemDefinition,
  type QuestDefinition,
  type MapDefinition,
  type ChapterDefinition,
  type FloorDefinition,
  type GuildDefinition,
  type ClassDefinition,
  type Scene,
  type Skill,
  type EnemyDefinition,
  type EncounterDefinition,
  type AchievementDefinition,
  type CodexEntry,
} from "@/types";

import { eliteAcademyNpcs } from "./worlds/elite-academy/npcs";
import { eliteAcademyItems } from "./worlds/elite-academy/items";
import { eliteAcademyQuests } from "./worlds/elite-academy/quests";
import { eliteAcademyMaps } from "./worlds/elite-academy/maps";
import { eliteAcademyScenes } from "./worlds/elite-academy/scenes";
import { eliteAcademyClasses } from "./worlds/elite-academy/classes";
import { eliteAcademyChapters, determineEliteChapterOutcome } from "./worlds/elite-academy/chapter";

import { aincradNpcs } from "./worlds/aincrad/npcs";
import { aincradItems } from "./worlds/aincrad/items";
import { aincradQuests } from "./worlds/aincrad/quests";
import { aincradMaps } from "./worlds/aincrad/maps";
import { aincradScenes } from "./worlds/aincrad/scenes";
import { aincradSkills } from "./worlds/aincrad/skills";
import { aincradEnemies } from "./worlds/aincrad/enemies";
import { aincradGuilds } from "./worlds/aincrad/guilds";
import { aincradFloors } from "./worlds/aincrad/floors";
import { aincradEncounters } from "./worlds/aincrad/encounters";
import { aincradChapters, determineAincradChapterOutcome } from "./worlds/aincrad/chapter";

import { achievements as achievementsInput } from "./achievements";
import { codexEntries as codexEntriesInput } from "./codex";
import { patchNotes } from "./patchnotes";

function parseAll<T>(schema: { parse: (v: unknown) => T }, items: unknown[]): T[] {
  return items.map((i) => schema.parse(i));
}

export const npcs: NpcDefinition[] = parseAll(NpcDefinitionSchema, [...eliteAcademyNpcs, ...aincradNpcs]);
export const items: ItemDefinition[] = parseAll(ItemDefinitionSchema, [...eliteAcademyItems, ...aincradItems]);
export const quests: QuestDefinition[] = parseAll(QuestDefinitionSchema, [...eliteAcademyQuests, ...aincradQuests]);
export const maps: MapDefinition[] = parseAll(MapDefinitionSchema, [...eliteAcademyMaps, ...aincradMaps]);
export const scenes: Scene[] = parseAll(SceneSchema, [...eliteAcademyScenes, ...aincradScenes]);
export const chapters: ChapterDefinition[] = parseAll(ChapterDefinitionSchema, [...eliteAcademyChapters, ...aincradChapters]);
export const classes: ClassDefinition[] = eliteAcademyClasses;
export const skills: Skill[] = parseAll(SkillSchema, aincradSkills);
export const enemies: EnemyDefinition[] = parseAll(EnemyDefinitionSchema, aincradEnemies);
export const guilds: GuildDefinition[] = parseAll(GuildDefinitionSchema, aincradGuilds);
export const floors: FloorDefinition[] = parseAll(FloorDefinitionSchema, aincradFloors);
export const encounters: EncounterDefinition[] = parseAll(EncounterDefinitionSchema, aincradEncounters);
export const achievements: AchievementDefinition[] = parseAll(AchievementDefinitionSchema, achievementsInput);
export const codexEntries: CodexEntry[] = parseAll(CodexEntrySchema, codexEntriesInput);
export { patchNotes };
export { determineEliteChapterOutcome, determineAincradChapterOutcome };

const npcById = new Map(npcs.map((n) => [n.id, n]));
const itemById = new Map(items.map((i) => [i.id, i]));
const questById = new Map(quests.map((q) => [q.id, q]));
const mapById = new Map(maps.map((m) => [m.id, m]));
const sceneById = new Map(scenes.map((s) => [s.id, s]));
const chapterById = new Map(chapters.map((c) => [c.id, c]));
const classById = new Map(classes.map((c) => [c.id, c]));
const skillById = new Map(skills.map((s) => [s.id, s]));
const enemyById = new Map(enemies.map((e) => [e.id, e]));
const guildById = new Map(guilds.map((g) => [g.id, g]));
const floorById = new Map(floors.map((f) => [f.id, f]));
const encounterById = new Map(encounters.map((e) => [e.id, e]));
const achievementById = new Map(achievements.map((a) => [a.id, a]));
const codexById = new Map(codexEntries.map((c) => [c.id, c]));

export const getNpc = (id: string): NpcDefinition | undefined => npcById.get(id);
export const getItem = (id: string): ItemDefinition | undefined => itemById.get(id);
export const getQuest = (id: string): QuestDefinition | undefined => questById.get(id);
export const getMap = (id: string): MapDefinition | undefined => mapById.get(id);
export const getScene = (id: string): Scene | undefined => sceneById.get(id);
export const getChapter = (id: string): ChapterDefinition | undefined => chapterById.get(id);
export const getClass = (id: string): ClassDefinition | undefined => classById.get(id);
export const getSkill = (id: string): Skill | undefined => skillById.get(id);
export const getEnemy = (id: string): EnemyDefinition | undefined => enemyById.get(id);
export const getGuild = (id: string): GuildDefinition | undefined => guildById.get(id);
export const getFloor = (id: string): FloorDefinition | undefined => floorById.get(id);
export const getEncounter = (id: string): EncounterDefinition | undefined => encounterById.get(id);
export const getAchievement = (id: string): AchievementDefinition | undefined => achievementById.get(id);
export const getCodexEntry = (id: string): CodexEntry | undefined => codexById.get(id);

export function npcsForWorld(worldId: "elite-academy" | "aincrad"): NpcDefinition[] {
  return npcs.filter((n) => n.worldId === worldId);
}

export function questsForWorld(worldId: "elite-academy" | "aincrad"): QuestDefinition[] {
  return quests.filter((q) => q.worldId === worldId);
}

export function floorsSorted(): FloorDefinition[] {
  return [...floors].sort((a, b) => a.index - b.index);
}

export function chaptersForWorld(worldId: "elite-academy" | "aincrad"): ChapterDefinition[] {
  return chapters.filter((c) => c.worldId === worldId).sort((a, b) => a.index - b.index);
}
