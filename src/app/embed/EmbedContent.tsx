"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { topics } from "@/data/topics";
import { Topic, Mode, Category, CATEGORIES } from "@/data/types";

export default function EmbedContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as Mode | null;
  const category = searchParams.get("category") as Category | null;
  const theme = searchParams.get("theme") || "dark";

  const [topic, setTopic] = useState<Topic | null>(null);

  const generate = useCallback(() => {
    let pool = [...topics];
    if (mode) pool = pool.filter((t) => t.modes.includes(mode));
    if (category) pool = pool.filter((t) => t.category === category);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setTopic(picked || null);
  }, [mode, category]);

  useEffect(() => {
    generate();
  }, [generate]);

  const isDark = theme === "dark";
  const bg = isDark ? "#0e0e1a" : "#ffffff";
  const text = isDark ? "#eef2ff" : "#1a1a2e";
  const muted = isDark ? "#8b95b0" : "#666";
  const accent = "#ff2d78";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const catInfo = topic ? CATEGORIES.find((c) => c.id === topic.category) : null;

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: bg,
        color: text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {topic && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px" }}>{catInfo?.emoji}</span>
            <span
              style={{
                fontSize: "11px",
                color: muted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {catInfo?.label}
            </span>
          </div>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              lineHeight: 1.4,
              margin: 0,
              flex: 1,
            }}
          >
            {topic.text}
          </p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: `1px solid ${border}`,
        }}
      >
        <button
          onClick={generate}
          style={{
            background: `linear-gradient(135deg, ${accent}, #ff6b35)`,
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          New Topic
        </button>
        <a
          href="https://randomtopics.app?ref=embed"
          target="_blank"
          rel="noopener"
          style={{ fontSize: "10px", color: muted, textDecoration: "none" }}
        >
          randomtopics.app
        </a>
      </div>
    </div>
  );
}
