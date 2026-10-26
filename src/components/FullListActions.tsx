"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";

// Copy-all and print for a server-rendered full list (2026-10-26 growth review:
// top-3 competitors offer copy-all / printable decks; the list itself stays in the HTML).
export default function FullListActions({ items, label, page }: { items: string[]; label: string; page: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copyAll() {
    track("full_list_copy", { page_path: page, item_count: items.length });
    let ok = false;
    try { ok = await copyText(items.map((item, i) => `${i + 1}. ${item}`).join("\n")); }
    catch { /* The list stays on the page for manual copying. */ }
    setState(ok ? "copied" : "failed");
  }
  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button type="button" onClick={copyAll} className="min-h-11 rounded-full border border-[var(--neon-cyan)]/40 px-4 text-sm font-semibold text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10">
        {state === "copied" ? "Copied!" : state === "failed" ? "Copy failed – select the list instead" : `Copy all ${items.length} ${label}`}
      </button>
      <button type="button" onClick={() => { track("full_list_print", { page_path: page }); window.print(); }} className="min-h-11 rounded-full border border-[var(--border-subtle,rgba(255,255,255,0.15))] px-4 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        Print the list
      </button>
    </div>
  );
}
