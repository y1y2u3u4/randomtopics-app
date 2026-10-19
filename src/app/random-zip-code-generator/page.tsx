import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ZipCodeGenerator from "@/components/generators/ZipCodeGenerator";
import { US_STATES, ZIP_STATE_SUMMARY, ZIP_TOTAL } from "@/lib/generators/zipCodes";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/random-zip-code-generator";
const TITLE = "Random ZIP Code Generator: Real US ZIP Codes by State";
const TOTAL = ZIP_TOTAL.toLocaleString("en-US");
const DESCRIPTION = `Free random ZIP code generator: ${TOTAL} real US ZIP codes with city, county and state. Filter by state, make up to 50 at once, copy or download CSV.`;

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random zip code generator", "random zip code", "random us zip code", "zip code generator", "random zip code by state", "random postal code generator", "fake zip code", "random zip codes list"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "Are these real ZIP codes?",
    answer: `Yes. Every ZIP the generator shows is on the US Census Bureau's 2023 ZIP Code Tabulation Area (ZCTA) list and in the GeoNames postal-code database, which gives its city and county. That is ${TOTAL} residential ZIP codes across the 50 states and Washington, DC. PO-box-only and single-company ZIPs are left out because no one lives in them.`,
  },
  {
    question: "Can I get a random ZIP code for a specific state?",
    answer:
      "Pick the state in the State menu. The hint under the button shows how many ZIPs that state has and its lowest and highest ZIP, and each batch only uses that state's codes. Leave it on Any state for a nationwide mix weighted by how many ZIPs each state has, so a batch of 50 looks like the real country.",
  },
  {
    question: "How do I download a list of random ZIP codes?",
    answer:
      "Choose 25 or 50 in How many, press Generate, then Download CSV. The file has zip, city, state, state_name and county columns and keeps leading zeros (02108, not 2108) as long as you import the zip column as text. Copy ZIPs puts just the five-digit codes on your clipboard, one per line.",
  },
  {
    question: "Why do some ZIP codes start with 0?",
    answer:
      "ZIP codes run roughly east to west. New England and New Jersey start with 0, New York and Pennsylvania with 1, and the West Coast, Alaska and Hawaii with 9. A 0 at the front is part of the code, so store ZIPs as text, not numbers, or spreadsheets will drop it.",
  },
  {
    question: "Can I use a random ZIP code to test a form or an app?",
    answer:
      "Yes — that is the most common use. Real ZIPs pass validation that rejects made-up ones like 00000 or 12345, and the matching city and state let you test autofill, shipping-rate and sales-tax rules. For a whole made-up address with a street, use the fake address generator.",
  },
  {
    question: "Is a ZIP code the same as a ZCTA?",
    answer:
      "Almost. USPS ZIP codes are mail routes; the Census Bureau builds ZCTAs from them so it can map population. Nearly every residential ZIP has a matching ZCTA with the same five digits, which is why this generator uses the ZCTA list to make sure each ZIP is a real place where people live.",
  },
];

const COMPARE = [
  { feature: "Every ZIP checked against the Census ZCTA list", us: "Yes", them: "Random digits or old lists" },
  { feature: "City, state and county with each ZIP", us: "Yes", them: "ZIP only or city only" },
  { feature: "Filter by state", us: "All 50 + DC", them: "Sometimes" },
  { feature: "ZIPs per click", us: "Up to 50", them: "1–10" },
  { feature: "CSV download", us: "Yes, free", them: "Rare or paid" },
  { feature: "Signup or ads before results", us: "None", them: "Common" },
];

export default function RandomZipCodeGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random ZIP Code Generator"
      heading={["Random ZIP Code", "Generator"]}
      intro={`Real US ZIP codes with their city, county and state. Pick a state or leave it on Any, make up to 50 at once, then copy them or download a CSV.`}
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A random ZIP code generator picks real five-digit US ZIP codes at random. This one draws from {TOTAL} residential ZIPs on the
          Census Bureau&apos;s ZCTA list, shows the city, county and state for each, filters by state and exports up to 50 at a time as CSV.
          No signup.
        </>
      }
      related={[
        { href: "/fake-address-generator", label: "Fake address generator" },
        { href: "/random-state-generator", label: "Random state generator" },
        { href: "/fake-name-generator", label: "Fake name generator" },
        { href: "/fake-identity-generator", label: "Fake identity generator" },
        { href: "/number-randomizer", label: "Random number generator" },
        { href: "/country-name-generator", label: "Country name generator" },
      ]}
      content={
        <>
          <SectionTitle>How to use the random ZIP code generator</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Choose a state</strong>, or keep Any state for a nationwide mix.</li>
            <li><strong>Choose how many</strong>: 1 for a single ZIP in big type, or 5, 10, 25 or 50 for a list.</li>
            <li><strong>Press Generate.</strong> No ZIP repeats within a batch. Tick Sort by ZIP to order the list.</li>
            <li><strong>Copy or download.</strong> Copy just the ZIPs, copy them with city and state, or download a CSV. Copy link saves your state and count settings.</li>
          </ol>

          <SectionTitle>ZIP codes by state</SectionTitle>
          <p className="mb-3">
            How many residential ZIP codes each state has, its lowest and highest ZIP, and the city with the most ZIP codes. Pick a state in the
            generator above to draw from that state only.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse" data-zip-state-table>
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">State</th><th className="py-2 pr-3">ZIPs</th><th className="py-2 pr-3">Range</th><th className="py-2">Example</th>
                </tr>
              </thead>
              <tbody>
                {US_STATES.map((s) => {
                  const z = ZIP_STATE_SUMMARY[s.code];
                  return (
                    <tr key={s.code} className="border-b border-white/10 align-top">
                      <td className="py-1.5 pr-3 text-[var(--text-primary)]">{s.name}</td>
                      <td className="py-1.5 pr-3 tabular-nums">{z.count.toLocaleString("en-US")}</td>
                      <td className="py-1.5 pr-3 tabular-nums whitespace-nowrap">{z.first}–{z.last}</td>
                      <td className="py-1.5 tabular-nums">{z.sample} {z.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <SectionTitle>What the five digits mean</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>First digit</strong> — a group of states, from 0 in the Northeast to 9 on the West Coast, Alaska and Hawaii.</li>
            <li><strong>First three digits</strong> — the sectional center facility, the mail-sorting hub for an area (606 is Chicago, 900 is Los Angeles).</li>
            <li><strong>Last two digits</strong> — the delivery area or post office inside that hub&apos;s region.</li>
            <li><strong>ZIP+4</strong> — the optional four extra digits (10001-1234) narrow it to a block or building. This tool gives the standard five-digit ZIP.</li>
          </ul>

          <SectionTitle>Who uses random ZIP codes?</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Developers and QA testers</strong> filling sign-up, checkout and shipping forms with ZIPs that pass validation, then importing the CSV as test data.</li>
            <li><strong>Data and marketing teams</strong> picking random ZIPs for survey samples, territory tests or demo dashboards.</li>
            <li><strong>Teachers</strong> running geography lessons: draw a ZIP, find the city on a map, guess the region from the first digit.</li>
            <li><strong>Writers and game masters</strong> giving a character a real hometown. For a full address with a street, try the{" "}
              <Link href="/fake-address-generator" className={linkClass}>fake address generator</Link>; for a state alone, the{" "}
              <Link href="/random-state-generator" className={linkClass}>random state generator</Link>.</li>
          </ul>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical ZIP generators</th>
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

          <SectionTitle>Where the data comes from</SectionTitle>
          <p>
            ZIP codes come from the US Census Bureau&apos;s 2023 ZCTA Gazetteer. City and county names come from the{" "}
            <a href="https://www.geonames.org/" className={linkClass} rel="noopener" target="_blank">GeoNames</a> postal-code database
            (CC BY 4.0). A ZIP is kept only when it is in both, so every result is a real, populated ZIP code area. Puerto Rico and other
            territories are not included yet.
          </p>
        </>
      }
    >
      <ZipCodeGenerator />
    </GeneratorPageShell>
  );
}
