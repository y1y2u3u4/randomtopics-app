import type { Metadata } from "next";
import { batch1Slugs, LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

// Data-driven Japanese pages (src/data/localePages/ja.batch1.ts).
export const dynamicParams = false;

export function generateStaticParams() {
  return batch1Slugs("ja").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return localePageMetadata(`/ja/${slug}`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LocaleConfigPage path={`/ja/${slug}`} />;
}
