import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WuTangNameGenerator from "@/components/generators/WuTangNameGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { WU_COMBINATIONS, WU_FIRST, WU_SECOND, nameFor } from "@/lib/generators/wuTang";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/wu-tang-name-generator";
const TITLE = "Wu-Tang Name Generator — What's Your Wu-Tang Name?";
const DESCRIPTION = "Free Wu-Tang name generator: type your name to get your own Wu name — same name, same result — or roll a random one. Download a share card.";

const SOCIAL = generatorSocial({ card: "wu-tang-name-generator", title: TITLE, description: DESCRIPTION, alt: "Wu-Tang Name Generator — a bold black and gold name card" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["wu tang name generator", "wu-tang name generator", "wu-tang clan name generator", "wu name generator", "what's my wu tang name", "wu tang name", "wu name"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const COMBOS = WU_COMBINATIONS.toLocaleString("en-US");

// Real output: the name mode is deterministic, so these match what visitors get.
const sample = (names: string[]) =>
  names.map((n) => {
    const r = nameFor(n)!;
    return { title: r.full, subtitle: `for “${n}”`, detail: r.origin };
  });

const EXAMPLES = [
  { label: "Classic names", results: sample(["Alex", "Maria", "Jordan"]) },
  { label: "More names", results: sample(["Chris", "Sarah", "Mike"]) },
  { label: "Even more", results: sample(["Jessica", "David", "Taylor"]) },
];

const FAQ = [
  {
    question: "What is my Wu-Tang name?",
    answer: `Type your first name (or full name, or nickname) into the box and press "Get my Wu name". The generator turns it into a two-word Wu-style name — a bold first word like Ruthless, Mighty or Celestial plus a character like Bandit, Monk or Professor — with a short made-up origin story. There are ${COMBOS} possible combinations.`,
  },
  {
    question: "Why do I get the same Wu-Tang name every time?",
    answer: "On purpose. Your name is run through a fixed hash, so the same name always gives the same Wu name — on any phone or computer, today or next year. Capital letters and extra spaces are ignored, so \"alex\" and \" Alex \" match. Want something different? Try your full name, a nickname, or press the random button.",
  },
  {
    question: "How did Wu-Tang Clan members get their names?",
    answer: "The group's members built their stage names from the things they loved: 1970s and 80s kung-fu films (the group name itself nods to the Wudang sword style seen in those movies), comic-book alter egos and superhero personas, mafia-movie and street nicknames, and terms from Five-Percent Nation teachings. Most members also carried several aliases at once, switching personas from song to song.",
  },
  {
    question: "Is this the official Wu-Tang name generator?",
    answer: "No. This is an unofficial fan tool made by randomtopics.app. It is not affiliated with, endorsed by or connected to Wu-Tang Clan, its members or its record labels. It doesn't use their logo, artwork or lyrics, and it never hands out a real member's name.",
  },
  {
    question: "Can I use my Wu name as a stage name or gamertag?",
    answer: "Sure. Results are generic word pairs, so they work well as gamertags, Discord and Twitch handles, DJ or rapper stage names, fantasy-team names or party icebreakers. If you plan to use one commercially, do a quick search first to make sure nobody else is already using it.",
  },
  {
    question: "Can I share my Wu-Tang name?",
    answer: "Yes. Download a ready-made square PNG card for Instagram, TikTok or a group chat, share it straight from your phone, or copy a link — anyone who opens the link sees exactly the same name.",
  },
];

export default function WuTangNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Wu-Tang Name Generator"
      heading={["Wu-Tang Name", "Generator"]}
      intro="Type your name and find out what your Wu-Tang name is — the same name always gets the same result. Or roll a random one and download a share card."
      description={DESCRIPTION}
      updated="2026-10-14"
      faq={FAQ}
      related={[
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/japanese-name-generator", label: "Japanese name generator" },
        { href: "/viking-name-generator", label: "Viking name generator" },
      ]}
      inShort={
        <>
          This Wu-Tang name generator turns your name into a two-word Wu-style alias — a fierce first word plus a kung-fu-film character —
          with a made-up origin story. The same name always returns the same Wu name, and you can download it as a share card.
        </>
      }
      content={
        <>
          <SectionTitle>What&apos;s my Wu-Tang name?</SectionTitle>
          <p>
            This <strong>Wu-Tang name generator</strong> gives everyone a fixed Wu name. Type your name and it is hashed into one of{" "}
            {WU_FIRST.length} first words and one of {WU_SECOND.length} second words — {COMBOS} combinations in total, with a rare
            third flourish like &ldquo;of the Hidden Temple&rdquo; on top. Because the result is tied to your name, you can ask your friends
            &ldquo;what&apos;s my Wu-Tang name?&rdquo;, and they&apos;ll get the same answer when they type it in.
          </p>
          <SectionTitle>How a Wu-style name is built</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>First word</strong> — an attitude or title: Ruthless, Celestial, Unbothered, Doctah, Kung-Fu.</li>
            <li><strong>Second word</strong> — a character out of an old martial-arts film or comic: Assassin, Monk, Swordsman, Professor, Mantis.</li>
            <li><strong>Origin line</strong> — a one-line, tongue-in-cheek legend explaining how you earned it.</li>
          </ul>
          <SectionTitle>Wu-Tang Clan name generator vs. a random Wu name</SectionTitle>
          <p>
            Most <strong>Wu-Tang Clan name generator</strong> sites only do one thing: your name in, one name out. This one does that, and
            also has a random mode that never repeats a recent result — handy for picking a gamertag or naming a whole crew. Every result
            comes with a downloadable square card and a link that reopens the exact same <strong>Wu name</strong>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Real results for common names — type the same name above and you'll get the same Wu name:" sets={EXAMPLES} />
          <p>
            Looking for a different kind of alias? Try the{" "}
            <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> or the{" "}
            <Link prefetch={false} href="/japanese-name-generator" className={linkClass}>Japanese name generator</Link>.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Unofficial fan tool. Not affiliated with or endorsed by Wu-Tang Clan or its members. All word lists and origin lines are original.
          </p>
        </>
      }
    >
      <WuTangNameGenerator />
    </GeneratorPageShell>
  );
}
