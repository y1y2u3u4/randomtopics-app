import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import DecisionMaker from "@/components/generators/DecisionMaker";
import FactTable from "@/components/FactTable";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/decision-maker";
const TITLE = "Decision Maker — Random Decision Wheel, Draw Lots & Yes or No";
const DESCRIPTION =
  "Free random decision maker: type your options and let a spinning wheel, a cup of drawing lots or a yes-or-no coin decide for you. Weight the options you prefer, get a decision of the day and share the result card. No signup.";

const SOCIAL = generatorSocial({ card: "decision-maker", title: TITLE, description: DESCRIPTION, alt: "Decision maker — a decision wheel, a cup of drawing lots and a yes-or-no coin" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["decision maker", "random decision maker", "decision maker wheel", "yes or no decision maker", "help me decide", "make a decision for me", "decision wheel", "draw lots"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How does the random decision maker work?", answer: "Type a question, add two or more options (or pick a starter list), choose a mode and press the button. The wheel spins and stops on one option, Draw lots pulls one stick from the cup, and Yes or no flips a coin. Every option has an equal chance unless you give it extra weight." },
  { question: "Can you make a decision for me?", answer: "Yes. If you are stuck between choices — what to eat, which movie, who does the dishes — add them and let the wheel or the lots pick. For a single question such as “Should I go out tonight?”, use the Yes or no mode." },
  { question: "Is there a yes or no decision maker?", answer: "Yes — switch to the Yes or no tab, type your question and flip. Yes and No each have a 50% chance; tick “Add Maybe” to make it a three-way coin with a third each." },
  { question: "Can I make one option more likely than the others?", answer: "Yes. Tap the ×1 next to an option to make it ×2 or ×3. Its slice on the wheel grows to match, so a ×2 option is exactly twice as likely as a ×1 option." },
  { question: "What is the difference between the wheel and drawing lots?", answer: "The wheel can land on the same option twice in a row. Draw lots works like pulling sticks from a cup: with “No repeats” on, a drawn option stays out until every option has been drawn — handy for taking turns or working through a list." },
  { question: "Is the decision really random?", answer: "Yes. Each decision uses your browser's random number generator. Nothing is pre-set, and nobody — including us — can steer the result." },
  { question: "Can I share my wheel or my result?", answer: "Yes. “Copy link to these options” makes a link that opens the same question and options for friends. “Share result card” makes an image of the answer for a group chat or story." },
  { question: "Is it free, and are my options saved?", answer: "It is free with no account. Your options and your last six decisions are saved only in this browser so they are there next time; nothing is uploaded." },
];

export default function DecisionMakerPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Decision Maker"
      heading={["Decision", "Maker"]}
      intro="Can't decide? Type your options and let the wheel, a cup of lots or a yes-or-no coin choose — weighted if you like, free and no signup."
      description={DESCRIPTION}
      updated="2026-10-24"
      faq={FAQ}
      hero={{ src: "/generators/hero/decide.webp", alt: "A spinning decision wheel, a cup of drawing lots and a tossed coin" }}
      heroHideOnShort
      inShort="This decision maker picks for you in three ways: spin a wheel of your options, draw lots from a cup without repeats, or flip a yes-or-no coin for a single question. You can make some options twice or three times as likely, load a starter list, decide the daily question and share the answer as a card or link. It is free, needs no account and runs entirely in your browser."
      related={[
        { href: "/spin-the-wheel", label: "Spin the wheel (topics)" },
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/number-randomizer", label: "Number randomizer" },
        { href: "/random-food-generator", label: "Random food generator" },
      ]}
      afterTool={
        <FactTable
          heading="Which decision mode should you use?"
          columns={["", "🎡 Wheel", "🥢 Draw lots", "🪙 Yes or no"]}
          rows={[
            ["Best for", "Picking one of several options", "Taking turns or working through a list", "One question you keep going back and forth on"],
            ["Can repeat?", "Yes, every spin is fresh", "No — with “No repeats” on, drawn lots stay out", "Yes, every flip is fresh"],
            ["Weights", "×1, ×2 or ×3 per option", "×1, ×2 or ×3 per option", "Equal: 50/50 (or thirds with Maybe)"],
            ["Options", "2 to 24", "2 to 24", "Yes / No (+ Maybe)"],
          ]}
        />
      }
      content={
        <>
          <SectionTitle>How to use the decision maker</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Ask the question</strong> — “What should we eat tonight?” or “Should I go to the party?”</li>
            <li><strong>Add your options</strong> — type them one at a time, paste a comma-separated list, or tap a starter list such as Dinner, Movie night or Who does it.</li>
            <li><strong>Pick a mode</strong> — Wheel for one pick from many, Draw lots to take turns without repeats, Yes or no for a single question.</li>
            <li><strong>Decide and share</strong> — copy the answer, save a result card for the group chat, or send a link so friends can spin the same options.</li>
          </ol>
          <SectionTitle>When a random decision actually helps</SectionTitle>
          <p>
            Random choice is best for small decisions where every option is fine and the real cost is the time spent deciding: dinner, a
            movie, the order of turns, which chore to do first. A useful trick: spin, then notice how you feel about the answer. If you are
            relieved, go with it; if you are disappointed, you have just found out what you really wanted. For big, hard-to-reverse
            decisions, use the result as a nudge, not a verdict.
          </p>
          <SectionTitle>Need a different picker?</SectionTitle>
          <p>
            Picking a person from a class list? The <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link> removes
            each winner and can put everyone in a random order. Need a topic to talk about instead of a choice? <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>Spin the topic wheel</Link>.
            Splitting a group? Use the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link>, and for “what should I eat”
            with real dishes, try the <Link prefetch={false} href="/random-food-generator" className={linkClass}>random food generator</Link>.
          </p>
        </>
      }
    >
      <DecisionMaker />
    </GeneratorPageShell>
  );
}
