import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import LetterGenerator from "@/components/generators/LetterGenerator";
import QuickSet, { QuickRow } from "@/components/generators/QuickSet";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-letter-generator";
const TITLE = "Random Letter Generator — Pick a Letter A–Z, No Repeats";
const DESCRIPTION =
  "Free random letter generator: pick one or several random letters from A to Z, uppercase or lowercase, vowels only, consonants only, or without hard letters like Q, X and Z. No repeats until every letter is drawn.";

const SOCIAL = generatorSocial({ card: "random-letter-generator", title: TITLE, description: DESCRIPTION, alt: "Random Letter Generator — colorful alphabet blocks" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random letter generator", "random letter", "letter picker", "random alphabet generator", "pick a random letter", "random letter a-z"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the random letter generator work?",
    answer:
      "Press Generate to draw a letter from A to Z. Every letter has the same chance, and a letter won't come up again until all the letters in your set have been drawn — just like pulling tiles from a bag.",
  },
  {
    question: "Can I leave out hard letters like Q, X and Z?",
    answer:
      "Yes. Choose 'No hard letters' to drop Q, X, Z, J, K, V and Y, which start very few English words. That keeps games like Scattergories and categories fair.",
  },
  {
    question: "Can I draw several letters at once?",
    answer:
      "Yes — choose how many (up to all 26) and the letters come out in random order with no duplicates. Draw all 26 to get a shuffled alphabet.",
  },
  {
    question: "What can I use random letters for?",
    answer:
      "Word games (Scattergories, Categories, Stop/Basta), alphabet practice with kids, spelling bees, naming challenges, random initials for characters and picking a letter for 'a word that starts with…' prompts.",
  },
  {
    question: "How do I pick a random letter from A to Z?",
    answer: "Press Generate (or tap the Random letter A–Z button, or press Space). One letter appears in large type, and the link in your address bar keeps that result, so you can send the same letter to a friend.",
  },
  {
    question: "Is there a random vowel or random consonant generator?",
    answer: "Yes. Tap Vowel to draw from A, E, I, O and U, or Consonant to draw from the other 21 letters. Y counts as a consonant here. Change How many to draw several at once; none repeats until the whole set has been used.",
  },
  {
    question: "Which random letter should I use for Scattergories or Stop?",
    answer: "Tap Scattergories to draw from the 19 letters that are not Q, X, Z, J, K, V or Y, so every round has plenty of answers. If your group wants a challenge, switch to All 26 and accept the hard ones.",
  },
  {
    question: "Why did I get the same letter twice?",
    answer: "A letter cannot come back until every letter in the current set has been drawn. A repeat means either you switched the letter set, which starts a fresh bag, or the whole set was used up and the bag refilled.",
  },
];

export default function RandomLetterGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Letter Generator"
      heading={["Random Letter", "Generator"]}
      intro="Pick a random letter from A to Z — or several, with no repeats. Uppercase or lowercase, vowels, consonants or no hard letters."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Tap Generate or press Space to draw one random letter from A to Z. Quick buttons give a random vowel, a random consonant, a Scattergories-friendly letter without hard letters, or a shuffled alphabet. No letter repeats until the whole set is used, the last draws stay in a history, and the result link can be shared. Free, no signup."
      related={[
        { href: "/spin-the-wheel", label: "Spin the wheel" },
        { href: "/random-word-generator", label: "Random word generator" },
        { href: "/random-number-generator", label: "Random number generator" },
        { href: "/charades", label: "Charades generator" },
        { href: "/random-animal-generator", label: "Random animal generator" },
        { href: "/question-of-the-day-for-students", label: "Question of the day for students" },
      ]}
      content={
        <>
          <SectionTitle>A fair letter, every time</SectionTitle>
          <p>
            This <strong>random letter generator</strong> works like a bag of alphabet tiles: each draw is random, and a letter only comes back
            once the whole set has been used. Draw one letter for a round of Scattergories, five letters for a word-building challenge, or all
            26 for a shuffled alphabet.
          </p>
          <SectionTitle>Options</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>All 26</strong>, <strong>vowels</strong>, <strong>consonants</strong>, or <strong>no hard letters</strong> (Q X Z J K V Y).</li>
            <li><strong>UPPERCASE</strong> or <strong>lowercase</strong> — handy for early-reading practice.</li>
            <li>Each letter shows its NATO phonetic word (Alfa, Bravo, Charlie…) so it&apos;s clear when read aloud.</li>
          </ul>
          <SectionTitle>Classroom and game ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Categories</strong> — draw a letter, then everyone names an animal, a country and a food starting with it. Pair it with the <Link prefetch={false} href="/random-animal-generator" className={linkClass}>random animal generator</Link> to check answers.</li>
            <li><strong>Alphabet hunt</strong> — young learners find an object in the room that starts with the letter.</li>
            <li><strong>Story challenge</strong> — every sentence must start with the next drawn letter.</li>
          </ul>
          <SectionTitle>Random letter A–Z</SectionTitle>
          <p>
            Need one fair letter? Every one of the 26 letters has the same 1-in-26 chance. Draw with the button above or press Space. The History line under the tile
            shows your last draws, so nobody can argue about what came up two rounds ago.
          </p>
          <QuickRow><QuickSet tool="letters" id="any">Draw a random letter</QuickSet></QuickRow>
          <SectionTitle>Random vowel or random consonant</SectionTitle>
          <p>
            English has 5 vowels (A, E, I, O, U) and 21 consonants, with Y counted as a consonant on this page. Draw a vowel when you are building a word and have too many
            consonants, or a consonant to balance a Countdown-style word round. Draw several and you get a mixed hand with no repeats.
          </p>
          <QuickRow>
            <QuickSet tool="letters" id="vowel">Random vowel</QuickSet>
            <QuickSet tool="letters" id="consonant">Random consonant</QuickSet>
          </QuickRow>
          <SectionTitle>Random letter for Scattergories and Stop</SectionTitle>
          <p>
            Hard letters ruin a round: nobody can name a country, a food and an animal that all start with X. The Scattergories button draws from 19 letters and leaves out
            Q, X, Z, J, K, V and Y. Example round with the letter <strong>M</strong>, categories animal, country, food, name: monkey, Mexico, mango, Maria. Set a
            timer of one or two minutes, then score only answers nobody else wrote down.
          </p>
          <QuickRow><QuickSet tool="letters" id="scattergories">Draw a Scattergories letter</QuickSet></QuickRow>
          <SectionTitle>Shuffle the whole alphabet</SectionTitle>
          <p>
            Draw all 26 and you get the alphabet in random order. Use it as a turn order for A-to-Z games (name a food for each letter in the shuffled order), as a
            flash-card deck for letter practice, or as a fair way to assign a letter to each of 26 players.
          </p>
          <QuickRow><QuickSet tool="letters" id="alphabet">Shuffle A–Z</QuickSet></QuickRow>
          <SectionTitle>How many letters are in each set?</SectionTitle>
          <table className="w-full text-left text-sm border-collapse">
            <thead><tr className="border-b border-white/10"><th className="py-1.5 pr-3">Set</th><th className="py-1.5 pr-3">Letters</th><th className="py-1.5">Chance of one letter</th></tr></thead>
            <tbody>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3">All 26</td><td className="pr-3">26</td><td>1 in 26</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3">No hard letters</td><td className="pr-3">19</td><td>1 in 19</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3">Vowels</td><td className="pr-3">5</td><td>1 in 5</td></tr>
              <tr><td className="py-1.5 pr-3">Consonants</td><td className="pr-3">21</td><td>1 in 21</td></tr>
            </tbody>
          </table>
          <p>
            Need a category to go with your letter? <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>Spin the wheel</Link> for a topic, or get a
            word with the <Link prefetch={false} href="/random-word-generator" className={linkClass}>random word generator</Link>. For digits instead of letters, use the{" "}
            <Link prefetch={false} href="/random-number-generator" className={linkClass}>random number generator</Link>.
          </p>
        </>
      }
    >
      <LetterGenerator />
    </GeneratorPageShell>
  );
}
