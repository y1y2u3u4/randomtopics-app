import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomEmojiGenerator from "@/components/generators/RandomEmojiGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-emoji-generator";
const TITLE = "Random Emoji Generator — Pick a Random Emoji by Category";
const DESCRIPTION =
  "Get a random emoji from nearly 800 across 8 categories: faces, animals, food, travel, objects and more. Draw 1, 5, 10 or 20 at a time and tap any emoji to copy it. Free and instant.";

const SOCIAL = generatorSocial({ card: "random-emoji-generator", title: TITLE, description: DESCRIPTION, alt: "Random Emoji Generator" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random emoji generator", "random emoji", "emoji generator", "random emoji picker", "emoji randomizer", "random emoji combination", "guess the emoji"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the random emoji generator work?",
    answer: "Pick a category (or all of them), choose how many emoji you want and press Generate. Tap any emoji to copy it and paste it anywhere.",
  },
  {
    question: "How many emoji does it cover?",
    answer: "794 emoji in 8 categories, including smileys and people, animals and nature, food and drink, activities, travel and places, objects, symbols and flags.",
  },
  {
    question: "Will I get the same emoji twice?",
    answer: "Not in the same session until the filtered list runs out, so repeated presses keep giving you new ones.",
  },
  {
    question: "How do I copy an emoji?",
    answer: "Tap or click it. It is copied to your clipboard, ready to paste into a message, document or social post.",
  },
  {
    question: "What can I use random emoji for?",
    answer: "Emoji guessing games, creative-writing prompts, choosing a username or reaction, party icebreakers and 'describe your week in 3 emoji' challenges.",
  },
  {
    question: "Why does an emoji look different on my phone?",
    answer: "Emoji are drawn by your device's font, so Apple, Google, Samsung and Windows each show their own artwork for the same emoji.",
  },
];

export default function RandomEmojiGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Emoji Generator"
      heading={["Random Emoji", "Generator"]}
      intro="A fresh emoji on every press. Choose a category, draw up to twenty and tap to copy."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Choose a category, pick 1, 5, 10 or 20, and press Generate to get random emoji from a set of 794 across 8 categories. Tap any emoji to copy it. Results avoid repeats within a session, and the tool is free with no signup."
      related={[
        { href: "/random-word-generator", label: "Random word generator" },
        { href: "/random-sentence-generator", label: "Random sentence generator" },
        { href: "/random-name-generator", label: "Random name generator" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/decision-maker", label: "Decision maker" },
      ]}
      content={
        <>
          <SectionTitle>Ways to play with random emoji</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Emoji story challenge</strong> — draw five emoji and tell the story they suggest in one minute.</li>
            <li><strong>Guess the phrase</strong> — pick 3 to 5 emoji and have friends work out the movie, song or saying they represent.</li>
            <li><strong>Icebreaker</strong> — everyone draws one emoji and explains how it matches their week.</li>
            <li><strong>Writing prompts</strong> — a single animal or object emoji is a quick character or setting seed.</li>
            <li><strong>Picking a name or avatar</strong> — draw until one feels right for a username, team or channel.</li>
          </ul>
          <SectionTitle>Categories</SectionTitle>
          <p>
            Use <strong>All</strong> for surprises, or narrow to a category when the game needs it: <strong>animals</strong> for character ideas, <strong>food</strong> for menu games,{" "}
            <strong>travel</strong> for destination prompts, <strong>objects</strong> for props. Drawing 10 or 20 at once works well for emoji bingo or for building a pattern.
          </p>
          <SectionTitle>More random generators</SectionTitle>
          <p>
            Want words instead of pictures? Try the <Link prefetch={false} href="/random-word-generator" className={linkClass}>random word generator</Link> or the{" "}
            <Link prefetch={false} href="/random-sentence-generator" className={linkClass}>random sentence generator</Link>. To pick between people or options, spin the{" "}
            <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link>.
          </p>
        </>
      }
    >
      <RandomEmojiGenerator />
    </GeneratorPageShell>
  );
}
