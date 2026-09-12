"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Topic, Mode, Category, Depth, CATEGORIES, MODES, DEPTHS } from "@/data/types";
import { getLocalizedTopics } from "@/data/topics.es";
import TopicCard from "./TopicCard";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { Locale, defaultLocale } from "@/i18n/config";
import { getDict, MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { recordRecentTopics } from "@/lib/topicLibrary";
import { drawUnseen, filterTopicPool } from "@/lib/topicPool";

const SpeechPracticePanel = dynamic(() => import("./SpeechPracticePanel"));

interface TopicGeneratorProps {
  initialMode?: Mode | null;
  initialCategory?: Category | null;
  title?: string;
  subtitle?: string;
  locale?: Locale;
  contentSource?: string;
  speechPractice?: boolean;
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
}: TopicGeneratorProps) {
  const t = getDict(locale);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(initialMode);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedDepth, setSelectedDepth] = useState<Depth | null>(null);
  const [count, setCount] = useState(1);
  const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);
  const [usedStatic, setUsedStatic] = useState<Set<string>>(new Set());
  const [filterNotice, setFilterNotice] = useState("");
  const localizedTopics = useMemo(() => getLocalizedTopics(locale), [locale]);
  const staticPool = useMemo(() => filterTopicPool(localizedTopics, {
    mode: selectedMode, category: selectedCategory, depth: selectedDepth,
  }), [localizedTopics, selectedMode, selectedCategory, selectedDepth]);

  const chooseCategory = (category: Category | null) => {
    setSelectedCategory(category);
    const clearDepth = locale === "es" && !filterTopicPool(localizedTopics, { mode: selectedMode, category, depth: selectedDepth }).length;
    if (clearDepth) setSelectedDepth(null);
    setFilterNotice(clearDepth ? "Profundidad restablecida a Cualquiera para mostrar temas de esta categoría." : "");
    track("filter_select", { tool_type: "topic_generator", content_source: contentSource, filter_name: "category", filter_value: category ?? "all", locale });
  };

  const chooseMode = (mode: Mode | null) => {
    setSelectedMode(mode);
    const category = locale === "es" && !filterTopicPool(localizedTopics, { mode, category: selectedCategory }).length ? null : selectedCategory;
    if (category !== selectedCategory) setSelectedCategory(category);
    const clearDepth = locale === "es" && !filterTopicPool(localizedTopics, { mode, category, depth: selectedDepth }).length;
    if (clearDepth) setSelectedDepth(null);
    setFilterNotice(category !== selectedCategory || clearDepth ? "Filtros ajustados para mostrar temas del modo seleccionado." : "");
    track("filter_select", { tool_type: "topic_generator", content_source: contentSource, filter_name: "mode", filter_value: mode ?? "all", locale });
  };

  const chooseDepth = (depth: Depth | null) => {
    setSelectedDepth(depth);
    setFilterNotice("");
    track("filter_select", { tool_type: "topic_generator", content_source: contentSource, filter_name: "depth", filter_value: depth ?? "all", locale });
  };

  const generateFromStatic = useCallback(() => {
    const draw = drawUnseen(staticPool, usedStatic, (topic) => topic.id, count);
    setUsedStatic(draw.used);
    return draw.picked;
  }, [staticPool, usedStatic, count]);

  const finishGeneration = useCallback((nextTopics: Topic[], resultSource: "ai" | "localized_pool" | "static_fallback") => {
    setGeneratedTopics(nextTopics);
    recordRecentTopics(nextTopics);
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
      ...(nextTopics.length === 0 ? { error_code: "empty_filtered_pool" } : {}),
      content_source: contentSource,
      locale,
    });
  }, [selectedMode, selectedCategory, selectedDepth, count, contentSource, locale]);

  const generate = useCallback(async () => {
    if (isSpinning || (locale === "es" && !staticPool.length)) return;
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

    // Spanish serves purely from the localized static database so results are
    // always in Spanish (the AI API returns English only).
    if (locale === "es") {
      finishGeneration(generateFromStatic(), "localized_pool");
      return;
    }

    try {
      const res = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          mode: selectedMode,
          category: selectedCategory,
          depth: selectedDepth,
        }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      if (data.topics && data.topics.length > 0) {
        finishGeneration(data.topics, "ai");
      } else {
        // Fallback to static if AI returns empty
        finishGeneration(generateFromStatic(), "static_fallback");
      }
    } catch {
      // Fallback to static database on any error
      finishGeneration(generateFromStatic(), "static_fallback");
    }
  }, [selectedMode, selectedCategory, selectedDepth, count, generateFromStatic, finishGeneration, contentSource, locale, isSpinning, staticPool.length]);

  const generateAgain = useCallback(() => {
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
  }, [contentSource, count, generate, locale, selectedCategory, selectedDepth, selectedMode]);

  const copyAllGenerated = useCallback(async () => {
    if (generatedTopics.length === 0) return;
    const text = generatedTopics
      .map((topic, index) => `${index + 1}. ${topic.text}`)
      .join("\n");
    const copiedSuccessfully = await copyText(text);
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
    window.setTimeout(() => setCopiedAll(false), 1800);
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

  const showModeSelector = !initialMode;
  const showCategorySelector = !initialCategory;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center pt-16 sm:pt-24 pb-10 sm:pb-12">
        {title ? (
          <h1 className="section-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-5 leading-[1.1] tracking-tight">
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
      </div>

      {/* Controls */}
      <div className="glass-card p-6 sm:p-8 lg:p-10 mb-10 space-y-7">
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
                  disabled={locale === "es" && !filterTopicPool(localizedTopics, { mode: selectedMode, category: cat.id }).length}
                  className={`category-tag min-h-11 disabled:opacity-40 ${selectedCategory === cat.id ? "active" : ""}`}
                >
                  {cat.emoji} {CATEGORY_LABELS[locale][cat.id].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Depth + Count + Generate */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] items-end gap-6">
          <div>
            <label className="control-label mb-2 block">{t.generator.depth}</label>
            <div className="flex gap-1.5">
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
                  disabled={locale === "es" && !filterTopicPool(localizedTopics, { mode: selectedMode, category: selectedCategory, depth: d.id }).length}
                  title={locale === "es" ? `${filterTopicPool(localizedTopics, { mode: selectedMode, category: selectedCategory, depth: d.id }).length} temas disponibles` : undefined}
                  className={`depth-btn min-h-11 disabled:cursor-not-allowed disabled:opacity-40 ${selectedDepth === d.id ? "active" : ""}`}
                >
                  {t.generator[DEPTH_KEYS[d.id]]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="control-label mb-2 block">{t.generator.count}</label>
            <div className="flex gap-1.5">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`depth-btn ${count === n ? "active" : ""}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button - full width on mobile, right-aligned on desktop */}
          <div className="flex sm:justify-end justify-center col-span-1 sm:col-span-1">
            <button
              onClick={generate}
              disabled={isSpinning || (locale === "es" && !staticPool.length)}
              className="btn-generate animate-pulse-glow disabled:opacity-70 w-full sm:w-auto text-lg px-10 py-4"
            >
              <motion.span
                className="flex items-center justify-center gap-2"
                animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6, ease: "linear", repeat: isSpinning ? Infinity : 0 }}
              >
                {isSpinning ? (
                  <>
                    <span>🎰</span> {t.generator.spinning}
                  </>
                ) : (
                  <>
                    <span>🎲</span> {t.generator.generate}
                  </>
                )}
              </motion.span>
            </button>
          </div>
        </div>
        {locale === "es" ? (
          <div className="text-center text-sm text-[var(--text-muted)]" role="status">
            <p>{`${staticPool.length} temas disponibles · se mostrarán hasta ${Math.min(count, staticPool.length)} · sin repetir hasta agotar este filtro.`}</p>
            <p className="mt-1 text-xs">Las profundidades sin temas están desactivadas. Los resultados proceden de nuestra colección en español.</p>
            {filterNotice ? <p className="mt-2 text-[var(--neon-cyan)]">{filterNotice}</p> : null}
          </div>
        ) : null}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {hasGenerated && (
          <motion.div
            key={generatedTopics.map((t) => t.id).join(",")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 pb-16"
          >
            {generatedTopics.length > 0 ? (
              <>
                {generatedTopics.map((topic, i) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={i}
                    locale={locale}
                    contentSource={contentSource}
                    actionContext="generated_result"
                  />
                ))}
                <div className="glass-card border-[var(--neon-cyan)]/20 p-5 sm:p-6">
                  <p className="text-center text-sm font-semibold text-[var(--text-primary)]">
                    {locale === "es" ? "¿Quieres otra opción?" : "Want another option?"}
                  </p>
                  <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={generateAgain}
                      disabled={isSpinning}
                      className="btn-generate inline-flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <span aria-hidden="true">🎲</span>
                      {isSpinning
                        ? (locale === "es" ? "Generando…" : "Generating…")
                        : (locale === "es" ? "Generar otros temas" : "Generate next topics")}
                    </button>
                    <button
                      type="button"
                      onClick={copyAllGenerated}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)]"
                    >
                      <span aria-hidden="true">{copiedAll ? "✓" : "⧉"}</span>
                      {copiedAll
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
              </>
            ) : (
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
          </motion.div>
        )}
      </AnimatePresence>

      {speechPractice ? <SpeechPracticePanel topics={generatedTopics} contentSource={contentSource} /> : null}

      {/* Pre-generate prompt */}
      {!hasGenerated && !speechPractice && (
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
