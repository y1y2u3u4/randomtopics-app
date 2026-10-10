import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import DndNameGenerator from "@/components/generators/DndNameGenerator";
import { DND_FIRST, DND_FAMILY, RACES } from "@/lib/generators/dnd";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/dnd-name-generator";
const TITLE = "D&D Name Generator — Fantasy Names by Race & Gender";
const DESCRIPTION = `Free D&D name generator: ${DND_FIRST.length}+ original first names and ${DND_FAMILY.length}+ family and clan names for elves, dwarves, halflings, gnomes, tieflings, dragonborn, half-orcs and more. Filter by race and gender, no signup.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["dnd name generator", "d&d name generator", "dungeons and dragons name generator", "elf name generator", "dwarf name generator", "tiefling name generator", "dragonborn name generator", "fantasy name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does this D&D name generator work?",
    answer: `Pick one or more races and genders, then press Generate. Each result pairs a first name with a family, clan or tribe name that fits the same race, plus a short note on how the name feels. There are ${DND_FIRST.length}+ first names, and none repeats until you've seen every name that matches your filters.`,
  },
  {
    question: "Which races are included?",
    answer: `${RACES.map((r) => r.label).join(", ")}. Each race has its own naming style — flowing, vowel-rich elven names, hard-consonant dwarven names, cosy halfling names, guttural half-orc names, infernal or virtue names for tieflings and draconic clan names for dragonborn.`,
  },
  {
    question: "Are these the official names from the Player's Handbook?",
    answer:
      "No. Every name here is original, written in the style of each race so you can use it freely at your table, in a novel or in a video game. That also means your character is less likely to share a name with every other elf at the convention.",
  },
  {
    question: "How do I choose a good name for my character?",
    answer:
      "Say it aloud at the table — names that are easy to pronounce get used; hard ones get nicknamed. Think about what the name says about your character's background, and keep a short version for combat. Generate ten at once and shortlist two or three.",
  },
  {
    question: "Can I use it for NPCs on the fly?",
    answer:
      "Yes — that is what most Dungeon Masters use it for. Keep the tab open, filter to the race of the town you're in and generate twenty names at once. Copy results gives you a plain list to paste into your session notes.",
  },
];

export default function DndNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="D&D Name Generator"
      heading={["D&D Name", "Generator"]}
      intro={`${DND_FIRST.length}+ original fantasy names for ${RACES.length} races, each with a fitting family or clan name. Filter by race and gender, generate up to 20 at a time.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/viking-name-generator", label: "Viking name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/writing", label: "Writing prompts" },
      ]}
      content={
        <>
          <SectionTitle>A name that sounds like it belongs</SectionTitle>
          <p>
            Every Dungeons &amp; Dragons race has a naming voice. Elves get long, musical names; dwarves get names you could carve in stone;
            halflings sound like they own a good pantry. This <strong>D&amp;D name generator</strong> keeps those voices separate, so a dwarf
            never comes out sounding like an elf — and every first name comes with a family, clan or tribe name from the same culture.
          </p>
          <SectionTitle>Naming styles by race</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Elves</strong> — soft consonants and long vowels, with house names drawn from nature and starlight.</li>
            <li><strong>Dwarves &amp; gnomes</strong> — sturdy dwarven names with clan names of stone and steel; playful gnome names full of tinkering.</li>
            <li><strong>Halflings</strong> — friendly, short names and homely family names.</li>
            <li><strong>Half-orcs &amp; dragonborn</strong> — strong, guttural names; dragonborn carry their clan name first in honour.</li>
            <li><strong>Tieflings &amp; aasimar</strong> — infernal or celestial-sounding names, plus virtue names like Reverie or Ash.</li>
          </ul>
          <SectionTitle>For players and Dungeon Masters</SectionTitle>
          <p>
            Players can shortlist a name before session zero; DMs can generate a tavern full of NPCs in a click. Need more than a name? The{" "}
            <Link href="/random-character-generator" className={linkClass}>random character generator</Link> adds a personality, a motivation
            and a secret, and the <Link href="/viking-name-generator" className={linkClass}>Viking name generator</Link> covers Norse-flavoured
            campaigns.
          </p>
        </>
      }
    >
      <DndNameGenerator />
    </GeneratorPageShell>
  );
}
