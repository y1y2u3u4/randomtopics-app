import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate Question Generator — Random Debate Questions with Pro & Con",
  description:
    "Free debate question generator. Get random debate questions with pro and con talking points instantly — for classrooms, debate clubs, practice rounds, and friendly arguments. No signup.",
  keywords: [
    "debate question generator",
    "debate questions",
    "random debate questions",
    "debate questions generator",
    "random debate question generator",
    "debate question",
  ],
  alternates: { canonical: "/debate/questions" },
};

const FAQ_ITEMS = [
  {
    question: "What is a debate question generator?",
    answer:
      "A debate question generator instantly gives you a random debate question at the click of a button — a two-sided prompt you can argue for or against. Every question from our generator comes with pro and con talking points, so you can start a structured debate immediately instead of spending prep time brainstorming. It pulls from a database of 500+ hand-written questions across politics, technology, ethics, science, education, and more.",
  },
  {
    question: "What makes a good debate question?",
    answer:
      "A good debate question has three qualities: both sides must be genuinely defensible, the wording must take a clear yes/no or agree/disagree position, and the subject must matter to the people debating it. \"Should social media require age verification?\" works because reasonable people disagree and evidence exists on both sides. Our generator is built around questions that pass all three tests.",
  },
  {
    question: "Can I get random debate questions for a classroom?",
    answer:
      "Yes — that is one of the most common uses. Project the generator, spin until the class is roughly split on an answer, then assign pro and con teams. You can filter by category to keep questions age-appropriate and generate up to 10 questions at once for parallel small-group debates. It is free for teachers with no signup.",
  },
  {
    question: "How is a debate question different from a debate topic or motion?",
    answer:
      "A debate topic is the subject area (social media and teenagers), a motion states a position formally (\"This House would ban social media for under-16s\"), and a debate question asks it directly (\"Should under-16s be banned from social media?\"). They are three framings of the same argument. Our generator phrases results so you can use them in whichever format your debate needs — see our debate topic generator for the topic-first approach.",
  },
  {
    question: "Is the debate question generator free?",
    answer:
      "Completely free — no account, no signup, and no limits. Generate as many random debate questions as you like, on any device. Teachers, debate coaches, and students use it for practice rounds, impromptu speaking drills, classroom debates, and even dinner-table arguments.",
  },
];

export default function DebateQuestionsPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate Topics", href: "/debate" },
            { label: "Question Generator" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="Debate Question Generator"
          subtitle="Get a random debate question with pro and con talking points instantly. Pick a category to focus the argument, or leave it on random and take whatever question comes."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Random Debate Questions, Ready to Argue
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Need a <strong>debate question</strong> right now? This <strong>debate question
                generator</strong> hands you one instantly — a genuinely two-sided question with{" "}
                <strong>pro and con talking points</strong> attached, so the argument can start in
                seconds. Whether you are running a classroom debate, drilling for a tournament, or
                just settling who argues better at dinner, a random question forces you to think on
                your feet instead of rehearsing a position you already hold.
              </p>
              <p>
                Unlike a plain list, the generator gives you a fresh question every spin from a database
                of 500+ hand-written debate questions across 16 categories — politics, technology,
                ethics, science, education, sports, and more. Filter by category and depth to match your
                audience, or generate 10 at once for group work.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Who Uses a Debate Question Generator?
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Teachers &amp; classrooms:</strong> project it live, spin until the class splits, assign pro/con teams. Pair it with our <Link href="/debate/students" className="text-[var(--neon-cyan)] hover:underline">student debate generator</Link> for grade-banded questions.</li>
                <li><strong>Debate clubs &amp; tournament prep:</strong> random questions are the closest thing to real impromptu rounds — you cannot prepare, only think. Practice both sides of every question you draw.</li>
                <li><strong>ESL &amp; conversation classes:</strong> debate questions force complete arguments rather than one-word answers, which makes them excellent speaking practice.</li>
                <li><strong>Friends &amp; family:</strong> lighter categories turn the generator into a party game — see our <Link href="/debate/funny" className="text-[var(--neon-cyan)] hover:underline">funny debate generator</Link> for the silly end of the spectrum.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Run a Quick Debate from a Random Question
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Generate a question</strong> — spin until you land on one where the group genuinely disagrees.</li>
                <li><strong>Assign sides</strong> — put at least one person on the side they disagree with; it builds the strongest arguments.</li>
                <li><strong>Prep for 5 minutes</strong> — use the pro/con talking points as starting leads, then add your own.</li>
                <li><strong>Alternate speeches</strong> — 2-minute openings, 1-minute rebuttals, 1-minute closings, then vote on the most persuasive side.</li>
              </ol>

              <p className="pt-2">
                Want the formal framing instead? Our main{" "}
                <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link>{" "}
                covers topics and motions, and the{" "}
                <Link href="/argument-generator" className="text-[var(--neon-cyan)] hover:underline">argument generator</Link>{" "}
                builds out full pro/con cases. Prefer a printable list? Start with{" "}
                <Link href="/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">75 debate topics for students</Link>.
              </p>

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
