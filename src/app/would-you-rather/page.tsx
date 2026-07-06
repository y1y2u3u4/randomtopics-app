import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { WOULD_YOU_RATHER } from "@/data/partyQuestions";

export const metadata: Metadata = {
  title: "Would You Rather Generator — 60+ Questions, No Repeats",
  description:
    "Free Would You Rather question generator: 60+ clean, party-safe dilemmas with a no-repeat deck. One click per question — perfect for parties, road trips, classrooms and icebreakers.",
  keywords: [
    "would you rather questions",
    "would you rather generator",
    "would you rather game",
    "would you rather questions for adults",
    "hard would you rather",
    "funny would you rather",
  ],
  alternates: { canonical: "/would-you-rather" },
};

const FAQ_ITEMS = [
  {
    question: "What is the Would You Rather game?",
    answer:
      "Would You Rather is a conversation game where players choose between two options — often equally appealing, equally awful, or hilariously absurd — and defend their choice. The fun isn't the pick itself; it's the reasoning and the arguments that follow.",
  },
  {
    question: "How do you play Would You Rather?",
    answer:
      "Generate a question, have everyone answer (no 'neither' allowed!), then let each person defend their choice in a sentence or two. In groups, vote first and make the minority defend their side — instant friendly debate.",
  },
  {
    question: "Are these Would You Rather questions clean?",
    answer:
      "Yes — every question in this deck is party-safe and appropriate for mixed company, classrooms, and family game nights. No adult themes.",
  },
  {
    question: "Can teachers use this in the classroom?",
    answer:
      "Absolutely. Would You Rather works as a bell-ringer, a persuasive writing warm-up (pick a side, defend it in one paragraph), and an ESL speaking exercise. The no-repeat deck means you can run it daily without duplicates.",
  },
  {
    question: "How is this different from your other generators?",
    answer:
      "This is a dedicated deck of 60+ curated either/or dilemmas with no-repeat cycling. For open-ended prompts, try the random question generator; for arguable propositions with pro/con points, use the debate or argument generators.",
  },
];

export default function WouldYouRatherPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Would You Rather" },
          ]}
        />
        <PartyGenerator
          questions={WOULD_YOU_RATHER}
          title="Would You Rather Generator"
          subtitle="60+ clean either/or dilemmas — one click per question, no repeats until you've seen the whole deck."
          emoji="🤔"
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Perfect Question Game for Any Group
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Would You Rather</strong> works because it forces a choice. Open questions let
                people shrug; an either/or dilemma demands a position, and positions demand reasons.
                That&apos;s why the game fills awkward silences at parties, wakes up sleepy classrooms,
                and survives twelve-hour road trips. This generator deals from a hand-curated deck of
                60+ <strong>clean would you rather questions</strong> — silly hypotheticals, life
                trade-offs, and impossible food choices — with no repeats until the deck runs out.
              </p>
              <p>
                Want a printable list instead? See
                our <Link href="/topics/would-you-rather-questions" className="text-[var(--neon-cyan)] hover:underline">80 would you rather questions</Link> collection.
                For more party ammunition,
                try <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>,
                the <Link href="/question-generator" className="text-[var(--neon-cyan)] hover:underline">random question generator</Link>,
                or <Link href="/funny" className="text-[var(--neon-cyan)] hover:underline">funny topics</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ways to Play
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Classic circle:</strong> everyone answers the same question, then the group grills the most controversial pick.</li>
                <li><strong>Majority rules:</strong> vote simultaneously on a count of three; the minority must defend their choice for 30 seconds.</li>
                <li><strong>Predict-your-friend:</strong> guess what the person next to you will pick before they reveal it. Score a point per correct prediction.</li>
                <li><strong>Classroom debate seed:</strong> use a question as a mini persuasive-writing prompt — one paragraph defending your side. Great with our <Link href="/debate/middle-school" className="text-[var(--neon-cyan)] hover:underline">middle school debate generator</Link> as a follow-up.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>

              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
