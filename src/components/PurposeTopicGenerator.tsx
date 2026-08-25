"use client";

import { useMemo, useState } from "react";
import type { PurposeGeneratorConfig, PurposePrompt } from "@/data/purposeGenerators";
import { track } from "@/lib/track";

function unique(values: string[]) {
  return [...new Set(values)];
}

function shuffled<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PurposeTopicGenerator({ config }: { config: PurposeGeneratorConfig }) {
  const categories = useMemo(() => unique(config.prompts.map((prompt) => prompt.category)), [config.prompts]);
  const levels = useMemo(() => unique(config.prompts.map((prompt) => prompt.level)), [config.prompts]);
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<PurposePrompt[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  function generate() {
    const matching = config.prompts.filter(
      (prompt) =>
        (category === "All" || prompt.category === category) &&
        (level === "All" || prompt.level === level),
    );
    const pool = matching.length > 0 ? matching : config.prompts;
    const previousFirst = results[0]?.text;
    const fresh = pool.filter((prompt) => prompt.text !== previousFirst);
    const candidates = fresh.length >= Math.min(count, pool.length) ? fresh : pool;
    setResults(shuffled(candidates).slice(0, Math.min(count, candidates.length)));
    setCopied(null);
    track("generate_purpose_topics", {
      generator: config.slug,
      category: category.toLowerCase().replaceAll(" ", "_"),
      level: level.toLowerCase(),
      count,
    });
  }

  async function copyResult(prompt: PurposePrompt, index: number) {
    try {
      await navigator.clipboard.writeText(`${prompt.text}\nStarting angle: ${prompt.angle}`);
      setCopied(index);
      track("copy_purpose_topic", { generator: config.slug, category: prompt.category, level: prompt.level });
    } catch {
      setCopied(null);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
      <div className="glass-card p-6 sm:p-10 border-[var(--neon-cyan)]/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#12121f] px-3 py-3 text-sm text-[var(--text-primary)]"
            >
              <option value="All">Any category</option>
              {categories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Difficulty / depth
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#12121f] px-3 py-3 text-sm text-[var(--text-primary)]"
            >
              <option value="All">Any level</option>
              {levels.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-xs font-semibold text-[var(--text-secondary)]">Number of ideas</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[1, 3, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={count === value}
                  onClick={() => setCount(value)}
                  className={`rounded-lg border px-3 py-3 text-sm transition-colors ${
                    count === value
                      ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]"
                      : "border-white/10 text-[var(--text-secondary)] hover:border-white/20"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="text-center">
          <button type="button" onClick={generate} className="btn-generate mt-7">
            <span aria-hidden="true">{config.emoji}</span> {results.length ? "Generate Again" : config.actionLabel}
          </button>
          <p className="text-xs text-[var(--text-muted)] mt-3">Editor-written ideas · free · no signup</p>
        </div>

        {results.length > 0 && (
          <div className="mt-8 space-y-4" aria-live="polite">
            {results.map((prompt, index) => (
              <article key={prompt.text} className="rounded-xl border border-[var(--neon-cyan)]/20 bg-[rgba(0,229,255,0.04)] p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[11px] rounded-full bg-white/5 px-2.5 py-1 text-[var(--text-muted)]">{prompt.category}</span>
                  <span className="text-[11px] rounded-full bg-white/5 px-2.5 py-1 text-[var(--text-muted)]">{prompt.level}</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-[var(--neon-cyan)]">{config.resultLabel}</p>
                <h2 className="mt-2 text-lg sm:text-xl font-bold text-[var(--text-primary)]">{prompt.text}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">Starting angle:</strong> {prompt.angle}
                </p>
                <button
                  type="button"
                  onClick={() => copyResult(prompt, index)}
                  className="mt-4 text-xs font-semibold text-[var(--neon-cyan)] hover:underline"
                >
                  {copied === index ? "Copied ✓" : "Copy topic + angle"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
