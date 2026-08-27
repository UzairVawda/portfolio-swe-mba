// The two permalink routes, /tools/[slug] and /speaking/[slug].
//
// Both real collections are empty today, so there is no slug that resolves in
// production and every real request 404s — that is asserted at the bottom, and
// in e2e against the built site. Everything above it mocks the content module
// with fixtures, because a test that only ever visits a nonexistent slug and
// sees a 404 proves the routes work exactly as well as an empty file would.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { TrackItem } from "@/content/track";

const fixtures = vi.hoisted(() => {
  const toolFixtures = [
    {
      slug: "maturity-assessment",
      title: "IT maturity assessment",
      date: "2026-04-02",
      blurb: "A scored questionnaire that turns forty answers into one chart.",
    },
    {
      slug: "market-sizing",
      title: "Market sizing dashboard",
      date: "2026-01-17",
      blurb: "Top-down and bottom-up side by side, with the gap called out.",
      link: { label: "Open the dashboard", href: "https://example.com/sizing" },
    },
  ];
  const speakingFixtures = [
    {
      slug: "zicklin-panel",
      title: "Zicklin systems panel",
      date: "2026-03-11",
      blurb: "What the room pushed back on, and what I would say differently.",
    },
  ];
  return { toolFixtures, speakingFixtures };
});

vi.mock("@/content/track", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/track")>();
  return {
    ...actual,
    tools: fixtures.toolFixtures as TrackItem[],
    speaking: fixtures.speakingFixtures as TrackItem[],
  };
});

const { trackCopy } = await import("@/content/track");
const toolsRoute = await import("@/app/tools/[slug]/page");
const speakingRoute = await import("@/app/speaking/[slug]/page");

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

async function renderRoute(
  Page: (props: { params: Promise<{ slug: string }> }) => Promise<React.ReactElement>,
  slug: string,
) {
  return parse(renderToStaticMarkup(await Page({ params: Promise.resolve({ slug }) })));
}

const routes = [
  {
    name: "/tools/[slug]",
    module: toolsRoute,
    items: fixtures.toolFixtures as TrackItem[],
    otherSlug: fixtures.speakingFixtures[0].slug,
    backHref: "/tools",
    backLabel: trackCopy.tools.heading,
  },
  {
    name: "/speaking/[slug]",
    module: speakingRoute,
    items: fixtures.speakingFixtures as TrackItem[],
    otherSlug: fixtures.toolFixtures[0].slug,
    backHref: "/speaking",
    backLabel: trackCopy.speaking.heading,
  },
] as const;

it("covers both permalink routes", () => {
  expect(routes).toHaveLength(2);
});

describe.each(routes)(
  "$name",
  ({ module: route, items, otherSlug, backHref, backLabel }) => {
    it("prerenders one path per published item and nothing else", () => {
      expect(route.generateStaticParams()).toEqual(
        items.map((item) => ({ slug: item.slug })),
      );
      // Anything outside the collection must 404 rather than render on demand.
      expect(route.dynamicParams).toBe(false);
    });

    it("renders the item the slug names", async () => {
      for (const item of items) {
        const root = await renderRoute(route.default, item.slug);

        expect(
          root.querySelector('[data-testid="page-track-item"]'),
        ).not.toBeNull();
        expect(root.querySelector("h1")?.textContent).toBe(item.title);
        expect(root.textContent).toContain(item.blurb);

        // Not some other item in the same collection.
        for (const other of items) {
          if (other.slug === item.slug) continue;
          expect(root.querySelector("h1")?.textContent).not.toBe(other.title);
        }
      }
    });

    it("renders more than a shell for the item", async () => {
      const root = await renderRoute(route.default, items[0].slug);
      expect(root.textContent?.trim().length).toBeGreaterThan(
        items[0].title.length + items[0].blurb.length,
      );
    });

    it("links back to its own collection", async () => {
      const root = await renderRoute(route.default, items[0].slug);
      const back = root.querySelector('[data-testid="track-item-back"]');

      expect(back?.getAttribute("href")).toBe(backHref);
      expect(back?.textContent).toContain(backLabel);
    });

    it("404s an unknown slug", async () => {
      await expect(
        renderRoute(route.default, "not-a-real-item"),
      ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    });

    it("404s a slug that belongs to the other collection", async () => {
      await expect(renderRoute(route.default, otherSlug)).rejects.toMatchObject({
        digest: "NEXT_HTTP_ERROR_FALLBACK;404",
      });
    });

    it("titles the document with the item, not the collection", async () => {
      const metadata = await route.generateMetadata({
        params: Promise.resolve({ slug: items[0].slug }),
      });

      expect(metadata.title).toBe(items[0].title);
      expect(metadata.description).toBe(items[0].blurb);
    });

    it("adds no metadata for a slug that does not resolve", async () => {
      const metadata = await route.generateMetadata({
        params: Promise.resolve({ slug: "not-a-real-item" }),
      });

      expect(metadata).toEqual({});
    });
  },
);

// What a visitor actually gets today, with the real collections.
describe("with the real, empty collections", () => {
  it("prerenders no item pages at all", async () => {
    const real = await vi.importActual<typeof import("@/content/track")>(
      "@/content/track",
    );

    expect(real.tools).toHaveLength(0);
    expect(real.speaking).toHaveLength(0);
    expect(real.tools.map((item) => ({ slug: item.slug }))).toEqual([]);
    expect(real.speaking.map((item) => ({ slug: item.slug }))).toEqual([]);
  });
});
