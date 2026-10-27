import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomCountryGenerator from "@/components/generators/RandomCountryGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-country-generator";
const TITLE = "Random Country Generator — Pick a Country with Flag & Capital";
const DESCRIPTION =
  "Spin up a random country from all 195 in the world, with its flag, capital, continent and population band. Filter by continent or size, draw several at once, and no country repeats until you have seen them all.";

const SOCIAL = generatorSocial({ card: "random-country-generator", title: TITLE, description: DESCRIPTION, alt: "Random Country Generator — world flags" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random country generator", "random country", "random country picker", "country picker", "pick a random country", "random country with flag", "random country generator by continent"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How many countries does the random country generator include?",
    answer:
      "195: the 193 member states of the United Nations plus the two UN observer states, Vatican City and Palestine. Territories and partially recognised places (such as Taiwan, Kosovo or Greenland) are not in the list, so every result is a country that sits in the UN system.",
  },
  {
    question: "Can I get a random country from one continent?",
    answer:
      "Yes. Select one or more continents (Africa has 54 countries, Asia 47, Europe 45, North America 23, Oceania 14 and South America 12 in this list) and press Generate. Transcontinental countries appear under the continent they are most commonly grouped with.",
  },
  {
    question: "What are the population bands?",
    answer:
      "Rounded 2024 estimates in five groups: under 1 million, 1–10 million, 10–50 million, 50–100 million and over 100 million. Bands are meant for filtering, for example to find small countries you might not know, and are not exact counts.",
  },
  {
    question: "Does it show the flag and the capital?",
    answer: "Every result shows the flag emoji, the capital city and the continent. Where a country has more than one capital in practice, such as Bolivia, the note says so.",
  },
  {
    question: "Will the same country come up twice?",
    answer: "Not until every country in your current filter has been shown, which is like drawing names from a hat. Change the filters or reload the page to start the pool again.",
  },
  {
    question: "What can I use it for?",
    answer: "Choosing a destination for a holiday daydream, geography quizzes and classroom 'country of the day' routines, picking a country for a research project, or deciding which cuisine to cook this weekend.",
  },
];

export default function RandomCountryGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Country Generator"
      heading={["Random Country", "Generator"]}
      intro="Pick a random country from all 195, with its flag, capital and continent. Filter by continent or population and draw several at once."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Press Generate to get a random real country with its flag, capital and continent. Choose a continent or a population band to narrow the draw, ask for 1, 5, 10 or 20 at once, and copy the list or share a link. The pool covers all 193 UN member states plus Vatican City and Palestine."
      related={[
        { href: "/random-city-generator", label: "Random city generator" },
        { href: "/random-state-generator", label: "Random state generator" },
        { href: "/country-name-generator", label: "Fictional country names" },
        { href: "/random-food-generator", label: "Random food generator" },
        { href: "/wheel-of-names", label: "Wheel of names" },
      ]}
      content={
        <>
          <SectionTitle>What you get with every country</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Flag</strong> — shown as an emoji, so it works on phones and projectors without loading images.</li>
            <li><strong>Capital</strong> — handy for quick quizzes (&lsquo;Can you name the capital before you press again?&rsquo;).</li>
            <li><strong>Continent</strong> — six groupings: Africa, Asia, Europe, North America, South America and Oceania.</li>
            <li><strong>Population band</strong> — from under one million to over one hundred million, to spot the giants and the micro-states.</li>
          </ul>
          <SectionTitle>Ways to use a random country</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Geography class</strong> — a &lsquo;country of the day&rsquo; warm-up: find it on the map, name two neighbours, say one thing you know.</li>
            <li><strong>Travel inspiration</strong> — filter to a continent you have never visited and use the result as the start of a research rabbit hole.</li>
            <li><strong>Cook the world</strong> — draw a country each week and cook a dish from it; the <Link prefetch={false} href="/random-food-generator" className={linkClass}>random food generator</Link> has ideas.</li>
            <li><strong>Quiz nights</strong> — ask for 10 countries, read out the flags and let teams guess the capitals.</li>
            <li><strong>Writing and worldbuilding</strong> — set a story in the country you draw, or pick two for a cultural contrast.</li>
          </ul>
          <SectionTitle>Real countries or invented ones?</SectionTitle>
          <p>
            This page draws from the world as it is. For made-up nations, kingdoms and republics, use the <Link prefetch={false} href="/country-name-generator" className={linkClass}>country name generator</Link>.
            To pick a town instead, try the <Link prefetch={false} href="/random-city-generator" className={linkClass}>random city generator</Link>, or stay within the United States with the
            {" "}<Link prefetch={false} href="/random-state-generator" className={linkClass}>random state generator</Link>.
          </p>
          <p>Facts such as capitals and populations change over time; treat the bands as approximate and check an official source for anything you publish.</p>
        </>
      }
    >
      <RandomCountryGenerator />
    </GeneratorPageShell>
  );
}
