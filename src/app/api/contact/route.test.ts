import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ---- Mock the server-only dependency layer. The real validation schema is
// kept intact so the route is exercised against genuine parsing rules. ----

vi.mock("@/lib/env", () => ({
  requireEnv: vi.fn((name: string) => {
    const values: Record<string, string> = {
      RESEND_FROM_EMAIL: "hello@uzairvawda.me",
      CONTACT_TO_EMAIL: "me@uzairvawda.me",
    };
    return values[name] ?? `env:${name}`;
  }),
  optionalEnv: vi.fn(() => undefined),
}));

const hashIp = vi.fn<(ip: string) => string>(() => "hashed-ip");
const getClientIp = vi.fn<(headers: Headers) => string>(() => "1.2.3.4");
vi.mock("@/lib/rate-limit", () => ({
  hashIp: (ip: string) => hashIp(ip),
  getClientIp: (headers: Headers) => getClientIp(headers),
}));

const getServiceSupabase = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  getServiceSupabase: () => getServiceSupabase(),
}));

const sendEmail = vi.fn<
  (payload: Record<string, unknown>) => Promise<unknown>
>(async () => ({ data: { id: "email-1" }, error: null }));
const getResend = vi.fn(() => ({ emails: { send: sendEmail } }));
vi.mock("@/lib/resend", () => ({
  getResend: () => getResend(),
}));

import { POST } from "./route";

// ---- Helpers ----

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  name: "Test User",
  email: "test@example.com",
  message: "Hello there, this is a genuine message.",
  source: "mba" as const,
};

interface SupabaseResults {
  select?: { data: unknown; error: unknown };
  insert?: { error: unknown };
}

const insertSpy = vi.fn<(payload: Record<string, unknown>) => void>(() => {});

function mockSupabase({ select, insert }: SupabaseResults = {}) {
  const selectResult = select ?? { data: [], error: null };
  const insertResult = insert ?? { error: null };

  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    gte: vi.fn(() => chain),
    limit: vi.fn(async () => selectResult),
  };

  const insertFn = vi.fn(async (payload: Record<string, unknown>) => {
    insertSpy(payload);
    return insertResult;
  });

  getServiceSupabase.mockReturnValue({
    from: vi.fn(() => ({ ...chain, insert: insertFn })),
  });

  return { insertFn };
}

async function readJson(res: Response) {
  return (await res.json()) as Record<string, unknown>;
}

beforeEach(() => {
  vi.clearAllMocks();
  hashIp.mockReturnValue("hashed-ip");
  getClientIp.mockReturnValue("1.2.3.4");
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  getResend.mockReturnValue({ emails: { send: sendEmail } });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/contact — request validation", () => {
  it("returns 400 for malformed JSON", async () => {
    const res = await POST(makeRequest("{ not valid json"));
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ error: "Invalid JSON" });
  });

  it("returns 400 with issues for a schema violation", async () => {
    mockSupabase();
    const res = await POST(makeRequest({ ...validBody, email: "nope" }));
    expect(res.status).toBe(400);
    const json = await readJson(res);
    expect(json.error).toBe("Validation failed");
    expect(json.issues).toBeDefined();
  });

  it("does not touch the database when validation fails", async () => {
    const { insertFn } = mockSupabase();
    await POST(makeRequest({ ...validBody, name: "" }));
    expect(insertFn).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — misconfiguration", () => {
  it("returns a structured 500 when hashIp throws (missing secret)", async () => {
    mockSupabase();
    hashIp.mockImplementationOnce(() => {
      throw new Error("Missing required environment variable: RATE_LIMIT_SECRET");
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    expect((await readJson(res)).error).toMatch(/misconfigured/i);
  });

  it("returns a structured 500 when the supabase client cannot be built", async () => {
    getServiceSupabase.mockImplementationOnce(() => {
      throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    expect((await readJson(res)).error).toMatch(/misconfigured/i);
  });
});

describe("POST /api/contact — rate limiting", () => {
  it("returns 500 when the rate-limit query errors", async () => {
    mockSupabase({ select: { data: null, error: { message: "db down" } } });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    expect((await readJson(res)).error).toBe("Could not process request");
  });

  it("returns 429 when a recent submission from the same ip exists", async () => {
    mockSupabase({ select: { data: [{ id: "prev" }], error: null } });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    const json = await readJson(res);
    expect(json.error).toBe("Too many submissions");
    expect(json.message).toMatch(/last minute/i);
  });

  it("does not insert when rate limited", async () => {
    const { insertFn } = mockSupabase({
      select: { data: [{ id: "prev" }], error: null },
    });
    await POST(makeRequest(validBody));
    expect(insertFn).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — persistence", () => {
  it("returns 500 when the insert fails", async () => {
    mockSupabase({ insert: { error: { message: "constraint" } } });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    expect((await readJson(res)).error).toBe("Could not save message");
  });

  it("stores the submission with the hashed ip and parsed fields", async () => {
    mockSupabase();
    await POST(
      makeRequest(
        {
          ...validBody,
          role: "Recruiter",
          reason: "Hiring",
        },
        { "user-agent": "VitestAgent/1.0" },
      ),
    );
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test User",
        email: "test@example.com",
        message: "Hello there, this is a genuine message.",
        role: "Recruiter",
        reason: "Hiring",
        source: "mba",
        ip_hash: "hashed-ip",
        user_agent: "VitestAgent/1.0",
      }),
    );
  });

  it("stores null (not empty string) for omitted optional fields", async () => {
    mockSupabase();
    await POST(makeRequest(validBody));
    const payload = insertSpy.mock.calls.at(-1)![0] as Record<string, unknown>;
    expect(payload.role).toBeNull();
    expect(payload.reason).toBeNull();
  });

  it("stores a null user agent when the header is absent", async () => {
    mockSupabase();
    await POST(makeRequest(validBody));
    const payload = insertSpy.mock.calls.at(-1)![0] as Record<string, unknown>;
    expect(payload.user_agent).toBeNull();
  });

  it("truncates an oversized user-agent header to 500 chars", async () => {
    mockSupabase();
    await POST(
      makeRequest(validBody, { "user-agent": "U".repeat(900) }),
    );
    const payload = insertSpy.mock.calls.at(-1)![0] as Record<string, unknown>;
    expect((payload.user_agent as string).length).toBe(500);
  });
});

describe("POST /api/contact — success & email dispatch", () => {
  it("returns 200 ok on the happy path", async () => {
    mockSupabase();
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual({ ok: true });
  });

  it("sends both the admin notification and the visitor auto-reply", async () => {
    mockSupabase();
    await POST(makeRequest(validBody));
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("addresses the admin notification correctly with a reply-to of the sender", async () => {
    mockSupabase();
    await POST(makeRequest(validBody));
    const notification = sendEmail.mock.calls[0][0] as Record<string, unknown>;
    expect(notification.to).toBe("me@uzairvawda.me");
    expect(notification.replyTo).toBe("test@example.com");
    expect(notification.subject).toBe("[mba] New message from Test User");
  });

  it("auto-replies to the sender using only their first name", async () => {
    mockSupabase();
    await POST(makeRequest(validBody));
    const autoReply = sendEmail.mock.calls[1][0] as Record<string, unknown>;
    expect(autoReply.to).toBe("test@example.com");
    expect(autoReply.replyTo).toBe("me@uzairvawda.me");
    expect(autoReply.subject).toBe("Thanks for reaching out, Test");
    expect(autoReply.html).toContain("Hi Test,");
    expect(autoReply.text).toContain("Hi Test,");
  });

  it("handles a single-word name in the auto-reply greeting", async () => {
    mockSupabase();
    await POST(makeRequest({ ...validBody, name: "Madonna" }));
    const autoReply = sendEmail.mock.calls[1][0] as Record<string, unknown>;
    expect(autoReply.subject).toBe("Thanks for reaching out, Madonna");
  });

  it("includes role and reason lines in the admin notification body", async () => {
    mockSupabase();
    await POST(
      makeRequest({ ...validBody, role: "Recruiter", reason: "Hiring" }),
    );
    const notification = sendEmail.mock.calls[0][0] as Record<string, unknown>;
    expect(notification.text).toContain("Role:    Recruiter");
    expect(notification.text).toContain("Reason:  Hiring");
  });

  it("omits the role/reason lines when they were not provided", async () => {
    mockSupabase();
    await POST(makeRequest(validBody));
    const notification = sendEmail.mock.calls[0][0] as Record<string, unknown>;
    expect(notification.text).not.toContain("Role:");
    expect(notification.text).not.toContain("Reason:");
  });
});

describe("POST /api/contact — email failures never fail the request", () => {
  it("still returns 200 when the resend client cannot be constructed", async () => {
    mockSupabase();
    getResend.mockImplementationOnce(() => {
      throw new Error("Missing required environment variable: RESEND_API_KEY");
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual({ ok: true });
  });

  it("still returns 200 when one email rejects, and logs it", async () => {
    mockSupabase();
    sendEmail
      .mockResolvedValueOnce({ data: { id: "ok" }, error: null })
      .mockRejectedValueOnce(new Error("resend 5xx"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    // The row was already saved, so the request succeeds regardless.
    expect(insertSpy).toHaveBeenCalled();
  });

  it("still returns 200 when both emails reject", async () => {
    mockSupabase();
    sendEmail.mockRejectedValue(new Error("resend down"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
  });
});
