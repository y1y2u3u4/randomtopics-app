import { MARVEL_CHARACTERS, TEAMS, type MarvelCharacter, type PowerType, type Side, type Team } from "@/data/marvelCharacters";
import { createRng, shuffle } from "@/lib/randomGenerators";

export { MARVEL_CHARACTERS, TEAMS };
export type { MarvelCharacter, PowerType, Side, Team };

export const SIDES: { value: Side; label: string; plural: string }[] = [
  { value: "hero", label: "Hero", plural: "Heroes" },
  { value: "villain", label: "Villain", plural: "Villains" },
  { value: "anti", label: "Anti-hero", plural: "Anti-heroes" },
];

export const POWERS: { value: PowerType; label: string }[] = [
  { value: "strength", label: "Super strength" },
  { value: "tech", label: "Tech & armor" },
  { value: "magic", label: "Magic" },
  { value: "cosmic", label: "Cosmic" },
  { value: "mutant", label: "Mutant" },
  { value: "speed", label: "Speed & flight" },
  { value: "skill", label: "Peak human / skill" },
  { value: "psychic", label: "Psychic" },
  { value: "elemental", label: "Elemental" },
  { value: "shapeshift", label: "Shapeshifting" },
];

/** Comic-book ages by debut year, the way fans and price guides group them. */
export const ERAS = [
  { value: "golden", label: "Golden Age", range: "1939–1955", from: 1939, to: 1955 },
  { value: "silver", label: "Silver Age", range: "1956–1969", from: 1956, to: 1969 },
  { value: "bronze", label: "Bronze Age", range: "1970–1984", from: 1970, to: 1984 },
  { value: "modern", label: "Modern Age", range: "1985–1999", from: 1985, to: 1999 },
  { value: "new", label: "2000s & later", range: "2000–today", from: 2000, to: 9999 },
] as const;
export type Era = (typeof ERAS)[number]["value"];

export function eraOf(year: number) {
  return ERAS.find((e) => year >= e.from && year <= e.to) ?? ERAS[ERAS.length - 1];
}

export interface MarvelFilters {
  sides: Side[];
  team: Team | "";
  eras: Era[];
  powers: PowerType[];
  mcuOnly: boolean;
}

export const NO_FILTERS: MarvelFilters = { sides: [], team: "", eras: [], powers: [], mcuOnly: false };

export function filterCharacters(f: MarvelFilters, list: readonly MarvelCharacter[] = MARVEL_CHARACTERS) {
  return list.filter((c) =>
    (!f.sides.length || f.sides.includes(c.side)) &&
    (!f.team || c.teams.includes(f.team)) &&
    (!f.eras.length || f.eras.includes(eraOf(c.debut).value)) &&
    (!f.powers.length || c.powers.some((p) => f.powers.includes(p))) &&
    (!f.mcuOnly || c.mcu),
  );
}

export const byId = new Map(MARVEL_CHARACTERS.map((c) => [c.id, c]));

/**
 * Draw `count` characters from the filtered pool, skipping ids already seen.
 * When the unseen pool runs dry the cycle restarts (reported via `cycled`).
 */
export function draw(pool: readonly MarvelCharacter[], count: number, seen: readonly string[], seed: number) {
  const rng = createRng(seed);
  const seenSet = new Set(seen);
  let fresh = pool.filter((c) => !seenSet.has(c.id));
  let cycled = false;
  if (fresh.length < count) {
    cycled = fresh.length === 0;
    if (cycled) fresh = pool.slice();
  }
  const picks = shuffle(fresh, rng).slice(0, count);
  return { picks, cycled };
}

/** UTC day number; the daily character is the same for everyone on a given day. */
export function dayNumber(date = new Date()) {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

/** Day 1 of the daily puzzle (2026-10-27). */
export const DAILY_EPOCH = 20_753;

/** A fixed shuffle of the whole roster, walked one character per day. */
export function dailyCharacter(day: number) {
  const order = shuffle(MARVEL_CHARACTERS.filter((c) => c.bio && c.abilities), createRng(0x6d617276));
  return order[((day - DAILY_EPOCH) % order.length + order.length) % order.length];
}

export function dailyClues(c: MarvelCharacter) {
  const era = eraOf(c.debut);
  return [
    `First comic appearance: ${c.debut} (${era.label})`,
    `${SIDES.find((s) => s.value === c.side)!.label}${c.teams.length ? ` · ${c.teams.join(", ")}` : " · no regular team"}`,
    `Abilities: ${c.abilities}`,
    c.realName ? `${redact(c.bio, c)} Real name starts with “${c.realName[0]}”.` : redact(c.bio, c),
  ];
}

/** Hide the character's own names inside the bio clue. */
function redact(text: string, c: MarvelCharacter) {
  const words = [c.name.replace(/\s*\(.*\)$/, ""), c.realName ?? ""].flatMap((n) => [n, ...n.split(/\s+/)]).filter((w) => w.length > 2);
  return words.reduce((t, w) => t.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "▇▇▇"), text);
}

export function normalizeGuess(s: string) {
  return s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, "");
}

export function isCorrectGuess(guess: string, c: MarvelCharacter) {
  const g = normalizeGuess(guess);
  if (!g) return false;
  const full = guess.toLowerCase().trim();
  return full === c.name.toLowerCase() || g === normalizeGuess(c.name) || (!!c.realName && g === normalizeGuess(c.realName));
}

export function characterText(c: MarvelCharacter) {
  const side = SIDES.find((s) => s.value === c.side)!.label;
  return `${c.name}${c.realName && !c.name.includes(c.realName) ? ` (${c.realName})` : ""} — ${side}, first appeared ${c.debut}. ${c.abilities}.`;
}
