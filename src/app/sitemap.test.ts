import { describe, expect, it } from "vitest";

import { speaking, tools } from "@/content/track";
import { legacyRedirects, routes, speakingItem, toolItem } from "@/lib/routes";

import sitemap from "./sitemap";

const SITE = "https://uzairvawda.me";

describe("sitemap", () => {
  it("lists exactly the live public routes", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      SITE,
      `${SITE}${routes.tools}`,
      `${SITE}${routes.speaking}`,
      ...tools.map((item) => `${SITE}${toolItem(item.slug)}`),
      ...speaking.map((item) => `${SITE}${speakingItem(item.slug)}`),
    ]);
  });

  it("never advertises a redirected path", () => {
    // A sitemap entry that 308s is a crawl budget leak and a stale-index
    // signal. Every legacy source must be absent, by construction.
    const urls = sitemap().map((entry) => entry.url);
    for (const { source } of legacyRedirects) {
      expect(urls, source).not.toContain(`${SITE}${source}`);
    }
    expect(urls.filter((url) => url.includes("/mba"))).toEqual([]);
  });

  it("emits no fragment URLs — anchors are not separate documents", () => {
    expect(sitemap().every((entry) => !entry.url.includes("#"))).toBe(true);
  });

  it("ranks the home page above the galleries", () => {
    const [home, ...rest] = sitemap();
    expect(home.priority).toBe(1);
    expect(rest.every((entry) => entry.priority === 0.7)).toBe(true);
  });

  it("crawls the galleries monthly and item permalinks yearly", () => {
    const byUrl = new Map(sitemap().map((e) => [e.url, e]));
    expect(byUrl.get(SITE)?.changeFrequency).toBe("monthly");
    expect(byUrl.get(`${SITE}${routes.tools}`)?.changeFrequency).toBe("monthly");
    expect(byUrl.get(`${SITE}${routes.speaking}`)?.changeFrequency).toBe(
      "monthly",
    );
    for (const item of tools) {
      expect(byUrl.get(`${SITE}${toolItem(item.slug)}`)?.changeFrequency).toBe(
        "yearly",
      );
    }
    for (const item of speaking) {
      expect(
        byUrl.get(`${SITE}${speakingItem(item.slug)}`)?.changeFrequency,
      ).toBe("yearly");
    }
  });

  it("stamps every entry with a lastModified date", () => {
    expect(
      sitemap().every((entry) => entry.lastModified instanceof Date),
    ).toBe(true);
  });
});
