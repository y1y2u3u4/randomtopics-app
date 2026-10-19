import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FakeNameGenerator from "@/components/generators/FakeNameGenerator";
import { NATIONALITIES } from "@/lib/generators/fakeNames";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/fake-person-generator";
const TITLE = "Fake Person Generator: Random People With Personality (Free)";
const COUNTRIES = NATIONALITIES.length;
const DESCRIPTION = `Free fake person generator: random people from ${COUNTRIES} countries with a name, job, personality, hobby, height and star sign. Up to 100 at once, CSV/JSON.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fake person generator", "random person generator", "random people generator", "fake people generator", "random human generator", "random person with personality", "npc generator modern", "fake person details"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "What does the fake person generator make?",
    answer:
      "A random person who does not exist: full name, gender, age and birthday, home city, job, a two-word personality, a hobby, height, weight, eye and hair colour, blood type, star sign, generation and favourite colour. Turn on Address if you also want a street address and postcode.",
  },
  {
    question: "Is this person real?",
    answer:
      "No. The names are common first names and real surnames combined at random, and every other detail is drawn separately. Any match with a real person is coincidence, the same way two people in a phone book can share a name.",
  },
  {
    question: "Does it show a face?",
    answer:
      "No. AI-generated faces can resemble real people and are often reused for fake accounts, so this tool sticks to words. Writers and game masters usually find a personality and a hobby more useful than a photo anyway.",
  },
  {
    question: "Can I use it for story characters and NPCs?",
    answer:
      "Yes — it is built for modern settings. Pick a nationality and age range, generate ten people and you have a café full of background characters, each with a job, a temperament and something they do at weekends. For fantasy names, use the character name generator.",
  },
  {
    question: "Can I choose the country, gender and age?",
    answer: `Yes. Choose one of ${COUNTRIES} nationalities or Any, female, male or any, and an age range from 18–29 to 70+. Heights, eye and hair colours follow the country, and the generation and star sign follow the birthday.`,
  },
  {
    question: "How do I save the people I generate?",
    answer:
      "Copy one person, Copy all, Print a clean sheet, or download CSV or JSON with one column per detail. Turning Address on or off keeps the same names, so you can add addresses later without losing your list.",
  },
];

const COMPARE = [
  { feature: "Personality and hobby", us: "Yes", them: "Rarely" },
  { feature: "Height, eye and hair colour by country", us: "Yes, real patterns", them: "Uniform random or missing" },
  { feature: "Star sign and generation match the birthday", us: "Yes", them: "Often inconsistent" },
  { feature: "People per click", us: "Up to 100", them: "1" },
  { feature: "AI face photos", us: "No — avoids lookalikes of real people", them: "Some show generated faces" },
  { feature: "CSV and JSON download", us: "Yes, free", them: "Rare" },
];

export default function FakePersonGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fake Person Generator"
      heading={["Fake Person", "Generator"]}
      intro={`Random people from ${COUNTRIES} countries, each with a name, age, job, personality, hobby and physical details. Make up to 100 at once, then copy, print or download CSV/JSON.`}
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A fake person generator invents people who do not exist. Each one here has a name, age, birthday, city and job plus a
          personality, a hobby, height, weight, blood type, eye and hair colour and star sign, all consistent with the country and the
          birthday. Add an address with one tick. No faces, no ID numbers, no signup.
        </>
      }
      related={[
        { href: "/fake-name-generator", label: "Fake name generator" },
        { href: "/fake-identity-generator", label: "Fake identity generator" },
        { href: "/fake-address-generator", label: "Fake address generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/story-prompt-generator", label: "Story prompt generator" },
      ]}
      content={
        <>
          <SectionTitle>What makes a fake person believable</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Consistency</strong> — a 1990 birthday makes a Millennial, a 4 August birthday makes a Leo. Readers and testers notice when these clash.</li>
            <li><strong>Local detail</strong> — Dutch, German and Scandinavian people skew taller, and brown eyes and dark hair are the norm across much of Asia, Latin America and the Middle East; the generator follows those patterns.</li>
            <li><strong>Something to do</strong> — a job and a hobby give a character a reason to be in the scene.</li>
            <li><strong>A temperament</strong> — two personality words (&quot;easygoing and witty&quot;) are enough to write dialogue.</li>
          </ul>

          <SectionTitle>Ways to use random people</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Writers</strong> filling a scene with background characters; pair them with a <Link href="/story-prompt-generator" className={linkClass}>story prompt</Link>.</li>
            <li><strong>Game masters</strong> running modern or near-future campaigns who need an NPC in seconds.</li>
            <li><strong>UX researchers and marketers</strong> sketching personas before real interviews.</li>
            <li><strong>Developers</strong> who want profile pages that look lived-in; add addresses with the <Link href="/fake-identity-generator" className={linkClass}>fake identity generator</Link>.</li>
            <li><strong>Teachers and drama groups</strong> handing out role cards for improv, mock interviews or class debates.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical random person sites</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.feature} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3">{r.feature}</td><td className="py-2 pr-3 text-[var(--text-primary)]">{r.us}</td><td className="py-2">{r.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    >
      <FakeNameGenerator variant="person" />
    </GeneratorPageShell>
  );
}
