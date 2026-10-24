import "server-only";
import { QOTD_QUESTIONS } from "@/data/questionOfTheDay";
import { STUDENT_QOTD_QUESTIONS } from "@/data/premiumQotd";
import { STUDENT_ETHICAL_DILEMMAS } from "@/data/premiumEthics";
import { FUNNY_QOTD_QUESTIONS } from "@/data/premiumFunnyQotd";
import { KIDS_JOURNAL_PROMPTS, KIDS_THIS_OR_THAT, KIDS_WOULD_YOU_RATHER, STUDENT_GET_TO_KNOW_YOU } from "@/data/kidsQuestions";
import { WOULD_YOU_RATHER } from "@/data/partyQuestions";
import { topics } from "@/data/topics";
import { SEO_ARTICLES } from "@/data/seoContent";
import { scheduleIndex, schoolDay, weekday, WEEKDAY_KIND, type GradeBand, type WarmupKind } from "./teacherSchedule";

// Teacher warm-up pools by grade band and weekday, built from the site's
// existing question sets (QOTD, debate topics, ethical dilemmas).

export interface Warmup { day: string; kind: WarmupKind; label: string; prompt: string; task: string; followUp?: string }

const LABEL: Record<WarmupKind, string> = { qotd: "Question of the day", debate: "Quick debate", wyr: "Would you rather", ethics: "Ethical dilemma", fun: "Fun Friday" };
const TASK: Record<GradeBand, Record<WarmupKind, string>> = {
  k5: { qotd: "Think for 30 seconds, then share with a partner.", debate: "Pick one and give one reason.", wyr: "Choose one and tell a partner why.", ethics: "Draw or write two sentences.", fun: "Share your answer with the class." },
  g68: { qotd: "Write 2–3 sentences, then share with a partner.", debate: "Agree or disagree? Write your claim and one reason.", wyr: "Choose one and give two reasons.", ethics: "What should they do? Write your answer and one consequence.", fun: "Quick-write, then share one answer per table." },
  g912: { qotd: "Write a short paragraph, then pair-share.", debate: "Take a side: claim, evidence, and one counterargument.", wyr: "Choose one and defend it in 3 sentences.", ethics: "What is the right choice? Name the values in conflict.", fun: "Quick-write, then share one answer per group." },
};

const text = (items: readonly (string | { text?: string; prompt?: string; q?: string })[]) =>
  items.map((x) => (typeof x === "string" ? x : x.text ?? x.prompt ?? x.q ?? "")).map((s) => s.trim()).filter(Boolean);
const unique = (items: string[]) => [...new Set(items)];

let built: Record<GradeBand, Record<WarmupKind, string[]>> | null = null;
export function teacherPools() {
  if (built) return built;
  const qotd = (c: string) => text(QOTD_QUESTIONS.filter((q) => q.c === c));
  const student = (a: string) => text(STUDENT_QOTD_QUESTIONS.filter((q) => q.audience === a));
  const gtky = (g: string) => text(STUDENT_GET_TO_KNOW_YOU.filter((q) => q.grades.includes(g as never)));
  const debate = (depths: string[]) => topics.filter((t) => t.modes.includes("debate") && depths.includes(t.depth)).map((t) => t.text);
  const ethicsArticle = SEO_ARTICLES.find((a) => a.slug === "ethical-dilemma-questions")?.sections
    .filter((s) => !/workplace|medical/i.test(s.heading)).flatMap((s) => s.items ?? []) ?? [];
  const dilemmas = (a: string) => text(STUDENT_ETHICAL_DILEMMAS.filter((d) => d.audience === a));
  built = {
    k5: {
      qotd: unique([...student("Elementary"), ...gtky("k5")]),
      debate: unique(text(KIDS_THIS_OR_THAT)),
      wyr: unique(text(KIDS_WOULD_YOU_RATHER)),
      ethics: unique([...text(KIDS_JOURNAL_PROMPTS), ...qotd("kids")]),
      fun: unique(text(FUNNY_QOTD_QUESTIONS)),
    },
    g68: {
      qotd: unique([...student("Middle School"), ...gtky("g68")]),
      debate: unique(debate(["light", "medium"])),
      wyr: unique(text(KIDS_WOULD_YOU_RATHER)),
      ethics: unique([...dilemmas("Middle School"), ...text(ethicsArticle)]),
      fun: unique(text(FUNNY_QOTD_QUESTIONS)),
    },
    g912: {
      qotd: unique([...student("High School"), ...gtky("g912"), ...qotd("classroom")]),
      debate: unique(debate(["medium", "deep"])),
      wyr: unique([...WOULD_YOU_RATHER, ...qotd("deep")]),
      ethics: unique([...dilemmas("High School"), ...text(ethicsArticle)]),
      fun: unique([...text(FUNNY_QOTD_QUESTIONS), ...qotd("funny")]),
    },
  };
  return built;
}

/** The warm-up for a date (weekends show the next Monday). */
export function warmupFor(date: string, grade: GradeBand): Warmup {
  const day = schoolDay(date);
  const kind = WEEKDAY_KIND[weekday(day)];
  const pool = teacherPools()[grade][kind];
  return { day, kind, label: LABEL[kind], prompt: pool[scheduleIndex(day, grade, pool.length)], task: TASK[grade][kind] };
}
