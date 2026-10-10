import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import VikingNameGenerator from "@/components/generators/VikingNameGenerator";
import { BYNAMES, VIKING_NAMES } from "@/lib/generators/viking";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/viking-name-generator";
const TITLE = "Viking Name Generator — Norse Names with Meanings & Bynames";
const DESCRIPTION = `Free Viking name generator with ${VIKING_NAMES.length}+ real Old Norse names, patronymics (Haraldsson, Thorsdottir) and ${BYNAMES.length}+ bynames like Ironside or the Bold — every part with its meaning. Male and female names.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["viking name generator", "norse name generator", "viking names", "old norse names", "viking names with meanings", "female viking names", "viking nickname generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "Are these real Viking names?",
    answer:
      "The first names are real Old Norse personal names recorded in the Icelandic sagas, on runestones and in the Book of Settlements. Each result shows the Old Norse spelling and the common modern spelling, with the name's meaning. Bynames mix famous historical epithets with new ones written in the same style.",
  },
  {
    question: "How did Vikings name their children?",
    answer:
      "Most people had one given name plus a patronymic — the father's name with -son (son) or -dóttir (daughter), so a daughter of Harald was Haraldsdóttir. Many names honoured the gods (Thor-, Frey-) or animals of power such as the bear (Björn) and the wolf (Úlfr). Children were often named after a dead relative.",
  },
  {
    question: "What is a Viking byname?",
    answer:
      "A byname, or nickname, described a person's looks, deeds or character — Harald Fairhair, Eric Bloodaxe, Sweyn Forkbeard, Ivar the Boneless. They were how people told apart the many Thorsteins and Olafs in one district.",
  },
  {
    question: "Can I generate female Viking names?",
    answer:
      "Yes. Choose Female to get names such as Sigrid, Astrid, Gudrun or Freydis, with a patronymic ending in -dottir. Leave both genders on to mix them.",
  },
  {
    question: "Can I use these names for games and stories?",
    answer:
      "Absolutely — they work for tabletop RPGs, video game characters, novels, pets and even boat names. Pick the Name + byname style for a heroic feel, or Name + patronymic for a historically grounded one.",
  },
];

export default function VikingNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Viking Name Generator"
      heading={["Viking Name", "Generator"]}
      intro={`${VIKING_NAMES.length}+ authentic Old Norse names with patronymics and bynames — and the meaning of every part.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/dnd-name-generator", label: "D&D name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
      ]}
      content={
        <>
          <SectionTitle>Names straight from the sagas</SectionTitle>
          <p>
            This <strong>Viking name generator</strong> builds names the way Norse people actually carried them: a given name, a patronymic
            from the father&apos;s name, and sometimes a byname earned by looks or deeds. The first names come from the historical record, so
            you&apos;ll find Ragnar, Leif, Sigrid and Gudrun alongside rarer names like Hallveig or Thorgrim — each with its meaning.
          </p>
          <SectionTitle>Three parts of a Norse name</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Given name</strong> — often a compound such as Thor + stone (Thorstein) or god + battle.</li>
            <li><strong>Patronymic</strong> — father&apos;s name + -sson or -sdottir: Haraldsson, Eiriksdottir.</li>
            <li><strong>Byname</strong> — a nickname like Ironside, the Deep-minded or Wolf-tongue.</li>
          </ul>
          <SectionTitle>Make it fit your character</SectionTitle>
          <p>
            Choose the name style that suits your story: a full saga-style name for a jarl, a single given name for a farmhand, or a name and
            byname for a warrior everyone fears. For other fantasy cultures try the{" "}
            <Link href="/dnd-name-generator" className={linkClass}>D&amp;D name generator</Link>, or the{" "}
            <Link href="/last-name-generator" className={linkClass}>last name generator</Link> for modern Scandinavian surnames.
          </p>
        </>
      }
    >
      <VikingNameGenerator />
    </GeneratorPageShell>
  );
}
