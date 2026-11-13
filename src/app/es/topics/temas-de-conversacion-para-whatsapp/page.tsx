import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import SpanishMostLikelyCollectionPage from "@/components/SpanishMostLikelyCollectionPage";
import { SPANISH_BATCH3 } from "@/data/spanishBatch3";
import { SITE_URL } from "@/i18n/config";

const config = SPANISH_BATCH3.whatsapp;
const canonical = `/es/topics/${config.slug}`;

export const metadata: Metadata = withSocial({
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  alternates: { canonical, languages: { es: `${SITE_URL}${canonical}`, "x-default": `${SITE_URL}${canonical}` } },
});

export default function WhatsappTopicsPage() {
  return <SpanishMostLikelyCollectionPage config={config} />;
}
