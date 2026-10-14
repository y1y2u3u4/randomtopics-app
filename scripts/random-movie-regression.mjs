// Unit tests for /random-movie-generator: data validation, filters, the
// no-repeat picker, similar-movie scoring and share-link round trips.
// Run: node scripts/random-movie-regression.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const movies = JSON.parse(readFileSync(resolve(root, "src/data/generators/movies.json"), "utf8"));
const mv = load("src/lib/generators/movies.ts", { "@/data/generators/movies.json": movies });

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
};
const F = (over = {}) => ({ ...mv.DEFAULT_FILTERS, ...over });

/* ---------------- data ---------------- */

const FIELDS = ["slug", "title", "year", "genres", "runtime", "director", "band", "audience", "kidSafe", "platform", "premise"];

test("at least 500 films, every field present and well-typed", () => {
  assert.ok(movies.length >= 500, `only ${movies.length} films`);
  for (const m of movies) {
    assert.deepEqual(Object.keys(m).sort(), [...FIELDS].sort(), m.slug);
    assert.match(m.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, m.slug);
    assert.ok(m.title.trim() && m.director.trim(), m.slug);
    assert.ok(Number.isInteger(m.year) && m.year >= 1950 && m.year <= 2025, `${m.slug} year`);
    assert.ok(Number.isInteger(m.runtime) && m.runtime >= 60 && m.runtime <= 240, `${m.slug} runtime ${m.runtime}`);
    assert.ok(m.genres.length >= 1 && m.genres.length <= 3, `${m.slug} genres`);
    assert.equal(new Set(m.genres).size, m.genres.length, `${m.slug} duplicate genre`);
    for (const g of m.genres) assert.ok(mv.GENRE_IDS.includes(g), `${m.slug} genre ${g}`);
    assert.ok(Object.hasOwn(mv.BANDS, m.band), `${m.slug} band`);
    assert.ok(Object.hasOwn(mv.AUDIENCES, m.audience), `${m.slug} audience`);
    assert.equal(m.kidSafe, m.audience === "family", `${m.slug} kidSafe`);
    assert.ok(m.platform === null || mv.PLATFORM_IDS.includes(m.platform), `${m.slug} platform`);
    const words = m.premise.trim().split(/\s+/).length;
    assert.ok(words >= 6 && words <= 25, `${m.slug} premise has ${words} words`);
    assert.match(m.premise, /[.!?]$/, `${m.slug} premise punctuation`);
  }
});

test("no duplicate slugs or title+year pairs", () => {
  assert.equal(new Set(movies.map((m) => m.slug)).size, movies.length);
  assert.equal(new Set(movies.map((m) => `${m.title}|${m.year}`)).size, movies.length);
});

test("every genre has ≥ 15 films and every decade ≥ 20", () => {
  const s = mv.movieStats();
  for (const g of mv.GENRE_IDS) assert.ok(s.genres[g] >= 15, `${g}: ${s.genres[g]}`);
  for (const d of mv.DECADES) assert.ok(s.decades[d] >= 20, `${d}s: ${s.decades[d]}`);
  for (const p of mv.PLATFORM_IDS) assert.ok(s.platforms[p] >= 3, `${p} originals: ${s.platforms[p]}`);
  assert.ok(s.kidSafe >= 60, `kid-safe: ${s.kidSafe}`);
});

test("streaming originals are recent (streaming era) films", () => {
  for (const m of movies.filter((x) => x.platform)) assert.ok(m.year >= 2008, `${m.slug} ${m.year}`);
});

/* ---------------- filters ---------------- */

test("filters are OR within a group and AND across groups", () => {
  const horrorOr80s = mv.filterMovies(F({ genres: ["horror", "western"] }));
  assert.ok(horrorOr80s.every((m) => m.genres.includes("horror") || m.genres.includes("western")));
  const combo = mv.filterMovies(F({ genres: ["comedy"], decades: [1980, 1990], runtimes: ["short"], minBand: "acclaimed" }));
  assert.ok(combo.length > 0);
  for (const m of combo) {
    assert.ok(m.genres.includes("comedy"));
    assert.ok([1980, 1990].includes(mv.decadeOf(m)));
    assert.ok(m.runtime < 100);
    assert.equal(m.band, "acclaimed");
  }
  assert.equal(mv.filterMovies(F()).length, movies.length);
});

test("reception is a minimum band", () => {
  const wl = mv.filterMovies(F({ minBand: "well-liked" }));
  assert.ok(wl.every((m) => m.band !== "mixed"));
  assert.ok(wl.some((m) => m.band === "acclaimed") && wl.some((m) => m.band === "well-liked"));
});

test("runtime bands have clean edges", () => {
  assert.equal(mv.runtimeBand(99), "short");
  assert.equal(mv.runtimeBand(100), "medium");
  assert.equal(mv.runtimeBand(130), "medium");
  assert.equal(mv.runtimeBand(131), "long");
  assert.equal(mv.formatRuntime(142), "2h 22m");
  assert.equal(mv.formatRuntime(90), "1h 30m");
});

test("platform filters only return that platform's originals", () => {
  const all = mv.filterMovies(F({ platform: "originals" }));
  assert.ok(all.length >= 20 && all.every((m) => m.platform));
  for (const p of mv.PLATFORM_IDS) {
    const only = mv.filterMovies(F({ platform: p }));
    assert.ok(only.length > 0 && only.every((m) => m.platform === p), p);
  }
});

test("family-only returns kid-safe films for every genre that has any", () => {
  const fam = mv.filterMovies(F({ familyOnly: true }));
  assert.ok(fam.length > 0 && fam.every((m) => m.kidSafe));
  assert.equal(mv.filterMovies(F({ familyOnly: true, genres: ["horror"], decades: [1970] })).filter((m) => !m.kidSafe).length, 0);
});

/* ---------------- picker ---------------- */

test("pick another never repeats until every match has been shown", () => {
  const filters = F({ genres: ["western"] });
  const pool = mv.filterMovies(filters).map((m) => m.slug);
  let used = [];
  const seen = [];
  for (let i = 0; i < pool.length; i++) {
    const out = mv.pickMovie(filters, used, 1000 + i);
    assert.ok(out.movie && mv.matches(out.movie, filters));
    assert.ok(!seen.includes(out.movie.slug), `repeat ${out.movie.slug} at ${i}`);
    seen.push(out.movie.slug);
    used = out.used;
  }
  assert.deepEqual([...seen].sort(), [...pool].sort());
  const next = mv.pickMovie(filters, used, 99);
  assert.equal(next.cycled, true);
  assert.ok(next.movie);
});

test("picks are deterministic by seed and empty filters return null", () => {
  assert.equal(mv.pickMovie(F(), [], 42).movie.slug, mv.pickMovie(F(), [], 42).movie.slug);
  const none = mv.pickMovie(F({ platform: "disney", genres: ["horror"] }), [], 1);
  assert.equal(none.movie, null);
  assert.equal(mv.pickMovies(F({ familyOnly: true }), 3, 7).length, 3);
});

test("history from other filters doesn't block a fresh pick", () => {
  const used = mv.filterMovies(F({ genres: ["comedy"] })).map((m) => m.slug);
  const out = mv.pickMovie(F({ genres: ["comedy"] }), used, 5);
  assert.ok(out.movie, "cycle restarts instead of returning nothing");
});

/* ---------------- similar movies ---------------- */

test("similar movies: 3 results, never the film itself or a same-titled remake", () => {
  for (const m of movies) {
    const sim = mv.similarMovies(m, 3);
    assert.equal(sim.length, 3, m.slug);
    assert.ok(sim.every((s) => s.slug !== m.slug && s.title !== m.title), m.slug);
    assert.equal(new Set(sim.map((s) => s.slug)).size, 3, m.slug);
    assert.ok(new Set(sim.map((s) => s.director)).size === 3, `${m.slug} repeats a director`);
    if (m.kidSafe) assert.ok(sim.every((s) => s.kidSafe), `${m.slug} family pick suggested non-family films`);
    assert.ok(sim.every((s) => s.genres.some((g) => m.genres.includes(g))), `${m.slug} suggestion shares no genre`);
  }
});

test("similar movies are sensible for known films", () => {
  const toyStory = mv.movieBySlug("toy-story");
  assert.ok(mv.similarMovies(toyStory).every((s) => s.genres.includes("animation")));
  const alien = mv.movieBySlug("alien");
  assert.ok(mv.similarMovies(alien).every((s) => s.genres.includes("sci-fi") || s.genres.includes("horror")));
  assert.deepEqual(mv.similarMovies(alien).map((s) => s.slug), mv.similarMovies(alien).map((s) => s.slug));
});

/* ---------------- share links ---------------- */

test("share slug round-trips through the URL", () => {
  for (const m of movies) {
    const url = new URL(mv.shareUrl("https://randomtopics.app", "/random-movie-generator", m.slug));
    assert.equal(url.pathname, "/random-movie-generator");
    assert.equal(mv.movieFromSearch(url.search)?.slug, m.slug);
  }
  assert.equal(mv.movieFromSearch("?movie=not-a-real-film"), null);
  assert.equal(mv.movieFromSearch("?movie=<script>"), null);
  assert.equal(mv.movieFromSearch(""), null);
});

test("where-to-watch is a JustWatch search, never a service claim", () => {
  const m = mv.movieBySlug("the-good-the-bad-and-the-ugly");
  assert.equal(mv.justWatchUrl(m), "https://www.justwatch.com/us/search?q=The%20Good%2C%20the%20Bad%20and%20the%20Ugly");
  assert.equal(mv.originalLabel(m), null);
  assert.equal(mv.originalLabel(mv.movieBySlug("roma")), "Netflix original");
});

test("example results carry title, subtitle and premise", () => {
  const r = mv.movieToResult(mv.movieBySlug("jaws"));
  assert.equal(r.title, "Jaws (1975)");
  assert.match(r.subtitle, /Thriller/);
  assert.ok(r.detail.length > 20);
});

console.log(`✓ random movie generator: ${passed} tests passed (${movies.length} films)`);
