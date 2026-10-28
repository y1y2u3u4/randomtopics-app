"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import { sharePokemonImage } from "@/lib/pokemonShareCanvas";
import {
  DEFAULT_FILTERS, GENERATIONS, GEN_REGION, MAX_COUNT, POKEMON, POKEMON_TYPES, TYPE_COLORS,
  dexLabel, drawSlots, drawTeam, filterPokemon, filterSummary, parseShare, rerollOne, resultFromShare, resultsText, shareQuery, teamTypes,
  type Kind, type Mode, type Pokemon, type PokemonFilters, type PokemonType, type Special,
} from "@/lib/pokemon";

const TOOL = "random_pokemon_generator";
const PAGE_URL = "https://randomtopics.app/random-pokemon-generator";
const ACCENT = "var(--neon-yellow)";
const COUNTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24];
const selectClass = "w-full rounded-lg border border-white/15 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--neon-yellow)] focus:outline-none";
const mono = { fontVariantNumeric: "tabular-nums" as const };

function Card({ p, locked, onLock, onReroll }: { p: Pokemon; locked: boolean; onLock: () => void; onReroll: () => void }) {
  const first = TYPE_COLORS[p.types[0]], last = TYPE_COLORS[p.types[p.types.length - 1]];
  return (
    <li
      data-pokemon-card
      className="relative overflow-hidden rounded-2xl border p-3 text-left sm:p-4"
      style={{
        background: `linear-gradient(135deg, ${first.bg} 0%, ${last.bg} 100%)`,
        color: first.text,
        borderColor: locked ? "#fff" : "rgba(255,255,255,0.18)",
        boxShadow: locked ? "0 0 0 2px rgba(255,226,52,0.9)" : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold opacity-80" style={mono}>{dexLabel(p)}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Gen {p.gen}{p.special ? ` · ${p.special}` : ""}</span>
      </div>
      <h3 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5" style={{ filter: "none" }}>
        {p.types.map((t) => <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] font-bold" style={{ background: "rgba(10,10,25,0.78)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>{t}</span>)}
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onLock} aria-pressed={locked} className="rounded-lg border px-2.5 py-1 text-xs font-semibold" style={{ background: locked ? "rgba(10,10,25,0.85)" : "rgba(255,255,255,0.25)", color: locked ? "#FFE234" : "inherit", borderColor: "rgba(10,10,25,0.4)" }}>
          {locked ? "🔒 Locked" : "🔓 Lock"}
        </button>
        <button type="button" onClick={onReroll} aria-label={`Replace ${p.name}`} className="rounded-lg border px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.25)", borderColor: "rgba(10,10,25,0.4)" }}>🎲 Replace</button>
      </div>
    </li>
  );
}

export default function PokemonGenerator() {
  const [filters, setFilters] = useState<PokemonFilters>(DEFAULT_FILTERS);
  const [count, setCount] = useState(6);
  const [mode, setMode] = useState<Mode>("random");
  const [slots, setSlots] = useState<Pokemon[]>([]);
  const [locked, setLocked] = useState<Set<number>>(new Set());
  const [used, setUsed] = useState<string[]>([]);
  const [short, setShort] = useState(false);
  const [balanced, setBalanced] = useState(true);
  const [seed, setSeed] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const started = useRef(false);

  const pool = useMemo(() => filterPokemon(filters).length, [filters]);
  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 1800); };

  const draw = (opts: { f?: PokemonFilters; m?: Mode; n?: number; keepLocks?: boolean; fresh?: boolean } = {}) => {
    const f = opts.f ?? filters, m = opts.m ?? mode, n = opts.n ?? count;
    const s = newSeed();
    const rng = createRng(s);
    if (m === "team") {
      const out = drawTeam(f, rng);
      setSlots(out.team);
      setBalanced(out.balanced);
      setShort(out.team.length < 6);
      setUsed([]);
      setLocked(new Set());
    } else {
      const keep = opts.keepLocks === false ? new Set<number>() : locked;
      const out = drawSlots(slots, keep, n, f, opts.fresh ? [] : used, rng);
      setSlots(out.slots);
      setUsed(out.used);
      setShort(out.short);
      if (opts.keepLocks === false) setLocked(new Set());
    }
    setSeed(s);
    track("generate_success", { tool_type: TOOL, result_count: n, locale: "en", mode: m });
    track(`${TOOL}_use`, { tool_type: TOOL, mode: m, locale: "en" });
  };

  // First visit: show a ready result (or the one a share link describes).
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const shared = parseShare(window.location.search);
    if (shared) {
      /* eslint-disable react-hooks/set-state-in-effect -- apply a share link once after hydration */
      setFilters(shared.filters); setCount(shared.count); setMode(shared.mode);
      setSlots(resultFromShare(shared)); setSeed(shared.seed);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    const s = newSeed();
    setSlots(drawSlots([], new Set(), 6, DEFAULT_FILTERS, [], createRng(s)).slots);
    setSeed(s);
  }, []);

  const change = (next: PokemonFilters, name: string, value: string) => {
    setFilters(next);
    setUsed([]);
    track("filter_select", { tool_type: TOOL, filter_name: name, filter_value: value, locale: "en" });
  };
  const toggleGen = (g: number) => change({ ...filters, gens: filters.gens.includes(g) ? filters.gens.filter((x) => x !== g) : [...filters.gens, g] }, "generation", String(g));
  const toggleType = (t: PokemonType) => change({ ...filters, types: filters.types.includes(t) ? filters.types.filter((x) => x !== t) : [...filters.types, t] }, "type", t);
  const switchMode = (m: Mode) => { setMode(m); setLocked(new Set()); draw({ m, keepLocks: false, fresh: true }); };

  const toggleLock = (dex: number) => {
    setLocked((prev) => { const n = new Set(prev); if (n.has(dex)) n.delete(dex); else n.add(dex); return n; });
  };
  const replace = (i: number) => {
    setSlots(rerollOne(slots, i, filters, createRng(newSeed())));
    setSeed(null);
    track(`${TOOL}_use`, { tool_type: TOOL, mode: "replace", locale: "en" });
  };

  const text = resultsText(slots, mode === "team" ? "My random Pokémon team" : "Random Pokémon");
  const link = seed !== null && locked.size === 0 ? `${PAGE_URL}?${shareQuery({ filters, count, mode, seed })}` : PAGE_URL;
  const copy = async () => {
    if (await copyText(text)) { flash("Copied ✓"); track("copy_result", { tool_type: TOOL, result_count: slots.length, locale: "en" }); }
  };
  const share = async () => {
    const message = `${text}\n${link}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Random Pokémon", text, url: link });
        track("share_click", { tool_type: TOOL, share_method: "native", locale: "en" });
        track(`${TOOL}_share`, { tool_type: TOOL, share_method: "native", locale: "en" });
        return;
      }
    } catch { /* cancelled: fall back to copy */ }
    if (await copyText(message)) {
      flash("Link and list copied ✓");
      track("share_click", { tool_type: TOOL, share_method: "copy_link", locale: "en" });
      track(`${TOOL}_share`, { tool_type: TOOL, share_method: "copy_link", locale: "en" });
    }
  };
  const image = async () => {
    try {
      const r = await sharePokemonImage(slots, mode === "team" ? "My random Pokémon team" : "Random Pokémon", filters);
      flash(r === "shared" ? "Image ready ✓" : "Image downloaded ✓");
      track("share_click", { tool_type: TOOL, share_method: "image", locale: "en" });
      track(`${TOOL}_share`, { tool_type: TOOL, share_method: "image", locale: "en" });
    } catch { flash("Could not create the image"); }
  };

  const chip = (on: boolean) =>
    `rounded-lg border px-2.5 py-1.5 text-sm transition-colors ${on ? "border-[var(--neon-yellow)] bg-[var(--neon-yellow)]/15 text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-yellow)]/50"}`;
  const lockedCount = slots.filter((p) => locked.has(p.dex)).length;
  const covered = teamTypes(slots);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6" data-pokemon-tool>
      <div className="rounded-2xl border p-4 sm:p-6" style={{ borderColor: "rgba(255,226,52,0.3)", background: "rgba(14,14,26,0.7)" }}>
        <div role="group" aria-label="Mode" className="flex gap-2">
          <button type="button" aria-pressed={mode === "random"} className={`${chip(mode === "random")} flex-1`} onClick={() => switchMode("random")}>Random Pokémon</button>
          <button type="button" aria-pressed={mode === "team"} className={`${chip(mode === "team")} flex-1`} onClick={() => switchMode("team")}>Random team of 6</button>
        </div>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          {mode === "random" && (
            <label className="w-28 text-xs text-[var(--text-muted)]">How many
              <select className={`${selectClass} mt-1`} value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {COUNTS.filter((n) => n <= MAX_COUNT).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          )}
          <button
            type="button"
            data-pokemon-generate
            onClick={() => draw()}
            disabled={pool === 0}
            className="min-h-11 flex-1 rounded-xl px-6 py-3 text-base font-extrabold disabled:opacity-40 sm:flex-none"
            style={{ background: ACCENT, color: "#1a1500", fontFamily: "var(--font-display)" }}
          >
            {mode === "team" ? "Build a new team" : lockedCount > 0 ? "Reroll unlocked" : "Generate Pokémon"}
          </button>
        </div>

        <fieldset className="mt-3">
          <legend className="mb-1 text-xs text-[var(--text-muted)]">Generation {filters.gens.length === 0 && "(all)"}</legend>
          <div className="flex flex-wrap gap-1.5">
            {GENERATIONS.map((g) => (
              <button key={g} type="button" aria-pressed={filters.gens.includes(g)} className={chip(filters.gens.includes(g))} onClick={() => toggleGen(g)} title={GEN_REGION[g - 1]}>
                {g}
              </button>
            ))}
            {filters.gens.length > 0 && <button type="button" className="px-2 text-xs text-[var(--text-muted)] underline" onClick={() => change({ ...filters, gens: [] }, "generation", "all")}>clear</button>}
          </div>
        </fieldset>

        <details className="mt-3" open={filters.types.length > 0 || undefined}>
          <summary className="cursor-pointer text-xs text-[var(--text-muted)]">Type {filters.types.length ? `(${filters.types.join(", ")})` : "(any)"} · more filters</summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {POKEMON_TYPES.map((t) => {
              const on = filters.types.includes(t), c = TYPE_COLORS[t];
              return (
                <button key={t} type="button" aria-pressed={on} onClick={() => toggleType(t)} className="rounded-full border px-2.5 py-1 text-xs font-bold"
                  style={on ? { background: c.bg, color: c.text, borderColor: "#fff" } : { background: "transparent", color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.18)" }}>
                  {t}
                </button>
              );
            })}
            {filters.types.length > 0 && <button type="button" className="px-2 text-xs text-[var(--text-muted)] underline" onClick={() => change({ ...filters, types: [] }, "type", "any")}>clear</button>}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--text-muted)]">Typing
              <select className={`${selectClass} mt-1`} value={filters.kind} onChange={(e) => change({ ...filters, kind: e.target.value as Kind }, "kind", e.target.value)}>
                <option value="any">Single or dual type</option>
                <option value="single">Single type only</option>
                <option value="dual">Dual type only</option>
              </select>
            </label>
            <label className="text-xs text-[var(--text-muted)]">Legendary and mythical
              <select className={`${selectClass} mt-1`} value={filters.special} onChange={(e) => change({ ...filters, special: e.target.value as Special }, "legendary", e.target.value)}>
                <option value="any">Include</option>
                <option value="no">Exclude</option>
                <option value="only">Only these</option>
              </select>
            </label>
          </div>
        </details>

        <p className="mt-3 text-xs text-[var(--text-muted)]" style={mono}>
          {pool === 0 ? "No Pokémon match these filters. Clear one." : `${pool} of ${POKEMON.length} Pokémon match · ${filterSummary(filters)}`}
        </p>
      </div>

      {slots.length > 0 && (
        <>
          <ul className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {slots.map((p, i) => <Card key={p.dex} p={p} locked={locked.has(p.dex)} onLock={() => toggleLock(p.dex)} onReroll={() => replace(i)} />)}
          </ul>
          {mode === "team" && (
            <p className="mt-3 text-center text-sm text-[var(--text-secondary)]" data-pokemon-team-note>
              {balanced ? `No shared types: this team covers ${covered.length} different types.` : `Your filters are too narrow for six different types, so some types repeat. This team covers ${covered.length}.`}{" "}
              <span className="text-[var(--text-muted)]">{covered.join(", ")}</span>
            </p>
          )}
          {short && <p className="mt-3 text-center text-sm text-[var(--text-muted)]">Only {slots.length} Pokémon match these filters, so that is all you get.</p>}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={share} className="rounded-lg px-4 py-2 text-sm font-bold" style={{ background: ACCENT, color: "#1a1500" }}>Share link</button>
            <button type="button" onClick={copy} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-white/40">Copy list</button>
            <button type="button" onClick={image} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-white/40">Save image</button>
            <span role="status" className="text-sm text-[var(--neon-green)]">{note}</span>
          </div>
          {mode === "random" && <p className="mt-2 text-center text-xs text-[var(--text-muted)]">Lock a card to keep it, or press Replace on one card. Share links reproduce the exact list (not available while cards are locked).</p>}
        </>
      )}
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]" data-pokemon-disclaimer-short>Unofficial fan tool. Not affiliated with Nintendo, Game Freak or The Pokémon Company. No official artwork is used.</p>
    </section>
  );
}
