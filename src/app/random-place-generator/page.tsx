import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomPlaceGenerator from "@/components/generators/RandomPlaceGenerator";
import { PLACES, placeGenerator } from "@/lib/generators/randomPlace";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/random-place-generator";
const TITLE = `Random Place Generator — ${PLACES.length} Places: Everyday, Real Landmarks & Fantasy`;
const DESCRIPTION = `Free random place generator with ${PLACES.length} places, each with a one-line description: everyday settings, real landmarks and cities, natural wonders, and fantasy or sci-fi locations. Filter by type and mood for writing prompts, drawing and games.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Random Place Generator — places with descriptions" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random place generator", "random location generator", "random setting generator", "writing prompt place", "random place to draw", "random landmark generator", "random fantasy location generator", "where in the world generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Cozy everyday", results: placeGenerator.generate({ category: ["everyday"], mood: ["cozy"] }, 4, [], 71).results },
  { label: "Real landmarks", results: placeGenerator.generate({ category: ["landmark"] }, 4, [], 72).results },
  { label: "Eerie fantasy", results: placeGenerator.generate({ category: ["fantasy"], mood: ["eerie"] }, 4, [], 73).results },
];

const FAQ = [
  {
    question: "What is a random place generator?",
    answer:
      "It is a tool that picks a place at random for you. Here each result has a short description, so you can use it as a setting for a story, a scene to draw, a place to daydream about or a game prompt, not just a name.",
  },
  {
    question: "Are the real places and facts accurate?",
    answer:
      "Yes. The landmarks, cities and natural wonders are real, and the one-line facts are well-documented ones, such as the Eiffel Tower's height or the age of the Colosseum. The everyday and fantasy places are invented for this tool, and the descriptions are not factual.",
  },
  {
    question: "How can I use it for writing prompts?",
    answer:
      "Draw a place, then add a character and a problem. A laundromat at 2 a.m. plus a lost wedding ring is already a scene. Filter by mood to match your genre: eerie for horror and mystery, cozy for slice-of-life, busy for comedy and chases.",
  },
  {
    question: "Can I use it for drawing?",
    answer:
      "Yes. The everyday and fantasy places are written as visual scenes with sensory details, so each is a ready-made sketch prompt. For a challenge, draw the same place from two perspectives, such as inside and from the air.",
  },
  {
    question: "What types of places are included?",
    answer:
      "There are four types: everyday places (a bus station at midnight), real landmarks and cities (Machu Picchu, Kyoto), natural wonders (Lake Baikal, Uluru) and fantasy or sci-fi locations (a lighthouse on a forgotten star). Use the type and mood filters to narrow the list.",
  },
  {
    question: "Can I play a game with it?",
    answer:
      "Try 'where would you rather be': draw two places and have each player argue for theirs. Or play 'two truths and a lie' with a real landmark, or ask each guest at a party to tell a story set in the place that comes up.",
  },
];

export default function RandomPlacePage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Place Generator"
      heading={["Random Place", "Generator"]}
      intro={`Get a random place with a one-line description from a list of ${PLACES.length}: everyday settings, real landmarks, natural wonders and fantasy locations. Filter by type and mood, 10 per click, free and no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A random place generator picks a setting for you. This one has {PLACES.length} places in four types (everyday, real landmarks and cities,
          natural wonders, fantasy and sci-fi), each with a one-line description and a mood tag you can filter by. Use it for writing prompts,
          drawing ideas, travel daydreams and party games. It is free, with no sign-up.
        </>
      }
      related={[
        { href: "/city-name-generator", label: "City name generator" },
        { href: "/random-city-generator", label: "Random city generator" },
        { href: "/country-name-generator", label: "Country name generator" },
        { href: "/fantasy-world-generator", label: "Fantasy world generator" },
      ]}
      content={
        <>
          <SectionTitle>More than a name</SectionTitle>
          <p>
            Most <strong>random place generators</strong> output just a name, which leaves you to invent everything else. These places arrive with
            a line of scene-setting, so a result such as &quot;a ferry crossing in the fog&quot; already has a sound, a mood and a hint of plot.
            The real places come with a verifiable fact.
          </p>
          <SectionTitle>Four types of place</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Everyday places:</strong> laundromats, diners, night buses. Great for realistic fiction and drawing.</li>
            <li><strong>Landmarks and cities:</strong> real destinations, from Petra to Reykjavík, for travel dreams and quizzes.</li>
            <li><strong>Natural wonders:</strong> real canyons, falls, lakes and mountains with an accurate headline fact.</li>
            <li><strong>Fantasy and sci-fi:</strong> invented locations for games, stories and worldbuilding.</li>
          </ul>
          <SectionTitle>Ways to use a random place</SectionTitle>
          <p>
            Write a 300-word scene that must take place there. Sketch it in ten minutes. Use it as the opening location of a role-playing session. Pick
            a real landmark as your next trip daydream. Or play a round of &quot;where would you rather be&quot; with friends. The mood
            filter (cozy, eerie, busy, awe-inspiring) helps you match the setting to the genre you want.
          </p>
          <SectionTitle>Names, cities and whole worlds</SectionTitle>
          <p>
            Need a name for the town where your scene happens? Try the{" "}
            <Link prefetch={false} href="/city-name-generator" className={linkClass}>city name generator</Link>, or build one with the{" "}
            <Link prefetch={false} href="/random-city-generator" className={linkClass}>random city generator</Link>. The{" "}
            <Link prefetch={false} href="/country-name-generator" className={linkClass}>country name generator</Link> names the nation around it, and
            the <Link prefetch={false} href="/fantasy-world-generator" className={linkClass}>fantasy world generator</Link> creates a whole setting
            when one place is not enough.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Real output for three filters:" sets={EXAMPLES} />
        </>
      }
    >
      <RandomPlaceGenerator />
    </GeneratorPageShell>
  );
}
