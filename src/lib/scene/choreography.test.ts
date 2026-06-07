import { describe, expect, it } from "vitest";

import { scrollToState } from "./choreography";

describe("scrollToState", () => {
  it("starts as the icosahedron at progress 0", () => {
    const s = scrollToState(0);
    expect(s.fromShape).toBe("icosahedron");
    expect(s.blend).toBe(0);
  });

  it("ends fully dispersed at progress 1", () => {
    const s = scrollToState(1);
    expect(s.toShape).toBe("dispersed");
    expect(s.blend).toBe(1);
  });

  it("blends icosahedron->sphere in the first half", () => {
    const s = scrollToState(0.25);
    expect(s.fromShape).toBe("icosahedron");
    expect(s.toShape).toBe("sphere");
    expect(s.blend).toBeCloseTo(0.5, 5);
  });

  it("blends sphere->dispersed in the second half", () => {
    const s = scrollToState(0.75);
    expect(s.fromShape).toBe("sphere");
    expect(s.toShape).toBe("dispersed");
    expect(s.blend).toBeCloseTo(0.5, 5);
  });

  it("keeps blend within [0,1] across the range", () => {
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const s = scrollToState(p);
      expect(s.blend).toBeGreaterThanOrEqual(0);
      expect(s.blend).toBeLessThanOrEqual(1);
    }
  });

  it("clamps out-of-range input", () => {
    expect(scrollToState(-1)).toEqual(scrollToState(0));
    expect(scrollToState(2)).toEqual(scrollToState(1));
  });

  it("rotation increases monotonically with progress", () => {
    expect(scrollToState(0.6).rotationY).toBeGreaterThan(
      scrollToState(0.3).rotationY,
    );
  });
});
