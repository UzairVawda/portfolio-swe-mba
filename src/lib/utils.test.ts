import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("joins multiple class strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("supports conditional object syntax", () => {
    expect(cn({ a: true, b: false, c: true })).toBe("a c");
  });

  it("flattens arrays of classes", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("resolves conflicting tailwind padding utilities (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("resolves conflicting tailwind colors (last wins)", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("keeps non-conflicting utilities side by side", () => {
    expect(cn("px-2", "py-4", "text-sm")).toBe("px-2 py-4 text-sm");
  });

  it("lets a later conditional class override an earlier base class", () => {
    const isActive = true;
    expect(cn("text-gray-500", isActive && "text-black")).toBe("text-black");
  });

  it("returns an empty string when given nothing", () => {
    expect(cn()).toBe("");
  });
});
