import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import JapaneseNameConverter from "@/components/generators/JapaneseNameConverter";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import CompareTable, { no, yes } from "@/components/generators/CompareTable";
import { NAME_DICTIONARY, convertName } from "@/lib/generators/japaneseConverter";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/japanese-name-converter";
const TITLE = "English Name to Japanese Converter — Katakana, Romaji & Kanji with Meanings";
const DESCRIPTION =
  "Free English to Japanese name converter: type your name and get the katakana spelling, romaji, hiragana and three kanji spellings picked by sound, with the meaning of every character. Copy, share or listen — no sign-up.";

const SOCIAL = generatorSocial({ card: "japanese-name-generator", title: TITLE, description: DESCRIPTION, alt: "Your name in Japanese — katakana, romaji and kanji with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["japanese name converter", "english to japanese name converter", "my name in japanese", "name in katakana", "name to kanji", "your name in japanese", "katakana name converter", "english name in japanese"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real converter output for fixed names.
const example = (name: string) => {
  const r = convertName(name)!;
  return { title: r.katakana, subtitle: `${name} · ${r.romaji} · ${r.parts.map((p) => p.kanji[0]?.map((k) => k.kanji).join("") ?? "").join(" ")}` };
};
const EXAMPLES = [
  { label: "Popular first names", results: ["Emily", "Michael", "Olivia"].map(example) },
  { label: "Full names", results: ["Sophia Brown", "James Wilson", "Ava Taylor"].map(example) },
  { label: "Names spelled by sound", results: ["Zendaya", "Kenji", "Oakley"].map(example) },
];

const COMPARE: [string, React.ReactNode, React.ReactNode][] = [
  ["Katakana spelling", yes, yes],
  ["Romaji (Hepburn with long vowels)", yes, "Some"],
  ["Hiragana", yes, "Some"],
  ["Kanji spellings with the meaning of each character", "Yes, 3 options per name", no],
  ["Full names with the ・ separator and Japanese name order", yes, no],
  ["Syllable-by-syllable breakdown", yes, "Some"],
  ["Copy, share link and audio", yes, "Some"],
  ["No sign-up, no course upsell, runs in your browser", yes, "Some"],
];

const FAQ = [
  {
    question: "How do I write my name in Japanese?",
    answer:
      "Foreign names are written in katakana, the Japanese script for words from other languages. Type your name above and the converter shows the katakana, the romaji (how it reads in Latin letters) and hiragana. For example Emily becomes エミリー (Emirī) and Michael becomes マイケル (Maikeru).",
  },
  {
    question: "Why is my name in katakana and not kanji?",
    answer:
      "In Japan, non-Japanese names are written in katakana on passports, forms and name cards. Kanji carry meanings and readings of their own, so a kanji version of an English name is a creative spelling called ateji. It is fine for art, tattoo ideas or a hanko stamp, but katakana is the standard way to write your name.",
  },
  {
    question: "How are the kanji for my name chosen?",
    answer:
      "The converter splits the katakana into Japanese syllables and, for each one, picks kanji that are commonly read that way in names, such as 美 (mi, beauty) or 莉 (ri, jasmine). It gives three different combinations and shows the meaning of every character, so you can choose one whose meaning you like.",
  },
  {
    question: "Is the katakana spelling of my name official?",
    answer:
      `There is no single official spelling. About ${Math.floor(NAME_DICTIONARY.size / 10) * 10} common English first names and surnames use the spelling most often seen in Japanese media and documents. Other names are spelled by sound with rules for English spelling, so if you know how your name is pronounced differently, a Japanese speaker may adjust a sound or two.`,
  },
  {
    question: "Which order should my first and last name go in?",
    answer:
      "Japanese puts the family name first, but foreign names in katakana are often kept in their original order, joined with a middle dot (・). Use the order buttons to switch between Given name first and Family name first.",
  },
  {
    question: "What is the difference between this converter and the Japanese name generator?",
    answer:
      "This converter turns your own English name into Japanese. The Japanese name generator invents a new, authentic Japanese name (for example Haruto Sato) with kanji and meaning, which is better for characters, stories and games.",
  },
];

export default function JapaneseNameConverterPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Japanese Name Converter"
      heading={["Japanese Name", "Converter"]}
      intro="Type your English name to see it in Japanese: katakana, romaji, hiragana and three kanji spellings chosen by sound, each with its meaning. Free, instant and no sign-up."
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A Japanese name converter writes a foreign name the way Japanese people would, in katakana. This one also gives romaji and
          hiragana, a syllable breakdown, Japanese name order, and three kanji spellings (ateji) picked by sound with the meaning of each
          character, which the popular katakana-only converters do not offer. It uses standard spellings for about{" "}
          {Math.floor(NAME_DICTIONARY.size / 10) * 10} common names, runs in your browser and is free.
        </>
      }
      related={[
        { href: "/japanese-name-generator", label: "Japanese name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/english-name-generator", label: "English name generator" },
      ]}
      content={
        <>
          <SectionTitle>Your name in katakana, romaji and kanji</SectionTitle>
          <p>
            Japanese has three scripts. <strong>Katakana</strong> is used for foreign names, so it is the spelling you would see on a Japanese
            visa, a Starbucks cup or a name badge. <strong>Romaji</strong> is the reading in Latin letters, with a line over long vowels (ī, ō).
            <strong> Hiragana</strong> is the rounder script used for native words and is handy for children&apos;s name tags. <strong>Kanji</strong> are
            Chinese characters with meanings; for a foreign name they are a stylish extra, not the everyday spelling.
          </p>
          <SectionTitle>How English sounds become Japanese</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Every consonant needs a vowel</strong>: Mark becomes マーク (Māku), Ford becomes フォード (Fōdo).</li>
            <li><strong>L and R are the same sound</strong>, written with the ra-ri-ru-re-ro row: Lily and Riley both start with リ.</li>
            <li><strong>Long vowels get a dash (ー)</strong>: the -ee in Emily and the -er in Parker become ー.</li>
            <li><strong>Short stops double</strong> with a small ッ: Jack is ジャック (Jakku), Max is マックス (Makkusu).</li>
            <li><strong>Th becomes s or z</strong> and <strong>v often becomes b</strong>: Ethan is イーサン, Ava is エヴァ or エバ.</li>
          </ul>
          <SectionTitle>Choosing a kanji spelling</SectionTitle>
          <p>
            Pick the version whose meanings you like, then check it with a Japanese speaker before using it for a tattoo or a stamp. Characters
            such as 愛 (love), 美 (beauty), 優 (gentle) and 翔 (soar) are popular in names. Because the kanji are chosen for their sound, the
            same name can be written many ways, and none of them is the official one.
          </p>
          <SectionTitle>Compared with other name converters</SectionTitle>
          <CompareTable rows={COMPARE} them="Top katakana name converters" note="Compared with the top results for “japanese name converter” (Nolan Lawson, JapaneseJLPT, GyanMirai) in November 2026." />
          <SectionTitle>Want a real Japanese name instead?</SectionTitle>
          <p>
            For a character, a pen name or a game, try the{" "}
            <Link prefetch={false} href="/japanese-name-generator" className={linkClass}>Japanese name generator</Link>, which creates authentic
            given and family names with kanji and meanings. Need a surname for any culture? Use the{" "}
            <Link prefetch={false} href="/last-name-generator" className={linkClass}>last name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real converter output (katakana · romaji · first kanji option):"} sets={EXAMPLES} />
        </>
      }
    >
      <JapaneseNameConverter />
    </GeneratorPageShell>
  );
}
