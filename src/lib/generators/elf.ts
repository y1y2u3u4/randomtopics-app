import data from "@/data/generators/elfNames.json";
import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export type ElfType = "high" | "wood" | "dark" | "sea";
interface ElfFirst { name: string; type: ElfType; gender: "male" | "female" | "neutral"; meaning: string }
interface House { name: string; type: ElfType; meaning: string }

export const ELF_FIRST = data.first as ElfFirst[];
export const ELF_HOUSES = data.surnames as House[];
const houseBy = new Map(ELF_HOUSES.map((h) => [h.name, h]));

export const ELF_TYPES: { id: ElfType; label: string; short: string }[] = [
  { id: "high", label: "✨ High elf", short: "High elf" },
  { id: "wood", label: "🌲 Wood elf", short: "Wood elf" },
  { id: "dark", label: "🌑 Dark elf (drow)", short: "Dark elf" },
  { id: "sea", label: "🌊 Sea elf", short: "Sea elf" },
];

export const elfFilters: FilterGroup[] = [
  { id: "type", label: "Elf type", multi: true, options: ELF_TYPES.map((t) => ({ value: t.id, label: t.label })) },
  GENDER_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "full", label: "First name + house" },
      { value: "first", label: "First name only" },
    ],
  },
];

interface Extra { house: House | null }

export const elfGenerator = comboGenerator<ElfFirst, Extra>({
  items: ELF_FIRST,
  baseKey: (f) => f.name,
  facets: { type: (f) => [f.type], gender: (f) => [f.gender] },
  extra: (f, rng, filters) => ({
    house: (filters.style?.[0] ?? "full") === "full" ? pick(ELF_HOUSES.filter((h) => h.type === f.type), rng) : null,
  }),
  extraKey: (e) => e.house?.name ?? "",
  extraFromKey: (f, key) => {
    if (!key) return { house: null };
    const h = houseBy.get(key);
    return h && h.type === f.type ? { house: h } : null;
  },
  toResult: (f, { house }) => ({
    title: house ? `${f.name} ${house.name}` : f.name,
    subtitle: `🧝 ${ELF_TYPES.find((t) => t.id === f.type)?.short} · ${f.gender}`,
    detail: [`${f.name}: ${f.meaning}`, house ? `House ${house.name}: ${house.meaning}` : ""].filter(Boolean).join(" · "),
  }),
  variety: (filters) => ((filters.style?.[0] ?? "full") === "full" ? Math.floor(ELF_HOUSES.length / ELF_TYPES.length) : 1),
});
