import Link from "next/link";

// A short, quotable fact table (counts, rules, privacy) plus who checked it and
// when. Answer engines cite pages that state these plainly; keep values true.
export default function FactSheet({ heading, rows, updated, steps, stepsName }: {
  heading: string;
  rows: [string, string][];
  updated: string;
  steps?: string[];
  stepsName?: string;
}) {
  const updatedLabel = new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
      <div className="glass-card p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{heading}</h2>
        <table className="w-full mt-4 text-sm text-left">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-t border-white/10 align-top">
                <th scope="row" className="py-2 pr-4 font-semibold text-[var(--text-primary)] w-1/3">{k}</th>
                <td className="py-2 text-[var(--text-secondary)]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {steps && (
          <>
            <h3 className="mt-6 font-bold text-[var(--text-primary)]">{stepsName}</h3>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-[var(--text-secondary)]">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </>
        )}
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Updated <time dateTime={updated}>{updatedLabel}</time> · Written and checked by the RandomTopics editors ·{" "}
          <Link prefetch={false} href="/how-we-curate" className="underline">How we curate</Link> · <Link prefetch={false} href="/facts" className="underline">Site facts</Link>
        </p>
      </div>
      {steps && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "HowTo", name: stepsName, step: steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })) }) }}
        />
      )}
    </section>
  );
}
