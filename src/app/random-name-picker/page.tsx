import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NamePicker from "@/components/generators/NamePicker";
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
      updated="2026-10-13"
      faq={FAQ}
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
            <li><strong>Game night</strong> — decide who goes first in <Link href="/charades" className={linkClass}>charades</Link> or who answers the next <Link href="/hot-seat-questions" className={linkClass}>hot seat question</Link>.</li>
          </ul>
          <SectionTitle>Need groups instead of one name?</SectionTitle>
          <p>Use the <Link href="/random-team-generator" className={linkClass}>random team generator</Link> to split the same list into balanced teams or groups, or the <Link href="/number-randomizer" className={linkClass}>number randomizer</Link> when students are numbered.</p>
          <SectionTitle>Choosing between options, not people?</SectionTitle>
          <p>The <Link href="/decision-maker" className={linkClass}>decision maker</Link> spins a wheel of your own options, draws lots without repeats or answers a yes-or-no question.</p>
        </>
      }
    >
      <NamePicker />
    </GeneratorPageShell>
  );
}
