import type { Metadata } from "next";
import { batch1Slugs, LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

// Data-driven German pages (src/data/localePages/de.batch1.ts).
export const dynamicParams = false;

export function generateStaticParams() {
  return batch1Slugs("de").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return localePageMetadata(`/de/${slug}`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LocaleConfigPage path={`/de/${slug}`} />;
}
