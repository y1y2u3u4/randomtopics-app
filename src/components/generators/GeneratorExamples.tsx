import type { GeneratorResult } from "./GeneratorUI";

export interface ExampleSet { label: string; results: Pick<GeneratorResult, "title" | "subtitle" | "detail">[] }

// Worked examples rendered on the server from the page's own generator with
// fixed seeds, so they are real output and the same on every visit.
export default function GeneratorExamples({ sets, note }: { sets: ExampleSet[]; note?: string }) {
  return (
    <div className="not-prose">
      {note && <p className="mb-3">{note}</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {sets.map((set) => (
          <div key={set.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)] mb-2">{set.label}</p>
            <ul className="space-y-2">
              {set.results.map((r, i) => (
                <li key={`${r.title}-${i}`}>
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">{r.title}</span>
                  {r.subtitle && <span className="block text-xs text-[var(--text-muted)]">{r.subtitle}</span>}
                  {r.detail && <span className="block text-xs text-[var(--text-secondary)] whitespace-pre-line mt-0.5">{r.detail}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
