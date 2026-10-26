import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FakeNameGenerator from "@/components/generators/FakeNameGenerator";
import { ADDRESS_COUNTRIES } from "@/lib/generators/fakeAddresses";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/fake-address-generator";
const TITLE = "Fake Address Generator: Random Addresses by Country (Free)";
const COUNTRIES = ADDRESS_COUNTRIES.length;
const DESCRIPTION = `Free fake address generator: random addresses in ${COUNTRIES} countries with postcodes that match the city and the local layout. Up to 100 at once, CSV/JSON export.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["fake address generator", "random address generator", "fake us address", "fake uk address", "random address", "fake address with zip code", "fake shipping address for testing", "address generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "What is a fake address generator?",
    answer: `It makes up postal addresses that look right but do not belong to anyone. Each address here has a fictional street name, a real city, and a postcode in that city's real range, laid out the way ${COUNTRIES} countries actually write addresses — ZIP after the state in the US, postcode before the city in France and Germany, chōme-block-house numbers in Japan.`,
  },
  {
    question: "Are these real addresses?",
    answer:
      "No. The city and the postcode range are real so that form validation and address parsers accept them, but the street names are invented compounds (Willowmere Avenue, Lindenweg, rue des Glycines) and the house numbers are random. Do not send post to them — a parcel would be returned or lost.",
  },
  {
    question: "Which countries are supported?",
    answer: `${ADDRESS_COUNTRIES.map((c) => c.label).join(", ")}. Choose one in the Country menu or leave it on Any for a mix. Each country uses its own format: US ZIP codes, UK outward and inward codes, Canadian A1A 1A1 codes, Japanese 123-4567 codes and so on.`,
  },
  {
    question: "Do the ZIP codes match the city?",
    answer:
      "Yes. A Chicago address gets a 606xx ZIP, a Paris address a 750xx code with the right arrondissement, a Manchester address an M postcode and a Melbourne address a 3xxx code. That is what most address generators get wrong, and it is what breaks shipping-rate and tax tests.",
  },
  {
    question: "Can I use a fake address for online shopping or sign-ups?",
    answer:
      "Use it where an address is just a required field you do not want to share — a newsletter, a demo account, a test checkout in a sandbox. Do not use it to receive goods, to get around tax or shipping rules, or for anything involving payments or identity checks.",
  },
  {
    question: "How do I download fake addresses for testing?",
    answer:
      "Set How many to 25, 50 or 100 and press Generate. Download CSV gives separate columns for street, address line 2, city, region, postcode and country, ready for Excel, Google Sheets or a database import. Download JSON gives the same fields for API mocks. Copy address only puts one address on your clipboard.",
  },
  {
    question: "Can I get a fake address without a name?",
    answer:
      "Every card has a Copy address only button, and the CSV keeps the address in its own columns, so you can drop the name columns. If you also want height, star sign and other details, use the fake identity generator.",
  },
];

const COMPARE = [
  { feature: "Postcode matches the city", us: "Yes, real per-city ranges", them: "Often random digits" },
  { feature: "Country-correct address layout", us: `${COUNTRIES} formats`, them: "US layout for every country" },
  { feature: "Addresses per click", us: "Up to 100", them: "1" },
  { feature: "Separate CSV columns (street, city, postcode…)", us: "Yes, free", them: "Rare or paid" },
  { feature: "Street names", us: "Invented, so no real household is listed", them: "Some scrape real addresses" },
  { feature: "SSN / card numbers on the same page", us: "Never", them: "Common" },
  { feature: "Signup", us: "None", them: "None to required" },
];

export default function FakeAddressGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Fake Address Generator"
      heading={["Fake Address", "Generator"]}
      intro={`Random addresses in ${COUNTRIES} countries, each with a matching name and a postcode that fits the city. Pick a country, make up to 100 at once, then copy, print or download CSV/JSON.`}
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A fake address generator makes up postal addresses that pass format checks but belong to no one. This one uses fictional street
          names with real cities and real postcode ranges in {COUNTRIES} countries, written in each country&apos;s own order, and exports
          them as CSV or JSON with separate columns. No signup, no ID or card numbers.
        </>
      }
      related={[
        { href: "/fake-name-generator", label: "Fake name generator" },
        { href: "/fake-identity-generator", label: "Fake identity generator" },
        { href: "/fake-person-generator", label: "Fake person generator" },
        { href: "/random-state-generator", label: "Random state generator" },
        { href: "/random-zip-code-generator", label: "Random ZIP code generator" },
        { href: "/country-name-generator", label: "Country name generator" },
        { href: "/random-name-picker", label: "Random name picker" },
      ]}
      content={
        <>
          <SectionTitle>Address formats by country</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>United States</strong> — 5403 Larkdale Avenue / Apt 21C / New York, NY 10004. Five-digit ZIP from the city&apos;s real range.</li>
            <li><strong>United Kingdom</strong> — 172 Heronfield Avenue / LEEDS LS4 4GS. Post town in capitals, postcode from the city&apos;s area.</li>
            <li><strong>Canada</strong> — 351 Sorrelbrook Road / Unit 1147 / Vancouver BC V2B 2Y6. Letter-digit postcode with the right first letter.</li>
            <li><strong>Germany and France</strong> — house number after the street in Germany (Holunderstraße 35), postcode before the city in both (31400 Toulouse).</li>
            <li><strong>Japan, China and Korea</strong> — chōme-block-house numbers (1-14-13 Midorigaoka), Room and No. lines for China, road-name addresses with the district for Korea.</li>
          </ul>

          <SectionTitle>Who needs a fake address?</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Developers and QA testers</strong> checking checkout forms, address validation, shipping-rate and tax rules across countries.</li>
            <li><strong>Designers</strong> who want realistic text in mock-ups instead of &quot;123 Main Street&quot; on every card.</li>
            <li><strong>Writers and game masters</strong> giving a character a believable home in Lyon or Osaka.</li>
            <li><strong>Teachers</strong> making envelope-writing and form-filling exercises without real addresses. For whole fictional people, try the <Link prefetch={false} href="/fake-identity-generator" className={linkClass}>fake identity generator</Link>.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical fake address sites</th>
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

          <SectionTitle>Safe by design</SectionTitle>
          <p>
            Every street name is made up, so no real household ends up in your test database or screenshots. The page never prints Social
            Security, ID or card numbers. If you are testing payments, use your provider&apos;s official test cards; for names alone, the{" "}
            <Link prefetch={false} href="/fake-name-generator" className={linkClass}>fake name generator</Link> is quicker.
          </p>
        </>
      }
    >
      <FakeNameGenerator variant="address" />
    </GeneratorPageShell>
  );
}
