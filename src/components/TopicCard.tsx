"use client";

import { motion } from "framer-motion";
import { Topic, CATEGORIES } from "@/data/types";
import { Locale, defaultLocale } from "@/i18n/config";
import { CATEGORY_LABELS } from "@/i18n/dictionaries";
import GeneratedResultActions from "@/components/GeneratedResultActions";

interface TopicCardProps {
  topic: Topic;
  index?: number;
  locale?: Locale;
  contentSource?: string;
  actionContext?: "generated_result" | "editorial_card" | "saved_library";
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

export default function TopicCard({
  topic,
  index = 0,
  locale = defaultLocale,
  contentSource = "topic_card",
  actionContext = "editorial_card",
}: TopicCardProps) {
  const categoryEmoji = CATEGORIES.find((c) => c.id === topic.category)?.emoji;
  const categoryLabel = CATEGORY_LABELS[locale][topic.category]?.label;
  const depth = depthColors[topic.depth] || depthColors.light;

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

      <div className="mt-5" style={{ position: "relative", zIndex: 1 }}>
        <GeneratedResultActions
          text={topic.text}
          copyValue={[topic.text, ...topic.talkingPoints.map((point) => `• ${point}`)].join("\n")}
          shareTitle={locale === "es" ? "Tema de Random Topics" : "Topic from Random Topics"}
          saveTopic={topic}
          locale={locale}
          toolType="topic_card"
          contentSource={contentSource}
          actionSurface={actionContext}
          isPostGenerate={actionContext === "generated_result"}
          compact
        />
      </div>

      {/* Mode tags */}
      <div
        className="flex items-center gap-3 mt-4 pt-4"
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
      </div>
    </motion.div>
  );
}
