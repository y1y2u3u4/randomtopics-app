import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { ONE_MINUTE_SPEECH_CONFIG } from "@/data/premiumOneMinuteSpeech";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const config = ONE_MINUTE_SPEECH_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "1 minute speech topics",
    "one minute speech topics",
    "random topics to talk about for 1 minute",
    "1 minute talk random topic wheel",
    "random topic generator to talk about 1 minute",
    "just a minute topics",
    "1 minute speech timer",
  ],
  alternates: { canonical: config.path, languages: hreflangAlternates(config.path) },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}${config.path}`,
    siteName: "Random Topics",
    type: "website",
  },
};

export default function OneMinuteSpeechTopicsPage() {
  return <PremiumCollectionPage config={config} />;
}
