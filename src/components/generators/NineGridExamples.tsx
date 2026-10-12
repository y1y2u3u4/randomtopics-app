"use client";

import { useEffect, useRef, useState } from "react";
import { KINDS, encodeShare, lookupItems, type GridItem, type GridKind } from "@/lib/generators/nineGrid";

export interface ExampleGrid { title: string; ids: string[] }

// Real grids made with this template. Covers are fetched from the source when
// the section scrolls into view, exactly like the maker; nothing is stored.
export default function NineGridExamples({ kind, examples, path }: { kind: GridKind; examples: ExampleGrid[]; path: string }) {
  const ref = useRef<HTMLElement>(null);
  const [items, setItems] = useState<Map<string, GridItem> | null>(null);
  const cfg = KINDS[kind];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // One lookup per grid: sources cap a lookup at nine items.
    const load = () => {
      Promise.all(examples.map((e) => lookupItems(kind, e.ids).catch(() => new Map<string, GridItem>())))
        .then((maps) => setItems(new Map(maps.flatMap((m) => [...m]))));
    };
    if (!("IntersectionObserver" in window)) { load(); return; }
    let done = false;
    const once = () => { if (!done) { done = true; io.disconnect(); window.clearTimeout(timer); load(); } };
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) once(); }, { rootMargin: "300px" });
    io.observe(el);
    // Fallback for browsers that skip observer callbacks (background tabs, some webviews).
    const timer = window.setTimeout(once, 5000);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [examples, kind]);

  const aspectClass = cfg.aspect === 1 ? "aspect-square" : "aspect-[3/4]";
  return (
    <section ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 pt-10" aria-labelledby="nine-grid-examples">
      <h2 id="nine-grid-examples" className="text-xl font-semibold text-[var(--text-primary)] mb-1 text-center" style={{ fontFamily: "var(--font-display)" }}>Example grids made with this template</h2>
      <p className="text-sm text-[var(--text-muted)] text-center mb-5">Open one to start from it, swap a few picks and download your own.</p>
      <ul className="grid gap-5 sm:grid-cols-3">
        {examples.map((ex) => {
          const slots = ex.ids.map((id) => items?.get(id) ?? null);
          const href = `${path}?${encodeShare(ex.ids.map((id) => (id ? { id, title: "", image: "" } : null)), ex.title, cfg.defaultTitle)}`;
          return (
            <li key={ex.title} className="glass-card p-3">
              <p className="text-sm font-semibold text-[var(--text-primary)] text-center mb-2">{ex.title}</p>
              <div className="grid grid-cols-3 gap-1" aria-label={`${ex.title}: ${slots.map((s) => s?.title).filter(Boolean).join(", ")}`}>
                {ex.ids.map((id, i) => {
                  const it = slots[i];
                  return (
                    <div key={`${id}-${i}`} className={`${aspectClass} rounded overflow-hidden bg-white/[0.05]`}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- remote cover, hotlinked */}
                      {it && <img src={it.thumb ?? it.image} alt={it.title} loading="lazy" className="w-full h-full object-cover" />}
                    </div>
                  );
                })}
              </div>
              <a href={href} className="block text-center text-xs text-[var(--neon-cyan)] mt-2 hover:underline">Open &amp; edit this grid →</a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
