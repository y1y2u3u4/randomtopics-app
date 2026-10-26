import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FactTable from "@/components/FactTable";
import CouplesDaily from "@/components/subs/CouplesDaily";
import LandingView from "@/components/subs/LandingView";
import { SITE_URL } from "@/i18n/config";

const PATH = "/couples-daily-question";
const ES_PATH = "/es/pregunta-diaria-pareja";
const TITLE = "Couples Daily Question — One Question a Day, Answers Revealed Together";
const DESCRIPTION =
  "A daily question app for couples: you each answer privately and both answers appear only once you have both answered. Free for 3 days, then $4.99/month or $29.99/year for the two of you. No signup to start.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["couples daily question", "daily question for couples", "couples question of the day", "daily questions to ask your partner", "couples app", "relationship question a day"],
  alternates: { canonical: PATH, languages: { en: `${SITE_URL}${PATH}`, es: `${SITE_URL}${ES_PATH}`, "x-default": `${SITE_URL}${PATH}` } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  { question: "What is the Couples Daily Question?", answer: "A shared room for two. Every day you both get the same question. You each write your answer separately, and the app shows both answers together only after you have both answered. It also keeps a history of your past answers and counts a streak of the days you both answered." },
  { question: "How much does it cost?", answer: "The first 3 days are free, with no signup and no card. After that it is $4.99 per month or $29.99 per year, in US dollars. One plan covers both of you: if either partner subscribes, the room keeps working for both." },
  { question: "Do we both have to pay?", answer: "No. Only one of you needs a plan. The room checks both partners, so whoever pays unlocks it for the two of you." },
  { question: "Who can see our answers?", answer: "Only the two of you. Your partner can never see your answer before they have written their own, and nobody else can open the room. Answers are not public and are not used to build a profile." },
  { question: "How do I invite my partner?", answer: "Start a room and copy the invite link (or use the Share button on your phone). When your partner opens the link and taps join, you are connected. A room holds exactly two people." },
  { question: "What if my partner does not answer?", answer: "Your answer stays hidden and the page says it is waiting for your partner. The page refreshes by itself while it is open, and the answers appear the moment they reply." },
  { question: "What happens after the 3 free days?", answer: "You can still open the room and read every past day you both answered. To answer a new day, one of you picks a monthly or yearly plan. You can cancel any time." },
  { question: "What kinds of questions are they?", answer: "Open questions both of you can answer: memories, dreams, small daily habits, what makes you feel cared for, plus lighter ones. You will not see the same question twice until the whole list has been used." },
  { question: "Can we use it in different time zones?", answer: "Yes. The room uses the time zone of the person who created it to decide when a new day starts, so you both see the same question on the same day." },
];

export default function CouplesDailyQuestionPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Couples Daily Question"
      heading={["Couples Daily", "Question"]}
      intro="One question a day for the two of you. Answer privately, then see both answers together. Free for 3 days, no signup to start."
      description={DESCRIPTION}
      updated="2026-10-24"
      faq={FAQ}
      inShort="Couples Daily Question gives you and your partner the same question each day. You both answer privately, and the answers show only after you have both answered. You also get a shared history and a streak. The first 3 days are free with no signup; after that it costs $4.99 a month or $29.99 a year, and one plan covers both of you."
      related={[
        { href: "/topics/conversation-starters-for-couples", label: "Conversation starters for couples" },
        { href: "/this-or-that/couples", label: "This or that for couples" },
        { href: "/question-of-the-day", label: "Question of the day" },
        { href: "/deep-conversation-question-generator", label: "Deep conversation questions" },
      ]}
      afterTool={
        <FactTable
          heading="Couples Daily Question at a glance"
          columns={["", "Details"]}
          rows={[
            ["Free trial", "3 days from the day you create the room, no signup, no card"],
            ["Price after that", "$4.99 per month or $29.99 per year (USD), cancel any time"],
            ["Who pays", "One of you. A plan on either partner covers the room"],
            ["Who sees answers", "Only the two of you; each answer stays hidden until both have answered"],
            ["Included", "Daily question, shared history, streak, English and Spanish"],
            ["Devices", "Any browser; open the invite link on the second phone"],
          ]}
        />
      }
      content={
        <>
          <SectionTitle>How it works</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Start a room</strong> — one tap, no signup. You get an invite link.</li>
            <li><strong>Send the link</strong> to your partner. They open it and join.</li>
            <li><strong>Answer today&apos;s question</strong> on your own, in your own words.</li>
            <li><strong>Reveal together</strong> — once you have both answered, both answers appear side by side.</li>
          </ol>
          <SectionTitle>Why answering apart works</SectionTitle>
          <p>
            When one person answers out loud first, the other tends to agree or soften their own answer. Writing yours before you see theirs
            keeps it honest, and the reveal gives you something real to talk about over dinner or before bed. For a longer list to talk through
            in person, see our <Link prefetch={false} href="/topics/conversation-starters-for-couples" className={linkClass}>conversation starters for couples</Link>;
            for something lighter, try <Link prefetch={false} href="/this-or-that/couples" className={linkClass}>this or that for couples</Link>. The Spanish version
            is <Link prefetch={false} href={ES_PATH} className={linkClass}>Pregunta diaria para parejas</Link>.
          </p>
        </>
      }
    >
      <LandingView product="couples" />
      <CouplesDaily locale="en" />
    </GeneratorPageShell>
  );
}
