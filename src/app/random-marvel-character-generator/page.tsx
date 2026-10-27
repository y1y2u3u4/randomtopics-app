import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import MarvelCharacterGenerator from "@/components/generators/MarvelCharacterGenerator";
import { MARVEL_CHARACTERS, TEAMS, ERAS, eraOf } from "@/lib/generators/marvel";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-marvel-character-generator";
const TOTAL = MARVEL_CHARACTERS.length;
const TITLE = "Random Marvel Character Generator — Heroes, Villains & Wheel";
const DESCRIPTION = `Free random Marvel character generator: ${TOTAL} heroes, villains and anti-heroes with real names, debut year, powers and teams. Filter by team, era or power, spin the wheel, or guess the daily character. No signup.`;

const SOCIAL = generatorSocial({ card: "random-marvel-character-generator", title: TITLE, description: DESCRIPTION, alt: "Random Marvel Character Generator — comic books, a prize wheel and dice" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random marvel character generator", "random marvel character", "marvel character generator", "random marvel hero generator", "random superhero generator marvel", "marvel wheel spinner"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const count = (fn: (c: (typeof MARVEL_CHARACTERS)[number]) => boolean) => MARVEL_CHARACTERS.filter(fn).length;
const HEROES = count((c) => c.side === "hero");
const VILLAINS = count((c) => c.side === "villain");
const ANTI = count((c) => c.side === "anti");
const ON_SCREEN = count((c) => c.mcu);
const ERA_COUNTS = ERAS.map((e) => ({ ...e, n: count((c) => eraOf(c.debut).value === e.value) }));
const OLDEST = [...MARVEL_CHARACTERS].sort((a, b) => a.debut - b.debut)[0];

const FAQ = [
  {
    question: "How does the random Marvel character generator work?",
    answer: `Press Generate to draw 1, 3, 5 or 10 characters from a hand-written list of ${TOTAL} Marvel heroes, villains and anti-heroes. Each card shows the real name, the year of the first comic appearance, powers, teams and a one-line bio. Characters don't repeat until you've seen every match in the session.`,
  },
  {
    question: "Can I get only heroes, only villains or one team?",
    answer: `Yes. Filter by side (${HEROES} heroes, ${VILLAINS} villains, ${ANTI} anti-heroes), by team (${TEAMS.slice(0, 4).join(", ")} and ${TEAMS.length - 4} more), by comic-book age from the Golden Age to today, by power type, or only characters who have appeared in the movies and TV shows.`,
  },
  {
    question: "Is there a Marvel wheel spinner?",
    answer: "Switch to the Wheel tab. It loads 6 to 20 characters from your current filters onto a wheel; spin it, read the winner's card, and use Remove winner to knock characters out round by round.",
  },
  {
    question: "What is the daily Marvel character?",
    answer: "Every day at midnight UTC there is one character to guess from up to four clues: debut year, side and team, powers, and a redacted bio. Everyone gets the same character, your streak is saved in your browser, and you can share a result card without spoilers.",
  },
  {
    question: "What can I use a random Marvel character for?",
    answer: "Drawing and art challenges, cosplay ideas, fan-fiction prompts, trivia nights, picking who to read next, Marvel-themed party games, and settling debates such as 'who wins in a fight' between two random picks.",
  },
  {
    question: "Is this an official Marvel site?",
    answer: "No. Random Topics is an unofficial fan tool and is not affiliated with, endorsed or sponsored by Marvel or Disney. Character names belong to their owners; descriptions are written by us, and no official artwork or logos are used.",
  },
];

export default function RandomMarvelCharacterGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Marvel Character Generator"
      heading={["Random Marvel", "Character Generator"]}
      intro={`Draw random Marvel heroes, villains and anti-heroes from ${TOTAL} characters — or spin the wheel, or guess today's character.`}
      description={DESCRIPTION}
      hero={{ src: "/generators/hero/marvel.webp", alt: "Comic books, a small prize wheel, dice and an original caped toy hero" }}
      heroHideOnShort
      updated="2026-10-27"
      faq={FAQ}
      inShort={
        <p>
          <strong>In short:</strong> a free, no-signup random Marvel character generator with {TOTAL} characters ({HEROES} heroes, {VILLAINS} villains,{" "}
          {ANTI} anti-heroes) from {OLDEST.debut} to today. Every result shows the real name, debut year, powers and teams. Filter by team, era, power
          or on-screen appearances, spin a Marvel wheel, or play the daily guess. Unofficial fan tool, not affiliated with Marvel.
        </p>
      }
      related={[
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/character-name-generator", label: "Character name generator" },
        { href: "/spin-the-wheel", label: "Spin the wheel" },
        { href: "/headcanon-generator", label: "Headcanon generator" },
      ]}
      content={
        <>
          <SectionTitle>Every card is a character sheet</SectionTitle>
          <p>
            Most random Marvel pickers give you a name and nothing else. Here each result is a small character sheet — codename, real name, the year
            they first appeared in a comic, what they can do, who they team up with and a one-line bio — so you can use the pick straight away without
            opening a wiki. Keep the cards you like and swap the rest.
          </p>
          <SectionTitle>What&apos;s in the list</SectionTitle>
          <ul className="list-disc space-y-1 pl-5">
            {ERA_COUNTS.map((e) => (
              <li key={e.value}><strong>{e.label}</strong> ({e.range}): {e.n} characters</li>
            ))}
            <li><strong>Seen on screen</strong>: {ON_SCREEN} characters have appeared in Marvel Studios films or series.</li>
            <li><strong>Teams</strong>: {TEAMS.join(", ")}.</li>
          </ul>
          <SectionTitle>Ideas for your random Marvel character</SectionTitle>
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>Draw it in your style</strong> — generate one hero and one villain and sketch them meeting.</li>
            <li><strong>Who wins?</strong> Generate two characters and argue the fight using only their listed powers.</li>
            <li><strong>Team-up story</strong> — draw three characters from different eras and write how they end up on the same team. Stuck? Try a{" "}
              <Link prefetch={false} href="/headcanon-generator" className={linkClass}>headcanon</Link> or a{" "}
              <Link prefetch={false} href="/story-prompt-generator" className={linkClass}>story prompt</Link>.</li>
            <li><strong>Party round</strong> — spin the wheel and the person it lands on has to act the character out, charades style.</li>
          </ol>
          <p>
            Want an original character instead? The <Link prefetch={false} href="/random-character-generator" className={linkClass}>random character generator</Link>{" "}
            builds one from scratch, and the <Link prefetch={false} href="/character-name-generator" className={linkClass}>character name generator</Link> names them.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Facts follow the main Marvel Comics continuity; film and game versions can differ. Unofficial fan tool — not affiliated with, endorsed or
            sponsored by Marvel or Disney.
          </p>
        </>
      }
    >
      <MarvelCharacterGenerator />
    </GeneratorPageShell>
  );
}
