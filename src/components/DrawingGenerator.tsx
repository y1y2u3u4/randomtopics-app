"use client";
import { useEffect, useRef, useState } from "react";
import { DRAWING_CATEGORIES, DRAWING_PROMPTS, type DrawingPrompt } from "@/data/drawingPrompts";
import { drawingPool, pickDrawings } from "@/lib/drawing";
import { track } from "@/lib/track";
const KEY = "rt_drawing_round_v1";
export default function DrawingGenerator() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [count, setCount] = useState(1);
  const [detailed, setDetailed] = useState(true);
  const [results, setResults] = useState<DrawingPrompt[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const seenRef = useRef<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const copying = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved) {
        const ids = new Set(DRAWING_PROMPTS.map(p => p.id));
        const restored = Array.isArray(saved.seen) ? [...new Set(saved.seen.filter((id: unknown) => typeof id === "string" && ids.has(id)))] as string[] : [];
        seenRef.current = restored; setSeen(restored);
        if (["all", ...DRAWING_CATEGORIES].includes(saved.category)) setCategory(saved.category);
        if (["all", "easy", "challenge"].includes(saved.difficulty)) setDifficulty(saved.difficulty);
        if ([1, 3, 5].includes(saved.count)) setCount(saved.count);
        if (typeof saved.detailed === "boolean") setDetailed(saved.detailed);
        if (Array.isArray(saved.results)) setResults(saved.results.slice(0, 5).flatMap((id: unknown) => DRAWING_PROMPTS.filter(p => p.id === id)));
      }
    } catch { /* Blocked or invalid storage: the tool still works. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({category, difficulty, count, detailed, seen, results: results.map(p => p.id)})); } catch { /* Optional tab-local restoration. */ }
  }, [ready, category, difficulty, count, detailed, seen, results]);
  const pool = drawingPool(category, difficulty);
  const remaining = pool.filter(p => !seen.includes(p.id)).length;
  const params = { action_surface: "drawing_generator", category, difficulty, count, output_style: detailed ? "detailed" : "quick" };
  function generate() {
    const chosen = pickDrawings(pool, seenRef.current, count);
    if (!chosen.length) return;
    track("generate_start", params);
    seenRef.current = [...seenRef.current, ...chosen.map(p => p.id)];
    setSeen(seenRef.current); setResults(chosen); setNotice("");
    track("generate_success", {...params, result_count: chosen.length});
  }
  async function copy(prompt: DrawingPrompt) {
    if (copying.current) return;
    copying.current = true;
    try {
      await navigator.clipboard.writeText(detailed ? `${prompt.text}
Sketch tip: ${prompt.hint}` : prompt.text);
      setNotice("Drawing prompt copied."); track("copy_result", {...params, result_count: 1});
    } catch { setNotice("Copy unavailable. Select the prompt text and copy it manually."); track("copy_error", {...params, error_code: "clipboard_unavailable"}); }
    finally { copying.current = false; }
  }
  return <section className="glass-card p-5 sm:p-8" aria-label="Drawing prompt generator">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <label className="text-sm">Subject<select aria-label="Subject" className="block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={category} onChange={e => {setCategory(e.target.value); setResults([]); setNotice("");}}>
        <option value="all">All subjects</option>{DRAWING_CATEGORIES.map(c => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
      </select></label>
      <label className="text-sm">Difficulty<select aria-label="Difficulty" className="block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={difficulty} onChange={e => {setDifficulty(e.target.value); setResults([]); setNotice("");}}><option value="all">Any difficulty</option><option value="easy">Easy shapes</option><option value="challenge">A little challenge</option></select></label>
      <label className="text-sm">Ideas per draw<select aria-label="Ideas per draw" className="block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={count} onChange={e => setCount(Number(e.target.value))}>{[1,3,5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
    </div>
    <label className="flex items-center gap-3 mt-5 text-sm min-h-11"><input type="checkbox" checked={detailed} onChange={e => setDetailed(e.target.checked)} />Include a sketch tip · uncheck for a quick idea</label>
    <button type="button" className="btn-generate w-full sm:w-auto mt-6 disabled:opacity-50 disabled:cursor-not-allowed" onClick={generate} disabled={!ready || !remaining}>Get drawing ideas</button>
    <p className="mt-3 text-sm text-[var(--text-muted)]">{remaining} of {pool.length} ideas left in this selection. No repeats within this tab&apos;s round, even when you change filters.</p>
    {!pool.length ? <p role="status" className="mt-3">No ideas match these filters. Try Any difficulty or All subjects.</p> : remaining === 0 && ready ? <div className="mt-3"><p role="status">You have drawn every idea in this selection. Broaden your filters or start a fresh round.</p><button type="button" className="mt-3 underline min-h-11" onClick={() => {seenRef.current=[];setSeen([]);setResults([]);setNotice("New round ready.");}}>Start a fresh round</button></div> : null}
    <div aria-live="polite" aria-atomic="true" className="mt-6 space-y-4">{results.map(p => <article key={p.id} className="rounded-xl border border-[var(--neon-cyan)]/20 p-5" data-prompt-id={p.id}><p className="text-xs uppercase text-[var(--text-muted)]">{p.category} · {p.difficulty === "easy" ? "Easy shapes" : "A little challenge"}</p><h2 className="text-xl font-bold mt-2">{p.text}</h2>{detailed && <p className="mt-2 text-sm text-[var(--text-muted)]">Sketch tip: {p.hint}</p>}<button type="button" className="mt-3 min-h-11 underline text-[var(--neon-cyan)]" onClick={() => copy(p)}>Copy drawing prompt</button></article>)}</div>
    <p role="status" className="mt-3 text-sm">{notice}</p>
  </section>;
}
