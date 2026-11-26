import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-games";
const TITLE = "My 9 Games Template: 9 Games That Shaped Me Grid";
const DESCRIPTION =
  "Make your 9 Games That Shaped Me grid: search any game, box art fills in, then download a 3×3 PNG or story image or share a link. Free, no signup.";

const SOCIAL = generatorSocial({ card: "my-9-games", title: TITLE, description: DESCRIPTION, alt: "My 9 Games template — a 3×3 grid of video game covers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 games", "my9games", "my 9 games template", "9 games that made me", "9 games that define me", "9 games that define me template", "9 games that shaped me template", "my 9 games maker", "top 9 games template", "9 games template", "9 games that shaped who i am template", "9 games that made me template", "my nine games", "top 9 games maker", "my top 9 games template", "9 favorite games template", "my 9 maker", "video game grid maker", "favorite games grid", "3x3 games grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make a 9 Games That Shaped Me grid?", answer: "Type “9 games that shaped me” as the title, search each game and tap its cover into the 3×3 grid, put your earliest or most important game first, then Download PNG or Share image. It takes about two minutes and the title is printed on the image." },
  { question: "How do I make my 9 games grid?", answer: "Search a game, tap its cover to drop it into the next empty square, and repeat until all nine are filled. Then press Download PNG, or Share image on a phone." },
  { question: "Which games can I find?", answer: "Search covers games with a Wikipedia article — Nintendo, PlayStation, Xbox, PC and retro titles. A few famous games have no cover there (Minecraft is one); for those, upload your own picture for that square." },
  { question: "Can I rearrange the games?", answer: "Tap one square and then another to swap them, or drag a cover onto another square. Tap a square first if you want the next game to go exactly there." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine picks in the page address, so anyone who opens it sees the same grid and can download it too. Pictures you upload stay on your device and are not part of the link." },
  { question: "Is this a 9 games that define me template too?", answer: "Yes. “9 games that define me”, “9 games that shaped me”, “9 games that shaped who I am”, “9 games that made me”, “top 9 games”, “9 favorite games” and “my nine games” are all the same 3×3 template — type your own title above the grid (for example “9 games that shaped me”) and it is printed on the image." },
  { question: "Is there a 9 Games That Shaped Who I Am template?", answer: "This is it. Type “9 games that shaped who I am” as the title, fill the nine squares in the order the games came into your life, and download the 3×3 image. The title is printed on the picture, so the grid explains itself when you post it." },
  { question: "Is this a top 9 games maker?", answer: "Yes — a top 9 is the same 3×3 grid. Type “My top 9 games” as the title, put your number one game in the top-left square and rank the rest left to right, then download the PNG." },
  { question: "Does the My 9 Games template work on a phone?", answer: "Yes. Everything runs in your phone browser: search a game, tap its cover into the 3×3 grid, then tap Share image to send the picture straight to Instagram, X, Threads or TikTok, or Download PNG to save it. Nothing to install and no signup." },
  { question: "Is this the my9games site?", answer: "No. my9games.net and my9games.app are separate My 9 Games makers run by other people; this is the free My 9 Games template on Random Topics. It does the same job — search nine games, get a 3×3 image for your #my9games post — and adds a 1080×1920 story size, a share link that keeps your picks, your own photo for any square, and sister grids for albums, movies, anime and books." },
  { question: "My 9 Games or My 9 grid — which should I use?", answer: "Use this My 9 Games template when your picks are video games: it searches games and adds the box art for you. Use the My 9 grid maker when you want to fill the squares with your own photos or screenshots — anything at all." },
];

export default function MyNineGamesPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="My 9 Games"
      heading={["My 9 Games Template:", "9 Games That Shaped Me"]}
      intro="Pick the 9 games that made you — console, PC and retro — and download a square or story-size grid. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-11-26"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-characters", label: "My 9 Characters" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }]}
      inShort="Search any video game, tap nine covers into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Box art comes from each game's Wikipedia article — Nintendo, PlayStation, Xbox, PC and retro — and you can upload your own picture for anything missing."
      afterTool={<NineGridExamples kind="games" path={PATH} examples={EXAMPLES.games} />}
      content={
        <>
          <SectionTitle>What is My 9 Games?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Games</strong> is the 3×3 grid of the nine video games that shaped you — the trend that took over X and Threads, where posts are usually tagged #my9games. This template finds the box art for you and turns your picks into one clean image." }} />
          <SectionTitle>9 Games That Shaped Me</SectionTitle>
          <p>
            <strong>9 Games That Shaped Me</strong> is the same 3×3 grid with a sharper question: not your nine favourites, but the nine games that changed how you play, think or who you hang out with. A good grid usually tells a story in order — the first game you owned, the one you played with a sibling or friend, the game that got you through a hard year, the one that made you love a genre, and the game you still return to. Type “9 games that shaped me” as the title above the grid and it is printed on the downloaded image.
          </p>
          <p>
            Some people word it as <strong>9 Games That Shaped Who I Am</strong> or <strong>9 Games That Made Me</strong> — it is the same grid, so just type your own wording as the title.
          </p>
          <SectionTitle>How to make your My 9 Games grid</SectionTitle>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Type a title above the grid — “My 9 games”, “9 games that shaped me” or “My top 9 games”.</li>
            <li>Search a game and tap its cover; it drops into the next empty square.</li>
            <li>Fill all nine, then tap two squares to swap them until the order tells your story.</li>
            <li>Press Download PNG for a 1080×1080 square, tick Story size for 1080×1920, or Copy link to share the grid itself.</li>
          </ol>
          <SectionTitle>My 9 Games template vs My 9 grid</SectionTitle>
          <p>
            This page is the <strong>My 9 Games template</strong>: search a game and its box art drops into the grid, so you never hunt for covers. For a grid of your own photos, screenshots or anything that is not a game, use the <Link prefetch={false} href="/my-9-grid" className={linkClass}>My 9 grid maker</Link>. Albums, movies, anime and characters have their own templates in the tabs above the grid.
          </p>
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine games that made me · the games that made me a gamer · my 9 games of all time · 9 childhood games · nine games I'd replay forever · my top 9 indie games · my 9 favorite games · my nine games of the decade." }} />
        </>
      }
    >
      <NineGridTabs current="games" />
      <NineGridMaker kind="games" />
    </GeneratorPageShell>
  );
}
