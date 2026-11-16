"use client";

import { useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import { parseStreak, recordDaily, streakOn, EMPTY_STREAK, type Streak } from "@/lib/magic8";
import {
  CASTS, DAILY_EPOCH, DEFAULT_FILTERS, EMPTY_NAMES, GENRES, MAX_NAME, MODES, TONES,
  castLabel, dailyRoll, dateLabel, dayNumber, filtersFromParams, fill, genreLabel, modeInfo, pool, roll as rollScenario,
  rollFromParams, rollText, rollToParams, toneLabel, twistById,
  type Cast, type Filters, type Genre, type Mode, type Names, type Roll, type Tone,
} from "@/lib/generators/scenarios";

const TOOL = "scenario_generator";
const PAGE_URL = "https://randomtopics.app/scenario-generator";
const K_STREAK = "rt-scenario-daily-streak";
const btn = "rounded-xl border border-white/15 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:border-white/40 hover:text-[var(--text-primary)] transition-colors";
const chip = (on: boolean) =>
  `min-h-9 rounded-full border px-3 py-1.5 text-sm transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]" : "border-white/10 text-[var(--text-secondary)] hover:border-white/30"}`;
const label = "mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]";

const shareUrl = (r: Roll, names: Names = EMPTY_NAMES, tags = false) => `${PAGE_URL}?${rollToParams(r, names, tags).toString()}`;
const strip = (l: string) => l.replace(/^\S+\s/, "");

function readStreak(): Streak {
  try { return parseStreak(localStorage.getItem(K_STREAK)); } catch { return EMPTY_STREAK; }
}
function writeStreak(s: Streak) {
  try { localStorage.setItem(K_STREAK, JSON.stringify(s)); } catch { /* storage blocked: streak lasts for this visit only */ }
}

/** Read-only scenario card used by the generator, today's scenario and the server-rendered examples. */
export function ScenarioCard({ r, names = EMPTY_NAMES, tags = false, heading, onRerollTwist }: { r: Roll; names?: Names; tags?: boolean; heading?: string; onRerollTwist?: () => void }) {
  const s = r.scenario;
  const twist = twistById(r.twist);
  const m = modeInfo(s.mode);
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--neon-cyan)]/25 bg-gradient-to-br from-[rgba(0,229,255,0.07)] via-black/40 to-black/60 text-left" data-scenario-card={s.id}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-3 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] sm:px-5">
        <span className="text-[var(--neon-cyan)]">{heading ?? m.label}</span>
        <span>{strip(genreLabel(s.genre))}</span><span>·</span><span>{strip(toneLabel(s.tone))}</span><span>·</span><span>{castLabel(s.cast)}</span>
      </div>
      <p className="px-4 pb-4 pt-2 text-base leading-relaxed text-[var(--text-primary)] sm:px-5 sm:text-xl" data-scenario-text>{fill(s.text, names, tags)}</p>
      {twist && (
        <div className="flex items-start gap-3 border-t border-white/10 px-4 py-3 sm:px-5" data-scenario-twist>
          <span className="w-16 shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.16em] text-[var(--neon-yellow)]">Twist</span>
          <p className="min-w-0 flex-1 text-sm text-[var(--text-primary)]">{fill(twist.text, names, tags)}</p>
          {onRerollTwist && <button type="button" onClick={onRerollTwist} aria-label="New twist" title="New twist, same scenario" className="shrink-0 rounded-md border border-white/15 px-2 py-1 text-xs hover:border-white/40">🎲</button>}
        </div>
      )}
      <div className="flex items-start gap-3 border-t border-white/10 px-4 py-3 sm:px-5" data-scenario-hook>
        <span className="w-16 shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{m.id === "oc" ? "Ask" : m.id === "roleplay" ? "Open" : "Start"}</span>
        <p className="min-w-0 flex-1 text-sm italic text-[var(--text-secondary)]"><span className="sr-only">{m.hookLabel}: </span>{fill(s.hook, names, tags)}</p>
      </div>
    </article>
  );
}

function TodayScenario() {
  const [day, setDay] = useState<number | null>(null);
  const [streak, setStreak] = useState<Streak>(EMPTY_STREAK);
  const [note, setNote] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date and the saved streak are only known in the browser
    setDay(dayNumber());
    setStreak(readStreak());
  }, []);
  const r = useMemo(() => (day === null ? null : dailyRoll(day)), [day]);
  if (day === null || !r) return <div className="mx-auto mt-10 h-72 max-w-3xl" aria-hidden="true" />;
  const n = day - DAILY_EPOCH + 1;
  const shown = streakOn(streak, day);
  const done = streak.last === day;
  const url = shareUrl(r);
  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 2000); };
  const markDone = () => {
    const next = recordDaily(streak, day);
    setStreak(next); writeStreak(next);
    flash(`Nice. ${next.count}-day streak 🔥`);
    track("tool_use", { tool_type: TOOL, action: "daily_done", locale: "en", result_count: next.count });
  };
  const share = async () => {
    const text = `Scenario of the day #${n} · ${dateLabel(day)}${shown.count > 1 ? ` · 🔥 ${shown.count}-day streak` : ""}\n${rollText(r, EMPTY_NAMES)}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text, url });
        track("share_click", { tool_type: TOOL, share_method: "native", locale: "en", result_source: "daily" });
        return;
      }
    } catch (e) { if ((e as Error)?.name === "AbortError") return; }
    if (await copyText(`${text}\n${url}`)) { flash("Copied ✓ paste it anywhere"); track("share_click", { tool_type: TOOL, share_method: "copy", locale: "en", result_source: "daily" }); }
  };
  return (
    <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6" data-scenario-daily aria-labelledby="scenario-daily-title">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--neon-yellow)]">Scenario of the day #{n} · {dateLabel(day)}</p>
      <h2 id="scenario-daily-title" className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Today&rsquo;s scenario</h2>
      <p className="mb-4 mt-1 text-sm text-[var(--text-secondary)]">One scenario for everyone today (UTC), rotating OC, roleplay and writing. Write or play it, mark it done and keep your streak going.</p>
      <ScenarioCard r={r} heading={`Daily ${modeInfo(r.scenario.mode).label.toLowerCase()}`} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={markDone} disabled={done} className="btn-generate !px-5 disabled:opacity-60">{done ? "✓ Done today" : "✓ I did today’s scenario"}</button>
        <button type="button" onClick={share} className={btn}>📤 Share today&rsquo;s scenario</button>
        <span className="text-sm text-[var(--text-secondary)]" data-scenario-streak>🔥 {shown.count}-day streak · best {shown.best}</span>
        <span role="status" className="text-sm text-[var(--neon-green)]">{note}</span>
      </div>
    </section>
  );
}

export default function ScenarioGenerator() {
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);
  const [r, setR] = useState<Roll | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [names, setNames] = useState<Names>(EMPTY_NAMES);
  const [tags, setTags] = useState(false);
  const [note, setNote] = useState("");

  const size = useMemo(() => pool(f).length, [f]);

  // Shared link → that exact scenario; ?mode= etc. → those filters; then roll so a scenario is on the first screen.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const shared = rollFromParams(p);
    if (shared) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the shared scenario lives in the URL, read once on mount
      setR(shared.roll); setNames(shared.names); setTags(shared.tags);
      setF({ ...DEFAULT_FILTERS, mode: shared.roll.scenario.mode, twist: !!shared.roll.twist });
      track("tool_use", { tool_type: TOOL, action: "open_shared_scenario", locale: "en" });
      return;
    }
    const start = filtersFromParams(p);
    setF(start);
    const out = rollScenario(start, createRng(newSeed()));
    if (out) { setR(out.roll); setSeen(out.seen); }
  }, []);

  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 2000); };
  // The address bar shows the tab (?mode=roleplay), never a stale shared scenario.
  const syncUrl = (mode: Mode) => {
    const u = new URL(window.location.href);
    u.search = mode === DEFAULT_FILTERS.mode ? "" : `?mode=${mode}`;
    window.history.replaceState(null, "", u.toString());
  };

  const generate = (next: Filters = f, keepScenario = false, from: string[] = seen) => {
    const out = rollScenario(next, createRng(newSeed()), from, r, keepScenario);
    if (!out) { setR(null); return; }
    setR(out.roll); setSeen(out.seen);
    syncUrl(next.mode);
    track("generate_success", { tool_type: TOOL, result_count: 1, locale: "en", mode: next.mode });
  };
  const update = (patch: Partial<Filters>) => { const next = { ...f, ...patch }; setF(next); generate(next, false, []); };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const setMode = (mode: Mode) => {
    if (mode === "roleplay") track("tool_use", { tool_type: TOOL, action: "mode_roleplay", locale: "en" });
    update({ mode });
  };

  const copy = async () => {
    if (r && (await copyText(rollText(r, names, tags)))) { flash("Scenario copied ✓"); track("copy_result", { tool_type: TOOL, result_count: 1, locale: "en" }); }
  };
  const copyLink = async () => {
    if (r && (await copyText(shareUrl(r, names, tags)))) { flash("Link copied ✓ it opens this exact scenario"); track("share_click", { tool_type: TOOL, share_method: "link", locale: "en" }); }
  };

  const castShown = f.cast || (r?.scenario.cast ?? 2);
  const m = modeInfo(f.mode);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6" data-scenario-generator>
      <div className="glass-card p-4 sm:p-7">
        <div role="tablist" aria-label="Scenario type" className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-black/30 p-1">
          {MODES.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={f.mode === x.id} onClick={() => setMode(x.id)} data-scenario-mode={x.id}
              className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors ${f.mode === x.id ? "bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {x.tab}
            </button>
          ))}
        </div>
        <p className="mt-2 hidden text-center text-xs text-[var(--text-muted)] sm:block">{m.blurb}</p>

        <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
          <div aria-live="polite">
            {r ? <ScenarioCard r={r} names={names} tags={tags} onRerollTwist={f.twist ? () => generate(f, true) : undefined} />
              : <p className="rounded-2xl border border-white/10 p-5 text-sm text-[var(--text-secondary)]" data-scenario-empty>No scenario matches every filter you picked. Remove a genre or tone, or set people to Any.</p>}
          </div>

          <div className="order-first flex flex-wrap items-center gap-2 sm:order-none">
            <button type="button" onClick={() => generate()} className="btn-generate !px-6" data-scenario-roll>🎲 New scenario</button>
            <button type="button" onClick={copy} disabled={!r} className={btn}>📋 Copy</button>
            <button type="button" onClick={copyLink} disabled={!r} className={btn}>🔗 Copy share link</button>
            <span role="status" className="text-sm text-[var(--neon-green)]">{note}</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]" data-scenario-pool>{size} {m.label.toLowerCase()}s match · no repeats until you have seen them all</p>

        <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
          <div>
            <p className={label}>Genre</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Genre">
              <button type="button" aria-pressed={f.genres.length === 0} onClick={() => update({ genres: [] })} className={chip(f.genres.length === 0)}>All</button>
              {GENRES.map((g) => <button key={g.id} type="button" aria-pressed={f.genres.includes(g.id)} onClick={() => update({ genres: toggle<Genre>(f.genres, g.id) })} className={chip(f.genres.includes(g.id))}>{g.label}</button>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className={label}>Tone</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Tone">
                <button type="button" aria-pressed={f.tones.length === 0} onClick={() => update({ tones: [] })} className={chip(f.tones.length === 0)}>Any</button>
                {TONES.map((t) => <button key={t.id} type="button" aria-pressed={f.tones.includes(t.id)} onClick={() => update({ tones: toggle<Tone>(f.tones, t.id) })} className={chip(f.tones.includes(t.id))}>{t.label}</button>)}
              </div>
            </div>
            <div>
              <p className={label}>People</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Number of characters">
                <button type="button" aria-pressed={f.cast === 0} onClick={() => update({ cast: 0 })} className={chip(f.cast === 0)}>Any</button>
                {CASTS.map((c) => <button key={c.id} type="button" aria-pressed={f.cast === c.id} onClick={() => update({ cast: c.id as Cast })} className={chip(f.cast === c.id)}>{c.label}</button>)}
              </div>
            </div>
          </div>

          <div>
            <p className={label}>Your characters <span className="normal-case tracking-normal">(optional, rewrites the scenario)</span></p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["a", "b", "c"] as const).slice(0, castShown).map((k, i) => (
                <input key={k} type="text" value={names[k]} maxLength={MAX_NAME} aria-label={`Character ${k.toUpperCase()} name`}
                  disabled={tags && k !== "c"}
                  placeholder={i === 0 ? "Your OC, e.g. Mira" : i === 1 ? "Character B" : "Character C"}
                  onChange={(e) => setNames((n) => ({ ...n, [k]: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-[var(--bg-secondary)] px-3 py-2.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none disabled:opacity-40" />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
            <label className="inline-flex min-h-9 cursor-pointer items-center gap-2">
              <input type="checkbox" checked={f.twist} onChange={(e) => { const next = { ...f, twist: e.target.checked }; setF(next); generate(next, true); }} className="h-4 w-4 accent-[var(--neon-cyan)]" /> Add a twist
            </label>
            {f.mode === "roleplay" && (
              <label className="inline-flex min-h-9 cursor-pointer items-center gap-2">
                <input type="checkbox" checked={tags} onChange={(e) => setTags(e.target.checked)} className="h-4 w-4 accent-[var(--neon-cyan)]" /> Use {"{{user}}"} / {"{{char}}"} for AI chat bots
              </label>
            )}
          </div>
        </div>
      </div>
      <TodayScenario />
    </section>
  );
}
