import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { STUDENT_QOTD_CONFIG } from "@/data/premiumQotd";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = STUDENT_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "question of the day for students",
    "classroom question of the day",
    "morning meeting questions",
    "daily questions for students",
    "question of the day for school",
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

export default function QuestionOfTheDayForStudentsPage() {
  return <PremiumCollectionPage config={config} />;
}
