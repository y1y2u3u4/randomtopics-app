import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ElfNameGenerator from "@/components/generators/ElfNameGenerator";
import { ELF_FIRST, ELF_HOUSES, elfGenerator } from "@/lib/generators/elf";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/elf-name-generator";
const TITLE = `Elf Name Generator — ${ELF_FIRST.length} Names & ${ELF_HOUSES.length} Houses by Elf Type`;
const DESCRIPTION = `Free elf name generator: ${ELF_FIRST.length} first names and ${ELF_HOUSES.length} family house names with meanings. Filter by high elf, wood elf, dark elf (drow) or sea elf, and by gender. Original names for D&D and fantasy writing.`;

const SOCIAL = generatorSocial({ card: "dnd-name-generator", title: TITLE, description: DESCRIPTION, alt: "Elf Name Generator — names for high, wood, dark and sea elves" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["elf name generator", "elf names", "female elf names", "male elf names", "dark elf name generator", "wood elf names", "high elf names", "elf family names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "High elves", results: elfGenerator.generate({ type: ["high"] }, 4, [], 71).results },
  { label: "Dark elves", results: elfGenerator.generate({ type: ["dark"], gender: ["female"] }, 4, [], 72).results },
  { label: "Wood and sea elves", results: elfGenerator.generate({ type: ["wood", "sea"] }, 4, [], 73).results },
];

const FAQ = [
  {
    question: "How are the elf names made?",
    answer:
      "Each first name is built from small word-parts in a flowing elven style, and its meaning is written out in the result: for example, a name built from words for song and oak. Family house names work the same way, so you can read what a name says about its owner.",
  },
  {
    question: "What is the difference between high, wood, dark and sea elf names?",
    answer:
      "High elf names are long and bright with star and sun imagery. Wood elf names borrow from leaves, bark and animals. Dark elf (drow) names sound sharper and darker, with night, silk and shadow roots. Sea elf names lean on tide, pearl and shell sounds.",
  },
  {
    question: "Are these names from The Lord of the Rings or D&D?",
    answer:
      "No. They are original and invented for this tool. They follow the genre's conventions, so they feel at home in D&D, Pathfinder and your own stories, without borrowing existing characters.",
  },
  {
    question: "Can I generate male or female elf names?",
    answer:
      "Yes. The gender filter gives male, female or gender-neutral first names, and you can combine them. Elf type and gender filters work together, such as female dark elf names or male wood elf names.",
  },
  {
    question: "What are elf house names?",
    answer:
      "Many elves are known by a house or family name in addition to their given name. Here each house name has a meaning and a type, so a wood elf is paired with a woodland house and a sea elf with a coastal one, keeping the pair believable.",
  },
  {
    question: "Can I get just a first name?",
    answer:
      "Yes. Set the name style to First name only to skip the house name. That is handy for NPCs and spirits, or settings where elves do not use family names.",
  },
];

export default function ElfNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Elf Name Generator"
      heading={["Elf Name", "Generator"]}
      intro={`${ELF_FIRST.length} elf first names and ${ELF_HOUSES.length} house names with meanings — filter by elf type and gender.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/gnome-name-generator", label: "Gnome name generator" },
      ]}
      content={
        <>
          <SectionTitle>Elf names with meanings you can read</SectionTitle>
          <p>
            Most <strong>elf name generators</strong> hand you a string of pretty syllables and leave you guessing. Here every first name is
            assembled from word-parts, and the meaning is shown with the result, so a name like one meaning "song of the oak" tells you who
            the character is before you write a word about them. Family houses carry a meaning as well, so the full name reads as a small
            piece of worldbuilding.
          </p>
          <SectionTitle>Pick an elf type</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>High elves</strong> — graceful, scholarly and proud, with names that glitter like starlight.</li>
            <li><strong>Wood elves</strong> — woodland hunters and wardens with names drawn from leaves, branches and animals.</li>
            <li><strong>Dark elves (drow)</strong> — underground, scheming and sleek, with names that sound like shadow and silk.</li>
            <li><strong>Sea elves</strong> — coastal and deep-water folk, with names of tide, pearl and spray.</li>
          </ul>
          <p>
            Each type has its own pool of first names and its own set of houses, so the output stays believable without you checking
            every pairing. Combine types to cover a mixed party or a mixed court.
          </p>
          <SectionTitle>Tips for naming an elf character</SectionTitle>
          <p>
            Elves live for centuries, so many fantasy settings give them more than one name: a birth name, a name earned in service, and a
            house name. Use the first name here for the birth name, then roll a few more and keep your favourite as an epithet. If your elf
            will share a table with other races, the <Link href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link>{" "}
            covers dwarves, halflings and more, and the <Link href="/character-name-generator" className={linkClass}>character name
            generator</Link> works for any setting.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each elf type:"} sets={EXAMPLES} />
        </>
      }
    >
      <ElfNameGenerator />
    </GeneratorPageShell>
  );
}
