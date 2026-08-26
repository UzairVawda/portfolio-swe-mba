import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

import {
  RESUME_DOWNLOAD_NAME,
  legacyRedirects,
  routes,
  speakingItem,
  toolItem,
} from "./routes";

describe("routes", () => {
  it("exposes every top-level destination the site links to", () => {
    expect(routes).toEqual({
      home: "/",
      about: "/#about",
      work: "/#work",
      contact: "/#contact",
      tools: "/tools",
      speaking: "/speaking",
      resume: "/resume.pdf",
    });
  });

  it("builds item permalinks under their gallery", () => {
    expect(toolItem("margin-model")).toBe("/tools/margin-model");
    expect(speakingItem("zicklin-panel")).toBe("/speaking/zicklin-panel");
  });

  it("names the resume download file", () => {
    expect(RESUME_DOWNLOAD_NAME).toBe("Uzair-Vawda-CV.pdf");
  });

  it("uses absolute paths everywhere", () => {
    expect(Object.values(routes).every((r) => r.startsWith("/"))).toBe(true);
  });
});

describe("legacy redirects", () => {
  it("maps every old mba path to its new home", () => {
    expect(legacyRedirects).toEqual([
      { source: "/mba", destination: "/", permanent: true },
      { source: "/mba/about", destination: "/#about", permanent: true },
      { source: "/mba/tools", destination: "/tools", permanent: true },
      { source: "/mba/speaking", destination: "/speaking", permanent: true },
      { source: "/mba/journal", destination: "/", permanent: true },
    ]);
  });

  it("covers every path the retired tree used to serve", () => {
    // The five routes that existed under /mba before this task. A page that
    // 404s after a redesign is the one failure mode redirects exist to stop.
    expect([...legacyRedirects].map((r) => r.source).sort()).toEqual([
      "/mba",
      "/mba/about",
      "/mba/journal",
      "/mba/speaking",
      "/mba/tools",
    ]);
  });

  it("issues 308s so link equity and request method survive", () => {
    expect(legacyRedirects.every((r) => r.permanent)).toBe(true);
  });

  it("points every destination at a live route", () => {
    const live = new Set<string>([
      routes.home,
      routes.about,
      routes.tools,
      routes.speaking,
    ]);
    for (const redirect of legacyRedirects) {
      expect(live.has(redirect.destination), redirect.source).toBe(true);
    }
  });

  it("never redirects a path back into the retired tree", () => {
    // A destination under /mba would loop against its own source rule.
    for (const redirect of legacyRedirects) {
      expect(redirect.destination.startsWith("/mba"), redirect.source).toBe(
        false,
      );
    }
  });

  it("is actually wired into next.config, not just declared", () => {
    // The table proves nothing on its own — Next only honours it if
    // `redirects()` returns it. e2e asserts the resulting 308s; this asserts
    // the config the server is built from.
    expect(typeof nextConfig.redirects).toBe("function");
  });

  it("returns the whole table from next.config's redirects()", async () => {
    const configured = await nextConfig.redirects!();
    expect(configured).toEqual([...legacyRedirects]);
  });
});
