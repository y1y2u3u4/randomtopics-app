"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Topic, CATEGORIES } from "@/data/types";
import ShareButtons from "./ShareButtons";
import { Locale, defaultLocale } from "@/i18n/config";
import { getDict, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  getEmptyTopicLibrarySnapshot,
  getFavoriteTopicsSnapshot,
  subscribeToTopicLibrary,
  toggleFavoriteTopic,
} from "@/lib/topicLibrary";

interface TopicCardProps {
  topic: Topic;
  index?: number;
  locale?: Locale;
}

const depthColors = {
  light: {
    bg: "rgba(0, 255, 136, 0.1)",
    border: "rgba(0, 255, 136, 0.25)",
    text: "var(--neon-green)",
  },
  medium: {
    bg: "rgba(255, 226, 52, 0.1)",
    border: "rgba(255, 226, 52, 0.25)",
    text: "var(--neon-yellow)",
  },
  deep: {
    bg: "rgba(255, 45, 120, 0.1)",
    border: "rgba(255, 45, 120, 0.25)",
    text: "var(--neon-pink)",
  },
};

export default function TopicCard({ topic, index = 0, locale = defaultLocale }: TopicCardProps) {
  const [copied, setCopied] = useState(false);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);
  const t = getDict(locale);
  const categoryEmoji = CATEGORIES.find((c) => c.id === topic.category)?.emoji;
  const categoryLabel = CATEGORY_LABELS[locale][topic.category]?.label;
  const depth = depthColors[topic.depth] || depthColors.light;

  const favoriteSnapshot = useSyncExternalStore(
    subscribeToTopicLibrary,
    getFavoriteTopicsSnapshot,
    getEmptyTopicLibrarySnapshot
  );
  const isFav = (JSON.parse(favoriteSnapshot) as Topic[]).some((saved) => saved.id === topic.id);

  const handleCopy = async () => {
    const copiedSuccessfully = await copyText(topic.text);
    if (!copiedSuccessfully) {
      setManualCopyText(topic.text);
      track("copy_error", {
        tool_type: "topic_card",
        result_type: "topic",
        topic_id: topic.id,
        copy_surface: "generated_card",
        topic_locale: locale,
      });
      return;
    }
    track("copy_result", {
      tool_type: "topic_card",
      result_type: "topic",
      topic_id: topic.id,
      topic_category: topic.category,
      copy_surface: "generated_card",
      topic_locale: locale,
    });
    setManualCopyText(null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    const added = toggleFavoriteTopic(topic);
    track(added ? "save_result" : "remove_saved_result", {
      tool_type: "topic_card",
      result_type: "topic",
      topic_id: topic.id,
      topic_category: topic.category,
      save_surface: "generated_card",
      topic_locale: locale,
    });
  };

  return (
    <motion.div
      className="topic-card"
      style={{ position: "relative", overflow: "hidden" }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Subtle left-side gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "120px",
          background:
            "linear-gradient(90deg, rgba(177, 78, 255, 0.06) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header row */}
      <div
        className="flex items-start justify-between gap-4 mb-4"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryEmoji}</span>
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {categoryLabel}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: "9999px",
              background: depth.bg,
              border: `1px solid ${depth.border}`,
              color: depth.text,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {topic.depth}
          </span>
        </div>

      </div>

      {/* Topic heading */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)",
          fontWeight: 700,
          lineHeight: 1.35,
          marginBottom: "16px",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          position: "relative",
          zIndex: 1,
        }}
      >
        {topic.text}
      </h3>

      {/* Talking points with left accent border */}
      {topic.talkingPoints.length > 0 && (
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {topic.talkingPoints.map((point, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                paddingLeft: "12px",
                borderLeft: "2px solid rgba(177, 78, 255, 0.25)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor =
                  "rgba(177, 78, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor =
                  "rgba(177, 78, 255, 0.25)";
              }}
            >
              {point}
            </li>
          ))}
        </ul>
      )}

      <div
        className="mt-5 flex flex-wrap gap-2"
        style={{ position: "relative", zIndex: 1 }}
        aria-label={locale === "es" ? "Acciones del tema" : "Topic actions"}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--neon-cyan)] transition-colors hover:bg-[var(--neon-cyan)]/15"
        >
          <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
          {copied ? (locale === "es" ? "Copiado" : "Copied") : t.card.copy}
        </button>
        <button
          type="button"
          onClick={handleFavorite}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
            isFav
              ? "border-[var(--neon-pink)]/40 bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]"
              : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-pink)]/30"
          }`}
        >
          <span aria-hidden="true">{isFav ? "♥" : "♡"}</span>
          {isFav ? t.card.removeFav : t.card.saveFav}
        </button>
      </div>

      {manualCopyText ? (
        <div className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3" style={{ position: "relative", zIndex: 1 }}>
          <label className="text-xs text-amber-100" htmlFor={`manual-copy-${topic.id}`}>
            {locale === "es"
              ? "Tu navegador bloqueó la copia automática. Selecciona el texto:"
              : "Your browser blocked automatic copying. Select the text below:"}
          </label>
          <input
            id={`manual-copy-${topic.id}`}
            readOnly
            value={manualCopyText}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
          />
        </div>
      ) : null}

      {/* Mode tags + share buttons */}
      <div
        className="flex items-center justify-between gap-3 mt-4 pt-4"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.04)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          {topic.modes.map((mode) => (
            <span
              key={mode}
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                color: "var(--text-muted)",
                letterSpacing: "0.02em",
                transition: "all 0.2s",
              }}
            >
              {mode}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">{locale === "es" ? "Compartir" : "Share"}</span>
          <ShareButtons topic={topic} locale={locale} />
        </div>
      </div>
    </motion.div>
  );
}
