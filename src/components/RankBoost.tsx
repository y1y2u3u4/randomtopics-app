import Link from "next/link";
import type { ReactNode } from "react";

// Extra, original content sections for pages that rank 5-9 on Google but earn a
// low CTR. Content lives in src/data/rankBoost.ts; this only renders it.
export type BoostBlock =
  | { t: "p"; x: string }
  | { t: "h3"; x: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

export interface BoostSection {
  h2: string;
  id?: string;
  blocks: BoostBlock[];
}

export interface BoostFaq { question: string; answer: string }

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const linkClass = "text-[var(--neon-cyan)] hover:underline";

// Inline markup: [label](/path) becomes an internal link; everything else is text.
export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(<Link prefetch={false} key={key++} href={m[2]} className={linkClass}>{m[1]}</Link>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Blocks({ blocks }: { blocks: BoostBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i}>{renderInline(b.x)}</p>;
        if (b.t === "h3") return <h3 key={i} className="text-base font-semibold text-[var(--text-primary)] pt-2">{b.x}</h3>;
        if (b.t === "ul") return <ul key={i} className="list-disc pl-5 space-y-1">{b.items.map((it) => <li key={it}>{renderInline(it)}</li>)}</ul>;
        if (b.t === "ol") return <ol key={i} className="list-decimal pl-5 space-y-1">{b.items.map((it) => <li key={it}>{renderInline(it)}</li>)}</ol>;
        if (b.t !== "table") return null;
        return (
          <div key={i} className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-left">
              <thead><tr className="border-b border-white/15">{b.head.map((h) => <th key={h} className="py-2 pr-3 font-semibold text-[var(--text-primary)]">{h}</th>)}</tr></thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-white/10 align-top">
                    {r.map((c, j) => <td key={j} className={`py-2 pr-3 ${j === 0 ? "text-[var(--text-primary)]" : ""}`}>{renderInline(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

/**
 * variant "inline": H2 sections inside an existing text column (generator shell content).
 * variant "card": a standalone glass card section, like the other SEO sections.
 */
export default function RankBoost({ sections, variant = "card", faq = [] }: { sections: BoostSection[]; variant?: "inline" | "card"; faq?: BoostFaq[] }) {
  const body = sections.map((s) => (
    <section key={s.h2} id={s.id} className={variant === "card" ? "scroll-mt-24" : "space-y-3 scroll-mt-24"}>
      <h2
        className={variant === "card" ? "text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3" : "text-xl font-semibold text-[var(--text-primary)] pt-3"}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {s.h2}
      </h2>
      <div className="space-y-3"><Blocks blocks={s.blocks} /></div>
    </section>
  ));
  if (variant === "inline") return <>{body}</>;
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
      <div className="glass-card p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-[var(--text-secondary)]">{body}<BoostFaqList items={faq} /></div>
    </section>
  );
}

/** Extra FAQ entries, rendered visibly; the page also appends them to its FAQPage schema. */
export function BoostFaqList({ items, heading = "More questions" }: { items: BoostFaq[]; heading?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
      <h3 className="text-base font-semibold text-[var(--text-primary)] pt-3">{heading}</h3>
      {items.map((f) => (
        <div key={f.question}>
          <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">{f.question}</h4>
          <p>{renderInline(f.answer)}</p>
        </div>
      ))}
    </div>
  );
}

/** Plain-text version of FAQ answers for FAQPage JSON-LD (drops the [label](/path) link markup). */
export function faqForSchema(items: BoostFaq[]): BoostFaq[] {
  return items.map((f) => ({ question: f.question, answer: f.answer.replace(LINK, "$1") }));
}
