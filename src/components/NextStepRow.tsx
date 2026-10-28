"use client";

import { useEffect, useState } from "react";
import NextLink from "@/components/NextLink";
import { NEXT_STEPS } from "@/data/nextCards";
import { sessionGenerateCount } from "@/lib/track";

/** Generations in this tab before the row points at the full list instead of the next game. */
export const NEXT_STEP_AFTER = 3;

// Static "next step" line right under the result. Always one line of the same
// height (no layout shift): the link is the next game at first and swaps to the
// page's full list once the visitor has generated a few times.
export default function NextStepRow({ path }: { path: string }) {
  const step = NEXT_STEPS[path];
  const [many, setMany] = useState(false);
  useEffect(() => {
    const sync = () => setMany(sessionGenerateCount() >= NEXT_STEP_AFTER);
    sync();
    window.addEventListener("rt:generate", sync);
    return () => window.removeEventListener("rt:generate", sync);
  }, []);
  if (!step) return null;
  const target = many ? step.collection : step.next;
  return (
    <div className="mb-3 flex min-h-11 items-center gap-2 text-sm print:hidden">
      <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Next step</span>
      <NextLink event="next_result_click" from={path} href={target.href} slot={many ? "result_collection" : "result_next"}
        className="mode-chip min-w-0 max-w-full truncate">
        <span aria-hidden="true">{target.emoji}</span> {target.label} →
      </NextLink>
    </div>
  );
}
