import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import GnomeNameGenerator from "@/components/generators/GnomeNameGenerator";
import { GNOME_CLANS, GNOME_FIRST, GNOME_NICKNAMES } from "@/lib/generators/gnome";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/gnome-name-generator";
const TITLE = "Gnome Name Generator — Names, Nicknames & Clan Names";
const DESCRIPTION = `Free gnome name generator for D&D and fantasy stories: ${GNOME_FIRST.length}+ gnome first names, ${GNOME_NICKNAMES.length}+ nicknames and ${GNOME_CLANS.length}+ clan names, each with what it means. Rock, forest and tinker gnomes.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["gnome name generator", "dnd gnome names", "gnome names", "rock gnome name generator", "forest gnome names", "gnome clan names"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How do gnome names work?",
    answer:
      "In most fantasy settings, including D&D, gnomes collect names: a personal name from their parents, a nickname or two earned by what they do, and a clan name. Many gnomes introduce themselves with only the nickname they like best. This generator builds all three parts.",
  },
  {
    question: "Are these the gnome names from the Player's Handbook?",
    answer:
      "No — every name is original, written in a playful gnomish style, so you can use them freely for characters, NPCs, stories and games.",
  },
  {
    question: "What makes a good gnome name?",
    answer:
      "Bouncy syllables, a hint of mischief and something that rolls off the tongue — think Fizzwick or Tibble. Nicknames should tell a tiny story (\"Cogsworth\" builds clocks), and the clan name hints at the family trade or home.",
  },
  {
    question: "Can I get only female or male gnome names?",
    answer:
      "Yes. Use the Gender filter to get male, female or gender-neutral first names, or leave it on All for a mix. Nicknames and clan names suit any gnome.",
  },
];

export default function GnomeNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Gnome Name Generator"
      heading={["Gnome Name", "Generator"]}
      intro={`Playful gnome names with nicknames and clan names — ${GNOME_FIRST.length}+ first names, each part with its meaning.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/character-name-generator", label: "Character name generator" },
      ]}
      content={
        <>
          <SectionTitle>Names for tinkerers, tricksters and burrow-dwellers</SectionTitle>
          <p>
            Gnomes are the inventors and illusionists of fantasy worlds, and their names should sound like it. This{" "}
            <strong>gnome name generator</strong> pairs a bright first name with a nickname that tells a story and a clan name tied to a craft
            or a home — so every result already hints at a personality.
          </p>
          <SectionTitle>Two styles</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Name + nickname + clan</strong> — the full gnomish introduction, perfect for a player character.</li>
            <li><strong>Name + clan</strong> — shorter, for NPCs and quick introductions.</li>
          </ul>
          <p>
            Playing another race? The <Link href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link> covers elves,
            dwarves, halflings, tieflings and more, and the <Link href="/random-character-generator" className={linkClass}>random character
            generator</Link> adds a personality and a secret.
          </p>
        </>
      }
    >
      <GnomeNameGenerator />
    </GeneratorPageShell>
  );
}
