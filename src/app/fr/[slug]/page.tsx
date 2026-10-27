import type { Metadata } from "next";
import { batch1Slugs, LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

// Batch-1 data-driven pages (src/data/localePages/fr.batch1.ts). Existing
// hand-written pages under /fr keep their own static folders, which win over
// this dynamic segment.
export const dynamicParams = false;

export function generateStaticParams() {
  return batch1Slugs("fr").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return localePageMetadata(`/fr/${slug}`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LocaleConfigPage path={`/fr/${slug}`} />;
}
