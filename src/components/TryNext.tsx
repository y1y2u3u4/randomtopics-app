import RelatedToolLink from "@/components/RelatedToolLink";
import { keepPlaying } from "@/data/relatedTools";

// Compact row of related tools right under the result, so the next click is in
// view when a visitor finishes. Static server HTML (no layout shift); picks
// differ from the "Keep playing" cards at the bottom of the page.
export default function TryNext({ path }: { path: string }) {
  const all = keepPlaying(path, 6);
  const tools = all.length >= 6 ? all.slice(3) : all.slice(0, 3);
  if (!tools.length) return null;
  return (
    <nav aria-label="Try next" className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-2 print:hidden">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Try next</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <RelatedToolLink key={t.href} from={path} href={t.href} slot="try_next" className="mode-chip">
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </RelatedToolLink>
        ))}
      </div>
    </nav>
  );
}
