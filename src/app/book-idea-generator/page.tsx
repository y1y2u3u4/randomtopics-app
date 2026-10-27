import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import BookIdeaGenerator from "@/components/generators/BookIdeaGenerator";
import { GENRES, combos } from "@/lib/generators/bookIdeas";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/book-idea-generator";
const TITLE = "Book Idea Generator — Random Novel & Plot Ideas (Free)";
const DESCRIPTION = `Free book idea generator: pick one of ${GENRES.length} genres and get a title, logline, protagonist, setting, conflict and twist. Lock what you like, re-roll the rest, save ideas to a shelf. Plus a daily book idea. No signup, no AI wait.`;

const SOCIAL = generatorSocial({ card: "book-idea-generator", title: TITLE, description: DESCRIPTION, alt: "Book idea generator — a stack of cloth-bound books, an open notebook, a fountain pen and dice" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["book idea generator", "book ideas generator", "random book idea generator", "novel idea generator", "story idea generator for books", "book plot generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const MIN_COMBOS = Math.min(...GENRES.map(combos));
const GENRE_LIST = GENRES.map((g) => g.label.toLowerCase()).join(", ");

const FAQ = [
  {
    question: "How does the book idea generator work?",
    answer: `Choose a genre and press New book idea. You get a working title, a one-sentence logline, a protagonist, a setting, the central conflict and a twist, all from word banks we wrote for each genre. Every genre has more than ${MIN_COMBOS.toLocaleString("en-US")} combinations, and results appear instantly — no AI wait and no signup.`,
  },
  {
    question: "Can I keep part of an idea and change the rest?",
    answer: "Yes. Every field has a lock and a re-roll button. Lock the title and twist you like, press New book idea, and only the unlocked parts change. Or re-roll a single field on its own.",
  },
  {
    question: "Which genres are included?",
    answer: `${GENRES.length} genres: ${GENRE_LIST}. Each has its own titles, characters, settings, conflicts and twists, so a romance never gets a horror twist by accident.`,
  },
  {
    question: "Is it a novel idea generator or a plot generator?",
    answer: "Both. The logline and conflict give you the premise of a novel, and the conflict line follows a simple plot shape — what happens, what the hero must do, and the deadline — with a twist for the third act. Use it as a book plot generator, then outline the scenes yourself.",
  },
  {
    question: "What is the book idea of the day?",
    answer: "Once a day at midnight UTC everyone gets the same book idea. You can share it as a cover-style image card, and your visit streak is saved in your browser.",
  },
  {
    question: "Can I use these book ideas for my own writing?",
    answer: "Yes. The ideas are free to use for novels, short stories, NaNoWriMo, writing classes and practice. Change anything you like — the best ideas usually come from mixing two results.",
  },
];

export default function BookIdeaGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Book Idea Generator"
      heading={["Book Idea", "Generator"]}
      intro="Random book ideas with a title, logline, protagonist, setting, conflict and twist — lock what you like and re-roll the rest."
      description={DESCRIPTION}
      hero={{ src: "/generators/hero/book.webp", alt: "Three cloth-bound books, an open notebook with a fountain pen, two dice and a paper boat" }}
      heroHideOnShort
      updated="2026-10-27"
      faq={FAQ}
      inShort={
        <p>
          <strong>In short:</strong> a free book idea generator for {GENRES.length} genres ({GENRE_LIST}). Each result is a complete premise — working
          title, logline, protagonist, setting, conflict and twist — that appears instantly with no signup and no paywall. Lock any part and re-roll
          the rest, save favourites to your shelf, copy the idea, or share the daily book idea as a cover card.
        </p>
      }
      related={[
        { href: "/story-prompt-generator", label: "Story prompt generator" },
        { href: "/random-idea-generator", label: "Random idea generator" },
        { href: "/my-9-books", label: "My 9 books" },
        { href: "/random-character-generator", label: "Random character generator" },
      ]}
      content={
        <>
          <SectionTitle>What a good book idea needs</SectionTitle>
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>A protagonist with a want</strong> — not just &quot;a girl&quot;, but a stable girl who can hear metal.</li>
            <li><strong>A setting that causes trouble</strong> — a city where the canals flow uphill does half the plotting for you.</li>
            <li><strong>A conflict with a clock</strong> — what happens, what they must do, and the deadline. The generator writes conflicts in exactly that shape.</li>
            <li><strong>A twist that changes the first chapter</strong> — the best twists make the reader want to start again.</li>
          </ol>
          <SectionTitle>How to turn the idea into a book</SectionTitle>
          <ul className="list-disc space-y-1 pl-5">
            <li>Write the logline on a card and keep it in view while you outline.</li>
            <li>Plan three acts: the inciting event, the attempt to reach the goal, and the twist near the end.</li>
            <li>Give the protagonist a flaw that the twist exposes.</li>
            <li>Need scenes? Use the <Link prefetch={false} href="/story-prompt-generator" className={linkClass}>story prompt generator</Link> for openings and
              the <Link prefetch={false} href="/random-character-generator" className={linkClass}>random character generator</Link> for the supporting cast.</li>
          </ul>
          <p>
            Looking for something to read rather than write? Make a <Link prefetch={false} href="/my-9-books" className={linkClass}>my 9 books</Link> grid of
            your favourites, or get any kind of prompt from the <Link prefetch={false} href="/random-idea-generator" className={linkClass}>random idea generator</Link>.
          </p>
        </>
      }
    >
      <BookIdeaGenerator />
    </GeneratorPageShell>
  );
}
