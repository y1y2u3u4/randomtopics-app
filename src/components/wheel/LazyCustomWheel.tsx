"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

/**
 * Loads the full wheel tool only when it scrolls near the viewport (or is focused),
 * so pages that mention a wheel below the fold pay no JavaScript for it on first load.
 */
export default function LazyCustomWheel({ preset, pageId }: { preset?: string; pageId: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [Tool, setTool] = useState<ComponentType<{ extended: { pageId: string; pro: boolean; preset?: string } }> | null>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || Tool) return;
    let cancelled = false;
    const load = () => { void import("@/components/generators/WheelOfNames").then((m) => { if (!cancelled) setTool(() => m.default); }); };
    if (typeof IntersectionObserver === "undefined") { load(); return () => { cancelled = true; }; }
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: "400px" });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); };
  }, [Tool]);
  return (
    <div ref={host} className="min-h-[640px] md:min-h-[520px]" onFocusCapture={() => { if (!Tool) void import("@/components/generators/WheelOfNames").then((m) => setTool(() => m.default)); }}>
      {Tool ? <Tool extended={{ pageId, pro: true, preset }} /> : <p className="text-center text-sm text-[var(--text-muted)] pt-8">Loading the custom wheel…</p>}
    </div>
  );
}
