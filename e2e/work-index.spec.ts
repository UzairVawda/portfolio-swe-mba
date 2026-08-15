import { expect, test } from "@playwright/test";

// The signal accent and the tint fill. The resolved theme decides which pair
// is live, so the test reads the theme off the document and then pins the
// exact value — an "either of these two" assertion would pass on a row that
// picked up the wrong theme's accent.
const SIGNAL = { light: "rgb(27, 107, 74)", dark: "rgb(79, 191, 139)" };
const TINT = { light: "rgb(222, 234, 226)", dark: "rgb(22, 36, 28)" };

type Scheme = keyof typeof SIGNAL;

// Projects, then earlier concepts, then the archive groups — one continuous
// ladder, which is the whole point of merging the two old sections.
const ROWS = [
  "jhparking",
  "matai",
  "coachme",
  "pagekeeper",
  "mba-engineered",
  "connect",
  "marketplaces-products",
  "web-full-stack",
  "automation-data",
];

test.describe("the work index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#work");
    // Skip the overture so the index is interactive immediately.
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });
  });

  test("lists every project, concept, and archive group as one numbered ladder", async ({
    page,
  }) => {

    const ids = await page
      .locator("[data-testid^='work-row-']")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-testid")));
    expect(ids).toEqual(ROWS.map((slug) => `work-row-${slug}`));

    // The numerals run 01..09 unbroken across all three groups. Read from the
    // rendered rows in DOM order, so a reset or a duplicated offset fails.
    const numerals = await page
      .locator("[data-testid^='work-row-'] > span:first-of-type")
      .evaluateAll((els) => els.map((el) => el.textContent?.trim()));
    expect(numerals).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
    ]);
  });

  test("keeps every panel closed until its row is opened", async ({ page }) => {
    for (const slug of ROWS) {
      await expect(page.getByTestId(`work-panel-${slug}`)).toBeHidden();
    }
  });

  test("expands a row in place, signal-coloured, over a tint panel", async ({
    page,
  }) => {
    const scheme: Scheme = (await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    ))
      ? "dark"
      : "light";

    const row = page.getByTestId("work-row-matai");
    const panel = page.getByTestId("work-panel-matai");

    await expect(panel).toBeHidden();
    // Nothing above the index moves when a row opens. Measured in document
    // coordinates, not viewport ones, so an incidental scroll cannot fake it.
    const offsetTop = () =>
      page
        .getByTestId("section-experience")
        .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const before = await offsetTop();

    await row.click();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Want in?");

    expect(await offsetTop()).toBe(before);

    // Polled, not sampled: the trigger transitions its colour, so a single
    // read right after the click catches a mid-transition value.
    await expect
      .poll(() => row.evaluate((el) => getComputedStyle(el).color))
      .toBe(SIGNAL[scheme]);

    const fill = await panel
      .locator("div.bg-tint")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(fill).toBe(TINT[scheme]);

    // A closed neighbour is not signal-coloured — proves the colour tracks
    // the open state rather than being painted on every row.
    const closed = await page
      .getByTestId("work-row-coachme")
      .evaluate((el) => getComputedStyle(el).color);
    expect(closed).not.toBe(SIGNAL[scheme]);
    expect(closed).not.toBe("");
  });

  test("opens a row from the keyboard", async ({ page }) => {
    const row = page.getByTestId("work-row-jhparking");
    const panel = page.getByTestId("work-panel-jhparking");

    await row.focus();
    await expect(row).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
  });

  test("carries the archive lead paragraph into the first archive row", async ({
    page,
  }) => {
    await page.getByTestId("work-row-marketplaces-products").click();
    const panel = page.getByTestId("work-panel-marketplaces-products");
    await expect(panel).toContainText(
      "Coursework, prototypes, and things I built to find out whether I could.",
    );
    await expect(panel).toContainText("718SNKRS");
  });
});
