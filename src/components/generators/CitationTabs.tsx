import Link from "next/link";

export const CITATION_PAGES = [
  { id: "asa", href: "/asa-citation-generator", label: "ASA" },
  { id: "acs", href: "/acs-citation-generator", label: "ACS" },
  { id: "chicago", href: "/chicago-citation-generator", label: "Chicago" },
] as const;

export default function CitationTabs({ current }: { current: (typeof CITATION_PAGES)[number]["id"] }) {
  return (
    <nav aria-label="Citation generators" className="max-w-5xl mx-auto px-4 sm:px-6 mb-4">
      <ul className="flex gap-2 justify-center flex-wrap">
        {CITATION_PAGES.map((p) => (
          <li key={p.id}>
            {p.id === current ? (
              <span aria-current="page" className="block text-sm px-3 py-1.5 rounded-lg border border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]">{p.label} citation</span>
            ) : (
              <Link href={p.href} className="block text-sm px-3 py-1.5 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40">{p.label} citation</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
