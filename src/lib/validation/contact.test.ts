import { describe, expect, it } from "vitest";

import { contactSchema } from "./contact";

const baseInput = {
  name: "Uzair",
  email: "uzair@example.com",
  message: "Hi there.",
  source: "mba" as const,
};

describe("contactSchema", () => {
  it("accepts the minimum required fields", () => {
    const result = contactSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

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

  it("rejects a missing name", () => {
    const result = contactSchema.safeParse({ ...baseInput, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing message", () => {
    const result = contactSchema.safeParse({ ...baseInput, message: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects messages over 5000 characters", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      message: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional role and reason", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      role: "Recruiter",
      reason: "Reaching out about an opportunity",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown source", () => {
    const result = contactSchema.safeParse({
      ...baseInput,
      source: "twitter",
    });
    expect(result.success).toBe(false);
  });
});
