"use client";

import { useMemo, useState } from "react";
import SpinWheel, { type WheelSegment } from "./SpinWheel";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";
import { secureInt } from "@/lib/generators/secure";

type Mode = "yesno" | "maybe";
type YesNoLocale = "en" | "es";
const COLORS = { yes: "#2ec27e", no: "#ef4b5f", maybe: "#ffb020" } as const;
const YES_NO_UI = {
  en: {
    yes: "Yes", no: "No", maybe: "Maybe",
    yesNo: "Yes / No", yesNoMaybe: "Yes / No / Maybe",
    type: "Wheel type",
    placeholder: "Type your question (optional) — Should I order pizza?",
    question: "Your question (optional)",
    spinAgain: "Spin again", spin: "Spin the wheel", spinning: "Spinning…",
    idle: "Ask a question, then spin",
    copied: "Copied ✓", share: "Share this result",
    spinWord: (n: number) => (n === 1 ? "spin" : "spins"),
    latest: "Latest first:", reset: "Reset tally",
    fair: "Every slice has the same chance. The answer is chosen first with your device's secure random generator, then the wheel turns to show it.",
    shareLine: (asked: string, answer: string, url: string) => `${asked ? `“${asked}” ` : ""}The wheel says: ${answer}! Spin your own: ${url}`,
  },
  es: {
    yes: "Sí", no: "No", maybe: "Tal vez",
    yesNo: "Sí / No", yesNoMaybe: "Sí / No / Tal vez",
    type: "Tipo de ruleta",
    placeholder: "Escribe tu pregunta (opcional) — ¿Pido pizza?",
    question: "Tu pregunta (opcional)",
    spinAgain: "Girar otra vez", spin: "Girar la ruleta", spinning: "Girando…",
    idle: "Haz una pregunta y gira",
    copied: "Copiado ✓", share: "Compartir este resultado",
    spinWord: (n: number) => (n === 1 ? "giro" : "giros"),
    latest: "Lo más reciente primero:", reset: "Reiniciar el conteo",
    fair: "Cada casilla tiene la misma probabilidad. La respuesta se elige primero con el generador aleatorio seguro de tu dispositivo y después la ruleta gira para mostrarla.",
    shareLine: (asked: string, answer: string, url: string) => `${asked ? `“${asked}” ` : ""}La ruleta dice: ${answer}. Gira la tuya: ${url}`,
  },
} as const;

export default function YesNoWheel({ locale = "en" }: { locale?: YesNoLocale } = {}) {
  const ui = YES_NO_UI[locale];
  const ev = { tool_type: "yes_or_no_wheel", locale };
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
    const base = mode === "yesno" ? (["yes", "no"] as const) : (["yes", "no", "maybe"] as const);
    return Array.from({ length: mode === "yesno" ? 10 : 9 }, (_, i) => { const key = base[i % base.length]; return { label: ui[key], color: COLORS[key] }; });
  }, [mode, ui]);

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
    const line = ui.shareLine(asked, answer, `${window.location.origin}${window.location.pathname}`);
    if (await copyText(line)) { setCopied(true); window.setTimeout(() => setCopied(false), 1500); track("copy_result", ev); track("yes_or_no_wheel_share", { ...ev, share_method: "copy", mode }); }
  };
  const chip = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const labels = mode === "yesno" ? [ui.yes, ui.no] : [ui.yes, ui.no, ui.maybe];
  const spun = Object.values(tally).reduce((a, b) => a + b, 0);

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-8 text-center">
        <div className="flex justify-center gap-2 mb-4" role="group" aria-label={ui.type}>
          <button type="button" aria-pressed={mode === "yesno"} disabled={spinning} className={chip(mode === "yesno")} onClick={() => { setMode("yesno"); setAnswer(""); }}>{ui.yesNo}</button>
          <button type="button" aria-pressed={mode === "maybe"} disabled={spinning} className={chip(mode === "maybe")} onClick={() => { setMode("maybe"); setAnswer(""); }}>{ui.yesNoMaybe}</button>
        </div>
        <label className="block text-left">
          <span className="sr-only">{ui.question}</span>
          <input value={question} onChange={(e) => setQuestion(e.target.value.slice(0, 140))} onKeyDown={(e) => { if (e.key === "Enter") spin(); }} disabled={spinning} placeholder={ui.placeholder}
            className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-base text-[var(--text-primary)] mb-3" />
        </label>
        <button type="button" className="btn-generate" disabled={spinning} onClick={spin}>🎡 {answer ? ui.spinAgain : ui.spin}</button>
        <div className="mt-3 min-h-20" aria-live="polite">
          {spinning ? <p className="text-xl text-[var(--text-muted)]">{ui.spinning}</p>
            : answer ? (
              <>
                {asked && <p className="text-sm text-[var(--text-muted)] break-words">“{asked}”</p>}
                <p className="text-5xl sm:text-6xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: answer === ui.yes ? COLORS.yes : answer === ui.no ? COLORS.no : COLORS.maybe }} data-yn-result>{answer}!</p>
                <button type="button" className="mt-2 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50" onClick={shareResult}>{copied ? ui.copied : ui.share}</button>
              </>
            ) : <p className="text-[var(--text-muted)]">{ui.idle}</p>}
        </div>
        <div className="max-w-[min(300px,80vw)] sm:max-w-[min(380px,86vw)] mx-auto">
          <SpinWheel segments={segments} target={target} onDone={done} ariaLabel={`${labels.join(" or ")} wheel`} />
        </div>
        {spun > 0 && (
          <div className="mt-4 text-sm text-[var(--text-secondary)]" data-yn-tally>
            <p>{labels.map((l) => `${l}: ${tally[l] ?? 0} (${Math.round(((tally[l] ?? 0) / spun) * 100)}%)`).join(" · ")} · {spun} {ui.spinWord(spun)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{ui.latest} {recent.join(" → ")}</p>
            <button type="button" className="mt-1 text-xs text-[var(--text-muted)] hover:text-white" onClick={() => { setTally({}); setRecent([]); setAnswer(""); }}>{ui.reset}</button>
          </div>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-3">{ui.fair}</p>
      </div>
    </section>
  );
}
