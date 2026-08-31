import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { WORKPLACE_ETHICS_CONFIG } from "@/data/premiumEthics";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const config = WORKPLACE_ETHICS_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "workplace ethical dilemmas",
    "ethical dilemmas at work",
    "workplace ethics scenarios",
    "ethical dilemma examples for managers",
    "ethics training scenarios",
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

export default function WorkplaceEthicalDilemmasPage() {
  return <PremiumCollectionPage config={config} />;
}
