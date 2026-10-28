"use client";

import { useEffect, useState, type ComponentType } from "react";

type Props = { kind: "wyr" | "tod"; cats: { id: string; label: string }[]; initial?: { a: string; b: string } };

const chip = "inline-flex min-h-9 items-center rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)]";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Server-rendered first paint with the same layout as the live player, so the first screen
// shows at once; the interactive code is a separate chunk that never blocks the page.
function Skeleton({ kind, cats, initial }: Props) {
  return (
    <section className="glass-card p-4 sm:p-6" aria-label={kind === "wyr" ? "Would you rather picker" : "Truth or dare party mode"}>
      <div className="flex flex-wrap gap-2">
        <span className={`${chip} border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]`}>All</span>
        {cats.map((c) => <span key={c.id} className={chip}>{c.label}</span>)}
      </div>
      <div className="mt-4">
        {kind === "wyr" && initial ? (
          <>
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#FFE234]">Would you rather...</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex min-h-28 items-center justify-center rounded-2xl border-2 border-[var(--neon-cyan)] p-4 text-center text-base font-bold text-[var(--text-primary)] sm:text-lg">{cap(initial.a)}</div>
              <div className="flex min-h-28 items-center justify-center rounded-2xl border-2 border-[var(--neon-pink)] p-4 text-center text-base font-bold text-[var(--text-primary)] sm:text-lg">{cap(initial.b)}</div>
            </div>
            <div className="mt-3 flex justify-center"><span className="btn-generate inline-flex min-h-11 items-center px-5 py-2 text-sm">Random question</span></div>
          </>
        ) : (
          <>
            <p className="text-center text-sm font-semibold text-[var(--text-secondary)]">Truth or dare?</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <span className="flex min-h-14 items-center justify-center rounded-xl border-2 border-[var(--neon-cyan)] text-lg font-extrabold uppercase text-[var(--neon-cyan)]">Truth</span>
              <span className="flex min-h-14 items-center justify-center rounded-xl border-2 border-[var(--neon-pink)] text-lg font-extrabold uppercase text-[var(--neon-pink)]">Dare</span>
            </div>
            <div className="mt-3 flex min-h-24 items-center justify-center rounded-2xl border-2 border-dashed border-white/15 p-4 text-center text-sm text-[var(--text-muted)]">Pick truth or dare to draw a prompt from all categories.</div>
          </>
        )}
      </div>
    </section>
  );
}

export default function QuestionBankPlayerLazy(props: Props) {
  const [Player, setPlayer] = useState<ComponentType<Props> | null>(null);
  useEffect(() => {
    let live = true;
    import("./QuestionBankPlayer").then((m) => { if (live) setPlayer(() => m.default); });
    return () => { live = false; };
  }, []);
  return Player ? <Player {...props} /> : <Skeleton {...props} />;
}
