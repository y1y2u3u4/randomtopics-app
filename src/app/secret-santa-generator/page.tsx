import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import SecretSantaGenerator from "@/components/generators/SecretSantaGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/secret-santa-generator";
const TITLE = "Secret Santa Generator — Free Name Draw with Exclusions, No Email";
const DESCRIPTION = "Free Secret Santa generator: enter names, block couples from drawing each other, set a budget and date, then send everyone a private reveal link. No sign-up, no emails collected — the draw happens in your browser.";

const SOCIAL = generatorSocial({ card: "random-name-picker", title: TITLE, description: DESCRIPTION, alt: "Secret Santa Generator — private name draw" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["secret santa generator", "secret santa name generator", "secret santa picker", "secret santa draw", "secret santa generator with exclusions", "secret santa generator no email", "online secret santa", "gift exchange generator", "white elephant"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the Secret Santa generator work?",
    answer: "Type everyone's name, add any pairs who shouldn't draw each other, and press Draw names. Everyone gets exactly one person, nobody draws themselves, and blocked pairs never match. Then send each person their own link, or pass one phone around and let everyone tap Reveal next to their name.",
  },
  {
    question: "Can I stop couples from drawing each other?",
    answer: "Yes. In the exclusions box, write each couple or household on one line, like \"Ava, Ben\" or \"Chloe & Diego\". You can put three or more names on a line for a family. If the rules make a draw impossible, the tool tells you instead of breaking a rule.",
  },
  {
    question: "Do I need everyone's email address?",
    answer: "No. Nothing is emailed or uploaded. Each private link carries only that person's match, so you can send it by text, WhatsApp, Slack or any chat. The organiser can still copy the full list in case someone loses their link.",
  },
  {
    question: "Can the organiser take part too?",
    answer: "Yes. Send everyone their links and don't open the others. The links are not encrypted, so a curious person could decode one — for a strictly secret draw, use the pass-the-phone method and let each person reveal only their own name.",
  },
  {
    question: "How much should a Secret Santa gift cost?",
    answer: "Common budgets are $10–$25 for offices and classrooms and $25–$50 for friends and family. Add the budget and exchange date before you draw and they appear on everyone's reveal page.",
  },
  {
    question: "What if someone drops out?",
    answer: "Remove their name and draw again, then send the new links. Old links show the old match, so tell everyone to use only the newest link.",
  },
];

export default function SecretSantaGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Secret Santa Generator"
      heading={["Secret Santa", "Generator"]}
      intro="Draw Secret Santa names in seconds: block couples, set a budget and date, then send each person a private reveal link. Free, no sign-up, no email addresses."
      description={DESCRIPTION}
      updated="2026-11-08"
      faq={FAQ}
      inShort={
        <>
          A Secret Santa generator randomly assigns each person someone to buy a gift for. This one makes sure nobody draws themselves,
          supports exclusions (couples, households), adds your budget and date, and gives every person a private link to reveal their match.
          The draw runs in your browser; no emails are collected.
        </>
      }
      related={[
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/question-of-the-day", label: "Question of the day" },
      ]}
      content={
        <>
          <SectionTitle>Run a Secret Santa in 4 steps</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Add names</strong> — one per line; duplicates are removed.</li>
            <li><strong>Add exclusions</strong> — couples or housemates who shouldn&apos;t draw each other.</li>
            <li><strong>Set the details</strong> — event name, budget and exchange date (optional).</li>
            <li><strong>Draw and share</strong> — copy each person&apos;s private link, or reveal one by one on a single phone.</li>
          </ol>
          <SectionTitle>Two ways to reveal</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Private links:</strong> best for remote teams and family chats. Each link opens a reveal page for one person only.</li>
            <li><strong>Pass the phone:</strong> best at a party. Each person taps Reveal next to their own name, reads it, and taps Hide.</li>
          </ul>
          <SectionTitle>Gift exchange ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Theme it:</strong> &quot;something handmade&quot;, &quot;a book you love&quot; or &quot;under $10 and funny&quot;.</li>
            <li><strong>Wish lists:</strong> ask everyone to post three ideas in the group chat before the draw.</li>
            <li><strong>Party games:</strong> break the ice at the exchange with a <Link prefetch={false} href="/question-of-the-day" className={linkClass}>question of the day</Link>, or pick who opens first with the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link>.</li>
          </ul>
        </>
      }
    >
      <SecretSantaGenerator />
    </GeneratorPageShell>
  );
}
