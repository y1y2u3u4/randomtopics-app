import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/wheel-of-names";
const TITLE = "Wheel of Names — Free Spinning Wheel to Pick a Name";
const DESCRIPTION =
  "Type or paste your names, spin the wheel and get a random winner. Edit the wheel any time, remove winners after each spin, shuffle, sort and share a link. Free, no signup, and your list stays in your browser.";

const SOCIAL = generatorSocial({ card: "wheel-of-names", title: TITLE, description: DESCRIPTION, alt: "Wheel of Names — a colorful spinning wheel with names" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["wheel of names", "name wheel", "random name wheel", "spin the wheel names", "name picker wheel", "random name picker wheel", "wheel of names free"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I use the wheel of names?",
    answer:
      "Type your names into the box (one per line, or separated by commas), check that they appear on the wheel, then press Spin. The winner is shown under the wheel and added to the list of past winners. You can edit the list at any time and the wheel redraws instantly.",
  },
  {
    question: "Is the wheel of names really random?",
    answer:
      "Yes. The winner is chosen first with your device's secure random number generator (the same source browsers use for cryptography), and the wheel then turns to land on that name. Every name has exactly the same chance, no matter how long its label is or where it sits on the wheel.",
  },
  {
    question: "Can I stop the same name winning twice?",
    answer:
      "Tick 'Remove the winner after each spin'. The winning name is deleted from the list after every spin, so a classroom, raffle or giveaway never repeats a person. Press Reset or paste the list again to start over.",
  },
  {
    question: "Are my names saved or uploaded anywhere?",
    answer:
      "No. Names stay in your browser tab and are not sent to a server. If you want to reuse a wheel, press 'Copy link to this wheel': the names are packed into the link itself, so whoever opens it sees the same wheel.",
  },
  {
    question: "How many names can I put on the wheel?",
    answer:
      "Up to 200. Wheels with more than about 30 names stop printing labels on the slices to stay readable, but every name is still in the draw and the winner is always announced in large type underneath.",
  },
];

export default function WheelOfNamesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Wheel of Names"
      heading={["Wheel of", "Names"]}
      intro="Type your names, spin the wheel and let it pick. Edit the list any time, drop winners after each spin, and share the wheel with a link."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Put one name per line in the box, press Spin and the wheel lands on a random winner. Turn on 'Remove the winner after each spin' to avoid repeats, shuffle or sort the list, and copy a link that reopens the same wheel. It is free, needs no signup and keeps your names in your browser."
      related={[
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/spin-the-wheel", label: "Spin the wheel (topics)" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/decision-maker", label: "Decision maker" },
        { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
      ]}
      content={
        <>
          <SectionTitle>What a name wheel is good for</SectionTitle>
          <p>
            A <strong>wheel of names</strong> turns a choice into something everyone can watch, which is why it feels fair. Teachers use it to call on students without
            being accused of favourites, streamers pick giveaway winners on camera, and friends settle who pays for pizza. The wheel is only the show: the
            result is decided by a secure random draw before the spin starts.
          </p>
          <SectionTitle>How to run a fair draw</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Classroom cold-calling</strong> — paste the class list, tick &lsquo;Remove the winner&rsquo; and everyone answers once before anyone answers twice.</li>
            <li><strong>Giveaways and raffles</strong> — add each entrant once, spin on screen, and copy the link so entrants can check the list afterwards.</li>
            <li><strong>Chores and turns</strong> — put the family&apos;s names in, spin for who washes up, and use Past winners to see who went last time.</li>
            <li><strong>Picking an order</strong> — keep removing winners until the wheel is empty; the order they came out is your running order.</li>
            <li><strong>Weighted odds</strong> — to give someone two chances, type their name twice. Each line is one slice.</li>
          </ul>
          <SectionTitle>Editing the wheel</SectionTitle>
          <p>
            Shuffle mixes the order of the slices, Sort A–Z tidies a long list, and Clear starts from empty. Duplicate lines count as separate slices on purpose,
            so remove repeats yourself if you don&apos;t want them. Lists copied from a spreadsheet column or a numbered list work too: numbering and bullet characters are stripped.
          </p>
          <p>
            Need a topic or a question instead of a person? Use the <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>spin the wheel</Link> topic wheel,
            or draw several names at once with the <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames />
    </GeneratorPageShell>
  );
}
