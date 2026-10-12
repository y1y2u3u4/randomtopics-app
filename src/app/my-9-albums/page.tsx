import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import NineGridMaker from "@/components/generators/NineGridMaker";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/my-9-albums";
const TITLE = "My 9 Albums Template — Make Your 3×3 Album Grid, Free & No Watermark";
const DESCRIPTION =
  "Free My 9 Albums maker: search any album, tap 9 covers and download your 3×3 album grid as a PNG — the 9 albums that define you. Real album art, rearrange by tapping, no signup, no watermark.";

const SOCIAL = generatorSocial({ card: "my-9-albums", title: TITLE, description: DESCRIPTION, alt: "My 9 Albums template — a 3×3 grid of album covers" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["my 9 albums", "my9albums", "my 9 albums template", "9 albums that define me", "album grid maker", "3x3 album grid", "topster alternative"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "How do I make my 9 albums grid?", answer: "Type an album or artist into the search box and tap a cover to drop it into the next empty square. When all nine squares are filled, press Download PNG (or Share image on your phone) and post it." },
  { question: "Can I change the order?", answer: "Yes. Tap one square, then tap another to swap them, or drag a cover onto another square on a computer. To replace a cover, tap its square first and then pick the new album." },
  { question: "Is there a watermark?", answer: "No. The PNG is just your title, optional name and the nine covers \u2014 nothing else is added." },
  { question: "Where do the covers come from?", answer: "Album art comes from Apple's public iTunes search and loads straight into your browser. We don't upload or store your grid. If an album is missing, upload your own picture for that square." },
  { question: "Can I share the grid as a link?", answer: "Copy link saves the nine albums in the page address, so anyone who opens it sees the same grid and can download it too. Uploaded pictures stay on your device and are not part of the link." },
];

export default function MyNineAlbumsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="My 9 Albums"
      heading={["My 9", "Albums"]}
      intro="Search any album, tap 9 covers, download your 3×3 grid. Real album art, no signup, no watermark."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ}
      related={[{ href: "/my-9-games", label: "My 9 Games" }, { href: "/my-9-anime", label: "My 9 Anime" }, { href: "/my-9-grid", label: "My 9 grid from your own pictures" }, { href: "/random-word-generator", label: "Random word generator" }]}
      content={
        <>
          <SectionTitle>What is My 9 Albums?</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "<strong>My 9 Albums</strong> is a social trend: a 3\u00d73 grid of the nine albums that define your taste, shared on X, Threads, Instagram and Reddit. This free template does the fiddly part \u2014 finding clean square cover art and lining it up \u2014 so you only have to choose." }} />
          <SectionTitle>Ideas for your grid</SectionTitle>
          <p dangerouslySetInnerHTML={{ __html: "Nine albums that define me \u00b7 nine albums I'd take to a desert island \u00b7 my 9 albums of the year \u00b7 my 9 albums from high school \u00b7 nine perfect albums with no skips \u00b7 9 albums to introduce someone to a genre." }} />
        </>
      }
    >
      <NineGridMaker kind="albums" />
    </GeneratorPageShell>
  );
}
