import { expect, test } from "@playwright/test";

test.describe("the overture", () => {
  test("plays once, then unmounts and leaves the document up", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByTestId("overture")).toBeAttached();

    // The scene removes itself once settled — no idle GPU cost afterwards.
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });
    await expect(page.getByTestId("hero-document")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("does not replay within the same session", async ({ page }) => {
    await page.goto("/");
    // Prove it played on the first load, or the reload proves nothing.
    await expect(page.getByTestId("overture")).toBeAttached();
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });

    await page.reload();
    await expect(page.getByTestId("hero-document")).toBeVisible();
    // sessionStorage survives the reload, so the sequence is skipped entirely.
    // Sampled rather than asserted with toHaveCount: that assertion retries
    // until the expectation holds, so it would happily wait out a replay and
    // pass on the sequence's own cleanup.
    await page.waitForTimeout(1500);
    expect(await page.getByTestId("overture").count()).toBe(0);
    expect(await page.locator("canvas").count()).toBe(0);
    await expect(page.getByTestId("hero-document")).toBeVisible();
  });

  test("is skippable with a keypress", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("overture")).toBeAttached();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 2000,
    });
    await expect(page.getByTestId("hero-document")).toBeVisible();
  });

  test("reduced motion skips straight to the resolved document", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByTestId("hero-document")).toBeVisible();
    // The copy is server-rendered, so it is visible before any decision is
    // made. Wait past the point where the scene would have mounted.
    await page.waitForTimeout(1500);
    expect(await page.getByTestId("overture").count()).toBe(0);
    expect(await page.locator("canvas").count()).toBe(0);
    await expect(page.getByTestId("hero-document")).toBeVisible();
    await context.close();
  });

  test("hero actions are reachable immediately", async ({ page }) => {
    await page.goto("/");
    // The buttons exist in the DOM from the first paint even while the copy
    // is fading in — a recruiter is never blocked on the animation.
    await expect(page.getByTestId("hero-cta-resume")).toBeAttached();
    await expect(page.getByTestId("hero-cta-work")).toBeAttached();

    // "See work" must land somewhere: the anchor it points at has to exist on
    // this page, not just be a well-formed href.
    const href = await page.getByTestId("hero-cta-work").getAttribute("href");
    expect(href).toBe("/#work");
    expect(await page.locator("#work").count()).toBe(1);
  });
});
