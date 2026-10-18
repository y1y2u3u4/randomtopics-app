import { MetadataRoute } from "next";

const disallow = ["/internal/", "/api/internal/"];
// Named so AI search and answer engines see an explicit allow, not only "*".
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: "https://randomtopics.app/sitemap.xml",
  };
}
