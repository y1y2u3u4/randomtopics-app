import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Every result is lowercase ASCII letters plus, optionally, "." and "_" — the
// only symbols Instagram, TikTok and Discord accept (Pinterest allows "_" only).
// Fit is computed per platform from the length and character rules below.
export type AestheticVibe = "soft" | "academia" | "kawaii" | "y2k" | "ocean" | "celestial" | "grunge";
interface Handle { a: string; b: string; vibe: AestheticVibe }

const w = (s: string) => s.split(" ");
const LISTS: Record<AestheticVibe, [string[], string[]]> = {
  soft: [w("soft honey clover meadow moss daisy linen dewy mellow sunlit willow velvet fern petal cozy pearly tea warm wild"), w("petals meadow fern honey bloom clover thistle lantern bramble quilt orchard hearth jam basket wren sprig bee lace ivy dew")],
  academia: [w("ink dusty gothic velvet raven candle latin oxford chapel sepia quill wax aged ashen ivory midnight tweed ebony brass"), w("library quill ink tome verse raven chapel candle sonnet scholar archive ledger marble sepia elegy lore vellum glyph parlor prose")],
  kawaii: [w("cutie bunny berry mochi peachy pinky fluffy bubble candy sugar pudding honeyed sparkle starry jelly milky kitty cloud dreamy sweet"), w("puff bun bean boba kitten cookie pudding bubble mochi cupcake peach pixie bow blush marsh sundae froggy tofu sprout")],
  y2k: [w("chrome glitter baby retro neon pixel cyber gloss flip holo icy pink disco frosty techno hyper glam lava candy"), w("glam gloss bling byte mesh pixels dial cherry jelly sparkle stars mixtape rewind dolly wifi mp3 spritz glitch zine flip")],
  ocean: [w("salty coral tidal sandy sunny pearl drift azure wavy shell blue breezy sea misty coastal kelp marine golden lagoon"), w("tide waves shell coral drift pearl breeze lagoon salt reef harbor dune foam cove surf seaglass kelp gull siren current")],
  celestial: [w("lunar stellar cosmic astral midnight starry opal solar nova silver velvet moonlit twilit eclipse dusk aurora hazy comet galaxy"), w("moon stars comet orbit nebula aurora eclipse stardust halo galaxy lunar nova dusk cosmos planet moth zenith vesper lyra astra")],
  grunge: [w("rusty faded static smoky broken ripped feral hollow ashen inkblot vinyl burnt noisy wired thrift cracked gritty mono torn"), w("static thorn vinyl riot ash denim rust fuzz flannel blur cassette smoke wire crow shred ember distort zine mosh grit")],
};

export const AESTHETIC_HANDLES: Handle[] = (Object.keys(LISTS) as AestheticVibe[]).flatMap((vibe) =>
  LISTS[vibe][0].flatMap((a) => LISTS[vibe][1].filter((b) => b !== a).map((b) => ({ a, b, vibe }))),
);

export const AESTHETIC_VIBES: { id: AestheticVibe; label: string; short: string }[] = [
  { id: "soft", label: "🌿 Soft / cottagecore", short: "Soft cottagecore" },
  { id: "academia", label: "📚 Dark academia", short: "Dark academia" },
  { id: "kawaii", label: "🍡 Kawaii / cute", short: "Kawaii" },
  { id: "y2k", label: "💿 Y2K", short: "Y2K" },
  { id: "ocean", label: "🌊 Ocean / beachy", short: "Ocean" },
  { id: "celestial", label: "🌙 Celestial / night", short: "Celestial" },
  { id: "grunge", label: "🖤 Grunge", short: "Grunge" },
];

export const aestheticFilters: FilterGroup[] = [
  { id: "vibe", label: "Vibe", multi: true, options: AESTHETIC_VIBES.map((v) => ({ value: v.id, label: v.label })) },
  {
    id: "format",
    label: "Format",
    options: [
      { value: "mix", label: "Mixed" },
      { value: "joined", label: "softmoonlit" },
      { value: "dot", label: "soft.moonlit" },
      { value: "underscore", label: "soft_moonlit" },
      { value: "suffix", label: "Cute suffix (xo, uwu)" },
    ],
  },
  {
    id: "length",
    label: "Length",
    options: [
      { value: "any", label: "Any" },
      { value: "short", label: "Short (12 or less)" },
    ],
  },
];

const FORMATS = ["joined", "dot", "underscore", "suffix"] as const;
type Format = (typeof FORMATS)[number];
const SUFFIXES = ["xo", "_xo", "_uwu", ".xo", ".uwu"];
interface Extra { format: Format; suffix: string }

const render = (h: Handle, { format, suffix }: Extra) =>
  format === "dot" ? `${h.a}.${h.b}` : format === "underscore" ? `${h.a}_${h.b}` : format === "suffix" ? `${h.a}${h.b}${suffix}` : `${h.a}${h.b}`;

export interface PlatformFit { name: string; ok: boolean; why?: string }

/** Check a handle against each platform's published username rules. */
export function platformFit(name: string): PlatformFit[] {
  const dotsOk = !name.endsWith(".") && !name.startsWith(".") && !name.includes("..");
  const set = /^[a-z0-9._]+$/.test(name);
  return [
    { name: "Instagram", ok: name.length <= 30 && set && dotsOk },
    { name: "TikTok", ok: name.length >= 2 && name.length <= 24 && set && dotsOk },
    { name: "Pinterest", ok: name.length >= 3 && name.length <= 30 && /^[a-z0-9_]+$/.test(name), why: "no periods" },
    { name: "Discord", ok: name.length >= 2 && name.length <= 32 && set && dotsOk },
  ];
}

export const aestheticGenerator = comboGenerator<Handle, Extra>({
  items: AESTHETIC_HANDLES,
  baseKey: (h) => `${h.a}-${h.b}`,
  facets: {
    vibe: (h) => [h.vibe],
    length: (h) => (h.a.length + h.b.length <= 12 ? ["short", "any"] : ["any"]),
  },
  extra: (_h, rng, filters) => {
    const want = filters.format?.[0] ?? "mix";
    const format: Format = want === "mix" ? pick(FORMATS, rng) : (want as Format);
    return { format, suffix: format === "suffix" ? pick(SUFFIXES, rng) : "" };
  },
  extraKey: (e) => `${e.format}${e.suffix ? `:${e.suffix}` : ""}`,
  extraFromKey: (_h, key) => {
    const [format, suffix = ""] = key.split(":");
    const f = FORMATS.find((x) => x === format);
    if (!f) return null;
    if (f === "suffix" ? !SUFFIXES.includes(suffix) : suffix !== "") return null;
    return { format: f, suffix };
  },
  toResult: (h, e) => {
    const name = render(h, e);
    const fit = platformFit(name);
    const ok = fit.filter((p) => p.ok).map((p) => p.name);
    const no = fit.filter((p) => !p.ok).map((p) => `${p.name}${p.why ? ` (${p.why})` : ""}`);
    return {
      title: name,
      subtitle: `✨ ${AESTHETIC_VIBES.find((v) => v.id === h.vibe)?.short} · ${name.length} characters`,
      detail: `Fits ${ok.join(", ") || "none of the four"}${no.length ? `. Not ${no.join(", ")}` : ""}. Check it is free before you commit.`,
    };
  },
  variety: (filters) => ((filters.format?.[0] ?? "mix") === "mix" ? 5 : (filters.format?.[0] === "suffix" ? 5 : 1)),
});
