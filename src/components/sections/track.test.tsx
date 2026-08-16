// The home page's summary of the MBA track: what it is, the most recent few
// items, and the way into both galleries. The recency logic is proved against
// fixtures — both real collections are empty today, so asserting "newest
// first" against them would pass vacuously.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrackSection, recentItems } from "@/components/sections/track";
import { eyebrow } from "@/content/sections";
import { speaking, tools, trackCopy } from "@/content/track";
import type { TrackItem } from "@/content/track";
import { routes } from "@/lib/routes";

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

function item(slug: string, date: string): TrackItem {
  return { slug, title: `Item ${slug}`, date, blurb: `Blurb ${slug}` };
}

describe("recentItems", () => {
  it("returns nothing while both collections are empty", () => {
    expect(recentItems([], [], 4)).toEqual([]);
  });

  it("interleaves both collections newest first", () => {
    const result = recentItems(
      [item("a", "2026-01-10"), item("c", "2026-03-01")],
      [item("b", "2026-02-14")],
      4,
    );
    expect(result.map((i) => i.slug)).toEqual(["c", "b", "a"]);
  });

  it("caps the list at the limit, keeping the newest", () => {
    const result = recentItems(
      [item("old", "2024-01-01"), item("new", "2026-06-01")],
      [item("mid", "2025-01-01")],
      2,
    );
    expect(result.map((i) => i.slug)).toEqual(["new", "mid"]);
  });

  it("does not mutate the collections it is given", () => {
    const toolsIn = [item("a", "2024-01-01"), item("b", "2026-01-01")];
    recentItems(toolsIn, [], 4);
    expect(toolsIn.map((i) => i.slug)).toEqual(["a", "b"]);
  });
});

describe("TrackSection", () => {
  const dom = parse(renderToStaticMarkup(<TrackSection />));

  it("anchors at #track and is the track section the page order expects", () => {
    const section = dom.querySelector("[data-testid='section-track']");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("id")).toBe("track");
  });

  it("takes its eyebrow numeral from the section manifest", () => {
    // Never hardcoded: the ladder renumbers itself when a section moves.
    expect(dom.textContent).toContain(eyebrow("track"));
  });

  it("renders the track copy, not a paraphrase of it", () => {
    expect(dom.textContent).toContain(trackCopy.section.heading);
    expect(dom.textContent).toContain(trackCopy.section.body);
  });

  it("links into both galleries even while they are empty", () => {
    // Someone reading this block has the context for an empty gallery; a
    // top-level nav click does not, which is why the gating differs.
    const toolsLink = dom.querySelector("[data-testid='track-link-tools']");
    const speakingLink = dom.querySelector(
      "[data-testid='track-link-speaking']",
    );
    expect(toolsLink?.getAttribute("href")).toBe(routes.tools);
    expect(speakingLink?.getAttribute("href")).toBe(routes.speaking);
  });

  it("lists one row per published item and no ghost rows", () => {
    const rows = dom.querySelectorAll("[data-testid='track-recent-item']");
    const expected = recentItems(tools, speaking, 4);
    expect(rows).toHaveLength(expected.length);
    expect(Array.from(rows).map((r) => r.textContent)).toEqual(
      expected.map((i) => expect.stringContaining(i.title)),
    );
  });

  it("promises nothing that has not shipped", () => {
    expect(dom.textContent ?? "").not.toMatch(
      /coming soon|stay tuned|watch this space|check back/i,
    );
  });

  it("carries no link into the retired MBA tree", () => {
    const hrefs = Array.from(dom.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs.every((href) => !href?.startsWith("/mba"))).toBe(true);
  });
});
