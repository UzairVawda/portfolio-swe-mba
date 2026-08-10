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

  test("SWE page renders the particle canvas without console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();

    // Scroll the full page to exercise the scroll-driven animation.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });

  test("CV is served and linked from the SWE page", async ({ page, context }) => {
    // Check that the PDF is served and has the correct content-type
    const pdfResponse = await context.request.head("/resume.pdf");
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()["content-type"]).toMatch(/pdf/);

    await page.goto("/");
    const links = page.locator('a[href="/resume.pdf"]');
    // Hero button, nav link, About inline link, footer link.
    await expect(links).toHaveCount(4);
    await expect(links.first()).toHaveAttribute("download", "Uzair-Vawda-CV.pdf");
  });
});
