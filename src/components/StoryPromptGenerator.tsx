"use client";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_STORY_PROMPT, STORY_AUDIENCES, STORY_CHALLENGES, STORY_GENRES, STORY_LENGTHS, STORY_PROMPTS, type StoryPrompt } from "@/data/storyPrompts";
import { drawUnseen } from "@/lib/topicPool";
import GeneratedResultActions from "@/components/GeneratedResultActions";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";
import { track } from "@/lib/track";

const KEY = "rt_story_round_v1";
const selectClass = "block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25";
const genreLabel = (id: string) => STORY_GENRES.find(g => g.id === id)?.label ?? id;
const audienceLabel = (id: string) => STORY_AUDIENCES.find(a => a.id === id)?.label ?? id;
const lengthLabel = (id: string) => STORY_LENGTHS.find(l => l.id === id)?.label ?? id;

export function storyPool(genre: string, audience: string, length: string) {
  return STORY_PROMPTS.filter(p => (genre === "all" || p.genre === genre) && (audience === "all" || p.audience === audience) && (length === "all" || p.length === length));
}

function challengeFor(prompt: StoryPrompt) {
  const options = STORY_CHALLENGES.filter(c => c.audiences.includes(prompt.audience));
  // Stable per prompt, so a restored round shows the same challenge.
  const n = Number(prompt.id.slice(3)) || 0;
  return options[(n * 7) % options.length].text;
}

/** Same prompt for every visitor on a local date (kids/teens/adults rotate). */
export function dailyStoryPrompt(d: Date) {
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
  return STORY_PROMPTS[((day * 37) % STORY_PROMPTS.length + STORY_PROMPTS.length) % STORY_PROMPTS.length];
}

export default function StoryPromptGenerator() {
  const [genre, setGenre] = useState("all");
  const [audience, setAudience] = useState("all");
  const [length, setLength] = useState("all");
  const [count, setCount] = useState(1);
  const [challenge, setChallenge] = useState(false);
  const [results, setResults] = useState<StoryPrompt[]>([DEFAULT_STORY_PROMPT]);
  const seenRef = useRef<Set<string>>(new Set([DEFAULT_STORY_PROMPT.id]));
  const [seen, setSeen] = useState<string[]>([DEFAULT_STORY_PROMPT.id]);
  const [ready, setReady] = useState(false);
  const drawRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (restoreFocus.current) { drawRef.current?.focus({ preventScroll: true }); restoreFocus.current = false; }
  }, [results]);
  /* eslint-disable react-hooks/set-state-in-effect -- one-time restore of this tab's round from sessionStorage */
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved) {
        const ids = new Set(STORY_PROMPTS.map(p => p.id));
        if (Array.isArray(saved.seen)) seenRef.current = new Set(saved.seen.filter((id: unknown) => typeof id === "string" && ids.has(id)));
        if (["all", ...STORY_GENRES.map(g => g.id)].includes(saved.genre)) setGenre(saved.genre);
        if (["all", ...STORY_AUDIENCES.map(a => a.id)].includes(saved.audience)) setAudience(saved.audience);
        if (["all", ...STORY_LENGTHS.map(l => l.id)].includes(saved.length)) setLength(saved.length);
        if ([1, 3, 5].includes(saved.count)) setCount(saved.count);
        if (typeof saved.challenge === "boolean") setChallenge(saved.challenge);
        const restored = Array.isArray(saved.results) ? saved.results.slice(0, 5).flatMap((id: unknown) => STORY_PROMPTS.filter(p => p.id === id)) : [];
        if (restored.length) setResults(restored);
      }
    } catch { /* Blocked or invalid storage: the tool still works. */ }
    setSeen([...seenRef.current]);
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ genre, audience, length, count, challenge, seen, results: results.map(p => p.id) })); } catch { /* Optional tab-local restoration. */ }
  }, [ready, genre, audience, length, count, challenge, results, seen]);

  const pool = storyPool(genre, audience, length);
  const seenSet = new Set(seen);
  const remaining = pool.filter(p => !seenSet.has(p.id)).length;
  const params = { action_surface: "story_prompt_generator", genre, audience, length, count };
  function showDaily() {
    const daily = dailyStoryPrompt(new Date());
    seenRef.current = new Set([...seenRef.current, daily.id]);
    setSeen([...seenRef.current]);
    setResults([daily]);
    track("story_daily_prompt", { action_surface: "story_prompt_generator", genre: daily.genre, audience: daily.audience });
  }
  function generate() {
    if (!pool.length) return;
    restoreFocus.current = document.activeElement === drawRef.current;
    track("generate_start", params);
    const { picked, used } = drawUnseen(pool, seenRef.current, p => p.id, count);
    seenRef.current = used;
    setSeen([...used]);
    setResults(picked);
    track("generate_success", { ...params, result_count: picked.length });
  }
  const changeFilter = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => { set(e.target.value); };
  const copyText = (p: StoryPrompt) => challenge ? `${p.text}\nChallenge: ${challengeFor(p)}` : p.text;
  const filterSummary = [genre === "all" ? "All genres" : genreLabel(genre), audience === "all" ? "All ages" : audienceLabel(audience), length === "all" ? "Any length" : lengthLabel(length)].join(" · ");

  return <section className="glass-card p-4 sm:p-6" aria-label="Story prompt generator">
    <div aria-live="polite" aria-atomic="true" className="space-y-4">
      {results.map(p => <article key={p.id} className="rounded-xl border border-[var(--neon-cyan)]/20 p-4 sm:p-5" data-prompt-id={p.id}>
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{genreLabel(p.genre)} · {audienceLabel(p.audience)} · {lengthLabel(p.length)}</p>
        <h2 className="text-lg sm:text-xl font-bold mt-2 leading-snug">{p.text}</h2>
        {challenge && <p className="mt-2 text-sm text-[var(--neon-cyan)]"><strong>Challenge:</strong> {challengeFor(p)}</p>}
        <div className="mt-3">
          <GeneratedResultActions text={p.text} copyValue={copyText(p)} shareTitle="Story prompt" copyLabel="Copy prompt" toolType="story_prompt" contentSource="story_prompts" actionSurface="story_prompt_generator" compact showSavedLink
            saveTopic={{ id: `story-${p.id}`, text: p.text, category: "art-culture", modes: ["writing"], depth: p.length === "long" ? "deep" : p.length === "short" ? "medium" : "light", talkingPoints: challenge ? [`Challenge: ${challengeFor(p)}`] : [] }} />
        </div>
      </article>)}
    </div>
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <button ref={drawRef} type="button" className="btn-generate w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" onClick={generate} disabled={!ready || !pool.length}>
        {count > 1 ? `Get ${count} story prompts` : "Get a story prompt"}
      </button>
      <label className="text-sm flex items-center gap-2 min-h-11">Per draw<select aria-label="Prompts per draw" className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25" value={count} onChange={e => setCount(Number(e.target.value))}>{[1, 3, 5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
      <label className="flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={challenge} onChange={e => setChallenge(e.target.checked)} />Add a writing challenge</label>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <button type="button" className="min-h-11 font-semibold text-[var(--neon-yellow)] underline underline-offset-4" onClick={showDaily}>📅 Today&apos;s story prompt</button>
      <Link href="/question-of-the-day" className="min-h-11 inline-flex items-center text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => track("story_qotd_entry_click", { action_surface: "story_prompt_generator" })}>☀️ Answer today&apos;s question of the day →</Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 border-t border-white/10 pt-4">
      <label className="text-sm font-semibold">Genre<select aria-label="Genre" className={selectClass} value={genre} onChange={changeFilter(setGenre)}>
        <option value="all">All genres</option>{STORY_GENRES.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.label}</option>)}
      </select></label>
      <label className="text-sm font-semibold">Age group<select aria-label="Age group" className={selectClass} value={audience} onChange={changeFilter(setAudience)}>
        <option value="all">All ages</option>{STORY_AUDIENCES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
      </select></label>
      <label className="text-sm font-semibold">Length<select aria-label="Length" className={selectClass} value={length} onChange={changeFilter(setLength)}>
        <option value="all">Any length</option>{STORY_LENGTHS.map(l => <option key={l.id} value={l.id}>{l.label} ({l.words})</option>)}
      </select></label>
    </div>
    {audience !== "all" && <p className="mt-2 text-xs text-[var(--text-secondary)]">{STORY_AUDIENCES.find(a => a.id === audience)?.note}.</p>}
    {!pool.length ? <p role="status" className="mt-3 text-sm">No prompts match this mix. Try Any length or All genres (romance is only written for teens and adults).</p>
      : <p className="mt-3 text-xs text-[var(--text-secondary)]">{remaining} unseen prompts in this selection ({pool.length} total). No repeats until you have seen them all.</p>}
    {pool.length > 0 && <div className="mt-4 border-t border-white/10 pt-3">
      <PrintButton heading={`Story prompts: ${filterSummary}`} intro="Pick one, set a timer, and write. From randomtopics.app/story-prompt-generator"
        items={pool.map(copyText)} label={`🖨️ Print all ${pool.length} prompts in this selection`} />
    </div>}
  </section>;
}
