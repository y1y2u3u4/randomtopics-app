// Classroom pack catalog shared by pages, client components and the server.
// Counts are checked against src/data/classroomPacks.json by the regression test;
// the question text itself stays server-side (downloads and presenter API).

export type ClassroomPackId = "question-of-the-day" | "debate" | "speech";
export type ClassroomPurchase = ClassroomPackId | "all";

export const CLASSROOM_PACKS: {
  id: ClassroomPackId;
  title: string;
  short: string;
  count: number;
  countLabel: string;
  description: string;
  includes: string[];
  page: string;
}[] = [
  {
    id: "question-of-the-day",
    title: "Question of the Day — 180 Days for the School Year",
    short: "Question of the Day · 180 days",
    count: 180,
    countLabel: "180 daily questions",
    description: "A bell-ringer for every school day: 36 weeks of themed questions (Community Monday to Fun Friday), each with a follow-up.",
    includes: ["One question per slide, grouped by week", "Follow-up question on every slide", "Weekly printable sheets + teacher guide"],
    page: "/question-of-the-day",
  },
  {
    id: "debate",
    title: "Debate Topics Classroom Pack",
    short: "Debate Topics · 60 motions",
    count: 60,
    countLabel: "60 debate motions",
    description: "60 classroom-safe motions in three levels (grades 6–8, 9–12, 11–12 and debate club), each with a starting point for both sides.",
    includes: ["Motion + For/Against prompts on every slide", "20-minute classroom debate format", "Printable motion cards + teacher guide"],
    page: "/debate",
  },
  {
    id: "speech",
    title: "Speech & Impromptu Topics Pack",
    short: "Speech & Impromptu · 102 topics",
    count: 102,
    countLabel: "102 impromptu topics",
    description: "102 impromptu speech topics from warm-ups to arguments, each with a think-and-speak timing rule.",
    includes: ["Timing rule on every slide (think / speak)", "Green–yellow–red timing cards", "Printable topic cards + teacher guide"],
    page: "/impromptu-speech-topics",
  },
];

export const CLASSROOM_PRICES = { single: { cents: 499, label: "$4.99" }, all: { cents: 999, label: "$9.99" } } as const;

export function classroomPurchase(value: unknown): ClassroomPurchase | null {
  return value === "all" || CLASSROOM_PACKS.some((p) => p.id === value) ? (value as ClassroomPurchase) : null;
}

export function classroomPackId(value: unknown): ClassroomPackId | null {
  return CLASSROOM_PACKS.some((p) => p.id === value) ? (value as ClassroomPackId) : null;
}

export function classroomPrice(purchase: ClassroomPurchase) {
  return purchase === "all" ? CLASSROOM_PRICES.all : CLASSROOM_PRICES.single;
}

/** "all" includes every current and future pack. */
export function ownedPacks(purchases: readonly string[]): ClassroomPackId[] {
  if (purchases.includes("all")) return CLASSROOM_PACKS.map((p) => p.id);
  return CLASSROOM_PACKS.map((p) => p.id).filter((id) => purchases.includes(id));
}

/** Real exported slides/pages shown before purchase (public/classroom/previews). */
export function classroomPreviews(id: ClassroomPackId) {
  return [
    { src: `/classroom/previews/${id}-slide-a.png`, alt: "Projector slide from the editable PPTX", kind: "Slide" },
    { src: `/classroom/previews/${id}-slide-b.png`, alt: "Another projector slide from the PPTX", kind: "Slide" },
    { src: `/classroom/previews/${id}-pdf-page.png`, alt: "Printable PDF page", kind: "PDF" },
  ];
}
