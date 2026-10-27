import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import YesNoWheel from "@/components/generators/YesNoWheel";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/yes-or-no-wheel";
const TITLE = "Yes or No Wheel — Spin for a Random Yes/No/Maybe Answer";
const DESCRIPTION =
  "Ask a question and spin the yes or no wheel. Switch to yes, no or maybe for a third option, keep score of the answers, and let a fair random wheel make the call. Free, no signup.";

const SOCIAL = generatorSocial({ card: "yes-or-no-wheel", title: TITLE, description: DESCRIPTION, alt: "Yes or No Wheel — green and red wheel" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["yes or no wheel", "yes no wheel", "yes or no spinner", "spin the wheel yes or no", "yes no maybe wheel", "yes or no generator", "yes or no picker"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the yes or no wheel work?",
    answer: "Type your question if you like, then press Spin. The wheel turns and stops on Yes or No. In the yes/no/maybe version, Maybe is a third equal slice. The answer is picked first by a secure random generator and the wheel is animated to match.",
  },
  {
    question: "Is it a fair 50/50?",
    answer: "Yes. In Yes / No mode the wheel has 10 alternating slices, five Yes and five No, so each answer has a 50% chance. In Yes / No / Maybe mode there are nine slices, three of each, so each answer has a one-in-three chance.",
  },
  {
    question: "Should I let a wheel make important decisions?",
    answer: "Use it for small choices and as a gut check for bigger ones. Notice your reaction when the answer lands: relief or disappointment is useful information about what you really wanted. For serious decisions about health, money or safety, rely on facts and professional advice.",
  },
  {
    question: "What is the difference between this and the decision maker?",
    answer: "This wheel answers one question with Yes or No (or Maybe). The decision maker lets you type your own options, add weights and draw lots when you have three or more choices.",
  },
  {
    question: "Is the same answer likely to repeat?",
    answer: "Yes, it can. Every spin is independent, so Yes can come up three times in a row. The tally under the wheel shows how many of each answer you have had in this session.",
  },
  {
    question: "Does it save my questions?",
    answer: "No. Your question stays on your screen and in your browser; nothing is stored or sent to a server.",
  },
];

export default function YesNoWheelPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Yes or No Wheel"
      heading={["Yes or No", "Wheel"]}
      intro="Ask a question, spin the wheel and get a random Yes, No or Maybe."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Choose Yes / No or Yes / No / Maybe, type your question if you want to, and press Spin. The wheel lands on a random answer with equal odds for each, and a tally keeps count of how many of each you have had. It is free, takes no signup and keeps your question in your browser."
      related={[
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/flip-a-coin", label: "Flip a coin" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/spin-the-wheel", label: "Spin the wheel (topics)" },
        { href: "/this-or-that", label: "This or That" },
      ]}
      content={
        <>
          <SectionTitle>Questions that suit a yes/no wheel</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Small daily choices</strong> — &lsquo;Should I go for a run?&rsquo; &lsquo;Order dessert?&rsquo; &lsquo;Text them first?&rsquo;</li>
            <li><strong>Party and group games</strong> — spin to answer truth questions, settle a bet, or make a dare happen or not.</li>
            <li><strong>Classroom</strong> — true-or-false style prompts, or a fun way to let the class vote on a game.</li>
            <li><strong>Stuck on a decision</strong> — if you cannot choose, the spin forces a first reaction. Do you agree with the answer, or do you want to spin again?</li>
          </ul>
          <SectionTitle>Yes / No vs Yes / No / Maybe</SectionTitle>
          <p>
            The two-answer wheel is a coin flip with a better show. Add <strong>Maybe</strong> when a plain verdict would be a lie: it turns the result into &lsquo;ask me later&rsquo;
            or &lsquo;do more research&rsquo;, which is often the honest answer to a big question. All answers carry the same odds, and slices alternate around the wheel, so
            it never looks lopsided.
          </p>
          <SectionTitle>Make it fun, not final</SectionTitle>
          <p>
            Agree on the rules before you spin: one spin counts, or best of three. If you only want a quick 50/50 and no wheel,{" "}
            <Link prefetch={false} href="/flip-a-coin" className={linkClass}>flip a coin</Link>. For three or more options with your own labels, use the{" "}
            <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> or the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link>.
          </p>
        </>
      }
    >
      <YesNoWheel />
    </GeneratorPageShell>
  );
}
