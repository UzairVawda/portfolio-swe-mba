import { describe, expect, it } from "vitest";

import { eyebrow, sectionLabel, sectionOrder } from "./sections";

describe("section manifest", () => {
  it("numbers sections sequentially from 01 in declaration order", () => {
    const numbers = sectionOrder.map((id) => eyebrow(id).slice(0, 2));
    expect(numbers).toEqual(
      sectionOrder.map((_, i) => String(i + 1).padStart(2, "0")),
    );
  });

  it("formats an eyebrow as NN · Label", () => {
    expect(eyebrow("about")).toBe("01 · About");
    expect(eyebrow("contact")).toBe("07 · Let's talk");
  });

  it("renders the whole ladder, in order, exactly as the page reads it", () => {
    // Spelled out rather than derived: the test above maps over `sectionOrder`
    // to build its own expectation, so it is true by construction and passes
    // even if two sections are swapped. This is the assertion that actually
    // locks the order — the invariant the manifest exists to protect, and the
    // one the deleted swe.test.ts block used to hold. A task that adds,
    // removes, or reorders a section is meant to edit this list.
    expect(sectionOrder.map(eyebrow)).toEqual([
      "01 · About",
      "02 · Experience",
      "03 · Work",
      "04 · Skills",
      "05 · Education & Certifications",
      "06 · Off-screen",
      "07 · Let's talk",
      "08 · What's next",
    ]);
  });

  it("labels every declared section", () => {
    for (const id of sectionOrder) {
      expect(sectionLabel[id], id).toBeTruthy();
    }
  });

  it("declares no duplicate ids", () => {
    expect(new Set(sectionOrder).size).toBe(sectionOrder.length);
  });

  it("throws for an id that is not in the order", () => {
    // @ts-expect-error — deliberately off-manifest
    expect(() => eyebrow("nope")).toThrow(/not in sectionOrder/);
  });
});
