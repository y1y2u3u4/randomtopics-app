"use client";

import { useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { QOTD_CATEGORIES, QOTD_QUESTIONS, parseQotdPreference, qotdIndexForCategory } from "@/data/questionOfTheDay";
import { embedFont, embedTheme } from "../embedTheme";

const noopSubscribe = () => () => {};

export default function QotdEmbed() {
  const params = useSearchParams();
  const cat = parseQotdPreference(params.get("cat"));
  const t = embedTheme(params.get("theme"));
  // Today's question is computed from the viewer's local date, like the main page.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [picked, setIndex] = useState<number | null>(null);
  const [extra, setExtra] = useState(false);
  const index = picked ?? (mounted ? qotdIndexForCategory(new Date(), cat) : null);

  const another = () => {
    const pool = QOTD_QUESTIONS.flatMap((q, i) => (cat === "all" || q.c === cat) && i !== index ? [i] : []);
    setIndex(pool[Math.floor(Math.random() * pool.length)]);
    setExtra(true);
  };

  const q = index === null ? null : QOTD_QUESTIONS[index];
  const label = cat === "all" ? null : QOTD_CATEGORIES.find((c) => c.id === cat);
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ fontFamily: embedFont, background: t.bg, color: t.text, minHeight: "100vh", boxSizing: "border-box", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted }}>
        {extra ? "Bonus question" : "Question of the day"}{label ? ` · ${label.emoji} ${label.label}` : ""}
      </div>
      <div style={{ fontSize: 12, color: t.muted }} suppressHydrationWarning>{date}</div>
      <p style={{ margin: 0, flex: 1, fontSize: 20, lineHeight: 1.35, fontWeight: 800 }}>{q ? q.q : " "}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderTop: `1px solid ${t.border}`, paddingTop: 10 }}>
        <button
          type="button"
          onClick={another}
          style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, color: "#fff", border: 0, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          Another question
        </button>
        <a href="https://randomtopics.app/question-of-the-day?ref=embed_qotd" target="_blank" rel="noopener" style={{ fontSize: 11, color: t.muted, textDecoration: "none" }}>
          Powered by Random Topics
        </a>
      </div>
    </div>
  );
}
