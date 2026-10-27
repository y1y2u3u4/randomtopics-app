import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CharadesGenerator from "@/components/CharadesGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { KIDS_CHARADES_WORDS, KIDS_CHARADES_CATEGORIES, KIDS_CHARADES_AGE_LABELS } from "@/data/charadesKids";

const PATH = "/charades/kids";
const COUNT = KIDS_CHARADES_WORDS.length;
const TITLE = "Charades Generator for Kids — Easy Words by Age, with Timer";
const DESCRIPTION = `Free charades generator for kids: ${COUNT} kid-safe words in ${KIDS_CHARADES_CATEGORIES.length} categories, sorted by age (3–5, 6–8, 9–12). Random word, hidden while you act, 90-second timer, team scores and printable cards. No signup.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "charades generator for kids", "charades for kids", "charades words for kids", "kids charades ideas",
    "easy charades for kids", "charades for toddlers", "charades for preschoolers", "printable charades for kids",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const byCategory = (id: string) => KIDS_CHARADES_WORDS.filter((w) => w.c === id);
const byLevel = (d: number) => KIDS_CHARADES_WORDS.filter((w) => w.d === d).length;
const sample = (d: number, n: number) => KIDS_CHARADES_WORDS.filter((w) => w.d === d && !/ /.test(w.w)).slice(0, n).map((w) => w.w).join(", ");

const FAQ = [
  {
    question: "What are good charades words for kids?",
    answer: "Start with one-word things a child can see and copy: animals (frog, monkey, elephant), actions (jump, sleep, dance) and feelings (happy, sleepy, scared). Each has an obvious move or face. Older kids can move to short actions such as brushing teeth or riding a bike, then to pretend stories like a knight fighting a dragon.",
  },
  {
    question: "What charades words work for 3, 4 and 5 year olds?",
    answer: `Use the Ages 3–5 filter: ${byLevel(1)} single picture words such as ${sample(1, 6)}. They need one move and no spelling. Give a young child 90 or 120 seconds, let the grown-up whisper the word, and cheer for any attempt, not only a correct guess.`,
  },
  {
    question: "How do you play charades with kids?",
    answer: "One child gets a word (or a picture card), hides it from the others and acts it out without speaking or pointing at things. Everyone else guesses. Use Start round to hide the word and run the timer, then tap Got it for a point or Missed to pass. For little ones, play together as one team and skip the scoreboard.",
  },
  {
    question: "Can a child who cannot read play?",
    answer: "Yes. A parent or older sibling taps for the word, reads it quietly to the actor, then presses Start round so the screen hides it. You can also print a deck and use the cards as a reading helper: the emoji on each category heading helps pre-readers pick a pile.",
  },
  {
    question: "How long should a charades round be for kids?",
    answer: "Ninety seconds suits most children aged 3 to 8, and 60 seconds is plenty for ages 9 and up. Switch the timer off for toddlers or for a mixed-age family game, so nobody feels rushed.",
  },
  {
    question: "Are these charades words safe for children?",
    answer: "Every word is family-safe: no scary, violent or adult topics, and no brand names. Ghosts and monsters are left out of the youngest age band on purpose.",
  },
  {
    question: "Can I print charades cards for a classroom or party?",
    answer: "Yes. Pick a category and age band, then press Print this deck for a sheet of every matching word. Cut it into cards and draw from a bowl. For a class, print the Ages 6–8 deck and split pupils into teams of four.",
  },
  {
    question: "Are there charades ideas for older kids and tweens?",
    answer: `Choose Ages 9–12 for ${byLevel(3)} harder prompts: two-word actions, emotions like jealous or embarrassed, and short stories to mime. For teens and adults, the main charades generator has movies, songs and harder categories.`,
  },
];

export default function KidsCharadesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Charades Generator for Kids"
      heading={["Charades Generator", "for Kids"]}
      intro={`${COUNT} kid-safe charades words, sorted by age from 3 to 12. Tap for a word, start the timer, and act it out.`}
      description={DESCRIPTION}
      updated="2026-10-27"
      faq={FAQ}
      related={[
        { href: "/charades", label: "Charades generator (all words)" },
        { href: "/charades/christmas", label: "Christmas charades" },
        { href: "/riddles-for-kids", label: "Riddles for kids" },
        { href: "/pictionary-words", label: "Pictionary words" },
      ]}
      afterTool={
        <section id="kids-charades-list" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 scroll-mt-24">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-3 text-[var(--text-primary)]">{`All ${COUNT} Charades Words for Kids`}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {KIDS_CHARADES_AGE_LABELS[1]}: {byLevel(1)} · {KIDS_CHARADES_AGE_LABELS[2]}: {byLevel(2)} · {KIDS_CHARADES_AGE_LABELS[3]}: {byLevel(3)}. Open a category to see every word with its age band.
            </p>
            <div className="space-y-4">
              {KIDS_CHARADES_CATEGORIES.map((cat) => (
                <details key={cat.id} id={`charades-${cat.id}`} className="rounded-xl border border-white/10 p-4 scroll-mt-24">
                  <summary className="cursor-pointer text-lg font-semibold text-[var(--text-primary)]">
                    {cat.emoji} {cat.label} — {byCategory(cat.id).length} words
                  </summary>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {byCategory(cat.id).map((word) => (
                      <li key={word.w} className="rounded-lg border border-white/10 p-3 text-sm">
                        <span className="text-[var(--text-secondary)]">{word.w}</span>
                        <span className="ml-2 text-xs text-[var(--text-muted)]">· {KIDS_CHARADES_AGE_LABELS[word.d]}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>
      }
      inShort={
        <>
          A free charades generator for kids: {COUNT} child-safe words in {KIDS_CHARADES_CATEGORIES.length} categories, tagged for ages 3–5, 6–8 and 9–12.
          Draw a random word, hide it when the round starts, play with a 90-second timer and optional team scores, or print the cards.
        </>
      }
      content={
        <>
          <SectionTitle>Charades for kids that match their age</SectionTitle>
          <p>
            A word that is easy for a ten-year-old can leave a four-year-old frozen. Instead of one mixed list, every word here carries an age band, so
            the deck grows with the child. <strong>Ages 3–5</strong> is single picture words with one move. <strong>Ages 6–8</strong> adds short
            actions and jobs. <strong>Ages 9–12</strong> brings in feelings with subtle faces and little stories to mime.
          </p>
          <SectionTitle>Quick tips for playing with young children</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Model one round yourself first: show a word, act it silly, and let them guess.</li>
            <li>Let the actor make animal sounds with toddlers if it keeps them playing, and only ban talking for older kids.</li>
            <li>Play as one team against the clock, not against each other, for ages 3 to 5.</li>
            <li>If a guess is close, say &quot;warmer!&quot; and let them try again; the aim is laughs, not points.</li>
            <li>Use the fullscreen button to put the timer on a TV so the whole family can watch the countdown.</li>
          </ul>
          <SectionTitle>Where to use these kids&apos; charades</SectionTitle>
          <p>
            Rainy-day play, birthday parties, classroom brain breaks, car rides and family game night all work. For a party, print the Ages 6–8 deck
            and let each child draw a card. In a classroom, try the same words as an indoor-recess game, or move on to{" "}
            <Link prefetch={false} href="/riddles-for-kids" className={linkClass}>riddles for kids</Link> and the{" "}
            <Link prefetch={false} href="/classroom-timer" className={linkClass}>classroom timer</Link>. Older players can switch to the full{" "}
            <Link prefetch={false} href="/charades" className={linkClass}>charades generator</Link>.
          </p>
        </>
      }
    >
      <CharadesGenerator deck="kids" />
    </GeneratorPageShell>
  );
}
