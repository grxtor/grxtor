import type { MetadataRoute } from "next";
import { DATA_DEFAULTS } from "@/data/defaults";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${DATA_DEFAULTS.url}/sitemap.xml`,
    host: DATA_DEFAULTS.url,
  };
}
