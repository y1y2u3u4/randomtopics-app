import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-manga";
const TITLE = "My 9 Manga Template — Make a 3×3 Grid of Your 9 Favorite Manga";
const DESCRIPTION =
  "Free My 9 Manga template: search any manga, manhwa or manhua, pick your 9 favorites and download a 1080×1080 3×3 cover grid or story image. Covers from AniList, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-manga", title: TITLE, description: DESCRIPTION, alt: "My 9 Manga template — a 3×3 grid" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 manga", "my9manga", "my 9 manga template", "my 9 favorite manga", "9 manga that made me", "manhwa grid", "3x3 manga grid"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 manga grid?", answer: "Search a title in English or romaji, tap a cover to drop it into the next empty square and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Does it include manhwa and webtoons?", answer: "Yes. The search covers manga, Korean manhwa, Chinese manhua, webtoons and light novels listed on AniList, so Solo Leveling and Tower of God show up next to One Piece." },
  { question: "Why does my manga show its English title?", answer: "The grid uses the official English title when there is one and the romaji title otherwise. Edit the grid title or turn captions off if you prefer." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Is there a My 9 Anime version?", answer: "Yes — My 9 Anime uses the same maker with anime posters, and My 9 Characters lets you pick favorite characters instead of series." },
];

export default function MyNineMangaPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Manga"
      heading={["My 9", "Manga"]}
      intro="Pick the 9 manga that made you and download a square or story-size cover grid. Manhwa and manhua included. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-11-03"
      faq={FAQ}
      related={[{ href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-characters", label: "My 9 Characters" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }]}
      inShort="Search any manga, manhwa or manhua, tap nine covers into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Covers come from AniList's database; adult titles are filtered out."
      afterTool={<NineGridExamples kind="manga" path={PATH} examples={EXAMPLES.manga} />}
      content={
        <>
          <SectionTitle>What is My 9 Manga?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Manga</strong> is a 3×3 grid of the nine manga that shaped your taste, popular on X, TikTok and Reddit. Pick your nine and the template turns the covers into one shareable image." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p>9 manga that made me · my favorite manhwa · 9 manga I'd recommend to a beginner · best manga endings · my comfort shoujo · 9 manga that deserve an anime.</p>
        </>
      }
    >
      <NineGridTabs current="manga" />
      <NineGridMaker kind="manga" />
    </GeneratorPageShell>
  );
}
