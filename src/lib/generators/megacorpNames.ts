import { comboGenerator, pick } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

// A megacorp = a root name (sets the genre sound) + a sector (what it sells)
// in one of four naming patterns, plus a ticker and a slogan. Everything that
// is random is stored in the result key, so a shared link shows the same corp.
// Roots are original words and surnames: no franchise corporations (Arasaka,
// Weyland-Yutani, Tyrell, Umbrella…) and no real mega-companies.
export type CorpGenre = "cyberpunk" | "space" | "dystopian" | "retro" | "merger";
export type CorpSector = "weapons" | "biotech" | "cybernetics" | "ai" | "energy" | "mining" | "media" | "consumer" | "finance" | "security";
interface Root { word: string; genre: CorpGenre }

const roots = (genre: CorpGenre, list: string): Root[] => list.split(", ").map((word) => ({ word, genre }));

export const CORP_ROOTS: Root[] = [
  ...roots("cyberpunk", "Hayashi, Okami, Ryuzen, Kessler, Voss, Kaito, Ishikawa, Nakara, Vektor, Hexacore, Synthex, Chromex, Neurax, Kyber, Datavane, Blackglass, Redline, Gridlock, Zero-Day, Holotech, Jinrai, Sakuma, Obsidian, Kurogane"),
  ...roots("space", "Helios, Kepler, Vanguard, Orion, Novaterra, Andromeda, Aphelion, Perihelion, Halcyon, Tycho, Ceres, Titan, Europa, Lagrange, Zenith, Astra, Meridian, Corvus, Vega, Polaris, Hyperion, Oort, Solaris, Farreach"),
  ...roots("dystopian", "Benevolent, Harmony, Tomorrow, Brightside, Wellspring, Unity, Serenity, Providence, Paragon, Sunrise, Gentle Hand, Halo, Lumina, Glad, Contentment, Utopia, Haven, Cradle, Shepherd, Covenant, Sanctum, Concord, Hearth, Kindred"),
  ...roots("retro", "Atomic, Rocket, Starlite, Uranium, Jetstream, Futura, Radium, Cosmo, Zephyr, Dynamo, Supersonic, Electro, Vulcan, Gamma, Thunderbolt, Silverline, Astro, Chromium, Galaxie, Orbitron, Moonbeam, Quasar, Sputnik, Ray-O"),
  ...roots("merger", "Ashcroft, Vance, Thorne, Halvorsen, Montclair, Draycott, Sterling, Kovac, Lindqvist, Okonkwo, Moreau, Takahara, Brandt, Castellan, Whitlock, Rothwell, Delacroix, Novak, Hargreave, Valdivia, Petrov, Seong, Achterberg, Mirza"),
];

export const CORP_GENRES: { id: CorpGenre; label: string; short: string }[] = [
  { id: "cyberpunk", label: "🌃 Cyberpunk", short: "Cyberpunk" },
  { id: "space", label: "🚀 Space & sci-fi", short: "Space" },
  { id: "dystopian", label: "🙂 Friendly dystopia", short: "Dystopian" },
  { id: "retro", label: "☢️ Retro-futurist", short: "Retro" },
  { id: "merger", label: "🤝 Old-money merger", short: "Merger" },
];

const SECTOR_WORDS: Record<CorpSector, string[]> = {
  weapons: ["Defense", "Arms", "Ballistics", "Armaments", "Munitions", "Tactical"],
  biotech: ["Biotech", "Genomics", "Biomedical", "Pharma", "Lifesciences", "Bioworks"],
  cybernetics: ["Cybernetics", "Augmentics", "Implants", "Prosthetics", "Neuroware", "Bionics"],
  ai: ["Intelligence", "Data", "Systems", "Neural", "Analytics", "Compute"],
  energy: ["Energy", "Power", "Fusion", "Reactors", "Petrochem", "Grid"],
  mining: ["Mining", "Extraction", "Ore", "Orbital", "Logistics", "Salvage"],
  media: ["Media", "Broadcasting", "Entertainment", "Networks", "Studios", "Holovision"],
  consumer: ["Foods", "Consumer Goods", "Nutrition", "Brands", "Lifestyle", "Beverages"],
  finance: ["Capital", "Financial", "Banking", "Holdings", "Trust", "Securities"],
  security: ["Security", "Enforcement", "Surveillance", "Protection", "Containment", "Response"],
};

export const CORP_SECTORS: { id: CorpSector; label: string; short: string }[] = [
  { id: "weapons", label: "🔫 Weapons & defense", short: "Weapons" },
  { id: "biotech", label: "🧬 Biotech & pharma", short: "Biotech" },
  { id: "cybernetics", label: "🦾 Cybernetics", short: "Cybernetics" },
  { id: "ai", label: "🧠 AI & data", short: "AI & data" },
  { id: "energy", label: "⚡ Energy", short: "Energy" },
  { id: "mining", label: "⛏️ Mining & shipping", short: "Mining" },
  { id: "media", label: "📺 Media", short: "Media" },
  { id: "consumer", label: "🥫 Food & consumer", short: "Consumer" },
  { id: "finance", label: "💰 Banking & finance", short: "Finance" },
  { id: "security", label: "🛡️ Private security", short: "Security" },
];

/** Dark-comedy slogans, six per sector. */
export const CORP_SLOGANS: Record<CorpSector, string[]> = {
  weapons: ["Peace, guaranteed by volume.", "Precision you can feel.", "Defending tomorrow, one contract at a time.", "Every conflict deserves a winner.", "Because negotiations end.", "Proudly arming both sides of history."],
  biotech: ["Better living through patents.", "Your DNA, our responsibility.", "Healthier you, licensed to us.", "Side effects may include happiness.", "We cured it. Subscribe to stay cured.", "Life, improved. Terms apply."],
  cybernetics: ["Be more than human. Pay monthly.", "Upgrade the parts that let you down.", "Feel nothing you didn't choose.", "Your body, version 2.0.", "Firmware for the flesh.", "Warranty void if removed."],
  ai: ["We already know what you want.", "Thinking, so you don't have to.", "Your data, working harder than you.", "Always learning. Always listening.", "Decisions, optimized.", "The future has been predicted."],
  energy: ["Powering everything. Owning the rest.", "Clean energy, mostly.", "The lights stay on for our customers.", "Fueling progress since before the rules.", "Unlimited power, limited liability.", "We keep the world turning. For a fee."],
  mining: ["If it's out there, it's ours.", "Moving mountains. Then moons.", "Every rock has a price.", "From the deep, for the bottom line.", "Deliveries to anywhere. Questions to no one.", "Extracting value from the universe."],
  media: ["Everything you need to believe.", "Entertainment that never stops.", "Stay tuned. Stay calm.", "The truth, as licensed.", "We tell the story. You live in it.", "Your feed, perfected."],
  consumer: ["Taste the efficiency.", "Now with 40% more product.", "Nutrition you don't have to think about.", "Feeding billions, quietly.", "Food-like, and proud of it.", "Brand loyalty is a form of love."],
  finance: ["Your future is our asset.", "Too big to fail, by design.", "We grow your money. And ours.", "Trust is a renewable resource.", "Owning tomorrow, today.", "Every debt has a happy ending."],
  security: ["Safety is a subscription.", "We're always watching out for you.", "Order, delivered.", "Protecting what matters to our shareholders.", "Response time: before you call.", "Peace of mind, enforced."],
};

const SUFFIXES = ["Corporation", "Industries", "Holdings", "Group", "Conglomerate", "Consolidated", "International", "Unlimited"];
const BLENDS = ["corp", "tek", "tronics", "dyne", "gen", "ex", "ium", "con"];
const PATTERNS = 4;

export const megacorpFilters: FilterGroup[] = [
  { id: "genre", label: "Setting", multi: true, options: CORP_GENRES.map((g) => ({ value: g.id, label: g.label })) },
  { id: "sector", label: "Sector", multi: true, options: CORP_SECTORS.map((s) => ({ value: s.id, label: s.label })) },
];

interface CorpPart { sector: CorpSector; word: string; pattern: number; suffix: number; partner: string; slogan: number }

const allSectors = CORP_SECTORS.map((s) => s.id);
const chosenSectors = (filters: FilterState): CorpSector[] => {
  const picked = (filters.sector ?? []).filter((s): s is CorpSector => allSectors.includes(s as CorpSector));
  return picked.length ? picked : allSectors;
};
const mergerRoots = CORP_ROOTS.filter((r) => r.genre === "merger").map((r) => r.word);

const blendable = (word: string) => /^[A-Za-z]+$/.test(word);

/** Name for a root + sector part. Mergers always hyphenate two surnames. */
export function composeCorpName(root: Root, p: CorpPart): string {
  if (root.genre === "merger") return `${root.word}-${p.partner} ${p.word}`;
  switch (p.pattern) {
    case 1: return blendable(root.word) ? `${root.word}${BLENDS[p.suffix % BLENDS.length]}` : `${root.word} ${SUFFIXES[p.suffix]}`;
    case 2: return `${root.word} ${p.word} ${SUFFIXES[p.suffix]}`;
    case 3: return `${root.word} ${SUFFIXES[p.suffix]}`;
    default: return `${root.word} ${p.word}`;
  }
}

/** Exchange-style ticker: initials for 3+ words, otherwise letters from the first word(s). */
export function corpTicker(name: string): string {
  const words = name.replace(/[^A-Za-z\s-]/g, "").split(/[\s-]+/).filter(Boolean);
  let t: string;
  if (words.length >= 3) t = words.slice(0, 4).map((w) => w[0]).join("");
  else if (words.length === 2) t = words[0].slice(0, 2) + words[1][0];
  else t = words[0].slice(0, 4);
  return t.toUpperCase();
}

export const megacorpGenerator = comboGenerator<Root, CorpPart>({
  items: CORP_ROOTS,
  baseKey: (r) => r.word,
  facets: { genre: (r) => [r.genre] },
  extra: (r, rng, filters) => {
    const sector = pick(chosenSectors(filters), rng);
    const partners = mergerRoots.filter((w) => w !== r.word);
    return {
      sector,
      word: pick(SECTOR_WORDS[sector], rng),
      pattern: Math.floor(rng() * PATTERNS),
      suffix: Math.floor(rng() * SUFFIXES.length),
      partner: r.genre === "merger" ? pick(partners, rng) : "-",
      slogan: Math.floor(rng() * CORP_SLOGANS[sector].length),
    };
  },
  extraKey: (p) => `${p.sector}~${p.word}~${p.pattern}~${p.suffix}~${p.partner}~${p.slogan}`,
  extraFromKey: (r, key) => {
    const [sector, word, pattern, suffix, partner, slogan] = key.split("~");
    const words = SECTOR_WORDS[sector as CorpSector];
    const n = Number(pattern), s = Number(suffix), sl = Number(slogan);
    if (!words || !words.includes(word)) return null;
    if (!Number.isInteger(n) || n < 0 || n >= PATTERNS) return null;
    if (!Number.isInteger(s) || s < 0 || s >= SUFFIXES.length) return null;
    if (!Number.isInteger(sl) || sl < 0 || sl >= CORP_SLOGANS[sector as CorpSector].length) return null;
    if (r.genre === "merger" ? !mergerRoots.includes(partner) || partner === r.word : partner !== "-") return null;
    return { sector: sector as CorpSector, word, pattern: n, suffix: s, partner, slogan: sl };
  },
  toResult: (r, p) => {
    const name = composeCorpName(r, p);
    return {
      title: name,
      subtitle: `${corpTicker(name)} · ${CORP_SECTORS.find((s) => s.id === p.sector)?.short} · ${CORP_GENRES.find((g) => g.id === r.genre)?.short}`,
      detail: `“${CORP_SLOGANS[p.sector][p.slogan]}”`,
    };
  },
  variety: (filters) => chosenSectors(filters).length * 6 * PATTERNS * SUFFIXES.length,
});
