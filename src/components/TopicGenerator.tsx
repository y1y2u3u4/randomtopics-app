"use client";

import { useState, useCallback, useMemo, useRef, useEffect, useId } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Topic, Mode, Category, Depth, CATEGORIES, MODES, DEPTHS } from "@/data/types";
import { getLocalizedTopics } from "@/data/topics.es";
import TopicCard from "./TopicCard";
import { PracticeSelectedTopic } from "./TopicHandoff";
import DebatePreparation from "./DebatePreparation";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { Locale, defaultLocale } from "@/i18n/config";
import { getDict, MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { recordRecentTopics } from "@/lib/topicLibrary";
import { drawUnseen, filterTopicPool } from "@/lib/topicPool";
import { readTopicResult, saveTopicResult } from "@/lib/topicResultSession";

const SpeechPracticePanel = dynamic(() => import("./SpeechPracticePanel"));
const SpeechCoachEntry = dynamic(() => import("./SpeechCoachEntry"));

interface TopicGeneratorProps {
  initialMode?: Mode | null;
  initialCategory?: Category | null;
  title?: string;
  subtitle?: string;
  locale?: Locale;
  contentSource?: string;
  speechPractice?: boolean;
  speechFeedback?: boolean;
  speechTimerHref?: string;
  heroLinks?: ReactNode;
  /** Leave room for the Speech hub's optional privacy notice on phones. */
  compactMobileHero?: boolean;
}

const DEPTH_KEYS: Record<Depth, "depthLight" | "depthMedium" | "depthDeep"> = {
  light: "depthLight",
  medium: "depthMedium",
  deep: "depthDeep",
};

export default function TopicGenerator({
  initialMode = null,
  initialCategory = null,
  title,
  subtitle,
  locale = defaultLocale,
  contentSource = "topic_generator",
  speechPractice = false,
  speechFeedback = speechPractice,
  speechTimerHref = "#speech-practice",
  heroLinks,
  compactMobileHero = false,
}: TopicGeneratorProps) {
  const t = getDict(locale);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(initialMode);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedDepth, setSelectedDepth] = useState<Depth | null>(null);
  const [count, setCount] = useState(1);
  const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([]);
  const [practiceBatch, setPracticeBatch] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);
  const [copyingAll, setCopyingAll] = useState(false);
  const copyInFlight = useRef(false);
  const copyVersion = useRef(0);
  useEffect(() => () => { copyVersion.current++; }, []);
  const usedStatic = useRef(new Set<string>());
  const generating = useRef(false);
  const [filterNotice, setFilterNotice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filtersId = useId();
  const localizedTopics = useMemo(() => getLocalizedTopics(locale), [locale]);
  const sessionScope = `${locale}:generator:${initialMode ?? "all"}:${initialCategory ?? "all"}`;
  useEffect(() => {
    const timer = window.setTimeout(() => {
      // An explicit same-topic practice handoff already owns the return card.
      // Keep that existing path focused instead of adding a second old batch.
      if (window.location.hash === "#selected-topic") return;
      const previous = readTopicResult(sessionScope, localizedTopics);
      if (!previous || (initialMode && previous.mode !== initialMode) || (initialCategory && previous.category !== initialCategory)) return;
      const byId = new Map(localizedTopics.map(topic => [topic.id, topic]));
      setSelectedMode(previous.mode); setSelectedCategory(previous.category); setSelectedDepth(previous.depth); setCount(previous.count);
      setGeneratedTopics(previous.topicIds.map(id => byId.get(id)!));
      usedStatic.current = new Set(previous.usedIds);
      setHasGenerated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [sessionScope, localizedTopics, initialMode, initialCategory]);
  const staticPool = useMemo(() => filterTopicPool(localizedTopics, {
    mode: selectedMode, category: selectedCategory, depth: selectedDepth,
  }), [localizedTopics, selectedMode, selectedCategory, selectedDepth]);

  const chooseCategory = (category: Category | null) => {
    setSelectedCategory(category);
    const clearDepth = !filterTopicPool(localizedTopics, { mode: selectedMode, category, depth: selectedDepth }).length;
    if (clearDepth) setSelectedDepth(null);
    setFilterNotice(clearDepth ? (locale === "es" ? "Profundidad restablecida a Cualquiera para mostrar temas de esta categoría." : "Depth reset to Any to show topics in this category.") : "");
    track("filter_select", { tool_type: "topic_generator", content_source: contentSource, filter_name: "category", filter_value: category ?? "all", locale });
  };

  const chooseMode = (mode: Mode | null) => {
    setSelectedMode(mode);
    const category = !filterTopicPool(localizedTopics, { mode, category: selectedCategory }).length ? null : selectedCategory;
    if (category !== selectedCategory) setSelectedCategory(category);
    const clearDepth = !filterTopicPool(localizedTopics, { mode, category, depth: selectedDepth }).length;
    if (clearDepth) setSelectedDepth(null);
    setFilterNotice(category !== selectedCategory || clearDepth ? (locale === "es" ? "Filtros ajustados para mostrar temas del modo seleccionado." : "Filters adjusted to show topics for this mode.") : "");
    track("filter_select", { tool_type: "topic_generator", content_source: contentSource, filter_name: "mode", filter_value: mode ?? "all", locale });
  };

  const chooseDepth = (depth: Depth | null) => {
    setSelectedDepth(depth);
    setFilterNotice("");
    track("filter_select", { tool_type: "topic_generator", content_source: contentSource, filter_name: "depth", filter_value: depth ?? "all", locale });
  };

  const generateFromStatic = useCallback(() => {
    const draw = drawUnseen(staticPool, usedStatic.current, (topic) => topic.id, count);
    usedStatic.current = draw.used;
    return draw.picked;
  }, [staticPool, count]);

  const finishGeneration = useCallback((nextTopics: Topic[], resultSource: "curated_pool" | "localized_pool") => {
    copyVersion.current++;
    copyInFlight.current = false;
    setCopyingAll(false);
    setGeneratedTopics(nextTopics);
    setPracticeBatch((batch) => batch + 1);
    recordRecentTopics(nextTopics);
    if (nextTopics.length) saveTopicResult(sessionScope, {
      topicIds: nextTopics.map(topic => topic.id), usedIds: [...usedStatic.current],
      mode: selectedMode, category: selectedCategory, depth: selectedDepth, count,
    });
    setIsSpinning(false);
    setHasGenerated(true);
    setCopiedAll(false);
    setManualCopyText(null);
    track(nextTopics.length > 0 ? "generate_success" : "generate_error", {
      tool_type: "topic_generator",
      generator_mode: selectedMode ?? "any",
      generator_category: selectedCategory ?? "any",
      generator_depth: selectedDepth ?? "any",
      requested_count: count,
      result_count: nextTopics.length,
      result_source: resultSource,
      generation_policy: "curated_v1",
      provider_requests: 0,
      ...(nextTopics.length === 0 ? { error_code: "empty_filtered_pool" } : {}),
      content_source: contentSource,
      locale,
    });
    return nextTopics;
  }, [selectedMode, selectedCategory, selectedDepth, count, contentSource, locale, sessionScope]);

  const generate = useCallback(async () => {
    if (generating.current || !staticPool.length) return [];
    generating.current = true;
    setIsSpinning(true);

    track("generate_start", {
      tool_type: "topic_generator",
      generator_mode: selectedMode ?? "any",
      generator_category: selectedCategory ?? "any",
      generator_depth: selectedDepth ?? "any",
      requested_count: count,
      content_source: contentSource,
      locale,
    });

    try {
      // Keep the coach's async contract without a network/model round trip.
      await Promise.resolve();
      return finishGeneration(generateFromStatic(), locale === "es" ? "localized_pool" : "curated_pool");
    } finally {
      generating.current = false;
      setIsSpinning(false);
    }
  }, [selectedMode, selectedCategory, selectedDepth, count, generateFromStatic, finishGeneration, contentSource, locale, staticPool.length]);

  const generateAgain = useCallback(() => {
    if (generating.current || !staticPool.length) return;
    track("repeat_generate", {
      tool_type: "topic_generator",
      generator_mode: selectedMode ?? "any",
      generator_category: selectedCategory ?? "any",
      generator_depth: selectedDepth ?? "any",
      requested_count: count,
      content_source: contentSource,
      locale,
    });
    void generate();
  }, [contentSource, count, generate, locale, selectedCategory, selectedDepth, selectedMode, staticPool.length]);

  const copyAllGenerated = useCallback(async () => {
    if (generatedTopics.length === 0 || copyInFlight.current) return;
    copyInFlight.current = true;
    setCopyingAll(true);
    setCopiedAll(false);
    const version = ++copyVersion.current;
    const text = generatedTopics
      .map((topic, index) => `${index + 1}. ${topic.text}`)
      .join("\n");
    const copiedSuccessfully = await copyText(text);
    // Clipboard permission can resolve after a new draw or after unmount.
    if (version !== copyVersion.current) return;
    copyInFlight.current = false;
    setCopyingAll(false);
    if (!copiedSuccessfully) {
      setManualCopyText(text);
      track("copy_error", {
        tool_type: "topic_generator",
        result_type: "topic_batch",
        result_count: generatedTopics.length,
        copy_surface: "results_action_bar",
        content_source: contentSource,
        locale,
      });
      return;
    }
    setManualCopyText(null);
    setCopiedAll(true);
    window.setTimeout(() => { if (version === copyVersion.current) setCopiedAll(false); }, 1800);
    track("copy_result", {
      tool_type: "topic_generator",
      result_type: "topic_batch",
      result_count: generatedTopics.length,
      copy_surface: "results_action_bar",
      content_source: contentSource,
      locale,
    });
    track("post_generate_copy", {
      tool_type: "topic_generator",
      result_type: "topic_batch",
      result_count: generatedTopics.length,
      action_surface: "results_action_bar",
      content_source: contentSource,
      locale,
    });
  }, [contentSource, generatedTopics, locale]);

  const coachEnabled = speechFeedback && locale === "en" && process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED === "true";
  const showModeSelector = !initialMode;
  const showCategorySelector = !initialCategory;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className={`text-center ${compactMobileHero ? "pt-4 pb-4" : "pt-16 pb-10"} sm:pt-24 sm:pb-12`}>
        {title ? (
          <h1 className={`section-heading ${compactMobileHero ? "text-4xl [overflow-wrap:anywhere]" : "text-5xl"} sm:text-6xl lg:text-7xl font-extrabold mb-5 leading-[1.1] tracking-tight`}>
            {title}
          </h1>
        ) : (
          <h1 className="section-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-5 leading-[1.1] tracking-tight">
            {t.generator.heroLine1}
            <br />
            <span className="gradient-text">{t.generator.heroLine2}</span>
          </h1>
        )}
        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed opacity-80">
          {subtitle || t.generator.heroSubtitle}
        </p>
        {heroLinks}
      </div>

      {/* Controls */}
      <div className={`glass-card ${compactMobileHero ? "p-4" : "p-6"} sm:p-8 lg:p-10 mb-10 space-y-7`}>
        <div className="text-center">
          <button onClick={generate} disabled={isSpinning || !staticPool.length}
            className={`btn-generate ${compactMobileHero ? "speech-compact-generate" : ""} animate-pulse-glow disabled:opacity-70 w-full sm:w-auto text-lg px-10 py-4`}>
            <span>{isSpinning ? "🎰" : "🎲"}</span> {isSpinning ? t.generator.spinning : t.generator.generate}
          </button>
          <p className="mt-3 text-sm text-[var(--text-muted)]" role="status">
            {locale === "es" ? `${staticPool.length} temas disponibles · hasta ${Math.min(count, staticPool.length)} por selección.` : `${staticPool.length} topics available · up to ${Math.min(count, staticPool.length)} per draw.`}
          </p>
          {selectedMode || selectedCategory || selectedDepth ? <p className="mt-1 text-xs text-[var(--text-muted)] sm:hidden">
            {[selectedMode && MODE_LABELS[locale][selectedMode].short, selectedCategory && CATEGORY_LABELS[locale][selectedCategory].label, selectedDepth && t.generator[DEPTH_KEYS[selectedDepth]]].filter(Boolean).join(" · ")}
          </p> : null}
          <button type="button" aria-expanded={showFilters} aria-controls={filtersId}
            onClick={() => setShowFilters(value => !value)}
            className="mt-2 min-h-11 text-sm text-[var(--neon-cyan)] underline underline-offset-4 sm:hidden">
            {showFilters ? (locale === "es" ? "Ocultar filtros" : "Hide filters") : showModeSelector
              ? (locale === "es" ? "Elegir modo, categoría y cantidad" : "Choose mode, category & count")
              : (locale === "es" ? "Elegir filtros y cantidad" : "Choose filters & count")}
          </button>
        </div>
        <div id={filtersId} className={`${showFilters ? "block" : "hidden sm:block"} space-y-7`}>
        {/* Mode selector */}
        {showModeSelector && (
          <div>
            <label className="control-label mb-3 block">{t.generator.mode}</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => chooseMode(null)}
                aria-pressed={selectedMode === null}
                className={`mode-chip ${selectedMode === null ? "active" : ""}`}
              >
                🎲 {t.generator.all}
              </button>
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() =>
                    chooseMode(selectedMode === mode.id ? null : mode.id)
                  }
                  aria-pressed={selectedMode === mode.id}
                  className={`mode-chip ${selectedMode === mode.id ? "active" : ""}`}
                >
                  {mode.emoji} {MODE_LABELS[locale][mode.id].short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category selector */}
        {showCategorySelector && (
          <div>
            <label className="control-label mb-3 block">{t.generator.category}</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => chooseCategory(null)}
                aria-pressed={selectedCategory === null}
                className={`category-tag ${selectedCategory === null ? "active" : ""}`}
              >
                {t.generator.allCategory}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    chooseCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  aria-pressed={selectedCategory === cat.id}
                  disabled={!filterTopicPool(localizedTopics, { mode: selectedMode, category: cat.id }).length}
                  className={`category-tag min-h-11 disabled:opacity-40 ${selectedCategory === cat.id ? "active" : ""}`}
                >
                  {cat.emoji} {CATEGORY_LABELS[locale][cat.id].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Depth + Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-6">
          <div>
            <label className="control-label mb-2 block">{t.generator.depth}</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => chooseDepth(null)}
                aria-pressed={selectedDepth === null}
                className={`depth-btn min-h-11 ${selectedDepth === null ? "active" : ""}`}
              >
                {t.generator.any}
              </button>
              {DEPTHS.map((d) => (
                <button
                  key={d.id}
                  onClick={() =>
                    chooseDepth(selectedDepth === d.id ? null : d.id)
                  }
                  aria-pressed={selectedDepth === d.id}
                  disabled={!filterTopicPool(localizedTopics, { mode: selectedMode, category: selectedCategory, depth: d.id }).length}
                  title={`${filterTopicPool(localizedTopics, { mode: selectedMode, category: selectedCategory, depth: d.id }).length} ${locale === "es" ? "temas disponibles" : "topics available"}`}
                  className={`depth-btn min-h-11 disabled:cursor-not-allowed disabled:opacity-40 ${selectedDepth === d.id ? "active" : ""}`}
                >
                  {t.generator[DEPTH_KEYS[d.id]]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="control-label mb-2 block">{t.generator.count}</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  aria-pressed={count === n}
                  className={`depth-btn ${count === n ? "active" : ""}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

        </div>
        <div className="text-center">
          <button type="button" onClick={generate} disabled={isSpinning || !staticPool.length}
            className={`btn-generate ${compactMobileHero ? "speech-compact-generate" : ""} disabled:opacity-70 w-full sm:w-auto`}>
            {locale === "es" ? "Generar con estos filtros" : "Generate with these filters"}
          </button>
        </div>
        <div className="text-center text-sm text-[var(--text-muted)]" role="status">
          <p>{locale === "es"
            ? `${staticPool.length} temas disponibles · se mostrarán hasta ${Math.min(count, staticPool.length)} · sin repetir hasta agotar este filtro.`
            : `${staticPool.length} topics available · showing up to ${Math.min(count, staticPool.length)} · no repeats until this pool is used.`}</p>
          <p className="mt-1 text-xs">{locale === "es"
            ? "Las profundidades sin temas están desactivadas. Los resultados proceden de nuestra colección en español."
            : "Instant picks from our topic collection. Broaden your filters for more options."}</p>
          {filterNotice ? <p className="mt-2 text-[var(--neon-cyan)]">{filterNotice}</p> : null}
        </div>
        </div>
      </div>

      {/* Keep the coach outside keyed result animations so a new topic batch
          never discards an in-progress recording or its feedback. */}
      <AnimatePresence mode="wait">
        {hasGenerated && (!coachEnabled || generatedTopics.length === 0) && <motion.div key={generatedTopics.map((t) => t.id).join(",")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4 space-y-4">
          {generatedTopics.length > 0 ? generatedTopics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} locale={locale} contentSource={contentSource} actionContext="generated_result" afterTitle={contentSource === "homepage" ? <PracticeSelectedTopic topic={topic} source="home" /> : contentSource === "debate_hub" ? <DebatePreparation topic={topic} /> : undefined} />
          )) : (
              <div className="glass-card text-center py-16 px-6">
                <motion.p
                  className="text-6xl mb-5"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🤷
                </motion.p>
                <p className="text-xl font-semibold text-[var(--text-secondary)] mb-2">
                  {t.generator.noTopicsTitle}
                </p>
                <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
                  {t.generator.noTopicsBody}
                </p>
              </div>
          )}
        </motion.div>}
      </AnimatePresence>
      {coachEnabled ? <SpeechCoachEntry topics={generatedTopics} contentSource={contentSource} requestTopics={generate} loadingTopics={isSpinning} timerHref={speechTimerHref}
        renderFirstTopic={generatedTopics[0] ? (actions) => <TopicCard key={generatedTopics[0].id} topic={generatedTopics[0]} locale={locale}
          contentSource={contentSource} actionContext="generated_result" afterTitle={actions} /> : undefined} /> : null}
      {coachEnabled && generatedTopics.length > 1 && <div className="mb-4 space-y-4" aria-label="More generated topics">
        {generatedTopics.slice(1).map((topic, i) => <TopicCard key={topic.id} topic={topic} index={i + 1} locale={locale} contentSource={contentSource} actionContext="generated_result" />)}
      </div>}
      {hasGenerated && generatedTopics.length > 0 && <div className="mb-6 space-y-4">
                <div className="glass-card border-[var(--neon-cyan)]/20 p-5 sm:p-6">
                  <p className="text-center text-sm font-semibold text-[var(--text-primary)]">
                    {locale === "es" ? "¿Quieres otra opción?" : "Want another option?"}
                  </p>
                  <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={generateAgain}
                      disabled={isSpinning}
                      className={coachEnabled ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold disabled:opacity-70" : "btn-generate inline-flex items-center justify-center gap-2 disabled:opacity-70"}
                    >
                      <span aria-hidden="true">🎲</span>
                      {isSpinning
                        ? (locale === "es" ? "Generando…" : "Generating…")
                        : (locale === "es" ? "Generar otros temas" : "Generate next topics")}
                    </button>
                    <button
                      type="button"
                      onClick={copyAllGenerated}
                      disabled={copyingAll}
                      aria-busy={copyingAll}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)]"
                    >
                      <span aria-hidden="true">{copiedAll ? "✓" : "⧉"}</span>
                      {copyingAll ? (locale === "es" ? "Copiando…" : "Copying…") : copiedAll
                        ? (locale === "es" ? "Copiados" : "Copied")
                        : (locale === "es" ? "Copiar resultados" : "Copy results")}
                    </button>
                  </div>
                  {manualCopyText ? (
                    <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-amber-300/20 bg-amber-300/5 p-3">
                      <label className="text-xs text-amber-100" htmlFor="manual-copy-generated-topics">
                        {locale === "es"
                          ? "La copia automática está bloqueada. Selecciona los resultados:"
                          : "Automatic copying is blocked. Select the results below:"}
                      </label>
                      <textarea
                        id="manual-copy-generated-topics"
                        readOnly
                        value={manualCopyText}
                        rows={Math.min(6, generatedTopics.length + 1)}
                        onFocus={(event) => event.currentTarget.select()}
                        className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="glass-card p-5 sm:p-6">
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    {locale === "es" ? "Guarda tus favoritos o sigue explorando" : "Save your favorites or keep exploring"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={locale === "es" ? "/es/saved-topics" : "/saved-topics"}
                      className="text-xs px-3 py-2 rounded-lg border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] hover:bg-[var(--neon-pink)]/10 transition-colors"
                    >
                      {locale === "es" ? "★ Temas guardados" : "★ Saved topics"}
                    </Link>
                    {selectedMode === "debate" ? (
                      <>
                        <Link href={locale === "es" ? "/es/debate/students" : "/pro-and-con-debate-topics"} className="text-xs px-3 py-2 rounded-lg border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors">
                          {locale === "es" ? "Temas para estudiantes" : "100 pro & con topics"}
                        </Link>
                        <Link href={locale === "es" ? "/es/debate" : "/debate/motions"} className="text-xs px-3 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-white/20 transition-colors">
                          {locale === "es" ? "Más temas de debate" : "Debate motions"}
                        </Link>
                      </>
                    ) : selectedMode === "speech" ? (
                      <>
                        <Link href={locale === "es" ? "/es/table-topics-generator" : "/table-topics-generator"} className="text-xs px-3 py-2 rounded-lg border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors">
                          Table Topics
                        </Link>
                        <Link href={locale === "es" ? "/es/impromptu-speech-topics" : "/impromptu-speech-topics"} className="text-xs px-3 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-white/20 transition-colors">
                          {locale === "es" ? "Práctica improvisada" : "Impromptu practice"}
                        </Link>
                      </>
                    ) : selectedMode === "conversation" ? (
                      <>
                        <Link href={locale === "es" ? "/es/topics/conversation-starters-for-couples" : "/topics/conversation-starters-for-couples"} className="text-xs px-3 py-2 rounded-lg border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors">
                          {locale === "es" ? "Listas de conversación" : "Conversation lists"}
                        </Link>
                        <Link href={locale === "es" ? "/es/question-generator" : "/question-generator"} className="text-xs px-3 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-white/20 transition-colors">
                          {locale === "es" ? "Generador de preguntas" : "Question generator"}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href={locale === "es" ? "/es/categories" : "/random-subject-generator"} className="text-xs px-3 py-2 rounded-lg border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors">
                          {locale === "es" ? "Explorar categorías" : "Random subject generator"}
                        </Link>
                        <Link href={locale === "es" ? "/es/spin-the-wheel" : "/spin-the-wheel"} className="text-xs px-3 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-white/20 transition-colors">
                          {locale === "es" ? "Gira la rueda" : "Spin the wheel"}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
      </div>}

      {speechPractice ? <SpeechPracticePanel key={practiceBatch} topics={generatedTopics} contentSource={contentSource} /> : null}

      {/* Pre-generate prompt */}
      {!hasGenerated && !speechPractice && !coachEnabled && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="text-8xl sm:text-9xl mb-6 inline-block"
            animate={{
              y: [0, -16, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🎲
          </motion.div>
          <p className="text-[var(--text-muted)] text-lg sm:text-xl">
            {t.generator.clickGenerate}{" "}
            <span className="gradient-text font-bold text-xl sm:text-2xl">
              {t.generator.generate}
            </span>{" "}
            {t.generator.clickPrompt}
          </p>
        </motion.div>
      )}
    </div>
  );
}
