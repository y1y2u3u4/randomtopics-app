import type { Metadata } from "next";
import PremiumCollectionPage from "@/components/PremiumCollectionPage";
import { NOVEMBER_QOTD_CONFIG } from "@/data/seasonalQotd";
import { SITE_URL } from "@/i18n/config";

export const revalidate = 3600;
const config = NOVEMBER_QOTD_CONFIG;

export const metadata: Metadata = {
  title: { absolute: config.metaTitle },
  description: config.metaDescription,
  keywords: [
    "november question of the day",
    "november questions of the day",
    "november qotd",
    "november questions for kids",
    "november questions for work",
  ],
  alternates: { canonical: config.path },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `${SITE_URL}${config.path}`,
    siteName: "Random Topics",
    type: "website",
  },
};

export default function NovemberQuestionOfTheDayPage() {
  return <PremiumCollectionPage config={config} />;
}
