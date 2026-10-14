"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { copyText, shareText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";
import {
  AUDIENCES, BANDS, DECADES, DEFAULT_FILTERS, GENRES, GENRE_IDS, PLATFORMS, PLATFORM_IDS, RUNTIMES,
  decadeLabel, filterMovies, formatRuntime, justWatchUrl, movieFromSearch, movieSummary, originalLabel,
  pickMovie, pickMovies, shareUrl, similarMovies,
  type Genre, type Movie, type MovieFilters, type PlatformFilter, type RuntimeBand,
} from "@/lib/generators/movies";

const TOOL = "random_movie_generator";
const PATH = "/random-movie-generator";
const HISTORY = 6;

const chip = (active: boolean) =>
  `text-sm px-3 py-1.5 rounded-lg border transition-all ${
    active
      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
      : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
  }`;
const ghostBtn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)]";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

// Deterministic first card so the server HTML already shows a real pick.
const SAMPLE = pickMovies(DEFAULT_FILTERS, 1, 20261014)[0];

export default function MovieGenerator() {
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS);
  const [movie, setMovie] = useState<Movie>(SAMPLE);
  const [isSample, setIsSample] = useState(true);
  const [used, setUsed] = useState<string[]>([]);
  const [history, setHistory] = useState<Movie[]>([]);
  const [flash, setFlash] = useState<"" | "copy" | "share">("");
  const [manual, setManual] = useState<string | null>(null);

  const writeUrl = useCallback((slug: string) => {
    window.history.replaceState(null, "", `${window.location.pathname}?movie=${encodeURIComponent(slug)}`);
  }, []);

  const show = useCallback((next: Movie, source: "pick" | "similar" | "history" | "shared") => {
    setMovie(next);
    setIsSample(false);
    setManual(null);
    setHistory((h) => [next, ...h.filter((m) => m.slug !== next.slug)].slice(0, HISTORY));
    setUsed((u) => (u.includes(next.slug) ? u : [...u, next.slug]));
    if (source !== "shared") writeUrl(next.slug);
  }, [writeUrl]);

  // Restore a shared pick (?movie=<slug>) once, after mount.
  useEffect(() => {
    const shared = movieFromSearch(window.location.search);
    if (!shared) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from the URL
    show(shared, "shared");
    track("shared_result_open", { tool_type: TOOL, locale: "en" });
  }, [show]);

  const matching = useMemo(() => filterMovies(filters).length, [filters]);
  const similar = useMemo(() => similarMovies(movie, 3), [movie]);

  const pick = useCallback(() => {
    if (matching === 0) return;
    track("generate_start", { tool_type: TOOL, requested_count: 1, locale: "en" });
    const out = pickMovie(filters, used, newSeed());
    if (!out.movie) return;
    setUsed(out.used);
    show(out.movie, "pick");
    track("generate_success", { tool_type: TOOL, result_count: 1, result_source: "editorial_pool", locale: "en", cycled: out.cycled });
  }, [filters, matching, used, show]);

  const update = useCallback((name: string, value: string, next: (f: MovieFilters) => MovieFilters) => {
    setFilters((f) => next(f));
    track("filter_select", { tool_type: TOOL, filter_name: name, filter_value: value || "all", locale: "en" });
  }, []);

  const feedback = (kind: "copy" | "share") => {
    setFlash(kind);
    window.setTimeout(() => setFlash(""), 1600);
  };

  const link = () => shareUrl(window.location.origin, PATH, movie.slug);

  const doCopy = async () => {
    const url = link();
    if (await copyText(url)) {
      setManual(null);
      feedback("copy");
      track("share_click", { tool_type: TOOL, locale: "en", share_method: "copy_link" });
    } else {
      setManual(url);
      track("copy_error", { tool_type: TOOL, locale: "en" });
    }
  };

  const doShare = async () => {
    const result = await shareText({ title: `${movie.title} (${movie.year})`, text: `Movie pick: ${movieSummary(movie)}`, url: link() });
    if (result.status === "aborted") return;
    if (result.status === "failed") {
      setManual(result.fallbackText);
      track("share_error", { tool_type: TOOL, locale: "en" });
      return;
    }
    setManual(null);
    feedback("share");
    track("share_result", { tool_type: TOOL, locale: "en", share_method: result.method });
  };

  const accent = GENRES[movie.genres[0]].color;
  const original = originalLabel(movie);
  const active = filters.genres.length + filters.decades.length + filters.runtimes.length
    + (filters.minBand !== "any" ? 1 : 0) + (filters.platform !== "any" ? 1 : 0) + (filters.familyOnly ? 1 : 0);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <FilterRow label="Genre">
          <button type="button" onClick={() => update("genre", "", (f) => ({ ...f, genres: [] }))} className={chip(filters.genres.length === 0)} aria-pressed={filters.genres.length === 0}>Any</button>
          {GENRE_IDS.map((g: Genre) => (
            <button key={g} type="button" onClick={() => update("genre", g, (f) => ({ ...f, genres: toggle(f.genres, g) }))} className={chip(filters.genres.includes(g))} aria-pressed={filters.genres.includes(g)}>
              <span aria-hidden="true">{GENRES[g].emoji}</span> {GENRES[g].label}
            </button>
          ))}
        </FilterRow>
        <FilterRow label="Decade">
          <button type="button" onClick={() => update("decade", "", (f) => ({ ...f, decades: [] }))} className={chip(filters.decades.length === 0)} aria-pressed={filters.decades.length === 0}>Any</button>
          {DECADES.map((d) => (
            <button key={d} type="button" onClick={() => update("decade", String(d), (f) => ({ ...f, decades: toggle(f.decades, d) }))} className={chip(filters.decades.includes(d))} aria-pressed={filters.decades.includes(d)}>
              {decadeLabel(d)}
            </button>
          ))}
        </FilterRow>
        <FilterRow label="Critic reception">
          {([["any", "Any"], ["well-liked", "Well-liked or better"], ["acclaimed", "Acclaimed only"]] as const).map(([v, l]) => (
            <button key={v} type="button" onClick={() => update("reception", v, (f) => ({ ...f, minBand: v }))} className={chip(filters.minBand === v)} aria-pressed={filters.minBand === v}>{l}</button>
          ))}
        </FilterRow>
        <FilterRow label="Runtime">
          <button type="button" onClick={() => update("runtime", "", (f) => ({ ...f, runtimes: [] }))} className={chip(filters.runtimes.length === 0)} aria-pressed={filters.runtimes.length === 0}>Any</button>
          {(Object.keys(RUNTIMES) as RuntimeBand[]).map((r) => (
            <button key={r} type="button" onClick={() => update("runtime", r, (f) => ({ ...f, runtimes: toggle(f.runtimes, r) }))} className={chip(filters.runtimes.includes(r))} aria-pressed={filters.runtimes.includes(r)}>{RUNTIMES[r]}</button>
          ))}
        </FilterRow>
        <FilterRow label="Where to stream · streaming originals">
          {(["any", "originals", ...PLATFORM_IDS] as PlatformFilter[]).map((p) => {
            const label = p === "any" ? "Any film" : p === "originals" ? "All streaming originals" : `${PLATFORMS[p]} originals`;
            return (
              <button key={p} type="button" onClick={() => update("platform", p, (f) => ({ ...f, platform: p }))} className={chip(filters.platform === p)} aria-pressed={filters.platform === p}>{label}</button>
            );
          })}
        </FilterRow>
        <p className="-mt-2 mb-4 text-xs text-[var(--text-muted)]">
          These filter films made or released <em>as</em> a service&apos;s own original. Streaming catalogs change by country and month, so we
          never claim a film is on a service right now — use &quot;Where to watch&quot; for live availability.
        </p>
        <FilterRow label="Audience">
          <button type="button" onClick={() => update("family", filters.familyOnly ? "off" : "on", (f) => ({ ...f, familyOnly: !f.familyOnly }))} className={chip(filters.familyOnly)} aria-pressed={filters.familyOnly}>
            <span aria-hidden="true">👨‍👩‍👧</span> Family-friendly only
          </button>
        </FilterRow>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button type="button" onClick={pick} disabled={matching === 0} className="btn-generate disabled:opacity-40">
            <span aria-hidden="true">🎬</span> {isSample ? "Pick a movie" : "Pick another"}
          </button>
          {active > 0 && (
            <button type="button" onClick={() => update("reset", "", () => DEFAULT_FILTERS)} className="text-xs text-[var(--text-muted)] underline hover:text-[var(--neon-cyan)]">
              Clear {active} filter{active > 1 ? "s" : ""}
            </button>
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3" aria-live="polite">
          {matching === 0
            ? "No film matches all of these filters — clear one to see picks."
            : `${matching.toLocaleString("en-US")} films match · no repeats until you've seen them all`}
        </p>

        <article aria-live="polite" data-generator-results className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="flex items-center gap-4 p-5 sm:p-6" style={{ background: `linear-gradient(135deg, ${accent}33, transparent 70%)` }}>
            <span className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl text-4xl sm:text-5xl" style={{ background: `${accent}22`, border: `1px solid ${accent}55` }} aria-hidden="true">
              {GENRES[movie.genres[0]].emoji}
            </span>
            <div className="min-w-0">
              {isSample && <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Sample pick — press the button for yours</p>}
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] break-words" style={{ fontFamily: "var(--font-display)" }}>
                {movie.title} <span className="text-[var(--text-muted)] font-normal">({movie.year})</span>
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {formatRuntime(movie.runtime)} · Directed by {movie.director}
              </p>
            </div>
          </div>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <ul className="flex flex-wrap gap-2 mb-3" aria-label="Genres and ratings">
              {movie.genres.map((g) => (
                <li key={g} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-[var(--text-secondary)]">{GENRES[g].emoji} {GENRES[g].label}</li>
              ))}
              <li className="text-xs px-2.5 py-1 rounded-full border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]" title={BANDS[movie.band].note}>★ {BANDS[movie.band].label}</li>
              <li className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-[var(--text-secondary)]" title={AUDIENCES[movie.audience].note}>{AUDIENCES[movie.audience].label}</li>
              {original && <li className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-[var(--text-secondary)]">{original}</li>}
            </ul>
            <p className="text-base text-[var(--text-primary)] leading-relaxed">{movie.premise}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={justWatchUrl(movie)} target="_blank" rel="noopener noreferrer nofollow" className={ghostBtn}
                onClick={() => track("outbound_click", { tool_type: TOOL, locale: "en", link_target: "justwatch" })}>
                📺 Where to watch <span className="sr-only">(opens JustWatch in a new tab)</span>
              </a>
              <button type="button" onClick={doCopy} className={ghostBtn}>{flash === "copy" ? "Link copied ✓" : "🔗 Copy link"}</button>
              <button type="button" onClick={doShare} className={ghostBtn}>{flash === "share" ? "Shared ✓" : "↗ Share"}</button>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              &quot;Where to watch&quot; opens a live JustWatch search (US){original ? ` — even originals can leave a service or differ by country` : ""}.
            </p>
            {manual && (
              <label className="mt-3 block text-xs text-[var(--text-muted)]">
                Copy this link manually:
                <input readOnly value={manual} onFocus={(e) => e.currentTarget.select()} className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]" />
              </label>
            )}
          </div>
        </article>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">If you like {movie.title}, try</h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {similar.map((s) => (
              <li key={s.slug}>
                <button type="button"
                  onClick={() => { show(s, "similar"); track("similar_click", { tool_type: TOOL, locale: "en" }); }}
                  className="h-full w-full text-left rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-[var(--neon-cyan)]/40 transition-colors">
                  <span className="block text-sm font-semibold text-[var(--text-primary)]"><span aria-hidden="true">{GENRES[s.genres[0]].emoji} </span>{s.title} <span className="text-[var(--text-muted)] font-normal">({s.year})</span></span>
                  <span className="block text-xs text-[var(--text-muted)] mt-0.5">{s.genres.map((g) => GENRES[g].label).join(" · ")} · {formatRuntime(s.runtime)}</span>
                  <span className="block text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{s.premise}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {history.length > 1 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Recently picked</p>
            <div className="flex flex-wrap gap-2">
              {history.slice(1).map((h) => (
                <button key={h.slug} type="button" onClick={() => show(h, "history")} className={chip(false)}>
                  {h.title} ({h.year})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
