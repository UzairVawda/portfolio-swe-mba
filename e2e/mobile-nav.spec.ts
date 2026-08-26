// The regression this file exists for: every desktop nav link is
// `hidden sm:inline-flex`, so at phone widths the site once had no
// navigation at all. These tests fail if that state ever returns.

import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("offers a way to navigate at phone width", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("mobile-nav-trigger")).toBeVisible();
    await expect(page.getByTestId("nav-work")).toBeHidden();
  });

  test("opens the menu and reveals every nav link", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("mobile-nav-trigger").click();

    await expect(page.getByTestId("mobile-nav-work")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-about")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-contact")).toBeVisible();
  });

  test("navigates and closes when a link is tapped", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("mobile-nav-trigger").click();
    await page.getByTestId("mobile-nav-about").click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.getByTestId("mobile-nav-about")).toBeHidden();
  });

  test("keeps the resume and theme toggle reachable without opening the menu", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("nav-resume")).toBeVisible();
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows the links inline and hides the mobile trigger", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("nav-work")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-trigger")).toBeHidden();
  });
});
