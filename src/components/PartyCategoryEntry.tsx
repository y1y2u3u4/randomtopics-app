"use client";

import { track } from "@/lib/track";

/** Select the actual article corpus, without replacing a round in progress. */
export default function PartyCategoryEntry({ groupIndex }: { groupIndex: number }) {
  return <a href="#generator-es_most_likely_article" className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-[var(--neon-cyan)]/30 px-4 py-2 text-sm font-semibold text-[var(--neon-cyan)]" onClick={() => {
    window.dispatchEvent(new CustomEvent("rt:party-category", { detail: { groupId: `group_${groupIndex}` } }));
    track("party_category_entry", { content_source: "es_most_likely_article", generator_category: `group_${groupIndex}`, locale: "es" });
    document.querySelector<HTMLSelectElement>("#generator-es_most_likely_article select")?.focus({ preventScroll: true });
  }}>Preparar una ronda de esta categoría ↑</a>;
}
