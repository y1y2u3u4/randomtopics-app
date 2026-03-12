"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Topic, Mode, Category, Depth, CATEGORIES, MODES, DEPTHS } from "@/data/types";
import { topics } from "@/data/topics";
import TopicCard from "./TopicCard";

interface TopicGeneratorProps {
  initialMode?: Mode | null;
  initialCategory?: Category | null;
  title?: string;
  subtitle?: string;
}

export default function TopicGenerator({
  initialMode = null,
  initialCategory = null,
  title,
  subtitle,
}: TopicGeneratorProps) {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(initialMode);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedDepth, setSelectedDepth] = useState<Depth | null>(null);
  const [count, setCount] = useState(1);
  const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFromStatic = useCallback(() => {
    let pool = [...topics];
    if (selectedMode) pool = pool.filter((t) => t.modes.includes(selectedMode));
    if (selectedCategory) pool = pool.filter((t) => t.category === selectedCategory);
    if (selectedDepth) pool = pool.filter((t) => t.depth === selectedDepth);
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, [selectedMode, selectedCategory, selectedDepth, count]);

  const generate = useCallback(async () => {
    setIsSpinning(true);
    setError(null);

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
        setGeneratedTopics(data.topics);
      } else {
        // Fallback to static if AI returns empty
        setGeneratedTopics(generateFromStatic());
      }
    } catch {
      // Fallback to static database on any error
      setGeneratedTopics(generateFromStatic());
    }

    setIsSpinning(false);
    setHasGenerated(true);
  }, [selectedMode, selectedCategory, selectedDepth, count, generateFromStatic]);

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
            Random Topic
            <br />
            <span className="gradient-text">Generator</span>
          </h1>
        )}
        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed opacity-80">
          {subtitle ||
            "Generate random topics for conversations, writing, debates, speeches, and more. 500+ curated topics across 15+ categories."}
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6 sm:p-8 lg:p-10 mb-10 space-y-7">
        {/* Mode selector */}
        {showModeSelector && (
          <div>
            <label className="control-label mb-3 block">Mode</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMode(null)}
                className={`mode-chip ${selectedMode === null ? "active" : ""}`}
              >
                🎲 All
              </button>
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() =>
                    setSelectedMode(selectedMode === mode.id ? null : mode.id)
                  }
                  className={`mode-chip ${selectedMode === mode.id ? "active" : ""}`}
                >
                  {mode.emoji} {mode.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category selector */}
        {showCategorySelector && (
          <div>
            <label className="control-label mb-3 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`category-tag ${selectedCategory === null ? "active" : ""}`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  className={`category-tag ${selectedCategory === cat.id ? "active" : ""}`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Depth + Count + Generate */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] items-end gap-6">
          <div>
            <label className="control-label mb-2 block">Depth</label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedDepth(null)}
                className={`depth-btn ${selectedDepth === null ? "active" : ""}`}
              >
                Any
              </button>
              {DEPTHS.map((d) => (
                <button
                  key={d.id}
                  onClick={() =>
                    setSelectedDepth(selectedDepth === d.id ? null : d.id)
                  }
                  className={`depth-btn ${selectedDepth === d.id ? "active" : ""}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="control-label mb-2 block">Count</label>
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
              disabled={isSpinning}
              className="btn-generate animate-pulse-glow disabled:opacity-70 w-full sm:w-auto text-lg px-10 py-4"
            >
              <motion.span
                className="flex items-center justify-center gap-2"
                animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6, ease: "linear", repeat: isSpinning ? Infinity : 0 }}
              >
                {isSpinning ? (
                  <>
                    <span>🎰</span> Spinning...
                  </>
                ) : (
                  <>
                    <span>🎲</span> Generate
                  </>
                )}
              </motion.span>
            </button>
          </div>
        </div>
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
              generatedTopics.map((topic, i) => (
                <TopicCard key={topic.id} topic={topic} index={i} />
              ))
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
                  No topics found
                </p>
                <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
                  Try broadening your filters — select fewer categories or a different mode to discover more topics.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-generate prompt */}
      {!hasGenerated && (
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
            Click{" "}
            <span className="gradient-text font-bold text-xl sm:text-2xl">
              Generate
            </span>{" "}
            to get your random topic!
          </p>
        </motion.div>
      )}
    </div>
  );
}
