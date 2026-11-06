import NextLink from "@/components/NextLink";
import { RELATED_TOOLS } from "@/data/relatedTools";

type Card = { href: string; label: string; emoji: string };
const TITLE = { en: "Play next", es: "Sigue jugando", pt: "Jogue a seguir", fr: "À jouer ensuite", tr: "Sıradaki oyun" } as const;
const BLURB = new Map(RELATED_TOOLS.map((t) => [t.href, t.blurb]));

// Three large "Play next" cards directly under a tool's result. Static server HTML
// (nothing moves after load); plain links, each logged as keep_playing_click with
// slot play_next_cards_N so clicks can be counted per page in Umami.
export default function PlayNextCards({ path, cards, locale = "en" }: { path: string; cards: Card[]; locale?: keyof typeof TITLE }) {
  const picks = cards.filter((c) => c.href !== path).slice(0, 3);
  if (!picks.length) return null;
  return (
    <section aria-label={TITLE[locale]} data-play-next="cards" className="mb-4 print:hidden">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{TITLE[locale]}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {picks.map((c, i) => (
          <NextLink key={c.href} event="keep_playing_click" from={path} href={c.href} slot={`play_next_cards_${i + 1}`}
            className="glass-card group flex min-h-[72px] items-center gap-3 p-4 transition-all hover:border-[var(--neon-cyan)]/40">
            <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
            <span className="min-w-0">
              <span className="block text-base font-bold leading-tight text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)]">{c.label} →</span>
              {locale === "en" && BLURB.get(c.href) ? <span className="mt-0.5 block text-xs text-[var(--text-muted)]">{BLURB.get(c.href)}</span> : null}
            </span>
          </NextLink>
        ))}
      </div>
    </section>
  );
}
