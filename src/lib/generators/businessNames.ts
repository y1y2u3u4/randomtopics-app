import { comboGenerator, pick } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

// A business name = a style word (the feel) + an industry word (what you do),
// joined in one of four common naming patterns. The industry and pattern are
// stored in the result key, so shared links show exactly the same name.
export type NameStyle = "modern" | "classic" | "playful" | "luxury" | "nature";
export type Industry = "food" | "tech" | "fitness" | "beauty" | "home" | "creative" | "fashion" | "consulting" | "pets" | "crafts";
interface Root { word: string; style: NameStyle }

const roots = (style: NameStyle, list: string): Root[] => list.split(", ").map((word) => ({ word, style }));

export const NAME_ROOTS: Root[] = [
  ...roots("modern", "Nova, Pixel, Vector, Kinetic, Apex, Orbit, Pulse, Atlas, Prism, Nimbus, Vertex, Echo, Shift, Lumen, Zenith, Flux, Bolt, Arc, Signal, Axis"),
  ...roots("classic", "Sterling, Heritage, Hartwell, Oakley, Kingsley, Ashford, Whitmore, Carver, Bennett, Langley, Fairfax, Thornton, Waverly, Hampton, Beacon, Crown, Union, Anchor, Mercer, Bristol"),
  ...roots("playful", "Bumble, Wiggle, Doodle, Pickle, Noodle, Biscuit, Jelly, Sprout, Pebble, Puddle, Giggle, Muffin, Zippy, Twinkle, Bubbles, Peppy, Sunny, Cheeky, Waffle, Popcorn"),
  ...roots("luxury", "Velvet, Aurum, Maison, Opal, Ivory, Sable, Rosé, Onyx, Gilded, Regent, Elysian, Laurel, Silk, Pearl, Marquis, Aurelia, Belle, Monarch, Solstice, Royale"),
  ...roots("nature", "Maple, Juniper, Willow, Cedar, Fern, Birch, Meadow, Harbor, Summit, Clover, River, Stone, Sage, Moss, Wren, Aspen, Tide, Ember, Pine, Fox"),
];

const INDUSTRY_WORDS: Record<Industry, string[]> = {
  food: ["Bakery", "Kitchen", "Crumb", "Table", "Oven", "Spoon", "Pantry", "Grill", "Bean", "Bites", "Loaf", "Ladle"],
  tech: ["Labs", "Logic", "Stack", "Byte", "Works", "Cloud", "Code", "Systems", "Grid", "Link", "Node", "Forge"],
  fitness: ["Fitness", "Strength", "Move", "Athletics", "Training", "Motion", "Barbell", "Stride", "Flow", "Core", "Club", "Endurance"],
  beauty: ["Beauty", "Glow", "Studio", "Salon", "Skin", "Lash", "Bloom", "Polish", "Brow Bar", "Spa", "Aura", "Luxe"],
  home: ["Cleaning", "Home Services", "Handyman", "Plumbing", "Repairs", "Movers", "Painting", "Maids", "Builders", "Roofing", "Restoration", "Fix"],
  creative: ["Creative", "Studio", "Media", "Design", "Pictures", "Films", "Collective", "Press", "Lens", "Frame", "Ink", "Story"],
  fashion: ["Apparel", "Threads", "Boutique", "Wear", "Supply", "Atelier", "Closet", "Stitch", "Goods", "Collection", "Denim", "Label"],
  consulting: ["Consulting", "Partners", "Advisory", "Group", "Capital", "Strategies", "Solutions", "Associates", "Ventures", "Insight", "Growth", "Counsel"],
  pets: ["Paws", "Pet Care", "Tails", "Grooming", "Pet Co.", "Whiskers", "Pups", "Kennel", "Treats", "Barks", "Pet Supply", "Fetch"],
  crafts: ["Handmade", "Crafts", "Workshop", "Makers", "Candle Co.", "Pottery", "Paper Co.", "Woodworks", "Knits", "Prints", "Studio", "Thread"],
};

export const INDUSTRIES: { id: Industry; label: string; short: string }[] = [
  { id: "food", label: "🥐 Food & café", short: "Food & café" },
  { id: "tech", label: "💻 Tech & apps", short: "Tech" },
  { id: "fitness", label: "🏋️ Fitness", short: "Fitness" },
  { id: "beauty", label: "💅 Beauty & salon", short: "Beauty" },
  { id: "home", label: "🧹 Cleaning & home services", short: "Home services" },
  { id: "creative", label: "📸 Photography & creative", short: "Creative" },
  { id: "fashion", label: "👗 Clothing & fashion", short: "Fashion" },
  { id: "consulting", label: "📊 Consulting & finance", short: "Consulting" },
  { id: "pets", label: "🐾 Pets", short: "Pets" },
  { id: "crafts", label: "🧶 Handmade & Etsy shop", short: "Handmade" },
];

export const NAME_STYLES: { id: NameStyle; label: string; short: string }[] = [
  { id: "modern", label: "Modern", short: "Modern" },
  { id: "classic", label: "Classic", short: "Classic" },
  { id: "playful", label: "Playful", short: "Playful" },
  { id: "luxury", label: "Luxury", short: "Luxury" },
  { id: "nature", label: "Nature", short: "Nature" },
];

export const businessNameFilters: FilterGroup[] = [
  { id: "industry", label: "Industry", multi: true, options: INDUSTRIES.map((i) => ({ value: i.id, label: i.label })) },
  { id: "style", label: "Style", multi: true, options: NAME_STYLES.map((s) => ({ value: s.id, label: s.label })) },
];

interface NamePart { industry: Industry; word: string; pattern: number }
const PATTERNS = 4;

function compose(root: string, part: NamePart): string {
  const w = part.word;
  switch (part.pattern) {
    case 1: return w.includes(" ") ? `${root} ${w}` : `${root}${w.toLowerCase()}`;
    case 2: return `${root} & ${w}`;
    case 3: return `The ${root} ${w}`;
    default: return `${root} ${w}`;
  }
}

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^the /, "").replace(/[^a-z0-9]/g, "");
const allIndustries = INDUSTRIES.map((i) => i.id);
const chosenIndustries = (filters: FilterState): Industry[] => {
  const picked = (filters.industry ?? []).filter((i): i is Industry => allIndustries.includes(i as Industry));
  return picked.length ? picked : allIndustries;
};

export const businessNameGenerator = comboGenerator<Root, NamePart>({
  items: NAME_ROOTS,
  baseKey: (r) => r.word,
  facets: { style: (r) => [r.style] },
  extra: (_r, rng, filters) => {
    const industry = pick(chosenIndustries(filters), rng);
    return { industry, word: pick(INDUSTRY_WORDS[industry], rng), pattern: Math.floor(rng() * PATTERNS) };
  },
  extraKey: (p) => `${p.industry}~${p.word}~${p.pattern}`,
  extraFromKey: (_r, key) => {
    const [industry, word, pattern] = key.split("~");
    const list = INDUSTRY_WORDS[industry as Industry];
    const n = Number(pattern);
    if (!list || !list.includes(word) || !Number.isInteger(n) || n < 0 || n >= PATTERNS) return null;
    return { industry: industry as Industry, word, pattern: n };
  },
  toResult: (r, p) => {
    const name = compose(r.word, p);
    return {
      title: name,
      subtitle: `${INDUSTRIES.find((i) => i.id === p.industry)?.short} · ${NAME_STYLES.find((s) => s.id === r.style)?.short}`,
      detail: `Domain idea: ${slug(name)}.com — check the domain and your local business register before you use it.`,
    };
  },
  variety: (filters) => chosenIndustries(filters).length * 12 * PATTERNS,
});
