import type { MetadataRoute } from "next";

import { legacyRoutes, routes } from "@/lib/routes";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzairvawda.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const sitemapRoutes: string[] = [routes.home, ...Object.values(legacyRoutes)];

  return sitemapRoutes.map((route) => ({
    url: `${siteUrl}${route === routes.home ? "" : route}`,
    lastModified: now,
    changeFrequency:
      route === routes.home || route === legacyRoutes.mbaHome
        ? "monthly"
        : "yearly",
    priority:
      route === routes.home ? 1 : route === legacyRoutes.mbaHome ? 0.9 : 0.7,
  }));
}
