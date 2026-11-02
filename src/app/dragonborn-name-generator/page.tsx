import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import DragonbornNameGenerator from "@/components/generators/DragonbornNameGenerator";
import CompareTable, { no, yes } from "@/components/generators/CompareTable";
import { CHILDHOOD_NAMES, DRAGONBORN_CLANS, DRAGONBORN_NAMES, dragonbornGenerator } from "@/lib/generators/dragonborn";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/dragonborn-name-generator";
const TITLE = `Dragonborn Name Generator (5e) — ${DRAGONBORN_NAMES.length} Names & ${DRAGONBORN_CLANS.length} Clans with Meanings`;
const DESCRIPTION = `Free D&D 5e dragonborn name generator: ${DRAGONBORN_NAMES.length} male, female and neutral dragonborn names, ${DRAGONBORN_CLANS.length} clan names and ${CHILDHOOD_NAMES.length} childhood nicknames, each with its meaning. Filter by chromatic, metallic or gem ancestry. Clan name first, as dragonborn custom demands.`;

const SOCIAL = generatorSocial({ card: "dnd-name-generator", title: TITLE, description: DESCRIPTION, alt: "Dragonborn Name Generator — dragonborn names and clans with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["dragonborn name generator", "dragonborn names", "dnd dragonborn names", "female dragonborn names", "dragonborn clan names", "5e dragonborn name generator", "dragonborn paladin names", "gem dragonborn names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Metallic dragonborn (clan first)", results: dragonbornGenerator.generate({ ancestry: ["metallic"] }, 4, [], 91).results },
  { label: "Female chromatic dragonborn", results: dragonbornGenerator.generate({ ancestry: ["chromatic"], gender: ["female"] }, 4, [], 92).results },
  { label: "Gem dragonborn with childhood names", results: dragonbornGenerator.generate({ ancestry: ["gem"], style: ["child"] }, 4, [], 93).results },
];

const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Meaning shown for every name and clan", yes, "Rare — usually names only"],
  ["Chromatic, metallic and gem ancestry (Fizban's)", yes, "Often chromatic and metallic only"],
  ["Damage type shown with the dragon color", yes, no],
  ["Clan name first, the 5e custom", yes, "Mixed"],
  ["Childhood nicknames with their story", yes, "Some"],
  ["Lock names you like, re-roll the rest, share the list", yes, no],
  ["No sign-up, no AI credits", yes, "Some need an account"],
];

const FAQ = [
  {
    question: "How do dragonborn names work in D&D 5e?",
    answer:
      "A dragonborn has a personal name, a clan name and often a childhood name. The clan name comes first as a mark of honor, so Kharrevon Dravar is Dravar of the Kharrevon clan. Childhood names like Tailchaser are used by family and close friends. Choose the style filter to get any of the three.",
  },
  {
    question: "What does each dragonborn name mean?",
    answer:
      "Each personal name joins two roots: the first follows the ancestry (flame, venom, honor, dream…), the second adds a trait (claw, wing, song, heart…). So Balasar means \"honor + king\" and Velhesh means \"dream + flight\". Clans come with a custom or reputation you can use as a story hook.",
  },
  {
    question: "What is the difference between chromatic, metallic and gem dragonborn?",
    answer:
      "Chromatic dragonborn descend from red, blue, green, black or white dragons and get harsher names here. Metallic dragonborn (gold, silver, bronze, brass, copper) get stately names, and gem dragonborn (amethyst, crystal, emerald, sapphire, topaz) get soft, ringing ones. Every result also shows a color and its breath damage type.",
  },
  {
    question: "Can I get female dragonborn names?",
    answer:
      "Yes. Pick Female in the gender filter. Female names here end in sounds like -ra, -iri and -ala (heart, song, grace); male names end in -asar, -jhan or -inn (king, fire, wing), and neutral names in -ix or -eth (horn, breath).",
  },
  {
    question: "Are these names from the Player's Handbook?",
    answer:
      "No. They are original names in the same style, so your character will not share a name with the example list every other table uses. They work for any edition and for homebrew worlds.",
  },
  {
    question: "What is a good dragonborn paladin or sorcerer name?",
    answer:
      "Metallic names with roots like honor, oath and justice suit a paladin (try Tor- or Nad- names with the clan style). For a sorcerer, chromatic or gem names with roots like storm, prism or star fit draconic magic. Add a childhood name for a softer side the party learns later.",
  },
];

export default function DragonbornNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Dragonborn Name Generator"
      heading={["Dragonborn Name", "Generator"]}
      intro={`Get ${DRAGONBORN_NAMES.length} dragonborn names and ${DRAGONBORN_CLANS.length} clans with meanings. Pick chromatic, metallic or gem ancestry and a gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A dragonborn name generator gives D&D 5e players a personal name, a clan name and a childhood nickname for a dragonborn character.
          This one shows what every name means (Balasar = honor + king), puts the clan name first as dragonborn custom demands, covers
          chromatic, metallic and gem ancestry with the breath damage type, and is free with no sign-up.
        </>
      }
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/dragon-name-generator", label: "Dragon name generator" },
        { href: "/dwarf-name-generator", label: "Dwarf name generator" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
      ]}
      content={
        <>
          <SectionTitle>Dragonborn names with meanings</SectionTitle>
          <p>
            Most <strong>dragonborn name generators</strong> give you a string of syllables. Here every name is built from two roots and the
            meaning comes with it, and each clan has a custom: the Valtheran keep the law scrolls of a fallen empire, the Skarnovar keep the
            claws of every rival they beat. One click gives you a name, a family and a reason to be proud of it.
          </p>
          <SectionTitle>Three draconic ancestries</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chromatic</strong> — red, blue, green, black, white. Harsh names: Vraxjhan, Krivasar, Morhesh.</li>
            <li><strong>Metallic</strong> — gold, silver, bronze, brass, copper. Stately names: Balasar, Torinn, Hesana.</li>
            <li><strong>Gem</strong> — amethyst, crystal, emerald, sapphire, topaz. Soft names: Lyriri, Velhesh, Orara.</li>
          </ul>
          <SectionTitle>Clan name, childhood name or personal name</SectionTitle>
          <p>
            Use <em>Clan + name</em> for introductions (&quot;Solmirath Medash&quot;), <em>Name + childhood name</em> for what friends call
            them (&quot;Krivar &quot;Sparkspitter&quot;&quot;), or <em>Name only</em> for quick NPCs. Dragonborn who lose their clan often
            drop the clan name, which is a ready-made backstory.
          </p>
          <SectionTitle>How this dragonborn name generator compares</SectionTitle>
          <CompareTable rows={COMPARE} them="Typical dragonborn generators" note="Compared with the top results for “dragonborn name generator” in November 2026." />
          <SectionTitle>Naming the rest of the party</SectionTitle>
          <p>
            For a dwarf fighter, try the <Link prefetch={false} href="/dwarf-name-generator" className={linkClass}>dwarf name generator</Link>;
            for the god your paladin serves, the <Link prefetch={false} href="/god-name-generator" className={linkClass}>god name generator</Link>;
            for the ancestor dragon itself, the <Link prefetch={false} href="/dragon-name-generator" className={linkClass}>dragon name generator</Link>.
            Every other race is on the <Link prefetch={false} href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each ancestry:"} sets={EXAMPLES} />
        </>
      }
    >
      <DragonbornNameGenerator />
    </GeneratorPageShell>
  );
}
