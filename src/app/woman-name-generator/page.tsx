import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WomanNameGenerator from "@/components/generators/WomanNameGenerator";
import { WOMAN_NAMES, WOMAN_ORIGINS, womanGenerator } from "@/lib/generators/womanNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/woman-name-generator";
const TITLE = `Woman Name Generator — ${WOMAN_NAMES.length} Female Names from ${WOMAN_ORIGINS.length} Cultures with Meanings`;
const DESCRIPTION = `Free woman name generator: ${WOMAN_NAMES.length} real female first names from ${WOMAN_ORIGINS.length} cultures, each with its origin, meaning and a matching surname. Filter by culture and by classic, modern, vintage or rare style. Made for characters, writing and forms.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Woman Name Generator — female names with origin and meaning" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["woman name generator", "female name generator", "girl name generator", "random female name generator", "female names with meanings", "random woman name", "women's names by origin"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Classic English", results: womanGenerator.generate({ origin: ["english"], style: ["classic", "vintage"] }, 4, [], 51).results },
  { label: "Japanese", results: womanGenerator.generate({ origin: ["japanese"] }, 4, [], 52).results },
  { label: "Rare names, any culture", results: womanGenerator.generate({ style: ["rare"] }, 4, [], 53).results },
];

const FAQ = [
  { question: "What does a woman name generator do?", answer: "It picks real female first names at random and pairs each with a surname from the same culture. Here you also get the origin and the meaning of the first name, so you can choose a name for a reason rather than only for the sound." },
  { question: "Are these real names or made-up ones?", answer: "They are real given names used by women in their cultures. The surnames are common real surnames from the same region, joined at random, so a full name is plausible but is not a specific person." },
  { question: "Can I use these names for characters in a story or game?", answer: "Yes. Pick the culture that fits the character's family, then choose an era: vintage for an older woman or a historical piece, classic for a timeless feel, modern for a young adult, and rare when you want a memorable name." },
  { question: "Is this the same as a girl name generator?", answer: "The names are for women and adults, not a baby-name list. Many are also used for girls, so you can use the tool as a female or girl name generator, but the results are chosen for characters and general use, not for choosing a name for a newborn." },
  { question: "Why do Japanese, Chinese and Korean results put the surname first?", answer: "In those cultures the family name is normally written before the given name, so the tool follows that order and marks it. Swap the two if your story or form uses Western order." },
  { question: "How accurate are the meanings?", answer: "Only meanings that are widely agreed are included. For Chinese names the meaning depends on the character used, so those entries say so, and Korean names are given with the pure Korean word they come from." },
];

export default function WomanNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Woman Name Generator"
      heading={["Woman Name", "Generator"]}
      intro={`Get real women's names from ${WOMAN_ORIGINS.length} cultures, each with its origin, meaning and a matching surname. Filter by culture and era, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A woman name generator suggests female names at random. This one gives {WOMAN_NAMES.length} real first names from{" "}
          {WOMAN_ORIGINS.length} cultures, from English and Spanish to Japanese, Arabic and African, with the origin, the meaning and a
          matching surname. Filter by classic, modern, vintage or rare. It is free, needs no sign-up and every name can be copied.
        </>
      }
      related={[
        { href: "/random-name-generator", label: "Random name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/fake-name-generator", label: "Fake name generator" },
      ]}
      content={
        <>
          <SectionTitle>Female names with a reason behind them</SectionTitle>
          <p>
            A <strong>woman name generator</strong> is most useful when the name fits the person. Each result shows where the name comes
            from and what it means: Astrid is Old Norse for &quot;divinely beautiful&quot;, Naledi is Sotho and Tswana for
            &quot;star&quot;, Amélie is Germanic for &quot;work&quot;. That makes it easy to justify a character&apos;s name, or to pick one
            you like for a better reason than its sound.
          </p>
          <SectionTitle>Four eras of names</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Classic</strong> — names that have stayed in use for generations, like Charlotte, Sofía and Anastasia.</li>
            <li><strong>Modern</strong> — names that feel current or young, like Hazel, Luna and Saoirse.</li>
            <li><strong>Vintage</strong> — names that feel older, like Edith, Odette and Ludmila, good for grandmothers and historical roles.</li>
            <li><strong>Rare</strong> — less common names, like Paloma, Embla and Calliope, for characters who should be remembered.</li>
          </ul>
          <SectionTitle>Where to use them</SectionTitle>
          <p>
            For fiction, pick a culture and an era to match a character&apos;s age and background. For forms, mock-ups and test data, the
            names are plausible full names; for a whole identity with address and email, use the{" "}
            <Link prefetch={false} href="/fake-name-generator" className={linkClass}>fake name generator</Link>. Looking for any gender or
            more variety? Try the{" "}
            <Link prefetch={false} href="/random-name-generator" className={linkClass}>random name generator</Link>, or give a new surname
            with the <Link prefetch={false} href="/last-name-generator" className={linkClass}>last name generator</Link>. For fantasy,
            sci-fi and invented worlds, the{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> is a better fit.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for three searches:"} sets={EXAMPLES} />
        </>
      }
    >
      <WomanNameGenerator />
    </GeneratorPageShell>
  );
}
