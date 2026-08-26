import { expect, test } from "@playwright/test";

// There is one contact form now, in the contact section on `/`. Locators are
// testids, never prose — the copy in this section changes; the form does not.
// The field locators stay `getByLabel`: an accessible name is the contract a
// screen reader reads, so asserting on it is semantic, not brittle.

test.describe("contact form", () => {
  test("renders the section heading and every field", async ({ page }) => {
    await page.goto("/#contact");

    await expect(page.getByTestId("heading-contact")).toBeVisible();

    await expect(page.getByLabel("Name *")).toBeVisible();
    await expect(page.getByLabel("Email *")).toBeVisible();
    await expect(page.getByLabel(/^Message/)).toBeVisible();
    await expect(page.getByTestId("contact-submit")).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/#contact");

    await page.getByTestId("contact-submit").click();

    // Two "Required" errors (name + message) + one email error.
    await expect(page.getByText("Required").first()).toBeVisible();
    await expect(page.getByText(/Enter a valid email/i)).toBeVisible();
    // The form must not have gone through: no success panel, no request.
    await expect(page.getByTestId("contact-success")).toHaveCount(0);
  });

  test("shows the success state and posts the portfolio source", async ({
    page,
  }) => {
    let submitted: Record<string, unknown> = {};

    await page.route("**/api/contact", async (route) => {
      submitted = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/#contact");

    await page.getByLabel("Name *").fill("Test User");
    await page.getByLabel("Email *").fill("test@example.com");
    await page.getByLabel(/^Message/).fill("Hello from Playwright.");
    await page.getByTestId("contact-submit").click();

    await expect(page.getByTestId("contact-success")).toBeVisible();
    // The form is replaced by the success panel, not merely annotated.
    await expect(page.getByTestId("contact-submit")).toHaveCount(0);
    expect(submitted.source).toBe("portfolio");
    expect(submitted.name).toBe("Test User");
    expect(submitted.email).toBe("test@example.com");
    expect(submitted.message).toBe("Hello from Playwright.");
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

    await page.goto("/#contact");

    await page.getByLabel("Name *").fill("Test User");
    await page.getByLabel("Email *").fill("test@example.com");
    await page.getByLabel(/^Message/).fill("Hello again.");
    await page.getByTestId("contact-submit").click();

    // The server's message is surfaced verbatim, not swallowed for a generic
    // one — the retry advice is the whole value of a 429.
    await expect(page.getByTestId("contact-error")).toHaveText(
      "You sent a message in the last minute. Wait a bit, then try again.",
    );
    await expect(page.getByTestId("contact-success")).toHaveCount(0);
  });
});
