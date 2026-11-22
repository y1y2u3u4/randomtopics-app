import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RoastOneSentence from "@/components/generators/RoastOneSentence";
import { EXAMPLE_ROASTS, HEATS, TRAITS, roastText } from "@/lib/generators/roast";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/roast-me-in-one-sentence";
const TITLE = "Roast Me in One Sentence — Free One-Line Roast Generator";
const DESCRIPTION =
  `Roast me in one sentence: type a name, pick what is painfully true (always late, gym, coffee, never texts back + ${TRAITS.length - 4} more) and choose Mild, Spicy or Savage. Instant one-line roast, share card and link. Free, no signup.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "roast me in one sentence", "roast me", "one sentence roast", "one line roast", "roast generator", "roast me generator",
    "roast my friend", "savage roast", "funny roasts", "roast lines", "roast me ai", "roast me in one word",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "What is “roast me in one sentence”?",
    answer: "It is a trend on X, TikTok and Reddit where people post “roast me in one sentence” and friends reply with the shortest, meanest line they can. This page gives you that line instantly: pick a few things that are true about you (or a friend), choose how hard it should hit, and get one sentence to post, send or screenshot.",
  },
  {
    question: "How do I get roasted in one sentence?",
    answer: "Type your name (optional), tap up to three habits such as Always late, Coffee addict or Never texts back — or describe yourself in a few words — then choose Mild, Spicy or Savage and press Roast me. Press again for a new line; you will not see a repeat until every line for your picks has been shown.",
  },
  {
    question: "Can I roast a friend instead of myself?",
    answer: "Yes. Put their name in, pick their habits and press Roast me. Use Share link to send them the exact roast — when they open it they see the card and a “Roast them back” button.",
  },
  {
    question: "Is this an AI roast generator?",
    answer: `No. Every line is hand-written and checked: ${TRAITS.length} habits × 3 heat levels, plus all-purpose roasts when nothing matches. That means it is instant, free and unlimited, and it never invents something cruel about you.`,
  },
  {
    question: "What will it not roast?",
    answer: "Looks, weight, body, race, religion, gender, sexuality, disability or health. The roasts are about habits and choices — being late, doomscrolling, crypto charts, leaving people on read — which is what makes them funny instead of mean.",
  },
  {
    question: "What is the difference between Mild, Spicy and Savage?",
    answer: "Mild is friendly teasing you could say to your grandma. Spicy is group-chat safe but stings. Savage is no mercy — still about habits, never about who someone is.",
  },
  {
    question: "Can I post the roast as a picture?",
    answer: "Press Save image for a 1080×1080 card with the roast and your name — the square size works on Instagram, X, TikTok photo posts and stories. On phones it opens the share sheet. There is no watermark, only the site address at the bottom.",
  },
  {
    question: "What is the roast of the day?",
    answer: "One spicy roast that is the same for everyone each day and changes at midnight UTC. Send it to the friend it fits best.",
  },
];

export default function RoastMePage() {
  const examples = EXAMPLE_ROASTS.map((e) => ({ ...e, text: roastText({ trait: e.traits[0], heat: e.heat, index: e.index, name: e.name }) }));
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="Roast Me in One Sentence"
      heading={["Roast Me in", "One Sentence"]}
      intro="Pick what’s painfully true, choose the heat, get one line that hurts. Free, no signup."
      description={DESCRIPTION}
      updated="2026-11-22"
      faq={FAQ}
      related={[
        { href: "/most-likely-to", label: "Most Likely To" },
        { href: "/hot-seat-questions", label: "Hot Seat Questions" },
        { href: "/incorrect-quote-generator", label: "Incorrect Quote Generator" },
        { href: "/magic-8-ball", label: "Magic 8 Ball" },
        { href: "/funny", label: "Funny Random Topics" },
      ]}
      inShort={
        <>
          A free <strong>roast me in one sentence</strong> generator: enter a name, pick up to three habits from {TRAITS.length} (always late, gym, coffee, gamer,
          crypto, overthinker, never texts back…) or describe yourself in a few words, and choose{" "}
          {HEATS.map((h) => h.label).join(", ")}. You get one hand-written sentence — about habits, never looks — that you can copy, send as an exact share link
          or save as a 1080×1080 image. No AI, no account, no repeats until you have seen every line.
        </>
      }
      content={
        <>
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Type your name or a friend’s (optional — it goes at the start of the roast).</li>
            <li>Tap up to three habits, or type a few words like “always late, iced coffee, gym”.</li>
            <li>Choose <strong>Mild</strong>, <strong>Spicy</strong> or <strong>Savage</strong> and press <strong>Roast me</strong>.</li>
            <li>Copy the line, send the share link, or save the image and post it under your “roast me in one sentence” tweet.</li>
          </ol>

          <SectionTitle>One sentence roast examples</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            {examples.map((e) => (
              <li key={e.name}><strong>{TRAITS.find((x) => x.id === e.traits[0])?.label}, {HEATS.find((h) => h.id === e.heat)?.label}:</strong> “{e.text}”</li>
            ))}
          </ul>

          <SectionTitle>Roasts for every habit</SectionTitle>
          <p>Each habit has two lines at every heat. A few favorites:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {TRAITS.slice(0, 12).map((tr) => <li key={tr.id}>{tr.emoji} <strong>{tr.label}:</strong> “{tr.lines.spicy[0]}”</li>)}
          </ul>

          <SectionTitle>How to answer “roast me in one sentence”</SectionTitle>
          <p>
            The best one-line roasts are specific, short and about something the person chose — a habit, a hobby, a phone they never put down. Keep it under 25 words,
            put the twist at the end, and skip anything about looks: it is not funnier, just meaner. If the group needs a softer start, play{" "}
            <Link prefetch={false} href="/most-likely-to" className={linkClass}>Most Likely To</Link> first and roast whoever wins, or put someone in the{" "}
            <Link prefetch={false} href="/hot-seat-questions" className={linkClass}>hot seat</Link>.
          </p>
        </>
      }
    >
      <RoastOneSentence />
    </GeneratorPageShell>
  );
}
