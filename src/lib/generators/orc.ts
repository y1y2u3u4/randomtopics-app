import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Orc names are assembled from short word-roots so every name carries a
// readable meaning ("blood + axe"). Each clan has its own sound: war-band names
// are drum-like, mountain names are blunt, swamp names are wet and hissing,
// ash names are dry and burning.
export type OrcClan = "warband" | "mountain" | "swamp" | "ash";
type Gender = "male" | "female" | "neutral";
interface Root { part: string; meaning: string }
interface OrcName { name: string; clan: OrcClan; gender: Gender; meaning: string }
interface ClanName { name: string; clan: OrcClan; meaning: string }

const roots = (list: string): Root[] => list.split(", ").map((r) => { const [part, meaning] = r.split(":"); return { part, meaning }; });

const PREFIX: Record<OrcClan, Root[]> = {
  warband: roots("Gor:blood, Thrak:war, Ur:first, Mog:drum, Brak:break, Zug:charge, Grol:roar, Kar:spear, Vrag:raid"),
  mountain: roots("Dur:stone, Krag:cliff, Bol:iron, Gram:anvil, Ruk:rock, Dag:deep, Hruk:ore, Torg:peak, Bar:wall"),
  swamp: roots("Sna:mire, Gul:rot, Ozz:fog, Skar:scale, Muk:mud, Rek:leech, Vush:reed, Lurg:lurk, Ssil:eel"),
  ash: roots("Az:ash, Khar:fire, Sul:sun, Zar:ember, Rha:dust, Ghaz:scorch, Ish:smoke, Vor:blaze, Nar:cinder"),
};

const SUFFIX: Record<Gender, Root[]> = {
  male: roots("ok:fist, ash:axe, gul:fang, thar:hide, rak:skull, uz:bone, dug:wolf, mar:howl, grim:grip"),
  female: roots("sha:blade, ka:claw, gra:oath, ul:night, ri:spark, zha:thorn, na:storm"),
  neutral: roots("nak:scar, ug:tusk, esh:brand, ob:shield, ix:hook"),
};

const fuse = (a: string, b: string) => {
  const head = a.slice(0, 1) + a.slice(1).toLowerCase();
  // Avoid tripled letters and soften a doubled hard stop: Brak + ka -> Brakka is fine, Ozz + z -> Ozz.
  if (head.slice(-1).toLowerCase() === b[0] && head.slice(-2, -1).toLowerCase() === b[0]) return head + b.slice(1);
  return head + b;
};

export const ORC_NAMES: OrcName[] = (Object.keys(PREFIX) as OrcClan[]).flatMap((clan) =>
  PREFIX[clan].flatMap((p) =>
    (Object.keys(SUFFIX) as Gender[]).flatMap((gender) =>
      SUFFIX[gender].map((s) => ({ name: fuse(p.part, s.part), clan, gender, meaning: `${p.meaning} + ${s.meaning}` })),
    ),
  ),
).filter((n, i, all) => n.name.length <= 9 && all.findIndex((m) => m.name === n.name) === i);

const clans = (clan: OrcClan, list: string): ClanName[] => list.split("; ").map((c) => { const [name, meaning] = c.split(" = "); return { name, clan, meaning }; });

export const ORC_CLANS: ClanName[] = [
  ...clans("warband", "Bloodtusk = paints its tusks red before every battle; Skullsplitter = keeps the helmets of every chief it has beaten; Warhowl = attacks at night to the sound of its own howling; Ironjaw = chiefs must bite through a chain to lead; Blackbanner = marches under a flag that has never been captured; Drumborn = children are named while the war drums play; Spearbreaker = proud of the spears it has broken, not the ones it carries; Redhand = marks a raid with a red handprint on the gate; Tuskborn = traces its line to a chief born with full tusks; Shattershield = fights without shields and sneers at those who use them; Bonechewer = feasts for three days after a win; Wolfrider = rides great wolves into the charge; Thunderfist = punches its war drums instead of beating them; Gorehorn = carries curved horns to call the charge; Sunderfang = splits its war band to strike from two sides; Rageborn = chooses chiefs by who lasts longest in a brawl; Crowfeast = leaves nothing on the field but crows; Ashenblade = burns its blades black before battle; Warmonger = never signs a truce; Brokenchain = founded by orcs who escaped slavery"),
  ...clans("mountain", "Stonehide = scars its skin until it is hard as rock; Ironpeak = mines iron at the top of the world; Deepdelver = digs deeper than the dwarves dare; Cragborn = raised on cliffs where only goats can stand; Anvilback = carries its forges on its back between camps; Rockgrinder = crushes ore with bare hands as a rite of age; Highmaul = fights with hammers taller than its warriors; Frostfang = guards the passes that stay frozen all year; Boulderfist = throws stones before it throws spears; Grimforge = makes the best and ugliest axes in the north; Cavecaller = speaks to the echoes in its tunnels; Slatebrow = has foreheads like flat stone; Orehunter = trades raw metal with anyone brave enough to climb; Avalanche = attacks downhill in one crushing rush; Hollowpeak = lives inside a mountain it hollowed out; Granitejaw = never smiles and never surrenders; Chainmountain = chains its prisoners to the mine; Pickaxe = treats a miner's pick as a sacred weapon; Stormridge = lives where lightning strikes the ridge; Coldiron = forges blades that never rust"),
  ...clans("swamp", "Bogfang = hunts from under the water; Mirestalker = moves through the marsh without a sound; Rotgut = can eat anything, and does; Mudscale = wears armor made from crocodile hide; Fenwatch = guards the only safe path through the bog; Leechblood = lets leeches drink before battle to prove its toughness; Murkwater = drinks from pools no one else will touch; Reedslicer = makes blowpipes and darts from marsh reeds; Sinkhole = lures enemies into hidden mud pits; Grubgnaw = farms giant grubs for food; Blackmire = lives in a swamp so dark the sun never reaches it; Toadspit = brews poisons from swamp toads; Fogborn = only raids when the mist is thick; Gutrot = laughs at disease; Snapjaw = trains swamp lizards as hunting beasts; Mossback = covers itself in moss to hide; Drownmaker = holds its prisoners under the water; Stillwater = waits for days without moving; Ratking = keeps a rat-tangle as its totem; Rustbog = fights with blades rusted by the damp"),
  ...clans("ash", "Ashwalker = crosses the burning wastes on foot; Sunscorch = fights at noon when its enemies are weakest; Emberborn = keeps a fire burning that has never gone out; Cinderfist = wraps its fists in hot coals; Dustrider = rides lizards across the dunes; Flamebrand = brands every warrior with the clan sign; Burntongue = chants war songs that sound like crackling fire; Scorchmark = leaves a ring of fire around each camp it takes; Smokeblind = attacks under cover of smoke; Blacksand = lives on a desert of black glass; Firegut = drinks lamp oil to prove its courage; Sunbreaker = swore to one day put out the sun; Ashmaw = has jaws grey with ash; Duneshadow = hides under the sand to ambush caravans; Kilnborn = bakes its shields hard in clay kilns; Searhide = has skin cracked by heat; Pyrewatch = burns its dead and reads the smoke; Glasscutter = fights with shards of desert glass; Heatwave = strikes when the air itself shimmers; Redsun = follows a red star across the waste"),
];

export const ORC_TITLES = "the Unbroken, Skull-Taker, the Iron-Willed, Gate-Smasher, the Twice-Scarred, Wolf-Friend, the Last Standing, Chain-Breaker, the Red, Oathkeeper, the Loud, Bone-Crusher, the Patient, Shield-Biter, the Old, Fire-Eater, the Silent, Wall-Breaker, the One-Eyed, Storm-Caller, the Grinning, Head-Hunter, the Unbowed, Doom-Bringer".split(", ");

export const ORC_CLAN_TYPES: { id: OrcClan; label: string; short: string }[] = [
  { id: "warband", label: "🥁 War band", short: "War band" },
  { id: "mountain", label: "⛰️ Mountain clan", short: "Mountain clan" },
  { id: "swamp", label: "🐊 Swamp clan", short: "Swamp clan" },
  { id: "ash", label: "🔥 Ash-waste clan", short: "Ash-waste clan" },
];

export const orcFilters: FilterGroup[] = [
  { id: "clan", label: "Clan", multi: true, options: ORC_CLAN_TYPES.map((c) => ({ value: c.id, label: c.label })) },
  GENDER_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "clan", label: "Name + clan" },
      { value: "title", label: "Name + title" },
      { value: "first", label: "Name only" },
    ],
  },
];

const clanBy = new Map(ORC_CLANS.map((c) => [c.name, c]));
interface Extra { clanName: ClanName | null; title: string }

export const orcGenerator = comboGenerator<OrcName, Extra>({
  items: ORC_NAMES,
  baseKey: (n) => n.name,
  facets: { clan: (n) => [n.clan], gender: (n) => [n.gender] },
  extra: (n, rng, filters) => {
    const style = filters.style?.[0] ?? "clan";
    return {
      clanName: style === "clan" ? pick(ORC_CLANS.filter((c) => c.clan === n.clan), rng) : null,
      title: style === "title" ? pick(ORC_TITLES, rng) : "",
    };
  },
  extraKey: (e) => (e.clanName ? `c:${e.clanName.name}` : e.title ? `t:${e.title}` : ""),
  extraFromKey: (n, key) => {
    if (!key) return { clanName: null, title: "" };
    if (key.startsWith("t:")) return ORC_TITLES.includes(key.slice(2)) ? { clanName: null, title: key.slice(2) } : null;
    const c = clanBy.get(key.slice(2));
    return c && c.clan === n.clan ? { clanName: c, title: "" } : null;
  },
  toResult: (n, { clanName, title }) => ({
    title: clanName ? `${n.name} ${clanName.name}` : title ? `${n.name} ${title}` : n.name,
    subtitle: `🪓 ${ORC_CLAN_TYPES.find((c) => c.id === n.clan)?.short} · ${n.gender}`,
    detail: [`${n.name}: ${n.meaning}`, clanName ? `${clanName.name} clan: ${clanName.meaning}` : ""].filter(Boolean).join(" · "),
  }),
  variety: (filters) => {
    const style = filters.style?.[0] ?? "clan";
    return style === "clan" ? Math.floor(ORC_CLANS.length / ORC_CLAN_TYPES.length) : style === "title" ? ORC_TITLES.length : 1;
  },
});
