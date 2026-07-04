import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Argument Generator — Free Pro/Con Argument Topics",
  description:
    "Generate random arguments with clear pro and con sides. Free argument generator for practice debates, persuasive essays, critical thinking exercises and friendly disputes. No signup needed.",
  alternates: { canonical: "/argument-generator" },
};

const FAQ_ITEMS = [
  {
    question: "What is a random argument generator?",
    answer:
      "A random argument generator produces arguable statements — claims that reasonable people can defend or attack — along with talking points for both sides. It's used for debate practice, persuasive essay brainstorming, critical thinking exercises, and structured discussions.",
  },
  {
    question: "How is an argument different from a debate topic?",
    answer:
      "They're closely related: a debate topic is usually framed as a formal resolution ('This house believes...'), while an argument is any claim with two defensible sides. Every argument our generator produces can be used as a debate topic, an essay thesis, or a discussion starter.",
  },
  {
    question: "Can I use generated arguments for persuasive essays?",
    answer:
      "Yes — each argument comes with pro and con talking points that map directly onto persuasive essay structure: take a side, use the talking points as body paragraphs, and address the opposing points in your rebuttal section.",
  },
  {
    question: "Are the arguments suitable for classrooms?",
    answer:
      "Yes. You can filter by category (science, education, technology, ethics and more) and depth level to keep arguments age-appropriate. Teachers use the generator for classroom debates, Socratic seminars, and critical thinking warm-ups.",
  },
  {
    question: "Is this argument generator free?",
    answer:
      "Completely free — no signup, no ads, no usage limits. You can generate up to 10 arguments at once and enable AI generation for unlimited fresh arguments.",
  },
];

export default function ArgumentGeneratorPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Argument Generator" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          title="Random Argument Generator"
          subtitle="Generate arguable claims with ready-made pro and con talking points — for debates, essays, and sharpening your reasoning."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              What Makes a Strong Argument?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A strong <strong>argument</strong> is a claim that can be genuinely defended — and genuinely
                attacked — with reasons and evidence. &quot;Chocolate is tasty&quot; is an opinion;
                &quot;schools should replace letter grades with written feedback&quot; is an argument. Our{" "}
                <strong>random argument generator</strong> produces hundreds of claims like the latter, each
                with talking points for both sides, so you can jump straight into reasoning instead of
                hunting for something to argue about.
              </p>
              <p>
                People use randomly generated arguments in more places than you might expect: debate teams
                drill rebuttals against surprise claims, writing teachers assign them as persuasive essay
                thesis statements, interview coaches use them to practice structured thinking, and friends
                settle long car rides with them. If you want formally framed resolutions instead, try
                our <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link> —
                it draws from the same curated database with a tournament-style framing.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Argue Well (a 4-Step Framework)
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>State the claim precisely.</strong> Vague claims produce vague arguments. Narrow &quot;technology is bad&quot; down to &quot;smartphones should be banned in middle school classrooms.&quot;</li>
                <li><strong>Give reasons, then evidence.</strong> A reason explains why your claim is true; evidence shows it. &quot;Phones hurt focus (reason) — a 2024 study found test scores rose 6% after phone bans (evidence).&quot;</li>
                <li><strong>Steelman the other side.</strong> Before dismissing an objection, state it in its strongest form. Beating a weak version of the counterargument convinces no one.</li>
                <li><strong>Land the impact.</strong> Explain why your argument matters: who benefits, what changes, what's at stake if you're wrong.</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Popular Ways to Use This Generator
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Debate practice:</strong> generate a surprise argument, take the side you disagree with, and give yourself two minutes to defend it.</li>
                <li><strong>Persuasive essays:</strong> use a generated claim as your thesis and the talking points as paragraph outlines. See also our <Link href="/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">essay topics for college</Link>.</li>
                <li><strong>Classroom discussions:</strong> put a generated argument on the board and have students line up on the agree/disagree spectrum, then defend their position.</li>
                <li><strong>Critical thinking drills:</strong> for any generated argument, list the three strongest objections before looking at the con talking points.</li>
                <li><strong>Friendly disputes:</strong> our <Link href="/funny" className="text-[var(--neon-cyan)] hover:underline">funny topics</Link> mode produces low-stakes arguments like &quot;a hot dog is a sandwich&quot; — perfect for parties.</li>
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
