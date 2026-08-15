"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, CategoryInfo } from "@/data/types";
import { track } from "@/lib/track";

export default function RandomSubjectPicker() {
  const [subject, setSubject] = useState<CategoryInfo | null>(null);

  function pickSubject() {
    const choices = subject
      ? CATEGORIES.filter((category) => category.id !== subject.id)
      : CATEGORIES;
    const next = choices[Math.floor(Math.random() * choices.length)];
    setSubject(next);
    track("pick_random_subject", { subject: next.id });
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
      <div className="glass-card p-8 sm:p-10 text-center border-[var(--neon-cyan)]/20">
        <h2
          className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Get a Random Subject in One Click
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Let the picker choose one of 16 school and study subjects for your next assignment,
          revision session, presentation, or research sprint.
        </p>

        {subject && (
          <div className="mt-6 rounded-xl border border-[var(--neon-cyan)]/25 bg-[rgba(0,229,255,0.05)] p-6">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Your subject</p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">
              {subject.emoji} {subject.label}
            </p>
            <Link
              href={`/categories/${subject.id}`}
              className="mt-3 inline-block text-sm font-semibold text-[var(--neon-cyan)] hover:underline"
            >
              Explore {subject.label} prompts →
            </Link>
          </div>
        )}

        <button type="button" onClick={pickSubject} className="btn-generate mt-6">
          <span aria-hidden="true">🧪</span> {subject ? "Pick Another Subject" : "Pick a Random Subject"}
        </button>
      </div>
    </section>
  );
}
