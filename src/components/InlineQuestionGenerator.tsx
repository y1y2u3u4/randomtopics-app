"use client";

import { useCallback, useMemo, useState } from "react";
import { track } from "@/lib/track";
import type { Locale } from "@/i18n/config";
import type { Category, Depth, Mode, Topic } from "@/data/types";
import GeneratedResultActions from "@/components/GeneratedResultActions";
import { recordRecentTopics } from "@/lib/topicLibrary";

interface InlineQuestionGeneratorProps {
  items: string[];
  title: string;
  description: string;
  source: string;
  locale?: Locale;
  actionLabel?: string;
  groups?: { label: string; items: string[] }[];
  library?: { category: Category; modes: Mode[]; depth?: Depth };
  support?: { title: string; items: string[] };
}

export default function InlineQuestionGenerator({
  items,
  title,
  description,
  source,
  locale = "en",
  actionLabel,
  groups = [],
  library,
  support,
}: InlineQuestionGeneratorProps) {
  const isSpanish = locale === "es";
  const [activeGroup, setActiveGroup] = useState("all");
  const [current, setCurrent] = useState<string | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const pool = useMemo(
    () => activeGroup === "all"
      ? items
      : groups.find((group) => group.label === activeGroup)?.items ?? items,
    [activeGroup, groups, items],
  );
  const currentGroup = current
    ? groups.find((group) => group.items.includes(current))?.label
    : null;
  const saveTopic: Topic | undefined = current && library
    ? {
        id: `inline-${source}-${items.indexOf(current)}`,
        text: current,
        category: library.category,
        modes: library.modes,
        depth: library.depth ?? "medium",
        talkingPoints: support?.items ?? [],
      }
    : undefined;

  const generate = useCallback(() => {
    if (pool.length === 0) return;
    const eventParams = {
      tool_type: "inline_question_generator",
      content_source: source,
      requested_count: 1,
      generator_category: activeGroup,
      locale,
    };
    if (current) track("repeat_generate", eventParams);
    track("generate_start", eventParams);

    let candidates = pool.filter((item) => !used.has(item));
    let nextUsed = used;
    if (candidates.length === 0) {
      nextUsed = new Set();
      candidates = pool;
    }
    const nextItem = candidates[Math.floor(Math.random() * candidates.length)];
    const nextSet = new Set(nextUsed);
    nextSet.add(nextItem);
    setUsed(nextSet);
    setCurrent(nextItem);
    if (library) {
      recordRecentTopics([{
        id: `inline-${source}-${items.indexOf(nextItem)}`,
        text: nextItem,
        category: library.category,
        modes: library.modes,
        depth: library.depth ?? "medium",
        talkingPoints: support?.items ?? [],
      }]);
    }
    track("generate_success", {
      ...eventParams,
      result_count: 1,
      result_source: "article_collection",
      result_category: groups.find((group) => group.items.includes(nextItem))?.label ?? "all",
    });
  }, [activeGroup, current, groups, items, library, locale, pool, source, support?.items, used]);

  const changeGroup = useCallback((group: string) => {
    setActiveGroup(group);
    setCurrent(null);
    setUsed(new Set());
    track("filter_select", {
      tool_type: "inline_question_generator",
      content_source: source,
      filter_name: "collection_section",
      filter_value: group,
      locale,
    });
  }, [locale, source]);

  return (
    <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-br from-[rgba(0,229,255,0.05)] to-[rgba(255,45,120,0.04)]">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">
          {isSpanish ? "Generador incluido" : "Built-in generator"}
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      </div>

      {groups.length > 1 ? (
        <fieldset className="mt-6">
          <legend className="sr-only">{isSpanish ? "Filtrar por categoría" : "Filter by category"}</legend>
          <div className="flex flex-wrap justify-center gap-2">
            {[{ label: "all", items }, ...groups].map((group) => (
              <button
                key={group.label}
                type="button"
                aria-pressed={activeGroup === group.label}
                onClick={() => changeGroup(group.label)}
                className={`min-h-11 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  activeGroup === group.label
                    ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]"
                    : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
                }`}
              >
                {group.label === "all" ? (isSpanish ? "Todas" : "All") : group.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="mt-6 min-h-[9rem] rounded-2xl border border-white/10 bg-black/10 px-6 py-8 text-center" aria-live="polite">
        <div className="flex min-h-[5rem] flex-col items-center justify-center">
          {currentGroup ? <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">{currentGroup}</p> : null}
          <p className={`leading-relaxed ${current ? "text-xl sm:text-2xl font-semibold text-[var(--text-primary)]" : "text-sm text-[var(--text-muted)]"}`}>
            {current ?? (isSpanish ? "Pulsa el botón para sacar una pregunta al azar." : "Choose a random prompt from the complete collection.")}
          </p>
        </div>
        {current && support ? (
          <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 p-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{support.title}</h3>
            <ol className="mt-2 space-y-1.5 pl-5 text-sm text-[var(--text-secondary)] list-decimal">
              {support.items.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button type="button" onClick={generate} className="btn-generate">
          <span aria-hidden="true">🎲</span> {current
            ? (isSpanish ? "Siguiente pregunta" : "Next Prompt")
            : (actionLabel ?? (isSpanish ? "Sacar una pregunta" : "Pick a Random Prompt"))}
        </button>
      </div>
      {current ? (
        <div className="mt-3">
          <GeneratedResultActions
            key={current}
            text={current}
            copyValue={support ? `${current}\n${support.title}:\n${support.items.map((item, index) => `${index + 1}. ${item}`).join("\n")}` : current}
            copyLabel={support
              ? (isSpanish ? "Copiar pregunta + guía" : "Copy prompt + framework")
              : (isSpanish ? "Copiar pregunta" : "Copy prompt")}
            shareTitle={title}
            saveTopic={saveTopic}
            locale={locale}
            toolType="inline_question_generator"
            contentSource={source}
            actionSurface="article_inline_result"
            isPostGenerate
          />
        </div>
      ) : null}
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        {pool.length} {isSpanish ? "opciones en este filtro · sin repeticiones hasta completar la lista" : "prompts in this filter · no repeats until the collection is complete"}
      </p>
    </div>
  );
}
