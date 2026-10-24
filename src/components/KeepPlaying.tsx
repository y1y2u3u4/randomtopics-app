import RelatedToolLink from "@/components/RelatedToolLink";
import { keepPlaying } from "@/data/relatedTools";

// Three related tools under a tool page; more pages per visit, no extra ads.
export default function KeepPlaying({ path }: { path: string }) {
  const tools = keepPlaying(path);
  if (!tools.length) return null;
  return (
    <section aria-labelledby="keep-playing" className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-2">
      <h2 id="keep-playing" className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Keep playing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((t) => (
          <RelatedToolLink key={t.href} from={path} href={t.href} slot="keep_playing" className="glass-card p-4 flex items-center gap-3 hover:border-[var(--neon-cyan)]/40 transition-all group">
            <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
            <span>
              <span className="block text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)]">{t.label} →</span>
              <span className="block text-xs text-[var(--text-muted)]">{t.blurb}</span>
            </span>
          </RelatedToolLink>
        ))}
      </div>
    </section>
  );
}
