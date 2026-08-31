import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/es/:path*",
        headers: [{ key: "Content-Language", value: "es" }],
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
    ];
  },
};

export default nextConfig;
