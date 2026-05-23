import { expect, test } from "@playwright/test";

const routes: Array<{ path: string; heading: RegExp }> = [
  { path: "/", heading: /Uzair Vawda\./ },
  { path: "/mba", heading: /A working portfolio of consulting tools/ },
  { path: "/mba/tools", heading: /One shippable tool per class\./ },
  { path: "/mba/journal", heading: /Synthesis, not summary\./ },
  { path: "/mba/speaking", heading: /Talks, workshops, panels\./ },
  { path: "/mba/about", heading: /Who I am and how to reach me\./ },
];

test.describe("route smoke tests", () => {
  for (const { path, heading } of routes) {
    test(`${path} renders its heading`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/does-not-exist-12345");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /Not here\./i })).toBeVisible();
  });

  test("sitemap is served", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.ok()).toBe(true);
    expect(response?.headers()["content-type"]).toMatch(/xml/);
  });

  test("robots.txt is served and disallows /api/", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.ok()).toBe(true);
    const body = await response!.text();
    expect(body).toMatch(/Disallow: \/api\//);
  });
});
