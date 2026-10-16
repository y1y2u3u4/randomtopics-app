"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/track";
import { drawUnseen } from "@/lib/topicPool";
import PrintButton from "./PrintButton";
import GeneratedResultActions from "./GeneratedResultActions";
import ClassroomProjector from "./ClassroomProjector";
import type { KidsQuestion } from "@/data/kidsQuestions";

interface Option { id: string; label: string; ages?: string }

interface Props {
  questions: KidsQuestion<string>[];
  grades: Option[];
  themes?: Option[];
  title: string;
  subtitle: string;
  emoji: string;
  source: string;
  /** Either/or prompts: the projector shows them as two sides of the room. */
  split?: boolean;
  /** Print only this many questions (a one-page worksheet) instead of the whole filtered list. */
  printCount?: number;
  printHeading: string;
}

const shuffle = <T,>(list: T[]) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const chip = (active: boolean) => `min-h-11 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
  active
    ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]"
    : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
}`;

/**
 * One-click generator for the kids / student classroom pages: grade-band and
 * theme filters, a no-repeat deck, and a free projector mode for the board.
 */
export default function ClassroomQuestionGenerator({ questions, grades, themes = [], title, subtitle, emoji, source, split, printCount, printHeading }: Props) {
  const [grade, setGrade] = useState("all");
  const [theme, setTheme] = useState("all");
  const [current, setCurrent] = useState<string | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [deck, setDeck] = useState<string[] | null>(null);

  const pool = useMemo(() => questions
    .filter((q) => grade === "all" || q.grades.includes(grade))
    .filter((q) => theme === "all" || q.theme === theme)
    .map((q) => q.text), [questions, grade, theme]);

  const generate = useCallback(() => {
    if (!pool.length) return;
    if (current) track("repeat_generate", { tool_type: "party_question_generator", content_source: source });
    track("generate_start", { tool_type: "party_question_generator", content_source: source, generator_name: title, generator_filter: `${grade}|${theme}`, requested_count: 1 });
    const draw = drawUnseen(pool, used, (q) => q);
    setUsed(draw.used);
    setCurrent(draw.picked[0]);
    track("generate_success", { tool_type: "party_question_generator", content_source: source, generator_name: title, generator_filter: `${grade}|${theme}`, result_count: 1, result_source: "editorial_pool" });
  }, [pool, used, current, source, title, grade, theme]);

  const pick = (kind: "grade" | "theme", id: string) => {
    if (kind === "grade") setGrade(id); else setTheme(id);
    setCurrent(null);
    track("filter_select", { tool_type: "party_question_generator", content_source: source, generator_name: title, filter_name: kind, filter_value: id });
  };

  const project = () => {
    if (!pool.length) return;
    const rest = shuffle(pool.filter((q) => q !== current));
    setDeck(current && pool.includes(current) ? [current, ...rest] : rest);
    track("classroom_projector_open", { content_source: source, generator_filter: `${grade}|${theme}`, deck_size: pool.length });
  };

  const gradeLabel = grades.find((g) => g.id === grade);
  const printItems = printCount ? pool.slice(0, printCount) : pool;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
      <div className="text-center mb-8">
        <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">{subtitle}</p>
      </div>

      <div className="glass-card p-6 sm:p-10 text-center">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Grade level">
          {[{ id: "all", label: "All grades" }, ...grades].map((g) => (
            <button key={g.id} type="button" onClick={() => pick("grade", g.id)} aria-pressed={grade === g.id} className={chip(grade === g.id)}>{g.label}</button>
          ))}
        </div>
        {themes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3" role="group" aria-label="Theme">
            {[{ id: "all", label: "Any theme" }, ...themes].map((t) => (
              <button key={t.id} type="button" onClick={() => pick("theme", t.id)} aria-pressed={theme === t.id} className={chip(theme === t.id)}>{t.label}</button>
            ))}
          </div>
        )}

        <div className="mt-6" aria-live="polite">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.p key={current} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
                className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] min-h-[5rem] flex items-center justify-center break-words" style={{ fontFamily: "var(--font-display)" }}>
                {current}
              </motion.p>
            ) : (
              <p className="text-lg text-[var(--text-muted)] min-h-[5rem] flex items-center justify-center">Tap the button for a question {emoji}</p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button type="button" onClick={generate} disabled={!pool.length} className="btn-generate disabled:opacity-50">
            <span>{emoji}</span> {current ? "Next question" : "Get a question"}
          </button>
          <button type="button" onClick={project} disabled={!pool.length} data-projector-open
            className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/40 px-5 py-3 text-sm font-semibold text-[var(--neon-cyan)] hover:bg-[rgba(0,229,255,0.08)] disabled:opacity-50">
            📺 Project for the class
          </button>
          <PrintButton heading={printHeading} items={printItems}
            intro={gradeLabel ? `${gradeLabel.label} (${gradeLabel.ages}) · ${printItems.length} questions` : `${printItems.length} questions`}
            label={printCount ? `🖨️ Print ${printItems.length} (1 page)` : "🖨️ Print the list"} />
        </div>
        {current ? (
          <div className="mt-4">
            <GeneratedResultActions key={current} text={current} copyLabel="Copy" shareTitle={title} toolType="party_question_generator" contentSource={source} isPostGenerate />
          </div>
        ) : null}
        <p className="text-xs text-[var(--text-muted)] mt-4">
          {pool.length} questions{gradeLabel ? ` for ${gradeLabel.label.toLowerCase()} (${gradeLabel.ages})` : ""} · no repeats until you have seen them all · projector mode needs no sign-up
        </p>
      </div>
      {deck && <ClassroomProjector deck={deck} title={title} split={split} source={source} onClose={() => setDeck(null)} />}
    </section>
  );
}
