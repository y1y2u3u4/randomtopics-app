import type { Metadata } from "next";
import { SITE_URL } from "@/i18n/config";

// Pages that set only title/description/canonical inherit the layout's home
// Open Graph block, so shares and AI previews showed the home title and URL.
// This fills openGraph and twitter from the page's own fields when missing.
export function withSocial(meta: Metadata): Metadata {
  const t = meta.title;
  const title = typeof t === "string" ? t : t && typeof t === "object" && "absolute" in t ? String(t.absolute) : undefined;
  const description = meta.description ?? undefined;
  const canonical = meta.alternates?.canonical;
  const path = typeof canonical === "string" ? canonical : undefined;
  return {
    ...meta,
    openGraph: meta.openGraph ?? { title, description, url: path ? `${SITE_URL}${path}` : undefined, siteName: "Random Topics", type: "website" },
    twitter: meta.twitter ?? { card: "summary_large_image", title, description },
  };
}
