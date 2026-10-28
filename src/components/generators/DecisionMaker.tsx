"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { typingTarget, usePreset } from "./QuickSet";
import { DAILY_DECISIONS, DEFAULT_PRESET, PRESETS, dailyIndex } from "@/data/decisionMaker";

type Mode = "wheel" | "lots" | "yesno";
interface Option { label: string; weight: number }
interface Decision { mode: Mode; question: string; answer: string; options: string[] }

const STORAGE = "rt_decision_maker_v1";
const HISTORY = "rt_decision_history_v1";
const MAX_OPTIONS = 24;
// Muted gouache palette shared with the page illustration and the share card.
const COLORS = ["#D9774B", "#E7B43C", "#8DB596", "#A99BD6", "#4A6FA5", "#E58FA3", "#C9A27E", "#6FB3B8"];
const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "wheel", label: "🎡 Wheel", hint: "Spin your options" },
  { id: "lots", label: "🥢 Draw lots", hint: "Pull a stick, no repeats" },
  { id: "yesno", label: "🪙 Yes or no", hint: "Flip for one question" },
];
const ev = { tool_type: "decision_maker", locale: "en" };
const CX = 160, CY = 160, R = 150;

const toOptions = (labels: string[]): Option[] => labels.map((label) => ({ label, weight: 1 }));
function pointOnCircle(deg: number, radius: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: Math.round((CX + radius * Math.cos(a)) * 100) / 100, y: Math.round((CY + radius * Math.sin(a)) * 100) / 100 };
}
function slicePath(start: number, end: number) {
  if (end - start >= 359.99) return `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R} Z`;
  const p0 = pointOnCircle(start, R), p1 = pointOnCircle(end, R);
  return `M ${CX} ${CY} L ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${R} ${R} 0 ${end - start > 180 ? 1 : 0} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Z`;
}
function weightedPick(options: Option[]): number {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < options.length; i++) { r -= options[i].weight; if (r < 0) return i; }
  return options.length - 1;
}
const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

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

async function shareCardBlob(d: Decision) {
  const size = 1080, canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#F3EFE6"; ctx.fillRect(0, 0, size, size);
  // Wedge fan in the corner, echoing the wheel.
  COLORS.forEach((c, i) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(size, 0);
    ctx.arc(size, 0, 330, Math.PI / 2 + (i * Math.PI) / 2 / COLORS.length, Math.PI / 2 + ((i + 1) * Math.PI) / 2 / COLORS.length); ctx.fill();
  });
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  ctx.fillStyle = "#6b5bd2"; ctx.font = `700 32px ${font}`;
  ctx.fillText(d.mode === "yesno" ? "THE COIN SAYS" : d.mode === "lots" ? "THE LOT SAYS" : "THE WHEEL SAYS", 80, 140);
  ctx.fillStyle = "#1f2433"; ctx.font = `700 56px ${font}`;
  const qLines = wrap(ctx, d.question || "Decision made", size - 400).slice(0, 4);
  qLines.forEach((l, i) => ctx.fillText(l, 80, 230 + i * 70));
  const top = 230 + qLines.length * 70 + 40;
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.roundRect(80, top, size - 160, 230, 32); ctx.fill();
  ctx.fillStyle = "#D9774B"; ctx.font = `800 ${d.answer.length > 16 ? 72 : 104}px ${font}`;
  ctx.fillText(wrap(ctx, d.answer, size - 240)[0] ?? d.answer, 120, top + 150);
  if (d.mode !== "yesno") {
    ctx.fillStyle = "#454b5c"; ctx.font = `500 30px ${font}`;
    const rest = d.options.filter((o) => o !== d.answer).slice(0, 6).join(" · ");
    wrap(ctx, `Beat: ${rest}`, size - 160).slice(0, 2).forEach((l, i) => ctx.fillText(l, 80, top + 300 + i * 44));
  }
  ctx.fillStyle = "#1f2433"; ctx.font = `700 34px ${font}`;
  ctx.fillText("Can't decide? randomtopics.app/decision-maker", 80, size - 90);
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

export default function DecisionMaker() {
  const [question, setQuestion] = useState(DEFAULT_PRESET.question);
  const [options, setOptions] = useState<Option[]>(toOptions(DEFAULT_PRESET.options));
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<Mode>("wheel");
  const [rotation, setRotation] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Decision | null>(null);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [noRepeat, setNoRepeat] = useState(true);
  const [maybe, setMaybe] = useState(false);
  const [coin, setCoin] = useState<string | null>(null);
  const [history, setHistory] = useState<Decision[]>([]);
  const [daily, setDaily] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toolRef = useRef<HTMLDivElement>(null);

  // Restore this device's list (or a shared link) after hydration.
  useEffect(() => {
    const restore = () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const shared = hash.get("o")?.split("|").map((s) => s.trim()).filter(Boolean).slice(0, MAX_OPTIONS);
        if (shared && shared.length >= 2) {
          setOptions(toOptions(shared.map((s) => clip(s, 40))));
          setQuestion(clip(hash.get("q") ?? "", 120));
          const m = hash.get("m");
          if (m === "wheel" || m === "lots" || m === "yesno") setMode(m);
          track("decision_link_open", { ...ev, option_count: shared.length });
        } else {
          const saved = JSON.parse(localStorage.getItem(STORAGE) || "null");
          if (saved && Array.isArray(saved.options) && saved.options.length) {
            setOptions(saved.options.filter((o: Option) => typeof o?.label === "string").slice(0, MAX_OPTIONS).map((o: Option) => ({ label: clip(o.label, 40), weight: [1, 2, 3].includes(o.weight) ? o.weight : 1 })));
            if (typeof saved.question === "string") setQuestion(saved.question);
            if (["wheel", "lots", "yesno"].includes(saved.mode)) setMode(saved.mode);
          }
        }
        const h = JSON.parse(localStorage.getItem(HISTORY) || "[]");
        if (Array.isArray(h)) setHistory(h.slice(0, 6));
      } catch { /* storage blocked: start from the default list */ }
      setDaily(dailyIndex());
      setReady(true);
    };
    void Promise.resolve().then(restore);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE, JSON.stringify({ question, options, mode })); } catch { /* storage blocked */ }
  }, [ready, question, options, mode]);

  const total = options.reduce((s, o) => s + o.weight, 0);
  const weighted = options.some((o) => o.weight > 1);
  const slices = options.reduce<{ start: number; end: number }[]>((acc, o) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    return [...acc, { start, end: start + (o.weight / total) * 360 }];
  }, []);
  const pool = mode === "lots" && noRepeat ? options.filter((o) => !drawn.includes(o.label)) : options;
  const canDecide = mode === "yesno" || options.length >= 2;

  function resetRound() { setDrawn([]); setResult(null); setCoin(null); }
  function addOptions(raw: string) {
    const parts = raw.split(/[\n,]/).map((s) => clip(s.trim(), 40)).filter(Boolean);
    if (!parts.length) return;
    setOptions((cur) => [...cur, ...toOptions(parts.filter((p) => !cur.some((o) => o.label.toLowerCase() === p.toLowerCase())))].slice(0, MAX_OPTIONS));
    setDraft(""); resetRound();
  }
  const removeOption = (i: number) => { setOptions((cur) => cur.filter((_, j) => j !== i)); resetRound(); };
  const cycleWeight = (i: number) => setOptions((cur) => cur.map((o, j) => (j === i ? { ...o, weight: o.weight === 3 ? 1 : o.weight + 1 } : o)));
  function loadList(q: string, labels: string[], source: string) {
    setQuestion(q); setOptions(toOptions(labels)); resetRound(); setStatus("");
    if (labels.length === 2 && mode === "yesno") setMode("wheel");
    track("decision_list_load", { ...ev, content_source: source, option_count: labels.length });
  }

  function finish(d: Decision) {
    setResult(d); setBusy(false);
    setHistory((h) => {
      const next = [d, ...h].slice(0, 6);
      try { localStorage.setItem(HISTORY, JSON.stringify(next)); } catch { /* storage blocked */ }
      return next;
    });
    track("generate_success", { ...ev, decision_mode: d.mode, option_count: d.options.length, weighted, result_count: 1 });
    track("decision_maker_use", { ...ev, decision_mode: d.mode, option_count: d.options.length, weighted, result_count: 1 });
  }

  function decide() {
    if (busy || !canDecide) return;
    const labels = options.map((o) => o.label);
    track("generate_start", { ...ev, decision_mode: mode, option_count: labels.length, weighted });
    setResult(null); setStatus(""); setBusy(true);
    const fast = reducedMotion();
    if (mode === "wheel") {
      const win = weightedPick(options);
      const s = slices[win];
      const target = s.start + (s.end - s.start) * (0.2 + Math.random() * 0.6);
      const finalMod = (360 - target) % 360;
      const currentMod = ((rotation % 360) + 360) % 360;
      let delta = finalMod - currentMod;
      if (delta < 0) delta += 360;
      setRotation((r) => r + delta + (fast ? 0 : 360 * 5));
      timer.current = setTimeout(() => finish({ mode, question, answer: options[win].label, options: labels }), fast ? 50 : 4200);
    } else if (mode === "lots") {
      let left = pool;
      if (!left.length) { setDrawn([]); left = options; }
      const win = left[weightedPick(left)].label;
      timer.current = setTimeout(() => {
        if (noRepeat) setDrawn((d) => (d.length >= options.length ? [win] : [...d, win]));
        finish({ mode, question, answer: win, options: labels });
      }, fast ? 50 : 1100);
    } else {
      const faces = maybe ? ["Yes", "No", "Maybe"] : ["Yes", "No"];
      const answer = faces[Math.floor(Math.random() * faces.length)];
      setCoin(null);
      timer.current = setTimeout(() => { setCoin(answer); finish({ mode, question, answer, options: faces }); }, fast ? 50 : 1300);
    }
  }

  // QuickSet presets in the page copy: load the setup, then decide once it has rendered.
  const [pending, setPending] = useState(0);
  usePreset("decision", (id) => {
    if (busy) return;
    if (id === "yesno") { setMode("yesno"); setQuestion(""); resetRound(); }
    else if (id === "two") { setMode("wheel"); loadList("Stay in or go out?", ["Stay in", "Go out"], "section_two"); }
    else if (id === "weighted") { setMode("wheel"); setQuestion("What should we eat tonight?"); setOptions([{ label: "Pizza", weight: 3 }, { label: "Tacos", weight: 1 }, { label: "Salad", weight: 1 }]); resetRound(); }
    else if (id === "lots") { setMode("lots"); loadList(DEFAULT_PRESET.question, DEFAULT_PRESET.options, "section_lots"); }
    else return;
    setPending((n) => n + 1);
  });
  const decideRef = useRef<() => void>(() => {});
  useEffect(() => { decideRef.current = decide; });
  useEffect(() => { if (pending) decideRef.current(); }, [pending]);
  // Space or Enter decides when focus is not in a field.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !typingTarget(e.target) && !e.metaKey && !e.ctrlKey) { e.preventDefault(); decideRef.current(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const shareUrl = () => {
    const p = new URLSearchParams({ q: question, o: options.map((o) => o.label).join("|"), m: mode });
    return `${window.location.origin}/decision-maker#${p.toString()}`;
  };
  async function copyLink() {
    const ok = await copyText(shareUrl());
    setStatus(ok ? "Link copied — friends open the same options and can spin for themselves." : "Copy blocked. Copy the address bar instead.");
    track(ok ? "share_result" : "copy_error", { ...ev, share_method: "link", decision_mode: mode });
    if (ok) track("decision_maker_share", { ...ev, share_method: "link", decision_mode: mode });
  }
  async function copyResult() {
    if (!result) return;
    const ok = await copyText(`${result.question ? `${result.question} → ` : ""}${result.answer} (decided at randomtopics.app/decision-maker)`);
    setStatus(ok ? "Copied." : "Copy blocked. Select the answer and copy it manually.");
    track(ok ? "copy_result" : "copy_error", { ...ev, decision_mode: result.mode });
    if (ok) track("decision_maker_share", { ...ev, share_method: "copy", decision_mode: result.mode });
  }
  async function shareCard() {
    if (!result) return;
    const blob = await shareCardBlob(result);
    if (!blob) { setStatus("Your browser can't draw the card."); return; }
    const file = new File([blob], "my-decision.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${result.question} → ${result.answer}` });
        track("share_result", { ...ev, share_method: "native_card", decision_mode: result.mode });
        track("decision_maker_share", { ...ev, share_method: "native_card", decision_mode: result.mode });
        return;
      }
    } catch { /* share sheet dismissed: fall back to download */ }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "my-decision.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setStatus("Card saved — post it or send it to the group chat.");
    track("share_result", { ...ev, share_method: "download_card", decision_mode: result.mode });
    track("decision_maker_share", { ...ev, share_method: "download_card", decision_mode: result.mode });
  }

  const today = daily === null ? null : DAILY_DECISIONS[daily];
  const btnLabel = busy ? (mode === "wheel" ? "Spinning…" : mode === "lots" ? "Shaking the cup…" : "Flipping…")
    : mode === "wheel" ? "Spin the wheel" : mode === "lots" ? (pool.length ? "Draw a lot" : "Refill & draw") : "Flip yes or no";

  return (
    <section id="tool" className="max-w-4xl mx-auto px-4 sm:px-6 pb-6 scroll-mt-20" aria-label="Decision maker">
      <div ref={toolRef} className="glass-card p-4 sm:p-6 scroll-mt-24">
        <div role="tablist" aria-label="Decision mode" className="grid grid-cols-3 gap-2 mb-4">
          {MODES.map((m) => (
            <button key={m.id} type="button" role="tab" aria-selected={mode === m.id} disabled={busy}
              onClick={() => { setMode(m.id); setResult(null); setCoin(null); track("decision_mode_select", { ...ev, decision_mode: m.id }); }}
              className={`min-h-12 rounded-xl border px-2 py-2 text-sm font-semibold transition-all ${mode === m.id ? "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.1)] text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-white/25"}`}>
              {m.label}<span className="hidden sm:block text-[11px] font-normal text-[var(--text-muted)]">{m.hint}</span>
            </button>
          ))}
        </div>

        <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)]" htmlFor="dm-question">Your question</label>
        <div className="mt-1 flex flex-col sm:flex-row gap-3">
        <input id="dm-question" value={question} maxLength={120} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); decide(); } }}
          placeholder={mode === "yesno" ? "Should I text them back?" : "What should we eat tonight?"}
          className="min-w-0 flex-1 rounded-xl border border-[var(--neon-cyan)]/25 bg-[var(--bg-primary)] p-3 text-base" />
          <button type="button" onClick={decide} disabled={busy || !canDecide} className="btn-generate w-full sm:w-auto sm:min-w-52 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">{btnLabel}</button>
        </div>
        {!canDecide && <p role="status" className="text-sm mt-2">Add at least two options.</p>}

        <div className="grid md:grid-cols-[1fr_1.05fr] gap-6 mt-5 items-center">
          {/* Stage: wheel, cup of lots or coin. Fixed square so nothing shifts. */}
          <div className="relative mx-auto w-full max-w-[320px] aspect-square">
            {mode === "wheel" && (
              <>
                <svg viewBox="0 0 320 320" className="w-full h-full" role="img" aria-label={`Wheel with ${options.length} options`}>
                  <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "160px 160px", transition: busy ? "transform 4.1s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
                    {options.length === 0 && <circle cx={CX} cy={CY} r={R} fill="#2a2f45" />}
                    {options.map((o, i) => {
                      const s = slices[i], mid = (s.start + s.end) / 2, p = pointOnCircle(mid, R * 0.6);
                      return (
                        <g key={`${o.label}-${i}`}>
                          <path d={slicePath(s.start, s.end)} fill={COLORS[i % COLORS.length]} stroke="#F3EFE6" strokeWidth="2" />
                          <text x={p.x} y={p.y} fill="#1f2433" fontSize={options.length > 12 ? 10 : 13} fontWeight="700" textAnchor="middle" dominantBaseline="middle"
                            transform={`rotate(${mid - 90 + (mid > 180 ? 180 : 0)} ${p.x} ${p.y})`}>{clip(o.label, options.length > 10 ? 10 : 14)}</text>
                        </g>
                      );
                    })}
                  </g>
                  <circle cx={CX} cy={CY} r="20" fill="#F3EFE6" stroke="#1f2433" strokeWidth="3" />
                  <path d="M160 2 L148 26 L172 26 Z" fill="#1f2433" />
                </svg>
              </>
            )}
            {mode === "lots" && (
              <svg viewBox="0 0 320 320" className={`w-full h-full ${busy ? "dm-shake" : ""}`} role="img" aria-label={`Cup with ${pool.length} lots left`}>
                {Array.from({ length: Math.min(Math.max(pool.length, 1), 12) }).map((_, i, arr) => {
                  const x = 110 + (100 / Math.max(arr.length - 1, 1)) * i, tilt = (i - (arr.length - 1) / 2) * 4;
                  return <rect key={i} x={x - 5} y={60 + (i % 3) * 10} width="10" height="150" rx="5" fill="#E8D6B5" stroke="#1f2433" strokeWidth="2" transform={`rotate(${tilt} ${x} 230)`} />;
                })}
                <path d="M85 150 L235 150 L218 290 Q160 305 102 290 Z" fill="#4A6FA5" stroke="#1f2433" strokeWidth="3" />
                <path d="M100 190 Q160 205 222 190" stroke="#E7B43C" strokeWidth="6" fill="none" />
                {result?.mode === "lots" && !busy && (
                  <g>
                    <rect x="60" y="18" width="200" height="56" rx="12" fill="#ffffff" stroke="#D9774B" strokeWidth="3" />
                    <text x="160" y="47" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="800" fill="#D9774B">{clip(result.answer, 16)}</text>
                  </g>
                )}
              </svg>
            )}
            {mode === "yesno" && (
              <div className="w-full h-full flex items-center justify-center [perspective:800px]">
                <div className={`w-56 h-56 rounded-full flex items-center justify-center text-5xl font-extrabold shadow-xl border-8 ${busy ? "dm-flip" : ""} ${coin === "No" ? "bg-[#D9774B] border-[#b85f37]" : coin === "Maybe" ? "bg-[#A99BD6] border-[#8b7cc0]" : "bg-[#E7B43C] border-[#c9962a]"} text-[#1f2433]`}
                  aria-live="polite">{busy ? "?" : coin ?? "?"}</div>
              </div>
            )}
          </div>

          <div>
            {mode !== "yesno" ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Options ({options.length}/{MAX_OPTIONS})</p>
                  {weighted && <p className="text-xs text-[var(--neon-cyan)]">Weighted</p>}
                </div>
                <ul className="mt-2 flex flex-wrap gap-2" aria-label="Options">
                  {options.map((o, i) => (
                    <li key={`${o.label}-${i}`} className={`flex items-center gap-1 rounded-full border pl-3 pr-1 py-1 text-sm ${mode === "lots" && drawn.includes(o.label) ? "opacity-40 line-through border-white/10" : "border-white/15"}`}>
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} aria-hidden="true" />
                      <span className="max-w-[12rem] truncate">{o.label}</span>
                      <button type="button" onClick={() => cycleWeight(i)} className="min-w-8 min-h-8 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--neon-cyan)]" aria-label={`Weight of ${o.label}: ${o.weight}. Change`}>×{o.weight}</button>
                      <button type="button" onClick={() => removeOption(i)} className="min-w-8 min-h-8 rounded-full text-[var(--text-muted)] hover:text-white" aria-label={`Remove ${o.label}`}>✕</button>
                    </li>
                  ))}
                </ul>
                <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); addOptions(draft); }}>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add an option (or paste a list)" aria-label="Add an option"
                    className="flex-1 min-w-0 rounded-xl border border-white/15 bg-[var(--bg-primary)] p-3 text-base" />
                  <button type="submit" className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/40 px-4 text-sm font-semibold text-[var(--neon-cyan)]">Add</button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {PRESETS.map((p) => (
                    <button key={p.id} type="button" onClick={() => loadList(p.question, p.options, `preset_${p.id}`)} className="min-h-9 rounded-full border border-white/10 px-3 text-[var(--text-secondary)] hover:border-white/30">{p.label}</button>
                  ))}
                  <button type="button" onClick={() => { setOptions([]); resetRound(); }} className="min-h-9 rounded-full px-3 text-[var(--text-muted)] underline">Clear</button>
                </div>
                {mode === "lots" && (
                  <label className="mt-3 flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={noRepeat} onChange={(e) => { setNoRepeat(e.target.checked); setDrawn([]); }} />
                    No repeats — drawn lots stay out ({pool.length} left)</label>
                )}
                <p className="mt-2 text-xs text-[var(--text-muted)]">Tap ×1 to give an option 2× or 3× the chance.</p>
              </>
            ) : (
              <div className="text-sm text-[var(--text-secondary)] space-y-3">
                <p>Type a yes-or-no question above, then flip. Each answer has an equal chance.</p>
                <label className="flex items-center gap-2 min-h-11"><input type="checkbox" checked={maybe} onChange={(e) => setMaybe(e.target.checked)} /> Add “Maybe” as a third answer</label>
                <p className="text-xs text-[var(--text-muted)]">Tip: if you feel relieved or disappointed by the answer, that is your real choice.</p>
              </div>
            )}

          </div>
        </div>

        <div aria-live="polite" className="min-h-[7.5rem] mt-5">
          {result && !busy && (
            <div className="rounded-2xl border border-[#E7B43C]/50 bg-[rgba(231,180,60,0.08)] p-4 sm:p-5">
              {result.question && <p className="text-sm text-[var(--text-secondary)]">{result.question}</p>}
              <p className="text-3xl sm:text-4xl font-extrabold mt-1 text-[var(--text-primary)] break-words" style={{ fontFamily: "var(--font-display)" }}>{result.answer}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <button type="button" onClick={decide} className="min-h-11 underline text-[var(--neon-cyan)]">Decide again</button>
                <button type="button" onClick={shareCard} className="min-h-11 underline text-[var(--neon-cyan)]">🖼️ Share result card</button>
                <button type="button" onClick={copyResult} className="min-h-11 underline text-[var(--neon-cyan)]">Copy answer</button>
                <button type="button" onClick={copyLink} className="min-h-11 underline text-[var(--neon-cyan)]">🔗 Copy link to these options</button>
              </div>
            </div>
          )}
          <p role="status" className="text-sm mt-2 text-[var(--text-secondary)]">{status}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="glass-card p-4 sm:p-5 min-h-[9.5rem]">
          <p className="text-xs uppercase tracking-widest text-[#E7B43C]">Decision of the day</p>
          <p className="text-lg font-bold mt-1 text-[var(--text-primary)] min-h-[1.75rem]">{today?.question ?? " "}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 min-h-[1rem]">{today ? today.options.join(" · ") : " "}</p>
          <button type="button" disabled={!today} onClick={() => { if (!today) return; loadList(today.question, today.options, "daily"); toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            className="mt-3 min-h-11 rounded-xl border border-[#E7B43C]/50 px-4 text-sm font-semibold text-[#E7B43C]">Decide today&apos;s question</button>
        </div>
        <div className="glass-card p-4 sm:p-5 min-h-[9.5rem]">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Your recent decisions</p>
          {history.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {history.map((h, i) => (
                <li key={i} className="flex justify-between gap-3"><span className="truncate text-[var(--text-secondary)]">{h.question || (h.mode === "yesno" ? "Yes or no" : "Decision")}</span><strong className="shrink-0 text-[var(--text-primary)]">{h.answer}</strong></li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-[var(--text-muted)]">Your last six answers show up here, saved only in this browser.</p>}
        </div>
      </div>
    </section>
  );
}
