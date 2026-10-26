import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FakeNameGenerator from "@/components/generators/FakeNameGenerator";
import { ADDRESS_COUNTRIES } from "@/lib/generators/fakeAddresses";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/fake-identity-generator";
const TITLE = "Fake Identity Generator: Full Random Identities (Free, Safe)";
const COUNTRIES = ADDRESS_COUNTRIES.length;
const DESCRIPTION = `Free fake identity generator: full fictional people from ${COUNTRIES} countries — name, address, job, email, height, star sign and more. No SSN or card numbers.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fake identity generator", "random identity generator", "fake id generator", "fake profile generator", "fake info generator", "fake details generator", "random person with address", "test identity data"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "What does a fake identity include?",
    answer:
      "Each identity has a full name, gender, age and birthday, a street address with a postcode that fits the city, a job, a username, a placeholder email, a phone number for the US, Canada and the UK, plus height, weight, blood type, eye and hair colour, star sign, generation, favourite colour, personality and a hobby. Everything agrees with everything else: the star sign matches the birthday, the generation matches the year, the postcode matches the city.",
  },
  {
    question: "Is a fake identity generator legal?",
    answer:
      "Making up fictional people for tests, stories, games, classes and mock-ups is legal. Using a made-up identity to open accounts, pass identity checks, get credit or deceive someone is fraud. This generator leaves out Social Security, passport, driving licence and card numbers so its output cannot be used for that.",
  },
  {
    question: "Why are there no SSN, ID or credit card numbers?",
    answer:
      "Randomly generated ID and card numbers can match real people, and the main reason people want them is to get past verification. Developers testing payments should use the official test cards from Stripe, PayPal or their own provider; testers who need an ID field can use an obviously fake value such as 000-00-0000.",
  },
  {
    question: "Are the details realistic?",
    answer:
      "They are drawn from real-world distributions: heights shift by country, weights come from a healthy BMI range, blood types follow population frequencies (O+ and A+ most common), and eye and hair colours depend on the country. Generations use Pew Research year boundaries.",
  },
  {
    question: "Can I generate identities for a specific country?",
    answer: `Yes — ${COUNTRIES} countries, from the United States, United Kingdom and Canada to Germany, Japan, Brazil and India. Pick a country, a gender and an age range; every identity in the batch follows them.`,
  },
  {
    question: "How do I export fake identities?",
    answer:
      "Choose up to 100, press Generate and use Download CSV for a spreadsheet with one column per field (26 columns), or Download JSON to seed a database or API mock. Copy all and Print work too.",
  },
  {
    question: "Will the same name keep its details if I switch options?",
    answer:
      "Yes. Turning the address or details on and off does not reshuffle the names, so you can start with names only and add the rest once you like the list.",
  },
];

const COMPARE = [
  { feature: "Fields per identity", us: "20+ (name to hobby)", them: "10–30" },
  { feature: "Postcode matches the city", us: "Yes", them: "Often random" },
  { feature: "Star sign and generation match the birthday", us: "Yes", them: "Often inconsistent" },
  { feature: "Identities per click", us: "Up to 100", them: "1" },
  { feature: "SSN / card / passport numbers", us: "Never", them: "Usually printed" },
  { feature: "CSV and JSON download", us: "Yes, free", them: "Bulk export often paid" },
  { feature: "Signup", us: "None", them: "None to required" },
];

export default function FakeIdentityGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fake Identity Generator"
      heading={["Fake Identity", "Generator"]}
      intro={`Complete fictional people from ${COUNTRIES} countries: name, birthday, address, job, contact details and personal details that all agree. Up to 100 at once, copy, print or download CSV/JSON.`}
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A fake identity generator creates a whole fictional person. This one gives each identity a name, birthday, matching address and
          postcode, job, username, placeholder email, height, blood type, star sign and more, consistent with one another and with the
          country you pick. It never prints SSN, ID or card numbers. Free, no signup, CSV and JSON export.
        </>
      }
      related={[
        { href: "/fake-name-generator", label: "Fake name generator" },
        { href: "/fake-address-generator", label: "Fake address generator" },
        { href: "/fake-person-generator", label: "Fake person generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/last-name-generator", label: "Last name generator" },
      ]}
      content={
        <>
          <SectionTitle>Every field, and where it comes from</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Name</strong> — common first names and real surnames from the chosen country, with feminine surname forms where the language has them.</li>
            <li><strong>Birthday, age, star sign, generation</strong> — calculated from one date, so they never contradict each other.</li>
            <li><strong>Address</strong> — invented street, real city, postcode from that city&apos;s range, in the country&apos;s own layout. See the <Link prefetch={false} href="/fake-address-generator" className={linkClass}>fake address generator</Link> for formats.</li>
            <li><strong>Job, username, email, phone</strong> — emails on reserved example.com domains; phones only from ranges set aside for fiction.</li>
            <li><strong>Height, weight, blood type, eyes, hair</strong> — height, eye and hair colour follow the country; blood types follow real population frequencies.</li>
            <li><strong>Favourite colour, personality, hobby</strong> — small details that make a test user or an NPC feel like a person.</li>
          </ul>

          <SectionTitle>Good uses for a fake identity</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Software testing</strong> — seed a staging database, test sign-up and profile pages, demo a CRM with believable records.</li>
            <li><strong>Design and screenshots</strong> — fill a dashboard without showing real customers.</li>
            <li><strong>Fiction and role-play</strong> — a background character with a home, a job and a blood type for the hospital scene.</li>
            <li><strong>Teaching</strong> — form-filling, data-handling and privacy lessons with data that belongs to nobody.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical fake identity sites</th>
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

          <SectionTitle>What we leave out, and why</SectionTitle>
          <p>
            Social Security, national ID, passport, driving licence and card numbers are not generated. A random number in a valid format can
            belong to a real person, and none of the legitimate uses above need one. If you only need names, the{" "}
            <Link prefetch={false} href="/fake-name-generator" className={linkClass}>fake name generator</Link> is faster; for a character without an address, try
            the <Link prefetch={false} href="/fake-person-generator" className={linkClass}>fake person generator</Link>.
          </p>
        </>
      }
    >
      <FakeNameGenerator variant="identity" />
    </GeneratorPageShell>
  );
}
