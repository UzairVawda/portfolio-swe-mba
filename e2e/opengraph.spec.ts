import { expect, test } from "@playwright/test";

import { tokens } from "../src/lib/theme/tokens";

// The built site's Open Graph image, served for real by Satori.
//
// "200, image/png" is close to worthless on its own — a blank card passes it —
// so the PNG is decoded in the browser and its pixels are sampled. The element
// tree handed to Satori is asserted in src/app/og/og-images.test.tsx; this
// proves the pipeline downstream of it produces the pine card and not the old
// indigo one.

const GROUND = tokens.dark.ground;
const INK = tokens.dark.ink;
const SIGNAL = tokens.dark.signal;
const OLD_INDIGO = ["#0c0c16", "#1a1a35", "#6666ff", "#b8baff", "#c9e8ff", "#b9f0d7"];

function toRgbTriple(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Sample = {
  width: number;
  height: number;
  pixels: number;
  corner: [number, number, number];
  /** One entry per distinct RGB triple, with how many pixels it covers. */
  colours: { px: [number, number, number]; count: number }[];
};

async function samplePng(page: import("@playwright/test").Page, url: string) {
  await page.goto("/");
  return page.evaluate(async (src): Promise<Sample> => {
    const img = new Image();
    img.src = src;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const seen = new Map<string, { px: [number, number, number]; count: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const px: [number, number, number] = [data[i], data[i + 1], data[i + 2]];
      const key = px.join(",");
      const hit = seen.get(key);
      if (hit) hit.count += 1;
      else seen.set(key, { px, count: 1 });
    }

    return {
      width: canvas.width,
      height: canvas.height,
      pixels: data.length / 4,
      corner: [data[0], data[1], data[2]],
      colours: [...seen.values()],
    };
  }, url);
}

function near(
  px: [number, number, number],
  hex: string,
  tolerance: number,
): boolean {
  const [r, g, b] = toRgbTriple(hex);
  return (
    Math.abs(px[0] - r) <= tolerance &&
    Math.abs(px[1] - g) <= tolerance &&
    Math.abs(px[2] - b) <= tolerance
  );
}

test.describe("the root Open Graph image", () => {
  test("is served as a 1200x630 PNG", async ({ request }) => {
    const response = await request.get("/opengraph-image");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).byteLength).toBeGreaterThan(1000);
  });

  test("is painted pine, not indigo, and is not blank", async ({ page }) => {
    const sample = await samplePng(page, "/opengraph-image");

    // Coverage in pixels of everything within `tolerance` of a hex.
    const area = (hex: string, tolerance: number) =>
      sample.colours
        .filter(({ px }) => near(px, hex, tolerance))
        .reduce((total, { count }) => total + count, 0);

    expect(sample.width).toBe(1200);
    expect(sample.height).toBe(630);

    // Satori does not dither a flat fill, so the ground is exact.
    expect(sample.corner).toEqual(toRgbTriple(GROUND));
    expect(area(GROUND, 0) / sample.pixels).toBeGreaterThan(0.6);

    // Something is actually drawn on it: the title in ink, the eyebrow in
    // signal green. A blank card fails both.
    expect(area(INK, 2)).toBeGreaterThan(5_000);
    // The eyebrow is 22px mono, so this is a few hundred pixels, not thousands.
    expect(area(SIGNAL, 2)).toBeGreaterThan(200);

    // And not one pixel of the old periwinkle palette survives.
    for (const hex of OLD_INDIGO) {
      expect(area(hex, 0), hex).toBe(0);
    }
  });

  test("is the image the home page advertises", async ({ page }) => {
    await page.goto("/");
    const content = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");

    expect(content).toContain("/opengraph-image");
  });
});

// Both collections are empty today, so no per-item image is prerendered and
// `dynamicParams = false` makes every slug a 404 — matching the page rather
// than previewing a card for a link that goes nowhere. The populated path,
// including the event-photo branch, is proved against fixtures in
// src/app/og/og-images.test.tsx.
test("no per-item Open Graph image resolves while the collections are empty", async ({
  request,
}) => {
  for (const path of [
    "/tools/not-a-real-item/opengraph-image",
    "/speaking/not-a-real-item/opengraph-image",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});
