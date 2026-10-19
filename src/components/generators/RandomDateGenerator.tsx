"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import {
  MAX_DATES, countEligible, datesCsv, formatDay, parseIso, pickDates, weekday,
  type DateFormat,
} from "@/lib/generators/randomDates";

const COUNTS = [1, 5, 10, 25, 50, 100];
const FORMATS: { id: DateFormat; label: string }[] = [
  { id: "iso", label: "ISO 2026-10-19" },
  { id: "us", label: "US 10/19/2026" },
  { id: "eu", label: "EU 19/10/2026" },
  { id: "long", label: "Long Monday, October 19, 2026" },
];
const ev = { tool_type: "random_date", locale: "en" };

function download(name: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function RandomDateGenerator() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-12-31");
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<DateFormat>("iso");
  const [weekdaysOnly, setWeekdaysOnly] = useState(false);
  const [unique, setUnique] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [days, setDays] = useState<number[]>([]);
  const [flash, setFlash] = useState("");

  const a = parseIso(start);
  const b = parseIso(end);
  const error = a === null || b === null ? "Enter both dates." : b < a ? "The end date is before the start date." : "";
  const eligible = error ? 0 : countEligible(a!, b!, weekdaysOnly);

  const generate = () => {
    if (error || !eligible) return;
    const out = pickDates(a!, b!, count, { excludeWeekends: weekdaysOnly, unique, sort: sorted }, createRng(newSeed()));
    setDays(out);
    track("generate_success", { ...ev, result_count: out.length, weekdays_only: weekdaysOnly, range_days: b! - a! + 1 });
  };
  const copy = async (what: string, text: string) => {
    if (!(await copyText(text))) return;
    setFlash(what);
    setTimeout(() => setFlash(""), 1500);
    track("copy_result", { ...ev, format: what });
  };

  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-base text-[var(--text-primary)]";
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const shown = days.map((d) => formatDay(d, format));

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <div className="grid grid-cols-2 gap-3">
          <label className="min-w-0"><span className={label}>From</span><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={field} data-date-start /></label>
          <label className="min-w-0"><span className={label}>To (included)</span><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={field} data-date-end /></label>
          <label className="min-w-0"><span className={label}>How many</span>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={field} data-date-count>
              {COUNTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="min-w-0"><span className={label}>Format</span>
            <select value={format} onChange={(e) => setFormat(e.target.value as DateFormat)} className={field} data-date-format>
              {FORMATS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4 text-sm text-[var(--text-secondary)]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={weekdaysOnly} onChange={(e) => setWeekdaysOnly(e.target.checked)} data-date-weekdays /> Exclude weekends</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> No repeats</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} /> Sort by date</label>
        </div>

        <div className="flex justify-center mt-5">
          <button type="button" onClick={generate} disabled={Boolean(error) || !eligible} className="btn-generate disabled:opacity-50" data-date-generate>
            <span aria-hidden="true">📅</span> {days.length ? "Generate again" : "Generate random date"}
          </button>
        </div>
        <p className={`text-xs text-center mt-3 ${error ? "text-[var(--neon-pink)]" : "text-[var(--text-muted)]"}`}>
          {error || (eligible
            ? `${eligible.toLocaleString("en-US")} ${weekdaysOnly ? "weekdays" : "days"} in range · start and end dates included · up to ${MAX_DATES} at once`
            : "No weekdays in this range — untick Exclude weekends or widen it.")}
        </p>

        <div aria-live="polite" className="mt-6" data-date-results>
          {days.length === 1 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-4xl sm:text-6xl font-extrabold tabular-nums gradient-text break-words" style={{ fontFamily: "var(--font-display)" }}>{shown[0]}</p>
              <p className="mt-2 text-lg text-[var(--text-secondary)]">{weekday(days[0])}</p>
            </div>
          ) : days.length ? (
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {days.map((d, i) => (
                <li key={`${d}-${i}`} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 flex items-baseline justify-between gap-3 min-w-0">
                  <span className="font-semibold tabular-nums text-[var(--text-primary)] truncate">{shown[i]}</span>
                  {format !== "long" && <span className="text-xs text-[var(--text-muted)] shrink-0">{weekday(d).slice(0, 3)}</span>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-center text-sm text-[var(--text-muted)]">Set a range and press Generate. Example: 2026-03-17 (Tuesday).</p>
          )}
        </div>

        {days.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button type="button" className={ghost} onClick={() => copy("dates", shown.join("\n"))}>{flash === "dates" ? "Copied ✓" : "Copy dates"}</button>
            <button type="button" className={ghost} data-date-csv onClick={() => { download("random-dates.csv", datesCsv(days)); track("download_result", { ...ev, format: "csv" }); }}>Download CSV</button>
          </div>
        )}
      </div>
    </section>
  );
}
