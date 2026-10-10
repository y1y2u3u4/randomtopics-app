"use client";
import { useEffect, useRef, useState } from "react";
import { pickerItems, pickerPool, pickItems, countryDisplay, type PickerKind, type PickerItem } from "@/data/randomPickers";
import { track } from "@/lib/track";
const groupLabels: Record<string, string> = {home:"Home", kitchen:"Kitchen", desk:"Desk & school", workshop:"Workshop", outdoors:"Outdoors", travel:"Travel", northeast:"Northeast", midwest:"Midwest", south:"South", west:"West", fantasy:"Fantasy", modern:"Modern", scifi:"Sci-fi"};
export default function RandomPicker({kind}: {kind: PickerKind}) {
  const items = pickerItems(kind), starter = items[0], key = `rt_picker_${kind}_v1`;
  const [group, setGroup] = useState("all"), [count, setCount] = useState(1), [contiguous, setContiguous] = useState(false), [form, setForm] = useState("name");
  const [seen, setSeen] = useState<string[]>([starter.id]), seenRef = useRef<string[]>([starter.id]);
  const [results, setResults] = useState<PickerItem[]>([starter]);
  const [ready, setReady] = useState(false), [notice, setNotice] = useState("");
  const busy = useRef(false), groups = [...new Set(items.map(p => p.group))];
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) || "null");
      if (saved && Array.isArray(saved.seen) && Array.isArray(saved.results)) {
        const restored = items.filter(p => saved.seen.includes(p.id)).map(p => p.id);
        seenRef.current = restored; setSeen(restored);
        setResults([...new Set(saved.results.slice(0, 10))].flatMap((id: unknown) => items.filter(p => p.id === id)));
        if ((saved.group === "all" || items.some(p => p.group === saved.group))) setGroup(saved.group);
        if ([1,3,5,10].includes(saved.count)) setCount(saved.count);
        if (typeof saved.contiguous === "boolean") setContiguous(saved.contiguous);
        if (["name","kingdom","republic"].includes(saved.form)) setForm(saved.form);
      }
    } catch { /* Optional round restoration. */ }
    setReady(true);
  }, [items, key]);
  useEffect(() => { if (ready) try { sessionStorage.setItem(key, JSON.stringify({group,count,contiguous,form,seen,results:results.map(p=>p.id)})); } catch { /* No storage, no return restoration. */ } }, [ready,key,group,count,contiguous,form,seen,results]);
  const pool = pickerPool(kind, group, contiguous), remaining = pool.filter(p => !seen.includes(p.id)).length;
  const params = { action_surface: `${kind}_generator`, category: group, count, output_style: kind === "country" ? form : kind === "state" && contiguous ? "contiguous" : "all" };
  const itemLabel = kind === "country" ? "name" : kind;
  const pickLabel = results.length ? `Pick another${count > 1 ? ` ${count}` : ""}` : count > 1 ? `Pick ${count} ${itemLabel}s` : `Pick ${kind === "object" ? "an" : "a"} ${itemLabel}`;
  const display = (p: PickerItem) => kind === "country" ? countryDisplay(p.name,form) : p.name;
  function draw() {
    const next = pickItems(pool, seenRef.current, count); if (!next.length) return;
    track("generate_start",params);seenRef.current=[...seenRef.current,...next.map(p=>p.id)];setSeen(seenRef.current);setResults(next);setNotice("");track("generate_success",{...params,result_count:next.length});
  }
  function restart() {const next=pool[0];seenRef.current=next?[next.id]:[];setSeen(seenRef.current);setResults(next?[next]:[]);setNotice("Fresh round ready.");}
  async function copy(chosen: PickerItem[]) {
    if (busy.current) return;busy.current=true;
    try {await navigator.clipboard.writeText(chosen.map(p => kind === "state" ? `${p.name} (${p.id}) · ${groupLabels[p.group]}` : display(p)).join("\n"));setNotice("Copied. Paste the names wherever you need them.");track("copy_result",{...params,result_count:chosen.length});}
    catch {setNotice("Copy unavailable. Select the visible names and copy them manually.");track("copy_error",{...params,error_code:"clipboard_unavailable"});}finally{busy.current=false;}
  }
  return <section className="glass-card p-4 sm:p-6" aria-label="Random picker">
    {!results.length && remaining > 0 && <p role="status" className="text-sm text-[var(--text-secondary)]">Your filters are ready. Pick {count === 1 ? "a result" : "a batch"} to see your next {itemLabel}{count === 1 ? "" : "s"}.</p>}
    <div aria-live="polite" className="space-y-3">{results.map(p => <article key={p.id} data-item-id={p.id} className="p-4 sm:p-5 rounded-xl border border-[var(--neon-cyan)]/25">
      <p className="text-xs uppercase text-[var(--text-secondary)]">{kind === "country" ? "Fictional · " : ""}{groupLabels[p.group]}</p>
      <h2 className="text-2xl font-bold mt-2 break-words">{display(p)}{kind === "state" && <span className="ml-3 text-lg text-[var(--text-secondary)]">{p.id}</span>}</h2>
      {kind === "state" ? <details className="mt-3"><summary className="min-h-11 cursor-pointer text-[var(--neon-cyan)]">Reveal capital</summary><p className="text-sm">{p.capital}</p></details> : <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.detail}</p>}
      <button type="button" className="underline min-h-11 text-sm text-[var(--neon-cyan)]" onClick={()=>copy([p])}>Copy name</button>
    </article>)}</div>
    <div className="flex flex-wrap gap-4 items-center mt-4"><button type="button" className="btn-generate disabled:opacity-50 disabled:cursor-not-allowed" disabled={!ready || !remaining} onClick={draw}>{pickLabel}</button>{results.length>1&&<button type="button" className="underline min-h-11" onClick={()=>copy(results)}>Copy all names</button>}</div>
    <p role="status" className="text-sm mt-2">{notice}</p>
    <details className="mt-4 border-t border-white/10 pt-3"><summary className="cursor-pointer min-h-11 font-semibold">Filters &amp; number of results</summary><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
      <label className="text-sm">{kind === "state" ? "Census region" : kind === "country" ? "Name style" : "Object category"}<select aria-label={kind === "state" ? "Census region" : kind === "country" ? "Name style" : "Object category"} value={group} onChange={e=>{setGroup(e.target.value);setResults([]);setNotice("");}} className="block w-full rounded-xl border border-[var(--neon-cyan)]/25 bg-[var(--bg-primary)] p-3 mt-2"><option value="all">All {kind === "state" ? "regions" : kind === "country" ? "styles" : "categories"}</option>{groups.map(g=><option key={g} value={g}>{groupLabels[g]}</option>)}</select></label>
      <label className="text-sm">Number of results<select aria-label="Number of results" value={count} onChange={e=>setCount(Number(e.target.value))} className="block w-full rounded-xl border border-[var(--neon-cyan)]/25 bg-[var(--bg-primary)] p-3 mt-2">{[1,3,5,10].map(n=><option key={n}value={n}>{n}</option>)}</select></label>
    </div>
    {kind === "state" && <label className="flex gap-3 items-center min-h-11 mt-2"><input type="checkbox" checked={contiguous} onChange={e=>{setContiguous(e.target.checked);setResults([]);setNotice("");}} />Contiguous 48 states only</label>}
    {kind === "country" && <label className="block text-sm mt-3">Name form<select aria-label="Name form" value={form} onChange={e=>setForm(e.target.value)} className="block w-full rounded-xl border border-[var(--neon-cyan)]/25 bg-[var(--bg-primary)] p-3 mt-2"><option value="name">Name only</option><option value="kingdom">Kingdom of…</option><option value="republic">Republic of…</option></select></label>}
    <p className="mt-3 text-xs text-[var(--text-secondary)]">{remaining} of {pool.length} unseen choices remain. The starting example counts in this round. Changing filters{kind === "country" ? " or name form" : ""} does not reset it.</p></details>
    {remaining>0 && remaining<count && <p role="status" className="text-sm mt-3">Only {remaining} unseen choices remain; the next batch will contain {remaining}.</p>}
    {!pool.length ? <p role="status" className="text-sm mt-3">No choices match these filters. Broaden the selection.</p> : !remaining && ready ? <div className="mt-3"><p role="status">This selection is exhausted. Broaden the filters or start a fresh round.</p><button type="button" className="underline min-h-11" onClick={restart}>Start a fresh round</button></div> : null}
  </section>;
}
