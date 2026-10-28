import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NamePicker from "@/components/generators/NamePicker";
import WheelFamilyLinks from "@/components/wheel/WheelFamilyLinks";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-name-picker";
const TITLE = "Random Name Picker — Draw Names from a Hat, No Repeats";
const DESCRIPTION =
  "Free random name picker: paste a list of names and draw one or several winners, with no repeats until everyone has been picked. Random order for presentations, classroom cold calls, raffles and giveaways. No signup; your list stays in your browser.";

const SOCIAL = generatorSocial({ card: "random-name-picker", title: TITLE, description: DESCRIPTION, alt: "Random name picker — a list of names with one picked" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random name picker", "name picker", "random name selector", "pick a name from a hat", "name draw", "random student picker", "raffle name picker", "random name chooser"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I pick a random name from a list?", answer: "Paste or type the names, one per line or separated by commas, and press Pick a name. Choose how many names to draw at once, from 1 to 10." },
  { question: "Can it avoid picking the same person twice?", answer: "Yes. With “Remove picked names” on, each winner leaves the hat, so nobody is picked again until everyone has had a turn. Press “Put everyone back” to refill the hat." },
  { question: "Is the pick really random?", answer: "Each draw shuffles the remaining names with a fresh random seed (a Fisher–Yates shuffle), so every name left in the hat has the same chance. Duplicate entries count as separate tickets, which is handy for weighted raffles." },
  { question: "Can I put the whole class in a random order?", answer: "Yes — “Random order for everyone” numbers every name in a fresh random order, ideal for presentation order, turn order or seating." },
  { question: "Are my names uploaded or saved?", answer: "No. The list is processed in your browser and saved only in this browser's local storage, so it is still there next time on this device. Clear it with one click." },
  { question: "How do I pick a random name from a list in Excel or Google Sheets?", answer: "Copy the column of names and paste it into the box, or export the sheet as CSV and press Import CSV/TXT. The first column is used as the names. Then press Pick a name." },
  { question: "What is the best random name picker for a classroom?", answer: "One that does not repeat names until everyone has had a turn, keeps the list on your device and works on a projector. This picker does all three. For a spinning wheel look, use the classroom name picker wheel." },
  { question: "Can I pick a random name with a spinning wheel instead?", answer: "Yes. The same list works on the wheel of names or the picker wheel, where each name gets a slice and the wheel lands on the winner." },
  { question: "How many names can I put in the random name picker?", answer: "Up to 500 names. Paste them one per line or separated by commas." },
];

export default function RandomNamePickerPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Name Picker"
      heading={["Random Name", "Picker"]}
      intro="Paste your names, press Pick. No repeats until everyone has had a turn — great for classrooms, raffles and game night."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      afterTool={<WheelFamilyLinks path={PATH} heading="Prefer a wheel? Spin it" />}
      inShort="Paste a list of names, choose how many to draw, and press Pick a name. Winners are removed from the hat so nobody is picked twice until everyone has had a turn, and one button puts the whole list in a random order. It is free and needs no account, and the list never leaves your browser."
      related={[
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/fake-name-generator", label: "Fake name generator" },
        { href: "/number-randomizer", label: "Number randomizer" },
        { href: "/spin-the-wheel", label: "Spin the wheel" },
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/question-of-the-day-for-students", label: "Question of the day for students" },
      ]}
      content={
        <>
          <SectionTitle>Ways to use it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Classroom cold calls</strong> — paste the class list once; with no repeats on, every student gets a turn before anyone is called twice.</li>
            <li><strong>Presentation order</strong> — “Random order for everyone” gives a numbered running order you can copy to the board.</li>
            <li><strong>Raffles and giveaways</strong> — one line per ticket; add a name twice to give it two tickets.</li>
            <li><strong>Game night</strong> — decide who goes first in <Link prefetch={false} href="/charades" className={linkClass}>charades</Link> or who answers the next <Link prefetch={false} href="/hot-seat-questions" className={linkClass}>hot seat question</Link>.</li>
          </ul>
          <SectionTitle>Random name picker from a list or spreadsheet</SectionTitle>
          <p>Paste a column from Excel or Google Sheets, or import a CSV or TXT file. Blank lines and numbering such as “1.” are cleaned up for you, and the first column of a CSV is used as the names. Nothing is uploaded; the file is read inside your browser.</p>
          <SectionTitle>Random name picker wheel</SectionTitle>
          <p>Want the suspense of a spinning wheel? Put the same names on the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link> or the <Link prefetch={false} href="/picker-wheel" className={linkClass}>picker wheel</Link>, or use the <Link prefetch={false} href="/classroom-name-picker-wheel" className={linkClass}>classroom name picker wheel</Link> and the <Link prefetch={false} href="/raffle-wheel" className={linkClass}>raffle wheel</Link> for draws. For topics and questions, the <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>spin the wheel</Link> topic generator spins one for you.</p>
          <SectionTitle>Need groups instead of one name?</SectionTitle>
          <p>Use the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link> to split the same list into balanced teams or groups, or the <Link prefetch={false} href="/number-randomizer" className={linkClass}>number randomizer</Link> when students are numbered.</p>
          <SectionTitle>Choosing between options, not people?</SectionTitle>
          <p>The <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> spins a wheel of your own options, draws lots without repeats or answers a yes-or-no question.</p>
        </>
      }
    >
      <NamePicker />
    </GeneratorPageShell>
  );
}
