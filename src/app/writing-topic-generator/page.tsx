import type { Metadata } from "next";
import PurposeGeneratorPage from "@/components/PurposeGeneratorPage";
import { PURPOSE_GENERATORS } from "@/data/purposeGenerators";
import { SITE_URL } from "@/i18n/config";

const config = PURPOSE_GENERATORS.writing;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: { canonical: `/${config.slug}` },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}/${config.slug}`,
    siteName: "Random Topics",
    type: "website",
  },
};

export default function WritingTopicGeneratorPage() {
  return <PurposeGeneratorPage config={config} />;
}
