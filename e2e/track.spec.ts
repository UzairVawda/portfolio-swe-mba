import { expect, test } from "@playwright/test";

import { speaking, tools, trackCopy } from "../src/content/track";

// Expectations are derived from the real collections rather than hardcoded, so
// this spec stays honest the day the first item ships instead of silently
// asserting nothing. The populated branch of the gallery is proved against
// fixtures in src/components/track/track-gallery.test.tsx.
const GALLERIES = [
  {
    path: "/tools",
    testId: "page-tools",
    title: "Tools",
    copy: trackCopy.tools,
    items: tools,
  },
  {
    path: "/speaking",
    testId: "page-speaking",
    title: "Speaking",
    copy: trackCopy.speaking,
    items: speaking,
  },
] as const;

const TEASING =
  /coming soon|stay tuned|watch this space|in the works|launching soon|under construction|check back/i;

test.describe("track galleries", () => {
  test("covers both gallery routes", () => {
    expect(GALLERIES).toHaveLength(2);
  });

  for (const { path, testId, title, copy, items } of GALLERIES) {
    test(`${path} renders with the site chrome`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByTestId(testId)).toBeVisible();
      await expect(page).toHaveTitle(`${title} · Uzair Vawda`);
      // The routes live outside the (swe) group, so the nav and footer are the
      // thing most likely to go missing here.
      await expect(page.getByTestId("nav-resume")).toBeAttached();
      await expect(page.getByTestId("footer-resume")).toBeAttached();
      await expect(page.locator("h1")).toHaveText(copy.heading);
    });

    test(`${path} renders one card per published item`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByTestId("gallery-item")).toHaveCount(items.length);
    });

    if (items.length === 0) {
      test(`${path} states plainly that it is empty`, async ({ page }) => {
        await page.goto(path);

        const empty = page.getByTestId("gallery-empty");
        await expect(empty).toBeVisible();
        await expect(empty).toContainText(copy.empty.title);
        await expect(empty).toContainText(copy.empty.body);

        // No ghost grid standing in for the missing items.
        await expect(page.getByTestId("gallery-item")).toHaveCount(0);
        await expect(page.getByTestId(testId).locator("img")).toHaveCount(0);

        // Nothing on the page may promise work that has not shipped.
        const text = await page.getByTestId(testId).innerText();
        expect(text).not.toMatch(TEASING);
      });

      test(`${path} offers a way out to the work that does exist`, async ({
        page,
      }) => {
        await page.goto(path);
        const link = page.getByTestId("gallery-empty-link");
        await expect(link).toHaveAttribute("href", "/#work");
        await link.click();
        await expect(page).toHaveURL(/\/#work$/);
        await expect(page.getByTestId("section-work")).toBeVisible();
      });
    } else {
      test(`${path} shows no empty state once items exist`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByTestId("gallery-empty")).toHaveCount(0);
        await expect(page.getByTestId("gallery-item").first()).toBeVisible();
      });
    }
  }
});
