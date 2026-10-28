"use client";

import { useEffect, useRef } from "react";

const EVENT = "rt-preset";

/** Listens for QuickSet clicks addressed to one tool (e.g. "numbers", "letters", "teams"). */
export function usePreset(tool: string, handler: (id: string) => void) {
  const ref = useRef(handler);
  useEffect(() => { ref.current = handler; });
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ tool: string; id: string }>).detail;
      if (d?.tool === tool) ref.current(d.id);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [tool]);
}

/** A button inside a how-to section that runs a preset in the tool above, then scrolls back to it. */
export default function QuickSet({ tool, id, children }: { tool: string; id: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(EVENT, { detail: { tool, id } }));
        document.getElementById("tool")?.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }}
      className="inline-flex items-center min-h-10 px-3.5 py-1.5 rounded-xl text-sm border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] hover:bg-[rgba(0,229,255,0.08)] transition-colors"
    >
      {children}
    </button>
  );
}

/** Row of QuickSet buttons. */
export function QuickRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2 my-2">{children}</div>;
}

/** True when a key press should not trigger the tool (typing in a field, or pressing a control). */
export function typingTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(el.tagName) || el.isContentEditable);
}
