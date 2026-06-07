import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { optionalEnv, requireEnv } from "./env";

// requireEnv caches by name across the whole process, so every test uses a
// unique variable name to avoid cross-test cache bleed.
let counter = 0;
const freshName = () => `TEST_ENV_VAR_${process.pid}_${counter++}`;

const touched: string[] = [];
function setEnv(name: string, value: string) {
  touched.push(name);
  process.env[name] = value;
}

afterEach(() => {
  for (const name of touched.splice(0)) {
    delete process.env[name];
  }
});

describe("requireEnv", () => {
  it("returns the value when the variable is set", () => {
    const name = freshName();
    setEnv(name, "hello");
    expect(requireEnv(name)).toBe("hello");
  });

  it("throws a named error when the variable is missing", () => {
    const name = freshName();
    expect(() => requireEnv(name)).toThrowError(
      new RegExp(`Missing required environment variable: ${name}`),
    );
  });

  it("throws when the variable is an empty string", () => {
    const name = freshName();
    setEnv(name, "");
    expect(() => requireEnv(name)).toThrowError(/Missing required/);
  });

  it("caches the first resolved value and ignores later env mutations", () => {
    const name = freshName();
    setEnv(name, "first");
    expect(requireEnv(name)).toBe("first");

    // Mutating the live env after the value is cached has no effect.
    process.env[name] = "second";
    expect(requireEnv(name)).toBe("first");
  });

  it("does not cache a failed lookup", () => {
    const name = freshName();
    expect(() => requireEnv(name)).toThrow();

    // A value set after the failed lookup should now resolve.
    setEnv(name, "recovered");
    expect(requireEnv(name)).toBe("recovered");
  });
});

describe("optionalEnv", () => {
  let name: string;
  beforeEach(() => {
    name = freshName();
  });

  it("returns undefined when the variable is missing", () => {
    expect(optionalEnv(name)).toBeUndefined();
  });

  it("returns undefined when the variable is an empty string", () => {
    setEnv(name, "");
    expect(optionalEnv(name)).toBeUndefined();
  });

  it("returns the value when set", () => {
    setEnv(name, "present");
    expect(optionalEnv(name)).toBe("present");
  });
});
