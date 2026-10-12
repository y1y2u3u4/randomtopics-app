import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-games";
const TITLE = "My 9 Games Template — Make a 3×3 Grid of the 9 Games That Made You";
const DESCRIPTION =
  "Free My 9 Games template: search any video game — console, PC or retro — pick the 9 games that made you and download a 1080×1080 3×3 grid or story poster. Box art included, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-games", title: TITLE, description: DESCRIPTION, alt: "My 9 Games template — a 3×3 grid of video game covers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 games", "my9games", "my 9 games template", "9 games that made me", "9 games that define me", "favorite games grid", "3x3 games grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 games grid?", answer: "Search a game, tap its cover to drop it into the next empty square, and repeat until all nine are filled. Then press Download PNG, or Share image on a phone." },
  { question: "Which games can I find?", answer: "Search covers games with a Wikipedia article — Nintendo, PlayStation, Xbox, PC and retro titles. A few famous games have no cover there (Minecraft is one); for those, upload your own picture for that square." },
  { question: "Can I rearrange the games?", answer: "Tap one square and then another to swap them, or drag a cover onto another square. Tap a square first if you want the next game to go exactly there." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
];

export default function MyNineGamesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Games"
      heading={["My 9", "Games"]}
      intro="Pick the 9 games that made you — console, PC and retro — and download a square or story-size grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/dnd-name-generator", label: "D&D name generator" }]}
      inShort="Search any video game, tap nine covers into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Box art comes from each game's Wikipedia article — Nintendo, PlayStation, Xbox, PC and retro — and you can upload your own picture for anything missing."
      afterTool={<NineGridExamples kind="games" path={PATH} examples={EXAMPLES.games} />}
      content={
        <>
          <SectionTitle>What is My 9 Games?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Games</strong> is the 3×3 grid of the nine video games that shaped you — the trend that took over X and Threads. This template finds the box art for you and turns your picks into one clean image." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine games that made me · the games that made me a gamer · my 9 games of all time · 9 childhood games · nine games I'd replay forever · my top 9 indie games." }} />
        </>
      }
    >
      <NineGridTabs current="games" />
      <NineGridMaker kind="games" />
    </GeneratorPageShell>
  );
}
