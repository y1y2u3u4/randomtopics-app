"use client";

import { useEffect, useRef, useState } from "react";
import { NAME_CORPUS_VERSION, NAME_STYLES, type NameKind } from "@/data/nameGenerators";
import { copyText, shareText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  defaultNameOptions, drawNames, freshNameRound, MAX_NAME_HISTORY, MAX_NAME_SHORTLIST, nameEventParams,
  nameLengths, namePool, nameRoundKey, nameShortlistKey, resolveName, restoreNameRound, restoreNameShortlist, validateNameOptions,
  type NameOptions, type NameResult, type NameRound, type NameSelection,
} from "@/lib/nameGenerator";

const control = "min-h-11 rounded-xl border border-white/20 px-3 py-2 text-sm [overflow-wrap:anywhere] disabled:opacity-50";
const select = "mt-2 block w-full min-w-0 rounded-xl border border-white/20 bg-[var(--bg-primary)] p-3";

function NameActions({ result, kind, options, saved, source, toggle }: {
  result: NameResult; kind: NameKind; options: NameOptions; saved: boolean;
  source: "starter" | "generated" | "shortlist"; toggle: () => void;
}) {
  const [pending, setPending] = useState<"copy" | "share" | null>(null);
  const [notice, setNotice] = useState("");
  const [manual, setManual] = useState("");
  const active = useRef(true), busy = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  async function act(action: "copy" | "share") {
    if (busy.current) return;
    busy.current = true; setPending(action); setNotice(""); setManual("");
    const params = { ...nameEventParams(kind, { ...options, style: result.style, length: result.length,
      seed: result.selection.seed, withTitle: result.selection.withTitle }, "name_result"), result_source: source };
    try {
      if (action === "copy") {
        const success = await copyText(result.display);
        if (!active.current) return;
        setNotice(success ? "Copied." : "Copy is blocked. Select the text below.");
        if (!success) setManual(result.display);
        track(success ? "copy_result" : "copy_error", params);
      } else {
        const shared = await shareText({ title: kind === "band" ? "A band name idea" : "A dragon name idea",
          text: result.display, url: `${window.location.origin}/${kind}-name-generator` });
        if (!active.current) return;
        if (shared.status === "aborted") { setNotice("Sharing cancelled. Your name is still here."); return; }
        if (shared.status === "failed") {
          setNotice("Sharing is blocked. Select the text below."); setManual(shared.fallbackText); track("share_error", params);
        } else {
          setNotice(shared.method === "native" ? "Shared." : "Name and page link copied.");
          track("share_result", { ...params, share_method: shared.method });
        }
      }
    } finally { if (active.current) { busy.current = false; setPending(null); } }
  }
  return <div className="mt-3">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Name actions">
      <button type="button" className={control} aria-disabled={Boolean(pending)} aria-busy={pending === "copy"} onClick={() => void act("copy")}>{pending === "copy" ? "Copying…" : "Copy name"}</button>
      <button type="button" className={control} aria-pressed={saved} onClick={toggle}>{saved ? "Remove from shortlist" : "Save to shortlist"}</button>
      <button type="button" className={control} aria-disabled={Boolean(pending)} aria-busy={pending === "share"} onClick={() => void act("share")}>{pending === "share" ? "Sharing…" : "Share"}</button>
    </div>
    {notice && <p role="status" className="mt-2 text-sm text-[var(--text-secondary)]">{notice}</p>}
    {manual && <label className="mt-2 block text-sm">Select and copy manually<textarea readOnly value={manual} onFocus={event => event.currentTarget.select()} className="mt-2 w-full rounded-lg border border-white/20 p-3" rows={3} /></label>}
  </div>;
}

export default function NameGenerator({ kind }: { kind: NameKind }) {
  const [round, setRound] = useState(() => freshNameRound(kind));
  const roundRef = useRef(round);
  const [draft, setDraft] = useState(round.options);
  const [ready, setReady] = useState(false);
  const [shortlist, setShortlist] = useState<NameSelection[]>([]);
  const shortlistRef = useRef<NameSelection[]>([]);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [copyingBatch, setCopyingBatch] = useState(false);
  const [manualBatch, setManualBatch] = useState("");
  const drawBusy = useRef(false), batchBusy = useRef(false), revision = useRef(0), mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const frame = requestAnimationFrame(() => {
      try {
        const restored = restoreNameRound(kind, sessionStorage.getItem(nameRoundKey(kind)));
        if (restored) { roundRef.current = restored; setRound(restored); setDraft(restored.options); }
      } catch { setStorageBlocked(true); }
      try {
        const saved = restoreNameShortlist(kind, localStorage.getItem(nameShortlistKey(kind)));
        shortlistRef.current = saved; setShortlist(saved);
      } catch { setStorageBlocked(true); }
      setReady(true);
    });
    return () => { mounted.current = false; cancelAnimationFrame(frame); };
  }, [kind]);

  const pool = namePool(kind, round.options), remaining = pool.filter(result => !round.seen.includes(result.identity)).length;
  const results = round.results.map(selection => resolveName(kind, selection)!).filter(Boolean);
  const savedResults = shortlist.map(selection => resolveName(kind, selection)!).filter(Boolean);
  const atLimit = round.seen.length >= MAX_NAME_HISTORY;

  function commit(next: NameRound) {
    revision.current++; setManualBatch("");
    const value = { ...next, updated: Date.now() };
    roundRef.current = value; setRound(value);
    try { sessionStorage.setItem(nameRoundKey(kind), JSON.stringify(value)); } catch { setStorageBlocked(true); }
  }
  function generate() {
    if (!ready || drawBusy.current) return;
    const current = roundRef.current;
    const next = drawNames(namePool(kind, current.options), current.seen, current.options.count);
    if (!next.length) return;
    drawBusy.current = true;
    requestAnimationFrame(() => { drawBusy.current = false; });
    const params = nameEventParams(kind, current.options);
    track("generate_start", params);
    commit({ ...current, seen: [...current.seen, ...next.map(result => result.identity)], results: next.map(result => result.selection), generated: true });
    setNotice(`${next.length} new ${next.length === 1 ? "name" : "names"} ready.`);
    track("generate_success", { ...params, result_count: next.length });
  }
  function applyFilters(options: NameOptions) {
    const parsed = validateNameOptions(kind, options);
    if (!parsed.value) { setFormError(parsed.error); return; }
    setFormError(""); setDraft(parsed.value);
    commit({ ...roundRef.current, options: parsed.value, results: [], generated: false });
    setNotice("Filters applied. Generate your next names; earlier names still count in this round.");
  }
  function toggle(result: NameResult, source: "starter" | "generated" | "shortlist") {
    const current = shortlistRef.current;
    const exists = current.some(selection => resolveName(kind, selection)?.identity === result.identity);
    if (!exists && current.length >= MAX_NAME_SHORTLIST) { setNotice(`Your shortlist holds ${MAX_NAME_SHORTLIST} names. Remove one before saving another.`); return; }
    const next = exists ? current.filter(selection => resolveName(kind, selection)?.identity !== result.identity) : [result.selection, ...current];
    const params = { ...nameEventParams(kind, { ...roundRef.current.options, style: result.style, length: result.length,
      seed: result.selection.seed, withTitle: result.selection.withTitle }, "name_shortlist"), result_source: source };
    try { localStorage.setItem(nameShortlistKey(kind), JSON.stringify({ version: NAME_CORPUS_VERSION, items: next })); }
    catch { setStorageBlocked(true); setNotice("Your browser blocked saving. Copy the name to keep it."); track("save_error", params); return; }
    shortlistRef.current = next; setShortlist(next); revision.current++; setManualBatch("");
    setNotice(exists ? "Removed from your shortlist." : "Saved in this browser. Your shortlist is below the results.");
    track(exists ? "remove_saved_result" : "save_result", params);
  }
  async function copyBatch(items: NameResult[], source: "batch" | "shortlist") {
    if (batchBusy.current || !items.length) return;
    batchBusy.current = true; setCopyingBatch(true); setManualBatch("");
    const atRevision = revision.current, value = items.map(result => result.display).join("\n");
    const success = await copyText(value);
    if (!mounted.current) return;
    batchBusy.current = false; setCopyingBatch(false);
    if (atRevision !== revision.current) return;
    if (!success) setManualBatch(value);
    setNotice(success ? "All names copied." : "Copy is blocked. Select the names below.");
    track(success ? "copy_result" : "copy_error", { ...nameEventParams(kind, roundRef.current.options, "name_batch"), result_source: source,
      category: new Set(items.map(item => item.style)).size === 1 ? items[0].style : "mixed",
      output_style: new Set(items.map(item => item.length)).size === 1 ? items[0].length : "mixed",
      has_seed: items.some(item => Boolean(item.selection.seed)), with_title: items.some(item => item.selection.withTitle), result_count: items.length });
  }
  const renderResult = (result: NameResult, source: "starter" | "generated" | "shortlist") => <article key={`${source}:${result.identity}:${result.display}`} data-name-result={source} data-name-identity={result.identity}
    className="rounded-xl border border-white/15 p-4 [overflow-wrap:anywhere]">
    <p className="text-xs text-[var(--text-secondary)]">{NAME_STYLES[kind].find(style => style.id === result.style)?.label}{source === "starter" ? " · Starting example" : ""}</p>
    <h3 className="mt-1 text-xl sm:text-2xl font-bold" data-name-display>{result.display}</h3>
    {result.pronunciation && <p className="mt-2 text-sm">Suggested pronunciation: {result.pronunciation}</p>}
    <p className="mt-2 text-sm text-[var(--text-secondary)]">{result.detail}</p>
    <NameActions result={result} kind={kind} options={round.options} source={source}
      saved={savedResults.some(saved => saved.identity === result.identity)} toggle={() => toggle(result, source)} />
  </article>;

  return <section aria-label={`${kind === "band" ? "Band" : "Dragon"} name tool`} className="glass-card p-4 sm:p-6 [overflow-wrap:anywhere]">
    <button type="button" onClick={generate} disabled={!ready || !remaining || atLimit} data-name-generate
      className="w-full min-h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 text-base font-bold text-black [overflow-wrap:anywhere] disabled:opacity-50">
      Generate {round.options.count === 1 ? "a name" : `${round.options.count} names`}
    </button>
    <p className="mt-2 text-sm text-[var(--text-secondary)]">{remaining} unseen of {pool.length} matching names · No repeats this round</p>
    <p role="status" aria-live="polite" className="mt-2 text-sm">{notice}</p>
    {storageBlocked && <p role="status" className="mt-2 text-sm text-amber-200">Browser storage is blocked. Generating and copying still work; return restoration or saving may be unavailable.</p>}
    {remaining > 0 && remaining < round.options.count && <p className="mt-2 text-sm">Only {remaining} unseen {remaining === 1 ? "name remains" : "names remain"}; the next batch will be smaller.</p>}
    {atLimit || (!remaining && pool.length > 0) ? <div className="mt-3">
      <p className="text-sm">{atLimit ? "This round reached its history limit." : "This selection is exhausted."} Broaden your filters or explicitly start a fresh round.</p>
      <button type="button" className={`${control} mt-2`} onClick={() => { commit(freshNameRound(kind, round.options, Date.now(), false)); setNotice("Fresh round ready. Generate when you are ready."); }}>Start a fresh round</button>
    </div> : !pool.length ? <p role="status" className="mt-3 text-sm">No names match these filters. Try fewer avoid words or a different style.</p> : null}

    <details className="mt-4 border-t border-white/10 pt-2">
      <summary className="min-h-11 cursor-pointer font-semibold py-2">Customize names</summary>
      <form onSubmit={event => { event.preventDefault(); applyFilters(draft); }} className="mt-3 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm">{kind === "band" ? "Music style" : "Element style"}<select className={select} value={draft.style} onChange={event => setDraft({ ...draft, style: event.target.value })}>
            <option value="all">All styles</option>{NAME_STYLES[kind].map(style => <option key={style.id} value={style.id}>{style.label}</option>)}
          </select></label>
          <label className="text-sm">Name length<select className={select} value={draft.length} onChange={event => setDraft({ ...draft, length: event.target.value })}>
            <option value="any">Any length</option>{nameLengths(kind).map(length => <option key={length.id} value={length.id}>{length.label}</option>)}
          </select></label>
          <label className="text-sm">Names per batch<select className={select} value={draft.count} onChange={event => setDraft({ ...draft, count: Number(event.target.value) })}>
            {[1, 3, 5].map(count => <option key={count} value={count}>{count}</option>)}
          </select></label>
        </div>
        {kind === "band" ? <>
          <label className="block text-sm">Seed word (optional)<input className={select} autoComplete="off" spellCheck={false} maxLength={20} value={draft.seed} onChange={event => setDraft({ ...draft, seed: event.target.value })} aria-describedby="band-seed-help" /></label>
          <p id="band-seed-help" className="text-xs text-[var(--text-secondary)]">One word, up to 20 letters. Short names join it to a sound ending; longer names place it in a phrase. Input stays in this browser.</p>
          <label className="block text-sm">Avoid words or phrases (optional)<input className={select} autoComplete="off" spellCheck={false} maxLength={100} value={draft.avoid} onChange={event => setDraft({ ...draft, avoid: event.target.value })} aria-describedby="band-avoid-help" /></label>
          <p id="band-avoid-help" className="text-xs text-[var(--text-secondary)]">Up to five comma-separated terms. Names containing a term are skipped, ignoring case.</p>
        </> : <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={draft.withTitle} onChange={event => setDraft({ ...draft, withTitle: event.target.checked })} />Include a dragon title</label>}
        {formError && <p role="alert" className="text-sm text-amber-200">{formError}</p>}
        <div className="flex flex-wrap gap-2"><button className={control} type="submit" disabled={!ready}>Apply filters</button><button className={control} type="button" disabled={!ready} onClick={() => applyFilters(defaultNameOptions())}>Clear filters</button></div>
        <p className="text-xs text-[var(--text-secondary)]">Apply changes before generating. Changing filters, seed or title does not reset the round.</p>
      </form>
    </details>

    <div className="mt-4 space-y-3" aria-label="Name results">{results.map(result => renderResult(result, round.generated ? "generated" : "starter"))}</div>
    {results.length > 1 && <button type="button" className={`${control} mt-3`} aria-disabled={copyingBatch} aria-busy={copyingBatch} onClick={() => void copyBatch(results, "batch")}>Copy all names</button>}
    {manualBatch && <label className="mt-3 block text-sm">Select and copy all names<textarea readOnly value={manualBatch} rows={5} className="mt-2 w-full rounded-xl border border-white/20 p-3" onFocus={event => event.currentTarget.select()} /></label>}

    <section aria-label="Name shortlist" className="mt-6 border-t border-white/10 pt-4">
      <h2 className="text-lg font-bold">Your shortlist <span className="text-sm font-normal">({savedResults.length}/{MAX_NAME_SHORTLIST})</span></h2>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">Saved on this browser only. Compare your favorites before choosing; no account needed.</p>
      {!savedResults.length ? <p className="mt-3 text-sm">Save a name to keep it here while you try other options.</p> : <>
        <button type="button" className={`${control} my-3`} aria-disabled={copyingBatch} aria-busy={copyingBatch} onClick={() => void copyBatch(savedResults, "shortlist")}>Copy shortlist</button>
        <div className="space-y-3">{savedResults.map(result => renderResult(result, "shortlist"))}</div>
      </>}
    </section>
  </section>;
}
