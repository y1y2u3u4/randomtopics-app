// Wu-Tang style name generator: pure, dependency-free logic so it can be unit
// tested and so a shared link (?name=… or ?r=…) reproduces the same result.
//
// Name mode is deterministic: the normalised input is hashed (cyrb53) and the
// hash picks a first word, a second word and — rarely — a flourish. Random mode
// draws from the same lists with an injected rng.
//
// Word lists are original and generic. They deliberately avoid real members'
// names, aliases and lyrics (see the regression test's forbidden list).

import type { Rng } from "@/lib/randomGenerators";

export const WU_FIRST: readonly string[] = [
  "Ruthless", "Mighty", "Lucky", "Furious", "Silent", "Cosmic", "Swift", "Phantom", "Iron", "Crimson",
  "Mystic", "Raging", "Shadow", "Thunder", "Electric", "Fearless", "Sly", "Cunning", "Supreme", "Heavenly",
  "Ancient", "Cold", "Hungry", "Restless", "Smooth", "Sharp", "Steady", "Stealthy", "Wild", "Bold",
  "Brave", "Noble", "Royal", "Humble", "Wise", "Clever", "Quiet", "Lethal", "Deadly", "Venomous",
  "Flying", "Wandering", "Lone", "Blind", "Hidden", "Invisible", "Unstoppable", "Righteous", "Rogue", "Rugged",
  "Gritty", "Grim", "Stone", "Steel", "Jade", "Ivory", "Obsidian", "Scarlet", "Midnight", "Northern",
  "Eastern", "Celestial", "Lunar", "Solar", "Atomic", "Sonic", "Turbo", "Hyper", "Ultra", "Infinite",
  "Eternal", "Immortal", "Legendary", "Notorious", "Infamous", "Fabled", "Mythic", "Arcane", "Astral", "Radiant",
  "Blazing", "Frozen", "Burning", "Rumbling", "Roaring", "Howling", "Prowling", "Lurking", "Grinning", "Laughing",
  "Sleepy", "Grumpy", "Dizzy", "Jumpy", "Nimble", "Agile", "Rapid", "Turbulent", "Volcanic", "Seismic",
  "Magnetic", "Quantum", "Analog", "Vintage", "Classic", "Original", "Uncanny", "Mysterious", "Unseen", "Haunted",
  "Untamed", "Unbroken", "Unbothered", "Relentless", "Tireless", "Patient", "Calculated", "Tactical", "Doctah", "Mista",
  "Captain", "Grand", "Sir", "Lord", "Duke", "Baron", "Count", "Elder", "Young", "Lil",
  "Big", "Old", "Kung-Fu", "Lightning", "Thunderous", "Shaolin", "Stormy", "Velvet", "Platinum", "Diamond",
  "Rusty", "Dusty", "Lucid", "Vivid", "Savvy", "Feral", "Stoic", "Zen", "Fierce", "Twisted",
];

export const WU_SECOND: readonly string[] = [
  "Bandit", "Assassin", "Monk", "Professor", "Swordsman", "Samurai", "Ronin", "Ninja", "Warrior", "Prophet",
  "Scholar", "Sage", "Philosopher", "Scientist", "Architect", "Engineer", "Mechanic", "Pilot", "Commander", "Marshal",
  "Sheriff", "Outlaw", "Renegade", "Nomad", "Wanderer", "Drifter", "Stranger", "Specter", "Dragon", "Tiger",
  "Panther", "Cobra", "Viper", "Scorpion", "Mantis", "Crane", "Monkey", "Leopard", "Falcon", "Hawk",
  "Eagle", "Raven", "Wolf", "Fox", "Bear", "Lion", "Jaguar", "Rhino", "Gorilla", "Shark",
  "Hornet", "Mustang", "Bull", "Buffalo", "Grizzly", "Badger", "Wolverine", "Phoenix", "Griffin", "Hydra",
  "Titan", "Giant", "Colossus", "Golem", "Wizard", "Sorcerer", "Magician", "Alchemist", "Oracle", "Shaman",
  "Druid", "Hermit", "Pilgrim", "Disciple", "Apprentice", "Master", "Grandmaster", "Sensei", "Teacher", "Instructor",
  "Doctor", "Surgeon", "Chemist", "Physicist", "Mathematician", "Poet", "Lyricist", "Storyteller", "Narrator", "Composer",
  "Conductor", "Drummer", "Producer", "Selector", "Beatsmith", "Wordsmith", "Blacksmith", "Locksmith", "Craftsman", "Tailor",
  "Barber", "Baker", "Gardener", "Farmer", "Fisherman", "Hunter", "Tracker", "Ranger", "Scout", "Sentinel",
  "Guardian", "Watchman", "Gatekeeper", "Warden", "Knight", "Squire", "Paladin", "Gladiator", "Champion", "Contender",
  "Challenger", "Brawler", "Boxer", "Wrestler", "Kickboxer", "Grappler", "Duelist", "Fencer", "Archer", "Lancer",
  "Juggernaut", "Bulldozer", "Locomotive", "Hurricane", "Tornado", "Typhoon", "Avalanche", "Volcano", "Comet", "Meteor",
  "Nebula", "Quasar", "Supernova", "Eclipse", "Mirage", "Enigma", "Cipher", "Codebreaker", "Chessmaster", "Strategist",
  "Tactician", "Diplomat", "Emperor", "Monarch", "Sultan", "Pharaoh", "Shogun", "Chieftain", "Mastermind", "Visionary",
  "Inventor", "Pioneer", "Navigator", "Voyager", "Explorer", "Astronaut", "Rocketeer", "Buccaneer", "Highwayman", "Desperado",
];

/** Rare third flourish (about 1 in 12 names). */
export const WU_FLOURISH: readonly string[] = [
  "the Great", "the Wise", "of the East", "of the Mountain", "the Third", "Supreme", "Jr.", "the Elder",
  "of the Hidden Temple", "of the Five Rivers", "the Unbeaten", "from the Far Hills",
];

const FLOURISH_ONE_IN = 12;

const ORIGIN_DEEDS: readonly string[] = [
  "beating a temple master at chess blindfolded",
  "out-training an entire kung-fu school before sunrise",
  "catching a fly with chopsticks on the first try",
  "winning a rap battle without ever raising their voice",
  "walking out of a 1970s martial-arts double feature a changed person",
  "inventing a fighting style based entirely on dance moves",
  "memorising every scroll in the monastery library",
  "fixing a broken turntable with nothing but a paperclip",
  "staring down a thunderstorm until it moved on",
  "climbing the thousand temple steps on their hands",
  "teaching a pigeon to deliver mixtapes",
  "never once losing at rock-paper-scissors",
  "splitting a watermelon with a single karate chop",
  "solving a riddle that had stumped sages for a century",
  "running a corner store like a secret dojo",
  "dropping a verse so smooth the crowd forgot to clap",
  "meditating through a fire alarm",
  "outsmarting a comic-book villain in a late-night dream",
];

const ORIGIN_TEMPLATES: readonly ((first: string, second: string, deed: string) => string)[] = [
  (f, s, d) => `Earned the name ${f} ${s} after ${d}.`,
  (f, s, d) => `Old-timers say the ${s} became ${f} by ${d}.`,
  (f, s, d) => `Nobody called them ${f} until they started ${d}. The ${s} part was always obvious.`,
  (f, s, d) => `Legend has it the ${f} ${s} was born the day of ${d}.`,
  (f, s, d) => `Trained in secret, then went public by ${d} — ${f} ${s} ever since.`,
  (f, s, d) => `Ask around the block: the ${f} ${s} is famous for ${d}.`,
  (f, s, d) => `Part ${s}, part legend — the ${f} ${s} made their name by ${d}.`,
  (f, s, d) => `Master's notes read: "${f}. A true ${s}. Distinguished by ${d}."`,
];

export interface WuName {
  first: string;
  second: string;
  flourish: string | null;
  /** first + second (+ flourish), ready to display. */
  full: string;
  origin: string;
  /** Compact code that reproduces this exact name (used for ?r= links). */
  code: string;
}

export const WU_COMBINATIONS = WU_FIRST.length * WU_SECOND.length;
export const MAX_INPUT_LENGTH = 40;

/** Lowercase, Unicode-normalise and collapse whitespace so "alex" and " Alex " match. */
export function normalise(input: string): string {
  return input.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_LENGTH);
}

/** cyrb53: fast, well-distributed 53-bit string hash. Stable across engines. */
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** Build a name from list indices. flourishIndex -1 = no flourish. */
export function nameFromIndices(firstIndex: number, secondIndex: number, flourishIndex: number, originSeed: number): WuName {
  const first = WU_FIRST[firstIndex];
  const second = WU_SECOND[secondIndex];
  const flourish = flourishIndex >= 0 ? WU_FLOURISH[flourishIndex] : null;
  const deed = ORIGIN_DEEDS[originSeed % ORIGIN_DEEDS.length];
  const template = ORIGIN_TEMPLATES[Math.floor(originSeed / ORIGIN_DEEDS.length) % ORIGIN_TEMPLATES.length];
  return {
    first,
    second,
    flourish,
    full: [first, second, flourish].filter(Boolean).join(" "),
    origin: template(first, second, deed),
    code: encodeCode(firstIndex, secondIndex, flourishIndex, originSeed % (ORIGIN_DEEDS.length * ORIGIN_TEMPLATES.length)),
  };
}

/** Deterministic Wu-style name for a person's name. Returns null for empty input. */
export function nameFor(input: string): WuName | null {
  const key = normalise(input);
  if (!key) return null;
  const a = cyrb53(key, 36);
  const b = cyrb53(key, 7);
  const c = cyrb53(key, 1993);
  const firstIndex = a % WU_FIRST.length;
  const secondIndex = b % WU_SECOND.length;
  const flourishIndex = c % FLOURISH_ONE_IN === 0 ? Math.floor(c / FLOURISH_ONE_IN) % WU_FLOURISH.length : -1;
  return nameFromIndices(firstIndex, secondIndex, flourishIndex, Math.floor(a / WU_FIRST.length));
}

/** A fresh random name. Pass recent codes in `exclude` to avoid repeats. */
export function randomName(rng: Rng, exclude: ReadonlySet<string> = new Set()): WuName {
  const pick = (n: number) => Math.floor(rng() * n);
  let name = draw();
  for (let tries = 0; tries < 50 && exclude.has(pairKey(name)); tries++) name = draw();
  return name;

  function draw(): WuName {
    const flourish = pick(FLOURISH_ONE_IN) === 0 ? pick(WU_FLOURISH.length) : -1;
    return nameFromIndices(pick(WU_FIRST.length), pick(WU_SECOND.length), flourish, pick(ORIGIN_DEEDS.length * ORIGIN_TEMPLATES.length));
  }
}

/** Identity of a name for no-repeat checks (ignores flourish and origin). */
export function pairKey(name: Pick<WuName, "first" | "second">): string {
  return `${name.first}|${name.second}`;
}

function encodeCode(f: number, s: number, x: number, o: number): string {
  return [f, s, x + 1, o].map((n) => n.toString(36)).join("-");
}

/** Decode a ?r= code back into a name; null if invalid. */
export function nameFromCode(code: string | null | undefined): WuName | null {
  if (!code || !/^[0-9a-z]{1,3}(-[0-9a-z]{1,3}){3}$/.test(code)) return null;
  const [f, s, x, o] = code.split("-").map((p) => parseInt(p, 36));
  if (f >= WU_FIRST.length || s >= WU_SECOND.length || x > WU_FLOURISH.length || o >= ORIGIN_DEEDS.length * ORIGIN_TEMPLATES.length) return null;
  return nameFromIndices(f, s, x - 1, o);
}

export const WU_PATH = "/wu-tang-name-generator";

/** Share link for a result: ?name= for name mode, ?r= for random mode. */
export function shareUrl(origin: string, opts: { name?: string; code?: string }): string {
  const params = new URLSearchParams();
  const clean = opts.name ? opts.name.replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_LENGTH) : "";
  if (clean) params.set("name", clean);
  else if (opts.code) params.set("r", opts.code);
  const qs = params.toString();
  return `${origin}${WU_PATH}${qs ? `?${qs}` : ""}`;
}

/** Read a share link's query string back into a result. */
export function readShareParams(search: string): { input: string; result: WuName } | { input: null; result: WuName } | null {
  const params = new URLSearchParams(search);
  const raw = params.get("name");
  if (raw) {
    const input = raw.replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_LENGTH);
    const result = nameFor(input);
    if (result) return { input, result };
  }
  const result = nameFromCode(params.get("r"));
  return result ? { input: null, result } : null;
}
