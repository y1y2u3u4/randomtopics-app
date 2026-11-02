import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import AcronymGenerator from "@/components/generators/AcronymGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { backronyms, makeAcronym, THEME_IDS } from "@/lib/generators/acronym";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/acronym-generator";
const TITLE = "Acronym Generator — Make an Acronym from Any Phrase or 10 Backronym Meanings";
const DESCRIPTION =
  "Free acronym generator: turn any phrase into an acronym (skip small words, add periods, keep or drop numbers), or type letters like TEAM and get 10 backronym meanings from business, funny, motivational, school and tech word lists.";

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Acronym generator — phrase to acronym and letters to backronym ideas" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["acronym generator", "acronym maker", "backronym generator", "make an acronym", "acronym from letters", "team acronym generator", "name acronym generator", "acronym creator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output with fixed inputs and seeds.
const EXAMPLES = [
  { label: "Phrase to acronym", results: ["United States of America", "Frequently Asked Questions", "Laugh Out Loud"].map((p) => ({ title: makeAcronym(p).acronym, subtitle: p })) },
  { label: "TEAM, business", results: backronyms("TEAM", ["business"], 3, 11).map((b) => ({ title: b.text, subtitle: "T-E-A-M" })) },
  { label: "CODE, funny and tech", results: backronyms("CODE", ["funny", "tech"], 3, 12).map((b) => ({ title: b.text, subtitle: "C-O-D-E" })) },
];

const FAQ = [
  {
    question: "How do I make an acronym from a phrase?",
    answer:
      "Take the first letter of each important word and join them. Type the phrase into the first mode and the acronym appears as you type: United States of America becomes USA. Switch off Skip small words if you want every word counted, or turn on periods to get U.S.A.",
  },
  {
    question: "What is the difference between an acronym and an initialism?",
    answer:
      "An acronym is read as a word (NASA, LASER), while an initialism is read letter by letter (FBI, USA). In everyday use people call both acronyms, and this tool builds the letters for either one. How you say it is up to you.",
  },
  {
    question: "What is a backronym?",
    answer:
      "A backronym works backwards: you start with the letters, or a word, and invent a phrase that fits them. TEAM can be read as Together Everyone Achieves More. The second mode does this for any letters up to twelve long and gives ten different ideas at a time.",
  },
  {
    question: "Why do small words like of and the get skipped?",
    answer:
      "Most official acronyms leave out short joining words so the result stays short, which is why the United States of America is USA and not USOA. The skipped words are listed under the result so you can see what was left out, and the option can be turned off.",
  },
  {
    question: "Can I make an acronym for my team, club or project name?",
    answer:
      "Yes. Type the name's letters in the backronym mode and pick the themes that fit: business and team for work groups, school and club for classes and societies, tech for software, motivational for goals. Re-roll until one reads well, then copy it.",
  },
  {
    question: "How are the backronym meanings chosen?",
    answer:
      "Each theme has hand-written word lists with real words for every letter from A to Z, sorted into describing words, naming words and action words. The tool arranges them in a natural order, such as describing word, naming word, action word, and avoids repeating a word across the ten ideas. The meanings are suggestions, so edit them freely.",
  },
];

export default function AcronymGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Acronym Generator"
      heading={["Acronym", "Generator"]}
      intro="This acronym generator turns any phrase into its acronym, or turns letters like TEAM into 10 backronym meanings you can copy. Free, instant and no sign-up."
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          An acronym generator builds a short code from the first letters of a phrase, or invents a phrase for letters you already have
          (a backronym). This one offers both: options for small words, periods, capitals and numbers, plus ten meanings per click from {THEME_IDS.length} themed
          word lists with a word for every letter. It is free, runs in your browser and needs no sign-up.
        </>
      }
      related={[
        { href: "/username-generator", label: "Username generator" },
        { href: "/band-name-generator", label: "Band name generator" },
        { href: "/wingding-translator", label: "Wingding translator" },
        { href: "/random-word-generator", label: "Random word generator" },
      ]}
      content={
        <>
          <SectionTitle>Two ways to make an acronym</SectionTitle>
          <p>
            Most <strong>acronym generators</strong> only shorten a phrase. This page does that in the first mode, where you control four
            things: whether short words such as &quot;of&quot; and &quot;the&quot; count, whether letters get periods, whether the result is upper
            case, and whether numbers stay in. The second mode goes the other way and is more fun for naming: give it letters and it writes
            the phrase.
          </p>
          <SectionTitle>Backronyms for teams, clubs and projects</SectionTitle>
          <p>
            A backronym makes a name feel planned. Type the letters of your team or project and choose themes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Business &amp; team</strong> — workplace words like momentum, partnership and deliver.</li>
            <li><strong>Funny</strong> — absurd food, animals and verbs for jokes, party games and nicknames.</li>
            <li><strong>Motivational</strong> — courage, resilience and rise, for goals, posters and fitness groups.</li>
            <li><strong>School &amp; club</strong> — learners, explorers and volunteers for classes, societies and sports.</li>
            <li><strong>Tech</strong> — nodes, kernels and deploy for hackathons, repos and startups.</li>
          </ul>
          <SectionTitle>Tips for acronyms that stick</SectionTitle>
          <p>
            Keep it to three to six letters, make sure it is pronounceable if you want it read as a word, and check that it does not
            already stand for something else. If the letters are the problem, change the words in the phrase rather than the order. For a
            long phrase, the skip-small-words option is usually what gets you to a length that people will remember.
          </p>
          <SectionTitle>More tools for names and codes</SectionTitle>
          <p>
            Need an online handle for the new project? Try the{" "}
            <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>. A group needs a name for the
            stage? The <Link prefetch={false} href="/band-name-generator" className={linkClass}>band name generator</Link> has ten per click. For
            a code-like look, convert your acronym with the{" "}
            <Link prefetch={false} href="/wingding-translator" className={linkClass}>Wingding translator</Link>, or grab a spare idea from the{" "}
            <Link prefetch={false} href="/random-word-generator" className={linkClass}>random word generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from both modes:"} sets={EXAMPLES} />
        </>
      }
    >
      <AcronymGenerator />
    </GeneratorPageShell>
  );
}
