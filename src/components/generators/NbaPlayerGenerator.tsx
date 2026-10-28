"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import { shareFiveImage, type ShareFormat } from "@/lib/nbaShareCanvas";
import {
  DECADES, DEFAULT_FILTERS, FIVE_ORDER, NBA_PLAYERS, NBA_TEAMS, POSITIONS,
  careerYears, dailyFive, dateLabel, dayNumber, drawSlots, filterPlayers, fiveShareText, hasPortrait, jerseyColors, portraitSrc, resultsText,
  type NbaFilters, type NbaPlayer, type Status,
} from "@/lib/nbaPlayers";

const TOOL = "random_nba_player_generator";
const PAGE_URL = "https://randomtopics.app/random-nba-player-generator";
const COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);
const STATUS: { value: Status; label: string }[] = [
  { value: "all", label: "All players" },
  { value: "active", label: "Active" },
  { value: "retired", label: "Retired" },
];

const ACCENT = "var(--neon-orange)";
const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontVariantNumeric: "tabular-nums" as const };
const JERSEY_FONT = "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Arial Black', system-ui, sans-serif";
const selectClass = "w-full rounded-lg border border-white/15 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--neon-orange)] focus:outline-none";

/** Tank-top jersey in the player's main-team colours: big number (or position), optional fan-art portrait. */
function Jersey({ p }: { p: NbaPlayer }) {
  const c = jerseyColors(p);
  const portrait = hasPortrait(p);
  const big = p.number === null ? p.pos : String(p.number);
  const size = p.number === null ? 64 : big.length > 1 ? 96 : 110;
  return (
    <div className="relative w-[132px] shrink-0 sm:w-[148px]" style={{ aspectRatio: "200 / 220" }} data-nba-jersey>
      <svg viewBox="0 0 200 220" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <path d="M62 6 L38 10 C36 50 34 62 22 78 L22 212 H178 V78 C166 62 164 50 162 10 L138 6 C130 36 70 36 62 6 Z" fill={c.primary} stroke={c.secondary} strokeWidth="3" strokeLinejoin="round" />
        <g fill="none" stroke={c.secondary} strokeWidth="7" strokeLinecap="round">
          <path d="M62 6 C70 36 130 36 138 6" />
          <path d="M38 10 C36 50 34 62 22 78" />
          <path d="M162 10 C164 50 166 62 178 78" />
        </g>
        <path d="M22 196 H178" stroke={c.secondary} strokeWidth="6" />
        <text
          x="100" y={portrait ? 172 : 150} textAnchor="middle" fontSize={portrait ? size * 0.78 : size}
          fill={c.text} stroke={c.secondary} strokeWidth="3" paintOrder="stroke" strokeLinejoin="round"
          style={{ fontFamily: JERSEY_FONT, fontWeight: 400 }}
        >{big}</text>
      </svg>
      {portrait && (
        // eslint-disable-next-line @next/next/no-img-element -- small pre-sized fan-art JPG, lazy loaded
        <img
          src={portraitSrc(p)} alt={`${p.name} illustrated portrait (unofficial fan art)`} width={384} height={384}
          loading="lazy" decoding="async"
          className="absolute rounded-full object-cover"
          style={{ left: "29%", top: "17%", width: "42%", height: "auto", aspectRatio: "1 / 1", border: `3px solid ${c.secondary}`, background: c.secondary }}
        />
      )}
    </div>
  );
}

function PlayerCard({ p, slot, locked, onLock }: { p: NbaPlayer; slot: number; locked: boolean; onLock: () => void }) {
  const c = jerseyColors(p);
  return (
    <li
      data-nba-card
      className="relative overflow-hidden rounded-2xl border text-left"
      style={{
        borderColor: locked ? ACCENT : "rgba(255,255,255,0.14)",
        background: `linear-gradient(155deg, ${c.primary}55 0%, rgba(14,14,26,0.94) 60%)`,
        boxShadow: locked ? "0 0 0 1px rgba(255,107,53,0.6), 0 8px 28px rgba(255,107,53,0.18)" : undefined,
      }}
    >
      <div className="flex items-center justify-between border-b border-dashed px-4 py-2 text-[11px] uppercase tracking-[0.18em]" style={{ borderColor: "rgba(255,255,255,0.22)", color: "var(--text-secondary)", ...mono }}>
        <span>Slot {String(slot).padStart(2, "0")}</span>
        <span>{p.active ? "Active" : "Retired"}</span>
      </div>
      <div className="flex gap-3 px-3 pb-4 pt-3 sm:gap-4 sm:px-4">
        <Jersey p={p} />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold leading-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            <span className="mr-2 rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: c.primary, color: c.text, border: `1px solid ${c.secondary}`, ...mono }}>{p.pos}</span>
            {p.number !== null && <span className="sr-only">Jersey number {p.number}. </span>}
            {p.teams.join(" · ")}
          </p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            <dt className="uppercase tracking-wider text-[var(--text-muted)]">Years</dt>
            <dd className="text-[var(--text-primary)]" style={mono}>{careerYears(p)}</dd>
            {p.honors.length > 0 && (
              <>
                <dt className="uppercase tracking-wider text-[var(--text-muted)]">Honors</dt>
                <dd className="flex flex-wrap gap-1">
                  {p.honors.slice(0, 2).map((h) => (
                    <span key={h} className="rounded-full border px-2 py-0.5 text-[var(--text-primary)]" style={{ borderColor: "rgba(255,226,52,0.4)", background: "rgba(255,226,52,0.07)" }}>{h}</span>
                  ))}
                </dd>
              </>
            )}
          </dl>
          <button
            type="button"
            onClick={onLock}
            aria-pressed={locked}
            className="mt-3 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
            style={locked ? { background: ACCENT, color: "#1a0d05", borderColor: ACCENT } : { borderColor: "rgba(255,255,255,0.18)", color: "var(--text-secondary)" }}
          >
            {locked ? "🔒 Locked" : "🔓 Lock"}
          </button>
        </div>
      </div>
    </li>
  );
}

function DailyFive() {
  const [day, setDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date is only known in the browser
    setDay(dayNumber());
  }, []);
  const five = useMemo(() => (day === null ? [] : dailyFive(day)), [day]);
  if (day === null) return <div className="mx-auto mt-10 h-48 max-w-4xl" aria-hidden="true" />;
  const text = fiveShareText(day, five, PAGE_URL);
  const image = async (format: ShareFormat) => {
    try {
      const r = await shareFiveImage(day, five, format);
      flash(r === "shared" ? "Image ready ✓" : "Image downloaded ✓");
      track("share_click", { tool_type: TOOL, share_method: `image_${format}`, locale: "en" });
    } catch { flash("Could not create the image"); }
  };
  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 1800); };
  const share = async () => {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text, url: PAGE_URL });
        track("share_click", { tool_type: TOOL, share_method: "native", locale: "en" });
        return;
      }
    } catch { /* cancelled: fall back to copy */ }
    if (await copyText(text)) { flash("Share text copied ✓"); track("share_click", { tool_type: TOOL, share_method: "copy", locale: "en" }); }
  };
  return (
    <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6" data-nba-daily aria-labelledby="nba-daily-title">
      <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: "rgba(255,226,52,0.35)", background: "linear-gradient(160deg, rgba(255,226,52,0.07), rgba(14,14,26,0.85))" }}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--neon-yellow)]" style={mono}>Daily challenge · {dateLabel(day)}</p>
        <h2 id="nba-daily-title" className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Today&rsquo;s random starting five</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">One random player per position, the same five for everyone today. Would you start them? Share yours and compare with friends.</p>
        <ol className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10">
          {FIVE_ORDER.map((pos, i) => {
            const p = five[i];
            return (
              <li key={pos} className="flex items-baseline gap-3 px-3 py-2.5 text-sm">
                <span className="w-9 shrink-0 rounded px-1.5 py-0.5 text-center text-xs font-bold" style={{ background: ACCENT, color: "#1a0d05", ...mono }}>{pos}</span>
                <span className="font-semibold text-[var(--text-primary)]">{p.name}{p.number !== null && <span className="ml-2 text-xs font-normal text-[var(--text-muted)]" style={mono}>#{p.number}</span>}</span>
                <span className="ml-auto text-right text-xs text-[var(--text-muted)]">{p.teams[0]} · {careerYears(p)}</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={share} className="rounded-lg px-4 py-2 text-sm font-bold" style={{ background: "var(--neon-yellow)", color: "#1a1500" }}>Share today&rsquo;s five</button>
          <button
            type="button"
            onClick={async () => { if (await copyText(text)) { flash("Copied ✓"); track("copy_result", { tool_type: TOOL, locale: "en", result_source: "daily_five" }); } }}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-white/40"
          >
            Copy text
          </button>
          <button type="button" onClick={() => image("square")} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-white/40">Share image (square)</button>
          <button type="button" onClick={() => image("story")} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-white/40">Share image (story)</button>
          <span role="status" className="text-sm text-[var(--neon-green)]">{note}</span>
        </div>
      </div>
    </section>
  );
}

export default function NbaPlayerGenerator() {
  const [filters, setFilters] = useState<NbaFilters>(DEFAULT_FILTERS);
  const [count, setCount] = useState(5);
  const [slots, setSlots] = useState<NbaPlayer[]>([]);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [used, setUsed] = useState<string[]>([]);
  const [short, setShort] = useState(false);
  const [copied, setCopied] = useState(false);
  const firstFilter = useRef(true);

  const poolSize = useMemo(() => filterPlayers(filters).length, [filters]);

  // A new filter starts a fresh no-repeat cycle.
  useEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the no-repeat cycle when filters change
    setUsed([]);
  }, [filters]);

  const setFilter = (key: keyof NbaFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }) as NbaFilters);
    track("filter_select", { tool_type: TOOL, filter_name: key, filter_value: value || "all", locale: "en" });
  };

  const generate = (next: NbaFilters = filters, seen: string[] = used) => {
    const out = drawSlots(slots, locked, count, next, seen, createRng(newSeed()));
    setSlots(out.slots);
    setUsed(out.used);
    setShort(out.short);
    setCopied(false);
    track("generate_success", { tool_type: TOOL, result_count: out.slots.length, locked_count: locked.size, locale: "en" });
  };

  const randomTeam = () => {
    const team = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)];
    const next = { ...filters, team };
    setFilters(next);
    generate(next, []);
    track("filter_select", { tool_type: TOOL, filter_name: "team", filter_value: "random", locale: "en" });
  };

  const toggleLock = (id: string) => {
    setLocked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
    track("tool_use", { tool_type: TOOL, action: "lock_toggle", locale: "en" });
  };

  const copy = async () => {
    if (await copyText(resultsText(slots))) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      track("copy_result", { tool_type: TOOL, result_count: slots.length, locale: "en" });
    }
  };

  const chip = (on: boolean) =>
    `flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${on ? "border-[var(--neon-orange)] bg-[var(--neon-orange)]/15 text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-orange)]/50"}`;
  const lockedCount = slots.filter((p) => locked.has(p.id)).length;

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 sm:px-6" data-nba-tool>
        <div className="rounded-2xl border p-4 sm:p-6" style={{ borderColor: "rgba(255,107,53,0.3)", background: "rgba(14,14,26,0.7)" }}>
          <div role="group" aria-label="Player status" className="flex gap-2">
            {STATUS.map((s) => (
              <button key={s.value} type="button" aria-pressed={filters.status === s.value} className={chip(filters.status === s.value)} onClick={() => setFilter("status", s.value)}>{s.label}</button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label className="text-xs text-[var(--text-muted)]">Team
              <select className={`${selectClass} mt-1`} value={filters.team} onChange={(e) => setFilter("team", e.target.value)}>
                <option value="">Any of 30 teams</option>
                {NBA_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--text-muted)]">Position
              <select className={`${selectClass} mt-1`} value={filters.pos} onChange={(e) => setFilter("pos", e.target.value)}>
                <option value="">Any position</option>
                {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.value} · {p.label}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--text-muted)]">Era
              <select className={`${selectClass} mt-1`} value={filters.era} onChange={(e) => setFilter("era", e.target.value)}>
                <option value="">All eras</option>
                {DECADES.map((d) => <option key={d} value={d}>{d}s</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--text-muted)]">How many
              <select className={`${selectClass} mt-1`} value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {COUNTS.map((n) => <option key={n} value={n}>{n} {n === 1 ? "player" : "players"}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-nba-generate
              onClick={() => generate()}
              disabled={poolSize === 0}
              className="rounded-xl px-6 py-3 text-base font-extrabold disabled:opacity-40"
              style={{ background: ACCENT, color: "#1a0d05", fontFamily: "var(--font-display)" }}
            >
              {slots.length === 0 ? "Generate players" : lockedCount > 0 ? "Reroll unlocked" : "Generate again"}
            </button>
            <button type="button" onClick={randomTeam} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-[var(--neon-orange)]/60">🎲 Random team</button>
            {slots.length > 0 && (
              <button type="button" onClick={copy} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-white/40">{copied ? "Copied ✓" : "Copy result"}</button>
            )}
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]" style={mono}>
            {poolSize === 0 ? "No player matches these filters — clear one." : `${poolSize} of ${NBA_PLAYERS.length} players match · no repeats until you have seen them all`}
          </p>
        </div>

        {slots.length === 0 ? (
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">Pick your filters (or leave them open) and press Generate. Lock a card you like, then reroll the rest.</p>
        ) : (
          <>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
              {slots.map((p, i) => <PlayerCard key={p.id} p={p} slot={i + 1} locked={locked.has(p.id)} onLock={() => toggleLock(p.id)} />)}
            </ul>
            {short && <p className="mt-3 text-center text-sm text-[var(--text-muted)]">Only {slots.length} players match these filters, so that is all you get.</p>}
            <p className="mt-3 text-center text-xs text-[var(--text-muted)]">Locked cards stay in place when you generate again — handy for draft and pick games.</p>
          </>
        )}
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">Unofficial fan tool. Not affiliated with or endorsed by the NBA, its teams or players. Player illustrations are original fan art.</p>
      </section>
      <DailyFive />
    </>
  );
}
