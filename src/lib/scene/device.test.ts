import { describe, expect, it } from "vitest";

import { particleBudget } from "./device";

describe("particleBudget", () => {
  it("gives the full budget to wide fine-pointer screens", () => {
    expect(particleBudget(1920, false)).toBe(6500);
    expect(particleBudget(1280, false)).toBe(6500);
  });

  it("gives a mid budget to tablet-width screens", () => {
    expect(particleBudget(1279, false)).toBe(2000);
    expect(particleBudget(768, false)).toBe(2000);
  });

  it("gives the small budget to narrow screens", () => {
    expect(particleBudget(767, false)).toBe(900);
    expect(particleBudget(375, false)).toBe(900);
  });

  it("treats any coarse-pointer device as small regardless of width", () => {
    expect(particleBudget(1920, true)).toBe(900);
  });
});
