"use client";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/data/types";
import { drawUnseen } from "@/lib/topicPool";
import GeneratedResultActions from "@/components/GeneratedResultActions";
import PrintButton from "@/components/PrintButton";
import { track } from "@/lib/track";

export interface DeckItem { id: string; text: string; group: string; detail?: string }
export interface DeckGroup { id: string; label: string; emoji?: string }

const selectClass = "block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25";
// Letters with few everyday words; Scattergories dice leave most of them out.
const HARD_LETTERS = new Set(["Q", "U", "V", "X", "Y", "Z"]);
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Same item for every visitor on a local date. */
export function dailyDeckItem<T>(items: T[], d: Date, salt = 37): T {
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
  return items[((day * salt) % items.length + items.length) % items.length];
}

/**
 * Filterable no-repeat generator for a fixed, editor-written deck. The round
 * (filters, seen ids, results) is kept for this browser tab only.
 */
export default function DeckGenerator({ storageKey, items, groups, noun, toolType, saveCategory, printHeading, letterRoll = false, dailyLabel, dailySalt = 37, counts = [1, 3, 5] }: {
  storageKey: string;
  items: DeckItem[];
  groups: DeckGroup[];
  noun: string;
  toolType: string;
  saveCategory: Category;
  printHeading: string;
  letterRoll?: boolean;
  dailyLabel?: string;
  dailySalt?: number;
  counts?: number[];
}) {
  const [group, setGroup] = useState("all");
  const [count, setCount] = useState(counts[0]);
  const [results, setResults] = useState<DeckItem[]>([items[0]]);
  const [letter, setLetter] = useState<string | null>(null);
  const [easyLetters, setEasyLetters] = useState(true);
  const seenRef = useRef<Set<string>>(new Set([items[0].id]));
  const [seen, setSeen] = useState<string[]>([items[0].id]);
  const [ready, setReady] = useState(false);
  const drawRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (restoreFocus.current) { drawRef.current?.focus({ preventScroll: true }); restoreFocus.current = false; }
  }, [results]);
  /* eslint-disable react-hooks/set-state-in-effect -- one-time restore of this tab's round from sessionStorage */
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (saved) {
        const ids = new Set(items.map(p => p.id));
        if (Array.isArray(saved.seen)) seenRef.current = new Set(saved.seen.filter((id: unknown) => typeof id === "string" && ids.has(id)));
        if (["all", ...groups.map(g => g.id)].includes(saved.group)) setGroup(saved.group);
        if (counts.includes(saved.count)) setCount(saved.count);
        if (typeof saved.letter === "string" && ALL_LETTERS.includes(saved.letter)) setLetter(saved.letter);
        if (typeof saved.easyLetters === "boolean") setEasyLetters(saved.easyLetters);
        const restored = Array.isArray(saved.results) ? saved.results.slice(0, 10).flatMap((id: unknown) => items.filter(p => p.id === id)) : [];
        if (restored.length) setResults(restored);
      }
    } catch { /* Blocked or invalid storage: the tool still works. */ }
    setSeen([...seenRef.current]);
    setReady(true);
  }, [storageKey, items, groups, counts]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify({ group, count, letter, easyLetters, seen, results: results.map(p => p.id) })); } catch { /* Optional tab-local restoration. */ }
  }, [ready, storageKey, group, count, letter, easyLetters, results, seen]);

  const pool = group === "all" ? items : items.filter(p => p.group === group);
  const seenSet = new Set(seen);
  const remaining = pool.filter(p => !seenSet.has(p.id)).length;
  const groupLabel = (id: string) => groups.find(g => g.id === id)?.label ?? id;
  const params = { action_surface: toolType, category: group, count };
  const rollLetter = () => {
    const letters = easyLetters ? ALL_LETTERS.filter(l => !HARD_LETTERS.has(l)) : ALL_LETTERS;
    const next = letters[Math.floor(Math.random() * letters.length)];
    setLetter(next);
    return next;
  };
  function generate() {
    if (!pool.length) return;
    restoreFocus.current = document.activeElement === drawRef.current;
    track("generate_start", params);
    const { picked, used } = drawUnseen(pool, seenRef.current, p => p.id, count);
    seenRef.current = used;
    setSeen([...used]);
    setResults(picked);
    if (letterRoll) rollLetter();
    track("generate_success", { ...params, result_count: picked.length });
  }
  function showDaily() {
    const daily = dailyDeckItem(items, new Date(), dailySalt);
    seenRef.current = new Set([...seenRef.current, daily.id]);
    setSeen([...seenRef.current]);
    setResults([daily]);
    track(`${toolType}_daily`, { action_surface: toolType });
  }
  const copyValue = (p: DeckItem) => [letter && letterRoll ? `${p.text} (letter ${letter})` : p.text, p.detail].filter(Boolean).join("\n");

  return <section className="glass-card p-4 sm:p-6" aria-label={`${noun} generator`}>
    {letterRoll && <div className="flex flex-wrap items-center gap-3 mb-4">
      <p className="text-sm text-[var(--text-secondary)]">Letter</p>
      <p aria-live="polite" className="text-4xl font-extrabold w-14 h-14 grid place-items-center rounded-xl border border-[var(--neon-yellow)]/40 text-[var(--neon-yellow)]">{letter ?? "?"}</p>
      <button type="button" className="min-h-11 text-sm underline underline-offset-4 text-[var(--neon-cyan)]" onClick={() => { const l = rollLetter(); track("category_letter_roll", { action_surface: toolType, letter: l }); }}>Roll a new letter</button>
      <label className="flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={easyLetters} onChange={e => setEasyLetters(e.target.checked)} />Skip Q, U, V, X, Y, Z</label>
    </div>}
    <div aria-live="polite" aria-atomic="true" className="space-y-4">
      {results.map(p => <article key={p.id} className="rounded-xl border border-[var(--neon-cyan)]/20 p-4 sm:p-5" data-item-id={p.id}>
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{groupLabel(p.group)}</p>
        <h2 className="text-lg sm:text-xl font-bold mt-2 leading-snug">{p.text}</h2>
        {p.detail && <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.detail}</p>}
        <div className="mt-3">
          <GeneratedResultActions text={p.text} copyValue={copyValue(p)} shareTitle={noun} copyLabel="Copy" toolType={toolType} contentSource={toolType} actionSurface={toolType} compact showSavedLink
            saveTopic={{ id: `${toolType}-${p.id}`, text: p.text, category: saveCategory, modes: ["conversation"], depth: "medium", talkingPoints: p.detail ? [p.detail] : [] }} />
        </div>
      </article>)}
    </div>
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <button ref={drawRef} type="button" className="btn-generate w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" onClick={generate} disabled={!ready || !pool.length}>
        {count > 1 ? `Get ${count} more` : `Get a random ${noun.toLowerCase()}`}
      </button>
      {counts.length > 1 && <label className="text-sm flex items-center gap-2 min-h-11">Per draw<select aria-label="Results per draw" className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={count} onChange={e => setCount(Number(e.target.value))}>{counts.map(n => <option key={n} value={n}>{n}</option>)}</select></label>}
      {dailyLabel && <button type="button" className="min-h-11 font-semibold text-[var(--neon-yellow)] underline underline-offset-4 text-sm" onClick={showDaily}>📅 {dailyLabel}</button>}
    </div>
    <div className="mt-5 border-t border-white/10 pt-4">
      <label className="text-sm font-semibold block sm:max-w-xs">Type<select aria-label="Type" className={selectClass} value={group} onChange={e => setGroup(e.target.value)}>
        <option value="all">All ({items.length})</option>{groups.map(g => <option key={g.id} value={g.id}>{g.emoji ? `${g.emoji} ` : ""}{g.label} ({items.filter(p => p.group === g.id).length})</option>)}
      </select></label>
    </div>
    <p className="mt-3 text-xs text-[var(--text-secondary)]">{remaining} unseen in this selection ({pool.length} total). No repeats until you have seen them all.</p>
    <div className="mt-4 border-t border-white/10 pt-3">
      <PrintButton heading={`${printHeading}${group === "all" ? "" : `: ${groupLabel(group)}`}`} intro="From randomtopics.app" items={pool.map(p => p.detail ? `${p.text} — ${p.detail}` : p.text)} label={`🖨️ Print all ${pool.length} in this selection`} />
    </div>
  </section>;
}
