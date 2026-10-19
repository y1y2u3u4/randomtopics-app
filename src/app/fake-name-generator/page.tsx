import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FakeNameGenerator from "@/components/generators/FakeNameGenerator";
import { FAKE_GIVEN_COUNT, FAKE_SURNAME_COUNT, NATIONALITIES } from "@/lib/generators/fakeNames";
import { withSocial } from "@/lib/metadata/social";

const PATH = "/fake-name-generator";
const TITLE = "Fake Name Generator: Random Names & Profiles (Free)";
const DESCRIPTION = `Free fake name generator: random names from ${NATIONALITIES.length} countries with safe fake profiles (age, job, username, example.com email). Up to 100 at once, CSV/JSON export.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fake name generator", "random fake name", "fake identity generator", "fake person generator", "random name and address generator", "fake profile generator", "test data names", "fake name generator with email"],
  alternates: { canonical: PATH },
});

const COUNTRIES = NATIONALITIES.length;

const FAQ = [
  {
    question: "What is a fake name generator?",
    answer: `A fake name generator makes up realistic names for people who do not exist. This one combines ${FAKE_GIVEN_COUNT}+ common first names and ${FAKE_SURNAME_COUNT}+ real surnames from ${COUNTRIES} countries, and can add a matching fictional profile: age, birthday, city, job, username and a placeholder email.`,
  },
  {
    question: "Is it legal to use a fake name generator?",
    answer:
      "Yes, for normal uses: test data, stories, games, mock-ups, classroom examples and keeping your real name off sites that do not need it. It is not legal to use a made-up identity to commit fraud, open financial accounts, or deceive someone for money. This tool deliberately leaves out ID numbers and card numbers for that reason.",
  },
  {
    question: "Are the emails and phone numbers real?",
    answer:
      "No. Every email uses example.com, example.org or example.net, domains reserved for documentation that never deliver mail. Phone numbers appear only for the US, Canada (555-0100 to 555-0199) and the UK (07700 900000 to 900999) — ranges set aside for films and books, so you will never text a stranger.",
  },
  {
    question: "Why no Social Security numbers, credit cards or street addresses?",
    answer:
      "Fake ID and card numbers can collide with real people's data and are mostly asked for in order to get past identity checks. Testers who need them should use their payment provider's official test cards. For everything else, a name, birthday, city and placeholder contact details are enough.",
  },
  {
    question: "Can I choose the country, gender and age?",
    answer: `Yes. Pick one of ${COUNTRIES} nationalities or Any, female, male or any gender, and an age range (18–29, 30–49, 50–69, 70+). Polish, Russian and Greek surnames switch to their feminine form for women (Kowalska, Ivanova, Papadopoulou), and Chinese, Japanese, Korean and Vietnamese names also show the family-name-first order.`,
  },
  {
    question: "How do I export fake names for testing?",
    answer:
      "Set How many to 25, 50 or 100, press Generate, then use Download CSV (opens in Excel or Google Sheets) or Download JSON (for seeding a database or API mock). Copy all puts the same list on your clipboard, and Print gives a clean sheet for classrooms and tabletop games.",
  },
  {
    question: "Will I get the same name twice?",
    answer:
      "Not within one batch — duplicates are removed before you see them. Across batches a common name can come up again, just as it would in real life.",
  },
];

const COMPARE = [
  { feature: "Countries / nationalities", us: `${COUNTRIES}`, them: "Usually 10–40" },
  { feature: "Names per click", us: "Up to 100", them: "1 (some up to 50)" },
  { feature: "CSV and JSON download", us: "Yes, free", them: "Often paid or bulk-only" },
  { feature: "Gender-correct surnames (Kowalska, Ivanova)", us: "Yes", them: "Rarely" },
  { feature: "Surname meaning", us: "Yes", them: "No" },
  { feature: "ID / card numbers", us: "Never — safe by design", them: "Many generate SSN-style or card-style numbers" },
  { feature: "Emails", us: "Reserved example.com domains", them: "Real-looking domains that may belong to someone" },
  { feature: "Signup", us: "None", them: "None to required" },
];

export default function FakeNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fake Name Generator"
      heading={["Fake Name", "Generator"]}
      intro={`Random names from ${COUNTRIES} countries, with optional fake profiles. Filter by nationality, gender and age, make up to 100 at once, then copy, print or download CSV/JSON.`}
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A fake name generator creates realistic names for people who do not exist. Choose a nationality, gender and age range and get up to
          100 names at once, each with an optional profile (birthday, city, job, username, example.com email). No ID or card numbers, no
          signup, free CSV and JSON export.
        </>
      }
      related={[
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
        { href: "/western-baby-name-generator", label: "Western baby name generator" },
        { href: "/japanese-name-generator", label: "Japanese name generator" },
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/writing", label: "Writing prompt generator" },
      ]}
      content={
        <>
          <SectionTitle>What you get with each fake name</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>A believable full name</strong> — common first names for each country paired with real surnames from the same culture.</li>
            <li><strong>Age and birthday</strong> that agree with each other, inside the age range you choose.</li>
            <li><strong>City and nationality</strong> — {NATIONALITIES.slice(0, 10).map((n) => n.label).join(", ")} and {COUNTRIES - 10} more.</li>
            <li><strong>Job, username and email</strong> — usernames are plain ASCII so they work in any form; emails always end in example.com, .org or .net.</li>
            <li><strong>Phone</strong> for the US, Canada and the UK only, from number ranges reserved for fiction.</li>
            <li><strong>Surname meaning</strong>, a small detail writers like (Kowalski = smith, Yamamoto = base of the mountain).</li>
          </ul>

          <SectionTitle>Safe fake data, on purpose</SectionTitle>
          <p>
            Some fake identity sites still print Social Security-style numbers, card numbers and full street addresses. Those can match a real
            person, and they are mostly wanted to get past verification checks. This generator stops at what a story, a form demo or a test
            database actually needs. If you are testing payments, use your provider&apos;s official test cards instead.
          </p>

          <SectionTitle>Who uses a fake name generator?</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Developers and QA testers</strong> filling sign-up forms, seeding a staging database or building UI mock-ups — download 100 rows as CSV or JSON.</li>
            <li><strong>Writers</strong> naming background characters fast; for heroes and villains try the <Link href="/character-name-generator" className={linkClass}>character name generator</Link>.</li>
            <li><strong>Teachers</strong> making example names for worksheets, word problems and mock trials, without using real students&apos; names.</li>
            <li><strong>Game masters and role-players</strong> who need a modern NPC with a job and a hometown in two seconds.</li>
            <li><strong>Privacy-minded people</strong> who want a placeholder name for a forum, a raffle or a coffee-shop order.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical fake name sites</th>
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

          <SectionTitle>Tips for realistic fake names</SectionTitle>
          <p>
            Match the nationality to the setting — a Toronto office in your test data should be mostly Canadian names, with a few from other
            countries for realism. Use the age filter so a &quot;retired teacher&quot; is not 24. For Slavic and Greek names, keep the
            feminine surname (Anna Nowak but Anna Kowalska); getting this wrong is the fastest way for a reader to spot a made-up name.
          </p>
        </>
      }
    >
      <FakeNameGenerator />
    </GeneratorPageShell>
  );
}
