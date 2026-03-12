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

  const generate = useCallback(() => {
    setIsSpinning(true);

    setTimeout(() => {
      let pool = [...topics];

      if (selectedMode) {
        pool = pool.filter((t) => t.modes.includes(selectedMode));
      }
      if (selectedCategory) {
        pool = pool.filter((t) => t.category === selectedCategory);
      }
      if (selectedDepth) {
        pool = pool.filter((t) => t.depth === selectedDepth);
      }

      // Shuffle and pick
      const shuffled = pool.sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, Math.min(count, shuffled.length));

      setGeneratedTopics(picked);
      setIsSpinning(false);
      setHasGenerated(true);
    }, 600);
  }, [selectedMode, selectedCategory, selectedDepth, count]);

  const showModeSelector = !initialMode;
  const showCategorySelector = !initialCategory;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center pt-12 sm:pt-16 pb-8">
        {title ? (
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
        ) : (
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Random Topic
            <br />
            <span className="gradient-text">Generator</span>
          </h1>
        )}
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
          {subtitle ||
            "Generate random topics for conversations, writing, debates, speeches, and more. 500+ curated topics across 15+ categories."}
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6 sm:p-8 mb-8">
        {/* Mode selector */}
        {showModeSelector && (
          <div className="mb-6">
            <label className="text-sm font-medium text-[var(--text-muted)] mb-3 block uppercase tracking-wider">
              Mode
            </label>
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
          <div className="mb-6">
            <label className="text-sm font-medium text-[var(--text-muted)] mb-3 block uppercase tracking-wider">
              Category
            </label>
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

        {/* Depth + Count row */}
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
              Depth
            </label>
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
            <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
              Count
            </label>
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

          {/* Generate button */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={generate}
              disabled={isSpinning}
              className="btn-generate animate-pulse-glow disabled:opacity-70"
            >
              <motion.span
                className="flex items-center gap-2"
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
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="text-4xl mb-4">🤷</p>
                <p>No topics found with those filters. Try broadening your selection!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-generate prompt */}
      {!hasGenerated && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🎲
          </motion.div>
          <p className="text-[var(--text-muted)] text-lg">
            Click <span className="text-[var(--accent-pink)] font-semibold">Generate</span> to get your random topic!
          </p>
        </motion.div>
      )}
    </div>
  );
}
