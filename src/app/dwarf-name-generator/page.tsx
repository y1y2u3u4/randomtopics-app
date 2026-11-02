import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import DwarfNameGenerator from "@/components/generators/DwarfNameGenerator";
import CompareTable, { no, yes } from "@/components/generators/CompareTable";
import { DWARF_CLANS, DWARF_NAMES, dwarfGenerator } from "@/lib/generators/dwarf";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/dwarf-name-generator";
const TITLE = `Dwarf Name Generator — ${DWARF_NAMES.length} Dwarf Names & ${DWARF_CLANS.length} Clans with Meanings`;
const DESCRIPTION = `Free dwarf name generator with ${DWARF_NAMES.length} male, female and neutral dwarf names and ${DWARF_CLANS.length} clan names, each with its meaning. Filter by mountain, hill, deep or frost dwarf, or name them "son of" or "daughter of" a parent. For D&D 5e, Warhammer-style games and fantasy writing.`;

const SOCIAL = generatorSocial({ card: "dnd-name-generator", title: TITLE, description: DESCRIPTION, alt: "Dwarf Name Generator — dwarf names and clans with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["dwarf name generator", "dwarf names", "dnd dwarf names", "female dwarf names", "dwarf clan names", "dwarven names", "dwarf last names", "5e dwarf name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Mountain hall dwarves", results: dwarfGenerator.generate({ hold: ["mountain"] }, 4, [], 101).results },
  { label: "Female hill dwarves", results: dwarfGenerator.generate({ hold: ["hill"], gender: ["female"] }, 4, [], 102).results },
  { label: "Son / daughter of… (frost & deep)", results: dwarfGenerator.generate({ hold: ["frost", "deep"], style: ["parent"] }, 4, [], 103).results },
];

const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Meaning shown for every name and clan", yes, "Rare — usually names only"],
  ["Four kinds of dwarf with their own sound", yes, "One mixed list"],
  ["Clan names with a custom or story hook", yes, "Plain compound surnames"],
  ["“Son of / daughter of” naming", yes, no],
  ["Female and neutral dwarf names", yes, "Some"],
  ["Lock names you like, re-roll the rest, share the list", yes, no],
  ["No sign-up, no AI credits", yes, "Some need an account"],
];

const FAQ = [
  {
    question: "What is a good dwarf name?",
    answer:
      "Dwarf names are short and heavy, often one or two syllables with hard sounds: Thorin, Balgar, Inghild. A clan name that says what the family is famous for (Ironfist, Brewbarrel) finishes it. This generator gives both, with the meaning of every part.",
  },
  {
    question: "How are these dwarf names built?",
    answer:
      "Each name joins a root that fits the dwarf's home (stone and thunder for mountain halls, barley and hearth for hill dwarves, gloom and root for deep dwarves, rime and bear for frost dwarves) to an ending that adds a second meaning such as son, ruler, battle or joy. The result shows both, e.g. Balgar = stone + spear.",
  },
  {
    question: "Can I make female dwarf names?",
    answer:
      "Yes. Pick Female in the gender filter. Female names here end in -hild, -dis, -wyn or -ra (battle, lady, joy, wisdom); male names end in -in, -rik, -ar or -grun (son, ruler, warrior, beard). Neutral names end in -nor, -ok or -um.",
  },
  {
    question: "What are good dwarf clan names?",
    answer:
      `There are ${DWARF_CLANS.length} clans here, 12 for each kind of dwarf, and each has a custom: Oakenshield once fought with a branch when its shield broke, Silentpick mines without speaking, Skaldhorn remembers every saga. Use the custom as a backstory hook.`,
  },
  {
    question: "How does “son of” naming work for dwarves?",
    answer:
      "Many fantasy dwarves give their parent's name instead of, or as well as, a clan: \"Rurik, son of Hargrun\". Choose the Son / daughter of style and the generator picks a parent name from the same hold, with both meanings, so the family sounds related.",
  },
  {
    question: "Do these names work for D&D 5e and duergar?",
    answer:
      "Yes. Mountain and hill dwarves match the two 5e subraces; deep dwarf names fit duergar and other Underdark dwarves; frost dwarves suit northern or Norse-flavored campaigns. The names are original, so they are free to use in games and books.",
  },
];

export default function DwarfNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Dwarf Name Generator"
      heading={["Dwarf Name", "Generator"]}
      intro={`Get ${DWARF_NAMES.length} dwarf names and ${DWARF_CLANS.length} clans, each with a meaning. Pick mountain, hill, deep or frost dwarf and a gender, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A dwarf name generator gives you short, sturdy names for dwarf characters. This one shows what every name means (Balgar = stone +
          spear), pairs it with a clan that has its own custom or a &quot;son of / daughter of&quot; parent, and lets you filter by four kinds
          of dwarf and by gender. It is free, has no sign-up, and you can lock, copy or share any name.
        </>
      }
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/elf-name-generator", label: "Elf name generator" },
        { href: "/dragonborn-name-generator", label: "Dragonborn name generator" },
        { href: "/gnome-name-generator", label: "Gnome name generator" },
      ]}
      content={
        <>
          <SectionTitle>Dwarf names that mean something</SectionTitle>
          <p>
            A good <strong>dwarf name generator</strong> should sound like it was carved in stone. Every name here is built from two roots, and
            the meaning comes with it: Thorgar is &quot;thunder + spear&quot;, Rurwyn is &quot;hearth + joy&quot;. Each clan adds a custom —
            the Brewbarrel clan brews the best ale on either side of the river — so one result gives you a name, a family and a story.
          </p>
          <SectionTitle>Four kinds of dwarf</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mountain hall</strong> — kings, smiths and warriors. Grand names; clans like Ironfist and Runekeeper.</li>
            <li><strong>Hill dwarf</strong> — farmers, brewers and traders. Homely names; clans like Brewbarrel and Hearthstone.</li>
            <li><strong>Deep dwarf</strong> — miners of the dark (duergar). Clipped, dark names; clans like Gloomhammer and Silentpick.</li>
            <li><strong>Frost dwarf</strong> — northern, Norse-flavored. Names like Hrimhild and Bjorgar; clans like Frostbeard and Skaldhorn.</li>
          </ul>
          <SectionTitle>How this dwarf name generator compares</SectionTitle>
          <CompareTable rows={COMPARE} them="Typical dwarf name generators" note="Compared with the top results for “dwarf name generator” in November 2026." />
          <SectionTitle>Naming the rest of the party</SectionTitle>
          <p>
            Dwarves and elves make a classic rivalry: try the <Link prefetch={false} href="/elf-name-generator" className={linkClass}>elf name generator</Link>.
            For a dragonborn companion, the <Link prefetch={false} href="/dragonborn-name-generator" className={linkClass}>dragonborn name generator</Link>;
            for the god of the forge your cleric prays to, the <Link prefetch={false} href="/god-name-generator" className={linkClass}>god name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for each kind of dwarf:"} sets={EXAMPLES} />
        </>
      }
    >
      <DwarfNameGenerator />
    </GeneratorPageShell>
  );
}
