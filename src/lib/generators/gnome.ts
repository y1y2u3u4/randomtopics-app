import data from "@/data/generators/gnomeNames.json";
import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

interface GnomeFirst { name: string; gender: "male" | "female" | "neutral"; feel: string }
interface Part { name: string; meaning: string }
interface Extra { nick: Part | null; clan: Part }

export const GNOME_FIRST = data.first as GnomeFirst[];
export const GNOME_NICKNAMES = data.nicknames as Part[];
export const GNOME_CLANS = data.clans as Part[];
const nickBy = new Map(GNOME_NICKNAMES.map((n) => [n.name, n]));
const clanBy = new Map(GNOME_CLANS.map((c) => [c.name, c]));

export const gnomeFilters: FilterGroup[] = [
  GENDER_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "full", label: "Name + nickname + clan" },
      { value: "clan", label: "Name + clan" },
    ],
  },
];

export const gnomeGenerator = comboGenerator<GnomeFirst, Extra>({
  items: GNOME_FIRST,
  baseKey: (g) => g.name,
  facets: { gender: (g) => [g.gender] },
  extra: (_g, rng, filters) => ({
    nick: (filters.style?.[0] ?? "full") === "full" ? pick(GNOME_NICKNAMES, rng) : null,
    clan: pick(GNOME_CLANS, rng),
  }),
  extraKey: (e) => `${e.nick?.name ?? ""}|${e.clan.name}`,
  extraFromKey: (_g, key) => {
    const [nick, clan] = key.split("|");
    const c = clanBy.get(clan);
    const n = nick ? nickBy.get(nick) : null;
    if (!c || (nick && !n)) return null;
    return { nick: n ?? null, clan: c };
  },
  toResult: (g, e) => ({
    title: e.nick ? `${g.name} "${e.nick.name}" ${e.clan.name}` : `${g.name} ${e.clan.name}`,
    subtitle: `⚙️ Gnome · ${g.gender}`,
    detail: [`${g.name}: ${g.feel}`, e.nick ? `nicknamed ${e.nick.name} ${e.nick.meaning}` : "", `${e.clan.name} clan: ${e.clan.meaning}`].filter(Boolean).join(" · "),
  }),
  variety: (filters) => GNOME_CLANS.length * ((filters.style?.[0] ?? "full") === "full" ? GNOME_NICKNAMES.length : 1),
});
