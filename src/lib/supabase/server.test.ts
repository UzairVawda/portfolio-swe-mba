import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const createClient = vi.fn<
  (url: string, key: string, options?: unknown) => { __client: boolean }
>(() => ({ __client: true }));
vi.mock("@supabase/supabase-js", () => ({ createClient }));

const KEY = "service-role-key-123";

/**
 * Loads getServiceSupabase with a fresh module graph so requireEnv's cache
 * starts empty, sets the given URL, invokes it, and returns the args that
 * createClient was called with.
 */
async function callWithUrl(
  url: string,
  key: string = KEY,
): Promise<{ url: string; key: string; options: unknown }> {
  vi.resetModules();
  createClient.mockClear();
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = key;
  const { getServiceSupabase } = await import("./server");
  getServiceSupabase();
  const call = createClient.mock.calls.at(-1)!;
  return { url: call[0] as string, key: call[1] as string, options: call[2] };
}

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

beforeEach(() => {
  createClient.mockClear();
});

afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
});

describe("getServiceSupabase — URL sanitization", () => {
  it("passes a clean URL through unchanged", async () => {
    const { url } = await callWithUrl("https://abc.supabase.co");
    expect(url).toBe("https://abc.supabase.co");
  });

  it("strips a single trailing slash (the PGRST125 root cause)", async () => {
    const { url } = await callWithUrl("https://abc.supabase.co/");
    expect(url).toBe("https://abc.supabase.co");
  });

  it("strips multiple trailing slashes", async () => {
    const { url } = await callWithUrl("https://abc.supabase.co///");
    expect(url).toBe("https://abc.supabase.co");
  });

  it("trims surrounding whitespace", async () => {
    const { url } = await callWithUrl("   https://abc.supabase.co   ");
    expect(url).toBe("https://abc.supabase.co");
  });

  it("trims whitespace and strips a trailing slash together", async () => {
    const { url } = await callWithUrl("  https://abc.supabase.co/  ");
    expect(url).toBe("https://abc.supabase.co");
  });

  it("does not strip slashes inside the path", async () => {
    const { url } = await callWithUrl("https://abc.supabase.co/custom/base");
    expect(url).toBe("https://abc.supabase.co/custom/base");
  });
});

describe("getServiceSupabase — key & options", () => {
  it("trims whitespace from the service role key", async () => {
    const { key } = await callWithUrl(
      "https://abc.supabase.co",
      "  service-role-key-123  ",
    );
    expect(key).toBe("service-role-key-123");
  });

  it("disables session persistence and auto refresh", async () => {
    const { options } = await callWithUrl("https://abc.supabase.co");
    expect(options).toEqual({
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it("returns whatever createClient returns", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abc.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = KEY;
    const { getServiceSupabase } = await import("./server");
    expect(getServiceSupabase()).toEqual({ __client: true });
  });
});

describe("getServiceSupabase — misconfiguration", () => {
  it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = KEY;
    const { getServiceSupabase } = await import("./server");
    expect(() => getServiceSupabase()).toThrowError(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("throws when SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abc.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { getServiceSupabase } = await import("./server");
    expect(() => getServiceSupabase()).toThrowError(
      /SUPABASE_SERVICE_ROLE_KEY/,
    );
  });
});
