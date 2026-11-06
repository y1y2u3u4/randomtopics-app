import NextLink from "@/components/NextLink";
import { nextList } from "@/data/nextList";

// "Next list →" at the end of a long list page: one big link to the neighbouring list.
// Static HTML, fixed height (no layout shift); counted as keep_playing_click / next_list.
export default function NextListLink({ path }: { path: string }) {
  const next = nextList(path);
  if (!next) return null;
  const es = path.startsWith("/es/");
  return (
    <nav aria-label={es ? "Siguiente lista" : "Next list"} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 print:hidden">
      <NextLink event="keep_playing_click" from={path} href={next.href} slot="next_list"
        className="glass-card flex min-h-16 items-center justify-between gap-3 p-4 hover:border-[var(--neon-cyan)]/40 transition-all group">
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{es ? "Siguiente lista" : "Next list"}</span>
          <span className="block truncate text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)]">{next.label}</span>
        </span>
        <span aria-hidden="true" className="text-xl text-[var(--neon-cyan)]">→</span>
      </NextLink>
    </nav>
  );
}
