import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import JapaneseNameGenerator from "@/components/generators/JapaneseNameGenerator";
import { JP_FAMILY, JP_GIVEN } from "@/lib/generators/japanese";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/japanese-name-generator";
const TITLE = "Japanese Name Generator — Kanji, Kana, Romaji & Meanings";
const DESCRIPTION = `Free Japanese name generator: ${JP_GIVEN.length}+ real given names and ${JP_FAMILY.length}+ surnames, each shown in kanji, hiragana and romaji with the meaning of the kanji. Filter by male, female or gender-neutral; Western or Japanese name order.`;

const SOCIAL = generatorSocial({ card: "japanese-name-generator", title: TITLE, description: DESCRIPTION, alt: "Japanese Name Generator — cherry blossoms, torii gate and Mount Fuji" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["japanese name generator", "random japanese name", "japanese names with meanings", "japanese girl names", "japanese boy names", "anime name generator", "japanese surname generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "Are these real Japanese names?",
    answer: `Yes. All ${JP_GIVEN.length}+ given names and ${JP_FAMILY.length}+ family names are names used in Japan — from today's most popular baby names like Haruto, Yui and Himari to classic names like Hiroshi and Keiko, and surnames from Sato and Suzuki to Kurosawa. Each is shown with one common kanji spelling and its hiragana reading.`,
  },
  {
    question: "Why does one name have several possible kanji?",
    answer:
      "Japanese parents choose the kanji separately from the sound, so a name like Haruto can be written many ways, each with a different meaning. The generator shows one common spelling and the meaning of those characters; if you need a particular meaning, look up other kanji with the same reading.",
  },
  {
    question: "Which order should I use: Haruto Tanaka or Tanaka Haruto?",
    answer:
      "In Japan the family name comes first (Tanaka Haruto), and since 2020 the Japanese government recommends that order in English too. Many books, games and anime still use Western order. Switch the Name order filter to match your story.",
  },
  {
    question: "Can I get only girl or boy names?",
    answer:
      "Yes — choose Female, Male or Gender-neutral. Neutral names such as Hikaru, Makoto or Ren are used for any gender, which is handy for characters whose gender you haven't decided yet.",
  },
  {
    question: "Can I use these names for anime, manga or game characters?",
    answer:
      "Absolutely. Pair a name's meaning with your character's personality — Sora (sky) for a dreamer, Ren (lotus) for someone calm — and use the character name generator or random character generator for the rest of the cast.",
  },
];

export default function JapaneseNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Japanese Name Generator"
      heading={["Japanese Name", "Generator"]}
      intro={`Real Japanese first and last names in kanji, hiragana and romaji — with what the kanji mean. ${JP_GIVEN.length}+ given names, ${JP_FAMILY.length}+ surnames.`}
      description={DESCRIPTION}
      hero={{ src: "/generators/hero/japanese.webp", alt: "Cherry blossom branches, a red torii gate by a lake and Mount Fuji" }}
      updated="2026-10-11"
      faq={FAQ}
      related={[
        { href: "/western-baby-name-generator", label: "Western baby name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/dnd-name-generator", label: "D&D name generator" },
      ]}
      content={
        <>
          <SectionTitle>A full Japanese name, and what it means</SectionTitle>
          <p>
            Most Japanese name generators give you a romanized sound and nothing else. This <strong>Japanese name generator</strong> shows the
            full name the way it would be written in Japan — kanji (漢字), the hiragana reading (ひらがな) and the romaji — plus the meaning of
            each kanji, so you know that Hinata means &quot;sunny place&quot; before you give it to a character.
          </p>
          <SectionTitle>How Japanese names work</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Family name first</strong> — Tanaka Haruto is Haruto of the Tanaka family. Use the Name order filter to switch.</li>
            <li><strong>Kanji carry meaning</strong> — 陽 (sun), 翔 (soar), 花 (flower); the same sound can be written with different kanji.</li>
            <li><strong>Surnames often describe places</strong> — Yamamoto (base of the mountain), Tanaka (middle of the rice field), Inoue (above the well).</li>
            <li><strong>Gender clues</strong> — endings like -ko, -mi and -na are common for girls, -to, -ta and -suke for boys, but many modern names are neutral.</li>
          </ul>
          <SectionTitle>Who uses it</SectionTitle>
          <p>
            Writers and manga artists naming a cast, gamers creating characters, learners practising kanji readings, and anyone curious about
            what common Japanese names mean. For surnames from other cultures use the{" "}
            <Link href="/last-name-generator" className={linkClass}>last name generator</Link>; for fantasy or sci-fi casts try the{" "}
            <Link href="/character-name-generator" className={linkClass}>character name generator</Link>.
          </p>
        </>
      }
    >
      <JapaneseNameGenerator />
    </GeneratorPageShell>
  );
}
