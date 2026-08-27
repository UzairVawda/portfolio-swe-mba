import type { MetadataRoute } from "next";

import { speaking, tools } from "@/content/track";
import { routes, speakingItem, toolItem } from "@/lib/routes";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzairvawda.me";

// Live routes only. The retired /mba tree 308s (see `legacyRedirects`), and a
// sitemap entry that redirects is a crawl-budget leak, so none appear here.
// Fragments are not separate documents either, so /#about and friends are out.
const galleries: string[] = [routes.tools, routes.speaking];

const items: string[] = [
  ...tools.map((item) => toolItem(item.slug)),
  ...speaking.map((item) => speakingItem(item.slug)),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: string[] = [routes.home, ...galleries, ...items];

  return paths.map((route) => ({
    url: `${siteUrl}${route === routes.home ? "" : route}`,
    lastModified: now,
    changeFrequency: items.includes(route) ? "yearly" : "monthly",
    priority: route === routes.home ? 1 : 0.7,
  }));
}
