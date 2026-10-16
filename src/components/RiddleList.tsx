import type { Riddle } from "@/data/riddlesForKids";

// Server-rendered riddle list: the answer sits in a native <details>, so it is
// hidden until tapped, readable by search engines and works without JS.
export default function RiddleList({ heading, riddles }: { heading: string; riddles: Riddle[] }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
      <div className="glass-card p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5" style={{ fontFamily: "var(--font-display)" }}>{heading}</h2>
        <ol className="space-y-3 list-decimal pl-6 text-sm text-[var(--text-secondary)]">
          {riddles.map((r) => (
            <li key={r.q}>
              <p className="text-[var(--text-primary)]">{r.q}</p>
              <details className="mt-1">
                <summary className="cursor-pointer text-xs font-semibold text-[var(--neon-cyan)]">Show answer</summary>
                <p className="mt-1">{r.a}</p>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
