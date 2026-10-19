"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TurkishTopicGroup } from "@/data/turkishTopics";

type Props = {
  groups: TurkishTopicGroup[];
  /** "wheel" shows a spinning wheel; "timer" adds a 60-second speaking timer. */
  mode?: "card" | "wheel" | "timer";
  buttonLabel?: string;
};

const WHEEL_COLORS = ["#22d3ee", "#a78bfa", "#f472b6", "#facc15", "#34d399", "#fb923c", "#60a5fa", "#f87171"];

// Shuffled deck per filter so a topic never repeats until the deck is used up.
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function TurkishTopicPicker({ groups, mode = "card", buttonLabel = "Rastgele konu seç" }: Props) {
  const [groupId, setGroupId] = useState<string>("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [seen, setSeen] = useState(0);
  const [copied, setCopied] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const deck = useRef<string[]>([]);

  const pool = useMemo(
    () => (groupId === "all" ? groups.flatMap((g) => g.topics) : groups.find((g) => g.id === groupId)?.topics ?? []),
    [groupId, groups],
  );
  const wheelSlices = useMemo(() => pool.slice(0, 8), [pool]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  function changeGroup(id: string) {
    setGroupId(id);
    deck.current = [];
    setSeen(0);
    setTopic(null);
    setSecondsLeft(null);
  }

  function draw(): string {
    if (deck.current.length === 0) {
      deck.current = shuffle(pool.filter((t) => t !== topic));
      setSeen(0);
    }
    const next = deck.current.pop() as string;
    setSeen((n) => n + 1);
    return next;
  }

  function pick() {
    if (pool.length === 0 || spinning) return;
    setCopied(false);
    if (mode === "wheel") {
      const next = draw();
      setSpinning(true);
      setRotation((r) => r + 1440 + Math.floor(Math.random() * 360));
      window.setTimeout(() => {
        setTopic(next);
        setSpinning(false);
      }, 2200);
      return;
    }
    setTopic(draw());
    if (mode === "timer") setSecondsLeft(null);
  }

  async function copy() {
    if (!topic) return;
    try {
      await navigator.clipboard.writeText(topic);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const gradient = `conic-gradient(${wheelSlices
    .map((_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${(i * 100) / wheelSlices.length}% ${((i + 1) * 100) / wheelSlices.length}%`)
    .join(", ")})`;

  return (
    <div className="glass-card p-5 sm:p-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori seç">
        {[{ id: "all", label: "Tümü" }, ...groups].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => changeGroup(g.id)}
            aria-pressed={groupId === g.id}
            className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
              groupId === g.id
                ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)]"
                : "border-[var(--border-subtle,rgba(255,255,255,0.15))] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {mode === "wheel" && (
        <div className="relative mx-auto mt-6 h-56 w-56 sm:h-64 sm:w-64" aria-hidden="true">
          <div className="absolute left-1/2 -top-2 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[18px] border-x-transparent border-t-[var(--text-primary)]" />
          <div
            className="h-full w-full rounded-full border-4 border-[var(--text-primary)]/20"
            style={{
              background: gradient,
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 2.2s cubic-bezier(0.17, 0.67, 0.21, 1)" : "none",
            }}
          />
        </div>
      )}

      <div className="mt-6 min-h-24 rounded-xl border border-[var(--neon-cyan)]/25 p-5 text-center" aria-live="polite">
        {topic ? (
          <p className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">{topic}</p>
        ) : (
          <p className="text-[var(--text-muted)]">{spinning ? "Çark dönüyor…" : "Bir konu seçmek için butona bas."}</p>
        )}
        {mode === "timer" && secondsLeft !== null && (
          <p className={`mt-3 text-3xl font-bold tabular-nums ${secondsLeft === 0 ? "text-[var(--neon-pink,#f472b6)]" : "text-[var(--neon-cyan)]"}`}>
            {secondsLeft === 0 ? "Süre doldu!" : `0:${String(secondsLeft).padStart(2, "0")}`}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={pick} disabled={spinning} className="btn-generate disabled:opacity-50">
          {mode === "wheel" ? "Çarkı çevir" : buttonLabel}
        </button>
        {mode === "timer" && topic && (
          <button type="button" onClick={() => setSecondsLeft(60)} className="min-h-11 rounded-lg border border-[var(--neon-cyan)]/40 px-5 text-sm text-[var(--neon-cyan)]">
            {secondsLeft === null ? "1 dakika başlat" : "Süreyi yeniden başlat"}
          </button>
        )}
        {topic && (
          <button type="button" onClick={copy} className="min-h-11 rounded-lg border border-[var(--text-muted)]/40 px-5 text-sm text-[var(--text-secondary)]">
            {copied ? "Kopyalandı ✓" : "Kopyala"}
          </button>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        {pool.length} konu · {seen > 0 ? `${seen} gösterildi · ` : ""}deste bitene kadar tekrar yok
      </p>
    </div>
  );
}
