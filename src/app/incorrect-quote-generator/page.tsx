import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import IncorrectQuoteGenerator from "@/components/generators/IncorrectQuoteGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { QUOTES, quoteGenerator } from "@/lib/generators/incorrectQuotes";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/incorrect-quote-generator";
const TITLE = `Incorrect Quote Generator — ${QUOTES.length} Quotes, 1–6 Names`;
const DESCRIPTION = `Free incorrect quote generator: type 1 to 6 character names and get a funny dialogue with them in it. ${QUOTES.length} original templates in chaotic, wholesome and sarcastic moods. Copy or reroll.`;

const SOCIAL = generatorSocial({ card: "incorrect-quote-generator", title: TITLE, description: DESCRIPTION, alt: "Incorrect Quote Generator — funny dialogue with your own character names" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["incorrect quote generator", "incorrect quotes", "incorrect quotes generator", "funny character dialogue generator", "incorrect quotes for fanfic", "ship dialogue generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Two characters", results: quoteGenerator.generate({ chars: ["2"] }, 3, [], 61).results },
  { label: "Chaotic group of four", results: quoteGenerator.generate({ chars: ["4"], mood: ["chaotic"] }, 2, [], 62).results },
  { label: "Wholesome trio", results: quoteGenerator.generate({ chars: ["3"], mood: ["wholesome"] }, 3, [], 63).results },
];

const FAQ = [
  { question: "What are incorrect quotes?", answer: "Incorrect quotes are short, funny dialogues that fandoms write for their favourite characters, usually with the names swapped in. The characters say things they would never say in canon, and that is the joke." },
  { question: "How do I use my own character names?", answer: "Type one to six names separated by commas, for example Maya, Theo, Priya. The generator puts them into the dialogue in order. If you type fewer names than the dialogue needs, the rest are filled with neutral placeholder names." },
  { question: "How many incorrect quotes are there?", answer: `There are ${QUOTES.length} original templates: one-character monologues, two-person exchanges and group scenes for three to six characters, each tagged chaotic, wholesome or sarcastic.` },
  { question: "Are the quotes copied from anywhere?", answer: "No. Every template is written for this site and uses no real quotes, show lines or private jokes, so you can post the results anywhere." },
  { question: "Can I get the same quote again?", answer: "Results are deterministic for a given seed inside the page, and New quotes never repeats a template until the whole pool for your settings has been shown. Use Copy to keep the ones you like." },
  { question: "Is it safe for all ages?", answer: "Yes. The jokes are clean: no slurs, no sexual content and no real people. Sarcastic does not mean cruel." },
];

export default function IncorrectQuoteGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Incorrect Quote Generator"
      heading={["Incorrect Quote", "Generator"]}
      intro={`Add 1–6 character names and get a funny dialogue — ${QUOTES.length} original templates in three moods.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/headcanon-generator", label: "Headcanon generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/character-name-generator", label: "Character name generator" },
      ]}
      content={
        <>
          <SectionTitle>Dialogue for any cast, from one to six characters</SectionTitle>
          <p>
            Most incorrect quote generators only handle two names. This one writes for a lone narrator, a duo, a trio and all the way up to a
            six-person group chat, so a whole squad, team or found family can star in the same scene. Pick the cast size, type the names and
            every line is spoken by the right person.
          </p>
          <SectionTitle>Three moods</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chaotic</strong> — bad plans, wrong priorities and total confidence.</li>
            <li><strong>Wholesome</strong> — soft, caring scenes where somebody finally says the nice thing out loud.</li>
            <li><strong>Sarcastic</strong> — dry comebacks and deadpan one-liners.</li>
          </ul>
          <SectionTitle>Where to use them</SectionTitle>
          <p>
            Incorrect quotes work as posts for fan accounts, captions for edits, prompts for fanfiction and roleplay, or as warm-ups for a
            writing group. Pair them with the <Link href="/headcanon-generator" className={linkClass}>headcanon generator</Link> to flesh out the
            characters, or build a new cast with the <Link href="/random-character-generator" className={linkClass}>random character generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output, shown with placeholder names:"} sets={EXAMPLES} />
        </>
      }
    >
      <IncorrectQuoteGenerator />
    </GeneratorPageShell>
  );
}
