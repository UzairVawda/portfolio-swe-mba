import { describe, expect, it } from "vitest";

import {
  OVERTURE_DURATION_MS,
  overtureState,
  type OvertureState,
} from "./overture";

const at = (ms: number): OvertureState => overtureState(ms);

describe("overtureState", () => {
  it("starts dispersed and invisible on the document", () => {
    const s = at(0);
    expect(s.phase).toBe("gather");
    expect(s.fromShape).toBe("dispersed");
    expect(s.blend).toBe(0);
    expect(s.documentOpacity).toBe(0);
  });

  it("gathers into the icosahedron by the end of the gather phase", () => {
    const s = at(1600);
    expect(s.toShape).toBe("icosahedron");
    expect(s.blend).toBeCloseTo(1, 3);
  });

  it("holds the gathered form while the name resolves", () => {
    const s = at(2100);
    expect(s.phase).toBe("hold");
    expect(s.fromShape).toBe("icosahedron");
    expect(s.toShape).toBe("icosahedron");
    expect(s.dispersion).toBe(0);
  });

  // Pins the hold/disperse boundary itself: the assertions either side of it
  // (2100ms hold, 3400ms disperse) leave the crossing free to slide by
  // hundreds of milliseconds without failing anything.
  it("holds right up to the disperse boundary, then crosses", () => {
    expect(at(2599).phase).toBe("hold");
    expect(at(2600).phase).toBe("disperse");
    expect(at(2600).blend).toBe(0);
  });

  it("disperses and hands over to the document", () => {
    const s = at(3400);
    expect(s.phase).toBe("disperse");
    expect(s.dispersion).toBeGreaterThan(0);
    expect(s.documentOpacity).toBeGreaterThan(0);
    expect(s.dotOpacity).toBeLessThan(1);
  });

  it("settles with the document fully up and the cloud gone", () => {
    const s = at(OVERTURE_DURATION_MS);
    expect(s.phase).toBe("settled");
    expect(s.documentOpacity).toBe(1);
    expect(s.dotOpacity).toBe(0);
    expect(s.lineOpacity).toBe(0);
  });

  it("stays settled past the end rather than looping", () => {
    expect(at(OVERTURE_DURATION_MS * 3)).toEqual(at(OVERTURE_DURATION_MS));
  });

  it("clamps negative elapsed time to the start", () => {
    expect(at(-500)).toEqual(at(0));
  });

  it("raises document opacity monotonically", () => {
    let previous = -1;
    for (let ms = 0; ms <= OVERTURE_DURATION_MS; ms += 50) {
      const value = at(ms).documentOpacity;
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("keeps every opacity within 0..1", () => {
    for (let ms = -100; ms <= OVERTURE_DURATION_MS + 100; ms += 37) {
      const s = at(ms);
      for (const value of [
        s.blend,
        s.dotOpacity,
        s.lineOpacity,
        s.dispersion,
        s.documentOpacity,
      ]) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
});
