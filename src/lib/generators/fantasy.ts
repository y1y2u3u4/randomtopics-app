import dnd from "@/data/generators/dndNames.json";
import elf from "@/data/generators/elfNames.json";
import norse from "@/data/generators/vikingNames.json";
import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import { filterBy } from "@/lib/randomGenerators";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

// One pool for "fantasy name generator": the D&D-style race names, the four elf
// kinds and Old Norse names, each paired with a race-appropriate surname/house.

type Gender = "male" | "female" | "neutral";
interface Item { id: string; name: string; group: string; gender: Gender; note: string }
interface Tail { text: string; note: string }

export const FANTASY_GROUPS: { id: string; label: string }[] = [
  { id: "high-elf", label: "✨ High elf" }, { id: "wood-elf", label: "🌲 Wood elf" }, { id: "dark-elf", label: "🌑 Dark elf" }, { id: "sea-elf", label: "🌊 Sea elf" },
  { id: "dwarf", label: "⛏️ Dwarf" }, { id: "halfling", label: "🍀 Halfling" }, { id: "gnome", label: "⚙️ Gnome" }, { id: "half-orc", label: "🪓 Orc" },
  { id: "tiefling", label: "😈 Tiefling" }, { id: "dragonborn", label: "🐉 Dragonborn" }, { id: "human", label: "🧑 Human" }, { id: "half-elf", label: "🌗 Half-elf" },
  { id: "aasimar", label: "😇 Aasimar" }, { id: "norse", label: "🛡️ Norse (Viking)" },
];
const LABEL = Object.fromEntries(FANTASY_GROUPS.map((g) => [g.id, g.label]));

const items: Item[] = [
  ...(dnd.first as { name: string; race: string; gender: Gender; feel: string }[])
    .filter((f) => f.race !== "elf")
    .map((f) => ({ id: `${f.race}:${f.name}`, name: f.name, group: f.race, gender: f.gender, note: f.feel })),
  ...(elf.first as { name: string; type: string; gender: Gender; meaning: string }[])
    .map((f) => ({ id: `${f.type}-elf:${f.name}`, name: f.name, group: `${f.type}-elf`, gender: f.gender, note: f.meaning })),
  ...(norse.names as { name: string; ascii: string; gender: "male" | "female"; meaning: string }[])
    .map((n) => ({ id: `norse:${n.ascii}`, name: n.ascii, group: "norse", gender: n.gender, note: n.meaning })),
];

const tails = new Map<string, Tail[]>();
const add = (g: string, t: Tail) => tails.set(g, [...(tails.get(g) ?? []), t]);
for (const f of dnd.family as { name: string; race: string; meaning: string }[]) if (f.race !== "elf") add(f.race, { text: f.name, note: f.meaning });
for (const h of elf.surnames as { name: string; type: string; meaning: string }[]) add(`${h.type}-elf`, { text: h.name, note: h.meaning });
for (const b of norse.bynames as { text: string; meaning: string }[]) add("norse", { text: b.text, note: b.meaning });

export const FANTASY_COUNT = items.length;

export const fantasyFilters: FilterGroup[] = [
  { id: "race", label: "Race or culture", multi: true, options: FANTASY_GROUPS.map((g) => ({ value: g.id, label: g.label })) },
  GENDER_FILTER,
  { id: "style", label: "Name style", options: [{ value: "full", label: "First name + surname" }, { value: "first", label: "First name only" }] },
];

const base = comboGenerator<Item, Tail | null>({
  items,
  baseKey: (i) => i.id,
  facets: { race: (i) => [i.group], gender: (i) => [i.gender] },
  extra: (i, rng) => { const t = tails.get(i.group); return t?.length ? pick(t, rng) : null; },
  extraKey: (t) => t?.text ?? "",
  extraFromKey: (i, key) => (key ? (tails.get(i.group) ?? []).find((t) => t.text === key) ?? null : null),
  toResult: () => ({ title: "" }),
  variety: (f) => { const gs = f.race?.length ? f.race : FANTASY_GROUPS.map((g) => g.id); return Math.max(1, Math.round(gs.reduce((s, g) => s + (tails.get(g)?.length ?? 0), 0) / gs.length)); },
});

const byId = new Map(items.map((i) => [i.id, i]));
function render(key: string, style: string) {
  const cut = key.indexOf("|");
  const item = byId.get(key.slice(0, cut));
  if (!item) return null;
  const tail = (tails.get(item.group) ?? []).find((t) => t.text === key.slice(cut + 1)) ?? null;
  const withTail = style === "full" && tail;
  return {
    key,
    title: withTail ? `${item.name} ${tail.text}` : item.name,
    subtitle: `${LABEL[item.group]} · ${item.gender}`,
    detail: [`${item.name}: ${item.note}`, withTail ? `${tail.text}: ${tail.note}` : ""].filter(Boolean).join(" · "),
  };
}

export const fantasyNames = {
  poolSize: (f: FilterState) => (f.style?.[0] === "first" ? filterBy(filterBy(items, f.race ?? [], (i) => [i.group]), f.gender ?? [], (i) => [i.gender]).length : base.poolSize(f)),
  generate(f: FilterState, count: number, used: string[], seed: number) {
    const style = f.style?.[0] ?? "full";
    const out = base.generate(f, count, used, seed);
    return { used: out.used, results: out.results.map((r) => render(r.key, style)).filter((r): r is NonNullable<typeof r> => r !== null) };
  },
  resolve: (key: string, f: FilterState) => render(key, f.style?.[0] ?? "full"),
};
