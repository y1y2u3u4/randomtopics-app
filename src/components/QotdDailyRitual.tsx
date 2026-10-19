"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { qotdChoices } from "@/data/qotdAnswers";
import { localDayKey, previousDayKey } from "@/lib/qotd/vote";
import { track } from "@/lib/track";

// Daily ritual under today's question: answer (anonymous vote), see how
// everyone answered, keep a streak, share a card, and a countdown to the
// next question. Everything personal stays in this browser.
const ANSWERS_KEY = "rt-qotd-answers", STREAK_KEY = "rt-qotd-streak", VOTER_KEY = "rt-qotd-voter";
type Answer = { q: number; choice: number };
type Streak = { last: string; count: number; best: number };

function read<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) || "null") as T | null; } catch { return null; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Blocked storage: this visit still works. */ }
}
function voterId() {
  let id: string | null = null;
  try { id = localStorage.getItem(VOTER_KEY); } catch { /* fall through */ }
  if (!id || !/^[a-f0-9-]{16,64}$/i.test(id)) {
    id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
    try { localStorage.setItem(VOTER_KEY, id); } catch { /* per-visit id */ }
  }
  return id;
}
/** Streak as it stands today: a missed day shows 0 until the next answer. */
function currentStreak(streak: Streak | null, today: string): Streak {
  if (!streak || typeof streak.count !== "number") return { last: "", count: 0, best: 0 };
  const alive = streak.last === today || streak.last === previousDayKey(today);
  return { last: streak.last, count: alive ? streak.count : 0, best: streak.best || streak.count };
}
function untilMidnight(now: Date) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const s = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

async function shareCardBlob(question: string, answer: string, dateLabel: string, streak: number, agreed: number | null) {
  const size = 1080, canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, "#0b1026"); bg.addColorStop(0.55, "#1d1145"); bg.addColorStop(1, "#3b0d3a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
  const glow = ctx.createRadialGradient(size * 0.85, size * 0.1, 0, size * 0.85, size * 0.1, 520);
  glow.addColorStop(0, "rgba(0,229,255,0.28)"); glow.addColorStop(1, "rgba(0,229,255,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, size, size);
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  ctx.fillStyle = "#00e5ff"; ctx.font = `700 34px ${font}`;
  ctx.fillText(`QUESTION OF THE DAY · ${dateLabel.toUpperCase()}`, 80, 130);
  ctx.fillStyle = "#ffffff"; ctx.font = `700 64px ${font}`;
  const qLines = wrap(ctx, question, size - 160).slice(0, 6);
  qLines.forEach((line, i) => ctx.fillText(line, 80, 240 + i * 80));
  const top = 240 + qLines.length * 80 + 50;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath(); ctx.roundRect(80, top, size - 160, 190, 28); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.65)"; ctx.font = `600 32px ${font}`;
  ctx.fillText("My answer", 120, top + 62);
  ctx.fillStyle = "#ffd166"; ctx.font = `700 52px ${font}`;
  ctx.fillText(wrap(ctx, answer, size - 240)[0] ?? answer, 120, top + 135);
  ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = `500 34px ${font}`;
  const facts = [agreed !== null ? `${agreed}% answered the same` : "", streak > 1 ? `🔥 ${streak}-day streak` : ""].filter(Boolean).join("   ·   ");
  if (facts) ctx.fillText(facts, 80, top + 270);
  ctx.fillStyle = "#ffffff"; ctx.font = `700 36px ${font}`;
  ctx.fillText("What's yours? randomtopics.app/question-of-the-day", 80, size - 90);
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

export default function QotdDailyRitual({ questionIndex, question, dateLabel, source = "qotd_hub" }: { questionIndex: number; question: string; dateLabel: string; source?: string }) {
  const choices = qotdChoices(questionIndex);
  const [day, setDay] = useState("");
  const [mine, setMine] = useState<number | null>(null);
  const [counts, setCounts] = useState<number[] | null>(null);
  const [resultsDown, setResultsDown] = useState(false);
  const [streak, setStreak] = useState<Streak>({ last: "", count: 0, best: 0 });
  const [countdown, setCountdown] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const loadCounts = useCallback(async (key: string) => {
    try {
      const res = await fetch(`/api/qotd/vote?day=${key}&q=${questionIndex}`);
      if (!res.ok) throw new Error(String(res.status));
      setCounts((await res.json()).counts); setResultsDown(false);
    } catch { setResultsDown(true); }
  }, [questionIndex]);

  // Read this browser's answer and streak after hydration; refresh the
  // countdown every second only while the page is visible.
  useEffect(() => {
    const sync = () => {
      const key = localDayKey();
      setDay(key);
      const saved = read<Record<string, Answer>>(ANSWERS_KEY)?.[key];
      setMine(saved && saved.q === questionIndex ? saved.choice : null);
      setStreak(currentStreak(read<Streak>(STREAK_KEY), key));
    };
    const tick = () => { if (!document.hidden) setCountdown(untilMidnight(new Date())); };
    const first = window.setTimeout(() => { sync(); tick(); }, 0);
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearTimeout(first); window.clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [questionIndex]);

  // Show everyone's answers once the visitor has answered, fetched only when
  // the panel is near the screen (no request in the page's critical path).
  useEffect(() => {
    if (mine === null || !day || counts || !rootRef.current) return;
    const el = rootRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { observer.disconnect(); void loadCounts(day); }
    }, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mine, day, counts, loadCounts]);

  async function answer(choice: number) {
    if (busy) return;
    const key = localDayKey();
    setBusy(true); setDay(key); setMine(choice); setStatus("");
    const answers = read<Record<string, Answer>>(ANSWERS_KEY) ?? {};
    const first = !answers[key];
    answers[key] = { q: questionIndex, choice };
    write(ANSWERS_KEY, Object.fromEntries(Object.entries(answers).sort().slice(-14)));
    if (first) {
      const before = currentStreak(read<Streak>(STREAK_KEY), key);
      const count = before.last === key ? before.count : before.count + 1;
      const next = { last: key, count, best: Math.max(before.best, count) };
      write(STREAK_KEY, next); setStreak(next);
    }
    track("qotd_answer", { tool_type: "question_of_the_day", content_source: source, answer_choice: choice, first_today: first, streak_days: first ? streak.count + 1 : streak.count, locale: "en" });
    try {
      const res = await fetch("/api/qotd/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ day: key, q: questionIndex, choice, voter: voterId() }) });
      if (!res.ok) throw new Error(String(res.status));
      setCounts((await res.json()).counts); setResultsDown(false);
    } catch { setResultsDown(true); }
    finally { setBusy(false); }
  }

  const total = counts?.reduce((a, b) => a + b, 0) ?? 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const top = counts && total ? counts.indexOf(Math.max(...counts)) : -1;

  async function shareCard() {
    if (mine === null) return;
    const blob = await shareCardBlob(question, choices[mine], dateLabel, streak.count, counts && total ? pct(counts[mine]) : null);
    if (!blob) { setStatus("This browser cannot create the image."); return; }
    const file = new File([blob], `question-of-the-day-${day}.png`, { type: "image/png" });
    const text = `Question of the day: ${question}\nMy answer: ${choices[mine]}\nWhat's yours? https://randomtopics.app/question-of-the-day`;
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text });
        track("qotd_share_card", { tool_type: "question_of_the_day", content_source: source, share_method: "native", locale: "en" });
        return;
      }
    } catch (error) { if ((error as Error)?.name === "AbortError") return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = file.name; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Card saved as an image. Post it with your answer.");
    track("qotd_share_card", { tool_type: "question_of_the_day", content_source: source, share_method: "download", locale: "en" });
  }

  if (!choices.length) return null;
  return <div ref={rootRef} className="mt-5 rounded-2xl border border-[var(--neon-cyan)]/20 p-4 sm:p-5" data-qotd-ritual>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-bold">{mine === null ? "Your answer today" : "How everyone answered today"}</h3>
      <p className="text-xs text-[var(--text-secondary)] min-h-5" data-qotd-streak>{streak.count > 0 ? `🔥 ${streak.count}-day streak${streak.best > streak.count ? ` · best ${streak.best}` : ""}` : day ? "Answer today to start a streak" : ""}</p>
    </div>
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Answer choices">
      {choices.map((label, i) => {
        const chosen = mine === i, showBar = mine !== null && counts && total > 0;
        return <button key={label} type="button" onClick={() => answer(i)} disabled={busy} aria-pressed={chosen}
          className={`relative min-h-11 overflow-hidden rounded-xl border px-3 py-2 text-left text-sm transition-colors ${chosen ? "border-[var(--neon-cyan)] text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"}`}>
          {showBar && <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-[rgba(0,229,255,0.12)]" style={{ width: `${pct(counts[i])}%` }} />}
          <span className="relative flex items-center justify-between gap-2"><span>{chosen ? "✓ " : ""}{label}{showBar && top === i ? " · top answer" : ""}</span>{showBar && <span className="text-xs font-semibold">{pct(counts[i])}%</span>}</span>
        </button>;
      })}
    </div>
    {mine !== null && <div className="mt-3 text-xs text-[var(--text-muted)]" role="status">
      {counts && total > 0 ? `${total.toLocaleString("en-US")} anonymous ${total === 1 ? "answer" : "answers"} so far today. Tap another choice to change yours.` : resultsDown ? "Everyone's answers are not available right now; yours is saved in this browser." : "Counting answers…"}
    </div>}
    {mine !== null && <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={shareCard} className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/40 px-4 py-2 text-sm font-semibold text-[var(--neon-cyan)]">🖼️ Share my answer card</button>
    </div>}
    <p className="mt-2 text-xs text-[var(--neon-cyan)]" role="status">{status}</p>
    <p className="mt-3 border-t border-white/10 pt-3 text-xs text-[var(--text-secondary)]">
      ⏳ Tomorrow&apos;s question unlocks at midnight{countdown ? <> in <span className="font-mono font-semibold text-[var(--text-primary)]" data-qotd-countdown>{countdown}</span></> : null}. Come back to keep your streak.
    </p>
    <p className="mt-1 text-[11px] text-[var(--text-muted)]">Answers are anonymous and counted once per browser. Your streak and answer stay on this device.</p>
  </div>;
}
