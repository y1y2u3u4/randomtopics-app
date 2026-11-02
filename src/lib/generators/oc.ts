import { comboGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// OC (original character) names: a first name, a surname, and a small "seed"
// (a trait, a quirk, a palette and a signature item) so the result is a
// starting point for a character, not just a label. Meanings are given where
// the name has a real etymology; otherwise the feel of the name is described.
export type OcGenre = "anime" | "fantasy" | "scifi" | "modern" | "gothic" | "cute";
type Gender = "male" | "female" | "neutral";
interface First { name: string; genre: OcGenre; gender: Gender; meaning: string }
interface Last { name: string; genre: OcGenre; meaning: string }

const firsts = (genre: OcGenre, gender: Gender, list: string): First[] =>
  list.split("; ").map((e) => { const [name, meaning] = e.split(" = "); return { name, genre, gender, meaning }; });
const lasts = (genre: OcGenre, list: string): Last[] =>
  list.split("; ").map((e) => { const [name, meaning] = e.split(" = "); return { name, genre, meaning }; });

export const OC_FIRST: First[] = [
  ...firsts("anime", "female", "Haruka = Japanese: distant, far-off; Sakura = Japanese: cherry blossom; Hikari = Japanese: light; Aoi = Japanese: blue-green, or hollyhock; Kaede = Japanese: maple tree; Hotaru = Japanese: firefly; Nagisa = Japanese: shoreline; Tsubaki = Japanese: camellia; Akari = Japanese: light, glow; Mizuki = Japanese: beautiful moon; Kohaku = Japanese: amber; Ayame = Japanese: iris flower"),
  ...firsts("anime", "male", "Akira = Japanese: bright, clear; Ren = Japanese: lotus; Kaito = Japanese: ocean; Riku = Japanese: land; Haruto = Japanese: sun, soar; Raiden = Japanese: thunder and lightning; Tsubasa = Japanese: wings; Hayato = Japanese: falcon person; Daichi = Japanese: great earth; Kazuki = Japanese: harmony, hope"),
  ...firsts("anime", "neutral", "Sora = Japanese: sky; Yuki = Japanese: snow, or happiness; Haru = Japanese: spring, sunlight; Hibiki = Japanese: echo; Minato = Japanese: harbor; Shiori = Japanese: bookmark, a small guide"),
  ...firsts("fantasy", "female", "Elowen = Cornish: elm tree; Isolde = Celtic legend: possibly fair lady; Seren = Welsh: star; Briar = English: thorny wild rose; Lirael = invented: sounds like a silver bell; Morwenna = Cornish: maiden; Thessaly = Greek: the region of Thessaly; Eira = Welsh: snow; Sylvara = invented: evokes deep forest shade; Arwen = Welsh: fair maiden"),
  ...firsts("fantasy", "male", "Alaric = Germanic: ruler of all; Theron = Greek: hunter; Caelum = Latin: sky; Aldric = Germanic: old wise ruler; Rowan = Irish: little red one; Corwin = Old English: friend of the heart; Eldrin = invented: sounds like an old elf-lord; Gareth = Welsh: gentle; Wystan = Old English: battle stone; Lucan = Latin: bringer of light"),
  ...firsts("fantasy", "neutral", "Ash = English: the ash tree; Wren = English: small songbird; Sage = Latin: wise one; Rune = Norse: secret, mystery; Fable = English: a tale with a meaning; Ember = English: glowing coal"),
  ...firsts("scifi", "female", "Nova = Latin: new; Vega = Arabic: swooping eagle, a bright star; Juno = Roman: queen of the gods; Lyra = Greek: lyre, a constellation; Cassiopeia = Greek: the queen in the stars; Andromeda = Greek: ruler of men, a galaxy; Zenith = English: the highest point; Meridian = Latin: midday"),
  ...firsts("scifi", "male", "Orion = Greek: the hunter, a constellation; Atlas = Greek: enduring; Cassian = Latin: hollow, empty; Cyrus = Persian: sun; Talon = English: claw of a bird of prey; Kaelen = invented: sounds like a ship's pilot; Zephyr = Greek: west wind; Apollo = Greek: god of light"),
  ...firsts("scifi", "neutral", "Rho = Greek: the letter rho, used for density; Ion = Greek: going, a charged particle; Echo = Greek: a reflected sound; Cipher = Arabic: zero, a code; Vector = Latin: carrier; Quill = English: a writing feather; Sol = Latin: sun"),
  ...firsts("modern", "female", "Maya = Sanskrit: illusion, or Hebrew: water; Chloe = Greek: green shoot; Iris = Greek: rainbow; June = Latin: the month, from Juno; Naomi = Hebrew: pleasantness; Sasha = Russian: defender of mankind; Mina = Arabic: harbor; Imogen = possibly Celtic: maiden; Tessa = Greek: harvester; Leona = Latin: lioness"),
  ...firsts("modern", "male", "Noah = Hebrew: rest; Felix = Latin: lucky; Leo = Latin: lion; Ezra = Hebrew: help; Theo = Greek: gift of God; Miles = Latin: soldier; Silas = Latin: of the forest; Jonah = Hebrew: dove; Desmond = Irish: from south Munster; Gideon = Hebrew: mighty warrior"),
  ...firsts("modern", "neutral", "Jules = Latin: youthful; Remy = French: oarsman; Rory = Irish: red king; Sam = Hebrew: God has heard; Kit = English: short for Christopher or Katherine; River = English: a flowing stream; Alex = Greek: defender; Frankie = Latin: free one"),
  ...firsts("gothic", "female", "Vesper = Latin: evening star; Ravenna = Italian: city of the Adriatic, with a raven's sound; Ophelia = Greek: help; Selene = Greek: moon; Nyx = Greek: night; Sable = French: black fur; Morrigan = Irish: great queen, a war goddess; Belladonna = Italian: beautiful lady, also a poison plant; Lenore = English: shining one"),
  ...firsts("gothic", "male", "Silas = Latin: of the forest; Lucian = Latin: light; Corvin = Latin: raven-like; Damien = Greek: to tame; Edgar = Old English: wealthy spear; Cain = Hebrew: spear, acquired; Crispin = Latin: curly-haired; Dorian = Greek: from Doris; Thorne = English: thorn bush; Vladislav = Slavic: rule with glory"),
  ...firsts("gothic", "neutral", "Raven = English: the black bird; Rue = English: sorrow, also a bitter herb; Ash = English: ash tree, what remains after fire; Midnight = English: the dead of night; Hollow = English: empty inside; Wraith = Scots: a spirit seen before death"),
  ...firsts("cute", "female", "Poppy = Latin: red flower; Daisy = English: day's eye; Clover = English: lucky meadow plant; Honey = English: sweet; Penny = Greek: weaver, pet form of Penelope; Mochi = Japanese: soft rice cake; Peach = English: the soft fruit; Pearl = Latin: the sea gem; Coco = Spanish: coconut, or pet name; Olive = Latin: olive tree"),
  ...firsts("cute", "male", "Pip = English: small seed, pet form of Philip; Biscuit = French: twice baked; Bean = English: a small seed; Toby = Hebrew: God is good; Ollie = Latin: olive tree; Cheddar = English: cheese from Somerset; Sprout = English: young shoot; Waffles = Dutch: honeycomb cake; Bobby = Germanic: bright fame; Pudding = English: warm dessert"),
  ...firsts("cute", "neutral", "Sunny = English: bright and cheerful; Pebble = English: smooth small stone; Button = English: round fastener; Mimi = French: pet form of Marie; Noodle = German: thread of dough; Bubbles = English: soap bubbles; Teddy = Greek: gift of God; Pickle = Dutch: pickled cucumber; Muffin = English: small baked cake; Dot = English: small round mark"),
];

export const OC_LAST: Last[] = [
  ...lasts("anime", "Hoshikawa = Japanese: star river; Kitamura = Japanese: north village; Shirogane = Japanese: silver; Kurosawa = Japanese: black marsh; Amagi = Japanese: heavenly castle, also a mountain; Tsukishiro = Japanese: moon castle; Aizawa = Japanese: indigo marsh; Fujimoto = Japanese: wisteria origin; Takanashi = Japanese: no hawks (a legendary place name); Mizushima = Japanese: water island; Sakurai = Japanese: cherry-tree well; Kirishima = Japanese: mist island"),
  ...lasts("fantasy", "Ashvale = English-style: ash-tree valley; Stormwhisper = invented: a quiet voice in the gale; Thornwood = English: thorny forest; Brightmantle = invented: a cloak of light; Duskmoor = English-style: twilight heath; Silverbrook = English: bright stream; Oakenshield = English-style: shield of oak; Winterbourne = English: stream that runs dry in summer; Greymarch = English-style: grey border land; Starfall = invented: where a star landed; Emberlyn = invented: ember pool; Hollowfen = English-style: empty marsh"),
  ...lasts("scifi", "Voss = German: fox; Kestrel = English: small falcon; Okonkwo = Igbo: born on the Orie market day; Halloran = Irish: descendant of the stranger; Vance = English: from the fen; Reyes = Spanish: kings; Lindqvist = Swedish: linden twig; Tanaka = Japanese: in the rice paddy; Navarro = Basque: the plain; Drake = English: dragon; Mercer = English: merchant; Castellan = Latin: keeper of a castle"),
  ...lasts("modern", "Hart = English: stag; Bennett = Latin: blessed; Okafor = Igbo: born on the Afor market day; Delgado = Spanish: slim; Marlow = English: remnants of a lake; Ishikawa = Japanese: stone river; Brennan = Irish: sorrow, or raven; Castellano = Spanish: from Castile; Whitaker = English: white field; Nakamura = Japanese: middle village; Ferreira = Portuguese: blacksmith; Abara = Igbo: place-name surname"),
  ...lasts("gothic", "Blackwood = English: dark forest; Nightshade = English: poisonous plant; Ravenscroft = English: raven's small farm; Hollowell = English-style: sacred empty well; Crowhurst = English: crow wooded hill; Ashgrave = English-style: ash and grave; Thornfield = English: thorny field; Morrow = Irish: sea-battle; Mourne = English: to grieve; Wolfsbane = English: poisonous mountain flower; Graves = English: grove, or tomb; Dreadmoor = English-style: fearful heath"),
  ...lasts("cute", "Puddlewick = invented: a candle in a puddle; Cottonbell = invented: soft and ringing; Honeydew = English: sweet melon; Sprinklefield = invented: a field of sugar sprinkles; Thistledown = English: thistle fluff; Marshmallow = English: soft sweet; Peppercorn = English: small spice; Buttercup = English: yellow wildflower; Jellybean = English: sweet; Moonpie = invented: moon-shaped treat; Fluffernutter = invented: cheerful nonsense; Tumbleweed = English: rolling dry plant"),
];

const list = (s: string) => s.split("; ");

// Personality (trait) and quirk lists are not tied to a genre, so any trait can
// meet any genre. Contrast between the two is where the character comes from.
export const OC_TRAITS = list("fiercely loyal; endlessly curious; stubborn to the bone; secretly soft-hearted; sarcastic when nervous; relentlessly optimistic; calm in a crisis; a born peacemaker; competitive about everything; quietly observant; dramatic on purpose; slow to trust; reckless but lucky; painfully honest; a chronic overthinker; warm with strangers, guarded with friends; proud and easily embarrassed; gentle but impossible to push around; mischievous; a perfectionist who hides it");
export const OC_QUIRKS = list("hums when concentrating; never finishes a cup of tea; names every object they own; collects broken watches; talks to animals as if they were people; can't lie while eating; always carries a spare ribbon; draws on their hand when bored; refuses to step on cracks; keeps a list of people who owe them favors; laughs at the wrong moment; sleeps with one shoe on; cooks only when sad; counts steps on stairs; reads the last page of every book first; whistles badly on purpose; hoards small stones; wears a scarf in all weather; apologizes to doors they bump into; keeps a diary in a made-up alphabet");

const PALETTES: Record<OcGenre, string[]> = {
  anime: list("sakura pink, cream, navy; midnight blue, silver, a flash of red; mint green, white, gold; crimson, black, ash grey; sky blue, lilac, white; amber, forest green, cream"),
  fantasy: list("deep forest green, moss, gold; royal purple, silver, ivory; ember orange, charcoal, bronze; ice blue, white, pale gold; wine red, parchment, brown; sea teal, pearl, driftwood"),
  scifi: list("neon cyan, graphite, white; signal orange, steel grey, black; violet, chrome, deep space blue; lime accent, matte black, silver; amber display glow, navy, grey; hull white, red stripe, brushed metal"),
  modern: list("denim blue, mustard, off-white; olive, rust, cream; charcoal, coral, white; teal, tan, black; burgundy, grey, gold; sage, sand, navy"),
  gothic: list("black, deep plum, bone; blood red, charcoal, antique silver; midnight blue, ivory, tarnished gold; forest black, moss, white; ash grey, dried-rose pink, ink; violet, black lace, pale grey"),
  cute: list("peach, butter yellow, mint; baby blue, strawberry pink, white; lavender, cream, honey; coral, sky blue, cream; matcha green, pink, white; lemon, powder blue, pale pink"),
};

const ITEMS: Record<OcGenre, string[]> = {
  anime: list("a worn school bag with a lucky charm; a paper umbrella that never gets wet; a scarf that never leaves their neck; a hairpin shaped like a crescent moon; a wooden practice sword wrapped in tape; a pocket watch that runs slow; fingerless gloves; a notebook full of sketches"),
  fantasy: list("a cracked silver compass; a cloak pinned with a bone clasp; a map with half the names scratched out; a ring that is too big for any finger; a hunting horn that makes no sound; a satchel of dried herbs; a staff carved from lightning-struck wood; a wooden bird that sometimes moves"),
  scifi: list("a cracked data-slate; a jacket patched with old ship insignia; a pilot's glove with one finger missing; a pocket-sized drone that follows them; a coin from a planet that no longer exists; a visor with a hairline crack; a wrench that doubles as a weapon; a necklace made of a circuit chip"),
  modern: list("a scratched phone with a cracked screen; a thrifted jacket with too many pockets; a bike bell that doesn't ring; headphones around their neck; a keychain collection from every city visited; a notebook with coffee rings; a camera on a worn strap; sneakers with hand-drawn doodles"),
  gothic: list("a locket that does not open; a candle that only they can light; a black ribbon at the wrist; a key to a door nobody remembers; a pocket mirror with a chip; a raven feather pen; a ring engraved with a date; a velvet glove, only one"),
  cute: list("a tiny backpack shaped like an animal; a mug with a chipped handle; a hair clip with a strawberry; a sticker-covered water bottle; a wobbly umbrella with ears; a pocket full of snacks; knitted mittens on a string; a keychain plushie they never put down"),
};

export const OC_GENRES: { id: OcGenre; label: string; short: string }[] = [
  { id: "anime", label: "🌸 Anime", short: "Anime" },
  { id: "fantasy", label: "🐉 Fantasy", short: "Fantasy" },
  { id: "scifi", label: "🚀 Sci-fi", short: "Sci-fi" },
  { id: "modern", label: "🏙️ Modern", short: "Modern" },
  { id: "gothic", label: "🦇 Gothic / dark", short: "Gothic / dark" },
  { id: "cute", label: "🍓 Cute", short: "Cute" },
];

export const ocFilters: FilterGroup[] = [
  { id: "genre", label: "Genre / style", multi: true, options: OC_GENRES.map((g) => ({ value: g.id, label: g.label })) },
  {
    id: "gender",
    label: "Gender",
    multi: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "neutral", label: "Gender-neutral" },
    ],
  },
];

const lastByGenre = (g: OcGenre) => OC_LAST.filter((l) => l.genre === g);
interface Extra { last: number; trait: number; quirk: number; palette: number; item: number }

export const ocGenerator = comboGenerator<First, Extra>({
  items: OC_FIRST,
  baseKey: (f) => f.name,
  facets: { genre: (f) => [f.genre], gender: (f) => [f.gender] },
  extra: (f, rng) => {
    const rand = (n: number) => Math.floor(rng() * n);
    return {
      last: rand(lastByGenre(f.genre).length),
      trait: rand(OC_TRAITS.length),
      quirk: rand(OC_QUIRKS.length),
      palette: rand(PALETTES[f.genre].length),
      item: rand(ITEMS[f.genre].length),
    };
  },
  extraKey: (e) => [e.last, e.trait, e.quirk, e.palette, e.item].join("."),
  extraFromKey: (f, key) => {
    const p = key.split(".").map(Number);
    if (p.length !== 5 || p.some((n) => !Number.isInteger(n) || n < 0)) return null;
    const [last, trait, quirk, palette, item] = p;
    if (last >= lastByGenre(f.genre).length || trait >= OC_TRAITS.length || quirk >= OC_QUIRKS.length) return null;
    if (palette >= PALETTES[f.genre].length || item >= ITEMS[f.genre].length) return null;
    return { last, trait, quirk, palette, item };
  },
  toResult: (f, e) => {
    const last = lastByGenre(f.genre)[e.last];
    return {
      title: `${f.name} ${last.name}`,
      subtitle: `${OC_GENRES.find((g) => g.id === f.genre)?.label} · ${f.gender} · ${OC_TRAITS[e.trait]}`,
      detail: [
        `${f.name}: ${f.meaning}`,
        `${last.name}: ${last.meaning}`,
        `Quirk: ${OC_QUIRKS[e.quirk]}`,
        `Palette: ${PALETTES[f.genre][e.palette]}`,
        `Signature item: ${ITEMS[f.genre][e.item]}`,
      ].join(" · "),
    };
  },
  variety: () => 12,
});
