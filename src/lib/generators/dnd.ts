import data from "@/data/generators/dndNames.json";
import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

interface First { name: string; race: string; gender: "male" | "female" | "neutral"; feel: string }
interface Family { name: string; race: string; meaning: string }

export const DND_FIRST = data.first as First[];
export const DND_FAMILY = data.family as Family[];

export const RACES: { id: string; label: string; emoji: string }[] = [
  { id: "human", label: "Human", emoji: "🧑" },
  { id: "elf", label: "Elf", emoji: "🧝" },
  { id: "dwarf", label: "Dwarf", emoji: "⛏️" },
  { id: "halfling", label: "Halfling", emoji: "🍀" },
  { id: "gnome", label: "Gnome", emoji: "⚙️" },
  { id: "half-elf", label: "Half-Elf", emoji: "🌗" },
  { id: "half-orc", label: "Half-Orc", emoji: "🪓" },
  { id: "tiefling", label: "Tiefling", emoji: "😈" },
  { id: "dragonborn", label: "Dragonborn", emoji: "🐉" },
  { id: "aasimar", label: "Aasimar", emoji: "😇" },
];

const RACE_LABEL = Object.fromEntries(RACES.map((r) => [r.id, r]));
const familyByRace = new Map<string, Family[]>();
for (const f of DND_FAMILY) familyByRace.set(f.race, [...(familyByRace.get(f.race) ?? []), f]);

export const GENDER_FILTER: FilterGroup = {
  id: "gender",
  label: "Gender",
  multi: true,
  options: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "neutral", label: "Neutral" },
  ],
};

export const dndFilters: FilterGroup[] = [
  { id: "race", label: "Race", multi: true, options: RACES.map((r) => ({ value: r.id, label: `${r.emoji} ${r.label}` })) },
  GENDER_FILTER,
];

export const dndGenerator = comboGenerator<First, Family>({
  items: DND_FIRST,
  baseKey: (f) => `${f.race}:${f.name}`,
  facets: { race: (f) => [f.race], gender: (f) => [f.gender] },
  extra: (f, rng) => pick(familyByRace.get(f.race) ?? DND_FAMILY, rng),
  extraKey: (fam) => fam.name,
  extraFromKey: (f, key) => (familyByRace.get(f.race) ?? []).find((fam) => fam.name === key) ?? null,
  toResult: (f, fam) => ({
    title: `${f.name} ${fam.name}`,
    subtitle: `${RACE_LABEL[f.race]?.emoji ?? ""} ${RACE_LABEL[f.race]?.label ?? f.race} · ${f.gender}`,
    detail: `${f.name}: ${f.feel}. ${fam.name}: ${fam.meaning}.`,
  }),
  variety: (filters) => {
    const races = filters.race?.length ? filters.race : RACES.map((r) => r.id);
    const avg = races.reduce((s, r) => s + (familyByRace.get(r)?.length ?? 0), 0) / races.length;
    return Math.max(1, Math.round(avg));
  },
});
