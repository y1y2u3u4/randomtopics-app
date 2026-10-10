"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";

export interface GeneratorResult {
  /** Stable, URL-safe-ish key that `resolve` can turn back into the result. */
  key: string;
  title: string;
  subtitle?: string;
  detail?: string;
  image?: string;
  emoji?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  /** Multi-select chips (empty = all) vs a single choice (first option = default). */
  multi?: boolean;
}

export type FilterState = Record<string, string[]>;

export interface GeneratorStrings {
  generate: string;
  again: string;
  copy: string;
  copied: string;
  share: string;
  shared: string;
  all: string;
  howMany: string;
  empty: string;
  poolSize: (n: number) => string;
  noMatch: string;
}

export const GENERATOR_STRINGS_EN: GeneratorStrings = {
  generate: "Generate",
  again: "Generate again",
  copy: "Copy results",
  copied: "Copied ✓",
  share: "Copy share link",
  shared: "Link copied ✓",
  all: "All",
  howMany: "How many",
  empty: "Pick your filters (or leave them on All) and press Generate.",
  poolSize: (n) => `${n.toLocaleString("en-US")} possible results · no repeats until you've seen them all`,
  noMatch: "Nothing matches these filters — clear one to see results.",
};

export const GENERATOR_STRINGS_ES: GeneratorStrings = {
  generate: "Generar",
  again: "Generar otra vez",
  copy: "Copiar resultados",
  copied: "Copiado ✓",
  share: "Copiar enlace",
  shared: "Enlace copiado ✓",
  all: "Todos",
  howMany: "Cuántos",
  empty: "Elige tus filtros (o déjalos en Todos) y pulsa Generar.",
  poolSize: (n) => `${n.toLocaleString("es-ES")} resultados posibles · sin repetir hasta verlos todos`,
  noMatch: "Ningún resultado coincide con estos filtros — quita alguno.",
};

export interface GeneratorUIProps {
  toolType: string;
  locale: "en" | "es";
  strings: GeneratorStrings;
  filters: FilterGroup[];
  counts: number[];
  defaultCount: number;
  /** Number of distinct results for the current filters (for the hint line). */
  poolSize: (filters: FilterState) => number;
  generate: (filters: FilterState, count: number, used: string[], seed: number) => { results: GeneratorResult[]; used: string[] };
  resolve: (key: string, filters: FilterState) => GeneratorResult | null;
  /** Bigger cards with images (animals) vs compact name rows. */
  layout?: "cards" | "list";
  /** Optional extra action rendered next to Copy, e.g. a link to a related tool. */
  footer?: React.ReactNode;
}

function readUrlState(filters: FilterGroup[], counts: number[], defaultCount: number) {
  const params = new URLSearchParams(window.location.search);
  const state: FilterState = {};
  for (const g of filters) {
    const allowed = new Set(g.options.map((o) => o.value));
    const raw = (params.get(g.id) ?? "").split(",").filter((v) => allowed.has(v));
    state[g.id] = g.multi ? raw : raw.slice(0, 1);
  }
  const n = Number(params.get("n"));
  const count = counts.includes(n) ? n : defaultCount;
  const keys = (params.get("r") ?? "").split("~").filter(Boolean).slice(0, 50);
  return { state, count, keys };
}

export default function GeneratorUI(props: GeneratorUIProps) {
  const { toolType, locale, strings, filters, counts, defaultCount, poolSize, generate, resolve, layout = "list" } = props;
  const [state, setState] = useState<FilterState>(() =>
    Object.fromEntries(filters.map((g) => [g.id, [] as string[]])),
  );
  const [count, setCount] = useState(defaultCount);
  const [results, setResults] = useState<GeneratorResult[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [flash, setFlash] = useState<"" | "copy" | "share">("");

  // Restore a shared link (?filters&n&r=key~key) once on mount.
  useEffect(() => {
    const restored = readUrlState(filters, counts, defaultCount);
    setState(restored.state);
    setCount(restored.count);
    const shared = restored.keys.map((k) => resolve(k, restored.state)).filter((r): r is GeneratorResult => !!r);
    if (shared.length) {
      setResults(shared);
      setUsed(shared.map((r) => r.key));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const size = useMemo(() => poolSize(state), [poolSize, state]);

  const writeUrl = useCallback(
    (nextState: FilterState, nextCount: number, nextResults: GeneratorResult[]) => {
      const params = new URLSearchParams();
      for (const g of filters) if (nextState[g.id]?.length) params.set(g.id, nextState[g.id].join(","));
      if (nextCount !== defaultCount) params.set("n", String(nextCount));
      if (nextResults.length) params.set("r", nextResults.map((r) => r.key).join("~"));
      const qs = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    },
    [filters, defaultCount],
  );

  const run = useCallback(() => {
    if (size === 0) return;
    track("generate_start", { tool_type: toolType, requested_count: count, locale });
    const out = generate(state, count, used, newSeed());
    setResults(out.results);
    setUsed(out.used);
    writeUrl(state, count, out.results);
    track("generate_success", { tool_type: toolType, result_count: out.results.length, result_source: "editorial_pool", locale });
  }, [size, toolType, count, locale, generate, state, used, writeUrl]);

  const toggle = useCallback(
    (group: FilterGroup, value: string) => {
      setState((prev) => {
        const current = prev[group.id] ?? [];
        const nextValues = value === ""
          ? []
          : group.multi
            ? current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
            : [value];
        const next = { ...prev, [group.id]: nextValues };
        writeUrl(next, count, []);
        return next;
      });
      setUsed([]);
      setResults([]);
      track("filter_select", { tool_type: toolType, filter_name: group.id, filter_value: value || "all", locale });
    },
    [count, writeUrl, toolType, locale],
  );

  const resultText = results
    .map((r) => [r.title, r.subtitle, r.detail].filter(Boolean).join(" — "))
    .join("\n");

  const doCopy = async (what: "copy" | "share") => {
    const ok = await copyText(what === "copy" ? resultText : window.location.href);
    if (!ok) return;
    setFlash(what);
    setTimeout(() => setFlash(""), 1500);
    track(what === "copy" ? "copy_result" : "share_click", { tool_type: toolType, locale });
  };

  // Keep a deterministic preview for SSR/no-JS readers: the first results of seed 1.
  const preview = useMemo(() => {
    const empty = Object.fromEntries(filters.map((g) => [g.id, [] as string[]]));
    return generate(empty, Math.min(defaultCount, 3), [], 1).results;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chip = (active: boolean) =>
    `text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
      active
        ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
        : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
    }`;

  const shown = results.length ? results : [];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        {filters.map((group) => (
          <div key={group.id} className="mb-4">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.multi && (
                <button type="button" onClick={() => toggle(group, "")} className={chip((state[group.id] ?? []).length === 0)}>
                  {strings.all}
                </button>
              )}
              {group.options.map((o) => {
                const active = group.multi
                  ? (state[group.id] ?? []).includes(o.value)
                  : (state[group.id]?.[0] ?? group.options[0].value) === o.value;
                return (
                  <button key={o.value} type="button" onClick={() => toggle(group, o.value)} className={chip(active)} aria-pressed={active}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            {strings.howMany}
            <select
              value={count}
              onChange={(e) => {
                const next = Number(e.target.value);
                setCount(next);
                writeUrl(state, next, results);
              }}
              className="bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-2 py-1.5 text-[var(--text-primary)]"
            >
              {counts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={run} disabled={size === 0} className="btn-generate disabled:opacity-40">
            <span aria-hidden="true">🎲</span> {results.length ? strings.again : strings.generate}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3">
          {size === 0 ? strings.noMatch : strings.poolSize(size)}
        </p>

        <div aria-live="polite" className="mt-6" data-generator-results>
          {shown.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-[var(--text-muted)] text-sm mb-4">{strings.empty}</p>
              {preview.length > 0 && (
                <ul className="text-left max-w-md mx-auto space-y-2 opacity-70">
                  {preview.map((r) => (
                    <li key={r.key} className="text-sm text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">{r.title}</strong>
                      {r.subtitle ? ` · ${r.subtitle}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : layout === "cards" ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map((r) => (
                <li key={r.key} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col">
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image} alt={r.title} width={512} height={512} loading="lazy" className="w-full aspect-square object-cover bg-[#f3efe6]" />
                  ) : (
                    <div className="w-full aspect-[2/1] flex items-center justify-center text-6xl bg-white/[0.03]" aria-hidden="true">
                      {r.emoji ?? "🐾"}
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{r.title}</p>
                    {r.subtitle && <p className="text-xs text-[var(--neon-cyan)] mt-0.5">{r.subtitle}</p>}
                    {r.detail && <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{r.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02]">
              {shown.map((r) => (
                <li key={r.key} className="px-4 sm:px-5 py-3">
                  <p className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    {r.emoji ? <span aria-hidden="true">{r.emoji} </span> : null}
                    {r.title}
                    {r.subtitle && <span className="text-xs font-normal text-[var(--neon-cyan)] ml-2 align-middle">{r.subtitle}</span>}
                  </p>
                  {r.detail && <p className="text-sm text-[var(--text-secondary)] mt-0.5 whitespace-pre-line">{r.detail}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {shown.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button type="button" onClick={() => doCopy("copy")} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">
              {flash === "copy" ? strings.copied : strings.copy}
            </button>
            <button type="button" onClick={() => doCopy("share")} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">
              {flash === "share" ? strings.shared : strings.share}
            </button>
            {props.footer}
          </div>
        )}
      </div>
    </section>
  );
}
