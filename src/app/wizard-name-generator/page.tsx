import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WizardNameGenerator from "@/components/generators/WizardNameGenerator";
import { WIZARD_EPITHETS, WIZARD_NAMES, wizardGenerator } from "@/lib/generators/wizard";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/wizard-name-generator";
const TITLE = `Wizard Name Generator — ${WIZARD_NAMES.length} Wizard Names with Meanings & Epithets`;
const DESCRIPTION = `Free wizard name generator: ${WIZARD_NAMES.length} wizard, witch and sorcerer names with meanings, plus ${WIZARD_EPITHETS.length} epithets like "the Archivist" with a backstory. Filter by school of magic (elemental, arcane, necromancer, druid, illusionist) and gender.`;

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "Wizard Name Generator — names by school of magic" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["wizard name generator", "wizard names", "female wizard names", "sorcerer name generator", "witch name generator", "mage names", "dnd wizard names", "necromancer names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Elemental mages", results: wizardGenerator.generate({ school: ["elemental"] }, 4, [], 91).results },
  { label: "Necromancers", results: wizardGenerator.generate({ school: ["necromancer"] }, 4, [], 92).results },
  { label: "Witches & druids", results: wizardGenerator.generate({ school: ["druid", "illusionist"], gender: ["female"] }, 4, [], 93).results },
];

const FAQ = [
  {
    question: "What is a good wizard name?",
    answer:
      "A good wizard name sounds old, is easy to say aloud and hints at the magic the character uses. A Latin- or Greek-sounding first name plus an epithet earned from a deed (\"the Starreader\", \"Ashcloak\") works well. Every result here comes with what the name means and the story behind the epithet.",
  },
  {
    question: "How does the wizard name generator work?",
    answer:
      "Each first name joins a root tied to a school of magic (Ignar = fire, Noct = night, Quer = oak, Mir = mirror) to an ending such as -ius (keeper), -ara or -essa (seeker). The epithet is drawn from a list written for the same school, so a necromancer never ends up \"the Green\".",
  },
  {
    question: "Can I generate witch or female wizard names?",
    answer:
      "Yes. Set the gender filter to female for names like Velessa, Lunine or Runessa, or choose neutral for names that fit anyone. Druid and illusionist names with the female filter make good witch names.",
  },
  {
    question: "Which school of magic should I pick?",
    answer:
      "Elemental for battle mages who throw fire and lightning, Arcane scholar for book-learned wizards and librarians, Necromancer for death and shadow magic, Druid for nature casters and hedge witches, Illusionist for tricksters, court magicians and enchanters. Select several to mix them.",
  },
  {
    question: "Are these names taken from Harry Potter or Lord of the Rings?",
    answer:
      "No. Every name and epithet is original. They use the same old-world style readers expect from wizards, but they don't copy any book or game, so you can use them in D&D campaigns, novels and games.",
  },
  {
    question: "Can I use these for D&D wizards, sorcerers and warlocks?",
    answer:
      "Yes. Wizards, sorcerers and warlocks all suit these names. Necromancer and illusionist names fit the D&D schools of the same name, and an epithet makes a good title for an NPC archmage or a villain.",
  },
];

export default function WizardNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Wizard Name Generator"
      heading={["Wizard Name", "Generator"]}
      intro={`${WIZARD_NAMES.length} wizard names with meanings and ${WIZARD_EPITHETS.length} epithets with backstories. Choose a school of magic and gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A wizard name generator gives you names for mages, witches and sorcerers. This one sorts names by five schools of magic, shows what
          each name means (Lichius = &quot;corpse keeper&quot;), and adds an epithet with a one-line backstory, such as &quot;Gravewhisper:
          hears the dead talking under the ground&quot;. Free, no sign-up, with copy and save.
        </>
      }
      related={[
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/username-generator", label: "Username generator" },
        { href: "/elf-name-generator", label: "Elf name generator" },
        { href: "/orc-name-generator", label: "Orc name generator" },
      ]}
      content={
        <>
          <SectionTitle>A name, a meaning and a legend</SectionTitle>
          <p>
            A <strong>wizard&apos;s name</strong> usually does two jobs: it sounds ancient, and it tells you what the wizard does. Every
            result here shows both. The first name is built from a root for that school of magic, and the epithet is a title with a short
            legend, like a fire mage who is called Ashcloak because their robe smoulders but never burns. Use the legend as an
            NPC&apos;s first line or a chapter&apos;s opening.
          </p>
          <SectionTitle>Five schools of magic</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Elemental</strong> — fire, water, wind, storm and ice. Names like Ignarius and Fulgis.</li>
            <li><strong>Arcane scholar</strong> — runes, books and stars. Names like Lexan, Codexus and Astren.</li>
            <li><strong>Necromancer</strong> — night, bone and the grave. Names like Morteth and Noctelle.</li>
            <li><strong>Druid</strong> — oak, moon and wild things. Names like Querwyn and Silvorin; good for witches too.</li>
            <li><strong>Illusionist</strong> — mirrors, dreams and veils. Names like Velessa and Somneth.</li>
          </ul>
          <SectionTitle>Tips for naming a wizard</SectionTitle>
          <p>
            Wizards often go by their epithet more than their name: the town knows &quot;the Archivist&quot;, only friends know Scribine.
            Generate a few and keep one name and a different epithet if the combination you want doesn&apos;t appear. Naming apprentices? Use
            the same school so the names sound like they belong to one tower. For other races and roles, the{" "}
            <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link> covers the whole
            party, and the <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link> turns a
            wizard theme into a gamer tag.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each school:"} sets={EXAMPLES} />
        </>
      }
    >
      <WizardNameGenerator />
    </GeneratorPageShell>
  );
}
