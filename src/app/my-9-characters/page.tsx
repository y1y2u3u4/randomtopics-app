import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import NineGridExamples from "@/components/generators/NineGridExamples";
import EXAMPLES from "@/data/generators/my9Examples.json";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-characters";
const TITLE = "My 9 Characters Template — Make a 3×3 Grid of Your 9 Favorite Characters";
const DESCRIPTION =
  "Free My 9 Characters template: search any anime or manga character, pick your 9 favorite characters and download a 1080×1080 3×3 grid or story image. Art from AniList, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-characters", title: TITLE, description: DESCRIPTION, alt: "My 9 Characters template — a 3×3 grid" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 characters", "my9characters", "my 9 favorite characters", "my 9 characters template", "favorite characters grid", "9 characters that made me", "3x3 characters template"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 favorite characters grid?", answer: "Search a character by name, tap their picture to drop it into the next empty square and fill all nine. Then press Download PNG, or Share image on a phone." },
  { question: "Which characters can I search?", answer: "Characters from anime, manga and manhwa listed on AniList — over 100,000 of them, from Luffy and Gojo to side characters. Each result shows the series they are from." },
  { question: "Can I add characters from games, cartoons or movies?", answer: "Use Upload your own picture for characters outside anime and manga, such as game, Disney or Marvel characters. Uploaded pictures stay on your device." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
  { question: "Can I share the grid as a link?", answer: "Copy link keeps your nine searched picks in the page address, so friends see the same grid. Uploaded pictures are not part of the link." },
];

export default function MyNineCharactersPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="My 9 Characters"
      heading={["My 9", "Characters"]}
      intro="Pick your 9 favorite characters and download a square or story-size grid. Search anime and manga characters, or upload any picture. No signup, no watermark."
      description={DESCRIPTION}
      updated="2026-11-03"
      faq={FAQ}
      related={[{ href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-manga", label: "My 9 Manga" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-shows", label: "My 9 Shows" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/4-characters-i-like", label: "4 Characters I Like (2×2 with reasons)" }, { href: "/ship-tier-list", label: "Ship Tier List Maker" }]}
      inShort="Search any anime or manga character, tap nine pictures into the 3×3 grid, reorder them, and download a 1080×1080 PNG or a story-size image. Character art and series names come from AniList; upload a picture for characters from games, cartoons or films."
      afterTool={<NineGridExamples kind="characters" path={PATH} examples={EXAMPLES.characters} />}
      content={
        <>
          <SectionTitle>What is My 9 Characters?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Characters</strong> (or “my 9 favorite characters”) is a 3×3 grid of the fictional characters you love most, shared on X, TikTok and Tumblr to show your taste at a glance." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p>my 9 favorite characters · 9 best villains · my comfort characters · characters I relate to · 9 best-written characters · my favorite duos, split across the grid.</p>
        </>
      }
    >
      <NineGridTabs current="characters" />
      <NineGridMaker kind="characters" />
    </GeneratorPageShell>
  );
}
