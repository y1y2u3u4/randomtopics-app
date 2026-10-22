import type { Metadata } from "next";
import TextToolPage from "@/components/generators/TextToolPage";
import { TEXT_TOOL_PAGES } from "@/data/textToolPages";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const P = TEXT_TOOL_PAGES.strike;
const SOCIAL = generatorSocial({ card: P.card, title: P.title, description: P.description, alt: `${P.name} — copy and paste text styles` });

export const metadata: Metadata = {
  title: { absolute: P.title },
  description: P.description,
  keywords: P.keywords,
  alternates: { canonical: P.path, languages: hreflangAlternates(P.path) },
  openGraph: { title: P.title, description: P.description, url: `${SITE_URL}${P.path}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

export default function StrikethroughTextGeneratorPage() {
  return <TextToolPage variant="strike" />;
}
