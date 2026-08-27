// Three independently-authored content arrays render as siblings inside one
// Accordion. The Accordion keys each item by `value`, so two items sharing a
// value leaves one permanently unopenable — silently, with no error anywhere.
// Namespacing by section prevents collisions ACROSS the arrays; this test also
// catches a duplicate WITHIN one array, which namespacing cannot.

import { describe, expect, it } from "vitest";

import { workRowSlugs } from "@/components/sections/work-index";

describe("work index slugs", () => {
  it("assigns every row a unique slug", () => {
    const slugs = workRowSlugs();
    expect(new Set(slugs).size, `duplicate slug in ${slugs.join(", ")}`).toBe(
      slugs.length,
    );
  });

  it("namespaces every slug by its section", () => {
    for (const slug of workRowSlugs()) {
      expect(slug).toMatch(/^(project|concept|archive)-/);
    }
  });

  it("covers every row in all three content arrays", () => {
    expect(workRowSlugs()).toHaveLength(9);
  });
});
