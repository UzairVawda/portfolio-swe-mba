// "Pine, tinted" — the single source of truth for the palette in TypeScript.
// globals.css declares the same values as CSS custom properties. Satori (OG
// images) and three.js cannot read CSS variables, so they import from here.

export type ThemeName = "light" | "dark";

export type TokenName =
  | "ground"
  | "surface"
  | "tint"
  | "ink"
  | "muted"
  | "rule"
  | "ruleStrong"
  | "signal";

export const tokens: Record<ThemeName, Record<TokenName, string>> = {
  light: {
    ground: "#EFF3EF",
    surface: "#F7FAF7",
    tint: "#DEEAE2",
    ink: "#0C1310",
    muted: "#566159",
    rule: "#D6E0D8",
    ruleStrong: "#B9CCC0",
    signal: "#1B6B4A",
  },
  dark: {
    ground: "#0B0F0D",
    surface: "#131A16",
    tint: "#16241C",
    ink: "#EFF3EF",
    muted: "#8E9A92",
    rule: "#222E28",
    ruleStrong: "#33443B",
    signal: "#4FBF8B",
  },
};
