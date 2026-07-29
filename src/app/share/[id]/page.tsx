import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalizedTopics } from "@/data/topics.es";
import type { Locale } from "@/i18n/config";
import SharedTopicView from "@/components/SharedTopicView";

interface SharedTopicPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

function requestedLocale(lang?: string): Locale {
  return lang === "es" ? "es" : "en";
}

export async function generateMetadata({ params, searchParams }: SharedTopicPageProps): Promise<Metadata> {
  const [{ id }, { lang }] = await Promise.all([params, searchParams]);
  const locale = requestedLocale(lang);
  const topic = getLocalizedTopics(locale).find((candidate) => candidate.id === id);
  if (!topic) return {};

  return {
    title: {
      absolute:
        locale === "es"
          ? `Tema al azar: ${topic.text} | RandomTopics`
          : `Random Topic: ${topic.text} | RandomTopics`,
    },
    description: topic.talkingPoints.slice(0, 2).join(" · "),
    robots: { index: false, follow: true },
    openGraph: {
      title: topic.text,
      description: topic.talkingPoints.slice(0, 2).join(" · "),
      type: "article",
    },
  };
}

export default async function SharedTopicPage({ params, searchParams }: SharedTopicPageProps) {
  const [{ id }, { lang }] = await Promise.all([params, searchParams]);
  const locale = requestedLocale(lang);
  const topic = getLocalizedTopics(locale).find((candidate) => candidate.id === id);
  if (!topic) notFound();
  return <SharedTopicView topic={topic} locale={locale} />;
}
