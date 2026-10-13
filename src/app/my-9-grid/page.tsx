import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import NineGridTabs from "@/components/generators/NineGridTabs";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-grid";
const TITLE = "3x3 Grid Maker (My 9 Template) — Make a 3×3 Picture Grid, Free";
const DESCRIPTION =
  "Free 3×3 grid maker for the My 9 trend: add any 9 pictures — K-pop, characters, foods, places — rearrange them and download one 1080×1080 PNG or story image. Works in your browser, no upload, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-grid", title: TITLE, description: DESCRIPTION, alt: "My 9 grid maker — a 3×3 picture grid template" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["3x3 maker", "3x3 grid maker", "3x3 generator", "my 9 grid", "9 grid template", "my 9 template", "3x3 picture grid", "9 picture collage", "my top 9 maker"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How does the 3×3 grid maker work?", answer: "Choose up to nine pictures from your phone or computer. They fill the squares in order; tap two squares to swap them, then press Download PNG." },
  { question: "Are my pictures uploaded?", answer: "No. The grid is drawn in your browser and the pictures never leave your device." },
  { question: "Is there a template for albums, games, movies, anime or books?", answer: "Yes — use the tabs above the tool to search covers instead of uploading them." },
  { question: "What size is the image?", answer: "1080×1080 pixels by default — the square size Instagram, X and Threads show best. Tick Story size for a 1080×1920 image for Instagram or TikTok stories. There is no watermark." },
];

export default function MyNineGridPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Grid Maker"
      heading={["My 9", "Grid Maker"]}
      intro="Any 9 pictures in one 3×3 image — characters, foods, places. Stays in your browser, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-movies", label: "My 9 Movies" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-books", label: "My 9 Books" }, { href: "/random-food-generator", label: "Random food generator" }]}
      inShort="A free 3x3 maker (also called a 3x3 grid maker or 3x3 generator): choose up to nine pictures from your device, reorder them by tapping two squares, give the grid a title and download a 1080×1080 PNG or a story-size image. Everything happens in your browser — your pictures are never uploaded."
      content={
        <>
          <SectionTitle>Any topic, nine pictures</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "The My 9 trend works for anything: K-pop groups, characters, foods, cities, TV shows. Add your nine pictures, give the grid a title like “My 9 Comfort Foods”, and download it." }} />
          <SectionTitle>Tips</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Square pictures look best. Turn on Show titles to print each file name under its picture — rename files before adding them if you want neat captions." }} />
        </>
      }
    >
      <NineGridTabs current="any" />
      <NineGridMaker kind="any" />
    </GeneratorPageShell>
  );
}
