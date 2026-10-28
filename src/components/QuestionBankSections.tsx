import type { BankView } from "@/data/questionBanks/apply";
import { sectionId } from "@/lib/sectionId";

type WyrCat = Extract<BankView, { kind: "wyr" }>["cats"][number];
type TodCat = Extract<BankView, { kind: "tod" }>["cats"][number];

// Server-rendered question lists: every question is real HTML (crawlable, printable).
// Markup is kept minimal on purpose (the page carries 400+ items); numbering is native <ol>.
// QuestionBankPlayer reads the [data-qb] items back out of the DOM, so nothing ships twice.
const OL = "space-y-2.5 pl-8 list-decimal marker:font-bold marker:text-[var(--neon-pink)] text-sm leading-relaxed text-[var(--text-secondary)]";

function Card({ heading, description, children }: { heading: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={sectionId(heading)} className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-10 sm:px-6">
      <div className="glass-card p-8 sm:p-10">
        <h2 className="mb-2 text-xl font-bold text-[var(--text-primary)] sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>{heading}</h2>
        {description && <p className="mb-5 text-sm text-[var(--text-muted)]">{description}</p>}
        {children}
      </div>
    </section>
  );
}

export default function QuestionBankSections({ bank, midSlot }: { bank: BankView; midSlot?: React.ReactNode }) {
  // Running question numbers are computed up front (render stays pure).
  const sizes: number[] = [];
  for (const c of bank.cats) {
    if (bank.kind === "wyr") sizes.push((c as WyrCat).entries.length);
    else { const t = c as TodCat; sizes.push(t.truths.length, t.dares.length); }
  }
  if (bank.kind === "wyr") for (const s of bank.legacy) sizes.push(s.items.length);
  const starts = sizes.map((_, i) => sizes.slice(0, i).reduce((a, b) => a + b, 0));
  const half = Math.floor(bank.cats.length / 2);
  return (
    <>
      {bank.cats.map((c, idx) => {
        const start = starts[bank.kind === "wyr" ? idx : idx * 2];
        const body = bank.kind === "wyr" ? (
          <ol className={OL} start={start + 1} data-cat={c.id}>
            {(c as WyrCat).entries.map((e) => (
              <li key={e.text} data-qb="">Would you rather <span data-o="">{e.a}</span> or <span data-o="">{e.b}</span>?</li>
            ))}
          </ol>
        ) : (
          (["truth", "dare"] as const).map((type) => {
            const list = (c as TodCat)[type === "truth" ? "truths" : "dares"];
            const base = type === "truth" ? start : start + (c as TodCat).truths.length;
            return (
              <div key={type} className="mt-4 first:mt-0">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider" style={{ color: type === "truth" ? "var(--neon-cyan)" : "var(--neon-pink)" }}>
                  {type === "truth" ? "Truth questions" : "Dares"}
                </h3>
                <ol className={OL} start={base + 1} data-cat={c.id} data-type={type}>
                  {list.map((t) => <li key={t} data-qb="">{t}</li>)}
                </ol>
              </div>
            );
          })
        );
        return (
          <div key={c.id}>
            <Card heading={c.heading} description={c.description}>{body}</Card>
            {idx === half - 1 ? midSlot : null}
          </div>
        );
      })}
      {bank.kind === "wyr" && bank.legacy.map((s, li) => (
        <Card key={s.heading} heading={s.heading} description={s.description}>
          <ol className={OL} start={starts[bank.cats.length + li] + 1}>
            {s.items.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </Card>
      ))}
    </>
  );
}
