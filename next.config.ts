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
    ];
  },
};

export default nextConfig;
