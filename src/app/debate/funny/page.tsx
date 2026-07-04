import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funny Debate Topics Generator — Silly Arguments & Hot Takes",
  description:
    "Generate funny debate topics: is a hot dog a sandwich, is cereal soup, and hundreds more silly arguments with pro/con points. Free generator for parties, classrooms and icebreakers.",
  alternates: { canonical: "/debate/funny" },
};

const FAQ_ITEMS = [
  {
    question: "What are funny debate topics?",
    answer:
      "Funny debate topics are low-stakes questions people argue about passionately precisely because they don't matter: Is a hot dog a sandwich? Is cereal soup? Would you rather fight one horse-sized duck or a hundred duck-sized horses? They produce real argumentation skills with zero real-world tension.",
  },
  {
    question: "When should I use funny debate topics instead of serious ones?",
    answer:
      "Use funny topics for icebreakers, team socials, party games, first debate club meetings, and any classroom where students are nervous about public speaking. Silly stakes lower the fear of being wrong while still exercising structure, rebuttal, and delivery.",
  },
  {
    question: "Are funny debates good practice for real debates?",
    answer:
      "Surprisingly good. Because nobody researches whether cereal is soup, funny debates force pure reasoning and improvisation — the same muscles used in impromptu speaking. Many coaches warm up with a silly round before serious practice.",
  },
  {
    question: "Can I use these topics with kids?",
    answer:
      "Yes — funny debate topics are naturally kid-friendly, and you can add the 'light' depth filter for younger groups. They're popular for family game nights and elementary classroom brain breaks.",
  },
  {
    question: "How many funny debate topics does this generator have?",
    answer:
      "Hundreds of curated silly propositions, plus an AI mode that generates unlimited fresh ones. Each comes with tongue-in-cheek pro and con talking points to kick-start the argument.",
  },
];

export default function FunnyDebatePage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Debate Topics", href: "/debate" },
            { label: "Funny" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          initialCategory="weird-fun"
          title="Funny Debate Topics Generator"
          subtitle="Hilariously arguable questions with pro and con points — perfect for parties, icebreakers, and debate club warm-ups."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Why Silly Arguments Make Great Debates
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Ask a room whether taxes should be higher and half the room goes quiet. Ask whether
                a <strong>hot dog is a sandwich</strong> and suddenly everyone has a passionate, defended
                position with a three-part framework. That&apos;s the magic of <strong>funny debate
                topics</strong>: they remove social risk while keeping every mechanical skill of
                argumentation — claims, definitions, evidence, rebuttal, delivery.
              </p>
              <p>
                This generator focuses on the weird-and-fun end of our topic database. Want the serious
                counterpart for classrooms and clubs? Use the
                main <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topic generator</Link> or
                the <Link href="/debate/students" className="text-[var(--neon-cyan)] hover:underline">student edition</Link>.
                For question-style party prompts, try
                our <Link href="/topics/would-you-rather-questions" className="text-[var(--neon-cyan)] hover:underline">would you rather questions</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Classic Funny Debate Formats
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Food court:</strong> definitional food fights — hot dog vs. sandwich, cereal vs. soup, does pineapple belong on pizza. The trick is forcing debaters to define their categories first.</li>
                <li><strong>Absurd hypotheticals:</strong> horse-sized duck questions. Great for improv because no one can prepare.</li>
                <li><strong>Petty hills:</strong> toilet paper over or under, should ketchup live in the fridge — everyone already has a lifelong position to defend.</li>
                <li><strong>Devil&apos;s advocate roulette:</strong> generate a topic, then flip a coin for your side. Defending the position you find ridiculous is elite persuasion training.</li>
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
