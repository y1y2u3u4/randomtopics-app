import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { ADULT_ETHICS_CONFIG } from "@/data/premiumAdultEthics";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const config = ADULT_ETHICS_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "ethical dilemmas for adults",
    "moral dilemmas for adults",
    "moral dilemma questions for adults",
    "ethical scenarios for adults",
    "adult ethics discussion questions",
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

export default function EthicalDilemmasForAdultsPage() {
  return <PremiumCollectionPage config={config} />;
}
