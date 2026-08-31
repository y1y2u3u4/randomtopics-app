import type { Metadata } from "next";
import PurposeGeneratorPage from "@/components/PurposeGeneratorPage";
import { PURPOSE_GENERATORS_ES } from "@/data/purposeGenerators.es";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const config = PURPOSE_GENERATORS_ES.presentation;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: {
    canonical: `/es/${config.slug}`,
    languages: hreflangAlternates("/presentation-topic-generator"),
  },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}/es/${config.slug}`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

export default function GeneradorTemasParaExponerPage() {
  return <PurposeGeneratorPage config={config} />;
}
