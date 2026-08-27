// The shared Open Graph card.
//
// Satori resolves no CSS variables and inherits no stylesheet, so the card has
// to carry literal hex values. That is exactly the thing that drifts off
// palette silently, so this file asserts every colour in the tree against
// tokens.dark rather than against a copy of the hex typed out here. A card
// painted indigo, or a card carrying an extra swatch, fails.

import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { OG_SIZE, ogCard } from "@/app/og/card";
import { tokens } from "@/lib/theme/tokens";
import { elements, hexes, styleOf, styles, text } from "@/test/element-tree";

const t = tokens.dark;

const EYEBROW = "speaking";
const TITLE = "Zicklin systems panel";
const SUBTITLE = "What the room pushed back on.";

const card = ogCard({ eyebrow: EYEBROW, title: TITLE, subtitle: SUBTITLE });

function slot(value: string) {
  const matches = elements(card).filter((el) => text(el).trim() === value);
  expect(matches).toHaveLength(1);
  return matches[0];
}

describe("OG_SIZE", () => {
  it("is the 1200x630 Open Graph canvas", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
  });
});

describe("ogCard", () => {
  it("renders the eyebrow, title and subtitle it is given", () => {
    const rendered = text(card);

    expect(rendered).toContain(EYEBROW);
    expect(rendered).toContain(TITLE);
    expect(rendered).toContain(SUBTITLE);
  });

  it("gives each of the three slots its own element", () => {
    for (const value of [EYEBROW, TITLE, SUBTITLE]) expect(slot(value)).toBeTruthy();
  });

  it("paints the ground and ink from the dark palette", () => {
    const root = styleOf(card);

    expect(root?.background).toBe(t.ground);
    expect(root?.color).toBe(t.ink);
    expect(root?.width).toBe("100%");
    expect(root?.height).toBe("100%");
    // Satori has no block layout; the root must lay its children out itself.
    expect(root?.display).toBe("flex");
    expect(root?.flexDirection).toBe("column");
  });

  it("puts the signal green on the eyebrow and nowhere else", () => {
    expect(styles(card).filter((style) => style.color === t.signal)).toHaveLength(1);
    expect(styleOf(slot(EYEBROW))?.color).toBe(t.signal);
  });

  it("sets the subtitle in muted, not in ink", () => {
    expect(styleOf(slot(SUBTITLE))?.color).toBe(t.muted);
  });

  it("sizes the title above the subtitle above the eyebrow", () => {
    const size = (value: string) => Number(styleOf(slot(value))?.fontSize);

    expect(size(TITLE)).toBeGreaterThan(size(SUBTITLE));
    expect(size(SUBTITLE)).toBeGreaterThan(size(EYEBROW));
  });

  it("rules the footer off with the palette rule colour", () => {
    const ruled = styles(card).filter(
      (style) => typeof style.borderTop === "string",
    );

    expect(ruled).toHaveLength(1);
    expect(ruled[0].borderTop).toContain(t.rule);
  });

  it("signs the card", () => {
    expect(text(card)).toContain("Uzair Vawda");
    expect(text(card)).toContain("uzairvawda.me");
  });

  it("uses no colour that is not in the dark palette", () => {
    const palette = Object.values(t).map((hex) => hex.toLowerCase());
    const used = hexes(card).map((hex) => hex.toLowerCase());

    expect(used.length).toBeGreaterThan(0);
    for (const hex of used) expect(palette).toContain(hex);
  });

  it("gives every multi-child element an explicit display, as Satori demands", () => {
    for (const el of elements(card)) {
      const children = (el.props as { children?: ReactNode }).children;
      if (!Array.isArray(children) || children.filter(Boolean).length < 2) continue;
      expect(styleOf(el)?.display).toBe("flex");
    }
  });
});
