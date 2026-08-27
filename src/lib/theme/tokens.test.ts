import { describe, expect, it } from "vitest";

import { contrastRatio } from "./contrast";
import { tokens, type ThemeName, type TokenName } from "./tokens";

// Every foreground/background pairing the design actually uses, with the
// measured ratio from the spec. Exact values, not just ">= 4.5" — a token
// nudge that still passes AA should still be a deliberate, reviewed change.
const PAIRS: Array<[TokenName, TokenName, number, number]> = [
  // [foreground, background, light, dark]
  ["ink", "ground", 16.79, 17.22],
  ["ink", "surface", 17.89, 15.78],
  ["ink", "tint", 15.21, 14.38],
  ["muted", "ground", 5.77, 6.6],
  ["muted", "surface", 6.15, 6.05],
  ["muted", "tint", 5.22, 5.52],
  ["signal", "ground", 5.77, 8.41],
  ["signal", "surface", 6.15, 7.71],
  ["signal", "tint", 5.22, 7.03],
];

const THEMES: ThemeName[] = ["light", "dark"];

describe("pine palette", () => {
  it("defines the same token set in both themes", () => {
    expect(Object.keys(tokens.light).sort()).toEqual(
      Object.keys(tokens.dark).sort(),
    );
  });

  it("uses six-digit hex for every token", () => {
    for (const theme of THEMES) {
      for (const [name, value] of Object.entries(tokens[theme])) {
        expect(value, `${theme}.${name}`).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  for (const [fg, bg, light, dark] of PAIRS) {
    it(`${fg} on ${bg} meets AA in both themes`, () => {
      const measured = {
        light: contrastRatio(tokens.light[fg], tokens.light[bg]),
        dark: contrastRatio(tokens.dark[fg], tokens.dark[bg]),
      };
      expect(measured.light).toBeGreaterThanOrEqual(4.5);
      expect(measured.dark).toBeGreaterThanOrEqual(4.5);
      expect(measured.light).toBeCloseTo(light, 2);
      expect(measured.dark).toBeCloseTo(dark, 2);
    });
  }

  it("keeps the primary button legible in both themes", () => {
    // Light: pale ground-coloured label on saturated signal.
    expect(
      contrastRatio(tokens.light.ground, tokens.light.signal),
    ).toBeGreaterThanOrEqual(4.5);
    // Dark: near-black label on the brighter signal.
    expect(
      contrastRatio(tokens.dark.ground, tokens.dark.signal),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
