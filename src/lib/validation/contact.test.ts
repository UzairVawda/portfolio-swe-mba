import { describe, expect, it } from "vitest";

import { contactSchema } from "./contact";

const baseInput = {
  name: "Uzair",
  email: "uzair@example.com",
  message: "Hi there.",
  source: "mba" as const,
};

describe("contactSchema — happy path", () => {
  it("accepts the minimum required fields", () => {
    const result = contactSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  it("accepts both valid sources", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, source: "portfolio" }).success,
    ).toBe(true);
    expect(
      contactSchema.safeParse({ ...baseInput, source: "mba" }).success,
    ).toBe(true);
  });

  it("accepts optional role and reason", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      role: "Recruiter",
      reason: "Reaching out about an opportunity",
    });
    expect(result.success).toBe(true);
  });

  it("strips unknown keys rather than failing", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      sneaky: "<script>alert(1)</script>",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect("sneaky" in result.data).toBe(false);
    }
  });

  it("preserves potentially-dangerous content verbatim (escaping is a render concern)", () => {
    const payload = '<img src=x onerror=alert(1)> & "quotes"  ';
    const result = contactSchema.safeParse({ ...baseInput, message: payload });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe(payload.trim());
    }
  });
});

describe("contactSchema — whitespace handling", () => {
  it("trims surrounding whitespace on text fields", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      name: "  Uzair  ",
      message: "  hello  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Uzair");
      expect(result.data.message).toBe("hello");
    }
  });

  it("trims the email before validating", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      email: "  uzair@example.com  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("uzair@example.com");
    }
  });

  it("rejects a name that is only whitespace", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, name: "     " }).success,
    ).toBe(false);
  });

  it("rejects a message that is only whitespace", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, message: "   " }).success,
    ).toBe(false);
  });

  it("treats a whitespace-only role as an accepted empty value", () => {
    const result = contactSchema.safeParse({ ...baseInput, role: "   " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("");
    }
  });
});

describe("contactSchema — required fields", () => {
  it("rejects a missing name", () => {
    expect(contactSchema.safeParse({ ...baseInput, name: "" }).success).toBe(
      false,
    );
  });

  it("rejects a missing message", () => {
    expect(contactSchema.safeParse({ ...baseInput, message: "" }).success).toBe(
      false,
    );
  });

  it("rejects when name is entirely absent", () => {
    const { email, message, source } = baseInput;
    expect(contactSchema.safeParse({ email, message, source }).success).toBe(
      false,
    );
  });

  it("rejects when email is entirely absent", () => {
    const { name, message, source } = baseInput;
    expect(contactSchema.safeParse({ name, message, source }).success).toBe(
      false,
    );
  });

  it("rejects when source is entirely absent", () => {
    const { name, email, message } = baseInput;
    expect(contactSchema.safeParse({ name, email, message }).success).toBe(
      false,
    );
  });
});

describe("contactSchema — email validation", () => {
  it.each([
    "not-an-email",
    "missing@tld",
    "@no-local.com",
    "spaces in@email.com",
    "two@@at.com",
    "trailing@dot.",
    "",
  ])("rejects invalid email %j", (email) => {
    expect(contactSchema.safeParse({ ...baseInput, email }).success).toBe(
      false,
    );
  });

  it.each([
    "a@b.co",
    "first.last@sub.domain.com",
    "user+tag@example.com",
    "x_y@example.io",
  ])("accepts valid email %j", (email) => {
    expect(contactSchema.safeParse({ ...baseInput, email }).success).toBe(true);
  });

  it("rejects an email over the 320 character cap", () => {
    const email = `${"a".repeat(320)}@example.com`;
    expect(contactSchema.safeParse({ ...baseInput, email }).success).toBe(
      false,
    );
  });
});

describe("contactSchema — length boundaries", () => {
  it("accepts a name of exactly 200 characters", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, name: "a".repeat(200) }).success,
    ).toBe(true);
  });

  it("rejects a name of 201 characters", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, name: "a".repeat(201) }).success,
    ).toBe(false);
  });

  it("accepts a message of exactly 5000 characters", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, message: "a".repeat(5000) })
        .success,
    ).toBe(true);
  });

  it("rejects a message of 5001 characters", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, message: "a".repeat(5001) })
        .success,
    ).toBe(false);
  });

  it("rejects a role over 200 characters", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, role: "a".repeat(201) }).success,
    ).toBe(false);
  });

  it("rejects a reason over 500 characters", () => {
    expect(
      contactSchema.safeParse({ ...baseInput, reason: "a".repeat(501) })
        .success,
    ).toBe(false);
  });
});

describe("contactSchema — unicode & special content", () => {
  it.each([
    ["emoji", "Uzair 👋🚀"],
    ["accents", "José Müller"],
    ["cjk", "李明 浩"],
    ["rtl", "محمد عبدالله"],
  ])("accepts %s in the name", (_label, name) => {
    expect(contactSchema.safeParse({ ...baseInput, name }).success).toBe(true);
  });

  it("counts characters, not bytes, for the message cap", () => {
    // 5000 multi-byte code points should still pass the 5000 char limit.
    const result = contactSchema.safeParse({
      ...baseInput,
      message: "é".repeat(5000),
    });
    expect(result.success).toBe(true);
  });

  it("accepts newlines and tabs inside the message body", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      message: "line one\nline two\tindented",
    });
    expect(result.success).toBe(true);
  });
});

describe("contactSchema — type coercion is rejected", () => {
  it.each([
    ["number name", { name: 42 }],
    ["boolean message", { message: true }],
    ["null email", { email: null }],
    ["array name", { name: ["a"] }],
    ["object message", { message: { text: "hi" } }],
    ["numeric source", { source: 1 }],
  ])("rejects %s", (_label, override) => {
    expect(contactSchema.safeParse({ ...baseInput, ...override }).success).toBe(
      false,
    );
  });

  it("rejects a non-object payload", () => {
    expect(contactSchema.safeParse("nope").success).toBe(false);
    expect(contactSchema.safeParse(null).success).toBe(false);
    expect(contactSchema.safeParse(undefined).success).toBe(false);
    expect(contactSchema.safeParse([]).success).toBe(false);
  });
});

describe("contactSchema — source enum", () => {
  it.each(["twitter", "linkedin", "MBA", "Portfolio", "", " mba "])(
    "rejects unknown source %j",
    (source) => {
      expect(contactSchema.safeParse({ ...baseInput, source }).success).toBe(
        false,
      );
    },
  );
});
