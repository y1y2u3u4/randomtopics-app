// Random movie generator: data access, filters, the no-repeat picker and the
// "similar movies" scorer. Everything here is pure (no DOM, no network) so it
// renders on the server, runs in the client and is covered by
// scripts/random-movie-regression.mjs.
import data from "@/data/generators/movies.json";
import { createRng, drawUnique } from "@/lib/randomGenerators";
import type { GeneratorResult } from "@/components/generators/GeneratorUI";

export const GENRE_IDS = [
  "action", "adventure", "animation", "comedy", "crime", "documentary", "drama", "family", "fantasy",
  "horror", "musical", "mystery", "romance", "sci-fi", "thriller", "war", "western",
] as const;
export type Genre = (typeof GENRE_IDS)[number];

export const GENRES: Record<Genre, { label: string; emoji: string; color: string }> = {
  action: { label: "Action", emoji: "💥", color: "#ff5a5f" },
  adventure: { label: "Adventure", emoji: "🧭", color: "#ffb347" },
  animation: { label: "Animation", emoji: "🎨", color: "#ff8bd1" },
  comedy: { label: "Comedy", emoji: "😂", color: "#ffd84d" },
  crime: { label: "Crime", emoji: "🕵️", color: "#9aa5b1" },
  documentary: { label: "Documentary", emoji: "🎥", color: "#7bdcb5" },
  drama: { label: "Drama", emoji: "🎭", color: "#b39ddb" },
  family: { label: "Family", emoji: "👨‍👩‍👧", color: "#8ee07a" },
  fantasy: { label: "Fantasy", emoji: "🧙", color: "#c08cff" },
  horror: { label: "Horror", emoji: "👻", color: "#e0484e" },
  musical: { label: "Musical", emoji: "🎶", color: "#ff9ff3" },
  mystery: { label: "Mystery", emoji: "🔍", color: "#6c8cff" },
  romance: { label: "Romance", emoji: "💘", color: "#ff7aa8" },
  "sci-fi": { label: "Sci-fi", emoji: "🚀", color: "#00e5ff" },
  thriller: { label: "Thriller", emoji: "😰", color: "#f08a24" },
  war: { label: "War", emoji: "🎖️", color: "#a3a86b" },
  western: { label: "Western", emoji: "🤠", color: "#d29a5c" },
};

export type Band = "acclaimed" | "well-liked" | "mixed";
export const BANDS: Record<Band, { label: string; rank: number; note: string }> = {
  acclaimed: { label: "Acclaimed", rank: 3, note: "Widely praised by critics; often on best-of lists or major award winners." },
  "well-liked": { label: "Well-liked", rank: 2, note: "Mostly positive reviews and a lasting audience." },
  mixed: { label: "Mixed", rank: 1, note: "Divided reviews, but popular enough to be worth a look." },
};

export type Audience = "family" | "teen" | "mature";
export const AUDIENCES: Record<Audience, { label: string; note: string }> = {
  family: { label: "Family-friendly", note: "Generally fine for kids (roughly G/PG)." },
  teen: { label: "Teens & up", note: "Some intensity, language or themes (roughly PG-13)." },
  mature: { label: "Mature", note: "Adult content (roughly R)." },
};

export const PLATFORM_IDS = ["netflix", "prime", "apple", "disney", "max", "hulu"] as const;
export type Platform = (typeof PLATFORM_IDS)[number];
export const PLATFORMS: Record<Platform, string> = {
  netflix: "Netflix",
  prime: "Prime Video",
  apple: "Apple TV+",
  disney: "Disney+",
  max: "Max (HBO)",
  hulu: "Hulu",
};

export interface Movie {
  slug: string;
  title: string;
  year: number;
  genres: Genre[];
  /** Minutes, theatrical cut. */
  runtime: number;
  director: string;
  /** Editorial reception band, not a copied score. */
  band: Band;
  audience: Audience;
  kidSafe: boolean;
  /** Set only when the film was produced or released as a streaming original. */
  platform: Platform | null;
  /** In-house, spoiler-free, at most 25 words. */
  premise: string;
}

export const MOVIES = data as Movie[];
const BY_SLUG = new Map(MOVIES.map((m) => [m.slug, m]));

export const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020] as const;
export const decadeOf = (m: Pick<Movie, "year">) => Math.floor(m.year / 10) * 10;
export const decadeLabel = (d: number) => `${d}s`;

export type RuntimeBand = "short" | "medium" | "long";
export const RUNTIMES: Record<RuntimeBand, string> = {
  short: "Under 100 min",
  medium: "100–130 min",
  long: "Over 130 min",
};
export function runtimeBand(minutes: number): RuntimeBand {
  if (minutes < 100) return "short";
  return minutes <= 130 ? "medium" : "long";
}
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/** "any", every streaming original, or originals of one platform. */
export type PlatformFilter = "any" | "originals" | Platform;

export interface MovieFilters {
  genres: Genre[];
  decades: number[];
  /** Minimum reception band. */
  minBand: "any" | "well-liked" | "acclaimed";
  runtimes: RuntimeBand[];
  platform: PlatformFilter;
  familyOnly: boolean;
}

export const DEFAULT_FILTERS: MovieFilters = { genres: [], decades: [], minBand: "any", runtimes: [], platform: "any", familyOnly: false };

/** Multi-select groups are OR within a group and AND across groups. */
export function matches(m: Movie, f: MovieFilters): boolean {
  if (f.genres.length && !f.genres.some((g) => m.genres.includes(g))) return false;
  if (f.decades.length && !f.decades.includes(decadeOf(m))) return false;
  if (f.minBand !== "any" && BANDS[m.band].rank < BANDS[f.minBand].rank) return false;
  if (f.runtimes.length && !f.runtimes.includes(runtimeBand(m.runtime))) return false;
  if (f.platform === "originals" && !m.platform) return false;
  if (f.platform !== "any" && f.platform !== "originals" && m.platform !== f.platform) return false;
  if (f.familyOnly && !m.kidSafe) return false;
  return true;
}

export function filterMovies(f: MovieFilters, movies: readonly Movie[] = MOVIES): Movie[] {
  return movies.filter((m) => matches(m, f));
}

export interface PickResult {
  movie: Movie | null;
  /** Slugs shown in the current cycle, pass back in for the next pick. */
  used: string[];
  /** True when every matching film had been shown and the cycle restarted. */
  cycled: boolean;
}

/**
 * Pick one film matching the filters, never repeating a film until every
 * match has been shown once (the `used` list carries the history).
 */
export function pickMovie(f: MovieFilters, used: readonly string[], seed: number): PickResult {
  const out = drawUnique(filterMovies(f), 1, (m) => m.slug, used, createRng(seed));
  return { movie: out.picks[0] ?? null, used: out.used, cycled: out.cycled };
}

/** Several distinct films at once (used for the server-rendered examples). */
export function pickMovies(f: MovieFilters, count: number, seed: number): Movie[] {
  return drawUnique(filterMovies(f), count, (m) => m.slug, [], createRng(seed)).picks;
}

const LIGHT: ReadonlySet<Genre> = new Set(["comedy", "family", "animation", "musical", "romance"]);
const DARK: ReadonlySet<Genre> = new Set(["horror", "thriller", "crime", "war"]);

/** -1 (dark) … +1 (light), from the genre mix. */
export function tone(m: Pick<Movie, "genres">): number {
  let t = 0;
  for (const g of m.genres) t += LIGHT.has(g) ? 1 : DARK.has(g) ? -1 : 0;
  return t / m.genres.length;
}

const AUDIENCE_RANK: Record<Audience, number> = { family: 0, teen: 1, mature: 2 };

/** Higher = more similar. Used by similarMovies; exported for tests. */
export function similarity(a: Movie, b: Movie): number {
  const shared = a.genres.filter((g) => b.genres.includes(g)).length;
  const union = new Set([...a.genres, ...b.genres]).size;
  let score = (shared / union) * 10;
  if (a.genres[0] === b.genres[0]) score += 2;
  score += Math.max(0, 3 - Math.abs(a.year - b.year) / 10);
  score += 2 - Math.abs(BANDS[a.band].rank - BANDS[b.band].rank);
  score += 2 * (1 - Math.abs(tone(a) - tone(b)) / 2);
  const gap = Math.abs(AUDIENCE_RANK[a.audience] - AUDIENCE_RANK[b.audience]);
  score += gap === 0 ? 2 : gap === 1 ? 0 : -3;
  // A kid-safe pick should only lead to kid-safe suggestions.
  if (a.kidSafe && !b.kidSafe) score -= 20;
  if (a.director === b.director) score += 1;
  return score;
}

/**
 * The `count` most similar films: genre overlap, era, tone, reception and
 * audience. Never the film itself or a same-titled remake; at most one other
 * film by the same director so the list stays varied. Deterministic.
 */
export function similarMovies(movie: Movie, count = 3, pool: readonly Movie[] = MOVIES): Movie[] {
  const ranked = pool
    .filter((m) => m.slug !== movie.slug && m.title !== movie.title)
    .map((m) => ({ m, s: similarity(movie, m) }))
    .sort((x, y) => y.s - x.s || x.m.slug.localeCompare(y.m.slug));
  const out: Movie[] = [];
  const directors = new Map<string, number>();
  for (const { m } of ranked) {
    if ((directors.get(m.director) ?? 0) >= 1) continue;
    out.push(m);
    directors.set(m.director, (directors.get(m.director) ?? 0) + 1);
    if (out.length >= count) break;
  }
  return out;
}

export function movieBySlug(slug: string): Movie | null {
  return BY_SLUG.get(slug) ?? null;
}

/** Read `?movie=<slug>` safely; unknown or malformed values return null. */
export function movieFromSearch(search: string): Movie | null {
  const raw = new URLSearchParams(search).get("movie");
  if (!raw || !/^[a-z0-9-]{1,90}$/.test(raw)) return null;
  return movieBySlug(raw);
}

export function shareUrl(origin: string, path: string, slug: string): string {
  return `${origin}${path}?movie=${encodeURIComponent(slug)}`;
}

/** Availability changes by country and month, so link to a live search instead of claiming a service. */
export function justWatchUrl(m: Pick<Movie, "title">): string {
  return `https://www.justwatch.com/us/search?q=${encodeURIComponent(m.title)}`;
}

export function originalLabel(m: Pick<Movie, "platform">): string | null {
  return m.platform ? `${PLATFORMS[m.platform]} original` : null;
}

export function movieSummary(m: Movie): string {
  const genres = m.genres.map((g) => GENRES[g].label).join(", ");
  return `${m.title} (${m.year}) · ${genres} · ${formatRuntime(m.runtime)} · dir. ${m.director}`;
}

/** Shape used by GeneratorExamples on the server-rendered page. */
export function movieToResult(m: Movie): GeneratorResult {
  return {
    key: m.slug,
    title: `${m.title} (${m.year})`,
    subtitle: `${m.genres.map((g) => GENRES[g].label).join(" · ")} · ${formatRuntime(m.runtime)} · ${BANDS[m.band].label}`,
    detail: m.premise,
    emoji: GENRES[m.genres[0]].emoji,
  };
}

/** Per-genre / per-decade / per-platform counts, for copy and validation. */
export function movieStats(movies: readonly Movie[] = MOVIES) {
  const genres = Object.fromEntries(GENRE_IDS.map((g) => [g, 0])) as Record<Genre, number>;
  const decades = Object.fromEntries(DECADES.map((d) => [d, 0])) as Record<number, number>;
  const platforms = Object.fromEntries(PLATFORM_IDS.map((p) => [p, 0])) as Record<Platform, number>;
  for (const m of movies) {
    for (const g of m.genres) genres[g]++;
    decades[decadeOf(m)] = (decades[decadeOf(m)] ?? 0) + 1;
    if (m.platform) platforms[m.platform]++;
  }
  return { total: movies.length, genres, decades, platforms, kidSafe: movies.filter((m) => m.kidSafe).length };
}
