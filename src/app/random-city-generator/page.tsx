import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomCityGenerator from "@/components/generators/RandomCityGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-city-generator";
const TITLE = "Random City Generator — Real Cities Worldwide by Country";
const DESCRIPTION =
  "Get a random real city from 176 countries. Filter by continent or country, show capitals only, and draw 1, 5, 10 or 20 at once. Great for travel ideas, geography games and quiz nights.";

const SOCIAL = generatorSocial({ card: "random-city-generator", title: TITLE, description: DESCRIPTION, alt: "Random City Generator — skyline and flags" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random city generator", "random city", "random city picker", "random city in the world", "random city by country", "pick a random city", "random capital city generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "Does the random city generator use real cities?",
    answer: "Yes. Every result is a real, well-known city: world capitals plus the major cities of each country. For invented town and city names for stories and maps, use the city name generator instead.",
  },
  {
    question: "Can I get a random city in a specific country?",
    answer: "Yes. Open the Country filter and select one or more countries. Leave it empty for the whole world. The list covers 176 countries, including 15 cities for the United States and several each for large countries such as China, India and Australia.",
  },
  {
    question: "Can I get only capital cities?",
    answer: "Choose 'Capitals only' under Type. The pool then contains the capital of every country in the list, which is perfect for capital-city quizzes.",
  },
  {
    question: "Is every city in the world included?",
    answer: "No — this is a curated list of 339 recognisable cities, chosen so a result is a place most people can find on a map. It is not a database of every town.",
  },
  {
    question: "What is a random city generator good for?",
    answer: "Travel brainstorming, 'where in the world' geography games, picking a setting for a story, choosing a city to research for a class project, or settling where to virtually travel on a Friday night.",
  },
];

export default function RandomCityGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random City Generator"
      heading={["Random City", "Generator"]}
      intro="Draw a random real city from around the world. Filter by continent or country, or show capitals only."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Press Generate for a random real city with its country and flag. Narrow it to a continent, one or more countries, or capitals only, and draw 1, 5, 10 or 20 at a time. The list holds 339 well-known cities from 176 countries, and no city repeats until you have seen them all."
      related={[
        { href: "/random-country-generator", label: "Random country generator" },
        { href: "/city-name-generator", label: "Fictional city names" },
        { href: "/random-state-generator", label: "Random state generator" },
        { href: "/fantasy-map-maker", label: "Fantasy map maker" },
        { href: "/random-food-generator", label: "Random food generator" },
      ]}
      content={
        <>
          <SectionTitle>How the city list is built</SectionTitle>
          <p>
            The pool is a hand-checked set of 339 cities: the capital of nearly every country in it (173 of them) plus other large or famous cities, such as Sydney, Istanbul, Toronto and
            Mumbai. Each city is tied to its country and continent, so the filters always match the result you see. Countries with many big cities, such as the United States, China,
            India and Australia, have several entries; small countries usually have just their capital.
          </p>
          <SectionTitle>Filters</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Continent</strong> — draw only from Africa, Asia, Europe, North America, South America or Oceania, or combine them.</li>
            <li><strong>Country</strong> — pick specific countries; ideal for &lsquo;a random city in Italy&rsquo; style requests.</li>
            <li><strong>Type</strong> — any city, or capitals only for geography drills.</li>
          </ul>
          <SectionTitle>Fun ways to use a random city</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Armchair travel</strong> — draw a city, then look up its weather, food and a famous street. Repeat every week.</li>
            <li><strong>Geography games</strong> — draw five capitals and have players name the country and the continent before revealing the answers.</li>
            <li><strong>Story settings</strong> — begin a short story in the city you draw, then add a surprise from the <Link prefetch={false} href="/writing" className={linkClass}>writing prompt generator</Link>.</li>
            <li><strong>Project topics</strong> — students each draw a city and present three facts.</li>
          </ul>
          <p>
            Want a whole country instead? Use the <Link prefetch={false} href="/random-country-generator" className={linkClass}>random country generator</Link>. Need an invented city for a novel or a game map?
            The <Link prefetch={false} href="/city-name-generator" className={linkClass}>city name generator</Link> makes fictional names.
          </p>
        </>
      }
    >
      <RandomCityGenerator />
    </GeneratorPageShell>
  );
}
