import { describe, expect, it } from "vitest";

import {
  RESUME_DOWNLOAD_NAME,
  legacyRoutes,
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

  it("still carries the legacy mba tree until it is redirected", () => {
    expect(legacyRoutes.mbaHome).toBe("/mba");
    expect(Object.values(legacyRoutes).every((r) => r.startsWith("/mba"))).toBe(
      true,
    );
  });

  it("uses absolute paths everywhere", () => {
    const all = [...Object.values(routes), ...Object.values(legacyRoutes)];
    expect(all.every((r) => r.startsWith("/"))).toBe(true);
  });
});
