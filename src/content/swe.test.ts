import { describe, expect, it } from "vitest";

import { about, archive, conceptProjects, experience, experienceIntro, projects } from "./swe";

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

describe("projects", () => {
  it("features the three active ventures", () => {
    expect(projects.map((p) => p.name)).toEqual([
      "JHParking",
      "MatAI",
      "CoachMe",
    ]);
  });

  it("labels every project with a status and an invitation", () => {
    for (const project of projects) {
      expect(project.status.trim()).not.toBe("");
      expect(project.helpWanted.trim()).not.toBe("");
    }
  });

  it("keeps the earlier concepts too", () => {
    expect(conceptProjects.map((p) => p.name)).toEqual([
      "PageKeeper",
      "MBA-Engineered",
      "Connect.",
    ]);
  });
});

describe("archive", () => {
  it("groups earlier work into the three CV categories", () => {
    expect(archive.map((g) => g.group)).toEqual([
      "Marketplaces & Products",
      "Web & Full-Stack",
      "Automation & Data",
    ]);
  });

  it("gives every archived project a description and a stack", () => {
    const items = archive.flatMap((g) => g.items);
    expect(items.length).toBe(12);
    for (const item of items) {
      expect(item.description.trim()).not.toBe("");
      expect(item.stack.trim()).not.toBe("");
    }
  });
});
