import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import VampireNameGenerator from "@/components/generators/VampireNameGenerator";
import { VAMPIRE_FIRST, VAMPIRE_PLACES, VAMPIRE_SURNAMES, vampireGenerator } from "@/lib/generators/vampire";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/vampire-name-generator";
const TITLE = `Vampire Name Generator — ${VAMPIRE_FIRST.length} First Names, ${VAMPIRE_SURNAMES.length} Surnames & Titles`;
const DESCRIPTION = `Free vampire name generator: ${VAMPIRE_FIRST.length} first names, ${VAMPIRE_SURNAMES.length} surnames and noble titles with ${VAMPIRE_PLACES.length} domains, such as Countess Seraphina Valcourt of Ravenmoor. Filter by gender and classic gothic, modern or ancient style.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Vampire Name Generator — gothic, modern and ancient vampire names" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["vampire name generator", "vampire names", "female vampire names", "male vampire names", "gothic vampire names", "vampire last names", "vampire title generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Classic gothic with titles", results: vampireGenerator.generate({ style: ["classic"], format: ["title"] }, 4, [], 81).results },
  { label: "Modern", results: vampireGenerator.generate({ style: ["modern"] }, 4, [], 82).results },
  { label: "Ancient", results: vampireGenerator.generate({ style: ["ancient"], format: ["title"] }, 4, [], 83).results },
];

const FAQ = [
  {
    question: "What makes a good vampire name?",
    answer:
      "Soft consonants, long vowels and a hint of old Europe usually work, like Lucian or Seraphina. A surname with a place or weather feel, such as Ravenscroft or Valcourt, adds to it. Modern vampires often use short, sleek names that could pass in a city; ancient ones use names from older worlds.",
  },
  {
    question: "What are the three styles?",
    answer:
      "Classic gothic leans on Victorian and Eastern European sounds. Modern gives street-smart, contemporary names. Ancient draws on Egyptian, Greek, Roman and Mesopotamian sounds, which suits vampires who have lived for thousands of years.",
  },
  {
    question: "How do the titles work?",
    answer:
      "Choose the With title format and each result adds a noble rank and a domain, such as Countess Ophelia Ashgrave of Hollowmere. Titles match the gender filter (Count, Countess, or a neutral rank like Archon), and every domain has a short description to use in your story.",
  },
  {
    question: "Can I get only female or male vampire names?",
    answer:
      "Yes. The gender filter gives male, female or gender-neutral first names, and you can select more than one. Gender and style combine freely.",
  },
  {
    question: "Are the names original?",
    answer:
      "Yes. They are written for this tool in familiar gothic and mythic styles, not copied from a film, book or game, so you can use them for characters, role-play, tabletop campaigns and fiction.",
  },
  {
    question: "Can I use these as a username or character name?",
    answer:
      "Absolutely. The first-name-only format is a quick way to find a handle, and the full format gives a complete character name. If a result is taken in your game or platform, roll again.",
  },
];

export default function VampireNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Vampire Name Generator"
      heading={["Vampire Name", "Generator"]}
      intro={`${VAMPIRE_FIRST.length} first names, ${VAMPIRE_SURNAMES.length} surnames and noble titles with ${VAMPIRE_PLACES.length} domains — classic gothic, modern or ancient.`}
      description={DESCRIPTION}
      updated="2026-10-22"
      faq={FAQ}
      related={[
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
      ]}
      content={
        <>
          <SectionTitle>Names that sound centuries old</SectionTitle>
          <p>
            A <strong>vampire name</strong> has to carry a little menace and a lot of history. This generator pairs a first name with a
            surname from the same era, so Lucian never ends up beside a surname that sounds like a footballer. Add a noble title and a
            domain and you get a complete introduction a character could use at a masquerade.
          </p>
          <SectionTitle>Pick a style</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Classic gothic</strong> — candle-lit Victorian and Eastern European sounds: Alaric, Isolde, Ravenscroft.</li>
            <li><strong>Modern</strong> — short, sleek names for city vampires: Dante, Nova, Sinclair.</li>
            <li><strong>Ancient</strong> — names from Egypt, Greece, Rome and Mesopotamia for the oldest of the old: Khenti, Zenobia, Aurelianus.</li>
          </ul>
          <SectionTitle>Titles and domains</SectionTitle>
          <p>
            Switch the format to <em>With title</em> to give your vampire a rank and a home. Male names get ranks like Count or Baron, female
            names get Countess or Baroness, and neutral names get rank-free options such as Archon or Warden. Each domain, from a fog-bound
            moor to a ballroom open only after sunset, comes with a one-line description you can lift straight into a scene.
          </p>
          <p>
            Building a whole cast? The <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> covers
            other genres, and the <Link prefetch={false} href="/last-name-generator" className={linkClass}>last name generator</Link> is handy for the
            humans they hunt.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output in each style:"} sets={EXAMPLES} />
        </>
      }
    >
      <VampireNameGenerator />
    </GeneratorPageShell>
  );
}
