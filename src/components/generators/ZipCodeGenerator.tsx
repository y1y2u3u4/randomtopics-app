"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import {
  MAX_ZIPS, STATE_NAME, US_STATES, ZIP_STATE_SUMMARY, ZIP_TOTAL,
  pickZips, planStates, sortZips, zipCsv, zipShardUrl, zipText,
  type ZipResult, type ZipRow,
} from "@/lib/generators/zipCodes";

const COUNTS = [1, 5, 10, 25, 50];
const ev = { tool_type: "random_zip_code", locale: "en" };

// Shown before the first click (and to no-JS readers): each example is the
// lowest ZIP of a big city, straight from the same data the tool draws from.
const PREVIEW: ZipResult[] = ["NY", "CA", "TX", "IL", "FL"].map((st) => ({
  zip: ZIP_STATE_SUMMARY[st].sample, city: ZIP_STATE_SUMMARY[st].city, county: "", state: st, stateName: STATE_NAME[st],
}));

function download(name: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ZipCodeGenerator() {
  const [state, setState] = useState("");
  const [count, setCount] = useState(10);
  const [sorted, setSorted] = useState(false);
  const [rows, setRows] = useState<ZipResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const shards = useRef<Record<string, ZipRow[]>>({});

  // Restore ?state=TX&n=25 from a shared link.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const st = (q.get("state") ?? "").toUpperCase();
    const n = Number(q.get("n"));
    void Promise.resolve().then(() => {
      if (STATE_NAME[st]) setState(st);
      if (COUNTS.includes(n)) setCount(n);
    });
  }, []);

  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      const rng = createRng(newSeed());
      const plan = planStates(state ? [state] : [], count, rng);
      await Promise.all(Object.keys(plan).filter((st) => !shards.current[st]).map(async (st) => {
        const res = await fetch(zipShardUrl(st));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        shards.current[st] = (await res.json()) as ZipRow[];
      }));
      const out = pickZips(plan, shards.current, rng);
      setRows(out);
      const params = new URLSearchParams();
      if (state) params.set("state", state);
      if (count !== 10) params.set("n", String(count));
      const qs = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
      track("generate_success", { ...ev, result_count: out.length, state: state || "any" });
    } catch {
      setError("Couldn't load the ZIP list — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const shown = sorted ? sortZips(rows) : rows;
  const copy = async (what: string, text: string) => {
    if (!(await copyText(text))) return;
    setFlash(what);
    setTimeout(() => setFlash(""), 1500);
    track("copy_result", { ...ev, format: what });
  };

  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-base text-[var(--text-primary)]";
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3">
          <label>
            <span className={label}>State</span>
            <select value={state} onChange={(e) => { setState(e.target.value); setRows([]); }} className={field} data-zip-state>
              <option value="">Any state (weighted by ZIP count)</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name} ({s.code}) · {ZIP_STATE_SUMMARY[s.code].count.toLocaleString("en-US")} ZIPs</option>
              ))}
            </select>
          </label>
          <label>
            <span className={label}>How many</span>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={field} data-zip-count>
              {COUNTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button type="button" onClick={generate} disabled={busy} className="btn-generate disabled:opacity-50" data-zip-generate>
            <span aria-hidden="true">📮</span> {busy ? "Loading…" : rows.length ? "Generate again" : "Generate ZIP codes"}
          </button>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} /> Sort by ZIP
          </label>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3">
          {state
            ? `${ZIP_STATE_SUMMARY[state].count.toLocaleString("en-US")} real ${STATE_NAME[state]} ZIP codes (${ZIP_STATE_SUMMARY[state].first}–${ZIP_STATE_SUMMARY[state].last}) · no repeats in a batch`
            : `${ZIP_TOTAL.toLocaleString("en-US")} real ZIP codes in 50 states + DC · up to ${MAX_ZIPS} at once · no repeats in a batch`}
        </p>

        <div aria-live="polite" className="mt-6" data-zip-results>
          {error ? (
            <p className="text-center text-sm text-[var(--neon-pink)]">{error}</p>
          ) : shown.length === 1 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-6xl sm:text-7xl font-extrabold tabular-nums gradient-text" style={{ fontFamily: "var(--font-display)" }}>{shown[0].zip}</p>
              <p className="mt-2 text-lg text-[var(--text-primary)]">{shown[0].city}, {shown[0].state}</p>
              {shown[0].county && <p className="text-sm text-[var(--text-muted)]">{shown[0].county} County · {shown[0].stateName}</p>}
            </div>
          ) : (
            <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${shown.length ? "" : "opacity-60"}`}>
              {(shown.length ? shown : PREVIEW).map((r) => (
                <li key={r.zip} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 flex items-baseline gap-3 min-w-0">
                  <span className="text-2xl font-bold tabular-nums text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{r.zip}</span>
                  <span className="text-sm text-[var(--text-secondary)] truncate">
                    {r.city}, {r.state}
                    {r.county && <span className="text-[var(--text-muted)]"> · {r.county} Co.</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {!shown.length && !error && <p className="text-xs text-center text-[var(--text-muted)] mt-3">Examples above · press Generate for a fresh random batch.</p>}
        </div>

        {shown.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button type="button" className={ghost} onClick={() => copy("zips", zipText(shown, false))}>{flash === "zips" ? "Copied ✓" : "Copy ZIPs"}</button>
            <button type="button" className={ghost} onClick={() => copy("places", zipText(shown, true))}>{flash === "places" ? "Copied ✓" : "Copy with city & state"}</button>
            <button type="button" className={ghost} data-zip-csv onClick={() => { download(`random-zip-codes${state ? `-${state.toLowerCase()}` : ""}.csv`, zipCsv(shown)); track("download_result", { ...ev, format: "csv" }); }}>Download CSV</button>
            <button type="button" className={ghost} onClick={() => copy("link", window.location.href)}>{flash === "link" ? "Link copied ✓" : "Copy link"}</button>
          </div>
        )}
      </div>
    </section>
  );
}
