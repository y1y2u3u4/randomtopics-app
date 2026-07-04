import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Question Generator — 500+ Questions for Any Group",
  description:
    "Free random question generator: icebreakers, deep questions, funny prompts and discussion questions across 16 categories. Filter by depth, generate up to 10 at once — no signup.",
  alternates: { canonical: "/question-generator" },
};

const FAQ_ITEMS = [
  {
    question: "What is a random question generator?",
    answer:
      "A random question generator produces questions on demand — icebreakers, deep conversation questions, funny prompts, discussion questions — so you never have to brainstorm them yourself. Ours draws from 500+ hand-curated questions across 16 categories, with an AI mode for unlimited fresh ones.",
  },
  {
    question: "What can I use random questions for?",
    answer:
      "The most common uses: icebreakers for meetings and classrooms, get-to-know-you games at parties, conversation practice for ESL learners, journaling prompts, first-date conversation, team building sessions, and family dinner questions.",
  },
  {
    question: "Can I control what kind of questions I get?",
    answer:
      "Yes — filter by category (science, relationships, food, philosophy and 12 more), by depth (light, medium, deep), and by mode (conversation, icebreaker, debate-style). Generate 1, 3, 5, or 10 questions at a time.",
  },
  {
    question: "Are the questions appropriate for work and school?",
    answer:
      "The curated database is workplace- and classroom-safe. Use the 'light' depth filter for the safest icebreaker-style questions, and the icebreaker mode for team settings.",
  },
  {
    question: "Is this question generator free?",
    answer:
      "Completely free — no signup, no ads, no limits. It's supported by the same topic database that powers our conversation, debate, and speech generators.",
  },
];

export default function QuestionGeneratorPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Question Generator" },
          ]}
        />
        <TopicGenerator
          initialMode="icebreaker"
          title="Random Question Generator"
          subtitle="Instant questions for any group — icebreakers, deep questions, funny prompts and everything in between."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              The Right Question for Every Situation
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A good question is a social tool: it can break awkward silence, turn small talk into a
                real conversation, or get a quiet classroom talking. This <strong>random question
                generator</strong> gives you an endless supply, organized so you can match the question
                to the moment — <strong>light questions</strong> for new groups, <strong>medium</strong> for
                friendly banter, and <strong>deep questions</strong> for conversations that matter.
              </p>
              <p>
                It&apos;s built on the same 500+ topic database as our other tools, so if you need a more
                specific flavor, jump to the dedicated
                generator: <Link href="/icebreaker" className="text-[var(--neon-cyan)] hover:underline">icebreaker questions</Link> for
                teams, <Link href="/conversation" className="text-[var(--neon-cyan)] hover:underline">conversation starters</Link> for
                social settings, or <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate questions</Link> when
                you want structured disagreement.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Question Styles and When to Use Them
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Icebreakers</strong> — first meetings, onboarding, class kickoffs. Low stakes, everyone can answer. Try our <Link href="/topics/icebreaker-questions-for-work" className="text-[var(--neon-cyan)] hover:underline">50 icebreakers for work</Link>.</li>
                <li><strong>Get-to-know-you questions</strong> — parties and new friendships. See <Link href="/topics/get-to-know-you-questions-for-adults" className="text-[var(--neon-cyan)] hover:underline">questions for adults</Link>.</li>
                <li><strong>Deep questions</strong> — close friends, partners, journaling. Browse <Link href="/topics/deep-questions-to-ask-your-partner" className="text-[var(--neon-cyan)] hover:underline">deep questions for your partner</Link>.</li>
                <li><strong>Funny questions</strong> — game nights and group chats. The <Link href="/funny" className="text-[var(--neon-cyan)] hover:underline">funny generator</Link> specializes in these.</li>
                <li><strong>Discussion questions</strong> — classrooms and book clubs. Filter by academic categories like science, history, or philosophy.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Three Rules for Asking Better Questions
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Ask open, not closed.</strong> &quot;What was the best part of your weekend?&quot; beats &quot;Did you have a good weekend?&quot; — the first invites a story, the second invites &quot;yeah.&quot;</li>
                <li><strong>Follow the energy.</strong> The generated question is a door, not a script. If the answer opens a more interesting thread, abandon the plan and pull it.</li>
                <li><strong>Answer your own question too.</strong> Reciprocity keeps questions from feeling like an interview — after they answer, share yours.</li>
              </ol>

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
