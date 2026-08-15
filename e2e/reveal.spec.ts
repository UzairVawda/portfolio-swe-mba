import { expect, test, type Page } from "@playwright/test";

type Sample = { t: number; opacity: number; ty: number };

// Scrolls the element into view and then samples its computed opacity and
// vertical translation every frame for `windowMs`. Sampling beats a single
// post-hoc assertion here: the whole question is what the element does
// *during* the reveal, and a settled element looks identical either way.
async function sampleReveal(
  page: Page,
  testId: string,
  windowMs: number,
): Promise<Sample[]> {
  return page.evaluate(
    async ([id, ms]) => {
      const el = document.querySelector(`[data-testid="${id}"]`);
      if (!el) throw new Error(`no element with data-testid="${id}"`);
      el.scrollIntoView({ block: "center", behavior: "instant" });

      const out: { t: number; opacity: number; ty: number }[] = [];
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const tick = () => {
          const style = getComputedStyle(el);
          const matrix = new DOMMatrixReadOnly(
            style.transform === "none" ? undefined : style.transform,
          );
          out.push({
            t: performance.now() - start,
            opacity: Number.parseFloat(style.opacity),
            ty: matrix.m42,
          });
          if (performance.now() - start >= (ms as number)) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      return out;
    },
    [testId, windowMs] as const,
  );
}

const SECTIONS = [
  "about",
  "experience",
  "skills",
  "education",
  "interests",
  "contact",
] as const;

test.describe("the section reveals", () => {
  test("rises into place on entry when motion is allowed", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");

    const samples = await sampleReveal(page, "reveal-contact-form", 1400);

    // The rise is the point of tier 2: some frame during the reveal must show
    // the element still travelling.
    const travelled = samples.filter((s) => Math.abs(s.ty) > 4);
    expect(travelled.length).toBeGreaterThan(0);

    // ...and it must land, not hover.
    const last = samples[samples.length - 1];
    expect(Math.abs(last.ty)).toBeLessThan(0.5);
    expect(last.opacity).toBeGreaterThan(0.99);
  });

  test("collapses to a short opacity fade with no travel under reduced motion", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const samples = await sampleReveal(page, "reveal-contact-form", 600);

    // No vertical travel at any point — not merely "settled by the end".
    const travelled = samples.filter((s) => Math.abs(s.ty) > 0.5);
    expect(travelled).toEqual([]);

    // The fade is <= 150ms, so it is fully opaque well inside 300ms.
    const early = samples.filter((s) => s.t >= 300);
    expect(early.length).toBeGreaterThan(0);
    expect(early.every((s) => s.opacity > 0.99)).toBe(true);

    await context.close();
  });

  // The pre-hydration paint, tested honestly: with JS disabled the page is the
  // server's markup plus CSS and nothing else, which is exactly what a reduced
  // motion visitor sees before hydration. `useReducedMotion` resolves to false
  // on the server, so both primitives ship their moving variant's transform
  // inline; if CSS does not neutralise it, headings paint clipped to nothing
  // and pop in on hydration.
  test("paints no transform before hydration under reduced motion", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto("/");

    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal],[data-unmask-line]")].map(
        (el) => {
          const transform = getComputedStyle(el).transform;
          const ty =
            transform === "none"
              ? 0
              : new DOMMatrixReadOnly(transform).m42;
          return { text: (el.textContent ?? "").slice(0, 24), ty };
        },
      ).filter((s) => Math.abs(s.ty) > 0.5),
    );

    expect(offenders).toEqual([]);
    await context.close();
  });

  test("fires once and never re-hides on scroll-back", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");

    await sampleReveal(page, "reveal-contact-form", 1400);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    // Non-retrying: an auto-retrying matcher would wait out a re-hide and pass
    // once the element faded back in, which is exactly the bug being excluded.
    await page.waitForTimeout(1200);
    const opacity = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="reveal-contact-form"]');
      return Number.parseFloat(getComputedStyle(el as Element).opacity);
    });
    expect(opacity).toBeGreaterThan(0.99);
  });

  test("renders every section heading through the unmask", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");

    for (const id of SECTIONS) {
      const heading = page.getByTestId(`heading-${id}`);
      await expect(heading).toBeAttached();
      const text = (await heading.innerText()).trim();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test("paints every section eyebrow in the signal accent", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");

    const signal = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "var(--signal)";
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    });

    for (const id of SECTIONS) {
      const eyebrow = page.getByTestId(`eyebrow-${id}`);
      await expect(eyebrow).toBeAttached();
      const color = await eyebrow.evaluate((el) => getComputedStyle(el).color);
      expect(color).toBe(signal);
    }
  });
});
