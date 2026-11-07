"use client";

import { useState } from "react";
import { QOTD_CATEGORIES } from "@/data/questionOfTheDay";

type Kind = "qotd" | "wheel";
const MODES = [
  { id: "", label: "All topics" },
  { id: "conversation", label: "Conversation" },
  { id: "writing", label: "Writing" },
  { id: "debate", label: "Debate" },
  { id: "speech", label: "Speech" },
  { id: "icebreaker", label: "Icebreaker" },
];
const SITE = "https://randomtopics.app";

const selectClass = "w-full rounded-lg border border-white/10 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]";

export default function WidgetBuilder() {
  const [kind, setKind] = useState<Kind>("qotd");
  const [cat, setCat] = useState("all");
  const [mode, setMode] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState<string | null>(null);

  const q = new URLSearchParams();
  if (kind === "qotd" && cat !== "all") q.set("cat", cat);
  if (kind === "wheel" && mode) q.set("mode", mode);
  if (theme === "dark") q.set("theme", "dark");
  const path = `/embed/${kind}${q.toString() ? `?${q}` : ""}`;
  const height = kind === "qotd" ? 260 : 420;
  const title = kind === "qotd" ? "Question of the Day" : "Spin the Wheel";
  const back = kind === "qotd" ? "/question-of-the-day" : "/spin-the-wheel";
  const url = `${SITE}${path}`;
  const code =
    `<iframe src="${url}" title="${title} by Random Topics" width="100%" height="${height}" style="border:0;border-radius:12px;max-width:480px" loading="lazy"></iframe>\n` +
    `<p style="font-size:12px">${title} widget by <a href="${SITE}${back}">Random Topics</a></p>`;

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Widget">
          {(["qotd", "wheel"] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold border ${kind === k ? "border-[var(--neon-pink)] bg-[var(--neon-pink)]/15 text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)]"}`}
            >
              {k === "qotd" ? "❓ Question of the Day" : "🎡 Spin the Wheel"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {kind === "qotd" ? (
            <label className="text-xs text-[var(--text-secondary)] space-y-1">
              <span>Audience</span>
              <select className={selectClass} value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="all">Everyone</option>
                {QOTD_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </label>
          ) : (
            <label className="text-xs text-[var(--text-secondary)] space-y-1">
              <span>Topic type</span>
              <select className={selectClass} value={mode} onChange={(e) => setMode(e.target.value)}>
                {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </label>
          )}
          <label className="text-xs text-[var(--text-secondary)] space-y-1">
            <span>Theme</span>
            <select className={selectClass} value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <label className="block text-xs text-[var(--text-secondary)] space-y-1">
          <span>Embed code (Google Sites, Canvas, WordPress, any HTML page)</span>
          <textarea readOnly value={code} rows={5} className={`${selectClass} font-mono text-xs`} onFocus={(e) => e.currentTarget.select()} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => copy(code, "code")} className="rounded-lg bg-gradient-to-r from-[var(--neon-pink)] to-[#ff6b35] px-4 py-2 text-sm font-bold text-white">
            {copied === "code" ? "Copied ✓" : "Copy embed code"}
          </button>
          <button type="button" onClick={() => copy(url, "url")} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
            {copied === "url" ? "Copied ✓" : "Copy link (Notion)"}
          </button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs text-[var(--text-secondary)]">Live preview</p>
        <iframe key={path} src={path} title={`${title} widget preview`} width="100%" height={height} className="rounded-xl border border-white/10" style={{ maxWidth: 480 }} loading="lazy" />
      </div>
    </div>
  );
}
