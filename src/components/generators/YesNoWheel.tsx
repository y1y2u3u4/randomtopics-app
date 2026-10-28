"use client";

import { useMemo, useState } from "react";
import SpinWheel, { type WheelSegment } from "./SpinWheel";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";
import { secureInt } from "@/lib/generators/secure";

type Mode = "yesno" | "maybe";
const ev = { tool_type: "yes_or_no_wheel", locale: "en" };
const COLORS = { Yes: "#2ec27e", No: "#ef4b5f", Maybe: "#ffb020" } as const;

export default function YesNoWheel() {
  const [mode, setMode] = useState<Mode>("yesno");
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [target, setTarget] = useState<{ index: number; nonce: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [answer, setAnswer] = useState("");
  const [tally, setTally] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const segments = useMemo<WheelSegment[]>(() => {
    const base = mode === "yesno" ? (["Yes", "No"] as const) : (["Yes", "No", "Maybe"] as const);
    return Array.from({ length: mode === "yesno" ? 10 : 9 }, (_, i) => { const label = base[i % base.length]; return { label, color: COLORS[label] }; });
  }, [mode]);

  const spin = () => {
    if (spinning) return;
    setAnswer("");
    setAsked(question.trim());
    setSpinning(true);
    setTarget({ index: secureInt(segments.length), nonce: Date.now() });
  };
  const done = (i: number) => {
    const a = segments[i].label;
    setAnswer(a);
    setSpinning(false);
    setTally((t) => ({ ...t, [a]: (t[a] ?? 0) + 1 }));
    setRecent((r) => [a, ...r].slice(0, 12));
    track("generate_success", { ...ev, result_count: 1, mode });
    track("yes_or_no_wheel_use", { ...ev, result_count: 1, mode });
  };
  const shareResult = async () => {
    const line = `${asked ? `“${asked}” ` : ""}The wheel says: ${answer}! Spin your own: ${window.location.origin}/yes-or-no-wheel`;
    if (await copyText(line)) { setCopied(true); window.setTimeout(() => setCopied(false), 1500); track("copy_result", ev); track("yes_or_no_wheel_share", { ...ev, share_method: "copy", mode }); }
  };
  const chip = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const labels = mode === "yesno" ? ["Yes", "No"] : ["Yes", "No", "Maybe"];
  const spun = Object.values(tally).reduce((a, b) => a + b, 0);

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-8 text-center">
        <div className="flex justify-center gap-2 mb-4" role="group" aria-label="Wheel type">
          <button type="button" aria-pressed={mode === "yesno"} disabled={spinning} className={chip(mode === "yesno")} onClick={() => { setMode("yesno"); setAnswer(""); }}>Yes / No</button>
          <button type="button" aria-pressed={mode === "maybe"} disabled={spinning} className={chip(mode === "maybe")} onClick={() => { setMode("maybe"); setAnswer(""); }}>Yes / No / Maybe</button>
        </div>
        <label className="block text-left">
          <span className="sr-only">Your question (optional)</span>
          <input value={question} onChange={(e) => setQuestion(e.target.value.slice(0, 140))} onKeyDown={(e) => { if (e.key === "Enter") spin(); }} disabled={spinning} placeholder="Type your question (optional) — Should I order pizza?"
            className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-base text-[var(--text-primary)] mb-3" />
        </label>
        <button type="button" className="btn-generate" disabled={spinning} onClick={spin}>🎡 {answer ? "Spin again" : "Spin the wheel"}</button>
        <div className="mt-3 min-h-20" aria-live="polite">
          {spinning ? <p className="text-xl text-[var(--text-muted)]">Spinning…</p>
            : answer ? (
              <>
                {asked && <p className="text-sm text-[var(--text-muted)] break-words">“{asked}”</p>}
                <p className="text-5xl sm:text-6xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: COLORS[answer as keyof typeof COLORS] }} data-yn-result>{answer}!</p>
                <button type="button" className="mt-2 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50" onClick={shareResult}>{copied ? "Copied ✓" : "Share this result"}</button>
              </>
            ) : <p className="text-[var(--text-muted)]">Ask a question, then spin</p>}
        </div>
        <div className="max-w-[min(300px,80vw)] sm:max-w-[min(380px,86vw)] mx-auto">
          <SpinWheel segments={segments} target={target} onDone={done} ariaLabel={`${labels.join(" or ")} wheel`} />
        </div>
        {spun > 0 && (
          <div className="mt-4 text-sm text-[var(--text-secondary)]" data-yn-tally>
            <p>{labels.map((l) => `${l}: ${tally[l] ?? 0} (${Math.round(((tally[l] ?? 0) / spun) * 100)}%)`).join(" · ")} · {spun} {spun === 1 ? "spin" : "spins"}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Latest first: {recent.join(" → ")}</p>
            <button type="button" className="mt-1 text-xs text-[var(--text-muted)] hover:text-white" onClick={() => { setTally({}); setRecent([]); setAnswer(""); }}>Reset tally</button>
          </div>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-3">Every slice has the same chance. The answer is chosen first with your device&apos;s secure random generator, then the wheel turns to show it.</p>
      </div>
    </section>
  );
}
