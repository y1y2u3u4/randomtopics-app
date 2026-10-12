import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-games";
const TITLE = "My 9 Games — Make Your 3×3 Favorite Games Grid, Free Template";
const DESCRIPTION =
  "Free My 9 Games maker: search any video game — console, PC or retro — tap 9 covers and download your 3×3 favorite games grid as a PNG. The 9 games that define you, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-games", title: TITLE, description: DESCRIPTION, alt: "My 9 Games template — a 3×3 grid of video game covers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 games", "my9games", "my 9 games template", "9 games that define me", "favorite games grid", "3x3 games grid", "games that made me"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 games grid?", answer: "Search a game, tap its cover to drop it into the next empty square, and repeat until all nine are filled. Then press Download PNG, or Share image on a phone." },
  { question: "Which games can I find?", answer: "Search covers games with a Wikipedia article \u2014 Nintendo, PlayStation, Xbox, PC and retro titles. A few famous games have no cover there; for those, upload your own picture for that square." },
  { question: "Can I rearrange the games?", answer: "Tap one square and then another to swap them, or drag a cover onto another square. Tap a square first if you want the next game to go exactly there." },
  { question: "Is it free and without a watermark?", answer: "Yes. There is no signup and nothing is added to your image apart from the title and the optional name you type." },
  { question: "Can I share it as a link?", answer: "Copy link keeps your nine games in the page address, so friends can open the same grid. Uploaded pictures stay on your device and are not part of the link." },
];

export default function MyNineGamesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Games"
      heading={["My 9", "Games"]}
      intro="Search any video game, tap 9 covers, download your 3×3 grid. Console, PC and retro — no signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/dnd-name-generator", label: "D&D name generator" }]}
      content={
        <>
          <SectionTitle>What is My 9 Games?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Games</strong> is the 3\u00d73 grid of the nine video games that shaped you \u2014 the trend that took over X and Threads. This template finds the box art for you and turns your picks into one clean image." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine games that define me \u00b7 the games that made me a gamer \u00b7 my 9 games of all time \u00b7 9 childhood games \u00b7 nine games I'd replay forever \u00b7 my top 9 indie games." }} />
        </>
      }
    >
      <NineGridMaker kind="games" />
    </GeneratorPageShell>
  );
}
