"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Topic, CATEGORIES } from "@/data/types";

interface TopicCardProps {
  topic: Topic;
  index?: number;
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

export default function TopicCard({ topic, index = 0 }: TopicCardProps) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES.find((c) => c.id === topic.category);
  const depth = depthColors[topic.depth] || depthColors.light;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(topic.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <span className="text-lg">{category?.emoji}</span>
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {category?.label}
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

        {/* Copy button with glow hover */}
        <button
          onClick={handleCopy}
          title="Copy topic"
          style={{
            flexShrink: 0,
            padding: "8px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "transparent",
            color: copied ? "var(--neon-green)" : "var(--text-muted)",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = "var(--neon-cyan)";
            el.style.borderColor = "rgba(0, 229, 255, 0.3)";
            el.style.background = "rgba(0, 229, 255, 0.08)";
            el.style.boxShadow = "0 0 16px rgba(0, 229, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = copied ? "var(--neon-green)" : "var(--text-muted)";
            el.style.borderColor = "rgba(255,255,255,0.06)";
            el.style.background = "transparent";
            el.style.boxShadow = "none";
          }}
        >
          {copied ? (
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 9l3 3 5-5" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="6" y="6" width="10" height="10" rx="2" />
              <path d="M4 12V4a2 2 0 012-2h8" />
            </svg>
          )}
        </button>
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

      {/* Mode tags - subtle pill style */}
      <div
        className="flex flex-wrap gap-1.5 mt-4 pt-4"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.04)",
          position: "relative",
          zIndex: 1,
        }}
      >
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
    </motion.div>
  );
}
