import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-grid";
const TITLE = "My 9 Grid Maker — Make a 3×3 Picture Grid from Any 9 Images, Free";
const DESCRIPTION =
  "Free 3×3 grid maker for the My 9 trend: add any 9 pictures — movies, books, songs, characters, foods — rearrange them and download one PNG. Works in your browser, no upload, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-grid", title: TITLE, description: DESCRIPTION, alt: "My 9 grid maker — a 3×3 picture grid template" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 grid", "3x3 grid maker", "9 grid template", "my 9 template", "3x3 picture grid", "9 picture collage", "my top 9 maker"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How does the 3\u00d73 grid maker work?", answer: "Choose up to nine pictures from your phone or computer. They fill the squares in order; tap two squares to swap them, then press Download PNG." },
  { question: "Are my pictures uploaded?", answer: "No. The grid is drawn in your browser and the pictures never leave your device." },
  { question: "Is there a template for albums, games or anime?", answer: "Yes \u2014 My 9 Albums, My 9 Games and My 9 Anime let you search covers instead of uploading them." },
  { question: "Is there a watermark?", answer: "No, the PNG has only your title, optional name and pictures." },
];

export default function MyNineGridPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Grid Maker"
      heading={["My 9", "Grid Maker"]}
      intro="Any 9 pictures in one 3×3 image — movies, books, characters, foods. Stays in your browser, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-albums", label: "My 9 Albums" }, { href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/random-food-generator", label: "Random food generator" }]}
      content={
        <>
          <SectionTitle>Any topic, nine pictures</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "The My 9 trend works for anything: movies, books, TV shows, K-pop groups, characters, foods, cities. Add your nine pictures, give the grid a title like \u201cMy 9 Movies\u201d, and download it." }} />
          <SectionTitle>Tips</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Square pictures look best. Turn on Show titles to print each file name under its picture \u2014 rename files before adding them if you want neat captions." }} />
        </>
      }
    >
      <NineGridMaker kind="any" />
    </GeneratorPageShell>
  );
}
