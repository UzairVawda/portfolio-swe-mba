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

    await expect(page.getByTestId("hero-cta-about")).toBeAttached();

    // The on-page CTAs are bare fragments, not "/#work". A next/link to the
    // full path scrolls to the top of the page when the URL already carries
    // that hash — see the regression test below.
    for (const [id, hash] of [
      ["hero-cta-work", "#work"],
      ["hero-cta-about", "#about"],
    ] as const) {
      expect(await page.getByTestId(id).getAttribute("href")).toBe(hash);
      expect(await page.locator(hash).count()).toBe(1);
    }
  });

  // The reported bug: "See work" worked once, then stopped. Once the URL
  // already said #work — which happens the moment you use the nav — clicking
  // it again jumped to the top of the page instead of the work section.
  test("hero CTAs still scroll when the URL already carries their hash", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });

    const scrollY = () => page.evaluate(() => Math.round(window.scrollY));

    await page.getByTestId("hero-cta-work").click();
    await expect.poll(scrollY).toBeGreaterThan(500);
    expect(page.url()).toContain("#work");

    // Back to the top with the hash still set — the exact state that broke.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(scrollY).toBe(0);

    await page.getByTestId("hero-cta-work").click();
    await expect.poll(scrollY).toBeGreaterThan(500);
  });

  // The About copy closes on "I'd love to connect", which has to land on the
  // contact form. Same bare-fragment rule as the hero CTAs.
  test("the about copy links through to the contact section", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });

    const link = page.getByTestId("about-contact-link");
    expect(await link.getAttribute("href")).toBe("#contact");

    await link.click();
    await expect(page.getByTestId("section-contact")).toBeInViewport();
  });
});
