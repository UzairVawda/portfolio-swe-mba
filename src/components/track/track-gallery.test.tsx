// Both real collections are empty today, so the empty state is not a branch —
// it is the shipped experience of /tools and /speaking. It is asserted here
// positively (the panel exists, and its copy is on the page), and the
// populated branch is proved with fixtures rather than with the real arrays,
// which would make every "each item has a title" assertion vacuously true.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrackGallery } from "@/components/track/track-gallery";
import { TrackCard } from "@/components/track/track-card";
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

const fixtures: TrackItem[] = [
  {
    slug: "maturity-assessment",
    title: "IT maturity assessment",
    date: "2026-04-02",
    blurb: "A scored questionnaire that turns forty answers into one chart.",
    image: { src: blurSrc, alt: "The assessment's summary chart" },
  },
  {
    slug: "market-sizing",
    title: "Market sizing dashboard",
    date: "2026-01-17",
    blurb: "Top-down and bottom-up side by side, with the gap called out.",
    link: { label: "Open the dashboard", href: "https://example.com/sizing" },
  },
];

const copy = {
  heading: "One shippable tool per class.",
  body: "Small consulting tools built alongside the coursework.",
  empty: {
    title: "No tools published yet.",
    body: "The first one goes up when the first one is finished.",
  },
};

function renderGallery(items: TrackItem[]) {
  return parse(
    renderToStaticMarkup(
      <TrackGallery
        items={items}
        hrefFor={(slug) => `/tools/${slug}`}
        heading={copy.heading}
        body={copy.body}
        empty={copy.empty}
        testId="page-tools"
      />,
    ),
  );
}

describe("TrackGallery, populated", () => {
  const root = renderGallery(fixtures);

  it("renders exactly one card per item, in the order given", () => {
    const cards = root.querySelectorAll('[data-testid="gallery-item"]');
    expect(cards).toHaveLength(fixtures.length);
    expect([...cards].map((card) => card.querySelector("h3")?.textContent))
      .toEqual(["IT maturity assessment", "Market sizing dashboard"]);
  });

  it("links each card at the href the route function produced", () => {
    const hrefs = [
      ...root.querySelectorAll('[data-testid="gallery-item"]'),
    ].map((card) => card.getAttribute("href"));
    expect(hrefs).toEqual([
      "/tools/maturity-assessment",
      "/tools/market-sizing",
    ]);
  });

  it("prints each date as a machine-readable time element", () => {
    const times = [...root.querySelectorAll("time")];
    expect(times).toHaveLength(fixtures.length);
    expect(times.map((t) => t.getAttribute("dateTime") ?? t.getAttribute("datetime")))
      .toEqual(["2026-04-02", "2026-01-17"]);
  });

  it("shows every blurb", () => {
    const text = root.textContent ?? "";
    for (const item of fixtures) {
      expect(text).toContain(item.blurb);
    }
    // Guards the loop above against a fixture list that silently empties.
    expect(fixtures.length).toBeGreaterThan(1);
  });

  it("renders the image only for the item that has one, with its alt text", () => {
    const images = [...root.querySelectorAll("img")];
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute("alt")).toBe(
      "The assessment's summary chart",
    );
  });

  it("still renders the heading and body above the grid", () => {
    expect(root.querySelector("h1")?.textContent).toBe(copy.heading);
    expect(root.textContent).toContain(copy.body);
  });

  it("does not render the empty panel", () => {
    expect(root.querySelectorAll('[data-testid="gallery-empty"]')).toHaveLength(
      0,
    );
  });
});

describe("TrackGallery, empty", () => {
  const root = renderGallery([]);

  it("renders the empty panel with both lines of its copy", () => {
    const empty = root.querySelector('[data-testid="gallery-empty"]');
    expect(empty).not.toBeNull();
    expect(empty?.textContent).toContain(copy.empty.title);
    expect(empty?.textContent).toContain(copy.empty.body);
  });

  it("renders no cards and no placeholder skeletons standing in for cards", () => {
    expect(root.querySelectorAll('[data-testid="gallery-item"]')).toHaveLength(
      0,
    );
    expect(root.querySelectorAll("img")).toHaveLength(0);
    expect(root.querySelectorAll("h3")).toHaveLength(0);
  });

  it("still renders the heading and body", () => {
    expect(root.querySelector("h1")?.textContent).toBe(copy.heading);
    expect(root.textContent).toContain(copy.body);
  });

  it("carries the page testid on its outermost element", () => {
    expect(
      root.firstElementChild?.getAttribute("data-testid"),
    ).toBe("page-tools");
  });
});

describe("TrackCard", () => {
  it("renders a linked card for an item with no image", () => {
    const root = parse(
      renderToStaticMarkup(
        <TrackCard item={fixtures[1]} href="/speaking/market-sizing" />,
      ),
    );
    const card = root.querySelector('[data-testid="gallery-item"]');
    expect(card).not.toBeNull();
    expect(card?.getAttribute("href")).toBe("/speaking/market-sizing");
    expect(root.querySelectorAll("img")).toHaveLength(0);
    expect(card?.querySelector("h3")?.textContent).toBe(
      "Market sizing dashboard",
    );
  });
});
