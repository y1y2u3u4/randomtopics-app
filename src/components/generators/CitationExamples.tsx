import { formatCitation, toHtml, type StyleId } from "@/lib/citations/format";
import { EXAMPLES } from "@/data/citations/examples";

// Worked examples rendered by the same engine as the generator.
export default function CitationExamples({ style, ids, headline = true }: { style: StyleId; ids: string[]; headline?: boolean }) {
  return (
    <div className="space-y-4">
      {ids.map((id, i) => {
        const ex = EXAMPLES[id];
        const f = formatCitation(style, ex.source, { headline, number: i + 1, page: style === "acs" ? undefined : "12" });
        return (
          <div key={id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">{ex.label}</p>
            <p className="text-[var(--text-primary)] pl-8 -indent-8 break-words" dangerouslySetInnerHTML={{ __html: `${style === "acs" ? `(${i + 1}) ` : ""}${toHtml(f.reference)}` }} />
            {f.inText.map((t) => (
              <p key={t.label} className="text-sm mt-1"><span className="text-[var(--text-muted)]">{t.label}{style !== "acs" ? " (page 12)" : ""}: </span><span dangerouslySetInnerHTML={{ __html: toHtml(t.value) }} /></p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
