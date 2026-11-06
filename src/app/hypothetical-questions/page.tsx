import type { Metadata } from "next";
import DeckListPage from "@/components/DeckListPage";
import { HYPOTHETICAL_GROUPS, HYPOTHETICAL_ITEMS } from "@/data/decks/hypothetical";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const path = "/hypothetical-questions";
const N = HYPOTHETICAL_ITEMS.length;
const title = `${N} Hypothetical Questions: Funny, Hard & Deep (Random Generator)`;
const description = `${N} hypothetical questions to ask friends, family, kids or a date: funny, hard choices, superpowers, survival, money, deep and future-tech "what would you do if" scenarios. Tap a random question or read the full list. Free, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: title }, description,
  keywords: ["hypothetical questions", "hypothetical questions to ask", "funny hypothetical questions", "hard hypothetical questions", "what would you do if questions", "hypothetical scenarios", "hypothetical questions for kids", "random hypothetical question generator"],
  alternates: { canonical: path, languages: hreflangAlternates(path) },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  { question: "What is a hypothetical question?", answer: "A hypothetical question asks what you would do or think in an imagined situation, such as \"What would you do if you could fly for a day?\" There is no right answer and nothing has to be true, which makes these questions good for icebreakers, interviews and long car rides." },
  { question: "What are good hypothetical questions to ask friends?", answer: "Start with the Funny group to loosen up, then move to Hard choices and Friends & relationships. Ask one question, let everyone answer, and follow up with \"why?\" once. The best ones have no obvious answer, so people disagree." },
  { question: "What are funny hypothetical questions?", answer: "Funny hypotheticals put an absurd twist on a normal day, like a goose that follows you everywhere or a car that gives driving advice. The Funny group on this page has 18 of them, and the generator can draw from that group alone." },
  { question: "Are there hypothetical questions for kids and classrooms?", answer: "Yes. The Easy (kids & classrooms) group uses short, friendly scenarios such as finding a treasure map or being the teacher for a day. They work as morning-meeting questions and writing warm-ups." },
  { question: "What are hard hypothetical questions?", answer: "Hard hypotheticals force a trade-off between two things you value, like honesty versus kindness or a dream job versus being near family. The Hard choices group is built for debate and for getting to know someone beyond small talk." },
  { question: "How are hypothetical questions used in job interviews?", answer: "Interviewers ask them to see how you think, for example \"What would you do if two deadlines clashed?\" This page is for conversation and practice; for interview-style rehearsal pick a scenario, answer out loud in under two minutes, and explain your reasoning, not just your choice." },
];

export default function HypotheticalQuestionsPage() {
  return <DeckListPage
    path={path} name="Hypothetical Questions"
    tagline={"“What would you do if…” scenarios for friends, family, dates and classrooms. Tap for a random question, or scroll for the full list by category."}
    noun="Hypothetical question" toolType="hypothetical_question" storageKey="rt-hypothetical-v1" saveCategory="philosophy"
    printHeading="Hypothetical questions" dailyLabel="Hypothetical question of the day" dailySalt={71}
    description={description} updated="2026-11-06" items={HYPOTHETICAL_ITEMS} groups={HYPOTHETICAL_GROUPS}
    aboutHeading="Hypothetical questions that start real conversations"
    about={`A hypothetical question sets up an imagined situation and asks what you would do, so nobody has to share anything private to give an interesting answer. This page has ${N} of them in ${HYPOTHETICAL_GROUPS.length} categories, from silly scenarios to genuine dilemmas. Choose a category, pick how many questions you want, and press the button. Questions do not repeat until you have seen every one in your selection.`}
    stepsName="How to use hypothetical questions"
    steps={["Pick a category (or leave it on all) and how many questions you want.", "Draw a question and read it aloud once.", "Give everyone ten seconds to think, then go around the group.", "Ask one follow-up: \"Why did you choose that?\"", "Draw the next one, or switch to a harder or sillier category."]}
    extraFacts={[["Good for", "Icebreakers, car rides, dates, family dinners, classrooms, writing warm-ups"], ["Answers", "No right answers; every question is open-ended"]]}
    uses={[["Icebreakers.", "Open a meeting or class with a funny scenario; everyone can answer in one sentence."], ["Dates and new friends.", "Hypotheticals reveal values without asking personal questions."], ["Family dinners and road trips.", "Pass the phone around and let each person draw the next question."], ["Writing and debate.", "Turn a hard-choice question into a paragraph or a two-minute argument."], ["Classrooms.", "Use the kids group for morning meetings and show-and-tell warm-ups."]]}
    faqs={faqs}
    more={[{ href: "/would-you-rather", label: "Would you rather questions" }, { href: "/this-or-that", label: "This or that questions" }, { href: "/conversation-starters", label: "Conversation starters" }, { href: "/philosophical-questions", label: "Philosophical questions" }, { href: "/topics/random-questions-to-ask-friends", label: "Random questions to ask friends" }, { href: "/question-generator", label: "Random question generator" }]}
  />;
}
