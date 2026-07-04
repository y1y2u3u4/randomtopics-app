import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import SpeechTimer from "@/components/SpeechTimer";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table Topics Generator — Toastmasters Questions + Timer",
  description:
    "Free Table Topics generator for Toastmasters with a built-in 1-2 minute speech timer. Generate random impromptu speaking questions, practice on the clock, and never run out of Table Topics ideas.",
  alternates: { canonical: "/table-topics-generator" },
};

const FAQ_ITEMS = [
  {
    question: "What are Table Topics in Toastmasters?",
    answer:
      "Table Topics is the impromptu speaking section of a Toastmasters meeting. The Table Topics Master asks a surprise question, and a member responds with a 1-2 minute speech with no preparation. It trains you to think on your feet and speak confidently without notes.",
  },
  {
    question: "How long should a Table Topics response be?",
    answer:
      "The standard Toastmasters timing is 1 to 2 minutes: green light at 1:00, yellow at 1:30, red at 2:00. Our built-in speech timer has presets for exactly this format, so you can practice hitting the green-to-red window.",
  },
  {
    question: "How do I get better at Table Topics?",
    answer:
      "Practice a simple structure: answer the question directly in your first sentence, give one reason or story to support it, then close by restating your point. Generate a random question here, start the timer, and repeat the drill 3-5 times per session — improvement comes fast.",
  },
  {
    question: "Can I use this generator to run Table Topics at my club?",
    answer:
      "Yes — many Table Topics Masters generate a batch of up to 10 questions before the meeting, or project this page live. You can filter by category and depth to match your club's theme of the day.",
  },
  {
    question: "Is this Table Topics generator free?",
    answer:
      "Completely free, with no signup and no ads. It includes 500+ curated questions, category and depth filters, an AI mode for unlimited fresh questions, and the built-in practice timer.",
  },
];

export default function TableTopicsPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Table Topics Generator" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          title="Table Topics Generator"
          subtitle="Random impromptu speaking questions for Toastmasters — generate a question, hit the timer, and practice thinking on your feet."
        />

        {/* Speech Timer */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <SpeechTimer />
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Practice Table Topics Like a Toastmaster
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Table Topics</strong> is where most Toastmasters feel the most fear — and grow the
                fastest. Unlike prepared speeches, you get a surprise question and roughly 60 to 120 seconds
                to deliver a coherent answer. The only way to get comfortable is repetition: hear a random
                question, stand up, speak, repeat. That&apos;s exactly what this <strong>Table Topics
                generator</strong> is built for, and unlike printable question lists, it comes with
                a <strong>built-in speech timer</strong> that mirrors the green-yellow-red card timing used
                in real meetings.
              </p>
              <p>
                The question database spans 16 categories — from light &quot;would you rather&quot; style
                prompts to deeper questions about values and experiences — so you can simulate everything
                from a casual club night to a district contest. Need a full question list to print instead?
                See our curated <Link href="/topics/toastmasters-table-topics" className="text-[var(--neon-cyan)] hover:underline">70 Table Topics questions</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A Simple Structure That Always Works (PREP)
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Point.</strong> Answer the question directly in your first sentence. Don&apos;t warm up — land your position immediately.</li>
                <li><strong>Reason.</strong> Give the single strongest reason you hold that view.</li>
                <li><strong>Example.</strong> Tell a 30-second story or concrete example. Stories are what audiences remember.</li>
                <li><strong>Point (again).</strong> Restate your answer in one closing line. A clean ending beats a strong opening.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Drills for Solo Practice
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>The 5×2 drill:</strong> five random questions, two minutes each, back to back. No skipping — the questions you want to skip are the ones you need.</li>
                <li><strong>The one-word anchor:</strong> answer any question through the lens of a single word (courage, curiosity, family). This trains you to bridge from any question to material you know.</li>
                <li><strong>The silence drill:</strong> force a full two-second pause instead of saying &quot;um.&quot; Record yourself and count filler words per minute.</li>
                <li><strong>Contest simulation:</strong> generate one question, wait 5 seconds, then speak for exactly 1:30. Repeat weekly and track how often you land in the qualifying window.</li>
              </ol>
              <p>
                Looking for longer-form practice? Our <Link href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link> covers
                prepared speech ideas, and the <Link href="/impromptu-speech-topics" className="text-[var(--neon-cyan)] hover:underline">impromptu speech topics</Link> page
                targets classroom and forensics formats.
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
