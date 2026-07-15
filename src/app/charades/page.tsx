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
    "Free charades generator with 490+ words to act out — filter by category (movies, animals, actions, kids) and difficulty, with a built-in round timer, no-repeat deck, and printable word cards. No signup.",
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
      "Split into two teams. One player draws a word and acts it out silently — no talking, no mouthing words, no pointing at objects in the room — while their team guesses within the time limit (60 seconds is standard). Score a point for each correct guess, then the other team takes a turn. This generator replaces the paper hat: deal a word, hand the phone to the actor, and the built-in timer runs the round for you.",
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
      "Choose 30, 60, 90, or 120 seconds and the timer starts automatically each time you deal a word — the bar counts down, turns red for the final ten seconds, and flashes Time's Up when the round ends. Sixty seconds is the classic default; use 30 for lightning rounds and 120 for hard idioms or younger players. You can also switch it off entirely.",
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

// Crawlable sample lists: a taste of each category (the full 490+ deck lives in
// the interactive generator above).
const SAMPLE_LISTS: { theme: string; emoji: string; blurb: string; words: string[] }[] = [
  {
    theme: "Easy Charades Words for Kids",
    emoji: "🧸",
    blurb: "Act-along words young kids can perform and guess — perfect for family game night.",
    words: [
      "Snowman", "Tooth fairy", "Dinosaur", "Superman flying", "Blowing bubbles",
      "Pillow fight", "Teddy bear", "Unicorn", "Freeze dance", "Peekaboo",
      "Flying a kite", "Ice cream cone", "Tickle monster", "Nap time", "Robot",
    ],
  },
  {
    theme: "Funny Actions to Act Out",
    emoji: "🏃",
    blurb: "Everyday situations that get funnier the more accurately you mime them.",
    words: [
      "Trying to fold a fitted sheet", "Stepping on a Lego", "Walking into a spider web",
      "Untangling headphones", "Parallel parking", "Waking up late for work",
      "Assembling flat-pack furniture", "Carrying all the groceries in one trip",
      "Looking for your glasses while wearing them", "Pretending to listen on a video call",
    ],
  },
  {
    theme: "Movie Charades",
    emoji: "🎬",
    blurb: "Titles everyone knows — act the scene, not the poster.",
    words: [
      "Titanic", "Jaws", "The Lion King", "Frozen", "Spider-Man", "Rocky",
      "Harry Potter", "Jurassic Park", "Home Alone", "Finding Nemo",
      "King Kong", "The Wizard of Oz", "Pirates of the Caribbean", "Toy Story", "Ghostbusters",
    ],
  },
  {
    theme: "Animal Charades",
    emoji: "🐘",
    blurb: "The all-ages classic — from easy elephants to hard-mode chameleons.",
    words: [
      "Elephant", "Penguin", "Kangaroo", "T-Rex", "Monkey", "Flamingo",
      "Crab", "Owl", "Sloth", "Octopus", "Woodpecker", "Wolf howling at the moon",
      "Deer in headlights", "Seal balancing a ball", "Chameleon",
    ],
  },
  {
    theme: "Hard Charades: Idioms & Phrases",
    emoji: "💬",
    blurb: "The expert deck — multi-word expressions that demand creative acting.",
    words: [
      "Break a leg", "Raining cats and dogs", "The elephant in the room",
      "Barking up the wrong tree", "Once in a blue moon", "Spill the beans",
      "Butterflies in your stomach", "Kill two birds with one stone",
      "Needle in a haystack", "When pigs fly", "Walking on eggshells", "Couch potato",
    ],
  },
];

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
            {CHARADES_WORDS.length}+ hand-picked charades words with a built-in round timer. Filter
            by category and difficulty, deal a word, act it out — no repeats until the deck runs dry.
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

        {/* Sample word lists (crawlable) */}
        {SAMPLE_LISTS.map((list) => (
          <section key={list.theme} className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {list.emoji} {list.theme}
              </h2>
              <p className="text-[var(--text-muted)] text-sm mb-5">{list.blurb}</p>
              <div className="flex flex-wrap gap-2">
                {list.words.map((w) => (
                  <span
                    key={w}
                    className="text-sm px-3.5 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* SEO content: rules + gestures + FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              How to Play Charades (Quick Rules)
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Split into two teams</strong> and decide a time limit per round — 60 seconds is the classic.</li>
                <li><strong>Deal a word</strong> with the generator above and hand the screen to the actor only.</li>
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
