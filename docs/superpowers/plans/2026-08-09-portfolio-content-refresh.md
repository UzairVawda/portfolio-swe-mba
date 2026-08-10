# Portfolio Content Refresh & CV Attachment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's placeholder copy with real content from the master CV, attach the current CV PDF in four places, and add Archive, status-badged Projects, and a portfolio-side contact section.

**Architecture:** All copy stays in `src/content/swe.ts` and `src/content/mba.ts` as exported typed data. Section components are presentational and read from those files. Three new sections are added; section eyebrow numbers are reassigned inside the task that owns each component. No API, schema, or database changes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Base UI accordion, motion, Vitest, Playwright.

## Global Constraints

- **Never invent biographical detail.** Every personal claim must trace to `/Users/uzairvawda/Documents/Uzair-Vawda-CV-MASTER.md`. Copy in this plan is CV-derived and safe to ship. Task 12 enriches it with author-supplied origin stories.
- **No employer dollar figures.** The `~$25K` retired-tooling and `$66K` licensing savings from the master CV are excluded site-wide. Non-dollar metrics (50+ components, 5+ projects, ~80%, 18%, 75+ apps, 6 servers, 6 projects) are used.
- **Tenure is "Five-plus years"** across aerospace, finance, and legal tech — matching the master CV. The current site says "Six years" in two places; both are corrected.
- **No copy hardcoded in components.** Prose lives in `src/content/*.ts`.
- Existing files are ASCII-quoted with `&apos;` in JSX where apostrophes appear in literal text; content-file strings use normal apostrophes.
- Run `npm run lint && npm run typecheck && npm run test` before every commit.

---

## File Structure

**Create:**
- `src/components/sections/archive.tsx` — collapsed accordion of earlier projects
- `src/components/sections/contact.tsx` — portfolio-side invitation + contact form
- `src/content/swe.test.ts` — content invariants (guards against placeholder regressions)

**Modify:**
- `src/content/swe.ts` — full rewrite, types extended
- `src/content/mba.ts` — bio and empty-state copy
- `src/components/contact-form.tsx` — `source` prop
- `src/components/hero/hero.tsx` — CV button
- `src/components/site-nav.tsx` — CV link, both variants
- `src/components/site-footer.tsx` — CV link, both variants
- `src/components/sections/about.tsx` — inline CV link
- `src/components/sections/experience.tsx` — render highlights + note
- `src/components/sections/projects.tsx` — status badge, help-wanted, concept grid
- `src/components/sections/skills.tsx` — renumber to `05`
- `src/components/sections/education.tsx` — renumber to `06`
- `src/components/sections/interests.tsx` — fifth icon, renumber to `07`
- `src/app/(swe)/page.tsx` — section order, new sections, metadata
- `e2e/routes.spec.ts` — CV link assertion
- `e2e/contact-form.spec.ts` — portfolio-form case
- `public/resume.pdf` — replaced

---

### Task 1: Attach the CV and link it in four places

**Files:**
- Replace: `public/resume.pdf` (source: `/Users/uzairvawda/Documents/Uzair-Vawda-CV.pdf`)
- Modify: `src/components/hero/hero.tsx`
- Modify: `src/components/site-nav.tsx`
- Modify: `src/components/site-footer.tsx`
- Test: `e2e/routes.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the path `/resume.pdf` served from `public/`, linked with `download="Uzair-Vawda-CV.pdf"`. Later tasks reuse this exact href and download attribute.

- [ ] **Step 1: Write the failing test**

Append inside the `test.describe("route smoke tests", ...)` block in `e2e/routes.spec.ts`:

```ts
  test("CV is served and linked from the SWE page", async ({ page }) => {
    const pdf = await page.goto("/resume.pdf");
    expect(pdf?.ok()).toBe(true);
    expect(pdf?.headers()["content-type"]).toMatch(/pdf/);

    await page.goto("/");
    const links = page.locator('a[href="/resume.pdf"]');
    // Hero button, nav link, footer link.
    await expect(links).toHaveCount(3);
    await expect(links.first()).toHaveAttribute("download", "Uzair-Vawda-CV.pdf");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- routes.spec.ts`
Expected: FAIL — `toHaveCount(3)` receives `0`.

- [ ] **Step 3: Replace the PDF**

```bash
cp /Users/uzairvawda/Documents/Uzair-Vawda-CV.pdf public/resume.pdf
```

- [ ] **Step 4: Add the hero button**

In `src/components/hero/hero.tsx`, replace the `<Link href="/mba">` block inside the `FadeUp delay={0.4}` wrapper so the row reads three buttons — keep `See work` exactly as-is, then:

```tsx
            <Link
              href="/resume.pdf"
              download="Uzair-Vawda-CV.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Resume
              <span aria-hidden>↓</span>
            </Link>
            <Link
              href="/mba"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              MBA section
              <span aria-hidden>→</span>
            </Link>
```

- [ ] **Step 5: Add the nav link**

In `src/components/site-nav.tsx`, inside the `<div className="flex items-center gap-2 sm:gap-6">`, add this as the first child — before the `{isMba ? (...) : (...)}` expression — so it renders on both variants:

```tsx
          <Link
            href="/resume.pdf"
            download="Uzair-Vawda-CV.pdf"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Resume
          </Link>
```

- [ ] **Step 6: Add the footer link**

In `src/components/site-footer.tsx`, add as the first child of the `<div className="flex items-center gap-6">`:

```tsx
          <Link
            href="/resume.pdf"
            download="Uzair-Vawda-CV.pdf"
            className="transition-colors hover:text-foreground"
          >
            Resume
          </Link>
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run test:e2e -- routes.spec.ts`
Expected: PASS. Note the nav link is `hidden sm:inline-flex`; Playwright's default viewport is 1280×720 so it is visible and counted.

- [ ] **Step 8: Lint, typecheck, unit tests**

Run: `npm run lint && npm run typecheck && npm run test`
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add public/resume.pdf src/components/hero/hero.tsx src/components/site-nav.tsx src/components/site-footer.tsx e2e/routes.spec.ts
git commit -m "feat(cv): attach current CV and link from hero, nav, and footer"
```

---

### Task 2: Content invariants test harness

**Files:**
- Create: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: current exports of `src/content/swe.ts` (`about`, `experience`, `projects`, `skills`, `education`, `certifications`, `interests`).
- Produces: a regression guard every later content task runs. Later tasks extend this file rather than replacing it.

This task exists so the content rewrites that follow have a failing-test cycle to drive them. It asserts rules, not prose, so copy edits do not churn the tests.

- [ ] **Step 1: Write the test**

Create `src/content/swe.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { about, experience } from "./swe";

// Figures the site must never carry — employer-internal financials.
const FORBIDDEN = [/\$\s?25\s?K/i, /\$\s?66\s?K/i];

function allCopy(): string {
  return [
    ...about.paragraphs,
    ...experience.flatMap((role) => [role.description ?? "", role.title]),
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
```

- [ ] **Step 2: Run the test**

Run: `npm run test -- swe.test.ts`
Expected: PASS against current content (it already contains no dollar figures and no "six years" string inside `swe.ts`). This is the baseline guard.

- [ ] **Step 3: Commit**

```bash
git add src/content/swe.test.ts
git commit -m "test(content): guard against employer figures and stale tenure claims"
```

---

### Task 3: Experience — full work history with highlights

**Files:**
- Modify: `src/content/swe.ts` (the `Role` type and `experience` array)
- Modify: `src/components/sections/experience.tsx`
- Test: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: `Role` from Task 2's baseline.
- Produces: `type Role = { company, title, start, end, description, highlights: string[], note?: string }` and a six-entry `experience` array. `ExperienceSection` renders `highlights` as a bulleted list and `note` as a small muted tag.

- [ ] **Step 1: Write the failing test**

Add to `src/content/swe.test.ts`, and update the import line to `import { about, experience } from "./swe";` (unchanged):

```ts
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
```

Also extend `allCopy()` to include highlights so the forbidden-figure guard covers them:

```ts
function allCopy(): string {
  return [
    ...about.paragraphs,
    ...experience.flatMap((role) => [
      role.description,
      role.title,
      ...role.highlights,
    ]),
  ].join("\n");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- swe.test.ts`
Expected: FAIL — `role.highlights` is undefined; `companies` lacks `MIST`.

- [ ] **Step 3: Update the type and data**

In `src/content/swe.ts`, replace the `Role` type and `experience` array with:

```ts
export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  description: string;
  highlights: string[];
  note?: string;
};

export const experience: Role[] = [
  {
    company: "Collins Aerospace",
    title: "Software Engineer",
    start: "Nov 2022",
    end: "Present",
    description:
      "Design systems, AI tooling, and platform work for aerospace engineering teams.",
    highlights: [
      "Built and shipped an internal React and TypeScript design system — 50+ accessible, themeable components on Figma's Simple Design System, published to the internal npm registry with Storybook, a live component dashboard, and a documented release pipeline. Open to every developer in the org and adopted by 5+ projects.",
      "Built Poolside, an in-house AI agent that learns the design system's patterns and generates components on demand — cutting component creation time by up to 80% and retiring the paid tooling we had been leaning on. Five custom, project-specific components have shipped through it, and it is rolling out to new teams.",
      "Built Skyler, an Angular configuration interface for a radar sensor platform: live telemetry visualizations — array tilt, azimuth compass, pitch and roll attitude indicators, MapLibre GL mapping — plus full scan-mission management across STARE, PPI, RHI, and raster patterns.",
      "Led a platform-wide TypeScript migration and the move to modern CSS with Tailwind, improving maintainability and developer experience.",
      "Owned end-to-end platform work — performance, testing infrastructure, observability, and CI/CD — alongside React and GraphQL application development.",
    ],
  },
  {
    company: "Collins Aerospace",
    title: "Infrastructure Project Manager · Leadership Development Program",
    start: "Mar 2022",
    end: "Oct 2022",
    description:
      "Ran infrastructure delivery across business units during the second rotation.",
    highlights: [
      "Managed a portfolio of 6 infrastructure projects across lifecycle stages, delivering 2 to completion while balancing competing stakeholders.",
      "Introduced Scrum practices that lifted team velocity and cross-functional collaboration.",
      "Standardized company-wide PM artifacts — project charter, RACI matrix — that were adopted well beyond my own team.",
    ],
  },
  {
    company: "Collins Aerospace",
    title: "Applications Licensing Specialist · Leadership Development Program",
    start: "Jul 2021",
    end: "Feb 2022",
    description:
      "Owned enterprise application licensing during the first rotation.",
    highlights: [
      "Drove a software license rationalization that cut license count 18% year over year.",
      "Consolidated 75+ applications across 6 servers, reducing redundancy and improving accessibility.",
      "Built a React and Python license-tracking tool giving stakeholders real-time visibility into server status.",
    ],
  },
  {
    company: "J.P. Morgan Chase & Co.",
    title: "Front-End Experience Developer",
    start: "Apr 2020",
    end: "Oct 2020",
    description:
      "Shared front-end components for the firm's public-facing experiences.",
    note: "Drexel co-op",
    highlights: [
      "Built reusable JavaScript and HTML5 components deployed across multiple sites, establishing shared front-end patterns.",
      "Delivered responsive, maintainable code against stakeholder requirements, using BitBucket and SonarQube for version control and code quality.",
    ],
  },
  {
    company: "Dechert LLP",
    title: "IT Applications Developer",
    start: "Apr 2019",
    end: "Oct 2019",
    description: "Reporting automation and analytics for internal legal teams.",
    note: "Drexel co-op",
    highlights: [
      "Automated reporting and ETL workflows in SQL and Python for internal clients.",
      "Built Tableau dashboards surfacing application usage, performance, and adoption patterns.",
    ],
  },
  {
    company: "MIST",
    title: "Finance Coordinator · Muslim Interscholastic Tournament",
    start: "2017",
    end: "2021",
    description:
      "Budget ownership and live event production across four tournament cycles.",
    highlights: [
      "Owned the tournament budget across four cycles, managing spend against sponsorship revenue and growing the budget 5–20% year over year.",
      "Secured and managed corporate sponsors including PwC — owning outreach, deliverables, and the relationship.",
      "Ran live interscholastic competitions end to end: run-of-show, speaker and judge coordination, venue and vendor management, volunteer staffing, and day-of execution across concurrent tracks.",
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- swe.test.ts`
Expected: PASS.

- [ ] **Step 5: Render highlights and the note**

In `src/components/sections/experience.tsx`, change the heading text and the role body. Replace the `<h2>` line with:

```tsx
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            Five-plus years across aerospace, finance, and legal tech.
          </h2>
```

Then replace the `<p className="max-w-2xl ...">{role.description}</p>` line with:

```tsx
                <p className="max-w-2xl text-pretty text-base text-muted-foreground">
                  {role.description}
                </p>
                {role.note ? (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {role.note}
                  </span>
                ) : null}
                <ul className="mt-2 flex max-w-2xl flex-col gap-2.5 text-left">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative pl-5 text-pretty text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-primary/60"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
```

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`, open <http://localhost:3000>, scroll to Experience.
Expected: six roles, each with bullets; JPM and Dechert show a "Drexel co-op" tag; heading reads "Five-plus years".

- [ ] **Step 7: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 8: Commit**

```bash
git add src/content/swe.ts src/content/swe.test.ts src/components/sections/experience.tsx
git commit -m "feat(experience): full work history with highlights and co-op labels"
```

---

### Task 4: Projects — status badges, reasoning, and concept grid

**Files:**
- Modify: `src/content/swe.ts` (`Project` type, `projects`, new `conceptProjects`)
- Modify: `src/components/sections/projects.tsx`
- Test: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: nothing from Task 3.
- Produces:
  - `type Project = { name, role, period, status, description, stack: string[], helpWanted: string, links: {label,href}[] }`
  - `type ConceptProject = { name, status, description, stack: string[] }`
  - `export const projects: Project[]` (3 entries) and `export const conceptProjects: ConceptProject[]` (3 entries)

- [ ] **Step 1: Write the failing test**

Add to `src/content/swe.test.ts`, extending the import to `import { about, conceptProjects, experience, projects } from "./swe";`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- swe.test.ts`
Expected: FAIL — `conceptProjects` is not exported.

- [ ] **Step 3: Update the types and data**

In `src/content/swe.ts`, replace the `Project` type and `projects` array with:

```ts
export type Project = {
  name: string;
  role: string;
  period: string;
  status: string;
  description: string;
  stack: string[];
  helpWanted: string;
  links: { label: string; href: string }[];
};

export type ConceptProject = {
  name: string;
  status: string;
  description: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "JHParking",
    role: "Founder · Full-Stack",
    period: "Jun 2025 — Present",
    status: "Piloting · 7 beta users",
    description:
      "A peer-to-peer parking marketplace. People with a driveway or an empty spot list it; drivers book and pay by the hour. React and Tailwind on the front, Firestore running the live booking layer, Stripe handling payments. It is deliberately scoped as a focused local solution rather than an everywhere-app, and it is in the hands of seven beta users right now. This is the second run at the idea — the first was ParkForLess, which I shelved and came back to because I still thought it was right.",
    stack: ["React", "TailwindCSS", "Stripe", "Firestore"],
    helpWanted:
      "I would happily talk to anyone who has built a two-sided marketplace — especially about cold-starting the supply side.",
    links: [{ label: "Site", href: "https://jhparking.app" }],
  },
  {
    name: "MatAI",
    role: "Founder · Product & Engineering",
    period: "Jul 2026 — Present",
    status: "In development",
    description:
      "An AI system that watches jiu jitsu footage and hands back a timestamped map of the match: what position you were in and when, where submissions were attempted, and what to work on. The hard part is that conventional tracking falls apart here — in grappling two athletes overlap almost completely and trackers permanently swap their identities. So instead of tracking two bodies, it classifies the position they are in together. Closed guard describes a relationship, not a person. Roles bind to athletes through appearance descriptors captured once, up front, and scramble and unclear are first-class labels so the model can decline to guess rather than confabulate.",
    stack: ["Python", "FastAPI", "ffmpeg", "Claude API", "SQLite"],
    helpWanted:
      "I would love to hear from anyone working on video understanding or evaluation design — and from anyone willing to let me test against their footage.",
    links: [],
  },
  {
    name: "CoachMe",
    role: "Founder · Product & Technical Design",
    period: "In development",
    status: "Design stage · 5 coaches committed",
    description:
      "A marketplace where competitive jiu jitsu athletes buy video review from vetted high-level coaches, with feedback anchored to the footage itself — notes pinned to exact timestamps, voiceover recorded against the timeline, drawings on paused frames. The money layer runs on Stripe Connect using separate charges and transfers rather than destination charges, specifically so funds can sit in escrow between purchase and acceptance; destination charges settle immediately and leave nothing to hold, which would make the delivery guarantee unenforceable. Five coaches are committed. No athletes yet — that is the next problem.",
    stack: ["Next.js", "Expo", "Postgres", "Stripe Connect", "Mux", "Inngest"],
    helpWanted:
      "Looking for athletes to test with, and for anyone who has run trust-and-safety or dispute flows on a marketplace.",
    links: [],
  },
];

export const conceptProjects: ConceptProject[] = [
  {
    name: "PageKeeper",
    status: "Concept · full PRD",
    description:
      "A reading-habit app — streaks, goals, gentle friend accountability, a reading journal. Specced end to end, including the security and compliance architecture and an intentionally un-manipulative monetization model.",
    stack: ["React Native", "Firebase"],
  },
  {
    name: "MBA-Engineered",
    status: "Ongoing",
    description:
      "One small consulting tool per MBA class — an IT maturity assessment, a market-sizing dashboard, a Porter's Five Forces analyzer, an Ask My MBA retrieval app. The premise is that advising on a deliverable and building it should not be different people.",
    stack: ["Next.js", "RAG"],
  },
  {
    name: "Connect.",
    status: "Concept · prototype",
    description:
      "An all-in-one platform pairing companies with influencers to optimize reach. Early product and business framing, built as a Vue prototype.",
    stack: ["Vue"],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- swe.test.ts`
Expected: PASS.

- [ ] **Step 5: Render badges, invitation, and concept grid**

In `src/components/sections/projects.tsx`, update the import:

```tsx
import { conceptProjects, projects } from "@/content/swe";
```

Change the eyebrow from `04 · Projects` to `03 · Projects` and the `<h2>` to:

```tsx
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            Everything I&apos;m building, at whatever stage it&apos;s at.
          </h2>
```

Inside the card, add the status badge directly after the `<p className="font-mono text-xs uppercase ...">{project.role} · {project.period}</p>` line:

```tsx
                  <span className="mt-1 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {project.status}
                  </span>
```

Then, after the existing `<ul>` of stack tags and still inside the `StaggerItem`, add:

```tsx
              <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground/90">
                <span className="font-medium text-foreground">
                  Want in?{" "}
                </span>
                {project.helpWanted}
              </p>
```

Finally, after the closing `</Stagger>` of the main project list and before the closing `</div>`, add the concept grid:

```tsx
        <div className="flex flex-col gap-6">
          <FadeUp>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Earlier concepts
            </p>
          </FadeUp>
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {conceptProjects.map((project) => (
              <StaggerItem
                key={project.name}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium tracking-tight">
                    {project.name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {project.status}
                  </p>
                </div>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
```

Note: the outer wrapper is `<div className="flex flex-col gap-12">`, so this new block becomes its third child and inherits the section spacing.

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`, open <http://localhost:3000/#projects>.
Expected: three full cards with status pills and a "Want in?" line; a three-up concept grid beneath. Only JHParking shows an external link.

- [ ] **Step 7: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 8: Commit**

```bash
git add src/content/swe.ts src/content/swe.test.ts src/components/sections/projects.tsx
git commit -m "feat(projects): all ventures with honest status and an open invitation"
```

---

### Task 5: Archive section

**Files:**
- Create: `src/components/sections/archive.tsx`
- Modify: `src/content/swe.ts` (add `archive`)
- Test: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from `@/components/ui/accordion`.
- Produces: `export const archive: ArchiveGroup[]` where
  `type ArchiveGroup = { group: string; items: { name: string; description: string; stack: string }[] }`,
  and `export function ArchiveSection()` rendering eyebrow `04 · Archive`.

- [ ] **Step 1: Write the failing test**

Add to `src/content/swe.test.ts`, extending the import with `archive`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- swe.test.ts`
Expected: FAIL — `archive` is not exported.

- [ ] **Step 3: Add the archive data**

Append to `src/content/swe.ts`:

```ts
export type ArchiveGroup = {
  group: string;
  items: { name: string; description: string; stack: string }[];
};

export const archive: ArchiveGroup[] = [
  {
    group: "Marketplaces & Products",
    items: [
      {
        name: "ParkForLess",
        description:
          "The first run at peer-to-peer parking, and the direct precursor to JHParking.",
        stack: "React · Firebase · Leaflet",
      },
      {
        name: "718SNKRS",
        description:
          "A sneaker storefront with real auth, sessions, and checkout.",
        stack: "Express · MongoDB · Stripe",
      },
      {
        name: "Reddit Clone",
        description:
          "A full Reddit-style app — posts, votes, communities, the whole thing.",
        stack: "Next.js · TypeScript · Chakra UI · Firebase · Recoil",
      },
    ],
  },
  {
    group: "Web & Full-Stack",
    items: [
      {
        name: "DragonFeed",
        description: "A campus events and news aggregator for Drexel.",
        stack: "Academic project",
      },
      {
        name: "Curriculum App",
        description: "A course and curriculum planning tool, built for INFO 420.",
        stack: "Vue · Node",
      },
      {
        name: "Project Tracker",
        description: "Project tracking with live updates and a clean board view.",
        stack: "Vue · Firebase · Vuetify",
      },
      {
        name: "ExpressBlog",
        description: "A blogging platform with authentication and drafts.",
        stack: "Express · MongoDB · EJS",
      },
      {
        name: "ChatApp",
        description: "Real-time chat over sockets.",
        stack: "MERN",
      },
      {
        name: "Dynamic Site / Hosting",
        description: "A server-rendered dynamic site, deployed and self-hosted.",
        stack: "Express · EJS · MongoDB",
      },
      {
        name: "Web Portfolio",
        description: "Earlier versions of this site.",
        stack: "uzairvawda.me",
      },
    ],
  },
  {
    group: "Automation & Data",
    items: [
      {
        name: "Send a Script",
        description:
          "Python automation that delivers movie scripts over iMessage, Messenger, and WhatsApp.",
        stack: "Python",
      },
      {
        name: "Investment Tracker",
        description:
          "Trade history, monthly rollups, and metrics over my own investing data.",
        stack: "Python · Visualization",
      },
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- swe.test.ts`
Expected: PASS.

- [ ] **Step 5: Create the section component**

Create `src/components/sections/archive.tsx`:

```tsx
import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { archive } from "@/content/swe";

export function ArchiveSection() {
  return (
    <Section id="archive" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            04 · Archive
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            Everything before that.
          </h2>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground">
            Coursework, prototypes, and things I built to find out whether I
            could. Most of them taught me something that showed up later.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Accordion className="rounded-3xl border border-border bg-card px-6 py-2 md:px-8">
            {archive.map((group) => (
              <AccordionItem key={group.group} value={group.group}>
                <AccordionTrigger className="py-5 text-base font-medium">
                  {group.group}
                  <span className="ml-3 font-mono text-xs font-normal text-muted-foreground">
                    {group.items.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="flex flex-col gap-5">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex flex-col gap-1 border-l-2 border-border pl-4"
                      >
                        <h3 className="text-sm font-medium tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground/70">
                          {item.stack}
                        </p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Wire it into the page temporarily to verify**

In `src/app/(swe)/page.tsx`, add `import { ArchiveSection } from "@/components/sections/archive";` and place `<ArchiveSection />` directly after `<ProjectsSection />`. (Task 9 sets the final order; this is the same position, so it stays.)

- [ ] **Step 7: Verify in the browser**

Run: `npm run dev`, open <http://localhost:3000/#archive>.
Expected: three collapsed rows with counts 3, 7, and 2; each expands smoothly and lists its projects.

- [ ] **Step 8: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 9: Commit**

```bash
git add src/content/swe.ts src/content/swe.test.ts src/components/sections/archive.tsx "src/app/(swe)/page.tsx"
git commit -m "feat(archive): collapsed accordion of earlier projects"
```

---

### Task 6: Skills rebuilt around positioning

**Files:**
- Modify: `src/content/swe.ts` (`skills`)
- Modify: `src/components/sections/skills.tsx`
- Test: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `skills` keyed by the four CV groups. `SkillsSection` already iterates `Object.entries(skills)` and needs no structural change beyond the eyebrow number and heading.

- [ ] **Step 1: Write the failing test**

Add to `src/content/swe.test.ts`, extending the import with `skills`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- swe.test.ts`
Expected: FAIL — keys are `Languages`, `Frameworks`, `Tools`, `Databases`.

- [ ] **Step 3: Replace the skills data**

In `src/content/swe.ts`, replace the `skills` export with:

```ts
export const skills: Record<string, string[]> = {
  "Engineering & Platform": [
    "TypeScript",
    "JavaScript",
    "Python",
    "C#",
    "SQL",
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Node",
    "Express",
    "GraphQL",
    "Design systems",
    "PostgreSQL",
    "Firebase",
    "MongoDB",
    "Stripe",
    "CI/CD",
  ],
  "AI & Data": [
    "AI-assisted development",
    "Agentic workflows",
    "LLMs",
    "Vision-language models",
    "Prompt engineering",
    "Evaluation & benchmarking",
    "RAG",
    "Tableau",
    "Data visualization",
  ],
  "Product Management": [
    "Roadmapping",
    "PRD authoring",
    "MVP scoping",
    "User research",
    "Marketplace monetization",
    "Unit economics",
    "Trust & safety",
    "KPIs & A/B testing",
    "Agile / Scrum",
  ],
  "Strategy & Advisory": [
    "Technology & product strategy",
    "Business case development",
    "Cost optimization",
    "Market & competitive analysis",
    "Go-to-market",
    "Change management",
    "Stakeholder management",
  ],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- swe.test.ts`
Expected: PASS.

- [ ] **Step 5: Update the section chrome**

In `src/components/sections/skills.tsx`, change the eyebrow from `03 · Skills` to `05 · Skills` and the `<h2>` to:

```tsx
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            What I bring to the table.
          </h2>
```

- [ ] **Step 6: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 7: Commit**

```bash
git add src/content/swe.ts src/content/swe.test.ts src/components/sections/skills.tsx
git commit -m "feat(skills): regroup by discipline to match positioning"
```

---

### Task 7: Education and certifications

**Files:**
- Modify: `src/content/swe.ts` (`education`, `certifications`)
- Modify: `src/components/sections/education.tsx`
- Test: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `EducationEntry` gains `detail` content (already in the type) — no type change. `certifications` gains the PMP entry.

- [ ] **Step 1: Write the failing test**

Add to `src/content/swe.test.ts`, extending the import with `certifications` and `education`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- swe.test.ts`
Expected: FAIL — MBA `detail` is `"In progress"`; PMP is absent.

- [ ] **Step 3: Update the data**

In `src/content/swe.ts`, replace `education` and `certifications` with:

```ts
export const education: EducationEntry[] = [
  {
    school: "Baruch College · Zicklin School of Business",
    program: "Master of Business Administration",
    detail:
      "Concentrating in Artificial Intelligence & Product Development · expected June 2028",
  },
  {
    school: "Drexel University · College of Computing and Informatics",
    program: "B.S. Software Engineering",
    detail: "3.5 GPA · co-op program · 2021",
  },
];

export const certifications = [
  {
    name: "Project Management Professional (PMP)",
    issuer: "Project Management Institute",
    year: "Expected Dec 2026",
  },
  { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2022" },
  { name: "Certified Scrum Master", issuer: "Scrum Alliance", year: "2022" },
  {
    name: "100 Days of Front-End Development",
    issuer: "Udemy",
    year: "2022",
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- swe.test.ts`
Expected: PASS.

- [ ] **Step 5: Renumber the section**

In `src/components/sections/education.tsx`, change the eyebrow from `05 · Education &amp; Certifications` to `06 · Education &amp; Certifications`.

- [ ] **Step 6: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 7: Commit**

```bash
git add src/content/swe.ts src/content/swe.test.ts src/components/sections/education.tsx
git commit -m "feat(education): MBA concentration, GPA, and PMP in progress"
```

---

### Task 8: About and Off-screen

**Files:**
- Modify: `src/content/swe.ts` (`about`, `Interest` type, `interests`)
- Modify: `src/components/sections/about.tsx`
- Modify: `src/components/sections/interests.tsx`
- Test: `src/content/swe.test.ts`

**Interfaces:**
- Consumes: `/resume.pdf` and `download="Uzair-Vawda-CV.pdf"` from Task 1.
- Produces: `about = { paragraphs: string[]; cvLine: { before: string; label: string; after: string } }` and `Interest["icon"]` extended with `"languages"`.

The `cvLine` shape exists so the inline CV link can sit mid-sentence without putting JSX in the content file.

- [ ] **Step 1: Write the failing test**

Add to `src/content/swe.test.ts`, extending the import with `interests`:

```ts
describe("about and interests", () => {
  it("offers the CV inline", () => {
    expect(about.cvLine.label.trim()).not.toBe("");
  });

  it("keeps all five off-screen cards", () => {
    expect(interests.map((i) => i.icon)).toEqual([
      "swords",
      "camera",
      "coffee",
      "plane",
      "languages",
    ]);
  });
});
```

Update `allCopy()` to keep covering about paragraphs — it already spreads `about.paragraphs`, so no change is needed there.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- swe.test.ts`
Expected: FAIL — `about.cvLine` is undefined.

- [ ] **Step 3: Update the content**

In `src/content/swe.ts`, replace the `about` export and the `Interest` type and `interests` array:

```ts
export const about = {
  paragraphs: [
    "Most of what I build starts with something I kept running into. JHParking is a peer-to-peer parking marketplace — I took a first run at it years ago as ParkForLess, shelved it, and came back because I still thought the idea was right. MatAI and CoachMe both came out of the jiu jitsu gym. The pattern is roughly: notice the friction, sit with it longer than is reasonable, then build the thing.",
    "By day I'm a software engineer at Collins Aerospace. Most of my time there has gone into a design system that a handful of teams now build on, and — more recently — an AI agent that writes components against it. That second part has changed how I work more than anything else in the last few years.",
    "Evenings are an MBA at Baruch's Zicklin School, concentrating in AI and product development. The point isn't to stop engineering. It's to be the person who can write the business case and then go build the thing it argues for.",
  ],
  cvLine: {
    before: "I'm in NYC. If you want the long version, ",
    label: "my CV has it",
    after: " — otherwise, keep scrolling.",
  },
};
```

```ts
export type Interest = {
  label: string;
  blurb: string;
  icon: "swords" | "camera" | "coffee" | "plane" | "languages";
};

export const interests: Interest[] = [
  {
    label: "Jiu jitsu",
    blurb:
      "The mats keep me honest about losing and learning. Two of my three side projects came out of this room, which tells you roughly how much of my head it occupies.",
    icon: "swords",
  },
  {
    label: "Photography",
    blurb:
      "Cameras taught me composition long before code did — what to leave out, mostly.",
    icon: "camera",
  },
  {
    label: "Coffee",
    blurb: "Pour-overs at home, espresso when I'm out, opinions either way.",
    icon: "coffee",
  },
  {
    label: "Traveling",
    blurb:
      "Notes from new cities have a habit of turning into side projects a few months later.",
    icon: "plane",
  },
  {
    label: "Languages",
    blurb:
      "English, Urdu, and Gujarati at home; Spanish well enough to get into trouble and most of the way out.",
    icon: "languages",
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- swe.test.ts`
Expected: PASS.

- [ ] **Step 5: Render the inline CV link**

In `src/components/sections/about.tsx`, add `import Link from "next/link";` at the top, and insert after the closing `</div>` of the paragraph list (still inside the right-hand column `<div className="flex flex-col items-center gap-6 ...">`):

```tsx
          <FadeUp delay={0.35}>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {about.cvLine.before}
              <Link
                href="/resume.pdf"
                download="Uzair-Vawda-CV.pdf"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                {about.cvLine.label}
              </Link>
              {about.cvLine.after}
            </p>
          </FadeUp>
```

Also change the `<h2>` to:

```tsx
            <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              I build things, then figure out what they&apos;re worth.
            </h2>
```

- [ ] **Step 6: Add the languages icon**

In `src/components/sections/interests.tsx`, update the import and map:

```tsx
import { Camera, Coffee, Languages, Plane, Swords } from "lucide-react";
```

```tsx
const iconMap: Record<Interest["icon"], typeof Camera> = {
  swords: Swords,
  camera: Camera,
  coffee: Coffee,
  plane: Plane,
  languages: Languages,
};
```

Change the eyebrow from `06 · Off-screen` to `07 · Off-screen`.

- [ ] **Step 7: Update the e2e CV link count**

Task 1's assertion counted 3 links on `/`. The About section adds a fourth. In `e2e/routes.spec.ts`, change:

```ts
    await expect(links).toHaveCount(4);
```

and add a clarifying comment above it:

```ts
    // Hero button, nav link, About inline link, footer link.
```

- [ ] **Step 8: Verify and run the full suite**

Run: `npm run dev` and check the About and Off-screen sections render, then:
Run: `npm run lint && npm run typecheck && npm run test && npm run test:e2e -- routes.spec.ts`
Expected: all pass; Off-screen shows five cards.

- [ ] **Step 9: Commit**

```bash
git add src/content/swe.ts src/content/swe.test.ts src/components/sections/about.tsx src/components/sections/interests.tsx e2e/routes.spec.ts
git commit -m "feat(about): real bio, inline CV link, and languages card"
```

---

### Task 9: Portfolio-side contact section

**Files:**
- Create: `src/components/sections/contact.tsx`
- Modify: `src/components/contact-form.tsx`
- Modify: `src/content/swe.ts` (add `contact`)
- Test: `e2e/contact-form.spec.ts`

**Interfaces:**
- Consumes: `contactSchema` from `src/lib/validation/contact.ts`, which already accepts `source: "portfolio"`. No schema, API, or database change.
- Produces: `ContactForm` gains an optional prop `{ source?: "portfolio" | "mba" }` defaulting to `"mba"` so the existing `/mba/about` usage is unchanged. `export function ContactSection()` renders eyebrow `08 · Let's talk`.

- [ ] **Step 1: Write the failing test**

Add to `e2e/contact-form.spec.ts` as a new top-level describe block:

```ts
test.describe("portfolio contact form", () => {
  test("renders on the SWE page and submits with the portfolio source", async ({
    page,
  }) => {
    let submitted: Record<string, unknown> = {};

    await page.route("**/api/contact", async (route) => {
      submitted = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.getByLabel("Name *").fill("Test User");
    await page.getByLabel("Email *").fill("test@example.com");
    await page.getByLabel(/^Message/).fill("Interested in MatAI.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(
      page.getByRole("heading", { name: /Thanks — message received\./i }),
    ).toBeVisible();
    expect(submitted.source).toBe("portfolio");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- contact-form.spec.ts`
Expected: FAIL — `#contact` does not exist on `/`.

- [ ] **Step 3: Add the `source` prop to the form**

In `src/components/contact-form.tsx`, change the component signature and default value:

```tsx
export function ContactForm({
  source = "mba",
}: {
  source?: "portfolio" | "mba";
} = {}) {
```

and in the `useForm` call, change the `defaultValues` `source` entry to:

```tsx
      source,
```

- [ ] **Step 4: Add the contact copy**

Append to `src/content/swe.ts`:

```ts
export const contact = {
  headline: "Any of this sound interesting?",
  paragraphs: [
    "Every project up there is open. If you want to write code on one, poke holes in the idea, test an early build, or just talk it through over coffee — I'd genuinely like to hear from you.",
    "Recruiting, collaboration, or a plain hello all land in the same inbox, and I read every message.",
  ],
};
```

- [ ] **Step 5: Create the section**

Create `src/components/sections/contact.tsx`:

```tsx
import { ContactForm } from "@/components/contact-form";
import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import { contact } from "@/content/swe";

export function ContactSection() {
  return (
    <Section id="contact" className="py-24">
      <div className="flex flex-col gap-10">
        <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            08 · Let&apos;s talk
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {contact.headline}
          </h2>
          {contact.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <ContactForm source="portfolio" />
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Mount it on the page**

In `src/app/(swe)/page.tsx`, add `import { ContactSection } from "@/components/sections/contact";` and place `<ContactSection />` after `<InterestsSection />`.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm run test:e2e -- contact-form.spec.ts`
Expected: PASS — both the MBA describe block (unchanged, still submitting `source: "mba"`) and the new portfolio block.

- [ ] **Step 8: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/contact.tsx src/components/contact-form.tsx src/content/swe.ts "src/app/(swe)/page.tsx" e2e/contact-form.spec.ts
git commit -m "feat(contact): open invitation and contact form on the portfolio page"
```

---

### Task 10: Page assembly and metadata

**Files:**
- Modify: `src/app/(swe)/page.tsx`

**Interfaces:**
- Consumes: `ArchiveSection` (Task 5), `ContactSection` (Task 9), and every renumbered section.
- Produces: final section order and corrected page metadata.

- [ ] **Step 1: Set the final section order**

In `src/app/(swe)/page.tsx`, the fragment body becomes exactly:

```tsx
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ArchiveSection />
      <SkillsSection />
      <EducationSection />
      <InterestsSection />
      <ContactSection />
```

followed by the existing `<Section className="py-24">` MBA call-to-action block.

- [ ] **Step 2: Renumber the MBA call-to-action**

In the same file, change `07 · What&apos;s next` to `09 · What&apos;s next`.

- [ ] **Step 3: Correct the metadata**

Replace the `metadata` export:

```tsx
export const metadata: Metadata = {
  title: { absolute: "Uzair Vawda — Engineer, MBA candidate" },
  description:
    "Software engineer and MBA candidate in NYC. Design systems and AI tooling at Collins Aerospace; a parking marketplace and two jiu jitsu products on the side. Five-plus years across aerospace, finance, and legal tech.",
};
```

- [ ] **Step 4: Verify the numbering runs clean**

Run: `npm run dev` and scroll the whole page.
Expected: eyebrows read `01 About`, `02 Experience`, `03 Projects`, `04 Archive`, `05 Skills`, `06 Education & Certifications`, `07 Off-screen`, `08 Let's talk`, `09 What's next` — no gaps, no duplicates.

- [ ] **Step 5: Full suite**

Run: `npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run build`
Expected: all pass, including the particle-canvas console-error check in `routes.spec.ts`, which now scrolls a much longer page.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(swe)/page.tsx"
git commit -m "feat(page): final section order and corrected metadata"
```

---

### Task 11: MBA section copy

**Files:**
- Modify: `src/content/mba.ts`

**Interfaces:**
- Consumes: nothing. Purely a copy change — every consuming component reads the same keys.
- Produces: unchanged export shape (`landing`, `navItems`, `tools`, `journal`, `speaking`, `about`). Only string values change, so `e2e/routes.spec.ts` heading regexes must keep matching.

Headings asserted by `e2e/routes.spec.ts` and `e2e/contact-form.spec.ts` and therefore **must not change**: `/mba` landing headline, `One shippable tool per class.`, `Synthesis, not summary.`, `Talks, workshops, panels.`, `Who I am and how to reach me.`

- [ ] **Step 1: Rewrite the bio and empty states**

In `src/content/mba.ts`, replace the `about.bio` array with:

```ts
  bio: [
    "I'm Uzair — a software engineer at Collins Aerospace, working mostly on design systems and the AI tooling that builds against them, and an MBA candidate at Baruch's Zicklin School concentrating in AI and product development.",
    "This site is split in two. The main portfolio at uzairvawda.me is the engineering work and the things I'm building on the side. This section is the MBA half: a small consulting tool shipped per class, weekly writing on what's actually landing, and whatever workshops and competitions come out of it.",
    "The thing I'm after is the overlap — building AI-era products and being able to argue for them in business terms, rather than handing that part to someone else. If that's the kind of work you do, say hello below.",
  ],
```

Replace the three empty-state bodies:

```ts
// tools.emptyState
    title: "No tools yet.",
    body: "The first one lands at the end of CIS 9000 — IT Strategy. Bookmark this page, or get in touch and I'll send you the launch.",
```

```ts
// journal.emptyState
    title: "No posts yet.",
    body: "Writing starts alongside the first class. Until then the contact form below is the best way to reach me — I read every message.",
```

```ts
// speaking.emptyState
    title: "No events yet.",
    body: "Each one gets written up here after it happens, never before.",
```

Replace the `landing.subhead` and `about.contact.description`:

```ts
// landing
  subhead:
    "Software engineer, MBA candidate. Each class produces something shippable — published here as it ships, not before.",
```

```ts
// about.contact
    description:
      "Recruiting, collaboration, case competitions, or just a hello — all welcome. I read every message.",
```

- [ ] **Step 2: Update the file header comment**

Replace the first line of `src/content/mba.ts`:

```ts
// MBA section copy.
```

Do the same in `src/content/swe.ts` — replace the two-line header with:

```ts
// Single source of truth for the SWE portfolio content.
```

Both files currently carry a "Drafted by Claude — redline anything that doesn't sound like you" note that no longer applies.

- [ ] **Step 3: Verify the asserted headings still match**

Run: `npm run test:e2e -- routes.spec.ts contact-form.spec.ts`
Expected: PASS — all six route headings still resolve.

- [ ] **Step 4: Lint, typecheck, tests**

Run: `npm run lint && npm run typecheck && npm run test`

- [ ] **Step 5: Commit**

```bash
git add src/content/mba.ts src/content/swe.ts
git commit -m "feat(mba): align positioning with the main portfolio"
```

---

### Task 12: Origin-story enrichment (gated on author input)

**Files:**
- Modify: `src/content/swe.ts` (`about.paragraphs`, `projects[].description`, `interests[].blurb`)

**Interfaces:**
- Consumes: author-supplied origin stories. **Do not start this task without them.**
- Produces: no type or structural change — string values only. Every test from Tasks 2–9 must still pass unchanged.

Tasks 1–11 ship copy that is strictly CV-derived and true. This task deepens it with detail only the author can supply. If the stories have not arrived, **skip this task and ship** — the site is complete and honest without it.

Required before starting:
1. What actually prompted JHParking, and why ParkForLess was revived rather than abandoned.
2. The moment that prompted MatAI.
3. How the five CoachMe coaches came about — inbound or outbound.
4. What was broken at Collins before the design system and Poolside existed.
5. Jiu jitsu background — how long, what rank, what keeps them there.

- [ ] **Step 1: Confirm the stories are in hand**

If any of the five is missing, stop and ask. Writing a plausible substitute is a **task failure** — invented personal history reads as authentic and is false, which is strictly worse than the CV-derived copy it would replace.

- [ ] **Step 2: Rewrite `about.paragraphs`**

Keep the three-paragraph shape and the existing `cvLine`. Replace the generalized first paragraph with the specific origin detail. Preserve the closing move of paragraph three.

- [ ] **Step 3: Open each project description with its origin**

For each of `JHParking`, `MatAI`, and `CoachMe`, prepend one or two sentences of origin story, then keep the existing technical reasoning intact — the reasoning is the evidence and must not be cut to make room.

- [ ] **Step 4: Rewrite the jiu jitsu blurb**

Replace the `swords` interest blurb using the real background from item 5.

- [ ] **Step 5: Run the full suite**

Run: `npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run build`
Expected: all pass. The content tests assert structure, not prose, so rewritten copy must not break them. If a test fails, the copy violated a constraint — most likely reintroducing a dollar figure or the phrase "six years".

- [ ] **Step 6: Commit**

```bash
git add src/content/swe.ts
git commit -m "feat(content): origin stories in about, projects, and interests"
```

---

## Verification

Final gate before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Manual pass on `npm run dev`:

- `/` — eyebrow numbers run 01 through 09 with no gaps or duplicates
- `/resume.pdf` downloads as `Uzair-Vawda-CV.pdf` from the hero, nav, About, and footer
- Archive accordion expands and collapses in both light and dark themes
- Contact form submits from `/` and still submits from `/mba/about`
- No horizontal scroll at 375px width
- Particle field still renders and the page scrolls without console errors

## Self-Review Notes

**Spec coverage:** every spec section maps to a task — CV attachment (1), Experience (3), Projects (4), Archive (5), Skills (6), Education (7), About and Off-screen (8), Let's talk (9), page flow (10), MBA (11), outstanding dependency (12). Task 2 adds the test harness the spec's testing section implies.

**Known deviation from the spec:** the spec listed `src/components/sections/education.tsx` as modified for "detail fields." No type change proved necessary — `EducationEntry.detail` already exists, so Task 7 changes data and the eyebrow number only.

**Sequencing note:** Task 1 asserts three `/resume.pdf` links; Task 8 adds the About link and updates that assertion to four. This is deliberate — Task 1 must be independently verifiable before the About section exists.
