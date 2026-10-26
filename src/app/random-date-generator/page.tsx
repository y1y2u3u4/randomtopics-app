import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomDateGenerator from "@/components/generators/RandomDateGenerator";
import { withSocial } from "@/lib/metadata/social";
import { hreflangAlternates } from "@/i18n/config";

const PATH = "/random-date-generator";
const TITLE = "Random Date Generator: Pick Dates in Any Range";
const DESCRIPTION =
  "Free random date generator: pick 1 to 100 random dates between any two days, exclude weekends, and get ISO, US or EU format. Copy the list or download CSV.";

export const metadata: Metadata = withSocial({
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random date generator", "random date picker", "generate random dates", "random date between two dates", "random weekday generator", "random date in range", "random dates csv"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
});

const FAQ = [
  {
    question: "Are the start and end dates included?",
    answer: "Yes. Both the From and To dates can be picked. A range from 2026-01-01 to 2026-01-01 always returns January 1, and a full year range has 365 (or 366) possible days.",
  },
  {
    question: "How does Exclude weekends work?",
    answer: "Saturdays and Sundays are removed before the pick, so every remaining weekday has the same chance. Public holidays are not removed because they differ by country; delete them from the list if you need to.",
  },
  {
    question: "Can I generate many random dates at once?",
    answer: "Up to 100 per click. Keep No repeats ticked for unique dates (the count is capped at the days available), or untick it to allow the same date twice. Tick Sort by date for a calendar-ordered list.",
  },
  {
    question: "Which date formats are supported?",
    answer: "ISO (2026-10-19), US (10/19/2026), EU (19/10/2026) and a long form with the weekday. The CSV download always contains all three numeric formats plus the weekday, so spreadsheets in any region can read it.",
  },
  {
    question: "Is the pick truly random and fair?",
    answer: "Each eligible day has an equal chance. Dates are counted as whole calendar days, so time zones and daylight-saving changes cannot shift the result or drop the last day of the range.",
  },
  {
    question: "What can I use random dates for?",
    answer: "Test data, sampling days for an audit or survey, picking a surprise date night, scheduling a random spot check, choosing a historical date for a quiz, or seeding a spreadsheet.",
  },
];

const COMPARE = [
  { feature: "Start and end dates included", us: "Yes, stated", them: "Often unclear" },
  { feature: "Exclude weekends", us: "Yes, fair weighting", them: "Rare" },
  { feature: "Formats", us: "ISO, US, EU, long", them: "One format" },
  { feature: "Batch size", us: "Up to 100, unique or not", them: "1–10" },
  { feature: "CSV download", us: "Yes, 3 formats + weekday", them: "Copy only" },
  { feature: "Time-zone safe", us: "Whole-day maths", them: "Can skip a day" },
];

export default function RandomDateGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Date Generator"
      heading={["Random Date", "Generator"]}
      intro="Pick random dates between any two days. Exclude weekends, choose ISO, US or EU format, and copy or download up to 100 dates at once."
      description={DESCRIPTION}
      updated="2026-10-19"
      faq={FAQ}
      inShort={
        <>
          A random date generator picks days at random from a range you set. This one includes both end dates, can skip weekends, returns
          up to 100 unique dates in ISO, US or EU format, and exports a CSV with the weekday for each date.
        </>
      }
      related={[
        { href: "/number-randomizer", label: "Number randomizer" },
        { href: "/random-zip-code-generator", label: "Random ZIP code generator" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/fake-name-generator", label: "Fake name generator" },
      ]}
      content={
        <>
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Set From and To.</strong> Both days are included in the draw.</li>
            <li><strong>Choose how many</strong> dates (1–100) and a format: ISO, US, EU or long.</li>
            <li><strong>Tick options:</strong> Exclude weekends for business days, No repeats for unique dates, Sort by date for a tidy list.</li>
            <li><strong>Press Generate,</strong> then Copy dates or Download CSV.</li>
          </ol>

          <SectionTitle>Examples</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Goal</th><th className="py-2 pr-3">Settings</th><th className="py-2">Sample result</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3">Random audit days this quarter</td><td className="py-2 pr-3">Oct 1 – Dec 31, 5 dates, weekdays only, sorted</td><td className="py-2">2026-10-07, 2026-10-22, 2026-11-12, 2026-11-30, 2026-12-15</td></tr>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3">Surprise date night</td><td className="py-2 pr-3">Next 30 days, 1 date</td><td className="py-2">Saturday, November 7, 2026</td></tr>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3">Test data for a form</td><td className="py-2 pr-3">1990 – 2005, 100 dates, US format, CSV</td><td className="py-2">04/18/1997, 11/02/2001, …</td></tr>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3">History quiz</td><td className="py-2 pr-3">1900 – 1999, 10 dates, long format</td><td className="py-2">Tuesday, July 20, 1954, …</td></tr>
              </tbody>
            </table>
          </div>

          <SectionTitle>Date formats explained</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>ISO 8601 (YYYY-MM-DD):</strong> sorts correctly as text; best for code, databases and file names.</li>
            <li><strong>US (MM/DD/YYYY):</strong> month first, used in the United States.</li>
            <li><strong>EU (DD/MM/YYYY):</strong> day first, used in the UK, Europe, India and most of the world.</li>
          </ul>
          <p className="mt-3">Need other random test values? Pair dates with a <Link prefetch={false} href="/random-zip-code-generator" className={linkClass}>random ZIP code</Link> or a <Link prefetch={false} href="/number-randomizer" className={linkClass}>random number</Link>.</p>

          <SectionTitle>How it compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Feature</th><th className="py-2 pr-3">This generator</th><th className="py-2">Typical date pickers</th></tr>
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
      <RandomDateGenerator />
    </GeneratorPageShell>
  );
}
