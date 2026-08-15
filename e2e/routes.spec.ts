import { expect, test } from "@playwright/test";

// Locators are testids, never prose. Copy changes in every stage of this
// redesign; the structure these tests care about does not.
const routes: Array<{ path: string; testId: string }> = [
  { path: "/", testId: "hero" },
  { path: "/mba", testId: "page-mba" },
  { path: "/mba/tools", testId: "page-mba-tools" },
  { path: "/mba/journal", testId: "page-mba-journal" },
  { path: "/mba/speaking", testId: "page-mba-speaking" },
  { path: "/mba/about", testId: "page-mba-about" },
];

test.describe("route smoke tests", () => {
  for (const { path, testId } of routes) {
    test(`${path} renders`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByTestId(testId)).toBeVisible();
    });
  }

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/does-not-exist-12345");
    expect(response?.status()).toBe(404);
    await expect(page.getByTestId("not-found")).toBeVisible();
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

  test("home page sections render in order", async ({ page }) => {
    await page.goto("/");
    const ids = await page
      .locator("[data-testid^='section-']")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-testid")));
    expect(ids).toEqual([
      "section-about",
      "section-experience",
      "section-work",
      "section-skills",
      "section-education",
      "section-interests",
      "section-contact",
      "section-track",
    ]);
  });

  test("the CV is served and reachable from every entry point", async ({
    page,
    context,
  }) => {
    const pdfResponse = await context.request.head("/resume.pdf");
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()["content-type"]).toMatch(/pdf/);

    await page.goto("/");
    // Named entry points, not a bare count — a count breaks on any layout
    // change and tells you nothing about which link went missing.
    for (const id of [
      "hero-cta-resume",
      "nav-resume",
      "about-cv-link",
      "footer-resume",
    ]) {
      await expect(page.getByTestId(id)).toHaveAttribute("href", "/resume.pdf");
    }
    await expect(page.getByTestId("hero-cta-resume")).toHaveAttribute(
      "download",
      "Uzair-Vawda-CV.pdf",
    );
  });
});
