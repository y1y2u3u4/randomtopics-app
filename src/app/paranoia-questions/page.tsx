import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import QuestionBank from "@/components/QuestionBank";
import { PartyIllustration } from "@/components/CategoryIllustration";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { PARANOIA_QUESTIONS } from "@/data/paranoia";

export const metadata: Metadata = {
  title: "Paranoia Questions — 60+ Whisper Game Questions (Clean & Fun)",
  description:
    "60+ paranoia questions for the whisper party game — whisper the question, say the name out loud, flip a coin to reveal. All clean and party-safe. One click per question, no repeats, free.",
  keywords: [
    "paranoia questions",
    "paranoia game questions",
    "paranoia party game",
    "how to play paranoia",
    "paranoia questions for friends",
    "whisper game questions",
  ],
  alternates: { canonical: "/paranoia-questions" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play the Paranoia game?",
    answer:
      "Sit in a circle. Player one whispers a question to the player on their right — always a question whose answer is someone in the group, like 'Who here would survive a horror movie?' The answerer says the name out loud, and only the name. Then flip a coin: heads, the question is revealed to everyone; tails, it stays secret forever — and the named person has to live with not knowing why. That not-knowing is the whole game.",
  },
  {
    question: "What are good paranoia questions?",
    answer:
      "Good paranoia questions always have a person as the answer and are fun whether or not they're revealed: 'Who is most likely to become accidentally famous?' works because being named is flattering-ish and mysterious. Avoid questions that could genuinely hurt — the game runs on playful paranoia, not real anxiety. Every question in this deck is clean and compliment-adjacent.",
  },
  {
    question: "Are these paranoia questions clean?",
    answer:
      "Yes — every question is party-safe and appropriate for mixed company, teen groups, and family game nights. The fun comes from the coin-flip suspense, not from edgy content, so the deck stays friendly while the game stays thrilling.",
  },
  {
    question: "How many people do you need for Paranoia?",
    answer:
      "Five to ten players is the sweet spot — enough people that being named feels random, few enough that everyone stays involved. With bigger groups, split into two circles. You need at least four players for the whispering to stay secret.",
  },
  {
    question: "What if the coin lands on tails every time?",
    answer:
      "That's the game being kind to your secrets — but if the group wants more reveals, play with a 'two tails in a row forces a reveal' house rule, or use a phone flashlight instead of a coin: light on means reveal. House rules are encouraged; the only fixed rule is that the answerer says nothing but the name.",
  },
];

export default function ParanoiaPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Paranoia Questions" },
          ]}
        />
        <PartyIllustration game="paranoia-questions" />

        <PartyGenerator
          questions={PARANOIA_QUESTIONS}
          title="Paranoia Questions"
          subtitle="The whisper game: whisper the question, answer with a name out loud, flip a coin to reveal. One click per question — all clean, no repeats."
          emoji="🤫"
        />

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Play Paranoia (Full Rules)
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Sit in a circle</strong> — five to ten players works best.</li>
                <li><strong>Whisper the question</strong> — deal one from the generator and whisper it to the player on your right. The answer must be someone in the group.</li>
                <li><strong>Answer out loud</strong> — the answerer says only a name. No explanation, no hints.</li>
                <li><strong>Flip a coin</strong> — heads: the question is revealed to everyone. Tails: it stays secret forever.</li>
                <li><strong>Rotate</strong> — the answerer becomes the next asker. The paranoia compounds beautifully.</li>
              </ol>
              <p>
                The genius of the game is the tails flip: someone just heard their name and will{" "}
                <em>never know why</em>. Keep questions playful — the deck above is built so that
                every name-drop lands as a compliment, a laugh, or a delicious mystery, never a wound.
              </p>
              <p>
                Round out game night with{" "}
                <Link href="/hot-seat-questions" className="text-[var(--neon-cyan)] hover:underline">Hot Seat</Link>,{" "}
                <Link href="/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Truth or Dare</Link>,{" "}
                <Link href="/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Most Likely To</Link>{" "}
                (paranoia&apos;s louder cousin),{" "}
                <Link href="/charades" className="text-[var(--neon-cyan)] hover:underline">Charades</Link>, and{" "}
                <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>.
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

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5" style={{ fontFamily: "var(--font-display)" }}>
              How to Run a Paranoia Circle
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p><strong className="text-[var(--text-primary)]">Classic rules.</strong> Player A whispers a question to player B. B answers out loud with a name &mdash; but the group only hears the name, never the question. Then a coin flip: heads, the question is revealed; tails, everyone stays paranoid. Rotate clockwise.</p>
              <p><strong className="text-[var(--text-primary)]">Group size.</strong> The sweet spot is 5&ndash;10 players. Fewer and the name pool is too small; more and the whisper chain takes forever.</p>
              <p><strong className="text-[var(--text-primary)]">Safe mode.</strong> New group or mixed company? Play reveal-always for the first full rotation. The coin flip tension works better once everyone trusts the questions are kind &mdash; and this deck is built to stay kind.</p>
              <p><strong className="text-[var(--text-primary)]">No-repeat rule.</strong> A name can only be answered once per rotation. Forces the spotlight to move and saves the quiet players from being everyone&apos;s easy answer.</p>
              <p className="text-xs text-[var(--text-muted)]">Facilitator tip: if a tails-flip leaves someone visibly desperate to know, offer the liar&apos;s bargain &mdash; they can buy the reveal by taking the next whisper turn twice.</p>
            </div>
          </div>
        </section>
        <QuestionBank
          heading="All 60 Paranoia Questions"
          intro="The full whisper deck &mdash; every question is kind by design, so the mystery stays fun even when the answer never gets revealed."
          questions={PARANOIA_QUESTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
