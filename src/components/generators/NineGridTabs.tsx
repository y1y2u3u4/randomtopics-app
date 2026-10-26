import Link from "next/link";
import type { GridKind } from "@/lib/generators/nineGrid";

// One template per kind; the tabs move between the sibling pages.
export const NINE_GRID_PAGES: { kind: GridKind; href: string; label: string }[] = [
  { kind: "albums", href: "/my-9-albums", label: "💿 Albums" },
  { kind: "games", href: "/my-9-games", label: "🎮 Games" },
  { kind: "movies", href: "/my-9-movies", label: "🎬 Movies" },
  { kind: "anime", href: "/my-9-anime", label: "🌸 Anime" },
  { kind: "books", href: "/my-9-books", label: "📚 Books" },
  { kind: "any", href: "/my-9-grid", label: "🔳 Any pictures" },
];

export default function NineGridTabs({ current }: { current: GridKind }) {
  return (
    <nav aria-label="My 9 templates" className="max-w-5xl mx-auto px-4 sm:px-6 mb-4">
      <ul className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center">
        {NINE_GRID_PAGES.map((p) => (
          <li key={p.kind} className="shrink-0">
            {p.kind === current ? (
              <span aria-current="page" className="block text-sm px-3 py-1.5 rounded-lg border border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]">{p.label}</span>
            ) : (
              <Link prefetch={false} href={p.href} className="block text-sm px-3 py-1.5 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40">{p.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
