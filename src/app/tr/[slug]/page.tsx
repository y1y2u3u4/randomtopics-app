import type { Metadata } from "next";
import { batch1Slugs, LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

// Batch-1 data-driven pages (src/data/localePages/tr.batch1.ts). Existing
// hand-written pages under /tr keep their own static folders, which win over
// this dynamic segment.
export const dynamicParams = false;

export function generateStaticParams() {
  return batch1Slugs("tr").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return localePageMetadata(`/tr/${slug}`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LocaleConfigPage path={`/tr/${slug}`} />;
}
