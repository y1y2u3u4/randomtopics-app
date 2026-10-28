import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/picker-wheel";
const TITLE = "Picker Wheel — Random Name & Choice Picker, Lists Saved Free";
const DESCRIPTION =
  "A random picker wheel for names and choices. Type your options, spin, and get a winner. Save lists in your browser, remove winners after each spin and share a link. Free, no app, no signup.";

const SOCIAL = generatorSocial({ card: "picker-wheel", title: TITLE, description: DESCRIPTION, alt: "Picker Wheel — a colorful spinning wheel with choices" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["picker wheel", "random picker wheel", "picker wheel online", "random name picker", "choice picker wheel", "wheel picker", "spin the wheel picker"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I use the picker wheel?",
    answer: "Type your names or choices in the box, one per line (or separated by commas). They appear on the wheel straight away. Press Spin and the winner shows under the wheel. You can edit the list at any time.",
  },
  {
    question: "Can I save my lists?",
    answer: "Yes. Type a name for the list, press Save list, and it appears as a chip you can tap to load again. The wheel also reopens with the list you used last. Lists are stored in your own browser, so they are private, and clearing your browser data removes them. Use Copy link to this wheel to move a list to another device.",
  },
  {
    question: "Is the picker wheel really random?",
    answer: "Yes. The winner is chosen first with your device's secure random number generator, then the wheel turns to land on it. Every entry has the same chance, whatever its length or position.",
  },
  {
    question: "How do I stop the same name coming up twice?",
    answer: "Tick 'Remove the winner after each spin'. Each winner leaves the wheel, so you can pick every person once, for example for presentation order or chores.",
  },
  {
    question: "Is there an app to download?",
    answer: "No. The picker wheel runs in your browser on a phone, tablet or computer. There is no signup and no popup in front of the wheel.",
  },
  {
    question: "How many entries can I add?",
    answer: "Up to 200. On a wheel with more than about 30 entries the slice labels are hidden to stay readable, but every entry is in the draw and the winner is shown in large text.",
  },
  {
    question: "Can I give one entry better odds?",
    answer: "Type it more than once. Each line is one slice, so two lines of the same name means two chances.",
  },
];

export default function PickerWheelPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Picker Wheel"
      heading={["Picker", "Wheel"]}
      intro="A random picker for names and choices. Type your list, spin, and save it for next time."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Type names or choices, one per line, press Spin and the wheel picks one at random. Save lists in your browser, load quick lists like Yes/No or Dinner, remove winners after each spin and copy a link to share the wheel. Free, with no app and no signup."
      related={[
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
        { href: "/spin-the-wheel", label: "Spin the wheel (topics)" },
        { href: "/toss-a-coin", label: "Toss a coin" },
      ]}
      content={
        <>
          <SectionTitle>What to put on a picker wheel</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>People</strong> — students to call on, giveaway entrants, who presents next, who buys the coffee.</li>
            <li><strong>Choices</strong> — where to eat, which film, which game to play. Use the Dinner quick list or type your own.</li>
            <li><strong>Numbers</strong> — the 1 to 10 quick list picks a number; paste a longer list for raffle tickets.</li>
            <li><strong>Yes or no</strong> — the Yes / No quick list turns the wheel into an answer machine.</li>
          </ul>
          <SectionTitle>Saved lists: why they matter</SectionTitle>
          <p>
            Most people use the same list again and again: the class register, the team, the family&apos;s takeaway favourites. Name a list and save it once. Next time tap its chip and the wheel is ready.
            The list you used last is also restored when you open the page. Saved lists live in your browser on that device; copy the link to this wheel to open the same list somewhere else.
          </p>
          <SectionTitle>Tips for a fair pick</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Check the list on the wheel before you spin. Typos make duplicate slices.</li>
            <li>Turn on &lsquo;Remove the winner&rsquo; to run through everyone once.</li>
            <li>Decide the rules before you spin, so nobody asks for another try.</li>
            <li>For two options only, a <Link prefetch={false} href="/toss-a-coin" className={linkClass}>coin toss</Link> is quicker.</li>
          </ol>
          <p>
            Need a topic or question to spin for instead? Try the <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>topic spin the wheel</Link>. For weighted options and draws, use the{" "}
            <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{ pageId: "picker_wheel" }} />
    </GeneratorPageShell>
  );
}
