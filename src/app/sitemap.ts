import { MetadataRoute } from "next";
import { CATEGORIES, MODES } from "@/data/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://randomtopics.app";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const modePages: MetadataRoute.Sitemap = MODES.map((mode) => ({
    url: `${baseUrl}/${mode.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const funnyPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/funny`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categories/${cat.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...modePages, ...funnyPage, ...categoryPages];
}
