import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export type CityStyle = "fantasy" | "dark" | "scifi" | "english" | "spanish" | "german" | "nordic" | "italian";
interface Root { root: string; style: CityStyle }

const roots = (style: CityStyle, list: string): Root[] => list.split(" ").map((root) => ({ root, style }));

// Each name is a root plus a suffix from the same tradition, so the pair always sounds like one place.
export const CITY_ROOTS: Root[] = [
  ...roots("fantasy", "Silver Raven Amber Thorn Willow Oak Ever Starfall Gold Mist Bright Dawn Elder Moon Stone Iron Frost Rose Glimmer Hollow Fair Summer Wind Ash Deep Lark Wolf Briar High Swan"),
  ...roots("dark", "Grim Black Dread Murk Gloom Bleak Bone Raven Shade Hag Wither Rot Blight Sorrow Crow Ash Night Ember Skull Mourn Fang Gall Cinder Dusk Hex"),
  ...roots("scifi", "Nova Helix Vega Kepler Orion Cygnus Tycho Zenith Arcturus Lyra Halcyon Polaris Titan Rhea Cerulean Axiom Vector Solace Meridian Corvus Draco Hyperion Elara Eos Juno Altair Sirius Atlas Calyx Nadir"),
  ...roots("english", "Ash Brad Chester Ely Hart Kings Lang Lowe Mar Notting Ox Pen Red Rother Salt Shel Staf Thorn Wake Wey Whit Wil Brook Bram Ald Bex Cran Dun Harrow Mel"),
  ...roots("spanish", "Valle Sierra Alta Río Santa Puerto Villa Monte Agua Costa Nueva Torre Campo Peña Mar Llano Fuente Arroyo Cruz Rosa Loma Vega Alameda Oliva Piedra Sol Luna Palma Mesa Cerro"),
  ...roots("german", "Ahl Alt Bern Dorn Eisen Falken Grün Hohen Kirch Lauf Linden Mühl Neu Ober Rosen Schön Stein Tann Wald Weiß Wolfs Ehren Hirsch Kalten Lichten Mark Sonnen Unter Wasser Eber"),
  ...roots("nordic", "Ask Bjørn Dal Frey Grim Hald Hav Is Kald Ljung Mjøl Nord Odd Ran Sig Skog Sol Stav Tor Ulf Vik Ylva Ørn Eld Brann Fjell Haug Lund Myr Sand"),
  ...roots("italian", "Monte Castel Villa Borgo Porto San Santa Rocca Torre Fonte Valle Poggio Colle Pietra Rio Terra Lago Bel Fior Ponte Campo Ripa Serra Sasso Acqua Alto Pian Vico Casale Mare"),
];

const SUFFIXES: Record<CityStyle, string[]> = {
  fantasy: ["haven", "mere", "hold", "fall", "reach", "vale", "crest", "spire", "wick", "ford", "glen", "watch", "keep", "brook", "shire", "gate", "rest", "hollow"],
  dark: ["moor", "fen", "maw", "gloom", "barrow", "mire", "hold", "spire", "rook", "grave", "wold", "holt", "hallow", "crag", "pit", "cairn"],
  scifi: [" Prime", " Station", " IX", " Colony", " Reach", " Arcology", " Outpost", " City", "-7", " Nexus", " Habitat", " Spire", " Terminus", " Haven", "-IV", " Ring"],
  english: ["ton", "ford", "bury", "field", "ham", "ley", "worth", "wick", "by", "minster", "stead", "mouth", "cester", "bridge", "well", "combe", "port", "dale"],
  spanish: [" del Sol", " Verde", " Blanca", " de la Sierra", " del Mar", " Alta", " Real", " Dorada", " de San Juan", " Hermosa", " del Valle", " Clara", " Nueva", " del Río"],
  german: ["burg", "berg", "dorf", "hausen", "heim", "stadt", "bach", "feld", "furt", "brück", "au", "tal", "hof", "rode", "stein", "ingen"],
  nordic: ["vik", "fjord", "dal", "heim", "by", "vall", "sund", "nes", "holm", "berg", "stad", "lund", "havn", "ø", "strand", "ås"],
  italian: ["fiore", " d'Oro", "nuovo", " al Mare", " Verde", " Alto", "lungo", " del Lago", " Bianco", " di Sopra", "franco", " San Marco", "vecchio", "chiaro"],
};

// One-line hooks: enough to drop the place into a story or a map.
const HOOKS: Record<CityStyle, string[]> = {
  fantasy: ["River-trade town under an elven bridge", "Walled city of mages and booksellers", "Harbour where sky-ships dock", "Market town at the crossroads of three kingdoms", "Mountain hold famous for silver mines", "Lakeside city of white towers", "Druid-guarded village in the old forest", "Pilgrim town built around a fallen star"],
  dark: ["Plague-scarred town behind a black wall", "Marsh village that never sees the sun", "City ruled by a vampire council", "Mining town that dug too deep", "Border fort overrun by the restless dead", "Bell-less city after the cult took the temple", "Witch-haunted hamlet on the moor", "Crumbling capital of a fallen empire"],
  scifi: ["Orbital ring city above a gas giant", "Terraformed colony under a glass dome", "Mining outpost on a frozen moon", "Megacity stacked 400 levels deep", "Generation-ship district that never landed", "Desert spaceport and smuggler hub", "Floating research arcology on an ocean world", "Frontier colony at the edge of mapped space"],
  english: ["Market town with a Norman church", "Cathedral city on the river", "Fishing harbour on the north coast", "Former mill town in the dales", "Commuter town with a Saturday market", "Seaside resort with a Victorian pier"],
  spanish: ["Hill town of whitewashed houses", "Port city with a Moorish old quarter", "Wine village in the high valleys", "Colonial city around a plaza mayor", "Fishing town on the Atlantic coast", "Mountain town known for its fiesta"],
  german: ["Half-timbered town on a river bend", "Castle town at the foot of the hills", "Spa town in the Black Forest", "Old Hanseatic trading port", "Brewery village with a Saturday market", "Imperial free city with a walled old town"],
  nordic: ["Fjord village of red wooden houses", "Harbour town with a stave church", "Island fishing settlement", "Mining town above the Arctic Circle", "Old Viking trading post", "Lake town ringed by pine forest"],
  italian: ["Hilltop borgo with a bell tower", "Fishing village of painted houses", "Vineyard town in the hills", "Medieval town with a walled piazza", "Lakeside resort town", "Port city with a Renaissance harbour"],
};

export const CITY_STYLES: { id: CityStyle; label: string; short: string; group: "Fantasy" | "Sci-fi" | "Real-world style" }[] = [
  { id: "fantasy", label: "🏰 Fantasy", short: "Fantasy", group: "Fantasy" },
  { id: "dark", label: "🦇 Dark fantasy", short: "Dark fantasy", group: "Fantasy" },
  { id: "scifi", label: "🚀 Sci-fi", short: "Sci-fi", group: "Sci-fi" },
  { id: "english", label: "🇬🇧 English", short: "English-style", group: "Real-world style" },
  { id: "spanish", label: "🇪🇸 Spanish", short: "Spanish-style", group: "Real-world style" },
  { id: "german", label: "🇩🇪 German", short: "German-style", group: "Real-world style" },
  { id: "nordic", label: "🇳🇴 Nordic", short: "Nordic-style", group: "Real-world style" },
  { id: "italian", label: "🇮🇹 Italian", short: "Italian-style", group: "Real-world style" },
];

const SIZES = ["Village", "Town", "City", "Capital"] as const;
type Size = (typeof SIZES)[number];
const POPULATION: Record<Size, [number, number]> = { Village: [80, 900], Town: [1_200, 18_000], City: [25_000, 400_000], Capital: [500_000, 4_000_000] };

export const cityFilters: FilterGroup[] = [
  { id: "style", label: "Style", multi: true, options: CITY_STYLES.map((s) => ({ value: s.id, label: s.label })) },
  {
    id: "size",
    label: "Size",
    options: [
      { value: "any", label: "Any size" },
      ...SIZES.map((s) => ({ value: s.toLowerCase(), label: s })),
    ],
  },
];

export function joinCity(root: string, suffix: string): string {
  if (suffix.startsWith(" ") || suffix.startsWith("-") || suffix.startsWith("'")) return root + suffix;
  // Drop a doubled vowel at the seam ("Valle" + "ennes" style joins).
  const last = root.slice(-1).toLowerCase();
  const first = suffix[0];
  return last === first && "aeiou".includes(last) ? root + suffix.slice(1) : root + suffix;
}

interface Extra { suffix: string; size: Size; hook: number; pop: number }

export const cityGenerator = comboGenerator<Root, Extra>({
  items: CITY_ROOTS,
  baseKey: (r) => `${r.style}-${r.root}`,
  facets: { style: (r) => [r.style] },
  extra: (r, rng, filters) => {
    const wanted = (filters.size?.[0] ?? "any") as string;
    const size = (SIZES.find((s) => s.toLowerCase() === wanted) ?? pick(SIZES, rng)) as Size;
    const [lo, hi] = POPULATION[size];
    return {
      suffix: pick(SUFFIXES[r.style], rng),
      size,
      hook: Math.floor(rng() * HOOKS[r.style].length),
      pop: Math.round((lo + rng() * (hi - lo)) / 10) * 10,
    };
  },
  extraKey: (e) => [e.suffix, e.size, e.hook, e.pop].join("|"),
  extraFromKey: (r, key) => {
    const [suffix = "", size = "", hook = "", pop = ""] = key.split("|");
    if (!SUFFIXES[r.style].includes(suffix) || !SIZES.includes(size as Size)) return null;
    const h = Number(hook);
    const p = Number(pop);
    if (!Number.isInteger(h) || h < 0 || h >= HOOKS[r.style].length || !Number.isFinite(p)) return null;
    return { suffix, size: size as Size, hook: h, pop: p };
  },
  toResult: (r, e) => {
    const style = CITY_STYLES.find((s) => s.id === r.style);
    return {
      title: joinCity(r.root, e.suffix),
      subtitle: `${style?.label} · ${e.size} · pop. ${e.pop.toLocaleString("en-US")}`,
      detail: HOOKS[r.style][e.hook],
    };
  },
  variety: (filters) => {
    const styles = filters.style?.length ? filters.style : CITY_STYLES.map((s) => s.id);
    const avg = styles.reduce((n, s) => n + (SUFFIXES[s as CityStyle]?.length ?? 0), 0) / styles.length;
    return Math.floor(avg);
  },
});
