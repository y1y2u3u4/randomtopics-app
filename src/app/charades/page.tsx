import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import CharadesGenerator from "@/components/CharadesGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { CHARADES_WORDS, CHARADES_CATEGORIES } from "@/data/charades";

export const metadata: Metadata = {
  title: "Charades Generator — Random Charades Words with Timer & Categories",
  description:
    "Free charades generator with 528 words, 9 categories and easy-to-hard filters. Hide the word, start your round timer when ready, or print cards. No signup.",
  keywords: [
    "charades generator",
    "charades word generator",
    "charade generator",
    "charades words",
    "words for charades",
    "charades ideas",
    "charades for kids",
    "charades words list",
    "random word for charades",
    "charades timer",
  ],
  alternates: { canonical: "/charades" },
};

const FAQ_ITEMS = [
  {
    question: "How do you play charades?",
    answer:
      "Split into two teams. One player draws a word and acts it out silently — no talking, no mouthing words, no pointing at objects in the room — while their team guesses within the time limit (60 seconds is standard). Score a point for each correct guess, then the other team takes a turn. This generator replaces the paper hat: hand the phone to the actor, deal a word, then press Start round when they are ready. Starting hides the answer from the group.",
  },
  {
    question: "What are good words for charades?",
    answer:
      "Good charades words are concrete enough to act and familiar enough to guess: actions (brushing teeth), animals (penguin), movie titles (Titanic), and jobs (firefighter) are classics. For harder rounds, idioms like 'break a leg' or 'raining cats and dogs' force multi-part acting. Every word in this generator was picked to be actable — no abstract terms nobody can mime — and each is tagged easy, medium, or hard so you can match the deck to the room.",
  },
  {
    question: "Does this charades generator work for kids?",
    answer:
      "Yes — select the Kids & Family category for extra-easy, act-along words (snowman, tooth fairy, blowing bubbles), or set difficulty to Easy in any category. Every word in the entire deck is family-safe, so mixed-age game nights can play on any setting.",
  },
  {
    question: "How does the charades timer work?",
    answer:
      "Choose 30, 60, 90, or 120 seconds. Deal a word and let the actor read it, then press Start round to hide the word and begin the countdown. Pause and resume without losing your remaining time, or reveal the word for a reminder. Next Word resets the timer without starting it. Switch the timer off for untimed play.",
  },
  {
    question: "What are the rules for gestures in charades?",
    answer:
      "The universal signals: hold up fingers for the number of words, then for which word you're acting; tap your forearm with fingers for syllables; cup your ear for 'sounds like'; pinch fingers together for a short word; stretch hands apart for a long word; wave toward yourself for 'closer / keep guessing'; and make a movie-camera crank for films, open palms like a book for books, and draw a TV square for shows. No speaking, no mouthing, no spelling in the air.",
  },
  {
    question: "Can I print charades words to play offline?",
    answer:
      "Yes — set your category and difficulty filters, then hit 'Print this deck' to get a print-ready sheet of every word in the current deck. Cut them into cards, fold them into a bowl, and play the classic way at parties, classrooms, or anywhere without a phone.",
  },
];

const CATEGORY_GUIDES: Record<string, string> = {
  actions: "Start with a familiar movement, then add the awkward detail. For fitted sheets, mime the corners slipping out rather than spelling the word.",
  animals: "Use posture, pace and a distinctive feature. Try a penguin's short steps or an elephant's trunk; save sound effects for a different game.",
  movies: "Agree which titles your group knows before playing. Signal a film first, then act the title or a recognizable scene without quoting dialogue.",
  "tv-books": "Signal a book with open palms or a TV with a rectangle. Pick a character or action your group recognizes; unfamiliar titles can be passed.",
  objects: "Mime the object's shape and how someone uses it. An umbrella opens above your head; a stapler presses papers together.",
  "people-jobs": "Act the work rather than imitating someone's appearance. A firefighter handles a hose; a conductor directs an orchestra.",
  "sports-games": "Show the equipment before the movement. Try an imaginary racket, then a serve. This category has easy and medium words, with no hard-only deck.",
  "kids-family": "Begin with easy words and let children pass unfamiliar ones. Offer 90 or 120 seconds, or turn the timer off. This category has no hard-only deck.",
  phrases: "Signal the number of words, then act the expression literally. Agree on a longer timer for idioms and allow a pass if the phrase is unfamiliar.",
};

export default function CharadesPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Charades Generator" },
          ]}
        />

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
          <h1
            className="section-heading text-4xl sm:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Charades <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            {CHARADES_WORDS.length} charades words across {CHARADES_CATEGORIES.length} categories. Deal a word, let the actor read it, then start the timer and hide the answer. Free, with no signup.
          </p>
        </section>

        <CharadesGenerator />

        {/* Why this one */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { emoji: "🗂️", label: `${CHARADES_CATEGORIES.length} categories` },
              { emoji: "⏱️", label: "Built-in timer" },
              { emoji: "🔁", label: "No repeats" },
              { emoji: "🖨️", label: "Printable cards" },
            ].map((f) => (
              <div key={f.label} className="glass-card p-4">
                <div className="text-2xl mb-1">{f.emoji}</div>
                <div className="text-xs text-[var(--text-secondary)]">{f.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="charades-word-bank" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
          <h2 className="text-2xl font-bold">{`All ${CHARADES_WORDS.length} Charades Words by Category`}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">Browse the complete generator deck below. Each word is labeled Easy, Medium or Hard. Pick a category your group knows; titles and idioms depend on shared familiarity. Difficulty is an editorial guide, not an age guarantee.</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Collection and game guide reviewed September 21, 2026.</p>
          <nav aria-label="Charades word categories" className="my-5 flex flex-wrap gap-2">
            {CHARADES_CATEGORIES.map((cat) => <a key={cat.id} href={`#charades-${cat.id}`} className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-3 py-2 text-sm text-[var(--neon-cyan)]">{cat.emoji} {cat.label} · {CHARADES_WORDS.filter((word) => word.c === cat.id).length}</a>)}
          </nav>
          <div className="space-y-4">
            {CHARADES_CATEGORIES.map((cat) => <details key={cat.id} id={`charades-${cat.id}`} className="glass-card p-5 sm:p-6 scroll-mt-24">
              <summary className="cursor-pointer text-lg font-semibold">{cat.emoji} {cat.label} — {CHARADES_WORDS.filter((word) => word.c === cat.id).length} words</summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{CATEGORY_GUIDES[cat.id]}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {CHARADES_WORDS.filter((word) => word.c === cat.id).map((word) => <li key={word.w} data-charades-word="true" className="rounded-lg border border-white/10 p-3 text-sm">
                  <span className="text-[var(--text-secondary)]">{word.w}</span><span className="ml-2 text-xs text-[var(--text-muted)]">· {word.d === 1 ? "Easy" : word.d === 2 ? "Medium" : "Hard"}</span>
                </li>)}
              </ul>
              <a href="#charades-generator" className="mt-4 inline-flex min-h-11 items-center text-sm text-[var(--neon-cyan)] underline underline-offset-4">Back to your word and timer ↑</a>
            </details>)}
          </div>
        </section>

        {/* SEO content: rules + gestures + FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Play Charades (Quick Rules)
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Split into two teams</strong> and decide a time limit per round — 60 seconds is the classic.</li>
                <li><strong>Hand the screen to the actor</strong>, deal a word and let them read it. Press Start round to hide the word and begin timing.</li>
                <li><strong>Act it out silently</strong> — no talking, no mouthing, no pointing at real objects, no spelling in the air.</li>
                <li><strong>Team guesses</strong> until the timer runs out. A correct guess scores a point.</li>
                <li><strong>Alternate teams</strong>; first to an agreed score (usually 10) wins.</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Standard Charades Gestures
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Number of words:</strong> hold up that many fingers, then show which word you&apos;re acting first.</li>
                <li><strong>Syllables:</strong> lay fingers on your forearm for the count.</li>
                <li><strong>Sounds like:</strong> cup a hand behind your ear.</li>
                <li><strong>Short / long word:</strong> pinch fingers together, or stretch hands apart.</li>
                <li><strong>Movie:</strong> crank an old-fashioned camera. <strong>Book:</strong> open your palms. <strong>TV show:</strong> draw a rectangle.</li>
                <li><strong>Keep guessing / closer:</strong> wave both hands toward yourself.</li>
                <li><strong>Whole idea:</strong> sweep your arms in a big circle to act the entire concept at once.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Make It a Full Game Night
              </h3>
              <p>
                Charades pairs perfectly with our other party tools — run{" "}
                <Link href="/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Truth or Dare</Link>{" "}
                between rounds, warm up with{" "}
                <Link href="/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">Would You Rather</Link>{" "}
                or{" "}
                <Link href="/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Never Have I Ever</Link>,
                spin the{" "}
                <Link href="/spin-the-wheel" className="text-[var(--neon-cyan)] hover:underline">wheel</Link>{" "}
                to pick who acts first, and cool down with{" "}
                <Link href="/this-or-that" className="text-[var(--neon-cyan)] hover:underline">This or That</Link>.
                Hosting a bigger crowd? Grab openers from{" "}
                <Link href="/topics/questions-to-ask-at-a-party" className="text-[var(--neon-cyan)] hover:underline">questions to ask at a party</Link>.
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
