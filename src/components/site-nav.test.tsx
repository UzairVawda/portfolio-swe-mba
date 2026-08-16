// The nav is flat: Work, Tools, Speaking, About, Contact are peers, and there
// is no MBA hub. Two things are worth locking down here. First, that the
// gallery entries are gated on their collections actually having something in
// them — a nav entry leading to an empty page is worse than no nav entry.
// Second, that every href a link ships with is a route this site really has;
// a nav that renders a label pointing at nothing still "renders a label".

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteNav, navLinks } from "@/components/site-nav";
import { speaking, tools } from "@/content/track";
import { routes } from "@/lib/routes";

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

const empty = { tools: 0, speaking: 0 };

describe("navLinks", () => {
  it("omits both galleries while both collections are empty", () => {
    expect(navLinks(empty).map((link) => link.label)).toEqual([
      "Work",
      "About",
      "Contact",
    ]);
  });

  it("adds Tools once tools exist, and only Tools", () => {
    const labels = navLinks({ tools: 1, speaking: 0 }).map((l) => l.label);
    expect(labels).toEqual(["Work", "Tools", "About", "Contact"]);
  });

  it("adds Speaking once talks exist, and only Speaking", () => {
    const labels = navLinks({ tools: 0, speaking: 3 }).map((l) => l.label);
    expect(labels).toEqual(["Work", "Speaking", "About", "Contact"]);
  });

  it("orders the full nav Work · Tools · Speaking · About · Contact", () => {
    // The galleries sit next to the work, not after the personal sections.
    const links = navLinks({ tools: 2, speaking: 2 });
    expect(links.map((l) => l.label)).toEqual([
      "Work",
      "Tools",
      "Speaking",
      "About",
      "Contact",
    ]);
    expect(links.map((l) => l.href)).toEqual([
      routes.work,
      routes.tools,
      routes.speaking,
      routes.about,
      routes.contact,
    ]);
  });

  it("points every link at a route from the manifest, never a literal", () => {
    // Guards the failure mode the routes module exists to prevent: a
    // hand-typed "/tools" that survives a rename of the real route.
    const known = new Set<string>(Object.values(routes));
    for (const link of navLinks({ tools: 1, speaking: 1 })) {
      expect(known, link.label).toContain(link.href);
    }
  });

  it("gives every link a distinct nav- testid", () => {
    const testIds = navLinks({ tools: 1, speaking: 1 }).map((l) => l.testId);
    expect(testIds).toEqual([
      "nav-work",
      "nav-tools",
      "nav-speaking",
      "nav-about",
      "nav-contact",
    ]);
    expect(new Set(testIds).size).toBe(testIds.length);
  });
});

describe("SiteNav", () => {
  const dom = parse(renderToStaticMarkup(<SiteNav />));

  it("renders exactly the links the manifest says are shown", () => {
    // Derived from the real collections rather than hardcoded, so the day the
    // first tool ships this assertion follows it instead of going stale.
    const expected = navLinks({
      tools: tools.length,
      speaking: speaking.length,
    });
    const rendered = Array.from(
      dom.querySelectorAll("[data-testid^='nav-']"),
    ).filter((el) => el.getAttribute("data-testid") !== "nav-resume");

    expect(rendered.map((el) => el.getAttribute("data-testid"))).toEqual(
      expected.map((link) => link.testId),
    );
    expect(rendered.map((el) => el.getAttribute("href"))).toEqual(
      expected.map((link) => link.href),
    );
    expect(rendered.map((el) => el.textContent)).toEqual(
      expected.map((link) => link.label),
    );
  });

  it("carries no link into the retired MBA tree", () => {
    const hrefs = Array.from(dom.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs.every((href) => !href?.startsWith("/mba"))).toBe(true);
    expect(dom.textContent).not.toContain("MBA");
  });

  it("offers the CV as a download and links the wordmark home", () => {
    const resume = dom.querySelector("[data-testid='nav-resume']");
    expect(resume?.getAttribute("href")).toBe(routes.resume);
    expect(resume?.getAttribute("download")).toBe("Uzair-Vawda-CV.pdf");

    const home = dom.querySelector("a");
    expect(home?.getAttribute("href")).toBe(routes.home);
    expect(home?.textContent).toBe("./uzair");
  });
});
