import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { FIVE_MINUTE_SPEECH_CONFIG } from "@/data/premiumFiveMinuteSpeech";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const config = FIVE_MINUTE_SPEECH_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "5 minute speech topics",
    "five minute speech topics",
    "5 minute speech topics for students",
    "short speech topics",
    "five minute presentation topics",
    "5 minute speech timer",
  ],
  alternates: {
    canonical: config.path,
    languages: hreflangAlternates(config.path),
  },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}${config.path}`,
    siteName: "Random Topics",
    type: "website",
  },
};

export default function FiveMinuteSpeechTopicsPage() {
  return <PremiumCollectionPage config={config} />;
}
