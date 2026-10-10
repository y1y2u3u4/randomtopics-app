import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import LastNameGenerator from "@/components/generators/LastNameGenerator";
import { LAST_NAMES, ORIGIN_LABELS } from "@/lib/generators/lastNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/last-name-generator";
const TITLE = "Last Name Generator — Random Surnames by Origin, with Meanings";
const DESCRIPTION = `Free last name generator with ${LAST_NAMES.length}+ real surnames from ${Object.keys(ORIGIN_LABELS).length} cultures — English, Irish, Italian, Spanish, Japanese, Korean and more — each with its meaning and origin. For characters, games and family-tree curiosity.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["last name generator", "surname generator", "random last name generator", "random surname", "last names with meanings", "family name generator", "irish last name generator", "japanese last name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does the last name generator work?",
    answer: `Choose one or more origins (or leave it on All) and press Generate. You get real surnames drawn at random from a list of ${LAST_NAMES.length}+, each with where it comes from and what it originally meant. Names do not repeat until you have seen every name that matches your filters.`,
  },
  {
    question: "Are these real last names?",
    answer:
      "Yes. Every surname is a real family name in use today, from very common ones like Smith, García and Kim to rarer names that work well for fictional characters. Meanings follow the most widely accepted etymology; where scholars disagree the meaning says 'possibly'.",
  },
  {
    question: "Is a surname generator different from a last name generator?",
    answer:
      "No — surname, last name and family name mean the same thing. In many cultures, such as Japanese, Chinese, Korean and Hungarian, the family name is traditionally written first, but it is still the surname.",
  },
  {
    question: "How do I pick a good last name for a character?",
    answer:
      "Match the origin to your character's background, check the meaning for a hidden hint (a 'Smith' who forges, a 'Fox' who schemes), and say the full name aloud with the first name. Our character name generator pairs first and last names for you.",
  },
  {
    question: "Can I share or save the names I generated?",
    answer:
      "Yes. Copy results gives you the names with their meanings as text, and Copy share link creates a URL that shows exactly the same names to anyone who opens it.",
  },
];

export default function LastNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Last Name Generator"
      heading={["Last Name", "Generator"]}
      intro={`${LAST_NAMES.length}+ real surnames from ${Object.keys(ORIGIN_LABELS).length} cultures, each with its meaning and origin. Filter by country, generate up to 20 at a time.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/writing-topic-generator", label: "Writing topic generator" },
        { href: "/topics/writing-prompts-for-kids", label: "Writing prompts for kids" },
      ]}
      content={
        <>
          <SectionTitle>Real surnames, with the story behind them</SectionTitle>
          <p>
            A last name carries a little history: the job an ancestor did (Miller, Schmidt, Ferrari), the place they lived (Hill, Yamamoto,
            Costa), their father&apos;s name (Johnson, Fernández, O&apos;Brien) or a nickname that stuck (Reid for red hair, Russo for the same).
            This <strong>last name generator</strong> shows that story next to every name, so you are not just picking a sound — you are
            picking a background.
          </p>
          <SectionTitle>Surnames by origin</SectionTitle>
          <p>
            Filter by {Object.values(ORIGIN_LABELS).slice(0, 12).map((o) => o.en).join(", ")} and more. Select several origins at once for a
            mixed-heritage family, or leave it on All for a surprise. Each list mixes very common surnames with distinctive ones that are less
            likely to clash with famous people.
          </p>
          <SectionTitle>Who uses a surname generator?</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Writers</strong> naming a cast — combine with the <Link href="/writing" className={linkClass}>writing prompt generator</Link> for a story idea.</li>
            <li><strong>Gamers and role-players</strong> who need believable non-fantasy names for modern or historical settings.</li>
            <li><strong>Teachers</strong> creating example names for worksheets, word problems and mock trials.</li>
            <li><strong>Curious people</strong> looking up what common surnames actually mean.</li>
          </ul>
          <SectionTitle>Tips for choosing</SectionTitle>
          <p>
            Read the full name aloud — a two-syllable first name often pairs best with a longer surname and vice versa. Avoid alliteration
            unless you want a comic-book feel (Peter Parker). Search the full name once to make sure it is not already a well-known person.
          </p>
        </>
      }
    >
      <LastNameGenerator locale="en" />
    </GeneratorPageShell>
  );
}
