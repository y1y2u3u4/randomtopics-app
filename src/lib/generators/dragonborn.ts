import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import { glossed, roots, rootNames } from "./rootNames";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Dragonborn names follow the D&D 5e custom: a personal name, a clan name
// spoken first as a mark of honor, and a childhood nickname. Sounds follow the
// ancestry: chromatic names are harsh, metallic names are stately, gem names
// are soft and ringing. All names and clans here are original.
export type Ancestry = "chromatic" | "metallic" | "gem";
type Gender = "male" | "female" | "neutral";

const PREFIX: Record<Ancestry, ReturnType<typeof roots>> = {
  chromatic: roots("Vrax:flame, Kriv:venom, Thar:storm, Mor:shadow, Ghes:frost, Zor:tyrant, Rhog:smoke, Skar:wound, Drav:acid, Ulk:dread"),
  metallic: roots("Bal:honor, Ar:sun, Med:wisdom, Pan:shield, Tor:oath, Sil:moon, Kel:river, Hes:dawn, Nad:justice, Rhal:treasure"),
  gem: roots("Ixa:mind, Sor:prism, Vel:dream, Qua:echo, Lyr:star, Esh:crystal, Ora:vision, Thel:thought, Zan:light, Myr:mirror"),
};

const SUFFIX: Record<Gender, ReturnType<typeof roots>> = {
  male: roots("jhan:fire, asar:king, ash:claw, inn:wing, ar:scale, ez:tooth, um:roar, kas:spine"),
  female: roots("ra:heart, iri:song, aar:sky, hesh:flight, ana:pearl, ala:grace, ith:spark"),
  neutral: roots("ix:horn, ok:stone, eth:breath, un:eye"),
};

export const DRAGONBORN_NAMES = rootNames(PREFIX, SUFFIX);

export const DRAGONBORN_COLORS: Record<Ancestry, string[]> = {
  chromatic: ["Red · fire", "Blue · lightning", "Green · poison", "Black · acid", "White · cold"],
  metallic: ["Gold · fire", "Silver · cold", "Bronze · lightning", "Brass · fire", "Copper · acid"],
  gem: ["Amethyst · force", "Crystal · radiant", "Emerald · psychic", "Sapphire · thunder", "Topaz · necrotic"],
};

const clans = (ancestry: Ancestry, list: string) => glossed(list).map((c) => ({ ...c, ancestry }));

export const DRAGONBORN_CLANS = [
  ...clans("chromatic", "Kharrevon = swore to win back the volcano it lost; Vyrkantar = takes its oaths over an open flame; Dazzirath = paints its scales with soot before a hunt; Ghaarvesh = rules a city of black basalt; Morrikanth = counts its honor in enemies who fled; Thurrastrix = hunts storms on the open sea; Skarnovar = keeps the claws of every rival it has beaten; Zhurrenkai = trades poisons with half the continent; Ulkhavaar = lives in the frozen north and never complains; Drevathiss = was once ruled by a green dragon and remembers it; Raxxonar = forbids any member to bow; Vorrakhesh = holds the oldest clan grudge anyone can remember"),
  ...clans("metallic", "Valtheran = keeps the law scrolls of a fallen empire; Aurendrix = sends a champion to every just war; Solmirath = guards a temple of the sun; Kelvorath = trades along the great rivers; Nadirrex = is famous for its fair judges; Pellanthos = raises the finest horses in the south; Torrumbal = builds bridges and asks no toll; Medranthis = keeps a library no outsider has entered; Rhalemmon = still pays a debt to a gold dragon; Hesvarion = teaches its children three languages; Silvakkar = forges silver armor that never tarnishes; Belmerath = answers every challenge with a duel"),
  ...clans("gem", "Ixenthiris = hears the thoughts of its eldest; Sorravelle = lives in caves of singing crystal; Lyrandeth = navigates by stars no one else can see; Esshuvari = carves its history into gemstones; Oramyrr = trusts dreams more than maps; Quellenthor = speaks only when it must; Zanthirel = lights its halls with glowing quartz; Thelvaris = sends its young to study with wizards; Velmorrin = guards a mirror that shows the future; Myrrakesh = moves its home every hundred years; Aquessa = settles disputes by a contest of riddles; Ithrandell = keeps a vow of peace older than the clan itself"),
];

export const CHILDHOOD_NAMES = glossed("Tailchaser = could never sit still; Sparkspitter = breathed fire too early; Nestguard = protected the eggs; Stonechewer = bit everything; Skywatcher = always looked up; Ashface = fell into the fire pit; Loudclaw = never stopped shouting; Quickscale = won every race; Bookbiter = loved scrolls a bit too much; Smokesnout = sneezed smoke; Shieldhugger = slept with a shield; Puddlehopper = jumped in every puddle; Hornknock = headbutted the elders; Starcounter = counted stars to fall asleep; Ironbelly = ate a nail once; Riddler = answered with questions; Cliffclimber = climbed where no one should; Emberwing = had wing scales like coals; Silentstep = was never heard coming; Oathlisp = mispronounced the clan oath");

export const DRAGONBORN_ANCESTRIES: { id: Ancestry; label: string; short: string }[] = [
  { id: "chromatic", label: "🔴 Chromatic", short: "Chromatic" },
  { id: "metallic", label: "🟡 Metallic", short: "Metallic" },
  { id: "gem", label: "💎 Gem", short: "Gem" },
];

export const dragonbornFilters: FilterGroup[] = [
  { id: "ancestry", label: "Draconic ancestry", multi: true, options: DRAGONBORN_ANCESTRIES.map((a) => ({ value: a.id, label: a.label })) },
  GENDER_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "clan", label: "Clan + name" },
      { value: "child", label: "Name + childhood name" },
      { value: "first", label: "Name only" },
    ],
  },
];

type Clan = (typeof DRAGONBORN_CLANS)[number];
type Child = (typeof CHILDHOOD_NAMES)[number];
interface Extra { color: string; clan: Clan | null; child: Child | null }
const clanBy = new Map(DRAGONBORN_CLANS.map((c) => [c.name, c]));
const childBy = new Map(CHILDHOOD_NAMES.map((c) => [c.name, c]));
type Name = (typeof DRAGONBORN_NAMES)[number];

export const dragonbornGenerator = comboGenerator<Name, Extra>({
  items: DRAGONBORN_NAMES,
  baseKey: (n) => n.name,
  facets: { ancestry: (n) => [n.group], gender: (n) => [n.gender] },
  extra: (n, rng, filters) => {
    const style = filters.style?.[0] ?? "clan";
    return {
      color: pick(DRAGONBORN_COLORS[n.group], rng),
      clan: style === "clan" ? pick(DRAGONBORN_CLANS.filter((c) => c.ancestry === n.group), rng) : null,
      child: style === "child" ? pick(CHILDHOOD_NAMES, rng) : null,
    };
  },
  extraKey: (e) => `${e.color}~${e.clan ? `c:${e.clan.name}` : e.child ? `k:${e.child.name}` : ""}`,
  extraFromKey: (n, key) => {
    const [color, rest = ""] = key.split("~");
    if (!DRAGONBORN_COLORS[n.group].includes(color)) return null;
    if (!rest) return { color, clan: null, child: null };
    if (rest.startsWith("k:")) { const child = childBy.get(rest.slice(2)); return child ? { color, clan: null, child } : null; }
    const clan = clanBy.get(rest.slice(2));
    return clan && clan.ancestry === n.group ? { color, clan, child: null } : null;
  },
  toResult: (n, { color, clan, child }) => ({
    title: clan ? `${clan.name} ${n.name}` : child ? `${n.name} "${child.name}"` : n.name,
    subtitle: `🐉 ${color} · ${n.gender}`,
    detail: [
      `${n.name}: ${n.meaning}`,
      clan ? `${clan.name} clan: ${clan.meaning}` : "",
      child ? `${child.name}: ${child.meaning}` : "",
    ].filter(Boolean).join(" · "),
  }),
  variety: (filters) => {
    const style = filters.style?.[0] ?? "clan";
    return 5 * (style === "clan" ? 12 : style === "child" ? CHILDHOOD_NAMES.length : 1);
  },
});
