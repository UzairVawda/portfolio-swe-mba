import { describe, expect, it } from "vitest";

import * as sweContent from "./swe";
import {
  about,
  aboutIntro,
  archive,
  archiveIntro,
  certifications,
  conceptProjects,
  contact,
  education,
  educationIntro,
  experience,
  experienceIntro,
  interests,
  interestsIntro,
  mbaTeaser,
  projects,
  projectsIntro,
  skills,
  skillsIntro,
} from "./swe";

// Figures the site must never carry — employer-internal financials.
const FORBIDDEN = [/\$\s?25\s?K/i, /\$\s?66\s?K/i];

// Recursively collects every string leaf out of a content value (objects,
// arrays, and nested combinations of both) so the guard tests below see
// every piece of prose in this file without having to hand-list each field.
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
  return out;
}

// Every prose-bearing export in this file, swept in structurally rather than
// hand-listed. `sweContent` is the module namespace object, so walking its
// values covers every current export automatically and — critically — every
// export added in the future too. Type-only exports (Role, Project, etc.)
// vanish at runtime and simply don't appear here, which is fine.
function allCopy(): string {
  return collectStrings([
    Object.values(sweContent),
    // `skills` is a Record<discipline, string[]>, so the group names live
    // as object keys rather than values. collectStrings only walks values,
    // and Object.values(sweContent) above only pulls in `skills`'s own
    // *values*, so the discipline names would otherwise be silently
    // dropped — keep this explicit provision so that coverage survives.
    Object.keys(skills),
  ]).join("\n");
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

  it("numbers every section eyebrow 01 through 09 in page order with no gaps or duplicates", () => {
    // The page renders nine numbered blocks in this order. This has broken
    // once already during this plan, so lock the sequence rather than just
    // the individual strings.
    const eyebrows = [
      aboutIntro.eyebrow,
      experienceIntro.eyebrow,
      projectsIntro.eyebrow,
      archiveIntro.eyebrow,
      skillsIntro.eyebrow,
      educationIntro.eyebrow,
      interestsIntro.eyebrow,
      contact.eyebrow,
      mbaTeaser.eyebrow,
    ];
    const numbers = eyebrows.map((eyebrow) => eyebrow.match(/^(\d{2}) · /)?.[1]);
    expect(numbers).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
    ]);
  });

  it("sweeps in copy the old, narrower scan missed", () => {
    // Guards against a future narrowing of allCopy() back down to only
    // about/experience — these strings are distinctive to archive and
    // projects respectively, which the original helper never read.
    const copy = allCopy();
    expect(copy).toContain("718SNKRS");
    expect(copy).toContain("cold-starting the supply side");
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

describe("skills", () => {
  it("is grouped by discipline, not by technology layer", () => {
    expect(Object.keys(skills)).toEqual([
      "Engineering & Platform",
      "AI & Data",
      "Product Management",
      "Strategy & Advisory",
    ]);
  });

  it("names AI work explicitly", () => {
    expect(skills["AI & Data"]).toContain("AI-assisted development");
  });
});

describe("education", () => {
  it("names the MBA concentration and the expected date", () => {
    const mba = education.find((e) => e.school.includes("Baruch"));
    expect(mba?.detail).toMatch(/Artificial Intelligence & Product Development/);
    expect(mba?.detail).toMatch(/2028/);
  });

  it("includes the PMP in progress", () => {
    expect(certifications.map((c) => c.name)).toContain(
      "Project Management Professional (PMP)",
    );
  });
});

describe("about and interests", () => {
  it("offers the CV inline", () => {
    expect(about.cvLine.label.trim()).not.toBe("");
  });

  it("keeps all four off-screen cards", () => {
    expect(interests.map((i) => i.icon)).toEqual([
      "swords",
      "camera",
      "coffee",
      "plane",
    ]);
  });

  it("gives the about section its eyebrow and heading", () => {
    expect(aboutIntro.eyebrow).toBe("01 · About");
  });

  it("gives the off-screen section its eyebrow and heading", () => {
    expect(interestsIntro.eyebrow).toBe("07 · Off-screen");
  });
});
