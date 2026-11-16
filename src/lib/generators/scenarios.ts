// Random Scenario Generator (/scenario-generator): curated scenarios for OC
// development, roleplay and creative writing, filtered by genre, cast size and
// tone, with an optional twist, character-name filling, exact share links and a
// daily scenario. Pure functions so the page, tests and share links agree.
import data from "@/data/generators/scenarios.json";
import { createRng, drawUnique, type Rng } from "@/lib/randomGenerators";

export type Mode = "oc" | "roleplay" | "writing";
export type Genre = "fantasy" | "scifi" | "modern" | "mystery" | "horror" | "romance" | "adventure" | "historical";
export type Tone = "wholesome" | "funny" | "dramatic" | "dark";
export type Cast = 1 | 2 | 3;

export interface Scenario { id: string; mode: Mode; genre: Genre; cast: Cast; tone: Tone; text: string; hook: string }

export const SCENARIOS = data as Scenario[];

export const MODES: { id: Mode; label: string; tab: string; hookLabel: string; blurb: string }[] = [
  { id: "oc", label: "OC scenario", tab: "🧬 OC", hookLabel: "Question to answer", blurb: "Drop your original character into a situation that shows who they really are." },
  { id: "roleplay", label: "Roleplay scenario", tab: "🎭 Roleplay", hookLabel: "Opening line", blurb: "A ready setup for two or more players, with a reason to interact and a first line." },
  { id: "writing", label: "Writing scenario", tab: "✍️ Writing", hookLabel: "First sentence", blurb: "A short-story situation with a conflict, a choice and a first sentence." },
];

export const GENRES: { id: Genre; label: string }[] = [
  { id: "fantasy", label: "🐉 Fantasy" },
  { id: "scifi", label: "🚀 Sci-fi" },
  { id: "modern", label: "🏙️ Modern" },
  { id: "mystery", label: "🔎 Mystery" },
  { id: "horror", label: "🕯️ Horror" },
  { id: "romance", label: "💌 Romance" },
  { id: "adventure", label: "🧭 Adventure" },
  { id: "historical", label: "🏛️ Historical" },
];

export const TONES: { id: Tone; label: string }[] = [
  { id: "wholesome", label: "🌼 Wholesome" },
  { id: "funny", label: "😂 Funny" },
  { id: "dramatic", label: "🔥 Dramatic" },
  { id: "dark", label: "🌑 Dark" },
];

export const CASTS: { id: Cast; label: string }[] = [
  { id: 1, label: "Solo" },
  { id: 2, label: "Duo" },
  { id: 3, label: "Group (3+)" },
];

/** Twists use only {a}, so they fit any cast size. */
export const TWISTS: { id: string; tones: readonly Tone[]; text: string }[] = [
  { id: "liar", tones: ["dramatic", "dark"], text: "Someone {a} trusts has been lying from the start." },
  { id: "clock", tones: ["dramatic", "dark", "funny"], text: "There is a hard deadline: sunrise, and no extensions." },
  { id: "swap", tones: ["funny", "dramatic"], text: "Halfway through, {a} has to argue for the side they started against." },
  { id: "witness", tones: ["funny", "dramatic", "wholesome"], text: "Someone has been watching the whole time and finally speaks up." },
  { id: "debt", tones: ["dramatic", "dark"], text: "{a} owes a favour to the one person who can help." },
  { id: "storm", tones: ["dramatic", "dark", "wholesome"], text: "A storm cuts everyone off, so nobody can leave until it passes." },
  { id: "wrong-name", tones: ["funny", "wholesome"], text: "Everyone keeps mistaking {a} for someone else, and it starts to help." },
  { id: "letter", tones: ["wholesome", "dramatic"], text: "An unopened letter addressed to {a} turns up at the worst moment." },
  { id: "animal", tones: ["funny", "wholesome"], text: "A stubborn animal adopts {a} and refuses to be left behind." },
  { id: "memory", tones: ["dramatic", "dark"], text: "{a} has forgotten one important hour, and someone else remembers it." },
  { id: "double", tones: ["dark", "dramatic"], text: "There are two of something that should only exist once." },
  { id: "price", tones: ["dark", "dramatic"], text: "Getting what they want will cost {a} something they cannot get back." },
  { id: "small-win", tones: ["wholesome"], text: "The real goal turns out to be smaller and kinder than it looked." },
  { id: "rumour", tones: ["funny", "dramatic"], text: "A rumour about {a} spreads faster than the truth can catch up." },
  { id: "rules", tones: ["funny", "dark"], text: "One strange local rule must be obeyed, and nobody will explain why." },
  { id: "old-friend", tones: ["wholesome", "dramatic"], text: "An old friend of {a} shows up on the wrong side of the problem." },
  { id: "silence", tones: ["dark"], text: "The usual sounds stop, all at once, and do not come back." },
  { id: "prize", tones: ["funny", "wholesome"], text: "Winning means getting a prize nobody actually wants." },
  { id: "secret-skill", tones: ["funny", "wholesome", "dramatic"], text: "{a} has a useless-seeming skill that turns out to matter most." },
  { id: "map", tones: ["dramatic", "wholesome", "funny"], text: "The map, notes or directions everyone relies on are wrong in one place." },
  { id: "promise", tones: ["dramatic", "wholesome"], text: "{a} made a promise yesterday that now gets in the way." },
  { id: "rival-help", tones: ["funny", "dramatic", "wholesome"], text: "The only one who can help is the person {a} least wants to ask." },
  { id: "door", tones: ["dark", "dramatic"], text: "A door that was locked a minute ago is now open." },
  { id: "cover", tones: ["funny", "dramatic"], text: "{a} has to keep a cover story going in front of someone who knows them too well." },
  { id: "gift", tones: ["wholesome", "funny"], text: "A small gift arrives with no name on it and changes the mood of the day." },
  { id: "return", tones: ["dark", "dramatic"], text: "Something that was buried, lost or thrown away comes back." },
  { id: "audience", tones: ["funny"], text: "It all has to happen in public, in front of a growing crowd." },
  { id: "kind-stranger", tones: ["wholesome", "dark"], text: "A stranger is far too kind, and {a} cannot tell if that is good news." },
  { id: "choice", tones: ["dramatic", "dark", "wholesome"], text: "Only one of two good things can be saved." },
  { id: "power-out", tones: ["dark", "funny", "dramatic"], text: "The lights, magic or power fail at the exact moment it matters." },
];

export const twistById = (id: string | null | undefined) => TWISTS.find((t) => t.id === id);
export const scenarioById = (id: string | null | undefined) => SCENARIOS.find((s) => s.id === id);
export const modeInfo = (m: Mode) => MODES.find((x) => x.id === m)!;
export const genreLabel = (g: Genre) => GENRES.find((x) => x.id === g)?.label ?? g;
export const toneLabel = (t: Tone) => TONES.find((x) => x.id === t)?.label ?? t;
export const castLabel = (c: Cast) => CASTS.find((x) => x.id === c)?.label ?? String(c);

export const isMode = (v: unknown): v is Mode => MODES.some((m) => m.id === v);
const isGenre = (v: unknown): v is Genre => GENRES.some((g) => g.id === v);
const isTone = (v: unknown): v is Tone => TONES.some((t) => t.id === v);

export interface Filters { mode: Mode; genres: Genre[]; tones: Tone[]; cast: Cast | 0; twist: boolean }
export const DEFAULT_FILTERS: Filters = { mode: "oc", genres: [], tones: [], cast: 0, twist: true };

export interface Roll { scenario: Scenario; twist: string | null }
export interface Names { a: string; b: string; c: string }
export const EMPTY_NAMES: Names = { a: "", b: "", c: "" };
export const MAX_NAME = 30;
const DEFAULT_NAMES: Names = { a: "Character A", b: "Character B", c: "Character C" };

export function pool(f: Filters): Scenario[] {
  return SCENARIOS.filter((s) =>
    s.mode === f.mode
    && (f.genres.length === 0 || f.genres.includes(s.genre))
    && (f.tones.length === 0 || f.tones.includes(s.tone))
    && (f.cast === 0 || s.cast === f.cast));
}

export function rollTwist(tone: Tone, rng: Rng, avoid?: string | null): string {
  const fits = TWISTS.filter((t) => t.tones.includes(tone) && t.id !== avoid);
  return fits[Math.floor(rng() * fits.length)].id;
}

/**
 * Draw one scenario without repeating any in `seen` until the filtered pool is
 * exhausted. With `keepScenario`, only the twist changes. Returns null when the
 * filters match nothing.
 */
export function roll(f: Filters, rng: Rng, seen: readonly string[] = [], prev?: Roll | null, keepScenario = false): { roll: Roll; seen: string[] } | null {
  if (keepScenario && prev) {
    return { roll: { scenario: prev.scenario, twist: f.twist ? rollTwist(prev.scenario.tone, rng, prev.twist) : null }, seen: seen.slice() };
  }
  const p = pool(f);
  if (!p.length) return null;
  const avoid = prev ? [...seen, prev.scenario.id] : seen;
  const out = drawUnique(p, 1, (s) => s.id, p.length > 1 ? avoid : [], rng);
  const scenario = out.picks[0];
  return { roll: { scenario, twist: f.twist ? rollTwist(scenario.tone, rng) : null }, seen: out.used };
}

export function cleanName(input: string): string {
  return input.replace(/[{}<>]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_NAME).trim();
}

/**
 * Put character names into a scenario. With `tags`, {a} and {b} become the
 * {{user}} / {{char}} macros used by Character.AI-style and SillyTavern bots.
 */
export function fill(text: string, names: Names, tags = false): string {
  const name = (k: keyof Names) => {
    if (tags && k === "a") return "{{user}}";
    if (tags && k === "b") return "{{char}}";
    return cleanName(names[k]) || DEFAULT_NAMES[k];
  };
  return text.replace(/\{([abc])\}/g, (_, k: keyof Names) => name(k));
}

export function rollText(r: Roll, names: Names, tags = false, url?: string): string {
  const s = r.scenario;
  const twist = twistById(r.twist);
  const lines = [
    `${modeInfo(s.mode).label} (${[genreLabel(s.genre), toneLabel(s.tone), castLabel(s.cast)].map((l) => l.replace(/^\S+\s/, "")).join(", ")})`,
    fill(s.text, names, tags),
  ];
  if (twist) lines.push(`Twist: ${fill(twist.text, names, tags)}`);
  lines.push(`${modeInfo(s.mode).hookLabel}: ${fill(s.hook, names, tags)}`);
  if (url) lines.push(url);
  return lines.join("\n");
}

// ---------- Share links: the exact scenario, twist and names live in the URL ----------
export function rollToParams(r: Roll, names: Names = EMPTY_NAMES, tags = false): URLSearchParams {
  const p = new URLSearchParams();
  p.set("s", r.scenario.id);
  if (r.twist) p.set("t", r.twist);
  for (const k of ["a", "b", "c"] as const) {
    const n = cleanName(names[k]);
    if (n) p.set(k, n);
  }
  if (tags) p.set("tags", "1");
  return p;
}

export function rollFromParams(p: URLSearchParams): { roll: Roll; names: Names; tags: boolean } | null {
  const scenario = scenarioById(p.get("s"));
  if (!scenario) return null;
  const twist = twistById(p.get("t"))?.id ?? null;
  return {
    roll: { scenario, twist },
    names: { a: cleanName(p.get("a") ?? ""), b: cleanName(p.get("b") ?? ""), c: cleanName(p.get("c") ?? "") },
    tags: p.get("tags") === "1",
  };
}

/** Read filter choices from the URL (?mode=roleplay&genre=fantasy,horror&tone=dark&cast=2). */
export function filtersFromParams(p: URLSearchParams): Filters {
  const list = (key: string) => (p.get(key) ?? "").split(",").filter(Boolean);
  const cast = Number(p.get("cast"));
  const mode = p.get("mode");
  return {
    mode: isMode(mode) ? mode : DEFAULT_FILTERS.mode,
    genres: list("genre").filter(isGenre),
    tones: list("tone").filter(isTone),
    cast: cast === 1 || cast === 2 || cast === 3 ? cast : 0,
    twist: p.get("twist") !== "0",
  };
}

// ---------- Today's scenario ----------
/** UTC day number so everyone gets the same daily scenario on a given day. */
export function dayNumber(date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}
/** Day 1 of the daily scenario (2026-11-16). */
export const DAILY_EPOCH = 20_773;
export function dateLabel(day: number): string {
  return new Date(day * 86_400_000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** Today's scenario rotates OC → roleplay → writing and always has a twist. */
export function dailyRoll(day: number): Roll {
  const mode = MODES[((day % 3) + 3) % 3].id;
  const rng = createRng((day * 2654435761 + 50_113) >>> 0);
  rng(); rng();
  return roll({ ...DEFAULT_FILTERS, mode, twist: true }, rng)!.roll;
}

/** Fixed example rolls for the page (server-rendered, real data). */
export function exampleRoll(seed: number, f: Partial<Filters> = {}): Roll {
  return roll({ ...DEFAULT_FILTERS, ...f }, createRng(seed))!.roll;
}

export function countBy<K extends keyof Scenario>(key: K, value: Scenario[K], mode?: Mode): number {
  return SCENARIOS.filter((s) => s[key] === value && (!mode || s.mode === mode)).length;
}
