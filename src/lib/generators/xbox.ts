import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Gamertags are checked against Xbox's own limits: a modern gamertag's base
// name is up to 12 characters (Xbox adds a #suffix if it is taken), and a
// classic gamertag allows only letters, numbers and spaces, up to 15. Keeping
// every result at 12 or fewer ASCII letters, digits and spaces fits both.
export const XBOX_MAX = 12;
export type XboxVibe = "sweaty" | "funny" | "og" | "chill";
interface Tag { a: string; b: string; vibe: XboxVibe }

const words = (s: string) => s.split(" ");
const LISTS: Record<XboxVibe, [string[], string[]]> = {
  sweaty: [words("Zero Apex Void Frag Hex Nyx Volt Rogue Cold Silent Rapid Lethal Prime Ghost Feral Toxic Clutch Scope Static Venom"), words("Reaper Shot Viper Wraith Spectre Hunter Strike Fang Sniper Blade Recon Havoc Shade Pulse Raven Cipher Talon Edge Rush Ace")],
  funny: [words("Soggy Lagging Sir Captain Crispy Tiny Grumpy Sneaky Spicy Wobbly Lord Salty Sleepy Chunky Angry Lowkey Confused Toasty Itchy Mild"), words("Noodle Waffle Potato Goose Nugget Pickle Toaster Sock Burrito Muffin Tater Biscuit Llama Pancake Gnome Turnip Crouton Walrus Taco Bagel")],
  og: [words("Dark Shadow Fatal Mystic Silver Blaze Storm Iron Night Ice Steel Crimson Neon Dread Red Black Grim Lone Wild Royal"), words("Wolf Knight Dragon Phoenix Rider Legend Titan King Warrior Ninja Samurai Falcon Hawk Tiger Saint Outlaw Bandit Ranger Viking Sage")],
  chill: [words("Lazy Cozy Mellow Sunny Quiet Lofi Velvet Misty Calm Pastel Rainy Drowsy Easy Soft Autumn Moon Cloudy Sleepy Lucky Warm"), words("Otter Panda Fox Koala Cloud Cocoa Ripple Breeze Fern Pebble Lantern Owl Tide Maple Comet Daisy Sloth Bloom Kettle Echo")],
};

export const XBOX_TAGS: Tag[] = (Object.keys(LISTS) as XboxVibe[]).flatMap((vibe) =>
  LISTS[vibe][0].flatMap((a) => LISTS[vibe][1].map((b) => ({ a, b, vibe }))),
).filter((t) => t.a.length + t.b.length <= XBOX_MAX - 1);

export const XBOX_VIBES: { id: XboxVibe; label: string; short: string }[] = [
  { id: "sweaty", label: "🎯 Sweaty / competitive", short: "Sweaty" },
  { id: "funny", label: "😂 Funny", short: "Funny" },
  { id: "og", label: "🐺 Classic OG", short: "Classic OG" },
  { id: "chill", label: "☁️ Chill / aesthetic", short: "Chill" },
];

export const xboxFilters: FilterGroup[] = [
  { id: "vibe", label: "Vibe", multi: true, options: XBOX_VIBES.map((v) => ({ value: v.id, label: v.label })) },
  {
    id: "length",
    label: "Length",
    options: [
      { value: "any", label: "Up to 12" },
      { value: "short", label: "Short (8 or less)" },
    ],
  },
  {
    id: "format",
    label: "Format",
    options: [
      { value: "mix", label: "Mixed" },
      { value: "joined", label: "JoinedWords" },
      { value: "space", label: "With a space" },
      { value: "number", label: "Add numbers" },
    ],
  },
];

const FORMATS = ["joined", "space", "number"] as const;
type Format = (typeof FORMATS)[number];
interface Extra { format: Format; num: string }

const lengthOf = (t: Tag) => t.a.length + t.b.length;
const render = (t: Tag, { format, num }: Extra) =>
  format === "space" ? `${t.a} ${t.b}` : format === "number" ? `${t.a}${t.b}${num}` : `${t.a}${t.b}`;

export const xboxGenerator = comboGenerator<Tag, Extra>({
  items: XBOX_TAGS,
  baseKey: (t) => `${t.a}${t.b}`,
  facets: { vibe: (t) => [t.vibe], length: (t) => (lengthOf(t) <= 7 ? ["short", "any"] : ["any"]) },
  extra: (t, rng, filters) => {
    const want = filters.format?.[0] ?? "mix";
    const format: Format = want === "mix" ? pick(FORMATS, rng) : (want as Format);
    const room = (filters.length?.[0] === "short" ? 8 : XBOX_MAX) - lengthOf(t);
    const digits = Math.min(room, 3);
    if (format === "number" && digits < 2) return { format: "joined", num: "" };
    const num = format === "number" ? String(Math.floor(rng() * 10 ** digits)).padStart(digits, "0") : "";
    return { format, num };
  },
  extraKey: (e) => `${e.format}${e.num}`,
  extraFromKey: (_t, key) => {
    const format = FORMATS.find((f) => key.startsWith(f));
    const num = format ? key.slice(format.length) : "";
    return format && /^\d*$/.test(num) ? { format, num } : null;
  },
  toResult: (t, e) => {
    const tag = render(t, e);
    return {
      title: tag,
      subtitle: `🎮 ${XBOX_VIBES.find((v) => v.id === t.vibe)?.short} · ${tag.length}/12 characters`,
      detail: `Fits Xbox rules (letters, numbers${e.format === "space" ? ", one space" : ""}). If someone already has it, Xbox adds a number suffix, e.g. ${tag}#${"1234".slice(0, Math.min(4, 15 - tag.length))}.`,
    };
  },
  variety: (filters) => ((filters.format?.[0] ?? "mix") === "mix" ? 3 : 1),
});
