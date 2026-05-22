import { expect, test } from "@playwright/test";

test.describe("MBA contact form", () => {
  test("renders core sections and form fields", async ({ page }) => {
    await page.goto("/mba/about");

    await expect(
      page.getByRole("heading", { name: /Who I am and how to reach me\./i }),
    ).toBeVisible();

    await expect(page.getByLabel("Name *")).toBeVisible();
    await expect(page.getByLabel("Email *")).toBeVisible();
    await expect(page.getByLabel(/^Message/)).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/mba/about");

    await page.getByRole("button", { name: /Send message/i }).click();

    // Two "Required" errors (name + message) + one email error.
    await expect(page.getByText("Required").first()).toBeVisible();
    await expect(page.getByText(/Enter a valid email/i)).toBeVisible();
  });

  test("shows success state when API responds 200", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/mba/about");

    await page.getByLabel("Name *").fill("Test User");
    await page.getByLabel("Email *").fill("test@example.com");
    await page.getByLabel(/^Message/).fill("Hello from Playwright.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(
      page.getByRole("heading", { name: /Thanks — message received\./i }),
    ).toBeVisible();
  });

  test("surfaces rate-limit response", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Too many submissions",
          message:
            "You sent a message in the last minute. Wait a bit, then try again.",
        }),
      });
    });

    await page.goto("/mba/about");

    await page.getByLabel("Name *").fill("Test User");
    await page.getByLabel("Email *").fill("test@example.com");
    await page.getByLabel(/^Message/).fill("Hello again.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(page.getByText(/last minute/i)).toBeVisible();
  });
});
