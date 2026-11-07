import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import BracketMaker from "@/components/generators/BracketMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/bracket-maker";
const TITLE = "Bracket Maker — Free Tournament Bracket Generator (4 to 64)";
const DESCRIPTION = "Free bracket maker: type your teams, players or options and get a single-elimination tournament bracket for 2 to 64 entries with random seeding and automatic byes. Click to advance winners, then print or share the live bracket. No sign-up.";

const SOCIAL = generatorSocial({ card: "random-team-generator", title: TITLE, description: DESCRIPTION, alt: "Bracket Maker — tournament bracket generator" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["bracket maker", "tournament bracket maker", "bracket generator", "tournament bracket generator", "random bracket generator", "printable bracket", "bracket maker free", "single elimination bracket", "8 team bracket", "16 team bracket"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How do I make a bracket?",
    answer: "Type one team, player or option per line, add a title if you like, and press Make bracket. The tool builds a single-elimination bracket of the right size (4, 8, 16, 32 or 64 slots). Tap a name in each match to send it to the next round.",
  },
  {
    question: "What happens if I don't have 8 or 16 entries?",
    answer: "Byes fill the empty slots. For example, 10 entries make a 16-slot bracket with 6 byes, and the entries with a bye go straight to round 2. Byes are spread out so two byes never meet.",
  },
  {
    question: "Is the seeding random?",
    answer: "Yes, by default the order is shuffled fairly each time you press the button. Turn off random seeding to keep your own order, for example if you have ranked seeds: list them in the order you want them placed.",
  },
  {
    question: "Can I share or print the bracket?",
    answer: "Yes. The page link updates as you pick winners, so Copy share link sends the live bracket to anyone. Print gives a clean paper version, and Copy as text pastes every match and result into a chat or document.",
  },
  {
    question: "Can I use it for things other than sports?",
    answer: "Yes. Brackets are popular for \"best snack\", \"best movie\" or \"best song\" debates in class, at parties and on stream. Try a sample bracket above to see how it works.",
  },
  {
    question: "Does it support double elimination?",
    answer: "Not yet. This bracket maker does single elimination: lose once and you are out. For groups or round-robin play, split players with the random team generator first.",
  },
];

export default function BracketMakerPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Bracket Maker"
      heading={["Bracket", "Maker"]}
      intro="Make a tournament bracket for 2 to 64 teams, players or options. Random seeding, automatic byes, click to advance winners, then print or share it. Free, no sign-up."
      description={DESCRIPTION}
      updated="2026-11-08"
      faq={FAQ}
      inShort={
        <>
          A bracket maker turns a list of entries into a tournament bracket. This one builds a single-elimination bracket of 4, 8, 16, 32 or 64
          slots, shuffles the seeding, places byes so no match is bye vs bye, and lets you tap winners through to the final. The link updates
          as you play, so you can share the live bracket or print it.
        </>
      }
      related={[
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/this-or-that", label: "This or that questions" },
        { href: "/decision-maker", label: "Decision maker" },
      ]}
      content={
        <>
          <SectionTitle>How the bracket works</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Enter</strong> 2 to 64 names. The bracket size is the next power of two.</li>
            <li><strong>Seed</strong> randomly, or keep your order for ranked seeds.</li>
            <li><strong>Play</strong> each match and tap the winner; tap again to undo.</li>
            <li><strong>Crown</strong> the champion, then share or print the full bracket.</li>
          </ol>
          <SectionTitle>Ideas for a fun bracket</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Classroom vote:</strong> best book, best snack or best animal — students vote on each match.</li>
            <li><strong>Game night:</strong> ping pong, chess, Mario Kart or trivia, with real results.</li>
            <li><strong>Stream or group chat:</strong> best movie or best song, one round a day. Get candidates from the <Link prefetch={false} href="/random-movie-generator" className={linkClass}>random movie generator</Link>.</li>
            <li><strong>Hard choices:</strong> list your options and let head-to-head picks decide; for a quick yes or no, use the <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link>.</li>
          </ul>
          <SectionTitle>Bracket sizes</SectionTitle>
          <p>
            4 entries = 2 rounds, 8 = 3 rounds, 16 = 4 rounds, 32 = 5 rounds, 64 = 6 rounds. Odd numbers are fine: byes fill the gaps. If you need
            teams before the tournament, make them with the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link>.
          </p>
        </>
      }
    >
      <BracketMaker />
    </GeneratorPageShell>
  );
}
