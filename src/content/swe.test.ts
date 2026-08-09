import { describe, expect, it } from "vitest";

import { about, experience, experienceIntro } from "./swe";

// Figures the site must never carry — employer-internal financials.
const FORBIDDEN = [/\$\s?25\s?K/i, /\$\s?66\s?K/i];

function allCopy(): string {
  return [
    ...about.paragraphs,
    experienceIntro,
    ...experience.flatMap((role) => [
      role.description ?? "",
      role.title,
      ...role.highlights,
    ]),
  ].join("\n");
}

describe("swe content", () => {
  it("carries no employer dollar figures", () => {
    const copy = allCopy();
    for (const pattern of FORBIDDEN) {
      expect(copy).not.toMatch(pattern);
    }
  });

  it("describes tenure as five-plus years, never six", () => {
    expect(allCopy()).not.toMatch(/six years/i);
  });

  it("lists every role with a company and a title", () => {
    expect(experience.length).toBeGreaterThan(0);
    for (const role of experience) {
      expect(role.company.trim()).not.toBe("");
      expect(role.title.trim()).not.toBe("");
    }
  });
});

describe("experience", () => {
  it("covers every employer from the CV", () => {
    const companies = experience.map((role) => role.company);
    expect(companies).toContain("Collins Aerospace");
    expect(companies).toContain("J.P. Morgan Chase & Co.");
    expect(companies).toContain("Dechert LLP");
    expect(companies).toContain("MIST");
  });

  it("gives every role at least two highlights", () => {
    for (const role of experience) {
      expect(role.highlights.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("marks the Drexel co-op placements", () => {
    const coops = experience.filter((role) => role.note === "Drexel co-op");
    expect(coops).toHaveLength(2);
  });
});
