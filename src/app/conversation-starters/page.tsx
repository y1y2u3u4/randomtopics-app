import type { Metadata } from "next";
import DeckListPage from "@/components/DeckListPage";
import { STARTER_GROUPS, STARTER_ITEMS } from "@/data/decks/conversationStarters";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const path = "/conversation-starters";
const N = STARTER_ITEMS.length;
const title = `${N} Conversation Starters: Easy, Fun, Deep & For Dates (Random Generator)`;
const description = `${N} conversation starters (convo starters) for any situation: easy small talk, get-to-know-you, funny, deep, first date, work networking, friends, texting, family dinner and kids. Tap a random starter or read the full list. Free, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: title }, description,
  keywords: ["conversation starters", "convo starters", "conversation starters for dates", "fun conversation starters", "deep conversation starters", "conversation starters for work", "conversation starters for texting", "random conversation starter generator", "conversation starters for kids"],
  alternates: { canonical: path, languages: hreflangAlternates(path) },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  { question: "What are good conversation starters?", answer: "Good conversation starters are open-ended (they cannot be answered with yes or no), easy for anyone to answer, and about something the other person can talk about for a minute, like food, travel or what they are looking forward to. The Easy small talk group on this page is built that way." },
  { question: "How do you start a conversation with someone you do not know?", answer: "Comment on something you share, such as the event, the place or the food, then ask one open question. \"How did you hear about this event?\" or \"Have you found any good shows lately?\" work well. Listen to the answer and ask one follow-up before changing topics." },
  { question: "What are good conversation starters for a first date?", answer: "Ask about things that make someone light up: what they are passionate about, their best trip, a food they could eat forever. The First date group has 16 starters that avoid heavy topics and still go beyond \"so, what do you do?\"" },
  { question: "What are good conversation starters for work and networking?", answer: "Ask about the person's role, current project or what they hope to learn at the event. Questions like \"What is the most interesting project you are working on?\" give them an easy opening. The Work & networking group has 16." },
  { question: "What are good texting conversation starters?", answer: "Keep them short and light, with one clear question: a favorite show, a weekend plan or a comfort food. The Texting group is written to be sent as-is." },
  { question: "What is the difference between conversation starters and conversation topics?", answer: "A topic is a subject, like travel. A starter is the actual question you say out loud, like \"If we could take a trip together, where would we go?\" This page lists ready-to-use starters; for broader subjects try the random conversation topic generator." },
];

export default function ConversationStartersPage() {
  return <DeckListPage
    path={path} name="Conversation Starters"
    tagline="Convo starters you can use right now: easy small talk, funny, deep, date, work and texting questions. Tap for a random conversation starter, or scroll for the full list."
    noun="Conversation starter" toolType="conversation_starter" storageKey="rt-conversation-starters-v1" saveCategory="relationships"
    printHeading="Conversation starters" dailyLabel="Conversation starter of the day" dailySalt={83}
    description={description} updated="2026-11-06" items={STARTER_ITEMS} groups={STARTER_GROUPS}
    aboutHeading="Conversation starters for every situation"
    about={`Awkward silences usually come from not knowing what to ask, not from having nothing to say. This page gives you ${N} conversation starters in ${STARTER_GROUPS.length} situations, from easy small talk to deep questions. Pick the situation, press the button and ask the question as written. Starters do not repeat until you have seen every one in your selection.`}
    stepsName="How to use conversation starters"
    steps={["Pick the situation (small talk, date, work, texting or family) or leave it on all.", "Draw a starter and ask it as written.", "Listen to the full answer before you reply.", "Ask one follow-up that starts with \"what\" or \"how\".", "If the topic dries up, draw the next starter."]}
    extraFacts={[["Good for", "Small talk, dates, networking, texting, family dinners, classrooms"], ["Tone", "Friendly and clean; no personal or sensitive topics"]]}
    uses={[["Meeting new people.", "Use the Easy small talk group at parties, events and first days."], ["Dates.", "Use the First date group to go past the usual job-and-hometown questions."], ["Work and networking.", "Use the Work group at conferences, team lunches and onboarding."], ["Texting.", "Send a Texting starter to restart a quiet chat."], ["Family and classrooms.", "Use the Family dinner and Kids groups for table talk and morning meetings."]]}
    faqs={faqs}
    more={[{ href: "/conversation", label: "Random conversation topics" }, { href: "/topics/conversation-starters-for-couples", label: "Conversation starters for couples" }, { href: "/topics/icebreaker-questions-for-work", label: "Icebreaker questions for work" }, { href: "/hypothetical-questions", label: "Hypothetical questions" }, { href: "/this-or-that", label: "This or that" }, { href: "/question-generator", label: "Random question generator" }, { href: "/deep-conversation-question-generator", label: "Deep conversation questions" }]}
  />;
}
