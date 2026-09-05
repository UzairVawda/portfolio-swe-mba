import { expect, test } from "@playwright/test";

import { speaking, tools } from "../src/content/track";
import { legacyRedirects } from "../src/lib/routes";

// Locators are testids, never prose. Copy changes in every stage of this
// redesign; the structure these tests care about does not.
const routes: Array<{ path: string; testId: string }> = [
  { path: "/", testId: "hero" },
  { path: "/tools", testId: "page-tools" },
  { path: "/speaking", testId: "page-speaking" },
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

    // Both escape hatches must lead somewhere that exists — a 404 that offers
    // a dead link is worse than a 404 that offers nothing.
    await expect(page.getByTestId("not-found-home")).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page.getByTestId("not-found-work")).toHaveAttribute(
      "href",
      "/#work",
    );
    const hrefs = await page
      .getByTestId("not-found")
      .locator("a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.filter((href) => href?.startsWith("/mba"))).toEqual([]);
  });

  test("every legacy mba path 308s to a live new home", async ({
    page,
    request,
  }) => {
    // The redirect table is data; this asserts the behaviour it is supposed to
    // produce — the real status line, the real Location header, and a 200 at
    // the far end. Asserting the array only proves the array.
    const expected = [
      ["/mba", "/"],
      ["/mba/about", "/#about"],
      ["/mba/tools", "/tools"],
      ["/mba/speaking", "/speaking"],
      ["/mba/journal", "/"],
    ] as const;

    // Keeps this list and the config from drifting apart in either direction.
    expect(expected.map(([from]) => from).sort()).toEqual(
      [...legacyRedirects].map((r) => r.source).sort(),
    );

    for (const [from, to] of expected) {
      const redirect = await request.get(from, { maxRedirects: 0 });
      expect(redirect.status(), from).toBe(308);
      expect(redirect.headers()["location"], from).toBe(to);

      // The destination is live, not merely well-formed.
      const landing = await request.get(to.split("#")[0]);
      expect(landing.status(), `${from} → ${to}`).toBe(200);

      // And a browser following the chain ends up on the new document. A
      // fragment is resolved client-side, so only the pathname is assertable.
      const response = await page.goto(from);
      expect(response?.status(), from).toBe(200);
      expect(new URL(page.url()).pathname, from).toBe(to.split("#")[0]);
    }
  });

  test("nothing renders under /mba any more", async ({ request }) => {
    // The tree is deleted, so an unmapped path below it must 404 rather than
    // quietly resolve — a catch-all redirect would hide a broken deep link.
    const response = await request.get("/mba/not-a-page", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
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

  test("every nav link resolves to something that exists", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("header a[data-testid^='nav-']");
    const entries = await links.evaluateAll((els) =>
      els.map((el) => ({
        testId: el.getAttribute("data-testid"),
        href: el.getAttribute("href"),
      })),
    );

    // Order and membership, not "a link with this label exists somewhere".
    // Tools and Speaking join the list the day their collections do.
    expect(entries.map((e) => e.testId)).toEqual([
      "nav-work",
      ...(tools.length > 0 ? ["nav-tools"] : []),
      ...(speaking.length > 0 ? ["nav-speaking"] : []),
      "nav-about",
      "nav-contact",
      "nav-resume",
    ]);

    for (const { testId, href } of entries) {
      expect(href, testId!).toBeTruthy();
      if (href!.startsWith("/#")) {
        // The anchor has to land on a real element. The DOM ids and the
        // testids deliberately diverge in places, so resolve against the id.
        await expect(page.locator(`[id="${href!.slice(2)}"]`), testId!).toHaveCount(1);
      } else {
        const response = await page.request.get(href!);
        expect(response.ok(), `${testId} → ${href}`).toBe(true);
      }
    }
  });

  test("nav hides gallery routes until they have content", async ({ page }) => {
    await page.goto("/");
    // A nav entry leading to nothing is worse than no nav entry. These
    // assertions follow the real collections rather than asserting zero
    // forever, so they stay honest the day the first item ships.
    await expect(page.getByTestId("nav-tools")).toHaveCount(
      tools.length > 0 ? 1 : 0,
    );
    await expect(page.getByTestId("nav-speaking")).toHaveCount(
      speaking.length > 0 ? 1 : 0,
    );

    // The track section links into both galleries regardless: a reader who
    // got that far has the context for an empty page; a nav click does not.
    await expect(page.getByTestId("track-link-tools")).toHaveAttribute(
      "href",
      "/tools",
    );
    await expect(page.getByTestId("track-link-speaking")).toHaveAttribute(
      "href",
      "/speaking",
    );
  });

  test("the site chrome is mounted exactly once on every route", async ({
    page,
  }) => {
    // The nav and footer moved into the root layout; a nested layout that
    // still mounts its own would render two of each and no test above would
    // notice. /does-not-exist covers the 404, which used to carry its own.
    // The /mba paths that used to be checked here now 308 onto "/" and
    // "/#about"; the redirect test above covers them.
    for (const path of ["/", "/tools", "/speaking", "/does-not-exist-12345"]) {
      await page.goto(path);
      await expect(page.locator("header"), path).toHaveCount(1);
      await expect(page.locator("footer"), path).toHaveCount(1);
      await expect(page.locator("main"), path).toHaveCount(1);
      await expect(page.getByTestId("nav-resume"), path).toHaveCount(1);
    }
  });

  test("no surviving link points into the retired MBA nav", async ({
    page,
  }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("header a, footer a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.filter((href) => href?.startsWith("/mba"))).toEqual([]);
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
