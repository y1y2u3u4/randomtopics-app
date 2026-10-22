import { comboGenerator, pick } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";
import type { Rng } from "@/lib/randomGenerators";

export type UsernameStyle = "gaming" | "cute" | "cool" | "aesthetic";
interface Word { word: string; style: UsernameStyle }

const words = (style: UsernameStyle, list: string): Word[] => list.split(" ").map((word) => ({ word, style }));

// Base nouns: one username is built around one of these.
export const USERNAME_NOUNS: Word[] = [
  ...words("gaming", "Sniper Raider Reaper Phantom Viper Havoc Blaze Rogue Knight Titan Ninja Specter Warlock Hunter Sentinel Ronin Striker Bandit Ghost Slayer Wraith Fury Nova Onyx Kraken Saber Vortex Rampage Outlaw Ranger Juggernaut Gunner Brawler Nomad Pyro Venom Wolf Dragon Golem Cyclone"),
  ...words("cute", "Bunny Mochi Peach Muffin Panda Kitten Cupcake Bubbles Daisy Honey Pudding Waffle Sprout Cookie Dumpling Bean Puff Sugar Clover Berry Marshmallow Pebble Teacup Duckling Biscuit Noodle Sunny Button Petal Hamster Koala Otter Penguin Cloud Jelly Taro Boba Cherry Fawn Lamb"),
  ...words("cool", "Echo Drift Static Pulse Shade Flux Cipher Zenith Apex Rift Neon Vector Ember Frost Arrow Comet Volt Raven Orbit Sable Atlas Prism Quartz Monarch Summit Riot Torque Haze Halo Glitch Signal Nimbus Delta Falcon Cobra Jet Storm Blade Lynx Wave"),
  ...words("aesthetic", "Moon Bloom Velvet Lune Aura Sage Willow Soleil Petals Mist Coast Fern Ivory Linen Lavender Dusk Dawn Meadow Saltwater Honeyed Marble Iris Olive Seashell Starlight Ocean Wildflower Ember Juniper Cove Poppy Golden Rosewater Sunday Film Postcard Daydream Cinema Atelier Archive"),
];

const ADJECTIVES: Record<UsernameStyle, string[]> = {
  gaming: "Dark Silent Toxic Savage Deadly Shadow Iron Rapid Frozen Crimson Rogue Feral Atomic Cyber Lethal Mad Ultra Turbo Hyper Grim Nuclear Wicked Elite Stealth Rabid Rusty Lone Blood Storm Night".split(" "),
  cute: "Little Fluffy Sleepy Tiny Sweet Happy Fuzzy Bouncy Cozy Sparkly Soft Comfy Baby Silly Wiggly Snuggly Peachy Lucky Rosy Minty Pastel Mini Teeny Giggly Dreamy Bubbly Cuddly Jolly Smol Starry".split(" "),
  cool: "Lunar Solar Midnight Electric Urban Velvet Chrome Infinite Silent Hidden Lost Wild Cold Static Polar Rebel Cosmic Golden Obsidian Mystic Blue Phantom Quiet Steel Lucid Night Retro Prime Bold Zero".split(" "),
  aesthetic: "Soft Golden Dreamy Sunlit Pale Faded Hazy Lazy Rosy Still Quiet Velvet Misty Slow Silver Coastal Late Honey Paper Moonlit Sunday Wild Tender Sweet Blue Cloudy Gentle Gilded Lilac Amber".split(" "),
};

export const USERNAME_STYLES: { id: UsernameStyle; label: string; short: string }[] = [
  { id: "gaming", label: "🎮 Gaming", short: "Gaming" },
  { id: "cute", label: "🧸 Cute", short: "Cute" },
  { id: "cool", label: "😎 Cool", short: "Cool" },
  { id: "aesthetic", label: "📸 Instagram / aesthetic", short: "Instagram" },
];

export const usernameFilters: FilterGroup[] = [
  { id: "style", label: "Style", multi: true, options: USERNAME_STYLES.map((s) => ({ value: s.id, label: s.label })) },
  {
    id: "length",
    label: "Length",
    options: [
      { value: "any", label: "Any length" },
      { value: "short", label: "Short (≤ 10)" },
      { value: "medium", label: "Medium (11–15)" },
      { value: "long", label: "Long (16+)" },
    ],
  },
  {
    id: "numbers",
    label: "Numbers",
    options: [
      { value: "off", label: "No numbers" },
      { value: "on", label: "Add numbers" },
    ],
  },
  {
    id: "format",
    label: "Format",
    options: [
      { value: "auto", label: "Auto" },
      { value: "camel", label: "CamelCase" },
      { value: "lower", label: "lowercase" },
      { value: "under", label: "under_score" },
      { value: "dot", label: "dot.ted" },
    ],
  },
];

type Format = "camel" | "lower" | "under" | "dot";
const FORMATS: Format[] = ["camel", "lower", "under", "dot"];
const AUTO_FORMATS: Record<UsernameStyle, Format[]> = {
  gaming: ["camel", "camel", "under"],
  cute: ["lower", "dot", "under"],
  cool: ["camel", "lower", "under"],
  aesthetic: ["dot", "lower", "under"],
};
const NUMBERS = ["7", "13", "21", "22", "33", "44", "69", "77", "88", "99", "101", "247", "360", "404", "777", "999", "2k", "x"];

interface Extra { adj: string; format: Format; num: string }

export function formatUsername(adj: string, noun: string, format: Format, num: string): string {
  const parts = [adj, noun].filter(Boolean);
  const n = num === "x" ? "" : num;
  switch (format) {
    case "lower": return parts.join("").toLowerCase() + n;
    case "under": return parts.join("_").toLowerCase() + (n ? `_${n}` : "");
    case "dot": return parts.join(".").toLowerCase() + (n ? `.${n}` : "");
    default: return parts.join("") + n;
  }
}

const LENGTHS: Record<string, [number, number]> = { any: [3, 30], short: [3, 10], medium: [11, 15], long: [16, 30] };

/** Character rules for the platforms people ask about most (checked October 2026). */
export const PLATFORM_RULES: { name: string; rule: string; ok: (u: string) => boolean }[] = [
  { name: "Instagram", rule: "up to 30 · letters, numbers, . and _", ok: (u) => u.length <= 30 && /^[a-z0-9._]+$/i.test(u) && !u.endsWith(".") && !u.includes("..") },
  { name: "TikTok", rule: "2–24 · letters, numbers, . and _", ok: (u) => u.length >= 2 && u.length <= 24 && /^[a-z0-9._]+$/i.test(u) && !u.endsWith(".") },
  { name: "Roblox", rule: "3–20 · letters, numbers, one _", ok: (u) => u.length >= 3 && u.length <= 20 && /^[a-z0-9_]+$/i.test(u) && (u.match(/_/g) ?? []).length <= 1 && !/^_|_$/.test(u) },
  { name: "Twitch", rule: "4–25 · letters, numbers, _", ok: (u) => u.length >= 4 && u.length <= 25 && /^[a-z0-9_]+$/i.test(u) && !u.startsWith("_") },
  { name: "Xbox", rule: "up to 12 · letters, numbers", ok: (u) => u.length <= 12 && /^[a-z0-9]+$/i.test(u) },
  { name: "Discord", rule: "2–32 · lowercase, numbers, . and _", ok: (u) => u.length >= 2 && u.length <= 32 && /^[a-z0-9._]+$/i.test(u) && !u.includes("..") },
];

export function platformFit(u: string) {
  return PLATFORM_RULES.filter((p) => p.ok(u)).map((p) => p.name);
}

/** Length bands a word can land in with no numbers, for both joined and separated formats. */
function lengthBands(w: Word): string[] {
  const joined = ["", ...ADJECTIVES[w.style]].map((a) => a.length + w.word.length);
  const bands = ["any"];
  if (w.word.length <= 10) bands.push("short");
  if (joined.some((n, i) => i > 0 && n >= 11 && n <= 14)) bands.push("medium");
  if (joined.some((n, i) => i > 0 && n >= 16 && n <= 29)) bands.push("long");
  return bands;
}

function chooseExtra(w: Word, rng: Rng, filters: FilterState): Extra {
  const want = filters.format?.[0] ?? "auto";
  const withNum = (filters.numbers?.[0] ?? "off") === "on";
  const [min, max] = LENGTHS[filters.length?.[0] ?? "any"] ?? LENGTHS.any;
  const format: Format = want === "auto" ? pick(AUTO_FORMATS[w.style], rng) : (want as Format);
  const adjs = ["", ...ADJECTIVES[w.style]];
  const fits = (nums: string[]) =>
    adjs.flatMap((adj) => nums.map((num) => ({ adj, format, num }))).filter((e) => {
      const len = formatUsername(e.adj, w.word, format, e.num).length;
      return len >= min && len <= max;
    });
  // Prefer an adjective; drop the number only when it would break the length band.
  const candidates = withNum ? fits(NUMBERS.slice(0, -1)) : fits([""]);
  const pool = candidates.length ? candidates : fits([""]);
  const withAdj = pool.filter((e) => e.adj);
  const list = withAdj.length && rng() < 0.85 ? withAdj : pool;
  return list.length ? pick(list, rng) : { adj: pick(ADJECTIVES[w.style], rng), format, num: "" };
}

export const usernameGenerator = comboGenerator<Word, Extra>({
  items: USERNAME_NOUNS,
  baseKey: (w) => `${w.style}-${w.word}`,
  facets: { style: (w) => [w.style], length: lengthBands },
  extra: chooseExtra,
  extraKey: (e) => [e.adj, e.format, e.num].join("|"),
  extraFromKey: (w, key) => {
    const [adj = "", format = "", num = ""] = key.split("|");
    if (adj && !ADJECTIVES[w.style].includes(adj)) return null;
    if (!FORMATS.includes(format as Format)) return null;
    if (num && !NUMBERS.includes(num)) return null;
    return { adj, format: format as Format, num };
  },
  toResult: (w, e) => {
    const name = formatUsername(e.adj, w.word, e.format, e.num);
    const fits = platformFit(name);
    return {
      title: name,
      subtitle: `${USERNAME_STYLES.find((s) => s.id === w.style)?.label} · ${name.length} characters`,
      detail: fits.length ? `Fits the rules on: ${fits.join(", ")}` : "Too long for most platforms — try Short",
    };
  },
  // Adjective choices (plus none) × number choices; length bands narrow this, so keep it conservative.
  variety: (filters) => Math.floor((ADJECTIVES.gaming.length + 1) / 2) * ((filters.numbers?.[0] ?? "off") === "on" ? NUMBERS.length - 1 : 1),
});
