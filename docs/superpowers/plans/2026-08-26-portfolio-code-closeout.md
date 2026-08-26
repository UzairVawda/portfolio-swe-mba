# Portfolio Code Closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the uncommitted MBA-flattening work, close the mobile navigation gap that currently leaves the site unnavigable below 640px, verify the whole branch, and push it for review.

**Architecture:** Four sequential tasks on the existing `feat/overture-score-redesign` branch. Task 1 lands work that is already written but ungated. Task 2 is the only new feature — a disclosure menu built on the existing `Sheet` primitive, driven by the same `navLinks()` function the desktop nav uses, so the two navs can never disagree. Tasks 3 and 4 are verification and handoff.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `@base-ui/react` (Sheet/Dialog), Vitest + happy-dom (unit), Playwright (e2e), lucide-react (icons).

**Spec:** None. This plan has no upstream spec document — its authority is `TODO.md`, `LAUNCH.md`, the existing 343-test unit suite, and the in-flight Task 18 working tree. **Rulings made during execution are provisional** and must be surfaced to the human partner at finish.

## Global Constraints

- **Branch:** all work happens on `feat/overture-score-redesign`. Never commit to `main`. Never `git push --force`.
- **Working directory:** `/Users/uzairvawda/Documents/Claude/Portfolio/uzairvawda-portfolio`.
- **Route manifest is law:** no file may hardcode an internal path. Every internal URL comes from `routes` in `src/lib/routes.ts`. This is enforced by an existing test (`site-nav.test.tsx` → "points every link at a route from the manifest, never a literal").
- **Full gate before every commit:** `npm run lint && npm run typecheck && npm test`. E2E (`npm run test:e2e`) is required for Tasks 1, 2, and 3.
- **E2E port:** Playwright uses port 3100 and runs `npm run build && npx next start -p 3100`. If the port is occupied, free it (`lsof -ti:3100 | xargs kill`) rather than changing the config.
- **Typecheck cache:** if `npm run typecheck` reports errors referencing deleted routes under `/mba`, delete `.next/types` and re-run. This is a known stale-cache false positive, not a real failure.
- **Test idiom:** unit tests use `renderToStaticMarkup` from `react-dom/server` parsed into a happy-dom element via a local `parse()` helper. There is no `@testing-library/react` in this project — do not add it. Interactive behavior is tested in Playwright, not Vitest.
- **Testid convention:** desktop nav links use `nav-<name>`; the mobile menu uses `mobile-nav-<name>`. Testids are the e2e locator strategy — never locate by prose.
- **Commit style:** Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`), lowercase, imperative. Match the existing log.
- **No new dependencies.** Everything needed is already installed.
- **Do not touch content copy.** `src/content/swe.ts` prose is the human partner's to write. Structural changes only, and only where a task says so.

---

### Task 1: Land the MBA-flattening work (close out Task 18)

The working tree holds a finished but ungated change: the `/mba` route tree is deleted and its URLs are served by 308 redirects from a table in `src/lib/routes.ts`. Unit tests pass (343/343). The e2e suite was interrupted mid-run in a previous session and has never been confirmed green against this tree. Confirm it, then commit.

**Files:**
- Modify (already modified in the working tree, do not revert): `e2e/contact-form.spec.ts`, `e2e/routes.spec.ts`, `next.config.ts`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/components/contact-form.tsx`, `src/components/site-shell.tsx`, `src/lib/routes.ts`, `src/lib/routes.test.ts`
- Deleted (already deleted, keep deleted): `src/app/mba/**`, `src/components/mba-empty-state.tsx`, `src/components/mba-page-header.tsx`, `src/content/mba.ts`
- Untracked, must be committed: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a clean working tree at a known commit. `legacyRedirects` in `src/lib/routes.ts` is the 5-entry redirect table consumed by `next.config.ts`. `routes.tools` = `/tools`, `routes.speaking` = `/speaking`, `routes.work` = `/#work`, `routes.about` = `/#about`, `routes.contact` = `/#contact`.

- [ ] **Step 1: Confirm the tree is what this task expects**

```bash
git status --short
git branch --show-current
```

Expected: branch is `feat/overture-score-redesign`. 18 modified/deleted entries plus `?? src/app/sitemap.test.ts`. If the tree is already clean, this task is done — report DONE immediately and do not re-do it.

- [ ] **Step 2: Run the static gate**

```bash
npm run lint && npm run typecheck && npm test
```

Expected: lint passes (one pre-existing auto-generated warning is acceptable), typecheck passes, 343 tests across 27 files pass. If typecheck fails referencing `/mba` routes, run `rm -rf .next/types` and re-run.

- [ ] **Step 3: Run the e2e suite — the gate that has never been confirmed**

```bash
npm run test:e2e 2>&1 | tail -40
```

Expected: all specs pass across `contact-form`, `opengraph`, `overture`, `reveal`, `routes`, `track`, `work-index`. This step builds the app first, so allow several minutes.

- [ ] **Step 4: If e2e fails, fix the spec or the source — do not delete the assertion**

Report the failure verbatim in your report file before fixing. The most likely failures and their correct fixes:
- A spec still navigating to a deleted `/mba/*` page → point it at the new route from `routes`, not at a literal string.
- A redirect assertion expecting 301 → the table declares `permanent: true`, which Next.js serves as **308**. The assertion should expect 308.
- A locator matching removed prose → replace with the `data-testid` the component already carries.

If a failure reveals that the source is wrong rather than the test, fix the source. Never weaken an assertion to make it pass.

- [ ] **Step 5: Re-run the full gate after any fix**

```bash
npm run lint && npm run typecheck && npm test && npm run test:e2e 2>&1 | tail -20
```

Expected: everything green. If you made no fix in Step 4, skip this step.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: retire the /mba tree behind permanent redirects

Deletes the six-page /mba route tree and its two presentational
components, folding that work into the flat single-page nav. The five
retired URLs are served by 308 redirects declared in one table in
src/lib/routes.ts and consumed by next.config.ts, so link equity and
request method both survive the move.

Sitemap rewritten against the flat route set and covered by a new
sitemap.test.ts. Contact form now posts source \"portfolio\" and is
located in e2e by testid rather than prose."
```

- [ ] **Step 7: Verify the commit landed and the tree is clean**

```bash
git status --short
git log --oneline -1
```

Expected: empty status output, and the new commit at HEAD.

---

### Task 2: Mobile navigation menu

Below the `sm` breakpoint (640px) every nav link carries `hidden ... sm:inline-flex`, so a phone visitor sees only the wordmark, the Résumé link, and the theme toggle — the site has no navigation at all. Add a disclosure menu that renders the same links, from the same source, below that breakpoint.

**Files:**
- Create: `src/components/mobile-nav.tsx`
- Create: `src/components/mobile-nav.test.tsx`
- Create: `e2e/mobile-nav.spec.ts`
- Modify: `src/components/site-nav.tsx` (render `<MobileNav />`; the `navLinks()` function and the desktop `<Link>` list are unchanged)

**Interfaces:**
- Consumes: `navLinks(counts: { tools: number; speaking: number }): NavLink[]` and the `NavLink` type (`{ href: string; label: string; testId: string }`) from `@/components/site-nav`. `routes` and `RESUME_DOWNLOAD_NAME` from `@/lib/routes`. The `Sheet` family from `@/components/ui/sheet`.
- Produces: `MobileNav({ links }: { links: NavLink[] })`, a client component. Mobile link testids are `mobile-nav-work`, `mobile-nav-tools`, `mobile-nav-speaking`, `mobile-nav-about`, `mobile-nav-contact`. The trigger's testid is `mobile-nav-trigger`.

**Design decisions already made — implement these, do not re-litigate:**
- The menu takes `links` as a prop rather than calling `navLinks()` itself. `SiteNav` computes the list once and hands the same array to both navs, which is what makes it structurally impossible for desktop and mobile to show different links.
- Résumé and the theme toggle stay outside the menu, visible at every width. Résumé is a primary CTA and the toggle is a persistent control; burying either behind a tap is a regression.
- `@base-ui/react` composes via a `render` prop, **not** Radix's `asChild`. `<SheetTrigger render={<button />}>` is correct; `<SheetTrigger asChild>` is not.
- Sheet content is portaled and does not exist in the DOM while closed. Therefore the unit test asserts only the trigger; link presence and navigation are asserted in Playwright. Do not try to assert sheet contents from `renderToStaticMarkup`.

- [ ] **Step 1: Write the failing unit test**

Create `src/components/mobile-nav.test.tsx`:

```tsx
// The desktop nav hides every link below sm. This component is the reason
// that is survivable: it renders a trigger at exactly the widths where the
// desktop links disappear. The sheet's contents are portaled and absent from
// the DOM while closed, so what is assertable here is the trigger and the
// breakpoint it answers to — the links themselves are covered in
// e2e/mobile-nav.spec.ts, where a real viewport exists.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MobileNav } from "@/components/mobile-nav";
import { navLinks } from "@/components/site-nav";

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

const links = navLinks({ tools: 2, speaking: 2 });

describe("MobileNav", () => {
  const dom = parse(renderToStaticMarkup(<MobileNav links={links} />));
  const trigger = dom.querySelector("[data-testid='mobile-nav-trigger']");

  it("renders a trigger", () => {
    expect(trigger).not.toBeNull();
  });

  it("hides the trigger at exactly the width the desktop links appear", () => {
    // sm:hidden is the mirror of the desktop links' sm:inline-flex. If these
    // two ever disagree there is a width with two navs or a width with none.
    expect(trigger?.className).toContain("sm:hidden");
  });

  it("gives the trigger an accessible name", () => {
    const labelled =
      trigger?.getAttribute("aria-label") ??
      trigger?.querySelector(".sr-only")?.textContent;
    expect(labelled).toBe("Open menu");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/mobile-nav.test.tsx
```

Expected: FAIL — cannot resolve `@/components/mobile-nav`.

- [ ] **Step 3: Write the component**

Create `src/components/mobile-nav.tsx`:

```tsx
"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { NavLink } from "@/components/site-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The links arrive as a prop rather than being computed here, so the desktop
// list and this one are the same array. A mobile nav that derives its own
// links is a mobile nav that drifts.
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        data-testid="mobile-nav-trigger"
        aria-label="Open menu"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-3/4 max-w-xs">
        <SheetHeader>
          <SheetTitle className="font-mono text-sm">./uzair</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4 pb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`mobile-${link.testId}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base text-foreground transition-colors hover:text-signal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Run the unit test to verify it passes**

```bash
npx vitest run src/components/mobile-nav.test.tsx
```

Expected: PASS, 3/3.

- [ ] **Step 5: Wire it into SiteNav**

In `src/components/site-nav.tsx`, add the import at the top with the other component imports:

```tsx
import { MobileNav } from "@/components/mobile-nav";
```

Then, inside the `<div className="flex items-center gap-4 sm:gap-6">`, add `<MobileNav links={links} />` as the **last** child, after `<ThemeToggleWithHint />`. Leave the desktop `{links.map(...)}` block, the Résumé link, and the theme toggle exactly as they are.

- [ ] **Step 6: Run the full unit suite — the existing nav tests must still pass**

```bash
npm test
```

Expected: 346 tests pass (343 existing + 3 new).

Two known risks in this step, both in `site-nav.test.tsx`, which renders `<SiteNav />` through `renderToStaticMarkup` at module scope:

1. **Testid collision.** The test "renders exactly the links the manifest says are shown" filters `[data-testid^='nav-']` and excludes only `nav-resume`. Mobile testids are prefixed `mobile-nav-`, which does **not** match `nav-`, so it stays green. If it fails because mobile links were counted, the testid prefix is wrong — fix the prefix, not the test.

2. **Server-render of the Sheet.** `SiteNav` now contains a `"use client"` child holding a `@base-ui/react` Dialog. `useState` renders fine under `renderToStaticMarkup`, and the Popup lives in a Portal that does not render while closed — so this is expected to work. But if `site-nav.test.tsx` throws on render (a `document`/`window` reference from the primitive), **do not delete the assertion and do not mock the Sheet away**. Instead, extract the trigger markup so it is renderable: keep `MobileNav` as the stateful wrapper, and if needed give `SheetTrigger` a plain `render={<button />}` so no browser API is touched during SSR. Report what you hit before choosing a fix.

- [ ] **Step 7: Write the e2e spec**

Create `e2e/mobile-nav.spec.ts`:

```ts
// The regression this file exists for: every desktop nav link is
// `hidden sm:inline-flex`, so at phone widths the site once had no
// navigation at all. These tests fail if that state ever returns.

import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("offers a way to navigate at phone width", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("mobile-nav-trigger")).toBeVisible();
    await expect(page.getByTestId("nav-work")).toBeHidden();
  });

  test("opens the menu and reveals every nav link", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("mobile-nav-trigger").click();

    await expect(page.getByTestId("mobile-nav-work")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-about")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-contact")).toBeVisible();
  });

  test("navigates and closes when a link is tapped", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("mobile-nav-trigger").click();
    await page.getByTestId("mobile-nav-about").click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.getByTestId("mobile-nav-about")).toBeHidden();
  });

  test("keeps the resume and theme toggle reachable without opening the menu", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("nav-resume")).toBeVisible();
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows the links inline and hides the mobile trigger", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("nav-work")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-trigger")).toBeHidden();
  });
});
```

- [ ] **Step 8: Run the e2e spec**

```bash
npx playwright test e2e/mobile-nav.spec.ts 2>&1 | tail -30
```

Expected: 5 passed.

- [ ] **Step 9: Mutation-test the breakpoint gate**

Prove the tests actually catch the regression. In `src/components/mobile-nav.tsx`, change the trigger's `sm:hidden` to `hidden` (making the trigger never visible), then run:

```bash
npx playwright test e2e/mobile-nav.spec.ts 2>&1 | tail -20
```

Expected: FAIL on "offers a way to navigate at phone width". **Revert the mutation** and confirm the suite is green again:

```bash
npx playwright test e2e/mobile-nav.spec.ts 2>&1 | tail -10
```

Record both the failure and the recovery in your report file. If the mutated code still passed, the test is not testing what it claims — fix the test before continuing.

- [ ] **Step 10: Run the full gate**

```bash
npm run lint && npm run typecheck && npm test && npm run test:e2e 2>&1 | tail -20
```

Expected: all green.

- [ ] **Step 11: Commit**

```bash
git add src/components/mobile-nav.tsx src/components/mobile-nav.test.tsx src/components/site-nav.tsx e2e/mobile-nav.spec.ts
git commit -m "feat: add the mobile navigation menu

Below sm every nav link was hidden, leaving phone visitors the wordmark,
the resume link and the theme toggle and no way to reach any section.
The menu is a Sheet driven by the same navLinks() array the desktop nav
renders, passed in as a prop so the two lists cannot drift apart.

Resume and the theme toggle stay outside the menu at every width. E2E
covers both viewports and the mutation that hides the trigger."
```

---

### Task 3: Whole-branch verification wave

Everything is committed; this task proves the branch is sound before it leaves the machine. This task writes no source code. If a check fails, fix it, re-run the full gate, and commit the fix separately.

**Files:**
- Modify: only whatever a failing check turns up. Expected outcome is no source changes.

**Interfaces:**
- Consumes: the committed state from Tasks 1 and 2.
- Produces: a verification record in the report file.

- [ ] **Step 1: Production build gate**

```bash
npm run lint && npm run typecheck && npm test && npm run build 2>&1 | tail -30
```

Expected: all green; the build prints the route table. Confirm no `/mba/*` route appears in it, and that `/`, `/tools`, `/speaking` do.

- [ ] **Step 2: Verify all five legacy redirects over HTTP**

```bash
lsof -ti:3100 | xargs kill 2>/dev/null
npx next start -p 3100 & SERVER_PID=$!
sleep 8
for p in /mba /mba/about /mba/tools /mba/speaking /mba/journal; do
  printf "%-16s -> " "$p"
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "http://localhost:3100$p"
done
kill $SERVER_PID
```

Expected, exactly:

```
/mba             -> 308 http://localhost:3100/
/mba/about       -> 308 http://localhost:3100/#about
/mba/tools       -> 308 http://localhost:3100/tools
/mba/speaking    -> 308 http://localhost:3100/speaking
/mba/journal     -> 308 http://localhost:3100/
```

Any 200, 301, or 404 is a failure. Record the actual table in your report file.

- [ ] **Step 3: Dead palette grep**

The site was repainted from an indigo palette to the pine palette defined in `src/app/globals.css` (`--signal: #1b6b4a`). Confirm no stale color survives:

```bash
grep -rnE "indigo|#4f46e5|#6366f1" src || echo "CLEAN"
```

Expected: the only hits are in `src/app/og/og-images.test.tsx` and `src/app/og/card.test.tsx`, where the words appear in a test name and a comment describing the palette the tests guard against. Those are correct and must stay. Any hit in a non-test file is a real finding — fix it.

- [ ] **Step 4: Confirm no orphaned MBA references**

```bash
grep -rn "/mba" src e2e
```

Expected: hits **only** in `src/lib/routes.ts` (the `legacyRedirects` table), `src/lib/routes.test.ts`, `src/app/sitemap.ts`, `src/app/sitemap.test.ts`, `src/components/site-nav.test.tsx`, `src/components/sections/track.test.tsx`, and `e2e/routes.spec.ts`. These are the redirect machinery and the tests that guard it. A hit anywhere else — especially a `<Link href="/mba...">` — is a real finding.

- [ ] **Step 5: Full e2e suite**

```bash
npm run test:e2e 2>&1 | tail -30
```

Expected: every spec passes, including the 5 new mobile-nav tests.

- [ ] **Step 6: Record the verification in the report file**

Write each command from Steps 1-5, its actual output, and PASS/FAIL. Do not summarize as "all checks passed" — paste the redirect table and the grep results verbatim. If every check passed and you changed nothing, make no commit and say so.

---

### Task 4: Push and hand off

**Files:** none.

**Interfaces:**
- Consumes: the verified branch from Task 3.
- Produces: `feat/overture-score-redesign` pushed to `origin`.

> **STOP — this task pushes to a shared remote.** Per subagent-driven-development, a push to a shared branch is one of the four things that stop execution. The controller must confirm with the human partner before this task runs. Do not dispatch it automatically.

- [ ] **Step 1: Show exactly what will be pushed**

```bash
git log --oneline origin/feat/overture-score-redesign..HEAD
git diff --stat origin/feat/overture-score-redesign..HEAD
```

Expected: the 7 pre-existing commits plus the commits from Tasks 1 and 2.

- [ ] **Step 2: Push**

```bash
git push origin feat/overture-score-redesign
```

Never use `--force`.

- [ ] **Step 3: Confirm**

```bash
git status -sb
```

Expected: no ahead/behind markers.

---

## Out of scope — human-gated, tracked in TODO.md and LAUNCH.md

These are deliberately excluded. No subagent should touch them.

**Content (`TODO.md`)** — the writing is the human partner's. Work history for 5 roles, the third About paragraph on the consulting-MBA pivot, real Off-screen blurbs and photos, the JHParking URL (`https://jhparking.app` is a guess), the Baruch focus line, section headings.

**Launch (`LAUNCH.md`)** — account-holder only. Supabase migration `0001_contact_submissions.sql`, `RATE_LIMIT_SECRET` on Vercel, `public/resume.pdf` (the nav Résumé link 404s until it exists), DNS cutover to Vercel, the 20-item QA pass, self-hosted Umami.

**Note:** `TODO.md` still has a "Phase 3 — MBA section content" section describing `src/content/mba.ts`, which Task 1 deletes. That section is stale after this plan lands. Flag it to the human partner at finish rather than editing their tracking doc unasked.
