import { createHmac } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// rate-limit.ts is marked "server-only"; stub the guard so it imports here.
vi.mock("server-only", () => ({}));

import { getClientIp, hashIp } from "./rate-limit";

describe("getClientIp", () => {
  const make = (headers: Record<string, string>) => new Headers(headers);

  it("uses the first entry of x-forwarded-for", () => {
    expect(
      getClientIp(make({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12" })),
    ).toBe("1.2.3.4");
  });

  it("trims whitespace around the forwarded ip", () => {
    expect(
      getClientIp(make({ "x-forwarded-for": "  1.2.3.4  , 5.6.7.8" })),
    ).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    expect(getClientIp(make({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("falls back to x-real-ip when x-forwarded-for is blank", () => {
    expect(
      getClientIp(make({ "x-forwarded-for": "   ", "x-real-ip": "9.9.9.9" })),
    ).toBe("9.9.9.9");
  });

  it("returns the sentinel 0.0.0.0 when no ip headers are present", () => {
    expect(getClientIp(make({}))).toBe("0.0.0.0");
  });

  it("preserves an IPv6 address", () => {
    expect(getClientIp(make({ "x-forwarded-for": "::1" }))).toBe("::1");
  });

  it("prefers x-forwarded-for over x-real-ip when both exist", () => {
    expect(
      getClientIp(
        make({ "x-forwarded-for": "1.1.1.1", "x-real-ip": "2.2.2.2" }),
      ),
    ).toBe("1.1.1.1");
  });
});

describe("hashIp", () => {
  const SECRET = "test-rate-limit-secret";
  const original = process.env.RATE_LIMIT_SECRET;

  beforeAll(() => {
    process.env.RATE_LIMIT_SECRET = SECRET;
  });
  afterAll(() => {
    if (original === undefined) delete process.env.RATE_LIMIT_SECRET;
    else process.env.RATE_LIMIT_SECRET = original;
  });

  it("matches an independently computed HMAC-SHA256", () => {
    const expected = createHmac("sha256", SECRET)
      .update("1.2.3.4")
      .digest("hex");
    expect(hashIp("1.2.3.4")).toBe(expected);
  });

  it("is deterministic for the same input", () => {
    expect(hashIp("8.8.8.8")).toBe(hashIp("8.8.8.8"));
  });

  it("produces different hashes for different ips", () => {
    expect(hashIp("1.1.1.1")).not.toBe(hashIp("2.2.2.2"));
  });

  it("returns a 64-character lowercase hex digest", () => {
    expect(hashIp("203.0.113.5")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("does not leak the raw ip into the hash", () => {
    expect(hashIp("203.0.113.5")).not.toContain("203.0.113.5");
  });
});

describe("hashIp — secret dependence & failure", () => {
  it("throws when RATE_LIMIT_SECRET is unset", async () => {
    vi.resetModules();
    const original = process.env.RATE_LIMIT_SECRET;
    delete process.env.RATE_LIMIT_SECRET;
    const { hashIp: freshHash } = await import("./rate-limit");
    expect(() => freshHash("1.2.3.4")).toThrowError(/RATE_LIMIT_SECRET/);
    if (original !== undefined) process.env.RATE_LIMIT_SECRET = original;
  });

  it("produces a different hash under a different secret", async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_SECRET = "secret-one";
    const a = (await import("./rate-limit")).hashIp("1.2.3.4");

    vi.resetModules();
    process.env.RATE_LIMIT_SECRET = "secret-two";
    const b = (await import("./rate-limit")).hashIp("1.2.3.4");

    expect(a).not.toBe(b);
  });
});
