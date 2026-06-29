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

  it("holds the icosahedron through the line breakdown (up to 0.25)", () => {
    const s = scrollToState(0.2);
    expect(s.fromShape).toBe("icosahedron");
    expect(s.toShape).toBe("icosahedron");
  });

  it("blends icosahedron->sphere after the breakdown (0.25..0.6)", () => {
    const s = scrollToState(0.425);
    expect(s.fromShape).toBe("icosahedron");
    expect(s.toShape).toBe("sphere");
    expect(s.blend).toBeCloseTo(0.5, 5);
  });

  it("blends sphere->dispersed late (0.6..1)", () => {
    const s = scrollToState(0.8);
    expect(s.fromShape).toBe("sphere");
    expect(s.toShape).toBe("dispersed");
    expect(s.blend).toBeCloseTo(0.5, 5);
  });

  it("shows only the wireframe lines at the top", () => {
    const s = scrollToState(0);
    expect(s.lineOpacity).toBe(1);
    expect(s.dotOpacity).toBe(0);
  });

  it("shows only dots once the breakdown completes", () => {
    const s = scrollToState(0.25);
    expect(s.lineOpacity).toBeCloseTo(0, 5);
    expect(s.dotOpacity).toBeCloseTo(1, 5);
    // and stays dots-only deeper into the scroll
    const later = scrollToState(0.6);
    expect(later.lineOpacity).toBe(0);
    expect(later.dotOpacity).toBe(1);
  });

  it("crossfades lines out as dots come in", () => {
    const s = scrollToState(0.125);
    expect(s.lineOpacity).toBeGreaterThan(0);
    expect(s.lineOpacity).toBeLessThan(1);
    expect(s.dotOpacity).toBeGreaterThan(0);
    expect(s.dotOpacity).toBeLessThan(1);
    // the two are complementary
    expect(s.lineOpacity + s.dotOpacity).toBeCloseTo(1, 5);
  });

  it("keeps line/dot opacity within [0,1] across the range", () => {
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const s = scrollToState(p);
      expect(s.lineOpacity).toBeGreaterThanOrEqual(0);
      expect(s.lineOpacity).toBeLessThanOrEqual(1);
      expect(s.dotOpacity).toBeGreaterThanOrEqual(0);
      expect(s.dotOpacity).toBeLessThanOrEqual(1);
    }
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
