import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import BingoCardGenerator from "@/components/generators/BingoCardGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import { BINGO_THEMES } from "@/data/bingoThemes";

const PATH = "/bingo-card-generator";
const TITLE = "Bingo Card Generator — Free Printable Bingo Card Templates (Christmas Too)";
const DESCRIPTION =
  "Free bingo card generator: pick a printable bingo card template (Christmas, holiday party, baby shower, 1–75 numbers or blank), shuffle up to 100 unique cards and print 1, 2 or 4 per page. No sign-up, no watermark.";

const SOCIAL = generatorSocial({ card: "bingo-card-generator", title: TITLE, description: DESCRIPTION, alt: "Bingo Card Generator — a Christmas bingo card with daubers and bingo balls" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["bingo card template", "bingo card generator", "printable bingo cards", "christmas bingo cards", "free bingo card maker", "blank bingo card", "custom bingo cards", "bingo cards 1-75"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I make my own bingo cards for free?",
    answer: "Pick a template or paste your own words (one per line), choose 3×3, 4×4 or 5×5, set how many cards you need and press Shuffle. Every card gets its own random order. Press Print / save PDF to print them or keep a PDF. Nothing to sign up for and no watermark.",
  },
  {
    question: "Is there a free printable Christmas bingo card template?",
    answer: "Yes. The Christmas template fills each card with 40 holiday words (Santa, reindeer, candy cane, ugly sweater…) in red and green. There is also Christmas movie bingo, holiday party bingo and winter bingo. Print 1, 2 or 4 cards on a letter page.",
  },
  {
    question: "Are the bingo cards all different?",
    answer: "Yes, as long as your list is longer than the number of squares. Each card is shuffled from your list with a secure random generator and duplicates are re-drawn, so no two cards in a batch are the same. A 5×5 card needs at least 24 words; 30 or more gives more variety.",
  },
  {
    question: "How many cards can I print at once?",
    answer: "Up to 100 cards per batch, 1, 2 or 4 to a page. Each card is numbered (Card #1, #2…) so you can check a winner, and you can add a caller's checklist page that lists every word or number to tick off.",
  },
  {
    question: "Can I make 1–75 number bingo cards?",
    answer: "Yes. Choose Numbers 1–75 for standard American bingo: B is 1–15, I is 16–30, N is 31–45, G is 46–60 and O is 61–75, with a free center square. The built-in caller draws the numbers in random order with no repeats.",
  },
  {
    question: "How do I get a blank bingo card template?",
    answer: "Choose Blank template, pick the grid size and print. You get empty squares with a title bar, ready for players to write their own words, which works well for classroom review or a road trip.",
  },
  {
    question: "Can I play bingo online instead of printing?",
    answer: "Yes. Tap squares on the preview card to mark them — the card announces BINGO when you complete a row, column or diagonal. Use the bingo caller underneath to draw calls one at a time and share your screen on a video call.",
  },
];

export default function BingoCardGeneratorPage() {
  const christmas = BINGO_THEMES[0];
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Bingo Card Generator"
      heading={["Bingo Card", "Generator"]}
      intro="Printable bingo card templates — Christmas, parties, showers, numbers or blank. Shuffle unique cards and print."
      description={DESCRIPTION}
      updated="2026-11-01"
      faq={FAQ}
      hero={{ src: "/generators/hero/bingo.webp", alt: "Christmas bingo card with red and green daubers, bingo balls and holly", className: "mx-auto mb-5 h-24 sm:h-36 w-auto rounded-2xl" }}
      heroHideOnShort
      inShort={
        <>
          A free bingo card generator with {BINGO_THEMES.length} ready-made templates (Christmas, Christmas movie, holiday party, winter, baby shower, meeting and more), 1–75 number cards and a blank
          template. Choose 3×3, 4×4 or 5×5, shuffle up to 100 unique numbered cards and print 1, 2 or 4 per page or save a PDF — no sign-up and no watermark. A built-in caller draws words or
          numbers with no repeats.
        </>
      }
      related={[
        { href: "/random-word-generator", label: "Random word generator" },
        { href: "/random-number-generator", label: "Random number generator" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/most-likely-to", label: "Most likely to questions" },
        { href: "/charades", label: "Charades ideas" },
        { href: "/trivia-questions", label: "Trivia questions" },
      ]}
      content={
        <>
          <SectionTitle>How to make printable bingo cards</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Pick a template</strong> — or paste your own words, names or inside jokes, one per line.</li>
            <li><strong>Choose the grid</strong> — 5×5 with a free center is classic; 3×3 and 4×4 are quicker for young kids and short games.</li>
            <li><strong>Set the number of cards</strong> — one per player, plus a couple of spares — and press Shuffle.</li>
            <li><strong>Print or save as PDF</strong> — 1 card per page for big squares, 2 for parties, 4 to save paper. Add the caller&apos;s checklist so the host can tick off each call.</li>
          </ol>

          <SectionTitle>Christmas bingo card template</SectionTitle>
          <p>
            The Christmas template is the default this season: a red-and-green card with a star free space, drawn from {christmas.words.length} holiday words such as{" "}
            {christmas.words.slice(0, 8).join(", ")}. Switch to <strong>Christmas movie bingo</strong> for a film night (snow starts falling, ugly sweater, a mistletoe kiss…) or{" "}
            <strong>Holiday party bingo</strong> for the office party and Secret Santa. The <strong>Ink saver</strong> style prints in black and white if your printer is low on color.
          </p>

          <SectionTitle>Which bingo template for which event</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-[var(--text-muted)]"><th className="py-2 pr-3">Event</th><th className="py-2 pr-3">Template</th><th className="py-2">Tip</th></tr>
              </thead>
              <tbody className="[&_td]:py-2 [&_td]:pr-3 [&_tr]:border-t [&_tr]:border-white/10">
                <tr><td>Family Christmas</td><td>Christmas, 5×5</td><td>Call words while opening presents or watching a movie.</td></tr>
                <tr><td>Office holiday party</td><td>Holiday party</td><td>Players mark what they spot during the party; first full row wins.</td></tr>
                <tr><td>Baby or bridal shower</td><td>Baby / bridal shower</td><td>Mark gifts as they are opened.</td></tr>
                <tr><td>Classroom</td><td>Sight words or blank, 3×3–4×4</td><td>Smaller grids finish faster; blank cards let students write review words.</td></tr>
                <tr><td>Team meeting or video call</td><td>Meeting or Find someone who</td><td>Play on screen and use the caller — no printing needed.</td></tr>
                <tr><td>Classic number game</td><td>Numbers 1–75</td><td>B-I-N-G-O columns with the standard ranges and a caller sheet.</td></tr>
              </tbody>
            </table>
          </div>

          <SectionTitle>Bingo rules in one minute</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Everyone gets a different card. The free center square counts as already marked.</li>
            <li>The caller reads one word or number at a time; players mark it if it is on their card.</li>
            <li>The first player with a full row, column or diagonal shouts <strong>Bingo!</strong> The caller checks the card number against the checklist.</li>
            <li>Variations: four corners, an X, or blackout (every square) for a longer game.</li>
          </ul>
          <p>
            Need a winner for a raffle instead? Spin the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link>. For a party game that needs no cards, try{" "}
            <Link prefetch={false} href="/charades" className={linkClass}>charades ideas</Link> or <Link prefetch={false} href="/most-likely-to" className={linkClass}>most likely to questions</Link>.
          </p>
        </>
      }
    >
      <BingoCardGenerator />
    </GeneratorPageShell>
  );
}
