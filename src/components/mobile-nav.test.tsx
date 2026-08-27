// The desktop nav hides every link below sm. This component is the reason
// that is survivable: it renders a trigger at exactly the widths where the
// desktop links disappear. The sheet's contents are portaled and absent from
// the DOM while closed, so what is assertable here is the trigger and the
// breakpoint it answers to — the links themselves are covered in
// e2e/mobile-nav.spec.ts, where a real viewport exists.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MobileNav } from "@/components/mobile-nav";
import { navLinks } from "@/components/site-nav";

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

const links = navLinks({ tools: 2, speaking: 2 });

describe("MobileNav", () => {
  const dom = parse(renderToStaticMarkup(<MobileNav links={links} />));
  const trigger = dom.querySelector("[data-testid='mobile-nav-trigger']");

  it("renders a trigger", () => {
    expect(trigger).not.toBeNull();
  });

  it("hides the trigger at exactly the width the desktop links appear", () => {
    // sm:hidden is the mirror of the desktop links' sm:inline-flex. If these
    // two ever disagree there is a width with two navs or a width with none.
    expect(trigger?.className).toContain("sm:hidden");
  });

  it("gives the trigger an accessible name", () => {
    const labelled =
      trigger?.getAttribute("aria-label") ??
      trigger?.querySelector(".sr-only")?.textContent;
    expect(labelled).toBe("Open menu");
  });
});
