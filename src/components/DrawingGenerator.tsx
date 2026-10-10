"use client";
import { useEffect, useRef, useState } from "react";
import { DRAWING_CATEGORIES, DRAWING_PROMPTS, DEFAULT_DRAWING_PROMPT, type DrawingPrompt } from "@/data/drawingPrompts";
import { drawingPool, pickDrawings } from "@/lib/drawing";
import DrawingReference from "@/components/DrawingReference";
import { track } from "@/lib/track";
const KEY = "rt_drawing_round_v1";
export default function DrawingGenerator() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [count, setCount] = useState(1);
  const [detailed, setDetailed] = useState(true);
  const [results, setResults] = useState<DrawingPrompt[]>([DEFAULT_DRAWING_PROMPT]);
  const [seen, setSeen] = useState<string[]>([DEFAULT_DRAWING_PROMPT.id]);
  const seenRef = useRef<string[]>([DEFAULT_DRAWING_PROMPT.id]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const copying = useRef(false);
  const drawRef = useRef<HTMLButtonElement>(null);
  const restoreDrawFocus = useRef(false);
  useEffect(() => {
    if (restoreDrawFocus.current) { drawRef.current?.focus({preventScroll: true}); restoreDrawFocus.current = false; }
  }, [results]);
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
        const restoredResults = Array.isArray(saved.results) ? [...new Set(saved.results.slice(0, 5))].flatMap((id: unknown) => DRAWING_PROMPTS.filter(p => p.id === id)) : [];
        setResults(restoredResults);
        // Migrate a previously empty untouched round without fabricating a generation event.
        if (!restored.length && !restoredResults.length) {
          const selected = drawingPool(saved.category || "all", saved.difficulty || "all");
          const starter = selected.find(p => p.difficulty === "easy") ?? selected[0];
          if (starter) { seenRef.current = [starter.id]; setSeen([starter.id]); setResults([starter]); }
        }
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
    restoreDrawFocus.current = document.activeElement === drawRef.current;
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
  function restart() {
    const starter = pool.find(p => p.difficulty === "easy") ?? pool[0];
    seenRef.current = starter ? [starter.id] : [];
    setSeen(seenRef.current); setResults(starter ? [starter] : []); setNotice("New round ready.");
  }
  const drawButton = <button ref={drawRef} type="button" className="btn-generate w-full sm:w-auto mt-4 disabled:opacity-50 disabled:cursor-not-allowed" onClick={generate} disabled={!ready || !remaining}>{count > 1 ? "Draw more ideas" : results.length ? "Draw another idea" : "Get a drawing idea"}</button>;
  return <section className="glass-card p-4 sm:p-6" aria-label="Drawing prompt generator">
    <div aria-live="polite" aria-atomic="true" className="space-y-4">{results.map((p, index) => <article key={p.id} className="rounded-xl border border-[var(--neon-cyan)]/20 p-4 sm:p-5" data-prompt-id={p.id}>
      <p className="text-xs uppercase text-[var(--text-secondary)]">{p.category} · {p.difficulty === "easy" ? "Simple shapes" : "More detail"}</p>
      <h2 className="text-xl sm:text-2xl font-bold mt-2">{p.text}</h2>
      {detailed && <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{p.hint}</p>}
      {index === 0 && drawButton}
      <DrawingReference id={p.id} subject={p.text} />
      <button type="button" className="mt-2 min-h-11 underline text-[var(--neon-cyan)]" onClick={() => copy(p)}>Copy drawing prompt</button>
    </article>)}</div>
    {!results.length && drawButton}
    <p role="status" className="mt-2 text-sm">{notice}</p>
    {!pool.length ? <p role="status" className="mt-3">No ideas match these filters. Try Any difficulty or All subjects.</p> : remaining === 0 && ready ? <div className="mt-3"><p role="status">You have seen every idea in this selection. Broaden your filters or start a fresh round.</p><button type="button" className="mt-3 underline min-h-11" onClick={restart}>Start a fresh round</button></div> : null}
    <details className="mt-4 border-t border-white/10 pt-3">
      <summary className="cursor-pointer min-h-11 font-semibold text-sm">Choose a subject, difficulty or more ideas</summary>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
        <label className="text-sm">Subject<select aria-label="Subject" className="block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={category} onChange={e => {setCategory(e.target.value); setResults([]); setNotice("");}}>
          <option value="all">All subjects</option>{DRAWING_CATEGORIES.map(c => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
        </select></label>
        <label className="text-sm">Difficulty<select aria-label="Difficulty" className="block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={difficulty} onChange={e => {setDifficulty(e.target.value); setResults([]); setNotice("");}}><option value="all">Any difficulty</option><option value="easy">Simple shapes</option><option value="challenge">More detail</option></select></label>
        <label className="text-sm">Ideas per draw<select aria-label="Ideas per draw" className="block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={count} onChange={e => setCount(Number(e.target.value))}>{[1,3,5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">{remaining} unseen ideas left in this selection. A round keeps your earlier ideas out, even after changing filters.</p>
    </details>
    <label className="flex items-center gap-3 mt-2 text-sm min-h-11"><input type="checkbox" checked={detailed} onChange={e => setDetailed(e.target.checked)} />Show a starting tip</label>
  </section>;
}
