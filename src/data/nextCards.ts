// "Next" recommendations driven by scene, not rotation (2026-10-28).
// Umami (Oct 27-28): switch-category chips that stay in the same scene ("This or That" ->
// couples / kids / work) were clicked ~10x more than the generic row, and every
// click that arrived on the target page went on to use it. So cards now stay in
// the visitor's scene (party -> party, classroom -> classroom, couples -> couples),
// and a result-level "next step" points at the next game and its full list.
import { RELATED_TOOLS } from "@/data/relatedTools";

export type NextTool = { href: string; label: string; emoji: string };
export type Scene = "couples" | "classroom" | "work" | "party";

const BY_HREF = new Map(RELATED_TOOLS.map((t) => [t.href, t]));
/** Tool entry for a href; label/emoji fall back to the RELATED_TOOLS entry. */
function t(href: string, label?: string, emoji?: string): NextTool {
  const known = BY_HREF.get(href);
  return { href, label: label ?? known?.label ?? href, emoji: emoji ?? known?.emoji ?? "🎲" };
}

// members: pages that belong to the scene (exclusive). picks: what they recommend, in order.
export const SCENES: { scene: Scene; members: string[]; picks: NextTool[] }[] = [
  {
    scene: "couples",
    members: [
      "/couples-daily-question", "/this-or-that/couples", "/21-questions", "/deep-conversation-question-generator",
      "/topics/first-date-conversation-topics", "/topics/conversation-starters-for-couples", "/topics/couples-game-night-questions",
    ],
    picks: [
      t("/couples-daily-question", "Couples Daily Question", "💞"), t("/this-or-that/couples", "This or That for couples", "💞"),
      t("/21-questions"), t("/deep-conversation-question-generator"), t("/topics/first-date-conversation-topics", "First date topics", "☕"),
      t("/topics/couples-game-night-questions", "Couples game night", "🎲"), t("/would-you-rather"),
    ],
  },
  {
    scene: "classroom",
    members: [
      "/question-of-the-day-for-students", "/this-or-that/kids", "/would-you-rather/kids", "/charades/kids", "/riddles-for-kids",
      "/morning-meeting-questions", "/random-name-picker", "/random-group-generator", "/classroom-timer",
      "/topics/get-to-know-you-questions-for-students", "/topics/ethical-dilemmas-for-students",
    ],
    picks: [
      t("/question-of-the-day-for-students"), t("/this-or-that/kids", "This or That for kids", "🧒"), t("/would-you-rather/kids", "Would You Rather for kids", "🧒"),
      t("/charades/kids"), t("/riddles-for-kids"), t("/morning-meeting-questions"), t("/random-name-picker"), t("/random-group-generator"),
      t("/topics/get-to-know-you-questions-for-students", "Get-to-know-you questions", "🤝"),
    ],
  },
  {
    scene: "work",
    members: ["/question-of-the-day-for-work", "/this-or-that/work", "/topics/team-building-questions", "/topics/workplace-ethical-dilemmas"],
    picks: [
      t("/question-of-the-day-for-work"), t("/this-or-that/work", "This or That for work", "💼"),
      t("/topics/team-building-questions", "Team building questions", "🤝"), t("/icebreaker"), t("/two-truths-and-a-lie"),
      t("/random-team-generator"), t("/spin-the-wheel"),
    ],
  },
  {
    scene: "party",
    members: [
      "/truth-or-dare", "/never-have-i-ever", "/most-likely-to", "/would-you-rather", "/this-or-that", "/charades", "/pictionary-word-generator",
      "/pictionary-words", "/pictionary-phrase-generator", "/two-truths-and-a-lie", "/hot-seat-questions", "/paranoia-questions", "/put-a-finger-down",
      "/yo-mama-randomizer", "/magic-8-ball", "/topics/truth-or-dare-questions", "/topics/never-have-i-ever-questions", "/topics/most-likely-to-questions",
      "/topics/would-you-rather-questions", "/topics/this-or-that-questions",
    ],
    picks: [
      t("/truth-or-dare"), t("/never-have-i-ever"), t("/most-likely-to"), t("/would-you-rather"), t("/this-or-that"), t("/charades"),
      t("/two-truths-and-a-lie"), t("/pictionary-word-generator"), t("/hot-seat-questions"), t("/paranoia-questions"), t("/put-a-finger-down"),
    ],
  },
];

export function sceneOf(path: string): Scene | undefined {
  return SCENES.find((s) => s.members.includes(path))?.scene;
}

/** Same-scene picks for a page (null when the page is not in a scene), skipping itself. */
export function sceneNext(path: string, count = 3): NextTool[] | null {
  const hit = SCENES.find((s) => s.members.includes(path));
  if (!hit) return null;
  const others = hit.picks.filter((p) => p.href !== path);
  // Start after the page's own position among the picks so neighbours differ.
  const at = hit.picks.findIndex((p) => p.href === path);
  const ordered = at >= 0 ? [...hit.picks.slice(at + 1), ...hit.picks.slice(0, at)] : others;
  return ordered.filter((p) => p.href !== path).slice(0, count);
}

// "Next step" row under the result: the next game in the same scene, and after a few
// generations the full list/collection of this page's own type.
export type NextStep = { next: NextTool; collection: NextTool };
export const NEXT_STEPS: Record<string, NextStep> = {
  "/charades": { next: t("/this-or-that", "Play This or That next", "⚖️"), collection: t("/charades/kids", "Easy charades for kids", "🧸") },
  "/charades/kids": { next: t("/riddles-for-kids", "Try riddles for kids next", "🧩"), collection: t("/charades", "All 500+ charades words", "🎭") },
  "/charades/christmas": { next: t("/trivia-questions/christmas", "Christmas trivia next", "🎄"), collection: t("/charades", "All 500+ charades words", "🎭") },
  "/pictionary-word-generator": { next: t("/charades", "Act it out: Charades", "🎭"), collection: t("/pictionary-words", "240 Pictionary words to print", "🖍️") },
  "/this-or-that": { next: t("/would-you-rather", "Play Would You Rather next", "🤔"), collection: t("/topics/this-or-that-questions", "Full This or That question list", "📋") },
  "/would-you-rather": { next: t("/this-or-that", "Play This or That next", "⚖️"), collection: t("/topics/would-you-rather-questions", "Full Would You Rather list", "📋") },
  "/truth-or-dare": { next: t("/never-have-i-ever", "Play Never Have I Ever next", "🙊"), collection: t("/topics/truth-or-dare-questions", "Full Truth or Dare list", "📋") },
  "/never-have-i-ever": { next: t("/truth-or-dare", "Play Truth or Dare next", "🎲"), collection: t("/topics/never-have-i-ever-questions", "Full Never Have I Ever list", "📋") },
  "/most-likely-to": { next: t("/never-have-i-ever", "Play Never Have I Ever next", "🙊"), collection: t("/topics/most-likely-to-questions", "Full Most Likely To list", "📋") },
  "/two-truths-and-a-lie": { next: t("/hot-seat-questions", "Hot Seat questions next", "🔥"), collection: t("/topics/two-truths-and-a-lie-ideas", "Two Truths ideas list", "📋") },
  "/hot-seat-questions": { next: t("/truth-or-dare", "Play Truth or Dare next", "🎲"), collection: t("/question-generator", "500+ questions for any group", "🎯") },
  "/conversation": { next: t("/deep-conversation-question-generator", "Go deeper: deep questions", "🌊"), collection: t("/topics/funny-conversation-topics", "Funny conversation topics list", "📋") },
  "/question-of-the-day": { next: t("/would-you-rather", "Play Would You Rather next", "🤔"), collection: t("/topic-of-the-day", "Today's discussion topic", "📅") },
  "/question-of-the-day-for-students": { next: t("/this-or-that/kids", "This or That for kids next", "🧒"), collection: t("/topics/get-to-know-you-questions-for-students", "Get-to-know-you question list", "📋") },
  "/question-of-the-day-for-work": { next: t("/icebreaker", "Icebreaker questions next", "🧊"), collection: t("/topics/team-building-questions", "Team building question list", "📋") },
  "/couples-daily-question": { next: t("/this-or-that/couples", "This or That for couples next", "💞"), collection: t("/topics/first-date-conversation-topics", "First date topics list", "📋") },
  "/icebreaker": { next: t("/two-truths-and-a-lie", "Two Truths and a Lie next", "🕵️"), collection: t("/topics/team-building-questions", "Team building question list", "📋") },
  "/spin-the-wheel": { next: t("/decision-maker", "Let it decide: Decision Maker", "🧭"), collection: t("/question-generator", "500+ questions to spin on", "🎯") },
  "/debate": { next: t("/group-discussion-topics", "Group discussion topics next", "🧑‍🤝‍🧑"), collection: t("/debate/motions", "Debate motions list", "📜") },
  "/speech": { next: t("/impromptu-speech-topics", "Practice impromptu topics next", "⏱️"), collection: t("/5-minute-speech-topics", "5-minute speech topics", "🕔") },
  "/writing": { next: t("/story-prompt-generator", "Story prompts next", "📖"), collection: t("/journal-prompts", "Journal prompts to keep going", "📓") },
  "/random-idea-generator": { next: t("/random-character-generator", "Make a character next", "🎭"), collection: t("/writing", "500+ writing prompts", "✍️") },
  "/magic-8-ball": { next: t("/decision-maker", "Let it decide: Decision Maker", "🧭"), collection: t("/yes-or-no-wheel", "Spin the yes or no wheel", "🎡") },
  "/random-pokemon-generator": { next: t("/random-team-generator", "Split into teams next", "👥"), collection: t("/random-nba-player-generator", "Random NBA players next", "🏀") },
  "/trivia-questions": { next: t("/charades", "Charades next", "🎭"), collection: t("/trivia-questions/halloween", "Halloween trivia", "🎃") },
};

// "Switch category" families added 2026-10-28 for pages that had no switch row.
export const EXTRA_CATEGORY_FAMILIES: NextTool[][] = [
  [t("/topics/team-building-questions", "Team building", "🤝"), t("/topics/workplace-ethical-dilemmas", "Workplace ethics", "⚖️"), t("/question-of-the-day-for-work", "Daily for work", "💼"), t("/this-or-that/work", "This or That at work", "💼")],
  [t("/topics/couples-game-night-questions", "Game night", "🎲"), t("/topics/conversation-starters-for-couples", "Conversation starters", "💬"), t("/couples-daily-question", "Daily question", "💞"), t("/this-or-that/couples", "This or That", "⚖️")],
  [t("/topics/get-to-know-you-questions-for-students", "Get to know you", "🤝"), t("/question-of-the-day-for-students", "Daily for students", "🎒"), t("/this-or-that/kids", "This or That", "🧒"), t("/would-you-rather/kids", "Would You Rather", "🤔"), t("/charades/kids", "Charades", "🧸")],
  [t("/topics/ethical-dilemma-questions", "Ethical dilemmas", "⚖️"), t("/topics/ethical-dilemmas-for-adults", "For adults", "🧑"), t("/topics/ethical-dilemmas-for-students", "For students", "🎒"), t("/moral-dilemma-examples", "Famous dilemmas", "📚"), t("/philosophical-questions", "Philosophical", "🤔")],
  [t("/writing", "Writing prompts", "✍️"), t("/writing-topic-generator", "Writing topics", "🖋️"), t("/story-prompt-generator", "Story prompts", "📖"), t("/journal-prompts", "Journal prompts", "📓"), t("/essay-topic-generator", "Essay topics", "📝")],
  [t("/icebreaker", "Icebreakers", "🧊"), t("/two-truths-and-a-lie", "Two Truths", "🕵️"), t("/hot-seat-questions", "Hot Seat", "🔥"), t("/morning-meeting-questions", "Morning meeting", "🌅"), t("/question-of-the-day-for-work", "For work", "💼")],
  [t("/funny", "Funny topics", "🤪"), t("/funny-question-of-the-day", "Funny daily", "😄"), t("/topics/funny-conversation-topics", "Funny conversation", "😂"), t("/yo-mama-randomizer", "Yo Mama", "😂"), t("/debate/funny", "Funny debates", "🎤")],
];

// Coin and wheel phrasing pages (2026-10-28).
NEXT_STEPS["/toss-a-coin"] = { next: t("/dice-roller", "Roll a dice next", "🎲"), collection: t("/flip-a-coin", "Flip up to 10 coins at once", "🪙") };
NEXT_STEPS["/heads-or-tails"] = { next: t("/yes-or-no-wheel", "Spin the yes or no wheel", "✅"), collection: t("/decision-maker", "Choose between 3 or more options", "🧭") };
NEXT_STEPS["/picker-wheel"] = { next: t("/decision-maker", "Let it decide: Decision Maker", "🧭"), collection: t("/random-name-picker", "Draw several names at once", "🎩") };

// ---------------------------------------------------------------- other languages
export type LocaleCode = "es" | "pt" | "fr" | "tr";

export function localeOfPath(path: string): LocaleCode | null {
  const seg = path.split("/")[1];
  return seg === "es" || seg === "pt" || seg === "fr" || seg === "tr" ? seg : null;
}

// Spanish pages by scene (all real routes under /es); same-language picks only.
const ES = {
  party: [
    { href: "/es/truth-or-dare", label: "Verdad o reto", emoji: "🎲" },
    { href: "/es/never-have-i-ever", label: "Yo nunca", emoji: "🙊" },
    { href: "/es/most-likely-to", label: "Quién es más probable", emoji: "👉" },
    { href: "/es/would-you-rather", label: "¿Qué prefieres?", emoji: "🤔" },
    { href: "/es/this-or-that", label: "Esto o aquello", emoji: "⚖️" },
    { href: "/es/charades", label: "Mímica", emoji: "🎭" },
    { href: "/es/two-truths-and-a-lie", label: "Dos verdades y una mentira", emoji: "🕵️" },
    { href: "/es/hot-seat-questions", label: "Silla caliente", emoji: "🔥" },
    { href: "/es/spin-the-wheel", label: "Ruleta de temas", emoji: "🎡" },
  ],
  talk: [
    { href: "/es/conversation", label: "Temas de conversación", emoji: "💬" },
    { href: "/es/preguntas-profundas", label: "Preguntas profundas", emoji: "🌊" },
    { href: "/es/preguntas-filosoficas", label: "Preguntas filosóficas", emoji: "🧠" },
    { href: "/es/dilemas-morales", label: "Dilemas morales", emoji: "⚖️" },
    { href: "/es/icebreaker", label: "Rompehielos", emoji: "🧊" },
    { href: "/es/question-of-the-day", label: "Pregunta del día", emoji: "☀️" },
    { href: "/es/pregunta-diaria-pareja", label: "Pregunta diaria en pareja", emoji: "💞" },
    { href: "/es/question-generator", label: "Generador de preguntas", emoji: "🎯" },
  ],
  learn: [
    { href: "/es/generador-de-temas-para-estudiar", label: "Temas para estudiar", emoji: "📚" },
    { href: "/es/generador-de-temas-para-exponer", label: "Temas para exponer", emoji: "🎤" },
    { href: "/es/generador-de-temas-para-investigar", label: "Temas para investigar", emoji: "🔬" },
    { href: "/es/temas-para-ensayos", label: "Temas para ensayos", emoji: "📝" },
    { href: "/es/speech", label: "Temas de discurso", emoji: "🎙️" },
    { href: "/es/debate", label: "Temas de debate", emoji: "⚔️" },
    { href: "/es/impromptu-speech-topics", label: "Discursos improvisados", emoji: "⏱️" },
    { href: "/es/generador-de-palabras-aleatorias", label: "Palabras aleatorias", emoji: "🔠" },
  ],
  fun: [
    { href: "/es/adivinanzas-para-ninos", label: "Adivinanzas para niños", emoji: "🧩" },
    { href: "/es/preguntas-de-cultura-general", label: "Cultura general", emoji: "❓" },
    { href: "/es/ideas-para-dibujar", label: "Ideas para dibujar", emoji: "✏️" },
    { href: "/es/datos-curiosos", label: "Datos curiosos", emoji: "🔎" },
    { href: "/es/funny", label: "Temas graciosos", emoji: "🤪" },
    { href: "/es/preguntas-de-paranoia", label: "Preguntas de paranoia", emoji: "🤫" },
    { href: "/es/generador-de-animales-aleatorios", label: "Animales aleatorios", emoji: "🦊" },
    { href: "/es/preguntas-para-diario", label: "Preguntas para diario", emoji: "📓" },
  ],
} satisfies Record<string, NextTool[]>;
export const ES_SCENES = ES;
export const ES_CORE: NextTool[] = [ES.party[8], ES.party[2], ES.talk[0], ES.learn[7]];

function esSceneKey(path: string): keyof typeof ES | null {
  for (const key of Object.keys(ES) as (keyof typeof ES)[]) if (ES[key].some((x) => x.href === path)) return key;
  const slug = path.startsWith("/es/topics/") ? path.slice("/es/topics/".length) : "";
  if (!slug) return null;
  if (/most-likely|truth-or-dare|never-have|would-you-rather|this-or-that|party|game|charades/.test(slug)) return "party";
  if (/speech|speaking|debate|essay|research|student|school|study|presentation|toastmasters|table-topics/.test(slug)) return "learn";
  if (/funny|riddle|trivia|drawing|animal/.test(slug)) return "fun";
  return "talk";
}

/** Same-language, same-scene picks for an /es page (config pages, generators and topics). */
export function esNext(path: string, count = 4): NextTool[] {
  const key = esSceneKey(path);
  const own = key ? ES[key] : [];
  const at = own.findIndex((x) => x.href === path);
  const ordered = at >= 0 ? [...own.slice(at + 1), ...own.slice(0, at)] : own;
  const out: NextTool[] = [];
  for (const x of [...ordered, ...ES_CORE]) if (x.href !== path && !out.some((o) => o.href === x.href) && out.length < count) out.push(x);
  return out;
}

/** Coarse scene of a locale page, judged by the English page it translates. */
export function localeSceneOf(enPath: string): "party" | "talk" | "learn" | "fun" {
  if (/would-you-rather|this-or-that|most-likely|charades|paranoia|spin-the-wheel|truth|never-have|two-truths|pictionary/.test(enPath)) return "party";
  if (/speech|impromptu|toastmasters|essay|research|subject|student|debate|journal|learning|presentation/.test(enPath)) return "learn";
  if (/riddle|trivia|drawing|food|animal|word|facts|name|character|writing|funny$/.test(enPath)) return "fun";
  return "talk";
}
