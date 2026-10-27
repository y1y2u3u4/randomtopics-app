import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FantasyNameGenerator from "@/components/generators/FantasyNameGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/fantasy-name-generator";
const TITLE = "Fantasy Name Generator — Elf, Dwarf, Orc, Dragonborn & More";
const DESCRIPTION =
  "Free fantasy name generator with over 1,000 first names and matching surnames for elves, dwarves, halflings, gnomes, orcs, tieflings, dragonborn, humans and Norse heroes. Filter by race and gender and see each name's meaning.";

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "Fantasy Name Generator — a dragon and a spellbook" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fantasy name generator", "fantasy names", "random fantasy name generator", "fantasy character name generator", "rpg name generator", "elf dwarf orc names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the fantasy name generator work?",
    answer:
      "Each result is a first name from a hand-built list for one race or culture, paired with a surname, house name or epithet from that same culture. Choosing a race keeps the names consistent, so a dwarf never gets an elven house name. Filters also narrow by gender.",
  },
  {
    question: "Which fantasy races are included?",
    answer: "High elf, wood elf, dark elf and sea elf, dwarf, halfling, gnome, orc, tiefling, dragonborn, human, half-elf, aasimar and Old Norse (Viking). Select several to mix them, or none for the whole pool.",
  },
  {
    question: "Do the names have meanings?",
    answer: "Yes. Under each result you will see what the first name and the surname suggest, such as a trait, a craft or an element, which is useful when you need to justify a name in a backstory.",
  },
  {
    question: "Can I use the names for my D&D character, novel or game?",
    answer: "Yes. Names are short words and combinations, free to use in tabletop campaigns, stories, video games and worldbuilding. Check that a result is not already a famous character if you are publishing.",
  },
  {
    question: "Can I get a first name without the surname?",
    answer: "Choose 'First name only' under Name style. That is best for pets, ships, spells and one-name NPCs.",
  },
  {
    question: "Is there a version for just one race?",
    answer: "Yes — for deeper lists use the elf, D&D, Viking, gnome, vampire or pirate name generators linked below. This page is the quick way to browse every race in one place.",
  },
];

export default function FantasyNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fantasy Name Generator"
      heading={["Fantasy Name", "Generator"]}
      intro="Names for elves, dwarves, orcs, dragonborn and more — each with a matching surname and a meaning behind it."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Pick one or more races, choose a gender if you care, and press Generate. Every result pairs a first name with a surname or house from the same culture and explains what both parts suggest. The pool holds more than a thousand first names across 14 races and cultures, and results can be copied or shared by link."
      related={[
        { href: "/elf-name-generator", label: "Elf name generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/viking-name-generator", label: "Viking name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/random-name-generator", label: "Random name generator" },
      ]}
      content={
        <>
          <SectionTitle>Choosing a race or culture</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Elves</strong> — high elves sound formal and musical, wood elves earthy, dark elves sharp, sea elves fluid. Each kind has its own houses.</li>
            <li><strong>Dwarves</strong> — short, hard consonants and clan names tied to stone, forge and mountain.</li>
            <li><strong>Halflings and gnomes</strong> — friendly, rounded names for small folk; gnome names lean playful and inventive.</li>
            <li><strong>Orcs, tieflings and dragonborn</strong> — heavier, harsher or more dramatic sounds, with surnames that read like titles or virtues.</li>
            <li><strong>Humans and half-elves</strong> — familiar, adaptable names for ordinary heroes and travellers between worlds.</li>
            <li><strong>Norse</strong> — Old Norse first names with bynames such as &lsquo;Fairhair&rsquo; or &lsquo;Skull-splitter&rsquo;.</li>
          </ul>
          <SectionTitle>Tips for picking the right name</SectionTitle>
          <p>
            Say it aloud: the best fantasy names are easy to pronounce and hard to confuse with the rest of the cast. Keep first letters different across a party, shorten long names
            into nicknames players will actually use, and let the meaning hint at a flaw or a secret. A character whose name means &lsquo;keeper of ash&rsquo; has questions to answer.
          </p>
          <SectionTitle>Go deeper</SectionTitle>
          <p>
            For a single race with longer lists use the <Link prefetch={false} href="/elf-name-generator" className={linkClass}>elf name generator</Link>,
            the <Link prefetch={false} href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link> or the <Link prefetch={false} href="/viking-name-generator" className={linkClass}>Viking name generator</Link>.
            Building the world itself? The <Link prefetch={false} href="/fantasy-map-maker" className={linkClass}>fantasy map maker</Link> and the <Link prefetch={false} href="/city-name-generator" className={linkClass}>city name generator</Link> name your kingdoms and towns.
          </p>
        </>
      }
    >
      <FantasyNameGenerator />
    </GeneratorPageShell>
  );
}
