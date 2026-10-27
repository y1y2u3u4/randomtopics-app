import Link from "@/components/PartyFlowLink";
import type { ExtraBlock } from "@/data/seoExtras.es";

// Renders [texto](/es/ruta) as internal links; everything else stays plain text.
export function EsRich({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link prefetch={false} key={i++} href={m[2]} className="text-[var(--neon-cyan)] hover:underline">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function stripMarkup(text: string) {
  return text.replace(/\[([^\]]+)\]\(\/[^)\s]+\)/g, "$1");
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`mt-3 space-y-2 pl-5 text-sm leading-relaxed text-[var(--text-secondary)] ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((item) => (
        <li key={item}><EsRich text={item} /></li>
      ))}
    </Tag>
  );
}

export default function EsExtraBlocks({ blocks }: { blocks: ExtraBlock[] }) {
  return (
    <>
      {blocks.map((b) => (
        <section id={b.id} key={b.id} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-24">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              {b.heading}
            </h2>
            {b.intro && <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]"><EsRich text={b.intro} /></p>}
            {b.groups?.map((g) => (
              <div key={g.title} className="mt-5">
                <h3 className="text-base font-semibold text-[var(--neon-pink)]">{g.title}</h3>
                <List items={g.items} />
              </div>
            ))}
            {b.items && <List items={b.items} ordered={b.ordered} />}
            {b.outro && <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]"><EsRich text={b.outro} /></p>}
          </div>
        </section>
      ))}
    </>
  );
}
