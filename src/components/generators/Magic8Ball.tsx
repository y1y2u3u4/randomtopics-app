"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng } from "@/lib/randomGenerators";
import { shareMagic8Image } from "@/lib/magic8ShareCanvas";
import {
  CLASSIC_ANSWERS, EMPTY_CUSTOM, EMPTY_STREAK, MAX_ANSWER_LENGTH, MAX_CUSTOM, answerPool, cleanCustom, dailyQuestion, dailyShareText,
  dateLabel, dayNumber, parseCustom, parseStreak, pickAnswer, recordDaily, resultText, streakOn,
  type BallAnswer, type CustomAnswers, type Streak,
} from "@/lib/magic8";

const TOOL = "magic_8_ball";
const K_CUSTOM = "rt_m8_custom", K_STREAK = "rt_m8_streak", K_DAILY = "rt_m8_daily";
const KIND_COLOR = { yes: "var(--neon-green)", maybe: "var(--neon-yellow)", no: "var(--neon-pink)" } as const;

function read(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } }
function write(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* storage blocked */ } }
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const randomUnit = () => { try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; } catch { return Math.random(); } };

export default function Magic8Ball() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<BallAnswer | null>(null);
  const [shown, setShown] = useState<BallAnswer | null>(null);
  const [shaking, setShaking] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: BallAnswer }[]>([]);
  const [custom, setCustom] = useState<CustomAnswers>(EMPTY_CUSTOM);
  const [draft, setDraft] = useState("");
  const [streak, setStreak] = useState<Streak>(EMPTY_STREAK);
  const [today, setToday] = useState(0);
  const [dailyAnswer, setDailyAnswer] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // Hydrate from localStorage and the UTC day after mount (server render has neither).
    /* eslint-disable react-hooks/set-state-in-effect */
    const d = dayNumber();
    setToday(d);
    setCustom(parseCustom(read(K_CUSTOM)));
    setStreak(parseStreak(read(K_STREAK)));
    try {
      const v = JSON.parse(read(K_DAILY) ?? "null") as { day?: number; a?: string } | null;
      if (v && v.day === d && typeof v.a === "string") setDailyAnswer(v.a);
    } catch { /* ignore */ }
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, []);

  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 2200); };
  const saveCustom = (c: CustomAnswers) => { setCustom(c); write(K_CUSTOM, JSON.stringify(c)); };

  const ask = () => {
    if (shaking) return;
    const a = pickAnswer(answerPool(custom), randomUnit);
    const q = question.trim();
    const reveal = () => {
      setAnswer(a);
      setShown(a);
      setShaking(false);
      setHistory((h) => [{ q, a }, ...h].slice(0, 8));
    };
    track("generate_success", { tool_type: TOOL, result_count: 1, locale: "en", mode: "ask" });
    track(`${TOOL}_use`, { tool_type: TOOL, mode: "ask", locale: "en" });
    if (reducedMotion()) { reveal(); return; }
    setShown(null);
    setShaking(true);
    timer.current = window.setTimeout(reveal, 1100);
  };

  const dailyQ = today ? dailyQuestion(today) : "";
  const shownStreak = streakOn(streak, today);
  const askDaily = () => {
    if (!today || dailyAnswer) return;
    const a = pickAnswer(CLASSIC_ANSWERS, createRng((today * 7919 + 13) >>> 0));
    const next = recordDaily(streak, today);
    setStreak(next);
    setDailyAnswer(a.text);
    write(K_STREAK, JSON.stringify(next));
    write(K_DAILY, JSON.stringify({ day: today, a: a.text }));
    track("generate_success", { tool_type: TOOL, result_count: 1, locale: "en", mode: "daily" });
    track(`${TOOL}_use`, { tool_type: TOOL, mode: "daily", locale: "en" });
  };

  const addCustom = () => {
    const next = cleanCustom([...custom.answers, draft]);
    if (next.length === custom.answers.length) { flash(draft.trim() ? "Already added, or the list is full" : "Type an answer first"); return; }
    saveCustom({ ...custom, answers: next });
    setDraft("");
  };
  const removeCustom = (t: string) => {
    const answers = custom.answers.filter((x) => x !== t);
    saveCustom({ answers, mode: answers.length ? custom.mode : "mix" });
  };

  const shareTarget = (): { q: string; a: string; sub?: string } | null =>
    answer ? { q: question.trim(), a: answer.text } : null;
  const copy = async (text: string) => {
    if (await copyText(text)) { flash("Copied ✓"); track("copy_result", { tool_type: TOOL, result_count: 1, locale: "en" }); }
  };
  const shareText = async (text: string) => {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Magic 8 Ball", text, url: "https://randomtopics.app/magic-8-ball" });
        track("share_click", { tool_type: TOOL, share_method: "native", locale: "en" });
        track(`${TOOL}_share`, { tool_type: TOOL, share_method: "native", locale: "en" });
        return;
      }
    } catch { /* cancelled */ }
    if (await copyText(text)) {
      flash("Copied, ready to paste ✓");
      track("share_click", { tool_type: TOOL, share_method: "copy_link", locale: "en" });
      track(`${TOOL}_share`, { tool_type: TOOL, share_method: "copy_link", locale: "en" });
    }
  };
  const shareImage = async (q: string, a: string, sub?: string) => {
    try {
      const r = await shareMagic8Image(q, a, sub);
      flash(r === "shared" ? "Image ready ✓" : "Image downloaded ✓");
      track("share_click", { tool_type: TOOL, share_method: "image", locale: "en" });
      track(`${TOOL}_share`, { tool_type: TOOL, share_method: "image", locale: "en" });
    } catch { flash("Could not create the image"); }
  };

  const btn = "rounded-lg border border-white/15 px-3 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60 hover:text-[var(--text-primary)]";
  const target = shareTarget();
  const windowText = shaking ? "" : shown?.text ?? "Ask me";
  const fontSize = windowText.length > 18 ? "clamp(11px,3vw,15px)" : "clamp(13px,3.6vw,18px)";

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6" data-magic8-tool>
      <style>{`
        @keyframes m8shake{0%,100%{transform:translate(0,0) rotate(0)}10%{transform:translate(-14px,6px) rotate(-8deg)}20%{transform:translate(12px,-8px) rotate(7deg)}30%{transform:translate(-10px,-6px) rotate(-6deg)}40%{transform:translate(14px,8px) rotate(8deg)}50%{transform:translate(-12px,4px) rotate(-7deg)}60%{transform:translate(10px,-6px) rotate(5deg)}70%{transform:translate(-8px,6px) rotate(-4deg)}80%{transform:translate(6px,-4px) rotate(3deg)}90%{transform:translate(-3px,2px) rotate(-1deg)}}
        @keyframes m8float{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}
        .m8-ball.m8-shaking{animation:m8shake 1.05s ease-in-out}
        .m8-ans{animation:m8float .6s ease-out both}
        @media (prefers-reduced-motion:reduce){.m8-ball.m8-shaking{animation:none}.m8-ans{animation:none}}
      `}</style>
      <div className="rounded-2xl border p-4 sm:p-6" style={{ borderColor: "rgba(0,229,255,0.3)", background: "rgba(14,14,26,0.7)" }}>
        <label className="block text-xs text-[var(--text-muted)]" htmlFor="m8-q">Your yes/no question</label>
        <input
          id="m8-q" value={question} maxLength={140} placeholder="Will I have a good day?"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
          className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--bg-secondary)] px-3 py-2 text-base text-[var(--text-primary)] focus:border-[var(--neon-cyan)] focus:outline-none"
        />

        <div className="mt-4 flex justify-center">
          <button
            type="button" onClick={ask} aria-label="Shake the Magic 8 Ball" data-m8-ball
            className={`m8-ball relative aspect-square w-[min(62vw,250px)] rounded-full ${shaking ? "m8-shaking" : ""}`}
            style={{ background: "radial-gradient(circle at 32% 28%, #5a5a70 0%, #17171f 38%, #000 100%)", boxShadow: "0 18px 40px rgba(0,0,0,.55), 0 0 0 2px rgba(255,255,255,.06)" }}
          >
            <span className="absolute left-1/2 top-[9%] flex h-[17%] w-[17%] -translate-x-1/2 items-center justify-center rounded-full bg-white text-lg font-extrabold text-black" aria-hidden>8</span>
            <span
              className="absolute left-1/2 top-[38%] flex h-[42%] w-[56%] -translate-x-1/2 items-center justify-center px-2 text-center font-bold leading-tight"
              style={{ background: "#1a2a8a", clipPath: "polygon(50% 0, 100% 100%, 0 100%)", color: shown ? KIND_COLOR[shown.kind] : "#E8EEFF", fontSize, paddingTop: "34%" }}
              aria-hidden
            >
              <span key={windowText} className="m8-ans">{windowText}</span>
            </span>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">{answer && !shaking ? `The ball says: ${answer.text}` : ""}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={ask} disabled={shaking} className="rounded-lg px-5 py-2.5 text-sm font-bold text-black disabled:opacity-60" style={{ background: "var(--neon-cyan)" }}>
            {shaking ? "Shaking…" : answer ? "Shake again" : "Shake the ball"}
          </button>
          {target && !shaking && (
            <>
              <button type="button" className={btn} onClick={() => copy(resultText(target.q, target.a))}>Copy</button>
              <button type="button" className={btn} onClick={() => shareText(resultText(target.q, target.a))}>Share</button>
              <button type="button" className={btn} onClick={() => shareImage(target.q, target.a)}>Save image</button>
            </>
          )}
        </div>
        <p className="mt-2 min-h-5 text-center text-xs text-[var(--text-muted)]" role="status">{note}</p>

        {history.length > 1 && (
          <details className="mt-2 text-sm text-[var(--text-secondary)]">
            <summary className="cursor-pointer text-xs text-[var(--text-muted)]">Recent answers ({history.length})</summary>
            <ul className="mt-2 space-y-1">
              {history.map((h, i) => (
                <li key={i} className="flex gap-2"><span style={{ color: KIND_COLOR[h.a.kind] }}>●</span><span>{h.q ? `${h.q} ` : ""}<strong className="text-[var(--text-primary)]">{h.a.text}</strong></span></li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: "rgba(255,226,52,0.3)", background: "rgba(14,14,26,0.7)" }} data-m8-daily>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--neon-yellow)" }}>Question of the day</h2>
          <span className="text-xs text-[var(--text-muted)]">{today ? dateLabel(today) : ""}{shownStreak.count > 0 ? ` · 🔥 ${shownStreak.count}-day streak` : ""}{shownStreak.best > 1 ? ` · best ${shownStreak.best}` : ""}</span>
        </div>
        <p className="mt-2 text-base text-[var(--text-primary)]">{dailyQ || "Loading today's question…"}</p>
        {dailyAnswer ? (
          <div className="mt-3">
            <p className="text-lg font-bold" aria-live="polite">🎱 {dailyAnswer}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Everyone gets the same answer today. Come back tomorrow for a new question.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className={btn} onClick={() => shareText(dailyShareText(today, dailyQ, dailyAnswer, shownStreak.count))}>Share</button>
              <button type="button" className={btn} onClick={() => copy(dailyShareText(today, dailyQ, dailyAnswer, shownStreak.count))}>Copy</button>
              <button type="button" className={btn} onClick={() => shareImage(dailyQ, dailyAnswer, `Question of the day · ${dateLabel(today)}`)}>Save image</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={askDaily} disabled={!today} className="mt-3 rounded-lg px-4 py-2 text-sm font-bold text-black disabled:opacity-60" style={{ background: "var(--neon-yellow)" }}>Ask the ball</button>
        )}
      </div>

      <details className="mt-4 rounded-2xl border border-white/10 p-4" data-m8-custom open={custom.answers.length > 0}>
        <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">Custom answers ({custom.answers.length}/{MAX_CUSTOM})</summary>
        <p className="mt-2 text-xs text-[var(--text-muted)]">Add your own answers for party games or inside jokes. They are saved on this device only.</p>
        <div className="mt-2 flex gap-2">
          <input
            value={draft} maxLength={MAX_ANSWER_LENGTH} placeholder="e.g. Ask your mom" aria-label="New custom answer"
            onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--neon-cyan)] focus:outline-none"
          />
          <button type="button" className={btn} onClick={addCustom}>Add</button>
        </div>
        {custom.answers.length > 0 && (
          <>
            <ul className="mt-3 flex flex-wrap gap-2">
              {custom.answers.map((t) => (
                <li key={t} className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-sm text-[var(--text-primary)]">
                  {t}
                  <button type="button" aria-label={`Remove ${t}`} className="ml-1 text-[var(--text-muted)] hover:text-[var(--neon-pink)]" onClick={() => removeCustom(t)}>×</button>
                </li>
              ))}
            </ul>
            <div role="group" aria-label="How to use custom answers" className="mt-3 flex gap-2 text-sm">
              {([["mix", "Mix with the 20 classics"], ["only", "Use only mine"]] as const).map(([m, label]) => (
                <button
                  key={m} type="button" aria-pressed={custom.mode === m} onClick={() => saveCustom({ ...custom, mode: m })}
                  className={`rounded-lg border px-2.5 py-1.5 ${custom.mode === m ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)]"}`}
                >{label}</button>
              ))}
              <button type="button" className={`${btn} ml-auto`} onClick={() => saveCustom(EMPTY_CUSTOM)}>Clear</button>
            </div>
          </>
        )}
      </details>
    </section>
  );
}
