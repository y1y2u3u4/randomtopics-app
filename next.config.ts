import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/speech/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        // Only private practice routes must be excluded. The public speech
        // hub and curated topic pages have their own indexable metadata.
        source: "/speech/account/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/speech/practice/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/speech/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/classroom/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/account",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        source: "/classroom/present",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/es/:path*",
        headers: [{ key: "Content-Language", value: "es" }],
      },
      {
        source: "/tr/:path*",
        headers: [{ key: "Content-Language", value: "tr" }],
      },
      {
        source: "/pt/:path*",
        headers: [{ key: "Content-Language", value: "pt" }],
      },
      {
        // Reinforce the HTML robots directive for this browser-local utility
        // page. It must remain crawlable so Google can see noindex and remove
        // any stale search result, but it must never become a landing page.
        source: "/saved-topics",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/es/saved-topics",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/internal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/api/internal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy internal links pointed at /article/<slug>; canonical route is /topics/<slug>
      {
        source: "/article/:slug",
        destination: "/topics/:slug",
        permanent: true,
      },
      // /topic-generator overlaps the homepage for the same head intent.
      // Consolidate canonical and internal signals into the primary tool at /.
      {
        source: "/topic-generator",
        destination: "/",
        permanent: true,
      },
      {
        source: "/es/topic-generator",
        destination: "/es",
        permanent: true,
      },
      // "my 9 albums template" is covered by /my-9-albums; one page per intent.
      {
        source: "/remove-ai-metadata",
        destination: "/ai-metadata-remover",
        permanent: true,
      },
      {
        source: "/my-9-albums-template",
        destination: "/my-9-albums",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
