import type { MetadataRoute } from "next";
import { allPosts } from "content-collections";
import { DATA_DEFAULTS } from "@/data/defaults";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = allPosts.map((post) => ({
    url: `${DATA_DEFAULTS.url}/blog/${post._meta.path.replace(/\.mdx$/, "")}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: DATA_DEFAULTS.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${DATA_DEFAULTS.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts,
  ];
}
