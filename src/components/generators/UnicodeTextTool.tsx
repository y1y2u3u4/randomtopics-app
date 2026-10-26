"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { DEFAULT_TEXT, HAS_STRENGTH, STYLE_SETS, TEXT_TOOLS, type Variant } from "@/lib/unicodeText";

/** Sibling text tools, shown as tabs above the input so people can hop between styles. */
const MAX_LEN = 200;

export default function UnicodeTextTool({ variant, toolType }: { variant: Variant; toolType: string }) {
  const styles = STYLE_SETS[variant];
  const hasStrength = HAS_STRENGTH[variant];
  const [text, setText] = useState(DEFAULT_TEXT[variant]);
  const [strength, setStrength] = useState(5);
  const [copied, setCopied] = useState("");
  const [shared, setShared] = useState(false);
  const typed = useRef(false);

  // ?t=…&k=… lets people share a link that opens with their text already styled.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("t");
    const k = Number(p.get("k"));
    /* eslint-disable react-hooks/set-state-in-effect -- one-time restore of a shared link's text */
    if (t) setText(t.slice(0, MAX_LEN));
    if (k >= 1 && k <= 10) setStrength(k);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const outputs = useMemo(
    () => styles.map((st) => ({ ...st, out: st.transform(text || DEFAULT_TEXT[variant], strength) })),
    [styles, text, strength, variant],
  );

  const copy = async (id: string, value: string) => {
    if (!(await copyText(value))) return;
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? "" : c)), 1400);
    track("tool_use", { tool_type: toolType, action: "copy", style: id, locale: "en" });
    track("copy_result", { tool_type: toolType, style: id, locale: "en" });
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("t", text);
    if (hasStrength) url.searchParams.set("k", String(strength));
    if (!(await copyText(url.toString()))) return;
    setShared(true);
    setTimeout(() => setShared(false), 1500);
    track("share_click", { tool_type: toolType, locale: "en" });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-7">
        <nav aria-label="Text styles" className="flex flex-wrap gap-1.5 mb-4">
          {TEXT_TOOLS.map((t) => (
            <Link prefetch={false}
              key={t.variant}
              href={t.href}
              aria-current={t.variant === variant ? "page" : undefined}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg border transition-all ${
                t.variant === variant
                  ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                  : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <label htmlFor="unicode-input" className="sr-only">Type your text</label>
        <textarea
          id="unicode-input"
          value={text}
          maxLength={MAX_LEN}
          rows={2}
          onChange={(e) => {
            setText(e.target.value);
            if (!typed.current) {
              typed.current = true;
              track("tool_use", { tool_type: toolType, action: "type", locale: "en" });
            }
          }}
          placeholder="Type or paste your text…"
          className="w-full resize-none rounded-2xl bg-[var(--bg-secondary)] border border-white/10 focus:border-[var(--neon-cyan)] outline-none px-4 py-3 text-lg sm:text-xl text-[var(--text-primary)]"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          {hasStrength ? (
            <label className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              Strength
              <input
                type="range"
                min={1}
                max={10}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="accent-[var(--neon-cyan)] w-36 sm:w-48"
                aria-valuetext={`${strength} of 10`}
              />
              <span className="tabular-nums text-[var(--text-primary)] w-6">{strength}</span>
            </label>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">{styles.length} styles · tap any row to copy</p>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={() => setText("")} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50">
              Clear
            </button>
            <button type="button" onClick={share} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50">
              {shared ? "Link copied" : "Share link"}
            </button>
          </div>
        </div>

        <ul aria-live="polite" className="mt-5 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02]" data-unicode-results>
          {outputs.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => copy(o.id, o.out)}
                className="group w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                    {o.label}
                    {o.note && <span className="normal-case tracking-normal text-[var(--neon-cyan)]/80"> · {o.note}</span>}
                  </span>
                  <span className="block text-lg sm:text-xl text-[var(--text-primary)] break-words leading-relaxed mt-0.5" style={{ overflowWrap: "anywhere" }}>
                    {o.out}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    copied === o.id
                      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)]"
                      : "border-white/10 text-[var(--text-secondary)] group-hover:border-[var(--neon-cyan)]/50"
                  }`}
                >
                  {copied === o.id ? "Copied ✓" : "Copy"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3">
          Runs in your browser — nothing you type is sent anywhere.
        </p>
      </div>
    </section>
  );
}
