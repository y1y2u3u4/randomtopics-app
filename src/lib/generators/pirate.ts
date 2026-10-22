import data from "@/data/generators/pirateNames.json";
import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

type PStyle = "fearsome" | "funny";
interface First { name: string; gender: "male" | "female" | "neutral" }
interface Part { name: string; meaning: string; style: PStyle }
interface Extra { style: PStyle; nick: Part; surname: Part; ship: string }

export const PIRATE_FIRST = data.first as First[];
export const PIRATE_NICKNAMES = data.nicknames as Part[];
export const PIRATE_SURNAMES = data.surnames as Part[];
export const SHIP_PARTS = data.ship as Record<PStyle, { adjectives: string[]; nouns: string[] }>;
export const SHIP_COUNT = (Object.values(SHIP_PARTS) as { adjectives: string[]; nouns: string[] }[]).reduce((n, p) => n + p.adjectives.length * p.nouns.length, 0);
const nickBy = new Map(PIRATE_NICKNAMES.map((n) => [n.name, n]));
const surBy = new Map(PIRATE_SURNAMES.map((n) => [n.name, n]));

export const pirateFilters: FilterGroup[] = [
  GENDER_FILTER,
  {
    id: "style",
    label: "Style",
    options: [
      { value: "fearsome", label: "☠️ Fearsome" },
      { value: "funny", label: "🦜 Funny" },
    ],
  },
  {
    id: "ship",
    label: "Ship name",
    options: [
      { value: "none", label: "No ship" },
      { value: "ship", label: "Add a ship name" },
    ],
  },
];

const styleOf = (v?: string): PStyle => (v === "funny" ? "funny" : "fearsome");

function shipName(style: PStyle, rng: () => number): string {
  const p = SHIP_PARTS[style];
  return `The ${pick(p.adjectives, rng)} ${pick(p.nouns, rng)}`;
}
const shipValid = (style: PStyle, ship: string) => {
  if (!ship) return true;
  const m = /^The (\S+) (\S+)$/.exec(ship);
  return !!m && SHIP_PARTS[style].adjectives.includes(m[1]) && SHIP_PARTS[style].nouns.includes(m[2]);
};

export const pirateGenerator = comboGenerator<First, Extra>({
  items: PIRATE_FIRST,
  baseKey: (f) => f.name,
  facets: { gender: (f) => [f.gender] },
  extra: (_f, rng, filters) => {
    const style = styleOf(filters.style?.[0]);
    return {
      style,
      nick: pick(PIRATE_NICKNAMES.filter((n) => n.style === style), rng),
      surname: pick(PIRATE_SURNAMES.filter((n) => n.style === style), rng),
      ship: filters.ship?.[0] === "ship" ? shipName(style, rng) : "",
    };
  },
  extraKey: (e) => [e.style, e.nick.name, e.surname.name, e.ship].join("~"),
  extraFromKey: (_f, key) => {
    const [style, nick, sur, ship = ""] = key.split("~");
    if (style !== "fearsome" && style !== "funny") return null;
    const n = nickBy.get(nick);
    const s = surBy.get(sur);
    if (!n || !s || n.style !== style || s.style !== style || !shipValid(style, ship)) return null;
    return { style, nick: n, surname: s, ship };
  },
  toResult: (f, e) => ({
    title: `${f.name} "${e.nick.name}" ${e.surname.name}`,
    subtitle: e.ship ? `🏴‍☠️ Captain of ${e.ship}` : `🏴‍☠️ ${e.style === "funny" ? "Funny" : "Fearsome"} · ${f.gender}`,
    detail: `"${e.nick.name}": ${e.nick.meaning} · ${e.surname.name}: ${e.surname.meaning}`,
  }),
  variety: (filters) => {
    const st = styleOf(filters.style?.[0]);
    const ships = filters.ship?.[0] === "ship" ? SHIP_PARTS[st].adjectives.length * SHIP_PARTS[st].nouns.length : 1;
    return PIRATE_NICKNAMES.filter((n) => n.style === st).length * PIRATE_SURNAMES.filter((n) => n.style === st).length * ships;
  },
});
