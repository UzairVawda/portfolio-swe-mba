import { describe, expect, it } from "vitest";

import { contrastRatio, relativeLuminance } from "./contrast";

describe("relativeLuminance", () => {
  it("is 1 for white and 0 for black", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
  });

  it("applies the sRGB gamma curve, not a linear ramp", () => {
    // Mid grey is far darker than 0.5 once gamma is undone.
    expect(relativeLuminance("#808080")).toBeCloseTo(0.2159, 3);
  });

  it("accepts uppercase hex", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 2);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#1B6B4A", "#EFF3EF")).toBeCloseTo(
      contrastRatio("#EFF3EF", "#1B6B4A"),
      6,
    );
  });

  it("is 1 for a colour against itself", () => {
    expect(contrastRatio("#1B6B4A", "#1B6B4A")).toBeCloseTo(1, 6);
  });
});
