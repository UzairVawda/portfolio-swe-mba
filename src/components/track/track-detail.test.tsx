// Both real collections are empty, so there is no shipped item to render this
// component against. Everything here is fixture-driven on purpose: the point
// is to prove the populated permalink actually renders an item's own data, not
// to loop over an empty array and assert nothing.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrackDetail } from "@/components/track/track-detail";
import type { TrackItem } from "@/content/track";

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

const blurSrc = {
  src: "/fixture.png",
  width: 1200,
  height: 800,
  blurDataURL:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGMAAgAABQAB",
  blurWidth: 8,
  blurHeight: 5,
};

const full: TrackItem = {
  slug: "maturity-assessment",
  title: "IT maturity assessment",
  date: "2026-04-02",
  blurb: "A scored questionnaire that turns forty answers into one chart.",
  image: { src: blurSrc, alt: "The assessment's summary chart" },
  link: { label: "Open the assessment", href: "https://example.com/maturity" },
};

const bare: TrackItem = {
  slug: "market-sizing",
  title: "Market sizing dashboard",
  date: "2026-01-17",
  blurb: "Top-down and bottom-up side by side, with the gap called out.",
};

function renderDetail(item: TrackItem) {
  return parse(
    renderToStaticMarkup(
      <TrackDetail item={item} backHref="/tools" backLabel="All the tools" />,
    ),
  );
}

describe("TrackDetail", () => {
  it("carries the permalink testid on a main landmark", () => {
    const root = renderDetail(full);
    const page = root.querySelector('[data-testid="page-track-item"]');
    expect(page).not.toBeNull();
    expect(page?.tagName).toBe("MAIN");
  });

  it("renders the item's own title, blurb, and date", () => {
    const root = renderDetail(full);

    expect(root.querySelector("h1")?.textContent).toBe(full.title);
    expect(root.textContent).toContain(full.blurb);
    // Never the other fixture's copy — a hardcoded string would pass a
    // "renders a title" assertion just as well.
    expect(root.textContent).not.toContain(bare.title);
    expect(root.textContent).not.toContain(bare.blurb);

    const time = root.querySelector("time");
    expect(time?.getAttribute("datetime")).toBe(full.date);
    // Human-readable, and formatted the same way the gallery card formats it.
    expect(time?.textContent).toBe("Apr 2026");
  });

  it("links back to the collection it belongs to", () => {
    const root = renderDetail(full);
    const back = root.querySelector('[data-testid="track-item-back"]');

    expect(back?.getAttribute("href")).toBe("/tools");
    expect(back?.textContent).toContain("All the tools");
  });

  it("renders the item's image with its alt text", () => {
    const root = renderDetail(full);
    const img = root.querySelector("img");

    expect(img).not.toBeNull();
    expect(img?.getAttribute("alt")).toBe(full.image?.alt);
    expect(img?.getAttribute("src")).toContain("fixture.png");
  });

  it("renders the item's link as a safe external link", () => {
    const root = renderDetail(full);
    const link = root.querySelector(`a[href="${full.link?.href}"]`);

    expect(link).not.toBeNull();
    expect(link?.textContent).toContain(full.link?.label as string);
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(link?.getAttribute("rel")).toContain("noreferrer");
  });

  it("omits the image and the link when the item has neither", () => {
    const root = renderDetail(bare);

    expect(root.querySelector("img")).toBeNull();
    expect(
      root.querySelectorAll('a[target="_blank"]'),
    ).toHaveLength(0);
    // The back link is not optional, though.
    expect(root.querySelector('[data-testid="track-item-back"]')).not.toBeNull();
    expect(root.querySelector("h1")?.textContent).toBe(bare.title);
    expect(root.querySelector("time")?.textContent).toBe("Jan 2026");
  });
});
