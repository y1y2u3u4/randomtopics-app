import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import { glossed, roots, rootNames } from "./rootNames";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Dwarf names: a short, heavy given name built from two meaningful roots, then
// a clan name (Ironfist) or a parent's name ("son of Brom"). Each hold has its
// own sound: mountain halls are grand, hill dwarves are homely, deep dwarves
// are dark and clipped, frost dwarves sound Norse.
export type Hold = "mountain" | "hill" | "deep" | "frost";
type Gender = "male" | "female" | "neutral";

const PREFIX: Record<Hold, ReturnType<typeof roots>> = {
  mountain: roots("Thor:thunder, Bal:stone, Dur:enduring, Grim:stern, Kaz:peak, Mor:great hall, Brom:bear, Hel:shield, Vond:gate"),
  hill: roots("Bar:barley, Rur:hearth, Tak:hammer, Ost:ale, Eber:boar, Har:harvest, Gar:garden, Fen:field, Dol:hill"),
  deep: roots("Dag:dark, Uln:deep, Gor:gloom, Nar:root, Krag:crag, Zul:silence, Vek:cave, Drak:ore vein, Mol:tunnel"),
  frost: roots("Hrim:rime, Bjor:bear, Ska:snow, Ing:ice, Frey:frost, Rag:storm, Sol:sun on snow, Ulf:wolf, Kel:cold"),
};

const SUFFIX: Record<Gender, ReturnType<typeof roots>> = {
  male: roots("in:son, rik:ruler, ar:warrior, dal:valley, gar:spear, ur:fire, ek:axe, li:keeper, grun:beard"),
  female: roots("hild:battle, dis:lady, wyn:joy, ra:wisdom, gret:pearl, eth:hearth, vi:life"),
  neutral: roots("nor:north, ok:anvil, um:deep"),
};

export const DWARF_NAMES = rootNames(PREFIX, SUFFIX, 9);

const clans = (hold: Hold, list: string) => glossed(list).map((c) => ({ ...c, hold }));

export const DWARF_CLANS = [
  ...clans("mountain", "Ironfist = never lost a hold it built; Stonehelm = wears helmets carved from a single stone; Goldvein = found the richest seam in the range; Hammerfall = its founder broke a dragon's jaw with a hammer; Deepdelve = mines the oldest tunnels in the mountain; Anvilheart = says its forge has burned for a thousand years; Highgate = guards the main door of the kingdom; Oakenshield = once fought with a branch when its shield broke; Granitebeard = braids grey stone beads into its beards; Thunderhall = holds its feasts in a hall that echoes like a storm; Runekeeper = keeps the king's carved records; Kingsforge = makes the crowns"),
  ...clans("hill", "Brewbarrel = brews the best ale on either side of the river; Hearthstone = never lets the home fire go out; Copperpot = cooks for the whole valley at harvest; Greenhill = farms the slopes above the mines; Hornblower = calls the clans to council; Barleycorn = trades grain for iron with the mountain halls; Stoutbelly = proud of it; Fieldmaul = turned its war hammers into ploughs; Mossbeard = lets its beards grow wild; Merryaxe = sings while it chops; Honeycomb = keeps bees in old helmets; Ploughshare = has not gone to war in three generations"),
  ...clans("deep", "Darkdelver = mines where light has never been; Gloomhammer = works without torches; Blackanvil = forges weapons that drink light; Shadowvein = follows ore by sound alone; Silentpick = mines without speaking; Rootbreaker = digs beneath the roots of the world; Cinderdeep = lives beside a river of lava; Gravelgrip = never lets go once it holds; Ashbeard = has beards grey from forge-smoke; Duskforge = only lights its forges at night; Hollowstone = carved a city inside a single geode; Ironmole = tunnels faster than any other clan"),
  ...clans("frost", "Frostbeard = beards white with ice all year; Snowmantle = wears bear-fur cloaks; Icehammer = hunts mammoths on the glacier; Wolfbrand = rides great white wolves; Winterforge = forges only in the coldest month; Glacierborn = lives inside the ice itself; Rimehold = guards a fortress no summer reaches; Stormsong = sings to call the blizzard; Bearclaw = wears the claws of its first hunt; Coldsteel = makes blades that ring in the cold; Whitepeak = climbs the tallest peak each spring; Skaldhorn = remembers every saga by heart"),
];

export const DWARF_HOLDS: { id: Hold; label: string; short: string }[] = [
  { id: "mountain", label: "⛰️ Mountain hall", short: "Mountain hall" },
  { id: "hill", label: "🌾 Hill dwarf", short: "Hill dwarf" },
  { id: "deep", label: "🕳️ Deep dwarf", short: "Deep dwarf" },
  { id: "frost", label: "❄️ Frost dwarf", short: "Frost dwarf" },
];

export const dwarfFilters: FilterGroup[] = [
  { id: "hold", label: "Hold", multi: true, options: DWARF_HOLDS.map((h) => ({ value: h.id, label: h.label })) },
  GENDER_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "clan", label: "Name + clan" },
      { value: "parent", label: "Son / daughter of…" },
      { value: "first", label: "Name only" },
    ],
  },
];

type Name = (typeof DWARF_NAMES)[number];
type Clan = (typeof DWARF_CLANS)[number];
interface Extra { clan: Clan | null; parent: Name | null }
const clanBy = new Map(DWARF_CLANS.map((c) => [c.name, c]));
const nameBy = new Map(DWARF_NAMES.map((n) => [n.name, n]));
const child = (g: Gender) => (g === "male" ? "son" : g === "female" ? "daughter" : "child");

export const dwarfGenerator = comboGenerator<Name, Extra>({
  items: DWARF_NAMES,
  baseKey: (n) => n.name,
  facets: { hold: (n) => [n.group], gender: (n) => [n.gender] },
  extra: (n, rng, filters) => {
    const style = filters.style?.[0] ?? "clan";
    if (style === "clan") return { clan: pick(DWARF_CLANS.filter((c) => c.hold === n.group), rng), parent: null };
    if (style === "parent") return { clan: null, parent: pick(DWARF_NAMES.filter((p) => p.group === n.group && p.name !== n.name && p.gender !== "neutral"), rng) };
    return { clan: null, parent: null };
  },
  extraKey: (e) => (e.clan ? `c:${e.clan.name}` : e.parent ? `p:${e.parent.name}` : ""),
  extraFromKey: (n, key) => {
    if (!key) return { clan: null, parent: null };
    if (key.startsWith("p:")) { const parent = nameBy.get(key.slice(2)); return parent ? { clan: null, parent } : null; }
    const clan = clanBy.get(key.slice(2));
    return clan && clan.hold === n.group ? { clan, parent: null } : null;
  },
  toResult: (n, { clan, parent }) => ({
    title: clan ? `${n.name} ${clan.name}` : parent ? `${n.name}, ${child(n.gender)} of ${parent.name}` : n.name,
    subtitle: `⚒️ ${DWARF_HOLDS.find((h) => h.id === n.group)?.short} · ${n.gender}`,
    detail: [
      `${n.name}: ${n.meaning}`,
      clan ? `${clan.name} clan: ${clan.meaning}` : "",
      parent ? `${parent.name}: ${parent.meaning}` : "",
    ].filter(Boolean).join(" · "),
  }),
  variety: (filters) => {
    const style = filters.style?.[0] ?? "clan";
    return style === "clan" ? 12 : style === "parent" ? 40 : 1;
  },
});
