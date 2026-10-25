import type { SubProduct } from "./products";

export interface SubEntryConfig {
  product: SubProduct;
  href: string;
  text: string;
  cta: string;
  /** "generate": under the tool, after the first generation; "view": in place, below the article. */
  after: "generate" | "view";
  locale?: "en" | "es";
}

const teacher = (after: SubEntryConfig["after"], text = "Using these in class? Get a new warm-up every school day, by grade, ready for the projector."): SubEntryConfig =>
  ({ product: "teacher", href: "/teacher-warm-ups", text, cta: "See daily warm-ups", after });
const bot = (after: SubEntryConfig["after"], text = "Running team meetings? Post one icebreaker question a day to your Slack, Discord or Teams channel automatically.", href = "/slack-icebreaker-bot"): SubEntryConfig =>
  ({ product: "bot", href, text, cta: "Set up the daily bot", after });
const journal = (after: SubEntryConfig["after"], text = "Want to write every day? Get one prompt a day and keep your entries in a private journal with streaks."): SubEntryConfig =>
  ({ product: "journal", href: "/writing-journal", text, cta: "Try the writing journal", after });
const couples = (after: SubEntryConfig["after"]): SubEntryConfig =>
  ({ product: "couples", href: "/couples-daily-question", text: "Want one question a day for the two of you? You both answer, then the answers reveal together.", cta: "Try the couples daily question", after });
const pareja = (after: SubEntryConfig["after"]): SubEntryConfig =>
  ({ product: "couples", href: "/es/pregunta-diaria-pareja", text: "¿Queréis una pregunta al día para los dos? Cada uno responde y las respuestas se revelan a la vez.", cta: "Probar la pregunta diaria", after, locale: "es" });
const wheel = (text: string): SubEntryConfig =>
  ({ product: "wheel", href: "/spin-the-wheel#class-roster-wheel", text, cta: "Try the class roster wheel", after: "generate" });

/**
 * Extra paid entries added on 2026-10-25 to widen exposure (approved dispatch
 * 2026-10-25-randomtopics-widen-exposure). Rendered by shared page templates
 * via <SubEntryFor path>. One paid entry per page: never list a page that
 * already has a Host Pass, Classroom Pack or hard-coded SubEntry.
 */
export const SUB_ENTRY_PAGES: Record<string, SubEntryConfig> = {
  "/random-learning-topic-generator": teacher("generate"),
  "/research-topic-generator": teacher("generate", "Assigning research topics? Get a new class warm-up every school day, by grade, ready for the projector."),
  "/topics/toastmasters-table-topics": teacher("view", "Running speaking practice in class? Get a new warm-up every school day, by grade, ready for the projector."),
  "/topics/debate-topics-for-students": teacher("view"),
  "/topics/esl-conversation-topics": teacher("view", "Teaching ESL? Get a new speaking warm-up every school day, by grade, ready for the projector."),

  "/funny-question-of-the-day": bot("generate", "Want a funny question in your team chat every day? A bot posts one to Discord, Slack or Teams automatically.", "/discord-qotd-bot"),
  "/question-of-the-day-for-work": bot("generate"),
  "/topics/icebreaker-questions-for-work": bot("view"),
  "/topics/team-building-questions": bot("view"),
  "/topics/icebreaker-questions-for-virtual-meetings": bot("view"),

  "/essay-topic-generator": journal("generate"),
  "/writing-topic-generator": journal("generate"),
  "/journal-prompts": journal("generate", "Journaling daily? Get one prompt a day and keep every entry in a private journal with streaks."),
  "/story-prompt-generator": journal("generate"),
  "/random-word-generator": journal("generate", "Using random words to write? Get one writing prompt a day and keep your entries in a private journal."),

  "/topics/first-date-conversation-topics": couples("view"),
  "/es/topics/couples-game-night-questions": pareja("view"),
  "/es/topics/first-date-conversation-topics": pareja("view"),
  "/es/topics/quien-es-mas-probable-parejas": pareja("generate"),

  "/random-name-picker": wheel("Picking students? Save your class list once and the wheel never picks the same name twice until everyone has had a turn."),
  "/random-team-generator": wheel("Making teams every week? Save your class roster and split it into random groups in one click."),
  "/decision-maker": wheel("Need a fair picker for a class or group? Save a list and spin without repeats until everyone is picked."),
};
