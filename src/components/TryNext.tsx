import RelatedToolLink from "@/components/RelatedToolLink";
import NextLink from "@/components/NextLink";
import NextStepRow from "@/components/NextStepRow";
import { keepPlaying, type RelatedTool } from "@/data/relatedTools";
import { EXTRA_CATEGORY_FAMILIES, esNext, localeOfPath, sceneNext } from "@/data/nextCards";

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

// Topic articles by scene (party, classroom, couples, work, writing, speaking).
const SCENES: { match: RegExp; tools: TryNextTool[] }[] = [
  { match: /couple|partner|date|relationship/, tools: [
    { href: "/couples-daily-question", label: "Couples Daily Question", emoji: "💞" },
    { href: "/would-you-rather", label: "Would You Rather", emoji: "🤔" },
    { href: "/this-or-that", label: "This or That", emoji: "⚖️" },
  ] },
  { match: /student|kids|teen|school|esl|classroom/, tools: [
    { href: "/question-of-the-day-for-students", label: "Question of the Day for Students", emoji: "🎒" },
    { href: "/this-or-that", label: "This or That", emoji: "⚖️" },
    { href: "/charades", label: "Charades Generator", emoji: "🎭" },
  ] },
  { match: /work|team|meeting|virtual/, tools: [
    { href: "/question-of-the-day-for-work", label: "Question of the Day for Work", emoji: "💼" },
    { href: "/icebreaker", label: "Icebreaker Questions", emoji: "🧊" },
    { href: "/spin-the-wheel", label: "Spin the Wheel", emoji: "🎡" },
  ] },
  { match: /writing|essay|book/, tools: [
    { href: "/writing", label: "Writing Prompt Generator", emoji: "✍️" },
    { href: "/story-prompt-generator", label: "Story Prompt Generator", emoji: "📖" },
    { href: "/journal-prompts", label: "Journal Prompts", emoji: "📓" },
  ] },
  { match: /debate|speech|speaking|toastmasters|table-topics|presentation|ethical|philosoph|controversial|science/, tools: [
    { href: "/debate", label: "Debate Topic Generator", emoji: "⚔️" },
    { href: "/impromptu-speech-topics", label: "Impromptu Speech Topics", emoji: "⏱️" },
    { href: "/spin-the-wheel", label: "Spin the Wheel", emoji: "🎡" },
  ] },
  { match: /./, tools: [
    { href: "/question-of-the-day", label: "Question of the Day", emoji: "☀️" },
    { href: "/would-you-rather", label: "Would You Rather", emoji: "🤔" },
    { href: "/charades", label: "Charades Generator", emoji: "🎭" },
  ] },
];

export function topicTryNext(slug: string): TryNextTool[] {
  return sceneNext(`/topics/${slug}`) ?? SCENES.find((s) => s.match.test(slug))!.tools;
}

// "Switch category": the same tool for another audience or theme, each on its
// own real URL so the switch is a page view and a crawlable link (not a filter
// that only rewrites the query string).
const CATEGORY_FAMILIES: TryNextTool[][] = [
  [
    { href: "/question-of-the-day", label: "Daily", emoji: "☀️" },
    { href: "/funny-question-of-the-day", label: "Funny", emoji: "😄" },
    { href: "/question-of-the-day-for-students", label: "For students", emoji: "🎒" },
    { href: "/question-of-the-day-for-work", label: "For work", emoji: "💼" },
    { href: "/couples-daily-question", label: "For couples", emoji: "💞" },
  ],
  [
    { href: "/charades", label: "All charades", emoji: "🎭" },
    { href: "/charades/kids", label: "For kids", emoji: "🧸" },
    { href: "/charades/christmas", label: "Christmas", emoji: "🎅" },
    { href: "/pictionary-word-generator", label: "Pictionary", emoji: "✏️" },
  ],
  [
    { href: "/this-or-that", label: "This or That game", emoji: "⚖️" },
    { href: "/this-or-that/kids", label: "For kids", emoji: "🧒" },
    { href: "/this-or-that/couples", label: "For couples", emoji: "💞" },
    { href: "/this-or-that/work", label: "For work", emoji: "💼" },
    { href: "/this-or-that/hard", label: "Hard", emoji: "🧠" },
    { href: "/topics/this-or-that-questions", label: "Question list", emoji: "📋" },
    { href: "/would-you-rather", label: "Would You Rather", emoji: "🤔" },
  ],
  [
    { href: "/would-you-rather", label: "Would You Rather", emoji: "🤔" },
    { href: "/would-you-rather/kids", label: "For kids", emoji: "🧒" },
    { href: "/topics/would-you-rather-questions", label: "Question list", emoji: "📋" },
  ],
  [
    { href: "/trivia-questions", label: "All trivia", emoji: "❓" },
    { href: "/trivia-questions/halloween", label: "Halloween", emoji: "🎃" },
    { href: "/trivia-questions/christmas", label: "Christmas", emoji: "🎄" },
  ],
  [
    { href: "/debate", label: "All debate topics", emoji: "⚔️" },
    { href: "/debate/high-school", label: "High school", emoji: "🏫" },
    { href: "/debate/middle-school", label: "Middle school", emoji: "📘" },
    { href: "/debate/college", label: "College", emoji: "🎓" },
    { href: "/debate/funny", label: "Funny", emoji: "😂" },
    { href: "/debate/motions", label: "Motions", emoji: "📜" },
  ],
  [
    { href: "/speech", label: "Speech generator", emoji: "🎤" },
    { href: "/impromptu-speech-topics", label: "Impromptu", emoji: "⏱️" },
    { href: "/5-minute-speech-topics", label: "5-minute", emoji: "🕔" },
    { href: "/table-topics-generator", label: "Table Topics", emoji: "🗣️" },
    { href: "/speech/persuasive", label: "Persuasive", emoji: "📣" },
    { href: "/speech/informative", label: "Informative", emoji: "📊" },
  ],
  [
    { href: "/conversation", label: "All conversation", emoji: "💬" },
    { href: "/deep-conversation-question-generator", label: "Deep", emoji: "🌊" },
    { href: "/topics/funny-conversation-topics", label: "Funny", emoji: "😄" },
    { href: "/topics/conversation-topics-for-teens", label: "For teens", emoji: "🧑" },
    { href: "/topics/first-date-conversation-topics", label: "First date", emoji: "☕" },
  ],
  [
    { href: "/truth-or-dare", label: "Truth or Dare game", emoji: "🎲" },
    { href: "/topics/truth-or-dare-questions", label: "Question list", emoji: "📋" },
  ],
  [
    { href: "/never-have-i-ever", label: "Never Have I Ever game", emoji: "🙊" },
    { href: "/topics/never-have-i-ever-questions", label: "Question list", emoji: "📋" },
  ],
  [
    { href: "/most-likely-to", label: "Most Likely To game", emoji: "👉" },
    { href: "/topics/most-likely-to-questions", label: "Question list", emoji: "📋" },
  ],
];


export function categorySwitch(path: string): TryNextTool[] {
  const family = [...CATEGORY_FAMILIES, ...EXTRA_CATEGORY_FAMILIES].find((f) => f.some((t) => t.href === path));
  return family?.filter((t) => t.href !== path) ?? [];
}

// Compact row of related tools right under the result, so the next click is in
// view when a visitor finishes. Static server HTML (no layout shift); picks
// differ from the "Keep playing" cards at the bottom of the page.
const TRY_NEXT_TITLE = { en: "Try next", es: "Prueba también", pt: "Experimente também", fr: "À essayer ensuite", tr: "Sırada bunlar var" } as const;

type Locale = "en" | "es" | "pt" | "fr" | "tr";

/**
 * placement "end" (default) sits under the tool/result; "mid" is a compact copy placed
 * inside long articles, where the end-of-page row was never reached (topic pages: 0 clicks).
 */
export default function TryNext({ path, tools: fixed, locale: given, placement = "end" }: { path: string; tools?: TryNextTool[]; locale?: Locale; placement?: "end" | "mid" }) {
  const locale: Locale = given ?? localeOfPath(path) ?? "en";
  const all = fixed || locale !== "en" ? [] : keepPlaying(path, 6);
  // Same-scene picks first (party -> party, classroom -> classroom); pages outside
  // RELATED_TOOLS (topic lists, premium collections) fall back to scene picks, and
  // other languages only ever link to their own language.
  const scene = fixed || locale !== "en" ? null : sceneNext(path);
  const picked = fixed ?? scene ?? (locale === "es" ? esNext(path) : locale !== "en" ? [] : all.length ? null : topicTryNext(path));
  const tools = picked ? picked.filter((t) => t.href !== path) : all.length >= 6 ? all.slice(3) : all.slice(0, 3);
  const switches = locale === "en" ? categorySwitch(path) : [];
  if (!tools.length && !switches.length) return null;
  const title = TRY_NEXT_TITLE[locale];
  const mid = placement === "mid";
  // One link component per surface: legacy related_tool_click for the English end rows
  // (keeps the daily series continuous), next_* events everywhere new.
  const link = (t: TryNextTool, slot: "try_next" | "switch_category") =>
    locale !== "en" ? (
      <NextLink key={t.href} event="next_locale_click" from={path} href={t.href} slot={`${mid ? "mid_" : ""}${slot}`} className="mode-chip">
        <span aria-hidden="true">{t.emoji}</span> {t.label}
      </NextLink>
    ) : mid ? (
      <NextLink key={t.href} event="next_card_click" from={path} href={t.href} slot={slot === "try_next" ? "mid_try_next" : "mid_switch_category"} className="mode-chip">
        <span aria-hidden="true">{t.emoji}</span> {t.label}
      </NextLink>
    ) : (
      <RelatedToolLink key={t.href} from={path} href={t.href} slot={slot} className="mode-chip">
        <span aria-hidden="true">{t.emoji}</span> {t.label}
      </RelatedToolLink>
    );
  return (
    <nav aria-label={mid ? `${title} (in this article)` : title} className={`max-w-3xl mx-auto px-4 sm:px-6 ${mid ? "pt-2 pb-8" : "pt-4 pb-2"} print:hidden`}>
      {!mid && locale === "en" && <NextStepRow path={path} />}
      {switches.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Switch category</p>
          <div className="flex flex-wrap gap-2 mb-3">{switches.map((t) => link(t, "switch_category"))}</div>
        </>
      )}
      {tools.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{title}</p>
          <div className="flex flex-wrap gap-2">{tools.map((t) => link(t, "try_next"))}</div>
        </>
      )}
    </nav>
  );
}
