"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Topic, CATEGORIES } from "@/data/types";

interface TopicCardProps {
  topic: Topic;
  index?: number;
}

export default function TopicCard({ topic, index = 0 }: TopicCardProps) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES.find((c) => c.id === topic.category);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(topic.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="topic-card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.emoji}</span>
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {category?.label}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              topic.depth === "light"
                ? "bg-green-500/15 text-green-400"
                : topic.depth === "medium"
                ? "bg-yellow-500/15 text-yellow-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {topic.depth}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          title="Copy topic"
        >
          {copied ? (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l3 3 5-5" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="10" height="10" rx="2" />
              <path d="M4 12V4a2 2 0 012-2h8" />
            </svg>
          )}
        </button>
      </div>

      <h3
        className="text-xl sm:text-2xl font-semibold leading-snug mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {topic.text}
      </h3>

      {topic.talkingPoints.length > 0 && (
        <ul className="space-y-2">
          {topic.talkingPoints.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
            >
              <span className="text-[var(--accent-purple)] mt-0.5">•</span>
              {point}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
        {topic.modes.map((mode) => (
          <span
            key={mode}
            className="text-xs px-2 py-1 rounded-md bg-white/5 text-[var(--text-muted)]"
          >
            {mode}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
