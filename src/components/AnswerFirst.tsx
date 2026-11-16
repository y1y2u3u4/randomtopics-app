import Link from "next/link";
import { FREE_RULE, POPULAR_GENERATORS } from "@/data/popularGenerators";

/**
 * The block that sits right under a generator: a 40–60 word answer to the
 * page's most common "give me a …" search, a small example table, the shared
 * free rule, and links to the other popular generators. Server-rendered so
 * Google snippets and ChatGPT's fetcher see a real answer without running JS.
 */
export default function AnswerFirst({
  path,
  question,
  answer,
  table,
}: {
  path: string;
  question: string;
  answer: string;
  table?: { caption: string; head: string[]; rows: string[][] };
}) {
  const others = POPULAR_GENERATORS.filter((g) => g.href !== path);
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6" aria-labelledby="answer-first">
      <div className="glass-card p-5 sm:p-6 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        <h2 id="answer-first" className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{question}</h2>
        <p>{answer}</p>
        {table && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <caption className="sr-only">{table.caption}</caption>
              <thead>
                <tr>
                  {table.head.map((h) => (
                    <th key={h} scope="col" className="py-1.5 pr-3 font-semibold text-[var(--text-primary)] border-b border-[var(--border-subtle,rgba(255,255,255,0.1))]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell, i) => (
                      <td key={i} className="py-1.5 pr-3 align-top border-b border-[var(--border-subtle,rgba(255,255,255,0.06))]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[var(--neon-cyan)]">{FREE_RULE}</p>
        <nav aria-label="Popular generators" className="pt-1">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Popular generators</p>
          <ul className="flex flex-wrap gap-2">
            {others.map((g) => (
              <li key={g.href}>
                <Link prefetch={false} href={g.href} className="inline-block rounded-full border border-[var(--neon-cyan)]/25 px-3 py-1 text-xs hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/60">
                  <span aria-hidden="true">{g.emoji} </span>{g.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
