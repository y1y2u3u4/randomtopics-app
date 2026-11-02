import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomPersonGenerator from "@/components/generators/RandomPersonGenerator";
import { JOBS, personGenerator } from "@/lib/generators/randomPerson";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/random-person-generator";
const TITLE = `Random Person Generator — Name, Age, Look, Goal & Secret for Writing and Drawing`;
const DESCRIPTION = `Free random person generator for writers, game masters, actors and artists: a name, age, ${JOBS.length} possible jobs, two visual details, a personality, a goal, a secret and a habit. Pick a setting and age group. Need fake test data instead? Use the fake person generator.`;

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Random Person Generator — a person with a job, look, goal and secret" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random person generator", "random person", "random character generator", "random person description", "person generator for writers", "random person to draw", "random npc generator", "improv character generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Modern, young adults", results: personGenerator.generate({ where: ["modern"], level: ["young"] }, 3, [], 61).results },
  { label: "Fantasy, any age", results: personGenerator.generate({ where: ["fantasy"] }, 3, [], 62).results },
  { label: "Sci-fi seniors", results: personGenerator.generate({ where: ["scifi"], level: ["senior"] }, 3, [], 63).results },
];

const FAQ = [
  { question: "What does the random person generator make?", answer: "A person you can write, play or draw: a full name, an age, a job that suits the setting and age, two visual details plus a signature piece of clothing, a personality, a goal, a secret and a habit. It is a character seed, not a data record." },
  { question: "Is this the same as the fake person generator?", answer: "No. This tool is for stories, games, improv and drawing practice, so it gives personality and motives. If you need fake test data such as an address, nationality-based details and CSV or JSON for a form or database, use the fake person generator." },
  { question: "How do I use the result for drawing practice?", answer: "Take the age, the two looks and the clothing, and sketch the person as a portrait or a full figure. The job and habit tell you a pose or prop to add. Generate a new person each day to practice drawing different ages and body types." },
  { question: "Can I use it for improv or acting exercises?", answer: "Yes. Give each actor one person, and let them play the goal and hide the secret. The habit is a physical choice to repeat, and the trait gives a way of speaking. Two random people in a scene give you a conflict with no preparation." },
  { question: "Can I pick the setting and the age?", answer: "Yes. Choose modern, historical, fantasy or sci-fi, and any of five age groups from teen to senior. Jobs are matched to the age, so you will not get a teenage sea captain or a retired barista from the 1800s." },
  { question: "Are the people real?", answer: "No. Names come from a list of first names and surnames fitted to each setting, and everything else is drawn separately. Any match with a real person is a coincidence." },
];

export default function RandomPersonGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Person Generator"
      heading={["Random Person", "Generator"]}
      intro={`Get a random person with a name, age, job, look, personality, goal, secret and habit, ready for a story, a game or a sketch. Pick a setting and age group, then generate 10 at a time — free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A random person generator creates a person who does not exist. This one is built for creative use: every result has a name, an
          age, a job matched to the setting, two visual details, a personality, a goal, a secret and a habit, in modern, historical,
          fantasy or sci-fi settings. It is free, needs no sign-up and every person can be copied. For fake addresses and test data, use
          the fake person generator.
        </>
      }
      related={[
        { href: "/fake-person-generator", label: "Fake person generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/oc-name-generator", label: "OC name generator" },
        { href: "/random-superpower-generator", label: "Random superpower generator" },
        { href: "/random-character-generator", label: "Random character generator" },
      ]}
      content={
        <>
          <SectionTitle>Story person or test data?</SectionTitle>
          <p>
            People search for a <strong>random person generator</strong> for two different jobs. If you are building a character, this page
            is for you: it gives motives, looks and flaws. If you need a fake identity for a form, a spreadsheet or a software test,
            with an address, an email and a country, use the{" "}
            <Link prefetch={false} href="/fake-person-generator" className={linkClass}>fake person generator</Link>. The two do not overlap.
          </p>
          <SectionTitle>What each person gives you</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Name and age</strong> — a first name and surname that fit the setting, and an age inside your chosen group.</li>
            <li><strong>Job</strong> — {JOBS.length} jobs across four settings, each tied to ages that make sense.</li>
            <li><strong>Look</strong> — two visual details and a piece of clothing, good for a quick drawing.</li>
            <li><strong>Personality, goal, secret, habit</strong> — the pieces that give a scene something to push against.</li>
          </ul>
          <SectionTitle>Ways to use it</SectionTitle>
          <p>
            Writers can generate ten people to fill a town, then connect them by their secrets. Game masters can drop one into a
            scene when the players talk to a stranger. Artists can draw the same person at three ages. Actors can play the goal and
            conceal the secret. To name the person more freely, try the{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> or the{" "}
            <Link prefetch={false} href="/oc-name-generator" className={linkClass}>OC name generator</Link>, and add a power from the{" "}
            <Link prefetch={false} href="/random-superpower-generator" className={linkClass}>random superpower generator</Link> if the
            story needs one.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output for three settings:"} sets={EXAMPLES} />
        </>
      }
    >
      <RandomPersonGenerator />
    </GeneratorPageShell>
  );
}
