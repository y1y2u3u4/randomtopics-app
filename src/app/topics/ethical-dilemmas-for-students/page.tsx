import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { STUDENT_ETHICS_CONFIG } from "@/data/premiumEthics";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const config = STUDENT_ETHICS_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "ethical dilemmas for students",
    "moral dilemmas for students",
    "ethical dilemma scenarios for students",
    "classroom ethics activities",
    "ethical questions for students",
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

export default function EthicalDilemmasForStudentsPage() {
  return <PremiumCollectionPage config={config} />;
}
