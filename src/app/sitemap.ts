import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzairvawda.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/mba",
    "/mba/tools",
    "/mba/journal",
    "/mba/speaking",
    "/mba/about",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" || route === "/mba" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route === "/mba" ? 0.9 : 0.7,
  }));
}
