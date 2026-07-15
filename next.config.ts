import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy internal links pointed at /article/<slug>; canonical route is /topics/<slug>
      {
        source: "/article/:slug",
        destination: "/topics/:slug",
        permanent: true,
      },
      // /topic-generator cannibalized the homepage for the head term "random
      // topic generator" (GSC: / at pos 42.6 vs /topic-generator at 67.7 for the
      // same queries). Consolidate signals into the homepage, which owns the term.
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
