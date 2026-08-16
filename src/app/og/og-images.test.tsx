// The three Open Graph image routes.
//
// Both real collections are empty today, so no slug resolves in production and
// a test that only ever asked for a nonexistent one would prove nothing beyond
// the fallback copy. The collections are therefore mocked with fixtures, and
// the real, empty ones are asserted separately at the bottom.
//
// Nothing here checks "a 200 image came back" — a blank card would pass that.
// `next/og` is mocked so the element tree and the options actually handed to
// Satori can be asserted: the strings in the slots, and the palette hex.

import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TrackItem } from "@/content/track";
import { tokens } from "@/lib/theme/tokens";
import { elements, hexes, styleOf, text } from "@/test/element-tree";

const captured = vi.hoisted(
  () => [] as { element: ReactElement; options: { width?: number; height?: number } }[],
);

vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(element: ReactElement, options: { width?: number; height?: number }) {
      captured.push({ element, options });
    }
  },
}));

const fixtures = vi.hoisted(() => {
  const photo = {
    src: "/_next/static/media/zicklin-panel.1a2b3c.jpg",
    width: 1600,
    height: 900,
  };
  return {
    photo,
    toolFixtures: [
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
      },
    ],
    speakingFixtures: [
      {
        slug: "zicklin-panel",
        title: "Zicklin systems panel",
        date: "2026-03-11",
        blurb: "What the room pushed back on, and what I would say differently.",
      },
      {
        slug: "ops-workshop",
        title: "Operations workshop",
        date: "2026-02-04",
        blurb: "Two hours of process mapping with the people who run the process.",
        image: { src: photo, alt: "The room, mid-workshop." },
      },
    ],
  };
});

vi.mock("@/content/track", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/track")>();
  return {
    ...actual,
    tools: fixtures.toolFixtures as TrackItem[],
    speaking: fixtures.speakingFixtures as unknown as TrackItem[],
  };
});

const rootRoute = await import("@/app/opengraph-image");
const toolsRoute = await import("@/app/tools/[slug]/opengraph-image");
const speakingRoute = await import("@/app/speaking/[slug]/opengraph-image");

const t = tokens.dark;

beforeEach(() => {
  captured.length = 0;
});

/** Runs the route and returns the element tree it handed to Satori. */
async function render(
  route: { default: (props: { params: Promise<{ slug: string }> }) => Promise<unknown> },
  slug: string,
) {
  await route.default({ params: Promise.resolve({ slug }) });
  expect(captured).toHaveLength(1);
  return captured[0];
}

function assertOnPalette(element: ReactElement) {
  const palette = Object.values(t).map((hex) => hex.toLowerCase());
  const used = hexes(element).map((hex) => hex.toLowerCase());

  expect(used.length).toBeGreaterThan(0);
  for (const hex of used) expect(palette).toContain(hex);
}

describe("/opengraph-image (root)", () => {
  it("declares the Open Graph metadata Next reads off the module", () => {
    expect(rootRoute.size).toEqual({ width: 1200, height: 630 });
    expect(rootRoute.contentType).toBe("image/png");
    expect(rootRoute.alt).toContain("Uzair Vawda");
  });

  it("draws the pine card, not the old indigo one", async () => {
    await (rootRoute.default as () => Promise<unknown>)();
    expect(captured).toHaveLength(1);
    const { element, options } = captured[0];

    expect(styleOf(element)?.background).toBe(t.ground);
    expect(text(element)).toContain("Uzair Vawda.");
    expect(text(element)).toContain("Engineer. MBA candidate. NYC.");
    expect(options.width).toBe(1200);
    expect(options.height).toBe(630);
    assertOnPalette(element);
  });

  it("carries none of the four periwinkle swatches", async () => {
    await (rootRoute.default as () => Promise<unknown>)();
    const used = hexes(captured[0].element).map((hex) => hex.toLowerCase());

    for (const swatch of ["#6666ff", "#b8baff", "#c9e8ff", "#b9f0d7", "#0c0c16", "#1a1a35"]) {
      expect(used).not.toContain(swatch);
    }
  });
});

const itemRoutes = [
  {
    name: "/tools/[slug]/opengraph-image",
    module: toolsRoute,
    collection: fixtures.toolFixtures as TrackItem[],
    items: fixtures.toolFixtures as TrackItem[],
    eyebrow: "tools",
    fallbackTitle: "Tools",
    fallbackSubtitle: "One shippable tool per class.",
    otherSlug: fixtures.speakingFixtures[0].slug,
  },
  {
    name: "/speaking/[slug]/opengraph-image",
    module: speakingRoute,
    collection: fixtures.speakingFixtures as unknown as TrackItem[],
    // Only the photo-less item draws a card; the other is asserted below.
    items: [fixtures.speakingFixtures[0]] as TrackItem[],
    eyebrow: "speaking",
    fallbackTitle: "Speaking",
    fallbackSubtitle: "Talks, workshops, panels.",
    otherSlug: fixtures.toolFixtures[0].slug,
  },
] as const;

it("covers both per-item image routes", () => {
  expect(itemRoutes).toHaveLength(2);
});

describe.each(itemRoutes)(
  "$name",
  ({
    module: route,
    collection,
    items,
    eyebrow,
    fallbackTitle,
    fallbackSubtitle,
    otherSlug,
  }) => {
    it("declares the Open Graph metadata Next reads off the module", () => {
      expect(route.size).toEqual({ width: 1200, height: 630 });
      expect(route.contentType).toBe("image/png");
      expect(route.alt.length).toBeGreaterThan(0);
    });

    it("prerenders one image per published item and nothing else", () => {
      expect(route.generateStaticParams()).toEqual(
        collection.map((item) => ({ slug: item.slug })),
      );
      expect(collection.length).toBeGreaterThan(0);
      // The page 404s an unpublished slug; its preview image must too, or a
      // link to nothing still previews as a real page.
      expect(route.dynamicParams).toBe(false);
    });

    it("draws the item the slug names, on the pine palette", async () => {
      for (const item of items) {
        captured.length = 0;
        const { element, options } = await render(route, item.slug);

        expect(text(element)).toContain(item.title);
        expect(text(element)).toContain(item.blurb);
        expect(text(element)).toContain(eyebrow);
        expect(text(element)).not.toContain(fallbackSubtitle);
        expect(styleOf(element)?.background).toBe(t.ground);
        expect(options.width).toBe(1200);
        expect(options.height).toBe(630);
        assertOnPalette(element);
      }
    });

    it("awaits params rather than destructuring the promise", async () => {
      // Next 16 hands image routes a Promise. Reading `slug` straight off it
      // yields undefined, which resolves no item and silently falls back to the
      // collection card — so this asserts on the item, not on a 200.
      const item = items[0];
      const deferred = new Promise<{ slug: string }>((resolve) => {
        setTimeout(() => resolve({ slug: item.slug }), 5);
      });

      await route.default({ params: deferred });

      expect(captured).toHaveLength(1);
      expect(text(captured[0].element)).toContain(item.title);
      expect(text(captured[0].element)).not.toContain(fallbackTitle);
    });

    it("falls back to the collection card for a slug that does not resolve", async () => {
      const { element } = await render(route, "not-a-real-item");

      expect(text(element)).toContain(fallbackTitle);
      expect(text(element)).toContain(fallbackSubtitle);
      assertOnPalette(element);
    });

    it("does not draw an item from the other collection", async () => {
      const { element } = await render(route, otherSlug);

      expect(text(element)).toContain(fallbackTitle);
      expect(text(element)).toContain(fallbackSubtitle);
    });
  },
);

describe("/speaking/[slug]/opengraph-image with an event photo", () => {
  const item = fixtures.speakingFixtures[1];

  it("serves the photo instead of a card", async () => {
    const { element, options } = await render(speakingRoute, item.slug);

    const img = elements(element).find((el) => el.type === "img");
    expect(img).toBeDefined();

    const props = img!.props as { src: string; width: number; height: number };
    expect(props.src).toBe(`https://uzairvawda.me${fixtures.photo.src}`);
    expect(props.width).toBe(1200);
    expect(props.height).toBe(630);
    expect(styleOf(img)?.objectFit).toBe("cover");

    expect(options.width).toBe(1200);
    expect(options.height).toBe(630);
    // The photo is the whole preview — no card copy layered over it.
    expect(text(element)).not.toContain(item.title);
    expect(text(element)).not.toContain("uzairvawda.me");
  });
});

// What the site actually serves today, with the real collections.
describe("with the real, empty collections", () => {
  it("prerenders no per-item images at all", async () => {
    const real = await vi.importActual<typeof import("@/content/track")>(
      "@/content/track",
    );

    expect(real.tools).toHaveLength(0);
    expect(real.speaking).toHaveLength(0);
  });
});

// A type-level pin: an image route's params really is a Promise in Next 16.
type ImageRouteProps = Parameters<typeof toolsRoute.default>[0];
const _paramsIsAPromise: ImageRouteProps["params"] extends Promise<{ slug: string }>
  ? true
  : never = true;
void _paramsIsAPromise;

