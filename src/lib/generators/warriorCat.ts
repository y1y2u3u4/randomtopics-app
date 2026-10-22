import data from "@/data/generators/warriorCatNames.json";
import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export type CatTheme = "pelt" | "plant" | "water" | "sky" | "fire" | "stone" | "wild";
export type CatRank = "kit" | "apprentice" | "warrior" | "leader";
interface Prefix { name: string; theme: CatTheme; look: string }
interface Part { name: string; meaning: string }
interface Extra { rank: CatRank; suffix: Part | null; clan: Part | null }

export const CAT_PREFIXES = data.prefixes as Prefix[];
export const CAT_SUFFIXES = data.suffixes as Part[];
export const CAT_CLANS = data.clans as Part[];
const suffixBy = new Map(CAT_SUFFIXES.map((s) => [s.name, s]));
const clanBy = new Map(CAT_CLANS.map((c) => [c.name, c]));

export const CAT_THEMES: { id: CatTheme; label: string }[] = [
  { id: "pelt", label: "🎨 Pelt & colour" },
  { id: "plant", label: "🌿 Plants & forest" },
  { id: "water", label: "💧 Water & marsh" },
  { id: "sky", label: "🌙 Sky, weather & night" },
  { id: "fire", label: "🔥 Fire & embers" },
  { id: "stone", label: "⛰️ Stone & earth" },
  { id: "wild", label: "🦅 Wild animals" },
];

export const RANK_ENDINGS: Record<CatRank, { ending: string; label: string }> = {
  kit: { ending: "kit", label: "kit — a young cat under six moons" },
  apprentice: { ending: "paw", label: "apprentice — training to be a warrior" },
  warrior: { ending: "", label: "warrior — a full clan hunter and fighter" },
  leader: { ending: "star", label: "leader — head of the clan" },
};

export const catFilters: FilterGroup[] = [
  {
    id: "rank",
    label: "Rank",
    options: [
      { value: "warrior", label: "Warrior (-pelt, -tail…)" },
      { value: "kit", label: "Kit (-kit)" },
      { value: "apprentice", label: "Apprentice (-paw)" },
      { value: "leader", label: "Leader (-star)" },
    ],
  },
  { id: "theme", label: "Theme", multi: true, options: CAT_THEMES.map((t) => ({ value: t.id, label: t.label })) },
  {
    id: "clan",
    label: "Clan",
    options: [
      { value: "none", label: "No clan" },
      { value: "clan", label: "Add a clan name" },
    ],
  },
];

const rankOf = (v?: string): CatRank => (v === "kit" || v === "apprentice" || v === "leader" ? v : "warrior");

function suffixFor(prefix: Prefix, rng: () => number): Part {
  for (let i = 0; i < 20; i++) {
    const s = pick(CAT_SUFFIXES, rng);
    const p = prefix.name.toLowerCase();
    if (p !== s.name && !p.endsWith(s.name)) return s;
  }
  return CAT_SUFFIXES[0];
}

const nameOf = (p: Prefix, e: Extra) => `${p.name}${e.suffix ? e.suffix.name : RANK_ENDINGS[e.rank].ending}`;

export const catGenerator = comboGenerator<Prefix, Extra>({
  items: CAT_PREFIXES,
  baseKey: (p) => p.name,
  facets: { theme: (p) => [p.theme] },
  extra: (p, rng, filters) => ({
    rank: rankOf(filters.rank?.[0]),
    suffix: rankOf(filters.rank?.[0]) === "warrior" ? suffixFor(p, rng) : null,
    clan: filters.clan?.[0] === "clan" ? pick(CAT_CLANS, rng) : null,
  }),
  extraKey: (e) => `${e.rank}|${e.suffix?.name ?? ""}|${e.clan?.name ?? ""}`,
  extraFromKey: (_p, key) => {
    const [rank, suffix, clan] = key.split("|");
    if (!(rank in RANK_ENDINGS)) return null;
    const s = suffix ? suffixBy.get(suffix) : null;
    const c = clan ? clanBy.get(clan) : null;
    if ((suffix && !s) || (clan && !c)) return null;
    return { rank: rank as CatRank, suffix: s ?? null, clan: c ?? null };
  },
  toResult: (p, e) => ({
    title: e.clan ? `${nameOf(p, e)} of ${e.clan.name}` : nameOf(p, e),
    subtitle: `🐈 ${e.rank[0].toUpperCase()}${e.rank.slice(1)} · ${CAT_THEMES.find((t) => t.id === p.theme)?.label.slice(3)}`,
    detail: [
      `${p.name}: ${p.look}`,
      e.suffix ? `-${e.suffix.name}: ${e.suffix.meaning}` : `-${RANK_ENDINGS[e.rank].ending}: ${RANK_ENDINGS[e.rank].label}`,
      e.clan ? `${e.clan.name}: ${e.clan.meaning}` : "",
    ].filter(Boolean).join(" · "),
  }),
  variety: (filters) => (rankOf(filters.rank?.[0]) === "warrior" ? CAT_SUFFIXES.length : 1) * (filters.clan?.[0] === "clan" ? CAT_CLANS.length : 1),
});
