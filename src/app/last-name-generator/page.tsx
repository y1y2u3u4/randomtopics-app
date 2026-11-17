import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import LastNameGenerator from "@/components/generators/LastNameGenerator";
import { LAST_NAMES, ORIGIN_LABELS } from "@/lib/generators/lastNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import RankBoost, { faqForSchema } from "@/components/RankBoost";
import type { BoostSection } from "@/components/RankBoost";
import { LASTNAME_BOOST } from "@/data/rankBoost";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { lastNameGenerator } from "@/lib/generators/lastNames";
import AnswerFirst from "@/components/AnswerFirst";
import { spreadPick } from "@/data/popularGenerators";

const PATH = "/last-name-generator";
const TITLE = "Last Name Generator – Free Surnames with Meanings";
const DESCRIPTION = "Get random surnames with meanings and origins. Filter by culture and generate up to 20 last names for characters, stories or games. Free, no signup.";

const SOCIAL = generatorSocial({ card: "last-name-generator", title: TITLE, description: DESCRIPTION, alt: "Last Name Generator — surnames by origin with meanings" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["last name generator", "surname generator", "random last name generator", "random surname", "last names with meanings", "family name generator", "irish last name generator", "japanese last name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Irish", results: lastNameGenerator("en").generate({ origin: ["irish"] }, 4, [], 71).results },
  { label: "Italian", results: lastNameGenerator("en").generate({ origin: ["italian"] }, 4, [], 72).results },
  { label: "Japanese", results: lastNameGenerator("en").generate({ origin: ["japanese"] }, 4, [], 73).results },
];

const PICK_LAST = spreadPick(LAST_NAMES, 5, 4);
const byOrigin = (o: string) => LAST_NAMES.find((n) => n.origin === o);

const FAQ = [
  {
    question: "Can you give me a random surname?",
    answer: `Yes. Press Generate for one, or switch to 5, 10 or 20 at a time; names do not repeat until the list runs out. For example: ${PICK_LAST[1].name} or ${PICK_LAST[3].name}. Use the origin filter if you need a surname from one country.`,
  },
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

const ORIGIN_SECTION: BoostSection = {
  h2: `Last Names by Origin: ${LAST_NAMES.length} Surnames From ${Object.keys(ORIGIN_LABELS).length} Cultures`,
  id: "surnames-by-origin",
  blocks: [
    { t: "p", x: "Every origin in the filter has its own pool of real surnames. This table shows how many each contains and a few examples; press Generate for the full meaning of each." },
    {
      t: "table",
      head: ["Origin", "Surnames", "Examples"],
      rows: Object.entries(ORIGIN_LABELS).map(([id, label]) => {
        const l = LAST_NAMES.filter((n) => n.origin === id);
        return [label.en, String(l.length), l.slice(0, 5).map((n) => n.name).join(", ")];
      }),
    },
  ],
};

const ANSWER = (
  <AnswerFirst
    path={PATH}
    question="Give me a random last name"
    answer={`Here are five random last names: ${PICK_LAST.map((n) => `${n.name} (${ORIGIN_LABELS[n.origin]?.en ?? n.origin}, "${n.meaning.en}")`).join(", ")}. Press Generate above for more. All ${LAST_NAMES.length}+ are real surnames from ${Object.keys(ORIGIN_LABELS).length} cultures, each with its origin and meaning.`}
    table={{
      caption: "Example surnames by origin",
      head: ["Origin", "Example surname", "Meaning"],
      rows: ["english", "irish", "italian", "spanish", "german", "chinese"]
        .map((o) => byOrigin(o))
        .filter((n): n is NonNullable<typeof n> => Boolean(n))
        .map((n) => [ORIGIN_LABELS[n.origin]?.en ?? n.origin, n.name, n.meaning.en]),
    }}
  />
);

export default function LastNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Last Name Generator"
      heading={["Last Name", "Generator"]}
      intro={`Random last names, instantly: ${LAST_NAMES.length}+ real surnames from ${Object.keys(ORIGIN_LABELS).length} cultures, each with its meaning and origin. Filter by country, generate up to 20 at a time. Free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={[...FAQ, ...faqForSchema(LASTNAME_BOOST.faq)]}
      afterTool={ANSWER}
      related={[
        { href: "/random-name-generator", label: "Random full name generator (first + last)" },
        { href: "/japanese-name-generator", label: "Japanese name generator" },
        { href: "/german-name-generator", label: "German name generator" },
        { href: "/english-name-generator", label: "English name generator" },
        { href: "/western-baby-name-generator", label: "Western baby name generator" },
        { href: "/fake-name-generator", label: "Fake name generator" },
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
            <li><strong>Writers</strong> naming a cast — combine with the <Link prefetch={false} href="/writing" className={linkClass}>writing prompt generator</Link> for a story idea.</li>
            <li><strong>Gamers and role-players</strong> who need believable non-fantasy names for modern or historical settings.</li>
            <li><strong>Teachers</strong> creating example names for worksheets, word problems and mock trials.</li>
            <li><strong>Curious people</strong> looking up what common surnames actually mean.</li>
          </ul>
          <SectionTitle>Tips for choosing</SectionTitle>
          <p>
            Read the full name aloud — a two-syllable first name often pairs best with a longer surname and vice versa. Avoid alliteration
            unless you want a comic-book feel (Peter Parker). Search the full name once to make sure it is not already a well-known person.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Four surnames from three origins, each with its meaning:"} sets={EXAMPLES} />
          <RankBoost variant="inline" sections={[ORIGIN_SECTION, ...LASTNAME_BOOST.sections]} />
        </>
      }
    >
      <LastNameGenerator locale="en" />
    </GeneratorPageShell>
  );
}
