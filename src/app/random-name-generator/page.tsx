import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomNameGenerator from "@/components/generators/RandomNameGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-name-generator";
const TITLE = "Random Name Generator — First & Last Names by Gender and Origin";
const DESCRIPTION =
  "Free random name generator: get realistic first and last names from 24 countries and regions, filter by gender and origin, and see what each surname means. Generate up to 20 names at once for characters, tests and games.";

const SOCIAL = generatorSocial({ card: "random-name-generator", title: TITLE, description: DESCRIPTION, alt: "Random Name Generator — name cards from many countries" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random name generator", "random name", "random first and last name generator", "random name generator male female", "name generator", "random full name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the random name generator work?",
    answer:
      "It picks a common first name used in one country, then pairs it with a real surname from the same culture, so results such as Aoife Murphy or Takeshi Tanaka sound natural. Filters narrow the draw by gender and country of origin, and names do not repeat until the pool is used up.",
  },
  {
    question: "Can I get only male or only female names?",
    answer: "Yes. Choose Female or Male under Gender. Leave both unselected for a mix. You can also pick one or more origins, such as Irish and Italian, to keep the names within those cultures.",
  },
  {
    question: "Are these real people?",
    answer:
      "No. Each name is assembled from separate first-name and surname lists, so a result may happen to match a real person, but it does not describe anyone. For a full placeholder profile with an age, city and example.com email, use the fake name generator.",
  },
  {
    question: "Can I generate just first names or just last names?",
    answer: "Yes. Under 'Show', choose First name only or Last name only. The surname meaning still appears on the full-name results.",
  },
  {
    question: "Why are some Chinese, Japanese or Korean names written family name first?",
    answer: "That is the order used in those languages, and the generator follows it. The country flag and label on each result tell you which naming convention applies.",
  },
  {
    question: "What is a random name generator useful for?",
    answer: "Naming characters in stories and games, filling test data and slide mock-ups, picking a name for a baby-name shortlist, creating practice students for worksheets, and giving each guest a character at a party.",
  },
];

export default function RandomNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Name Generator"
      heading={["Random Name", "Generator"]}
      intro="Realistic first and last names from 24 countries and regions. Filter by gender and origin, and see what each surname means."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Press Generate for random first and last names that fit together, such as Niamh Kelly or Mateo Herrera. Narrow them by gender and by country of origin, show only first or last names, and copy the whole list or a link that reproduces it. Each surname comes with its meaning."
      related={[
        { href: "/fake-name-generator", label: "Fake name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/fantasy-name-generator", label: "Fantasy name generator" },
        { href: "/random-name-picker", label: "Random name picker" },
      ]}
      content={
        <>
          <SectionTitle>Names that sound like they belong together</SectionTitle>
          <p>
            Most <strong>random name generators</strong> mix any first name with any surname, which gives results like &lsquo;Kenji O&apos;Brien&rsquo; that no one would ever be called. This one
            keeps each culture together: the first names are common choices in that country, and the surname comes from that country&apos;s surname bank. The result reads like a real
            name list from a school register, a company directory or a sports team.
          </p>
          <SectionTitle>Options</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Gender</strong> — female, male, or both.</li>
            <li><strong>Origin</strong> — choose any of 24 countries and regions, from American and British to Nigerian, Indian, Korean and Brazilian. Pick several to blend them.</li>
            <li><strong>Show</strong> — full name, first name only or last name only.</li>
            <li><strong>How many</strong> — 1, 5, 10 or 20 at a time; the pool stays no-repeat until every name has been seen.</li>
          </ul>
          <SectionTitle>Ideas for using the names</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Writers and game masters</strong> — generate ten and keep the two that suggest a personality. For made-up worlds, try the <Link prefetch={false} href="/fantasy-name-generator" className={linkClass}>fantasy name generator</Link>.</li>
            <li><strong>Teachers</strong> — build word problems and case studies with a varied cast instead of the same Sam and Emma.</li>
            <li><strong>Designers and developers</strong> — fill a mock-up or a database with plausible names; for emails and birthdays too, use the <Link prefetch={false} href="/fake-name-generator" className={linkClass}>fake name generator</Link>.</li>
            <li><strong>Party games</strong> — give each guest a secret identity for the evening.</li>
          </ul>
          <p>Names are a starting point: check spelling and cultural fit before you publish a character, and avoid using a generated name to impersonate a real person.</p>
        </>
      }
    >
      <RandomNameGenerator />
    </GeneratorPageShell>
  );
}
