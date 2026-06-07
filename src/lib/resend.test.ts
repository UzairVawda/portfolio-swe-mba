import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const ResendCtor = vi.fn(function (this: Record<string, unknown>, key: string) {
  this.apiKey = key;
});
vi.mock("resend", () => ({ Resend: ResendCtor }));

const original = process.env.RESEND_API_KEY;

beforeEach(() => {
  ResendCtor.mockClear();
  vi.resetModules();
  process.env.RESEND_API_KEY = "re_test_key";
});

afterEach(() => {
  if (original === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = original;
});

describe("getResend", () => {
  it("constructs the client with the configured API key", async () => {
    const { getResend } = await import("./resend");
    getResend();
    expect(ResendCtor).toHaveBeenCalledWith("re_test_key");
  });

  it("memoizes a single instance across calls", async () => {
    const { getResend } = await import("./resend");
    const first = getResend();
    const second = getResend();
    expect(first).toBe(second);
    expect(ResendCtor).toHaveBeenCalledTimes(1);
  });

  it("throws when RESEND_API_KEY is missing", async () => {
    vi.resetModules();
    delete process.env.RESEND_API_KEY;
    const { getResend } = await import("./resend");
    expect(() => getResend()).toThrowError(/RESEND_API_KEY/);
  });
});
