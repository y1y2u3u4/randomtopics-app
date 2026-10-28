import { WYR_CATEGORIES, splitWyr, wyrText } from "./wyrBank";
import { TOD_CATEGORIES } from "./todBank";

type Section = { heading: string; items: string[]; description?: string };
type Article = {
  slug: string; title: string; metaTitle: string; metaDescription: string; heroTitle: string; heroSubtitle: string;
  intro: string; lastModified: string; sections: Section[]; faq: { question: string; answer: string }[];
  relatedLinks: { label: string; href: string }[];
};

export interface WyrEntry { text: string; a: string; b: string }
export interface WyrBankView {
  kind: "wyr";
  cats: { id: string; label: string; heading: string; description: string; entries: WyrEntry[] }[];
  /** The original 80 questions, kept as plain lists under their original headings. */
  legacy: Section[];
  total: number;
}
export interface TodBankView {
  kind: "tod";
  cats: { id: string; label: string; heading: string; description: string; truths: string[]; dares: string[] }[];
  total: number;
}
export type BankView = WyrBankView | TodBankView;

const BANKS = new Map<string, BankView>();
export function getQuestionBank(slug: string): BankView | undefined { return BANKS.get(slug); }

// Original truth-or-dare sections folded into the new categories (kind: which list they join).
const TOD_LEGACY: Record<string, { cat: string; kind: "truths" | "dares" }> = {
  "Truth Questions for Friends": { cat: "friends", kind: "truths" },
  "Funny Truth Questions": { cat: "funny", kind: "truths" },
  "Truth Questions for Couples": { cat: "couples", kind: "truths" },
  "Good Dares for Friends": { cat: "friends", kind: "dares" },
  "Clean Dares for Kids & Family": { cat: "kids", kind: "dares" },
  "Truth or Dare Over Text": { cat: "text", kind: "dares" },
};

function applyWyr(a: Article) {
  const legacy = a.sections;
  const cats = WYR_CATEGORIES.map((c) => ({
    id: c.id, label: c.label, heading: c.heading, description: c.description,
    entries: c.pairs.map((p) => { const [x, y] = splitWyr(p); return { text: wyrText(p), a: x, b: y }; }),
  }));
  const fresh = cats.reduce((n, c) => n + c.entries.length, 0);
  const legacyCount = legacy.reduce((n, s) => n + s.items.length, 0);
  const total = fresh + legacyCount;
  BANKS.set(a.slug, { kind: "wyr", cats, legacy, total });
  a.sections = [
    ...cats.map((c) => ({ heading: c.heading, description: c.description, items: c.entries.map((e) => e.text) })),
    ...legacy,
  ];
  a.title = `${total} Would You Rather Questions (Funny, Kids, Couples, Hard & More)`;
  a.metaTitle = `${total} Would You Rather Questions: Funny, Kids, Hard & More | RandomTopics`;
  a.heroTitle = a.title;
  a.metaDescription = `${total} would you rather questions in 8 categories: funny, for kids, hard, for couples, adults, teens, work and deep. Random picker, vote screen, printable list. Free.`;
  a.heroSubtitle = "Pick a category, tap a random question, and vote with your group. Every question is written for this page and clean enough for any room.";
  a.intro = a.intro.replace("collection of 80 questions", `collection of ${total} questions`);
  a.lastModified = "2026-10-28";
  a.faq = [
    ...a.faq,
    { question: "What are good would you rather questions for kids?", answer: `Keep them playful and concrete: animals, food, superpowers and treehouses. The "Would You Rather Questions for Kids" section has ${cats.find((c) => c.id === "kids")!.entries.length} school-safe questions with nothing scary in them.` },
    { question: "What are funny would you rather questions?", answer: "The funniest ones set two silly images against each other, like a pet dragon the size of a cat or a cat the size of a dragon. Start with the Funny section and ask the group to explain the choice." },
    { question: "What are hard would you rather questions?", answer: "Hard questions make both options cost you something, such as knowing when you will die or how. The Hard section is built so neither choice is obviously right." },
    { question: "What are good would you rather questions for couples?", answer: "Pick questions about shared plans, trips and small rituals rather than tests. The couples section stays clean and works for first dates and long relationships alike." },
    { question: "Are the vote results from other people?", answer: "No. The vote screen tallies the votes you and your group tap on this device and stores them in your own browser. It does not collect answers from other users or show invented percentages. Use Reset votes to clear it." },
    { question: "How many would you rather questions are on this page?", answer: `${total} would you rather questions: ${fresh} in the eight categories above plus the original ${legacyCount} classics further down. Use the random picker for an endless draw without repeats.` },
  ];
}

function applyTod(a: Article) {
  const cats = TOD_CATEGORIES.map((c) => ({
    id: c.id, label: c.label, heading: c.heading, description: c.description,
    truths: [...c.truths], dares: [...c.dares],
  }));
  for (const s of a.sections) {
    const m = TOD_LEGACY[s.heading];
    const cat = m && cats.find((c) => c.id === m.cat);
    if (cat) cat[m.kind].push(...s.items);
  }
  const total = cats.reduce((n, c) => n + c.truths.length + c.dares.length, 0);
  BANKS.set(a.slug, { kind: "tod", cats, total });
  a.sections = cats.map((c) => ({
    heading: c.heading,
    description: c.description,
    items: [...c.truths.map((t) => `Truth: ${t}`), ...c.dares.map((d) => `Dare: ${d}`)],
  }));
  a.title = `${total} Truth or Dare Questions: Clean, Funny, Kids, Teens & Couples`;
  a.metaTitle = `${total} Truth or Dare Questions: Clean, Funny, Kids & Teens | RandomTopics`;
  a.heroTitle = `${total} Truth or Dare Questions for Every Group`;
  a.metaDescription = `${total} truth or dare questions for kids, teens, friends, couples, funny rounds, over text and parties. Clean list, random picker and a party mode with players and turns. Free.`;
  a.intro = a.intro.replace("150 truth or dare questions", `${total} truth or dare questions`);
  a.lastModified = "2026-10-28";
  a.faq = a.faq.map((f) => (f.question === "How many truth or dare questions are on this list?"
    ? { ...f, answer: `This page has ${total} truths and dares across kids, teens, friends, couples, funny, over text and party. For unlimited fresh prompts, use the random picker or party mode, which avoids repeats until the list is used up.` }
    : f));
  a.faq = [
    ...a.faq,
    { question: "What are good truth or dare questions for kids?", answer: "Ask about favorite foods, animals and silly moments, and use dares like walking like a penguin or a robot dance. The kids section is school-safe: nothing scary, private or embarrassing." },
    { question: "What are good truth or dare questions for teens?", answer: "Teens usually like funny and slightly awkward but clean prompts about phones, school, music and friends. Let anyone pass a question and skip anything that feels too personal." },
    { question: "What are good truth or dare questions for couples?", answer: "Sweet and playful ones: first impressions, favorite memories, places to visit together, and dares like a slow dance or a short poem. The couples section stays clean." },
    { question: "What are funny truth or dare questions?", answer: "Pure silliness works best: a clown name, a worst superpower, a chicken dance or a slow-motion run. Use the Funny section when you want laughs without anyone feeling put on the spot." },
    { question: "How do you play truth or dare with friends over text?", answer: "Take turns in the group chat. The player chooses truth or dare, answers with text, a voice note or a photo, and anyone can pass. The Over Text section has prompts that work from a phone." },
    { question: "Can you skip a truth or dare?", answer: "Yes. Agree before you start that anyone can pass once or twice, or swap to the other option. Party mode on this page has a skip button that draws a new prompt without repeating." },
  ];
}

export function applyQuestionBanks(articles: Article[]): void {
  for (const a of articles) {
    if (a.slug === "would-you-rather-questions") applyWyr(a);
    else if (a.slug === "truth-or-dare-questions") applyTod(a);
  }
}
