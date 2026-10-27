import RelatedToolLink from "@/components/RelatedToolLink";
import { keepPlaying, type RelatedTool } from "@/data/relatedTools";

type TryNextTool = Pick<RelatedTool, "href" | "label" | "emoji">;

// The homepage and topic pages are not in RELATED_TOOLS, so they pass their own
// picks: the most-visited tools for that audience (Umami 30 days to 2026-10-27).
export const HOME_TRY_NEXT: TryNextTool[] = [
  { href: "/question-of-the-day", label: "Question of the Day", emoji: "📅" },
  { href: "/conversation", label: "Conversation Starters", emoji: "💬" },
  { href: "/spin-the-wheel", label: "Spin the Wheel", emoji: "🎡" },
  { href: "/would-you-rather", label: "Would You Rather", emoji: "🤔" },
];
export const ES_TRY_NEXT: TryNextTool[] = [
  { href: "/es/spin-the-wheel", label: "Ruleta de temas", emoji: "🎡" },
  { href: "/es/most-likely-to", label: "Quién es más probable", emoji: "👉" },
  { href: "/es/conversation", label: "Temas de conversación", emoji: "💬" },
  { href: "/es/generador-de-palabras-aleatorias", label: "Palabras aleatorias", emoji: "🔠" },
];

// Compact row of related tools right under the result, so the next click is in
// view when a visitor finishes. Static server HTML (no layout shift); picks
// differ from the "Keep playing" cards at the bottom of the page.
export default function TryNext({ path, tools: fixed, locale = "en" }: { path: string; tools?: TryNextTool[]; locale?: "en" | "es" }) {
  const all = fixed ? [] : keepPlaying(path, 6);
  const tools = fixed ? fixed.filter((t) => t.href !== path) : all.length >= 6 ? all.slice(3) : all.slice(0, 3);
  if (!tools.length) return null;
  const title = locale === "es" ? "Prueba también" : "Try next";
  return (
    <nav aria-label="Try next" className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-2 print:hidden">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{title}</p>
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
