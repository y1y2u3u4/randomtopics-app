import { comboGenerator, pick } from "./core";
import { roots, rootNames } from "./rootNames";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// God and goddess names for invented pantheons. The first root carries the
// domain (sea, war, death…), the ending marks god, goddess or neither, and an
// epithet and holy symbol come from the same domain. All names are original;
// none belongs to a real religion.
export type Domain = "war" | "death" | "sea" | "storm" | "sun" | "moon" | "nature" | "knowledge" | "trickery" | "love" | "forge" | "harvest";
type Gender = "god" | "goddess" | "neutral";

const PREFIX: Record<Domain, ReturnType<typeof roots>> = {
  war: roots("Vor:battle, Kar:spear, Bael:blood, Thrax:victory, Gor:slaughter"),
  death: roots("Mor:death, Nyx:night, Kel:grave, Ves:silence, Ul:ending"),
  sea: roots("Thal:sea, Ner:wave, Os:salt, Pel:deep, Kae:tide"),
  storm: roots("Ka:thunder, Vel:wind, Zar:lightning, Tor:storm, Hra:rain"),
  sun: roots("Sol:sun, Ra:light, Hel:dawn, Aur:gold, Ilu:noon"),
  moon: roots("Sel:moon, Lun:silver, Eo:twilight, Myr:star, Ash:dusk"),
  nature: roots("Syl:forest, Ver:green, Fau:beast, Dru:oak, Ery:river"),
  knowledge: roots("Ix:secret, Oph:wisdom, Mne:memory, Lor:lore, Ther:truth"),
  trickery: roots("Lok:trick, Vex:mischief, Ki:mask, Ruz:chaos, Pha:shadow"),
  love: roots("Ama:love, Cor:heart, Ser:beauty, Lia:devotion, Phi:friendship"),
  forge: roots("Hep:forge, Dur:iron, Bra:fire, Ank:anvil, Tek:craft"),
  harvest: roots("Cer:grain, Pom:fruit, Ber:plenty, Ag:field, Vin:vine"),
};

const SUFFIX: Record<Gender, ReturnType<typeof roots>> = {
  god: roots("oros:lord, an:king, ius:father, ak:might, eon:age"),
  goddess: roots("ara:lady, ia:queen, ene:mother, ys:grace, ora:light"),
  neutral: roots("is:spirit, eth:one, umn:the ancient"),
};

// Drop vowel pile-ups like "Liaia" that are hard to say.
export const GOD_NAMES = rootNames(PREFIX, SUFFIX, 10).filter((n) => !/[aeiouy]{3}/i.test(n.name));

const EPITHETS: Record<Domain, string[]> = {
  war: ["the Spear-Breaker", "Lord of the Red Field", "the Unconquered", "Who Walks Before Armies", "the Iron Crown"],
  death: ["Keeper of the Last Door", "the Quiet One", "Who Counts the Hours", "the Pale Ferryman", "Warden of the Grave"],
  sea: ["Mother of Storms at Sea", "the Drowned Crown", "Who Calls the Tide", "Keeper of Lost Ships", "the Salt-Eyed"],
  storm: ["the Thunder-Voiced", "Who Splits the Sky", "Rider of the Gale", "the Rain-Bringer", "Breaker of Mountains"],
  sun: ["the Ever-Burning", "Who Opens the Dawn", "the Golden Eye", "Lord of Noon", "the Unclouded"],
  moon: ["the Silver Watcher", "Who Turns the Tides", "Lady of Dreams", "the Night Lantern", "Keeper of Hidden Paths"],
  nature: ["the Green Heart", "Who Wakes the Forest", "Mother of Beasts", "the Old Root", "Keeper of Wild Places"],
  knowledge: ["the All-Seeing", "Keeper of Secrets", "Who Remembers Everything", "the First Scribe", "the Open Book"],
  trickery: ["the Smiling Liar", "Who Steals the Stars", "the Hundred-Faced", "Breaker of Oaths", "the Laughing Shadow"],
  love: ["the Heart's Flame", "Who Binds Two Souls", "the Rose-Crowned", "Keeper of Vows", "the Gentle Hand"],
  forge: ["the Hammer of Heaven", "Who Shaped the World", "the Ember-Handed", "Master of the Anvil", "the Unquenched"],
  harvest: ["the Bountiful", "Who Fills the Granary", "Mother of the Fields", "Lord of the Vine", "the Golden Sheaf"],
};

const SYMBOLS: Record<Domain, string> = {
  war: "a broken spear", death: "an hourglass", sea: "a trident of coral", storm: "a forked bolt", sun: "a golden disc",
  moon: "a silver crescent", nature: "an antlered crown", knowledge: "an open eye", trickery: "a two-faced mask",
  love: "a burning rose", forge: "a hammer and anvil", harvest: "a sheaf of wheat",
};

export const GOD_DOMAINS: { id: Domain; label: string; short: string }[] = [
  { id: "war", label: "⚔️ War", short: "War" },
  { id: "death", label: "💀 Death", short: "Death" },
  { id: "sea", label: "🌊 Sea", short: "Sea" },
  { id: "storm", label: "⛈️ Storm", short: "Storm" },
  { id: "sun", label: "☀️ Sun", short: "Sun" },
  { id: "moon", label: "🌙 Moon", short: "Moon" },
  { id: "nature", label: "🌿 Nature", short: "Nature" },
  { id: "knowledge", label: "📜 Knowledge", short: "Knowledge" },
  { id: "trickery", label: "🎭 Trickery", short: "Trickery" },
  { id: "love", label: "❤️ Love", short: "Love" },
  { id: "forge", label: "🔨 Forge", short: "Forge" },
  { id: "harvest", label: "🌾 Harvest", short: "Harvest" },
];

export const godFilters: FilterGroup[] = [
  { id: "domain", label: "Domain", multi: true, options: GOD_DOMAINS.map((d) => ({ value: d.id, label: d.label })) },
  {
    id: "gender",
    label: "Deity",
    multi: true,
    options: [
      { value: "god", label: "God" },
      { value: "goddess", label: "Goddess" },
      { value: "neutral", label: "Neither / genderless" },
    ],
  },
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "epithet", label: "Name + epithet" },
      { value: "title", label: "Name, god of…" },
      { value: "first", label: "Name only" },
    ],
  },
];

type Name = (typeof GOD_NAMES)[number];
interface Extra { epithet: string; style: "epithet" | "title" | "first" }
const deity = (g: Gender) => (g === "goddess" ? "Goddess" : g === "god" ? "God" : "Deity");
const domainLabel = (d: Domain) => GOD_DOMAINS.find((x) => x.id === d)?.short ?? d;
const OF: Record<Domain, string> = {
  war: "War", death: "Death", sea: "the Sea", storm: "Storms", sun: "the Sun", moon: "the Moon", nature: "the Wild",
  knowledge: "Knowledge", trickery: "Trickery", love: "Love", forge: "the Forge", harvest: "the Harvest",
};

export const godGenerator = comboGenerator<Name, Extra>({
  items: GOD_NAMES,
  baseKey: (n) => n.name,
  facets: { domain: (n) => [n.group], gender: (n) => [n.gender] },
  extra: (n, rng, filters) => {
    const raw = filters.style?.[0];
    const style: Extra["style"] = raw === "title" || raw === "first" ? raw : "epithet";
    return { style, epithet: style === "epithet" ? pick(EPITHETS[n.group], rng) : "" };
  },
  extraKey: (e) => (e.style === "epithet" ? `e:${e.epithet}` : e.style),
  extraFromKey: (n, key) => {
    if (key === "title" || key === "first") return { style: key, epithet: "" };
    return key.startsWith("e:") && EPITHETS[n.group].includes(key.slice(2)) ? { style: "epithet", epithet: key.slice(2) } : null;
  },
  toResult: (n, { style, epithet }) => ({
    title: style === "epithet" ? `${n.name}, ${epithet}` : style === "title" ? `${n.name}, ${deity(n.gender)} of ${OF[n.group]}` : n.name,
    subtitle: `✨ ${domainLabel(n.group)} · ${deity(n.gender).toLowerCase()}`,
    detail: `${n.name}: ${n.meaning} · Holy symbol: ${SYMBOLS[n.group]}`,
  }),
  variety: (filters) => (["title", "first"].includes(filters.style?.[0] ?? "") ? 1 : 5),
});
