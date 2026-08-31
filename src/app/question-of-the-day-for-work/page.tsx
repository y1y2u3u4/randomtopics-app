import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { WORK_QOTD_CONFIG } from "@/data/premiumQotd";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = WORK_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "question of the day for work",
    "work question of the day",
    "daily team questions",
    "questions of the day for coworkers",
    "remote team daily question",
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

export default function QuestionOfTheDayForWorkPage() {
  return <PremiumCollectionPage config={config} />;
}
