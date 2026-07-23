"use client";

import { useEffect, useState } from "react";
import type { Topic } from "@/data/types";
import { MODES } from "@/data/types";

// Editorial reference list: real topics from the curated database, shown with
// their talking points, depth, and best-fit modes — plus copy / save actions.
// This surfaces the database as readable reference content (not just generator
// output), which is the substance AdSense reviewers look for on a page.

interface EditorsPicksProps {
  topics: Topic[];
  heading: string;
  intro?: string;
}

const DEPTH_STYLE: Record<string, { label: string; color: string }> = {
  light: { label: "Light", color: "var(--neon-cyan)" },
  medium: { label: "Medium", color: "var(--neon-yellow, #ffd166)" },
  deep: { label: "Deep", color: "var(--neon-pink)" },
};

const STORAGE_KEY = "rt-saved-topics";

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function EditorsPicks({ topics, heading, intro }: EditorsPicksProps) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSavedIds(readSaved());
  }, []);

  const toggleSave = (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((s) => s !== id) : [...savedIds, id];
    setSavedIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  };

  const copyTopic = async (t: Topic) => {
    const text = `${t.text}\n${t.talkingPoints.map((p) => `• ${p}`).join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (topics.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <div className="glass-card p-8 sm:p-10">
        <h2
          className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heading}
        </h2>
        {intro && (
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{intro}</p>
        )}
        <div className="space-y-5">
          {topics.map((t) => {
            const depth = DEPTH_STYLE[t.depth] ?? DEPTH_STYLE.medium;
            const isSaved = savedIds.includes(t.id);
            return (
              <div
                key={t.id}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] p-5 hover:border-[rgba(255,255,255,0.14)] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[var(--text-primary)] text-sm sm:text-base font-semibold leading-snug">
                    {t.text}
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyTopic(t)}
                      aria-label="Copy topic with talking points"
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/40 transition-all"
                    >
                      {copiedId === t.id ? "✓ Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => toggleSave(t.id)}
                      aria-label={isSaved ? "Remove from saved topics" : "Save topic"}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        isSaved
                          ? "border-[var(--neon-pink)]/50 text-[var(--neon-pink)]"
                          : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/40"
                      }`}
                    >
                      {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {t.talkingPoints.map((p, i) => (
                    <li
                      key={i}
                      className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed flex items-start gap-2"
                    >
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: depth.color }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: depth.color, borderColor: `color-mix(in srgb, ${depth.color} 40%, transparent)` }}
                  >
                    {depth.label}
                  </span>
                  {t.modes.map((m) => {
                    const info = MODES.find((mi) => mi.id === m);
                    if (!info) return null;
                    return (
                      <span
                        key={m}
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-muted)]"
                      >
                        {info.emoji} {info.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-6">
          Copy grabs the topic with its talking points, ready to paste into slides or notes.
          Saved topics stay in your browser — no account needed.
        </p>
      </div>
    </section>
  );
}
