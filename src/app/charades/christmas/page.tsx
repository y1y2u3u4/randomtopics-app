import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CharadesGenerator from "@/components/CharadesGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { CHRISTMAS_CHARADES_WORDS, CHRISTMAS_CHARADES_CATEGORIES } from "@/data/charadesChristmas";

const PATH = "/charades/christmas";
const COUNT = CHRISTMAS_CHARADES_WORDS.length;
const TITLE = `Christmas Charades — ${COUNT} Holiday Words, Movies & Songs to Act Out`;
const DESCRIPTION = `${COUNT} Christmas charades words in ${CHRISTMAS_CHARADES_CATEGORIES.length} categories: holiday movies, carols, traditions, characters and winter actions, tagged easy to hard. Random word generator with a timer, team scores and printable cards.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "christmas charades", "christmas charades ideas", "christmas charades words", "christmas charades for kids",
    "holiday charades", "christmas movie charades", "christmas charades generator",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const byCategory = (id: string) => CHRISTMAS_CHARADES_WORDS.filter((w) => w.c === id);
const byLevel = (d: number) => CHRISTMAS_CHARADES_WORDS.filter((w) => w.d === d).length;

const FAQ = [
  {
    question: "What are good Christmas charades ideas?",
    answer: "Pick things with a clear action: decorating the tree, wrapping a present, building a snowman, ice skating or Santa squeezing down a chimney. Holiday movies and carols make great medium and hard rounds because the actor has to split the title into words. Every word here is tagged easy, medium or hard.",
  },
  {
    question: "Are these Christmas charades OK for kids?",
    answer: "Yes. Every word is family-safe. Set difficulty to Easy for young children — reindeer, snowball fight, opening presents — and give them 90 or 120 seconds, or switch the timer off.",
  },
  {
    question: "How do you play Christmas charades?",
    answer: "Split into two teams. The actor draws a word, presses Start round to hide it, and acts it out silently while their team guesses before time runs out. Tap Got it for a point or Missed to pass, and the turn moves to the next team. Use the classic gestures: fingers for the number of words, a camera crank for a movie, and a cupped ear for 'sounds like'.",
  },
  {
    question: "How do I act out a Christmas movie or song title?",
    answer: "Signal the category first — crank a camera for a film, or mime singing for a carol — then hold up fingers for the number of words. Act the easiest word first; for 'Jingle Bells', shaking a bell is usually enough.",
  },
  {
    question: "Can I print Christmas charades cards?",
    answer: "Yes. Choose a category and difficulty, then press Print this deck for a sheet of every matching word. Cut them into cards and draw them from a stocking or a Santa hat.",
  },
  {
    question: "What else can we play at a Christmas party?",
    answer: "Alternate charades rounds with Christmas trivia: the trivia page has a host mode with a timer and a scoreboard for up to eight teams, so the same teams can keep playing.",
  },
];

export default function ChristmasCharadesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Christmas Charades"
      heading={["Christmas", "Charades"]}
      intro={`${COUNT} Christmas charades words: holiday movies, carols, traditions and winter fun. Tap for a random word, start the timer and act it out.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/trivia-questions/christmas", label: "Christmas trivia" },
        { href: "/charades", label: "Charades generator (all words)" },
        { href: "/pictionary-word-generator", label: "Pictionary words" },
        { href: "/topics/questions-to-ask-at-a-party", label: "Questions to ask at a party" },
      ]}
      afterTool={
        <section id="christmas-charades-list" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 scroll-mt-24">
          <div className="glass-card p-6 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-3 text-[var(--text-primary)]">{`All ${COUNT} Christmas Charades Words`}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Easy {byLevel(1)} · Medium {byLevel(2)} · Hard {byLevel(3)}. Open a category to see every word with its difficulty.
            </p>
            <div className="space-y-4">
              {CHRISTMAS_CHARADES_CATEGORIES.map((cat) => (
                <details key={cat.id} id={`charades-${cat.id}`} className="rounded-xl border border-white/10 p-4 scroll-mt-24">
                  <summary className="cursor-pointer text-lg font-semibold text-[var(--text-primary)]">
                    {cat.emoji} {cat.label} — {byCategory(cat.id).length} words
                  </summary>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {byCategory(cat.id).map((word) => (
                      <li key={word.w} className="rounded-lg border border-white/10 p-3 text-sm">
                        <span className="text-[var(--text-secondary)]">{word.w}</span>
                        <span className="ml-2 text-xs text-[var(--text-muted)]">· {word.d === 1 ? "Easy" : word.d === 2 ? "Medium" : "Hard"}</span>
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
          {COUNT} Christmas charades words in {CHRISTMAS_CHARADES_CATEGORIES.length} categories, from easy kids&apos; actions to hard movie and
          carol titles. Draw a random word, hide it when the round starts, and keep score for 2 to 4 teams.
        </>
      }
      content={
        <>
          <SectionTitle>A Christmas charades game that runs itself</SectionTitle>
          <p>
            Writing <strong>Christmas charades ideas</strong> on slips of paper takes longer than the game. Here the deck is ready: hand the
            phone to the actor, tap for a word, then press Start round so the answer disappears and the countdown begins. The scoreboard tracks
            whose turn it is, and fullscreen mode puts the timer on the TV for the whole room.
          </p>
          <SectionTitle>Tips for a holiday charades night</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Start with an easy round so kids and grandparents warm up together, then move to movies and carols.</li>
            <li>Agree before you start which holiday films everyone knows; pass any title nobody in the room has seen.</li>
            <li>Give 90 seconds for titles and 60 for actions, and let the losing team pick the next category.</li>
            <li>For a printed game, print a deck and draw the cards from a stocking.</li>
          </ul>
          <p>
            Between rounds, switch to <Link href="/trivia-questions/christmas" className={linkClass}>Christmas trivia</Link> with the same
            teams, or play the full year-round <Link href="/charades" className={linkClass}>charades generator</Link> once the holiday deck is
            used up.
          </p>
        </>
      }
    >
      <CharadesGenerator deck="christmas" />
    </GeneratorPageShell>
  );
}
