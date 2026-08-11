# The Overture Score — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the two-site portfolio into one site with a pine palette, a one-shot hero overture, an expanding work index, quiet scroll reveals, and shareable tools/speaking galleries.

**Architecture:** Five sequential stages on one branch. Stage 1 extracts the shared vocabulary (route manifest, section manifest, colour tokens) and rewires tests off copy strings, so every later stage is a small, verifiable diff. Stages 2–4 replace the always-on background canvas with a single unmounting hero sequence and in-flow reveals. Stage 5 moves the MBA content to flat `/tools` and `/speaking` routes with per-item permalinks and OG images, and 308-redirects the old `/mba/*` tree.

**Tech Stack:** Next.js 16.3 (App Router), React 19, Tailwind v4 (`@theme inline` + CSS custom properties), `next-themes`, `motion`, `@react-three/fiber` + `three`, Base UI, Vitest (happy-dom, pure modules only — there is no React Testing Library in this repo and this plan does not add one), Playwright (behaviour tests run against a production build).

**Spec:** `docs/superpowers/specs/2026-08-10-overture-score-redesign-design.md`

---

## Global Constraints

- **Read the bundled docs before writing Next-specific code.** `AGENTS.md`: this is Next 16.3, not the Next in your training data. Relevant files: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`, `.../05-config/01-next-config-js/redirects.md`, `.../04-functions/image-response.md`.
- **Nothing animates behind body copy, anywhere.** No moving layer under text, in any stage. This is why the scrims are deleted rather than tuned.
- **Motion tiers:** (1) the overture — once per session, ~4s, skippable; (2) section reveals — fire once on entry, never loop; (3) micro — row expansion, rule draw. Nothing else moves.
- **`prefers-reduced-motion: reduce`** collapses tier 1 to the resolved document and tier 2 to a ≤150 ms opacity fade. Tier 3 keeps working without transitions.
- **Palette is "Pine, tinted".** Exact values, light: `--ground #EFF3EF`, `--surface #F7FAF7`, `--tint #DEEAE2`, `--ink #0C1310`, `--muted #566159`, `--rule #D6E0D8`, `--rule-strong #B9CCC0`, `--signal #1B6B4A`. Dark: `--ground #0B0F0D`, `--surface #131A16`, `--tint #16241C`, `--ink #EFF3EF`, `--muted #8E9A92`, `--rule #222E28`, `--rule-strong #33443B`, `--signal #4FBF8B`.
- **Accent discipline.** Saturated `--signal` is permitted on eyebrows, links, the primary button, the active row name, section rules, tag borders, quote rules, and overture particles. It is forbidden on body copy, on more than one solid button per screen, on any animated layer behind text, and on full-bleed section backgrounds (large areas use `--tint`).
- **Every foreground/background pair must meet WCAG AA (≥ 4.5:1).** Enforced by a unit test from Task 2 onward, not by inspection.
- **No MDX, and no new runtime dependencies.** The only dependency changes in this plan are removals.
- **Typography:** Satoshi (display/body, `next/font/local`), JetBrains Mono (mono). Newsreader and Inter are removed.
- **Tests:** Vitest for pure modules (`npm test`), Playwright for behaviour (`npm run test:e2e`). e2e locators are `data-testid`, never prose. Gate before every commit: `npm run lint && npm run typecheck && npm test`.
- **Commit per task**, message prefixed `feat:`, `refactor:`, `test:`, or `chore:`.

---

## Deviations from the spec (read before starting)

Four small corrections found while verifying the spec against the code. Each is folded into the task that hits it — no decision is pending.

1. **Route strings are duplicated in eleven places, not seven.** The spec's list misses `src/app/not-found.tsx:48`, `src/components/site-footer.tsx:35`, `src/components/hero/hero.tsx:59`, and `src/app/(swe)/page.tsx:47`. Task 1 covers all of them.
2. **`src/lib/scene/choreography.ts` does not survive.** The spec says the scene logic "just mounts somewhere else," but `choreography.ts` is scroll-driven — it maps page scroll to shape state, and after the fixed canvas is deleted there is no scroll to map. It and its 12 tests are replaced by the time-driven `src/lib/scene/overture.ts` in Task 8. `shapes.ts`, `prng.ts`, and `device.ts` and their tests do survive unchanged.
3. **`--destructive: #e11d48` fails AA on the new ground** (4.19:1 on `#EFF3EF`). Task 3 darkens the light-mode value to `#B3123A` (6.11:1). The dark value `#f43f5e` passes at 5.25:1 and is unchanged.
4. **The eyebrow ladder is fixed by construction, not renumbered by hand.** The spec calls renumbering "a three-file change." Task 5 derives the numbers from an ordered section manifest instead, so every later stage that adds, removes, or merges a section is a one-line change and cannot desynchronise.

---

## File structure

**Created**

| File | Responsibility |
| --- | --- |
| `src/lib/routes.ts` | Every internal URL in one typed object. Sole source for links, sitemap, redirects. |
| `src/lib/routes.test.ts` | Route shape and redirect-table invariants. |
| `src/lib/theme/tokens.ts` | The pine palette as data — the only place the hex values live in TS. |
| `src/lib/theme/contrast.ts` | `relativeLuminance` / `contrastRatio`, pure sRGB maths. |
| `src/lib/theme/contrast.test.ts` | Known-value tests for the maths. |
| `src/lib/theme/tokens.test.ts` | AA regression: every foreground/background pair, with its measured ratio. |
| `src/content/sections.ts` | Ordered section manifest; derives `NN · Label` eyebrows. |
| `src/content/sections.test.ts` | Sequential numbering, no gaps or duplicates. |
| `src/lib/scene/overture.ts` | Time-driven overture choreography (pure). |
| `src/lib/scene/overture.test.ts` | Phase boundaries, clamping, monotonicity. |
| `src/lib/scene/session.ts` | `sessionStorage` gate, safe against throwing storage. |
| `src/lib/scene/session.test.ts` | Gate behaviour incl. the private-mode throw. |
| `src/components/scene/overture-mount.tsx` | `ssr:false` dynamic boundary for the overture canvas. |
| `src/components/scene/overture-scene.tsx` | The canvas + RAF clock + skip/unmount lifecycle. |
| `src/components/scene/overture-cloud.tsx` | Three.js geometry driven by `overtureState`. |
| `src/components/motion/reveal.tsx` | `Reveal` + `UnmaskLines` — tier-2 section reveals; replaces `FadeUp`/`Stagger`. |
| `src/components/sections/work-index.tsx` | The Index: numbered rows that expand in place. |
| `src/components/sections/track.tsx` | MBA track summary block on the home page. |
| `src/content/track.ts` | `TrackItem` type, `tools` and `speaking` collections, section copy. |
| `src/content/track.test.ts` | Slug uniqueness, ISO dates, blurb length. |
| `src/components/track/track-card.tsx` | One gallery card. |
| `src/components/track/track-gallery.tsx` | Gallery grid + honest empty state. |
| `src/components/track/track-detail.tsx` | The card, enlarged — shared by both item routes. |
| `src/app/tools/page.tsx`, `src/app/tools/[slug]/page.tsx` | Tools gallery + item. |
| `src/app/speaking/page.tsx`, `src/app/speaking/[slug]/page.tsx` | Speaking gallery + item. |
| `src/app/tools/[slug]/opengraph-image.tsx`, `src/app/speaking/[slug]/opengraph-image.tsx` | Per-item OG cards. |
| `src/app/og/card.tsx` | Shared OG card renderer on the pine palette. |
| `e2e/overture.spec.ts`, `e2e/track.spec.ts` | Overture lifecycle; gallery + permalink behaviour. |

**Modified**

`src/app/globals.css` (tokens, scrim deletion), `src/app/layout.tsx` (fonts, themeColor), `src/lib/fonts.ts` (drop Newsreader + Inter), `src/components/section.tsx` (drop `scrim`), `src/components/hero/hero.tsx` (resolved document), `src/components/site-nav.tsx` + `src/components/site-footer.tsx` (flat nav), `src/components/sections/*` (testids, reveals, renumbering), `src/content/swe.ts` + `src/content/swe.test.ts` (eyebrows via manifest, work merge), `src/app/(swe)/page.tsx` + `layout.tsx`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`, `next.config.ts` (redirects), `e2e/routes.spec.ts`, `e2e/contact-form.spec.ts`, `package.json`.

**Deleted**

`src/components/scene/particle-field.tsx`, `particle-field-mount.tsx`, `particle-cloud.tsx`, `src/lib/scene/choreography.ts` + `.test.ts`, `src/components/motion/fade-up.tsx`, `stagger.tsx`, `src/components/mba-mobile-nav.tsx`, `src/components/mba-page-header.tsx`, `src/components/mba-empty-state.tsx`, `src/content/mba.ts`, `src/app/mba/**`, `src/components/sections/projects.tsx`, `src/components/sections/archive.tsx`.

---

## Dispatch map

Tasks are sequential by default — later tasks read files earlier ones create. These pairs are safe to dispatch in parallel because they touch disjoint files:

- Task 2 ‖ Task 5 (theme module vs. section manifest)
- Task 8 ‖ Task 9 (overture choreography vs. session gate — Task 10 consumes both)
- Task 15 ‖ Task 16 (item routes vs. OG cards, if Task 14 landed first)

Everything else runs in order. Do not start a stage before the previous stage's tasks are all green.

---

# Stage 1 — Foundation

Unglamorous and deliberately first: it makes every later stage cheap to verify.

---

### Task 1: Route manifest

Eleven files hardcode internal URLs. Extract them before anything moves, so the stage-5 route migration is a one-file edit.

**Files:**
- Create: `src/lib/routes.ts`
- Create: `src/lib/routes.test.ts`
- Modify: `src/app/sitemap.ts`, `src/app/not-found.tsx:48`, `src/app/(swe)/page.tsx:47`, `src/components/site-nav.tsx:15,32,38,44,50,56,65`, `src/components/site-footer.tsx:12,35`, `src/components/hero/hero.tsx:44,51,59`, `src/components/mba-empty-state.tsx:8`, `src/components/mba-mobile-nav.tsx`, `src/content/mba.ts:12-17,64-80`

**Interfaces:**
- Produces: `routes` (frozen object of string literals), `legacyRoutes` (the `/mba/*` tree, deleted in Task 18), `RESUME_DOWNLOAD_NAME`, `toolItem(slug)`, `speakingItem(slug)`.
- Consumes: nothing.

- [ ] **Step 1: Write the failing test**

Create `src/lib/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  RESUME_DOWNLOAD_NAME,
  legacyRoutes,
  routes,
  speakingItem,
  toolItem,
} from "./routes";

describe("routes", () => {
  it("exposes every top-level destination the site links to", () => {
    expect(routes).toEqual({
      home: "/",
      about: "/#about",
      work: "/#work",
      contact: "/#contact",
      tools: "/tools",
      speaking: "/speaking",
      resume: "/resume.pdf",
    });
  });

  it("builds item permalinks under their gallery", () => {
    expect(toolItem("margin-model")).toBe("/tools/margin-model");
    expect(speakingItem("zicklin-panel")).toBe("/speaking/zicklin-panel");
  });

  it("names the resume download file", () => {
    expect(RESUME_DOWNLOAD_NAME).toBe("Uzair-Vawda-CV.pdf");
  });

  it("still carries the legacy mba tree until it is redirected", () => {
    expect(legacyRoutes.mbaHome).toBe("/mba");
    expect(Object.values(legacyRoutes).every((r) => r.startsWith("/mba"))).toBe(
      true,
    );
  });

  it("uses absolute paths everywhere", () => {
    const all = [...Object.values(routes), ...Object.values(legacyRoutes)];
    expect(all.every((r) => r.startsWith("/"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/lib/routes.test.ts`
Expected: FAIL — `Failed to resolve import "./routes"`.

- [ ] **Step 3: Write the manifest**

Create `src/lib/routes.ts`:

```ts
// Every internal URL on the site, in one place. Nothing else may hardcode a
// path — renaming a route should be a one-file change, and the stage-5 move
// off /mba depends on that being true.

export const routes = {
  home: "/",
  about: "/#about",
  work: "/#work",
  contact: "/#contact",
  tools: "/tools",
  speaking: "/speaking",
  resume: "/resume.pdf",
} as const;

// The pre-redesign MBA tree. Still linked while those pages exist; deleted in
// the same commit that adds the 308 redirects.
export const legacyRoutes = {
  mbaHome: "/mba",
  mbaAbout: "/mba/about",
  mbaTools: "/mba/tools",
  mbaJournal: "/mba/journal",
  mbaSpeaking: "/mba/speaking",
} as const;

export const RESUME_DOWNLOAD_NAME = "Uzair-Vawda-CV.pdf";

export function toolItem(slug: string): string {
  return `${routes.tools}/${slug}`;
}

export function speakingItem(slug: string): string {
  return `${routes.speaking}/${slug}`;
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/lib/routes.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Replace every hardcoded path**

In each file below, import from `@/lib/routes` and substitute. No rendered output changes — this is a pure swap.

- `src/app/sitemap.ts` — replace the literal array:

```ts
import { legacyRoutes, routes } from "@/lib/routes";

const sitemapRoutes: string[] = [routes.home, ...Object.values(legacyRoutes)];
```
Keep the existing `.map()` body, but compare against `routes.home` and `legacyRoutes.mbaHome` instead of `"/"` and `"/mba"`.

- `src/app/not-found.tsx:48` — `href={legacyRoutes.mbaHome}`
- `src/app/(swe)/page.tsx:47` — `href={legacyRoutes.mbaHome}`
- `src/components/hero/hero.tsx` — line 51 becomes `href={routes.resume}` with `download={RESUME_DOWNLOAD_NAME}`; line 59 becomes `href={legacyRoutes.mbaHome}`. Leave line 44's `#projects` alone: that anchor points at a section that still exists under that id and becomes `routes.work` in Task 11, when the section is renamed.
- `src/components/site-nav.tsx` — all seven links
- `src/components/site-footer.tsx` — `routes.resume` / `RESUME_DOWNLOAD_NAME`, and `href={isMba ? routes.home : legacyRoutes.mbaHome}`
- `src/components/mba-empty-state.tsx:8` — `ctaHref = legacyRoutes.mbaAbout`
- `src/content/mba.ts` — `navItems` hrefs and `about.overview[].route`

- [ ] **Step 6: Verify nothing else hardcodes a path**

Run: `grep -rn '"/mba\|"/resume.pdf\|"/tools\|"/speaking' src/ | grep -v 'src/lib/routes.ts'`
Expected: no output.

- [ ] **Step 7: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass, 173 + 5 = 178 tests.

- [ ] **Step 8: Commit**

```bash
git add src/lib/routes.ts src/lib/routes.test.ts src/app src/components src/content
git commit -m "refactor: extract typed route manifest"
```

---

### Task 2: Contrast maths and the AA regression test

The suite currently asserts nothing about colour — a full repalette passes it green. Close that gap before repainting, so Task 3 is verified rather than eyeballed.

**Files:**
- Create: `src/lib/theme/contrast.ts`, `src/lib/theme/contrast.test.ts`
- Create: `src/lib/theme/tokens.ts`, `src/lib/theme/tokens.test.ts`

**Interfaces:**
- Produces: `relativeLuminance(hex): number`, `contrastRatio(a, b): number`, `tokens: Record<ThemeName, Record<TokenName, string>>`, types `ThemeName` and `TokenName`. Task 3 writes `globals.css` from `tokens`; Task 10 reads `tokens[theme].signal` for the scene; Task 16 reads the whole dark set for the OG cards.
- Consumes: nothing.

- [ ] **Step 1: Write the failing contrast test**

Create `src/lib/theme/contrast.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { contrastRatio, relativeLuminance } from "./contrast";

describe("relativeLuminance", () => {
  it("is 1 for white and 0 for black", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
  });

  it("applies the sRGB gamma curve, not a linear ramp", () => {
    // Mid grey is far darker than 0.5 once gamma is undone.
    expect(relativeLuminance("#808080")).toBeCloseTo(0.2159, 3);
  });

  it("accepts uppercase hex", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 2);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#1B6B4A", "#EFF3EF")).toBeCloseTo(
      contrastRatio("#EFF3EF", "#1B6B4A"),
      6,
    );
  });

  it("is 1 for a colour against itself", () => {
    expect(contrastRatio("#1B6B4A", "#1B6B4A")).toBeCloseTo(1, 6);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/lib/theme/contrast.test.ts`
Expected: FAIL — cannot resolve `./contrast`.

- [ ] **Step 3: Implement the maths**

Create `src/lib/theme/contrast.ts`:

```ts
// WCAG 2.1 relative luminance and contrast ratio, for six-digit hex only.
// Used by the token regression test so the palette's AA guarantees are
// enforced on every run rather than asserted once in a design document.

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) {
    throw new Error(`Expected six-digit hex, got "${hex}"`);
  }
  const r = channel(parseInt(clean.slice(0, 2), 16));
  const g = channel(parseInt(clean.slice(2, 4), 16));
  const b = channel(parseInt(clean.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/lib/theme/contrast.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the failing token test**

Create `src/lib/theme/tokens.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { contrastRatio } from "./contrast";
import { tokens, type ThemeName, type TokenName } from "./tokens";

// Every foreground/background pairing the design actually uses, with the
// measured ratio from the spec. Exact values, not just ">= 4.5" — a token
// nudge that still passes AA should still be a deliberate, reviewed change.
const PAIRS: Array<[TokenName, TokenName, number, number]> = [
  // [foreground, background, light, dark]
  ["ink", "ground", 16.79, 17.22],
  ["ink", "surface", 17.89, 15.78],
  ["ink", "tint", 15.21, 14.38],
  ["muted", "ground", 5.77, 6.6],
  ["muted", "surface", 6.15, 6.05],
  ["muted", "tint", 5.22, 5.52],
  ["signal", "ground", 5.77, 8.41],
  ["signal", "surface", 6.15, 7.71],
  ["signal", "tint", 5.22, 7.03],
];

const THEMES: ThemeName[] = ["light", "dark"];

describe("pine palette", () => {
  it("defines the same token set in both themes", () => {
    expect(Object.keys(tokens.light).sort()).toEqual(
      Object.keys(tokens.dark).sort(),
    );
  });

  it("uses six-digit hex for every token", () => {
    for (const theme of THEMES) {
      for (const [name, value] of Object.entries(tokens[theme])) {
        expect(value, `${theme}.${name}`).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  for (const [fg, bg, light, dark] of PAIRS) {
    it(`${fg} on ${bg} meets AA in both themes`, () => {
      const measured = {
        light: contrastRatio(tokens.light[fg], tokens.light[bg]),
        dark: contrastRatio(tokens.dark[fg], tokens.dark[bg]),
      };
      expect(measured.light).toBeGreaterThanOrEqual(4.5);
      expect(measured.dark).toBeGreaterThanOrEqual(4.5);
      expect(measured.light).toBeCloseTo(light, 2);
      expect(measured.dark).toBeCloseTo(dark, 2);
    });
  }

  it("keeps the primary button legible in both themes", () => {
    // Light: pale ground-coloured label on saturated signal.
    expect(
      contrastRatio(tokens.light.ground, tokens.light.signal),
    ).toBeGreaterThanOrEqual(4.5);
    // Dark: near-black label on the brighter signal.
    expect(
      contrastRatio(tokens.dark.ground, tokens.dark.signal),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 6: Run it to make sure it fails**

Run: `npx vitest run src/lib/theme/tokens.test.ts`
Expected: FAIL — cannot resolve `./tokens`.

- [ ] **Step 7: Write the token module**

Create `src/lib/theme/tokens.ts`:

```ts
// "Pine, tinted" — the single source of truth for the palette in TypeScript.
// globals.css declares the same values as CSS custom properties. Satori (OG
// images) and three.js cannot read CSS variables, so they import from here.

export type ThemeName = "light" | "dark";

export type TokenName =
  | "ground"
  | "surface"
  | "tint"
  | "ink"
  | "muted"
  | "rule"
  | "ruleStrong"
  | "signal";

export const tokens: Record<ThemeName, Record<TokenName, string>> = {
  light: {
    ground: "#EFF3EF",
    surface: "#F7FAF7",
    tint: "#DEEAE2",
    ink: "#0C1310",
    muted: "#566159",
    rule: "#D6E0D8",
    ruleStrong: "#B9CCC0",
    signal: "#1B6B4A",
  },
  dark: {
    ground: "#0B0F0D",
    surface: "#131A16",
    tint: "#16241C",
    ink: "#EFF3EF",
    muted: "#8E9A92",
    rule: "#222E28",
    ruleStrong: "#33443B",
    signal: "#4FBF8B",
  },
};

```

Task 3 declares the same values in `globals.css` as `--ground`, `--surface`, `--tint`, `--ink`, `--muted-ink`, `--rule`, `--rule-strong`, and `--signal`. Note the CSS name for `muted` is `--muted-ink`, not `--muted`: Tailwind's shadcn layer already owns `--muted` as a *background* token, and colliding on that name would silently repaint every `bg-muted`.

- [ ] **Step 8: Run the test to confirm it passes**

Run: `npx vitest run src/lib/theme/`
Expected: PASS — 6 contrast tests, 12 token tests.

- [ ] **Step 9: Commit**

```bash
git add src/lib/theme
git commit -m "test: add pine palette tokens and AA contrast regression"
```

---

### Task 3: Repaint to pine, delete the second palette

**Files:**
- Modify: `src/app/globals.css:7-40` (theme map), `:47-106` (light/dark), `:108-159` (delete MBA blocks)
- Modify: `src/app/layout.tsx:45-50` (themeColor), `:5,97` (fonts)
- Modify: `src/lib/fonts.ts` (delete Newsreader and Inter)
- Modify: `src/components/sections/skills.tsx:6-11`, `src/components/sections/interests.tsx:17-19`
- Modify: `src/components/mba-empty-state.tsx:22` (`font-serif` → `font-sans`)

**Interfaces:**
- Consumes: `tokens` from Task 2.
- Produces: CSS custom properties `--ground`, `--surface`, `--tint`, `--ink`, `--muted-ink`, `--rule`, `--rule-strong`, `--signal`, plus the existing shadcn aliases remapped onto them.

The hex values below must match `src/lib/theme/tokens.ts` exactly — copy them from that file rather than from this document.

- [ ] **Step 1: Rewrite the palette blocks**

In `src/app/globals.css`, replace lines 27–30 (the periwinkle block inside `@theme inline`) with:

```css
  /* Pine tokens exposed to Tailwind as utilities: bg-ground, text-ink,
     border-rule, text-signal, bg-tint. */
  --color-ground: var(--ground);
  --color-surface: var(--surface);
  --color-tint: var(--tint);
  --color-ink: var(--ink);
  --color-muted-ink: var(--muted-ink);
  --color-rule: var(--rule);
  --color-rule-strong: var(--rule-strong);
  --color-signal: var(--signal);
```

Delete line 34 (`--font-serif: var(--font-serif);`).

Replace the whole `:root { ... }` block (lines 47–78) with:

```css
/* ------------------------------------------------------------ */
/* Pine, tinted — LIGHT                                          */
/* Every neutral carries a green bias derived from the accent,    */
/* including the near-black. Values mirrored in                   */
/* src/lib/theme/tokens.ts, which the OG cards and the scene read. */
/* ------------------------------------------------------------ */
:root {
  --ground: #eff3ef;
  --surface: #f7faf7;
  --tint: #deeae2;
  --ink: #0c1310;
  --muted-ink: #566159;
  --rule: #d6e0d8;
  --rule-strong: #b9ccc0;
  --signal: #1b6b4a;

  /* shadcn aliases, remapped onto the pine tokens. */
  --background: var(--ground);
  --foreground: var(--ink);
  --card: var(--surface);
  --card-foreground: var(--ink);
  --popover: var(--surface);
  --popover-foreground: var(--ink);

  --primary: var(--signal);
  --primary-foreground: var(--ground);
  --secondary: var(--tint);
  --secondary-foreground: var(--ink);
  --muted: var(--tint);
  --muted-foreground: var(--muted-ink);
  --accent: var(--tint);
  --accent-foreground: var(--ink);

  /* Darkened from #e11d48, which measures 4.19:1 on the pine ground
     and fails AA. #b3123a measures 6.11:1. */
  --destructive: #b3123a;
  --border: var(--rule);
  --input: var(--rule);
  --ring: var(--signal);

  --font-sans: var(--font-satoshi);
  --font-mono: var(--font-jetbrains-mono);

  --radius: 0.625rem;
}
```

Replace the whole `.dark { ... }` block (lines 81–106) with:

```css
/* Pine, tinted — DARK */
.dark {
  --ground: #0b0f0d;
  --surface: #131a16;
  --tint: #16241c;
  --ink: #eff3ef;
  --muted-ink: #8e9a92;
  --rule: #222e28;
  --rule-strong: #33443b;
  --signal: #4fbf8b;

  --background: var(--ground);
  --foreground: var(--ink);
  --card: var(--surface);
  --card-foreground: var(--ink);
  --popover: var(--surface);
  --popover-foreground: var(--ink);

  --primary: var(--signal);
  --primary-foreground: var(--ground);
  --secondary: var(--tint);
  --secondary-foreground: var(--ink);
  --muted: var(--tint);
  --muted-foreground: var(--muted-ink);
  --accent: var(--tint);
  --accent-foreground: var(--ink);

  --destructive: #f43f5e;
  --border: var(--rule);
  --input: var(--rule);
  --ring: var(--signal);
}
```

Delete lines 108–159 entirely — both `[data-section="mba"]` blocks. One identity.

- [ ] **Step 2: Drop the unused fonts**

`src/lib/fonts.ts` — delete the `newsreader` and `inter` exports and trim the import to `import { JetBrains_Mono } from "next/font/google";`.

`src/app/layout.tsx:5` — `import { jetbrainsMono, satoshi } from "@/lib/fonts";`
`src/app/layout.tsx:97` — `className={`${satoshi.variable} ${jetbrainsMono.variable} h-full antialiased`}`

Replace the `viewport` export (lines 45–50) with values read from the tokens, so it can never drift:

```ts
import { tokens } from "@/lib/theme/tokens";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: tokens.light.ground },
    { media: "(prefers-color-scheme: dark)", color: tokens.dark.ground },
  ],
};
```

- [ ] **Step 3: Rewrite the two pastel consumers**

`src/components/sections/skills.tsx:6-11` and `src/components/sections/interests.tsx:17-19` both hold a four-entry `palette` array using `periwinkle`/`columbia`/`celadon`. The pine palette has one accent, so tag fills stop being colour-coded and become uniform tint chips with a signal border. Replace both arrays with a single constant in each file:

```ts
// One accent, one chip. Colour-coding groups was a function of having three
// pastels; with a single signal, differentiation comes from the group heading.
const chip =
  "rounded-full border border-signal/30 bg-tint px-4 py-1.5 text-sm font-medium text-ink";
```

In `skills.tsx`, replace the `<li className={...palette[index % palette.length]}>` with `<li key={item} className={chip}>` and delete the now-unused `index` from the `.map((\[group, items\], index) =>` destructure. Do the same in `interests.tsx` (check its exact list markup and apply the same substitution).

- [ ] **Step 4: Remove the last `font-serif` consumer**

`src/components/mba-empty-state.tsx:22` — `className="text-3xl font-light tracking-tight"` (drop `font-serif`).

Verify no others: `grep -rn "font-serif\|periwinkle\|columbia\|celadon\|newsreader\|font-inter" src/`
Expected: no output.

- [ ] **Step 5: Run the gate and look at the site**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

Run: `npm run dev`, open `http://localhost:3000/`, toggle the theme, and confirm both themes render on pine with no purple or cream anywhere, including `/mba`.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib src/components
git commit -m "feat: repaint to the pine palette and delete the MBA identity"
```

---

### Task 4: Delete the scrims

Nothing animates behind body copy any more, so there is nothing to scrim.

**Files:**
- Modify: `src/components/section.tsx` (delete the `scrim` prop entirely)
- Modify: `src/app/globals.css:179-201` (delete the `@layer components` block)
- Modify: `src/components/hero/hero.tsx:11-20` (delete the inline radial gradient)
- Modify: `src/components/sections/experience.tsx:8`, `src/components/sections/education.tsx:8` (drop the `scrim` attribute)

**Interfaces:**
- Produces: `Section` with signature `React.HTMLAttributes<HTMLElement> & { as?: "section" | "div" | "main" }` — no `scrim`.

- [ ] **Step 1: Rewrite Section**

Replace `src/components/section.tsx` in full:

```tsx
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  as: Tag = "section",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "main";
}) {
  return (
    <Tag
      className={cn("w-full px-6 py-16 sm:px-8 md:px-12 lg:px-16", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Tag>
  );
}
```

- [ ] **Step 2: Delete the scrim CSS**

In `src/app/globals.css`, delete the entire `@layer components { ... }` block (the `.section-scrim` and `.section-scrim-layer` rules and their comment).

- [ ] **Step 3: Delete the hero gradient**

In `src/components/hero/hero.tsx`, delete the comment on lines 11–12 and the `<div aria-hidden ... style={{ background: "radial-gradient(...)" }} />` on lines 13–20. Drop `relative` and `overflow-hidden` from the `Section` className and `relative z-10` from the inner wrapper — with no absolutely positioned layer, the stacking context is dead weight.

- [ ] **Step 4: Drop the two `scrim` usages**

`src/components/sections/experience.tsx:8` → `<Section id="experience" className="py-24">`
`src/components/sections/education.tsx:8` → `<Section id="education" className="py-24">`

- [ ] **Step 5: Verify no scrim survives**

Run: `grep -rn "scrim" src/`
Expected: no output.

- [ ] **Step 6: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass. Typecheck is the real assertion here — any missed `scrim` prop is a type error.

- [ ] **Step 7: Commit**

```bash
git add src/components src/app/globals.css
git commit -m "refactor: delete the section scrims"
```

---

### Task 5: Derive the eyebrow ladder from a section manifest

The `01`–`09` sequence is asserted in two places and locks section order; three stages of this plan add, remove, or merge a section. Make the numbers a function of the order rather than nine hand-maintained literals.

**Files:**
- Create: `src/content/sections.ts`, `src/content/sections.test.ts`
- Modify: `src/content/swe.ts` (drop the nine `eyebrow` literals)
- Modify: `src/content/swe.test.ts:79-101,226-232` (rewrite those assertions)
- Modify: `src/components/sections/{about,experience,projects,archive,skills,education,interests,contact}.tsx`, `src/app/(swe)/page.tsx:37`

**Interfaces:**
- Produces: `sectionOrder` (readonly tuple), type `SectionId`, `sectionLabel: Record<SectionId, string>`, `eyebrow(id: SectionId): string` returning `"03 · Projects"`.
- Consumes: nothing.

- [ ] **Step 1: Write the failing test**

Create `src/content/sections.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { eyebrow, sectionLabel, sectionOrder } from "./sections";

describe("section manifest", () => {
  it("numbers sections sequentially from 01 in declaration order", () => {
    const numbers = sectionOrder.map((id) => eyebrow(id).slice(0, 2));
    expect(numbers).toEqual(
      sectionOrder.map((_, i) => String(i + 1).padStart(2, "0")),
    );
  });

  it("formats an eyebrow as NN · Label", () => {
    expect(eyebrow("about")).toBe("01 · About");
    expect(eyebrow("contact")).toBe("08 · Let's talk");
  });

  it("labels every declared section", () => {
    for (const id of sectionOrder) {
      expect(sectionLabel[id], id).toBeTruthy();
    }
  });

  it("declares no duplicate ids", () => {
    expect(new Set(sectionOrder).size).toBe(sectionOrder.length);
  });

  it("throws for an id that is not in the order", () => {
    // @ts-expect-error — deliberately off-manifest
    expect(() => eyebrow("nope")).toThrow(/not in sectionOrder/);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/content/sections.test.ts`
Expected: FAIL — cannot resolve `./sections`.

- [ ] **Step 3: Write the manifest**

Create `src/content/sections.ts`:

```ts
// The page's section order, and the source of the NN · Label eyebrows.
//
// The numbers used to be nine hand-written literals asserted in two test
// files, which meant every reordering was a multi-file change that had
// already broken once. Deriving them from this array makes adding, removing,
// or merging a section a one-line edit that cannot desynchronise.

export const sectionOrder = [
  "about",
  "experience",
  "projects",
  "archive",
  "skills",
  "education",
  "interests",
  "contact",
  "track",
] as const;

export type SectionId = (typeof sectionOrder)[number];

export const sectionLabel: Record<SectionId, string> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  archive: "Archive",
  skills: "Skills",
  education: "Education & Certifications",
  interests: "Off-screen",
  contact: "Let's talk",
  track: "What's next",
};

export function eyebrow(id: SectionId): string {
  const index = sectionOrder.indexOf(id);
  if (index === -1) throw new Error(`Section "${id}" is not in sectionOrder`);
  return `${String(index + 1).padStart(2, "0")} · ${sectionLabel[id]}`;
}
```

Note the current DOM order is About, Experience, Projects, Archive, Skills, Education, Interests, Contact, MBA teaser — but the *current* literals number Skills `05` and Archive `04`, so `sectionOrder` above reproduces the rendered order exactly. Confirm against `src/app/(swe)/page.tsx:25-34` before moving on.

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/content/sections.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Delete the literals and call the manifest**

In `src/content/swe.ts`, delete the `eyebrow` field from `aboutIntro`, `experienceIntro`, `projectsIntro`, `archiveIntro`, `skillsIntro`, `educationIntro`, `interestsIntro`, `contact`, and `mbaTeaser`.

In each section component, import `eyebrow` and call it where the literal was read. For example, in `src/components/sections/about.tsx`:

```tsx
import { eyebrow } from "@/content/sections";
// ...
<p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
  {eyebrow("about")}
</p>
```

Apply the same in `experience.tsx` (`"experience"`), `projects.tsx:14` (`"projects"`), `archive.tsx` (`"archive"`), `skills.tsx:21` (`"skills"`), `education.tsx` (`"education"`), `interests.tsx` (`"interests"`), `contact.tsx:12` (`"contact"`), and `src/app/(swe)/page.tsx:37` (`"track"`).

- [ ] **Step 6: Rewrite the two stale assertions in swe.test.ts**

Delete the `it("numbers every section eyebrow 01 through 09 ...")` block (lines 79–101) — `sections.test.ts` owns that invariant now. Delete the two `eyebrow` assertions at lines 226–232. Remove any imports left unused (`aboutIntro`, `interestsIntro`, `mbaTeaser`, etc. — the typecheck will name them).

- [ ] **Step 7: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 8: Confirm the rendered ladder is unchanged**

Run: `npm run dev` and check `http://localhost:3000/` still reads 01 About … 09 What's next in the same order as before this task.

- [ ] **Step 9: Commit**

```bash
git add src/content src/components src/app
git commit -m "refactor: derive section eyebrow numbering from a manifest"
```

---

### Task 6: Move e2e off prose and onto testids

Asserting prose in end-to-end tests makes the lowest-risk part of a redesign the most expensive one. Do this before the copy changes.

**Files:**
- Modify: every section component + `src/components/hero/hero.tsx`, `src/components/site-nav.tsx`, `src/components/site-footer.tsx`, `src/components/scene/particle-field.tsx`, `src/app/mba/*/page.tsx`, `src/components/sections/about.tsx`
- Modify: `e2e/routes.spec.ts` (full rewrite)

**Interfaces:**
- Produces: the testid vocabulary below. Every later stage adds to it and never removes an id without updating `e2e/`.

| Testid | On |
| --- | --- |
| `section-<SectionId>` | the `<Section>` element of each home-page section |
| `hero` | the hero `<Section>` |
| `hero-cta-work`, `hero-cta-resume` | the hero's two actions |
| `nav-resume`, `nav-tools`, `nav-speaking`, `nav-about`, `nav-contact`, `nav-work` | nav links |
| `footer-resume` | footer resume link |
| `about-cv-link` | the inline CV link in About |
| `particle-field` | the fixed canvas wrapper (removed in Stage 2) |
| `page-mba`, `page-mba-tools`, `page-mba-journal`, `page-mba-speaking`, `page-mba-about` | the `<main>`/root of each legacy MBA page (removed in Stage 5) |

- [ ] **Step 1: Add the testids**

`Section` already spreads `...props` onto its root element, so no API change is needed — pass `data-testid` at each call site.

```tsx
<Section id="about" className="py-24" data-testid="section-about">
```

Do the same for experience, projects, archive, skills, education, interests, contact, and the track block in `src/app/(swe)/page.tsx`. On `src/components/hero/hero.tsx`, add `data-testid="hero"` to its `Section`, `data-testid="hero-cta-work"` to the "See work" link and `data-testid="hero-cta-resume"` to the resume link. Add `data-testid="nav-resume"` to the nav resume link and `data-testid="footer-resume"` to the footer one. Add `data-testid="about-cv-link"` to the inline CV link in `about.tsx`. Add `data-testid="particle-field"` to the fixed wrapper `div` in `particle-field.tsx:48`. Add `data-testid="page-mba"` (etc.) to each legacy MBA page's outermost element.

- [ ] **Step 2: Rewrite the route spec**

Replace `e2e/routes.spec.ts` in full:

```ts
import { expect, test } from "@playwright/test";

// Locators are testids, never prose. Copy changes in every stage of this
// redesign; the structure these tests care about does not.
const routes: Array<{ path: string; testId: string }> = [
  { path: "/", testId: "hero" },
  { path: "/mba", testId: "page-mba" },
  { path: "/mba/tools", testId: "page-mba-tools" },
  { path: "/mba/journal", testId: "page-mba-journal" },
  { path: "/mba/speaking", testId: "page-mba-speaking" },
  { path: "/mba/about", testId: "page-mba-about" },
];

test.describe("route smoke tests", () => {
  for (const { path, testId } of routes) {
    test(`${path} renders`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByTestId(testId)).toBeVisible();
    });
  }

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/does-not-exist-12345");
    expect(response?.status()).toBe(404);
    await expect(page.getByTestId("not-found")).toBeVisible();
  });

  test("sitemap is served", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.ok()).toBe(true);
    expect(response?.headers()["content-type"]).toMatch(/xml/);
  });

  test("robots.txt is served and disallows /api/", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.ok()).toBe(true);
    const body = await response!.text();
    expect(body).toMatch(/Disallow: \/api\//);
  });

  test("home page sections render in order", async ({ page }) => {
    await page.goto("/");
    const ids = await page
      .locator("[data-testid^='section-']")
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute("data-testid")),
      );
    expect(ids).toEqual([
      "section-about",
      "section-experience",
      "section-projects",
      "section-archive",
      "section-skills",
      "section-education",
      "section-interests",
      "section-contact",
      "section-track",
    ]);
  });

  test("the scene renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByTestId("particle-field")).toBeAttached();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });

  test("the CV is served and reachable from every entry point", async ({
    page,
    context,
  }) => {
    const pdfResponse = await context.request.head("/resume.pdf");
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()["content-type"]).toMatch(/pdf/);

    await page.goto("/");
    // Named entry points, not a bare count — a count breaks on any layout
    // change and tells you nothing about which link went missing.
    for (const id of [
      "hero-cta-resume",
      "nav-resume",
      "about-cv-link",
      "footer-resume",
    ]) {
      await expect(page.getByTestId(id)).toHaveAttribute(
        "href",
        "/resume.pdf",
      );
    }
    await expect(page.getByTestId("hero-cta-resume")).toHaveAttribute(
      "download",
      "Uzair-Vawda-CV.pdf",
    );
  });
});
```

Add `data-testid="not-found"` to the heading container in `src/app/not-found.tsx`.

- [ ] **Step 3: Run the e2e suite**

Run: `npm run test:e2e`
Expected: PASS. This builds first and takes a few minutes.

- [ ] **Step 4: Confirm no prose assertions remain**

Run: `grep -n "getByRole('heading'\|getByRole(\"heading\"\|hasText" e2e/routes.spec.ts`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add e2e src/components src/app
git commit -m "test: move e2e locators from copy strings to testids"
```

---

### Task 7: Drop the dead dependency and the deprecated runtime flag

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `src/app/opengraph-image.tsx:3`

- [ ] **Step 1: Confirm drei is imported nowhere**

Run: `grep -rn "drei" src/ e2e/`
Expected: no output. If there is output, stop and report — the spec assumed none.

- [ ] **Step 2: Remove it**

Run: `npm uninstall @react-three/drei`

- [ ] **Step 3: Remove the deprecated runtime export**

Delete line 3 of `src/app/opengraph-image.tsx` (`export const runtime = "edge";`). Next 16 deprecates it; the docs say remove it. `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` has the note.

- [ ] **Step 4: Verify the build and the OG image still work**

Run: `npm run build`
Expected: build succeeds, `/opengraph-image` listed in the route output.

Run: `npx next start -p 3100` in one shell, then `curl -sI http://localhost:3100/opengraph-image | head -3`
Expected: `HTTP/1.1 200` and `content-type: image/png`.

- [ ] **Step 5: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/app/opengraph-image.tsx
git commit -m "chore: drop unused @react-three/drei and the edge runtime flag"
```

---

# Stage 2 — The Overture

One three.js sequence on arrival, then it unmounts. No idle GPU cost for the rest of the visit.

---

### Task 8: Time-driven overture choreography

The existing `choreography.ts` maps *scroll* to shape state. The overture is on a clock, and after this stage there is no scroll-driven canvas left, so this module replaces it.

**Files:**
- Create: `src/lib/scene/overture.ts`, `src/lib/scene/overture.test.ts`
- Delete: `src/lib/scene/choreography.ts`, `src/lib/scene/choreography.test.ts`

**Interfaces:**
- Produces: `OVERTURE_DURATION_MS = 4000`, type `OverturePhase = "gather" | "hold" | "disperse" | "settled"`, `OvertureState`, `overtureState(elapsedMs: number): OvertureState`. Task 10 calls this each frame.
- Consumes: `ShapeId` moves here from `choreography.ts`; `shapes.ts` is unchanged.

- [ ] **Step 1: Write the failing test**

Create `src/lib/scene/overture.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  OVERTURE_DURATION_MS,
  overtureState,
  type OvertureState,
} from "./overture";

const at = (ms: number): OvertureState => overtureState(ms);

describe("overtureState", () => {
  it("starts dispersed and invisible on the document", () => {
    const s = at(0);
    expect(s.phase).toBe("gather");
    expect(s.fromShape).toBe("dispersed");
    expect(s.blend).toBe(0);
    expect(s.documentOpacity).toBe(0);
  });

  it("gathers into the icosahedron by the end of the gather phase", () => {
    const s = at(1600);
    expect(s.toShape).toBe("icosahedron");
    expect(s.blend).toBeCloseTo(1, 3);
  });

  it("holds the gathered form while the name resolves", () => {
    const s = at(2100);
    expect(s.phase).toBe("hold");
    expect(s.fromShape).toBe("icosahedron");
    expect(s.toShape).toBe("icosahedron");
    expect(s.dispersion).toBe(0);
  });

  it("disperses and hands over to the document", () => {
    const s = at(3400);
    expect(s.phase).toBe("disperse");
    expect(s.dispersion).toBeGreaterThan(0);
    expect(s.documentOpacity).toBeGreaterThan(0);
    expect(s.dotOpacity).toBeLessThan(1);
  });

  it("settles with the document fully up and the cloud gone", () => {
    const s = at(OVERTURE_DURATION_MS);
    expect(s.phase).toBe("settled");
    expect(s.documentOpacity).toBe(1);
    expect(s.dotOpacity).toBe(0);
    expect(s.lineOpacity).toBe(0);
  });

  it("stays settled past the end rather than looping", () => {
    expect(at(OVERTURE_DURATION_MS * 3)).toEqual(at(OVERTURE_DURATION_MS));
  });

  it("clamps negative elapsed time to the start", () => {
    expect(at(-500)).toEqual(at(0));
  });

  it("raises document opacity monotonically", () => {
    let previous = -1;
    for (let ms = 0; ms <= OVERTURE_DURATION_MS; ms += 50) {
      const value = at(ms).documentOpacity;
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("keeps every opacity within 0..1", () => {
    for (let ms = -100; ms <= OVERTURE_DURATION_MS + 100; ms += 37) {
      const s = at(ms);
      for (const value of [
        s.blend,
        s.dotOpacity,
        s.lineOpacity,
        s.dispersion,
        s.documentOpacity,
      ]) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/lib/scene/overture.test.ts`
Expected: FAIL — cannot resolve `./overture`.

- [ ] **Step 3: Write the module**

Create `src/lib/scene/overture.ts`:

```ts
// The overture is on a clock, not on scroll: constellation gathers, holds
// while the name resolves, disperses, and the still document rises. It runs
// once per session and then the scene unmounts, so this is the only motion
// budget on the page.

export type ShapeId = "icosahedron" | "sphere" | "dispersed";

export type OverturePhase = "gather" | "hold" | "disperse" | "settled";

export interface OvertureState {
  phase: OverturePhase;
  fromShape: ShapeId;
  toShape: ShapeId;
  blend: number; // 0..1 within the current segment
  rotationY: number; // radians
  dispersion: number; // 0..1, drives an outward scale
  lineOpacity: number; // wireframe
  dotOpacity: number; // particles
  documentOpacity: number; // the resolved hero copy
}

const GATHER_END_MS = 1600;
const HOLD_END_MS = 2600;
export const OVERTURE_DURATION_MS = 4000;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Ken Perlin's smootherstep: zero first AND second derivative at both ends,
// so the gather eases in and the disperse settles out instead of ramping.
function smootherstep(t: number): number {
  const x = clamp01(t);
  return clamp01(x * x * x * (x * (x * 6 - 15) + 10));
}

export function overtureState(elapsedMs: number): OvertureState {
  const t = Math.max(0, elapsedMs);

  const rotationY = (Math.min(t, OVERTURE_DURATION_MS) / OVERTURE_DURATION_MS) *
    Math.PI *
    0.75;

  if (t < GATHER_END_MS) {
    const progress = smootherstep(t / GATHER_END_MS);
    return {
      phase: "gather",
      fromShape: "dispersed",
      toShape: "icosahedron",
      blend: progress,
      rotationY,
      dispersion: 0,
      // Dots arrive first; the wireframe draws in behind them as they land.
      dotOpacity: progress,
      lineOpacity: smootherstep(clamp01((t - GATHER_END_MS * 0.6) /
        (GATHER_END_MS * 0.4))),
      documentOpacity: 0,
    };
  }

  if (t < HOLD_END_MS) {
    return {
      phase: "hold",
      fromShape: "icosahedron",
      toShape: "icosahedron",
      blend: 1,
      rotationY,
      dispersion: 0,
      dotOpacity: 1,
      lineOpacity: 1,
      documentOpacity: 0,
    };
  }

  if (t < OVERTURE_DURATION_MS) {
    const progress = smootherstep(
      (t - HOLD_END_MS) / (OVERTURE_DURATION_MS - HOLD_END_MS),
    );
    return {
      phase: "disperse",
      fromShape: "icosahedron",
      toShape: "dispersed",
      blend: progress,
      rotationY,
      dispersion: progress,
      dotOpacity: 1 - progress,
      lineOpacity: 1 - smootherstep(progress * 1.6),
      // The document rises as the cloud leaves, so the copy is never sitting
      // over a moving layer at full strength.
      documentOpacity: smootherstep(clamp01((progress - 0.25) / 0.75)),
    };
  }

  return {
    phase: "settled",
    fromShape: "dispersed",
    toShape: "dispersed",
    blend: 1,
    rotationY,
    dispersion: 1,
    dotOpacity: 0,
    lineOpacity: 0,
    documentOpacity: 1,
  };
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/lib/scene/overture.test.ts`
Expected: PASS, 9 tests.

- [ ] **Step 5: Delete the scroll-driven choreography**

```bash
git rm src/lib/scene/choreography.ts src/lib/scene/choreography.test.ts
```

`src/components/scene/particle-cloud.tsx:15` imports from it and will not compile — that is expected and Task 10 replaces the component. To keep the tree green between commits, delete the old scene components in this same commit:

```bash
git rm src/components/scene/particle-cloud.tsx src/components/scene/particle-field.tsx src/components/scene/particle-field-mount.tsx
```

and remove `<ParticleFieldMount />` and its import from `src/app/(swe)/layout.tsx:1,12`. The page renders with no canvas until Task 10 mounts the overture; that is a valid intermediate state and matches the reduced-motion path.

- [ ] **Step 6: Update the e2e canvas expectation**

In `e2e/routes.spec.ts`, delete the `"the scene renders without console errors"` test — `e2e/overture.spec.ts` (Task 10) replaces it.

- [ ] **Step 7: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass. Unit count drops by 12 (choreography) and rises by 9 (overture).

- [ ] **Step 8: Commit**

```bash
git add -A src/lib/scene src/components/scene src/app e2e
git commit -m "feat: replace scroll choreography with a time-driven overture"
```

---

### Task 9: Session gate

**Files:**
- Create: `src/lib/scene/session.ts`, `src/lib/scene/session.test.ts`

**Interfaces:**
- Produces: `OVERTURE_SESSION_KEY`, `hasPlayedOverture(storage?: Storage | null): boolean`, `markOverturePlayed(storage?: Storage | null): void`. Both take storage as an argument so they are testable without touching globals; Task 10 passes `window.sessionStorage`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/scene/session.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  OVERTURE_SESSION_KEY,
  hasPlayedOverture,
  markOverturePlayed,
} from "./session";

function fakeStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v),
  } as Storage;
}

function throwingStorage(): Storage {
  // Safari in private mode throws on both read and write.
  return {
    get length(): number {
      throw new Error("SecurityError");
    },
    clear: () => {
      throw new Error("SecurityError");
    },
    getItem: () => {
      throw new Error("SecurityError");
    },
    key: () => {
      throw new Error("SecurityError");
    },
    removeItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => {
      throw new Error("SecurityError");
    },
  } as unknown as Storage;
}

describe("overture session gate", () => {
  it("reports not played on a fresh session", () => {
    expect(hasPlayedOverture(fakeStorage())).toBe(false);
  });

  it("reports played once marked", () => {
    const storage = fakeStorage();
    markOverturePlayed(storage);
    expect(storage.getItem(OVERTURE_SESSION_KEY)).toBe("1");
    expect(hasPlayedOverture(storage)).toBe(true);
  });

  it("treats missing storage as not played", () => {
    expect(hasPlayedOverture(undefined)).toBe(false);
    expect(hasPlayedOverture(null)).toBe(false);
  });

  it("never throws when storage is unavailable", () => {
    const storage = throwingStorage();
    expect(() => markOverturePlayed(storage)).not.toThrow();
    // A browser that cannot remember should get the sequence, not a crash.
    expect(hasPlayedOverture(storage)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/lib/scene/session.test.ts`
Expected: FAIL — cannot resolve `./session`.

- [ ] **Step 3: Write the module**

Create `src/lib/scene/session.ts`:

```ts
// The overture runs once per session and never replays on back-navigation.
// sessionStorage is the right scope: it survives client-side navigation and
// reloads within the tab, and resets when the tab closes.
//
// Storage is passed in rather than read from `window` so this is testable
// without globals — and every access is guarded, because Safari in private
// mode throws on both read and write.

export const OVERTURE_SESSION_KEY = "uv:overture-played";

export function hasPlayedOverture(storage?: Storage | null): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(OVERTURE_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOverturePlayed(storage?: Storage | null): void {
  if (!storage) return;
  try {
    storage.setItem(OVERTURE_SESSION_KEY, "1");
  } catch {
    // A browser that refuses to remember gets the sequence again. Acceptable.
  }
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/lib/scene/session.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene/session.ts src/lib/scene/session.test.ts
git commit -m "feat: add the overture session gate"
```

---

### Task 10: The overture scene and the resolved hero

**Files:**
- Create: `src/components/scene/overture-cloud.tsx`, `src/components/scene/overture-scene.tsx`, `src/components/scene/overture-mount.tsx`
- Create: `e2e/overture.spec.ts`
- Modify: `src/components/hero/hero.tsx` (full rewrite)
- Modify: `src/content/swe.ts` (hero copy)

**Interfaces:**
- Consumes: `overtureState`, `OVERTURE_DURATION_MS` (Task 8); `hasPlayedOverture`, `markOverturePlayed` (Task 9); `tokens` (Task 2); `particleBudget` (`src/lib/scene/device.ts`, unchanged); `dispersedPoints`, `icosahedronPoints`, `icosahedronEdges` (`src/lib/scene/shapes.ts`, unchanged).
- Produces: `<OvertureMount>{resolved hero copy}</OvertureMount>` — takes the hero document as children and controls its reveal in React. Renders no canvas after the sequence resolves.

- [ ] **Step 1: Add the hero copy**

In `src/content/swe.ts`, add near the top:

```ts
export const hero = {
  name: "Uzair Vawda.",
  positioning:
    "Software engineer and MBA candidate in NYC, building AI-era product tooling and the case for it.",
  actions: {
    resume: "Résumé",
    work: "See work",
  },
};
```

- [ ] **Step 2: Write the cloud**

Create `src/components/scene/overture-cloud.tsx`:

```tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  type Group,
  type LineBasicMaterial,
  type LineSegments,
  type Points as ThreePoints,
  type PointsMaterial,
} from "three";

import { overtureState, type ShapeId } from "@/lib/scene/overture";
import {
  dispersedPoints,
  icosahedronEdges,
  icosahedronPoints,
} from "@/lib/scene/shapes";

type Props = {
  count: number;
  color: string;
  startedAt: number;
  onSettled: () => void;
};

const BASE_SCALE = 1.5;
const DOT_OPACITY = 0.75;
const LINE_OPACITY = 0.85;

// A crisp radial sprite: a defined dot with a thin soft edge for
// anti-aliasing, rather than a fuzzy glow.
function createSoftSprite(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.95)");
  g.addColorStop(0.8, "rgba(255,255,255,0.2)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

export function OvertureCloud({ count, color, startedAt, onSettled }: Props) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<ThreePoints>(null);
  const linesRef = useRef<LineSegments>(null);
  const settledRef = useRef(false);

  const sprite = useMemo(() => createSoftSprite(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  const { positions, targets } = useMemo(() => {
    const dispersed = dispersedPoints(count, 1);
    const targets: Record<ShapeId, Float32Array> = {
      dispersed,
      icosahedron: icosahedronPoints(count),
      // Unused by the overture, present so the record is total.
      sphere: icosahedronPoints(count),
    };
    return { positions: Float32Array.from(dispersed), targets };
  }, [count]);

  const edges = useMemo(() => icosahedronEdges(), []);

  useFrame(() => {
    const group = groupRef.current;
    const points = pointsRef.current;
    if (!group || !points) return;

    const state = overtureState(performance.now() - startedAt);
    const from = targets[state.fromShape];
    const to = targets[state.toShape];
    const live = points.geometry.attributes.position.array as Float32Array;

    // Positions are driven straight off the clock rather than eased toward a
    // target: the sequence must land on time regardless of frame rate.
    for (let i = 0; i < live.length; i++) {
      live[i] = from[i] + (to[i] - from[i]) * state.blend;
    }
    points.geometry.attributes.position.needsUpdate = true;

    (points.material as PointsMaterial).opacity = DOT_OPACITY * state.dotOpacity;
    const lines = linesRef.current;
    if (lines) {
      (lines.material as LineBasicMaterial).opacity =
        LINE_OPACITY * state.lineOpacity;
      lines.visible = state.lineOpacity > 0.001;
    }

    group.rotation.y = state.rotationY;
    group.scale.setScalar(BASE_SCALE * (1 + state.dispersion * 0.4));

    if (state.phase === "settled" && !settledRef.current) {
      settledRef.current = true;
      onSettled();
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          opacity={0}
          color={color}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          sizeAttenuation
          map={sprite}
          alphaMap={sprite}
          transparent
          opacity={0}
          color={color}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
```

- [ ] **Step 3: Write the lifecycle**

Create `src/components/scene/overture-scene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { particleBudget } from "@/lib/scene/device";
import { markOverturePlayed } from "@/lib/scene/session";
import { tokens } from "@/lib/theme/tokens";

import { OvertureCloud } from "./overture-cloud";

// Any of these resolve the sequence immediately. Scroll is included because a
// visitor who scrolls has already decided to skip the show.
const SKIP_EVENTS = [
  "keydown",
  "pointerdown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

export function OvertureScene({ onResolved }: { onResolved: () => void }) {
  const reduced = useReducedMotion() ?? false;
  // three.js materials take a literal colour — they cannot read CSS
  // variables, so the hex comes from the token module. The root layout pins
  // defaultTheme="dark" with enableSystem={false}, which makes the dark
  // signal the correct pre-hydration value rather than a guess.
  const { resolvedTheme } = useTheme();
  const color =
    resolvedTheme === "light" ? tokens.light.signal : tokens.dark.signal;
  const [budget] = useState(() =>
    particleBudget(
      window.innerWidth,
      window.matchMedia("(pointer: coarse)").matches,
    ),
  );
  const startedRef = useRef(performance.now());
  const resolvedRef = useRef(false);

  const resolve = useRef(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    markOverturePlayed(
      typeof window === "undefined" ? null : window.sessionStorage,
    );
    onResolved();
  }).current;

  useEffect(() => {
    // Reduced motion skips straight to the resolved document.
    if (reduced) {
      resolve();
      return;
    }
    for (const type of SKIP_EVENTS) {
      window.addEventListener(type, resolve, { passive: true, once: true });
    }
    return () => {
      for (const type of SKIP_EVENTS) {
        window.removeEventListener(type, resolve);
      }
    };
  }, [reduced, resolve]);

  if (reduced) return null;

  return (
    <div
      data-testid="overture"
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
      >
        <OvertureCloud
          count={budget}
          color={color}
          startedAt={startedRef.current}
          onSettled={resolve}
        />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Write the mount**

Create `src/components/scene/overture-mount.tsx`:

```tsx
"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";

import { hasPlayedOverture } from "@/lib/scene/session";

const OvertureScene = dynamic(
  () => import("./overture-scene").then((m) => m.OvertureScene),
  { ssr: false, loading: () => null },
);

// Takes the hero document as children and owns its reveal directly, rather
// than signalling through a data attribute and a stylesheet. The copy is
// server-rendered and visible by default — a JS failure must still leave a
// readable page — and only hides once we know the sequence is going to run.
export function OvertureMount({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const [state, setState] = useState<"pending" | "playing" | "resolved">(
    "pending",
  );

  useEffect(() => {
    // Decided on the client, after mount: sessionStorage does not exist on
    // the server, and reading it during render would break hydration.
    //
    // Reduced motion is checked HERE rather than only in the scene. Letting
    // the scene mount and resolve itself would hide the copy for one commit
    // first — a flash shown to exactly the people who asked for less motion.
    if (reduced || hasPlayedOverture(window.sessionStorage)) {
      setState("resolved");
      return;
    }
    setState("playing");
  }, [reduced]);

  const playing = state === "playing";

  return (
    <>
      {playing ? (
        <OvertureScene onResolved={() => setState("resolved")} />
      ) : null}
      <div
        data-testid="hero-document"
        style={{
          opacity: playing ? 0 : 1,
          transition: reduced
            ? undefined
            : "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative z-10 flex flex-col items-center gap-10 text-center"
      >
        {children}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Rewrite the hero**

Replace `src/components/hero/hero.tsx` in full:

```tsx
import Link from "next/link";

import { OvertureMount } from "@/components/scene/overture-mount";
import { Section } from "@/components/section";
import { hero } from "@/content/swe";
import { RESUME_DOWNLOAD_NAME, routes } from "@/lib/routes";

export function Hero() {
  return (
    <Section
      data-testid="hero"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-12"
    >
      <OvertureMount>
        <h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          {hero.name}
        </h1>
        <p className="max-w-2xl text-balance text-xl font-light text-muted-foreground sm:text-2xl">
          {hero.positioning}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            data-testid="hero-cta-resume"
            href={routes.resume}
            download={RESUME_DOWNLOAD_NAME}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-px"
          >
            {hero.actions.resume}
            <span aria-hidden>↓</span>
          </Link>
          <Link
            data-testid="hero-cta-work"
            href={routes.work}
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-7 py-3.5 text-base text-foreground transition-colors hover:border-signal hover:text-signal"
          >
            {hero.actions.work}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </OvertureMount>
    </Section>
  );
}
```

Résumé is the solid button and "See work" the outlined one: the recruiter's action is the primary one, and accent discipline allows only one solid button per screen.

`routes.work` is `/#work`, but the projects section still carries `id="projects"` until Task 11. Rename it now — change `id="projects"` to `id="work"` in `src/components/sections/projects.tsx:10` — so the hero's anchor resolves in this stage rather than dead-ending for one stage. The `data-testid` stays `section-projects` until Task 11 renames it with the section.

Note that reduced motion needs no special case in the mount: `OvertureScene` calls `onResolved()` immediately when it detects the preference, which flips `playing` to false on the first effect and leaves the copy at full opacity with nothing to transition from.

- [ ] **Step 6: Write the e2e spec**

Create `e2e/overture.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("the overture", () => {
  test("plays once, then unmounts and leaves the document up", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByTestId("overture")).toBeAttached();

    // The scene removes itself once settled — no idle GPU cost afterwards.
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });
    await expect(page.getByTestId("hero-document")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("does not replay within the same session", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 8000,
    });

    await page.reload();
    // sessionStorage survives the reload, so the sequence is skipped entirely.
    await expect(page.getByTestId("overture")).toHaveCount(0);
    await expect(page.getByTestId("hero-document")).toBeVisible();
  });

  test("is skippable with a keypress", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("overture")).toBeAttached();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("overture")).toHaveCount(0, {
      timeout: 2000,
    });
    await expect(page.getByTestId("hero-document")).toBeVisible();
  });

  test("reduced motion skips straight to the resolved document", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByTestId("hero-document")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await context.close();
  });

  test("hero actions are reachable immediately", async ({ page }) => {
    await page.goto("/");
    // The buttons exist in the DOM from the first paint even while the copy
    // is fading in — a recruiter is never blocked on the animation.
    await expect(page.getByTestId("hero-cta-resume")).toBeAttached();
    await expect(page.getByTestId("hero-cta-work")).toBeAttached();
  });
});
```

- [ ] **Step 7: Run the gate and the e2e suite**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

Run: `npm run test:e2e`
Expected: all pass, including the five new overture tests.

- [ ] **Step 8: Watch it once**

Run: `npm run dev`, open `http://localhost:3000/` in a fresh private window, and confirm: the constellation gathers, holds, disperses, the copy rises, the canvas disappears from the DOM (check DevTools Elements), and reloading shows the resolved hero with no sequence. Toggle to light mode and hard-reload in a new private window — the particles should be pine, not periwinkle.

- [ ] **Step 9: Commit**

```bash
git add src/components src/content e2e src/app/globals.css
git commit -m "feat: add the hero overture with a session gate and skip"
```

---

# Stage 3 — The Index

Numbered rows that expand in place, replacing the project cards and the archive accordion.

---

### Task 11: The work index

**Files:**
- Create: `src/components/sections/work-index.tsx`
- Modify: `src/content/swe.ts` (merge `projectsIntro`/`archiveIntro` into `workIntro`)
- Modify: `src/content/swe.test.ts` (update the renamed exports)
- Modify: `src/content/sections.ts` (`projects` + `archive` → `work`)
- Modify: `src/app/(swe)/page.tsx`, `e2e/routes.spec.ts` (section order)
- Delete: `src/components/sections/projects.tsx`, `src/components/sections/archive.tsx`

**Interfaces:**
- Consumes: `projects`, `conceptProjects`, `archive` from `src/content/swe.ts` (shapes unchanged); `eyebrow` (Task 5); `Accordion*` from `src/components/ui/accordion.tsx`.
- Produces: `<WorkIndexSection />`, testids `section-work`, `work-row-<slug>`, `work-panel-<slug>`.

- [ ] **Step 1: Collapse the two section ids into one**

In `src/content/sections.ts`, replace the `"projects"` and `"archive"` entries in `sectionOrder` with a single `"work"`, and in `sectionLabel` replace both entries with `work: "Work"`. That is the whole renumbering — this is what Task 5 bought.

- [ ] **Step 2: Update the section-order e2e expectation**

In `e2e/routes.spec.ts`, replace `"section-projects", "section-archive"` in the expected array with `"section-work"`.

- [ ] **Step 3: Run the tests to see them fail**

Run: `npx vitest run src/content/`
Expected: FAIL in `sections.test.ts` — `expected "08 · Let's talk" to be "07 · Let's talk"` (contact shifted up by one). Update that literal in `sections.test.ts` to `"07 · Let's talk"`.

Run: `npx vitest run src/content/`
Expected: PASS.

- [ ] **Step 4: Merge the two intros**

In `src/content/swe.ts`, replace `projectsIntro` (heading, `conceptsLabel`, `helpWantedLabel`) and `archiveIntro` (heading, `intro`) with one object carrying every field both had:

```ts
export const workIntro = {
  heading: "Everything I'm building, and everything before it.",
  helpWantedLabel: "Want in? ",
  conceptsLabel: "Earlier concepts",
  archiveLabel: "Archive",
  archiveIntro:
    "Coursework, prototypes, and things I built to find out whether I could. Most of them taught me something that showed up later.",
};
```

Update `src/content/swe.test.ts`: change the `projectsIntro` / `archiveIntro` imports to `workIntro` and repoint any assertion that named their fields.

- [ ] **Step 5: Write the index**

Create `src/components/sections/work-index.tsx`:

```tsx
"use client";

import Link from "next/link";

import { Section } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { eyebrow } from "@/content/sections";
import { archive, conceptProjects, projects, workIntro } from "@/content/swe";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// One row shell, three callers. The shell owns the numbered trigger and the
// expanding panel; each caller fills the panel with whatever its own content
// shape actually is. Flattening three different shapes into one type with
// five optional fields would just move the branching into the JSX.
function Row({
  index,
  slug,
  name,
  meta,
  children,
}: {
  index: number;
  slug: string;
  name: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={slug} className="border-b border-rule">
      <AccordionTrigger
        data-testid={`work-row-${slug}`}
        className="items-baseline gap-6 py-6 text-left no-underline hover:no-underline data-[panel-open]:text-signal"
      >
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-xl font-medium tracking-tight sm:text-2xl">
          {name}
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          {meta}
        </span>
      </AccordionTrigger>
      <AccordionContent data-testid={`work-panel-${slug}`}>
        <div className="flex flex-col gap-4 bg-tint px-6 py-6">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-signal/30 px-3 py-1 text-xs font-medium text-ink"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function WorkIndexSection() {
  // The ladder numbers run continuously across all three groups, so each
  // caller offsets by what came before it.
  const conceptOffset = projects.length;
  const archiveOffset = conceptOffset + conceptProjects.length;

  return (
    <Section id="work" className="py-24" data-testid="section-work">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {eyebrow("work")}
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {workIntro.heading}
          </h2>
        </div>

        <Accordion className="border-t border-rule">
          {projects.map((project, index) => (
            <Row
              key={project.name}
              index={index}
              slug={slugify(project.name)}
              name={project.name}
              meta={`${project.role} · ${project.period}`}
            >
              <Body>{project.description}</Body>
              <Stack items={project.stack} />
              <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {workIntro.helpWantedLabel}
                </span>
                {project.helpWanted}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {project.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-signal underline underline-offset-4"
                  >
                    {link.label} <span aria-hidden>↗</span>
                  </Link>
                ))}
              </div>
            </Row>
          ))}

          {conceptProjects.map((concept, index) => (
            <Row
              key={concept.name}
              index={conceptOffset + index}
              slug={slugify(concept.name)}
              name={concept.name}
              meta={`${workIntro.conceptsLabel} · ${concept.status}`}
            >
              <Body>{concept.description}</Body>
              <Stack items={concept.stack} />
            </Row>
          ))}

          {archive.map((group, index) => (
            <Row
              key={group.group}
              index={archiveOffset + index}
              slug={slugify(group.group)}
              name={group.group}
              meta={workIntro.archiveLabel}
            >
              {index === 0 ? <Body>{workIntro.archiveIntro}</Body> : null}
              <ul className="flex flex-col gap-4">
                {group.items.map((entry) => (
                  <li key={entry.name} className="flex flex-col gap-1">
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {entry.stack}
                    </span>
                  </li>
                ))}
              </ul>
            </Row>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
```

The source shapes this maps from, for reference (`src/content/swe.ts`):

```ts
type Project = { name; role; period; status; description; stack: string[];
                 helpWanted: string; links: { label; href }[] };
type Concept = { name; status; description; stack: string[] };          // conceptProjects
type ArchiveGroup = { group: string;
                      items: { name; description; stack: string }[] };  // archive
```

Render `workIntro.archiveIntro` as a lead paragraph above the first archive row so the prose from the old archive section is not lost.

- [ ] **Step 6: Swap it into the page**

In `src/app/(swe)/page.tsx`, replace the `<ProjectsSection />` and `<ArchiveSection />` lines with `<WorkIndexSection />`, update the imports, and delete the two old files:

```bash
git rm src/components/sections/projects.tsx src/components/sections/archive.tsx
```

- [ ] **Step 7: Run the gate and e2e**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

Run: `npm run test:e2e`
Expected: all pass.

- [ ] **Step 8: Check the interaction by hand**

Run: `npm run dev`. Confirm: rows expand in place with no layout jump elsewhere on the page, keyboard `Tab` + `Enter` opens a row, the open row's name is signal-coloured, and the expanded panel is `--tint` (not a signal fill).

- [ ] **Step 9: Commit**

```bash
git add -A src/components src/content src/app e2e
git commit -m "feat: replace project cards with the expanding work index"
```

---

# Stage 4 — The Scroll Score

Soft reveal on entry, no snapping. Fires once, never loops.

---

### Task 12: Reveal primitives and their rollout

`Reveal` **replaces** `FadeUp` and `Stagger` rather than joining them. Those two neither honour `prefers-reduced-motion` nor differ from `Reveal` in any way worth keeping, and three ways to fade something in is two too many.

**Files:**
- Create: `src/components/motion/reveal.tsx`
- Delete: `src/components/motion/fade-up.tsx`, `src/components/motion/stagger.tsx`
- Modify: `src/components/sections/{about,experience,skills,education,interests,contact}.tsx`, `src/components/mba-empty-state.tsx`

**Interfaces:**
- Produces: `<Reveal delay?: number, className?>` (fade + rise, once) and `<UnmaskLines lines: string[], className?>` (per-line type unmask, once). Tasks 14 and 17 already import `Reveal`.
- Consumes: `motion/react`.

- [ ] **Step 1: Write the primitives**

Create `src/components/motion/reveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// Tier 2: fires once on entry, never loops, never snaps the scroll.
// Reduced motion collapses it to a <=150ms opacity fade with no travel.
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={
        reduced
          ? { duration: 0.15, delay: 0 }
          : { duration: 0.7, delay, ease: EASE }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A type unmask: each line rises out from behind a clipping box, so the text
// appears to be revealed rather than moved. One line at a time, 60ms apart.
export function UnmaskLines({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.15 }}
        className={className}
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </motion.div>
    );
  }

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.7, delay: index * 0.06, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 2: Replace every FadeUp and Stagger usage**

Run `grep -rln "FadeUp\|Stagger" src/` to get the list. In each file:

- `<FadeUp>` → `<Reveal>`, `<FadeUp delay={0.1}>` → `<Reveal delay={0.1}>`.
- `<Stagger className="...">` wrapping `<StaggerItem>` children → `<div className="...">` with each child wrapped in `<Reveal delay={index * 0.06}>`. The stagger becomes an explicit per-item delay, which is the same effect with one primitive instead of two.
- `src/components/mba-empty-state.tsx` uses `FadeUp` too. Swap it as well — it is deleted in Task 18, but the tree must compile in between.

Then delete both files:

```bash
git rm src/components/motion/fade-up.tsx src/components/motion/stagger.tsx
```

Run `grep -rn "FadeUp\|Stagger" src/` and expect no output before moving on.

- [ ] **Step 3: Apply the score to the section headings**

In each of `about.tsx`, `experience.tsx`, `skills.tsx`, `education.tsx`, `interests.tsx`, `contact.tsx`: render the `<h2>` heading through `<UnmaskLines lines={[heading]} />`. Keep body copy in plain `<Reveal delay={0.1}>` — an unmask on a paragraph is noise.

Recolour the eyebrows to `text-signal` while you are in each file (accent discipline permits eyebrows).

- [ ] **Step 4: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 5: Verify both motion paths in the browser**

Run: `npm run dev`. Scroll the page once: each section should reveal on entry and never re-trigger on scroll-back. Then, in DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload and scroll: sections should fade only, with no vertical travel, in about 150 ms.

- [ ] **Step 6: Run e2e**

Run: `npm run test:e2e`
Expected: all pass. If a reveal makes an element flaky for Playwright's visibility check, assert `toBeAttached()` rather than adding a wait.

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "feat: add the scroll-score reveals with a reduced-motion path"
```

---

# Stage 5 — Tools, Speaking, and the route move

Card-shaped content with shareable permalinks, and the `/mba` tree redirected away.

---

### Task 13: The track content model

**Files:**
- Create: `src/content/track.ts`, `src/content/track.test.ts`

**Interfaces:**
- Produces: type `TrackItem`, `tools: TrackItem[]`, `speaking: TrackItem[]`, `trackCopy` (section + gallery + empty-state copy), `findItem(collection, slug)`.
- Consumes: `StaticImageData` from `next/image`.

- [ ] **Step 1: Write the failing test**

Create `src/content/track.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { findItem, speaking, tools, trackCopy, type TrackItem } from "./track";

const collections: Array<[string, TrackItem[]]> = [
  ["tools", tools],
  ["speaking", speaking],
];

describe("track collections", () => {
  for (const [name, items] of collections) {
    describe(name, () => {
      it("uses unique, url-safe slugs", () => {
        const slugs = items.map((item) => item.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
        for (const slug of slugs) {
          expect(slug, slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        }
      });

      it("dates every item as an ISO calendar date", () => {
        for (const item of items) {
          expect(item.date, item.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(Number.isNaN(Date.parse(item.date)), item.slug).toBe(false);
        }
      });

      it("keeps blurbs short enough for a link preview", () => {
        for (const item of items) {
          expect(item.blurb.length, item.slug).toBeGreaterThan(20);
          expect(item.blurb.length, item.slug).toBeLessThanOrEqual(280);
        }
      });

      it("gives every image alt text", () => {
        for (const item of items) {
          if (item.image) expect(item.image.alt.length, item.slug).toBeGreaterThan(0);
        }
      });

      it("orders newest first", () => {
        const dates = items.map((item) => item.date);
        expect([...dates].sort().reverse()).toEqual(dates);
      });
    });
  }

  it("finds an item by slug and returns undefined otherwise", () => {
    expect(findItem(tools, "definitely-not-here")).toBeUndefined();
  });

  it("carries an honest empty state for each gallery", () => {
    for (const key of ["tools", "speaking"] as const) {
      expect(trackCopy[key].empty.title.length).toBeGreaterThan(0);
      expect(trackCopy[key].empty.body.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/content/track.test.ts`
Expected: FAIL — cannot resolve `./track`.

- [ ] **Step 3: Write the content module**

Create `src/content/track.ts`:

```ts
import type { StaticImageData } from "next/image";

// One shape, two collections. Card-shaped content — image, blurb, link —
// which is all a LinkedIn preview consumes, and all publishing an item should
// cost. Nothing here is article-shaped, which is why there is no MDX.
export type TrackItem = {
  slug: string; // the shareable URL segment
  title: string;
  date: string; // ISO calendar date
  blurb: string; // 1-3 sentences
  // Static imports only: next/image reads intrinsic dimensions and generates
  // a blur placeholder from them. A plain string src throws at build time.
  image?: { src: StaticImageData; alt: string };
  link?: { label: string; href: string };
};

// Newest first. Both start empty; the galleries ship with an honest empty
// state and neither route is linked from the nav until it has an item.
export const tools: TrackItem[] = [];

export const speaking: TrackItem[] = [];

export const trackCopy = {
  section: {
    heading: "The MBA track, in public.",
    body: "Evenings are an MBA at Baruch's Zicklin School. Each class produces something shippable — a small consulting tool — and the workshops, panels, and case competitions get written up after they happen. Both are published here as they land, never before.",
  },
  tools: {
    heading: "One shippable tool per class.",
    body: "Small consulting tools built alongside the coursework, roughly ten a year.",
    empty: {
      title: "No tools published yet.",
      body: "The first lands at the end of CIS 9000 — IT Strategy. Roughly ten a year after that.",
    },
  },
  speaking: {
    heading: "Talks, workshops, panels.",
    body: "Written up after the fact, roughly fifteen a year.",
    empty: {
      title: "No events written up yet.",
      body: "Each one gets documented here after it happens, never before.",
    },
  },
} as const;

export function findItem(
  collection: TrackItem[],
  slug: string,
): TrackItem | undefined {
  return collection.find((item) => item.slug === slug);
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/content/track.test.ts`
Expected: PASS. The per-item loops are vacuous over empty arrays — that is correct; they start enforcing the moment the first item lands.

- [ ] **Step 5: Commit**

```bash
git add src/content/track.ts src/content/track.test.ts
git commit -m "feat: add the track content model for tools and speaking"
```

---

### Task 14: Gallery routes and the honest empty state

**Files:**
- Create: `src/components/track/track-card.tsx`, `src/components/track/track-gallery.tsx`
- Create: `src/app/tools/page.tsx`, `src/app/speaking/page.tsx`
- Create: `e2e/track.spec.ts`

**Interfaces:**
- Consumes: `tools`, `speaking`, `trackCopy`, `TrackItem` (Task 13); `toolItem`, `speakingItem`, `routes` (Task 1); `Section`, `Reveal`.
- Produces: `<TrackGallery items href heading body empty />`, `<TrackCard item href />`. Testids: `page-tools`, `page-speaking`, `gallery-empty`, `gallery-item`.

- [ ] **Step 1: Write the card**

Create `src/components/track/track-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";

import type { TrackItem } from "@/content/track";

export function TrackCard({ item, href }: { item: TrackItem; href: string }) {
  return (
    <Link
      href={href}
      data-testid="gallery-item"
      className="group flex flex-col gap-4 rounded-2xl border border-rule bg-surface p-6 transition-colors hover:border-signal"
    >
      {item.image ? (
        <Image
          src={item.image.src}
          alt={item.image.alt}
          placeholder="blur"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-[3/2] w-full rounded-lg object-cover"
        />
      ) : null}
      <time
        dateTime={item.date}
        className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
      >
        {item.date}
      </time>
      <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-signal">
        {item.title}
      </h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {item.blurb}
      </p>
    </Link>
  );
}
```

- [ ] **Step 2: Write the gallery**

Create `src/components/track/track-gallery.tsx`:

```tsx
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { TrackCard } from "@/components/track/track-card";
import type { TrackItem } from "@/content/track";

export function TrackGallery({
  items,
  hrefFor,
  heading,
  body,
  empty,
  testId,
}: {
  items: TrackItem[];
  hrefFor: (slug: string) => string;
  heading: string;
  body: string;
  empty: { title: string; body: string };
  testId: string;
}) {
  return (
    <Section as="main" className="py-24" data-testid={testId}>
      <div className="flex flex-col gap-12">
        <Reveal className="flex flex-col gap-3">
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            {heading}
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
            {body}
          </p>
        </Reveal>

        {items.length === 0 ? (
          // An empty gallery is the exact problem this redesign is fixing, so
          // say plainly that it is empty and when it will not be. No skeleton
          // cards, no "coming soon" grid.
          <Reveal delay={0.1}>
            <div
              data-testid="gallery-empty"
              className="flex max-w-2xl flex-col gap-3 border-l-2 border-signal bg-tint px-6 py-8"
            >
              <p className="text-lg font-medium">{empty.title}</p>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {empty.body}
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <TrackCard
                key={item.slug}
                item={item}
                href={hrefFor(item.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Write the two routes**

Create `src/app/tools/page.tsx`:

```tsx
import type { Metadata } from "next";

import { TrackGallery } from "@/components/track/track-gallery";
import { tools, trackCopy } from "@/content/track";
import { toolItem } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Tools",
  description: trackCopy.tools.body,
};

export default function ToolsPage() {
  return (
    <TrackGallery
      items={tools}
      hrefFor={toolItem}
      heading={trackCopy.tools.heading}
      body={trackCopy.tools.body}
      empty={trackCopy.tools.empty}
      testId="page-tools"
    />
  );
}
```

Create `src/app/speaking/page.tsx` identically, substituting `speaking`, `speakingItem`, `trackCopy.speaking`, `"Speaking"`, and `testId="page-speaking"`.

These routes sit outside the `(swe)` group, so they get the root layout only. Move `SiteNav` and `SiteFooter` from `src/app/(swe)/layout.tsx` into `src/app/layout.tsx` (wrapping `{children}` inside `ThemeProvider`) so every route gets the chrome, and reduce `(swe)/layout.tsx` to a passthrough — or delete the group entirely and move `page.tsx` to `src/app/page.tsx`. Prefer the latter: with one identity there is no reason for a route group.

- [ ] **Step 4: Write the e2e spec**

Create `e2e/track.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("track galleries", () => {
  for (const [path, testId] of [
    ["/tools", "page-tools"],
    ["/speaking", "page-speaking"],
  ] as const) {
    test(`${path} renders`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByTestId(testId)).toBeVisible();
    });

    test(`${path} shows either items or an honest empty state`, async ({
      page,
    }) => {
      await page.goto(path);
      const items = page.getByTestId("gallery-item");
      const count = await items.count();
      if (count === 0) {
        await expect(page.getByTestId("gallery-empty")).toBeVisible();
      } else {
        await expect(items.first()).toBeVisible();
        await expect(page.getByTestId("gallery-empty")).toHaveCount(0);
      }
    });
  }
});
```

- [ ] **Step 5: Run the gate and e2e**

Run: `npm run lint && npm run typecheck && npm test && npm run test:e2e`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components/track e2e
git commit -m "feat: add the tools and speaking galleries"
```

---

### Task 15: Item permalinks

**Files:**
- Create: `src/components/track/track-detail.tsx`, `src/app/tools/[slug]/page.tsx`, `src/app/speaking/[slug]/page.tsx`
- Modify: `e2e/track.spec.ts`

**Interfaces:**
- Consumes: `findItem`, `tools`, `speaking` (Task 13); `TrackGallery` siblings.
- Produces: `<TrackDetail item backHref backLabel />`; testids `page-track-item`, `track-item-back`.

**Version constraint:** in Next 16 a dynamic page's `params` is a **Promise** and must be awaited. See `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md:528`.

- [ ] **Step 1: Write the detail component**

Create `src/components/track/track-detail.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/section";
import type { TrackItem } from "@/content/track";

// The card, enlarged. Nothing longer — this is all a link preview consumes,
// and it keeps publishing an item to a few lines of data rather than a
// writing task.
export function TrackDetail({
  item,
  backHref,
  backLabel,
}: {
  item: TrackItem;
  backHref: string;
  backLabel: string;
}) {
  return (
    <Section as="main" className="py-24" data-testid="page-track-item">
      <article className="flex max-w-3xl flex-col gap-8">
        <Link
          href={backHref}
          data-testid="track-item-back"
          className="w-fit font-mono text-xs uppercase tracking-[0.16em] text-signal"
        >
          ← {backLabel}
        </Link>

        <div className="flex flex-col gap-3">
          <time
            dateTime={item.date}
            className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
          >
            {item.date}
          </time>
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            {item.title}
          </h1>
        </div>

        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            placeholder="blur"
            sizes="(min-width: 768px) 768px, 100vw"
            className="w-full rounded-2xl border border-rule object-cover"
          />
        ) : null}

        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          {item.blurb}
        </p>

        {item.link ? (
          <Link
            href={item.link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
          >
            {item.link.label} <span aria-hidden>↗</span>
          </Link>
        ) : null}
      </article>
    </Section>
  );
}
```

- [ ] **Step 2: Write the tools item route**

Create `src/app/tools/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrackDetail } from "@/components/track/track-detail";
import { findItem, tools, trackCopy } from "@/content/track";
import { routes } from "@/lib/routes";

// Prerender every item; 404 anything not in the collection rather than
// rendering an on-demand page for a slug that does not exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(tools, slug);
  if (!item) return {};
  return { title: item.title, description: item.blurb };
}

export default async function ToolItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(tools, slug);
  if (!item) notFound();

  return (
    <TrackDetail
      item={item}
      backHref={routes.tools}
      backLabel={trackCopy.tools.heading}
    />
  );
}
```

- [ ] **Step 3: Write the speaking item route**

Create `src/app/speaking/[slug]/page.tsx` with the same body, substituting `speaking`, `routes.speaking`, and `trackCopy.speaking.heading`. Repeat the code rather than abstracting — two ten-line route files that differ by a collection are clearer than a shared factory that has to be read to be understood.

- [ ] **Step 4: Add the e2e cases**

Append to `e2e/track.spec.ts`:

```ts
test.describe("item permalinks", () => {
  test("an unknown slug 404s", async ({ page }) => {
    const response = await page.goto("/tools/not-a-real-tool");
    expect(response?.status()).toBe(404);
  });

  test("a published item is reachable from its gallery", async ({ page }) => {
    await page.goto("/tools");
    const first = page.getByTestId("gallery-item").first();
    if ((await page.getByTestId("gallery-item").count()) === 0) {
      test.skip(true, "no tools published yet");
    }
    await first.click();
    await expect(page.getByTestId("page-track-item")).toBeVisible();
    await page.getByTestId("track-item-back").click();
    await expect(page.getByTestId("page-tools")).toBeVisible();
  });
});
```

- [ ] **Step 5: Run the gate, build, and e2e**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

Run: `npm run build`
Expected: succeeds. With both collections empty, `generateStaticParams` returns `[]` and no item pages are emitted — that is correct.

Run: `npm run test:e2e`
Expected: all pass, with the permalink navigation test skipped.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components/track e2e
git commit -m "feat: add per-item permalinks for tools and speaking"
```

---

### Task 16: Open Graph cards on the pine palette

**Files:**
- Create: `src/app/og/card.tsx`
- Create: `src/app/tools/[slug]/opengraph-image.tsx`, `src/app/speaking/[slug]/opengraph-image.tsx`
- Modify: `src/app/opengraph-image.tsx` (repaint)

**Interfaces:**
- Consumes: `tokens` (Task 2), `findItem`, `tools`, `speaking` (Task 13).
- Produces: `ogCard({ eyebrow, title, subtitle }): ReactElement` and `OG_SIZE`.

**Version constraint:** the image-generating function's `params` is a **Promise** in Next 16 and must be awaited. The existing root `opengraph-image.tsx` escapes this only because it takes no props. Satori cannot read CSS variables, so hex values are written in literally — from `tokens.ts`, never re-typed.

- [ ] **Step 1: Write the shared card**

Create `src/app/og/card.tsx`:

```tsx
import type { ReactElement } from "react";

import { tokens } from "@/lib/theme/tokens";

export const OG_SIZE = { width: 1200, height: 630 };

const t = tokens.dark;

// Satori resolves no CSS variables and inherits no stylesheet, so every value
// is literal. They come from tokens.ts so the card cannot drift off palette.
export function ogCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 96px",
        background: t.ground,
        color: t.ink,
        fontFamily: "system-ui, -apple-system, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "monospace",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: t.signal,
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 36, lineHeight: 1.2, color: t.muted }}>
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${t.rule}`,
          paddingTop: 28,
          fontFamily: "monospace",
          fontSize: 22,
          color: t.muted,
        }}
      >
        <span>Uzair Vawda</span>
        <span>uzairvawda.me</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Repaint the root OG image**

Replace the body of `src/app/opengraph-image.tsx` with the shared card — this also deletes the four hardcoded periwinkle swatches:

```tsx
import { ImageResponse } from "next/og";

import { OG_SIZE, ogCard } from "@/app/og/card";

export const alt = "Uzair Vawda — Engineer, MBA candidate";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    ogCard({
      eyebrow: "./uzair · portfolio",
      title: "Uzair Vawda.",
      subtitle: "Engineer. MBA candidate. NYC.",
    }),
    { ...size },
  );
}
```

- [ ] **Step 3: Write the tools item OG image**

Create `src/app/tools/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

import { OG_SIZE, ogCard } from "@/app/og/card";
import { findItem, tools } from "@/content/track";

export const alt = "Uzair Vawda — tool";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return tools.map((item) => ({ slug: item.slug }));
}

// Next 16: params is a Promise here and must be awaited.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(tools, slug);

  return new ImageResponse(
    ogCard({
      eyebrow: "tools",
      title: item?.title ?? "Tools",
      subtitle: item?.blurb ?? "One shippable tool per class.",
    }),
    { ...size },
  );
}
```

- [ ] **Step 4: Write the speaking item OG image**

Create `src/app/speaking/[slug]/opengraph-image.tsx` the same way with `speaking`, `eyebrow: "speaking"`, and the fallback subtitle `"Talks, workshops, panels."`. Speaking items that carry an event photo should use it directly — add, before the `ImageResponse` return:

```tsx
  if (item?.image) {
    // The event photo is the better preview; serve it rather than a card.
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={new URL(item.image.src.src, process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzairvawda.me").toString()}
            alt=""
            width={size.width}
            height={size.height}
            style={{ objectFit: "cover" }}
          />
        </div>
      ),
      { ...size },
    );
  }
```

- [ ] **Step 5: Build and verify the images render**

Run: `npm run build && npx next start -p 3100`

Run: `curl -sI http://localhost:3100/opengraph-image | head -3`
Expected: `200`, `content-type: image/png`.

Open `http://localhost:3100/opengraph-image` in a browser and confirm it is pine, not indigo, with no colour swatches.

- [ ] **Step 6: Run the gate**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/app
git commit -m "feat: repaint OG cards to pine and add per-item previews"
```

---

### Task 17: Flat navigation and the MBA track summary

**Files:**
- Create: `src/components/sections/track.tsx`
- Modify: `src/components/site-nav.tsx` (full rewrite), `src/components/site-footer.tsx`
- Modify: `src/app/page.tsx` (formerly `src/app/(swe)/page.tsx`), `src/content/sections.ts`
- Modify: `e2e/routes.spec.ts`
- Delete: `src/components/mba-mobile-nav.tsx`

**Interfaces:**
- Consumes: `routes` (Task 1), `tools`, `speaking`, `trackCopy` (Task 13), `eyebrow` (Task 5).
- Produces: `<SiteNav />` with no `variant` prop; `<TrackSection />`.

- [ ] **Step 1: Rewrite the nav**

`MbaMobileNav` is statically imported here, which pulls Sheet and lucide into every bundle for a component that only ever rendered on `/mba`. The rewrite removes both.

Replace `src/components/site-nav.tsx`:

```tsx
import Link from "next/link";

import { ThemeToggleWithHint } from "@/components/theme-toggle-with-hint";
import { speaking, tools } from "@/content/track";
import { RESUME_DOWNLOAD_NAME, routes } from "@/lib/routes";

// Flat: Work · Tools · Speaking · About · Contact, all peers. No MBA hub and
// no dropdown — the MBA work sits alongside the engineering work.
//
// Tools and Speaking appear only once they have something in them. A nav
// entry leading to an empty page is worse than no nav entry.
const links = [
  { href: routes.work, label: "Work", testId: "nav-work", show: true },
  {
    href: routes.tools,
    label: "Tools",
    testId: "nav-tools",
    show: tools.length > 0,
  },
  {
    href: routes.speaking,
    label: "Speaking",
    testId: "nav-speaking",
    show: speaking.length > 0,
  },
  { href: routes.about, label: "About", testId: "nav-about", show: true },
  { href: routes.contact, label: "Contact", testId: "nav-contact", show: true },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-background/80 px-6 backdrop-blur sm:px-8 md:px-12 lg:px-16">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <Link
          href={routes.home}
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-signal"
        >
          ./uzair
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testId}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                {link.label}
              </Link>
            ))}
          <Link
            href={routes.resume}
            download={RESUME_DOWNLOAD_NAME}
            data-testid="nav-resume"
            className="text-sm text-signal transition-colors hover:text-foreground"
          >
            Résumé
          </Link>
          <ThemeToggleWithHint />
        </div>
      </nav>
    </header>
  );
}
```

Update `src/app/layout.tsx` (or wherever the nav is mounted after Task 14's layout move) to `<SiteNav />` with no prop, and drop the `variant` prop and the SWE/MBA cross-link from `src/components/site-footer.tsx` — its signature becomes `SiteFooter()` with the three external links plus `footer-resume`.

```bash
git rm src/components/mba-mobile-nav.tsx
```

- [ ] **Step 2: Write the track section**

Create `src/components/sections/track.tsx`:

```tsx
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { speaking, tools, trackCopy } from "@/content/track";
import { routes } from "@/lib/routes";

// A summary of the track, not the track content itself: what it is, the most
// recent few items, and links into the galleries. The items live at their own
// routes because each needs a shareable URL.
const recent = [...tools, ...speaking]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 4);

export function TrackSection() {
  return (
    <Section id="track" className="py-24" data-testid="section-track">
      <div className="flex flex-col gap-8 border-l-2 border-signal bg-tint px-8 py-10 md:px-12 md:py-14">
        <Reveal className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {eyebrow("track")}
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {trackCopy.section.heading}
          </h2>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {trackCopy.section.body}
          </p>
        </Reveal>

        {recent.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {recent.map((item) => (
              <li key={item.slug} className="text-base">
                <span className="font-mono text-xs text-muted-foreground">
                  {item.date}
                </span>{" "}
                {item.title}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap gap-6">
          <Link
            href={routes.tools}
            data-testid="track-link-tools"
            className="text-sm text-signal underline underline-offset-4"
          >
            Tools <span aria-hidden>→</span>
          </Link>
          <Link
            href={routes.speaking}
            data-testid="track-link-speaking"
            className="text-sm text-signal underline underline-offset-4"
          >
            Speaking <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
```

The section links into both galleries even while the nav does not: someone reading this block has context for an empty page; someone clicking a top-level nav item does not.

- [ ] **Step 3: Swap it into the page**

In `src/app/page.tsx`, replace the inline `mbaTeaser` block (the trailing `<Section>` with the `mbaTeaser` copy) with `<TrackSection />`, and delete `mbaTeaser` from `src/content/swe.ts` and its assertions from `src/content/swe.test.ts`.

Merge the MBA About paragraph into the main About: take the third paragraph of `about.bio` from `src/content/mba.ts` (the "the thing I'm after is the overlap" one), adapt it into `about.paragraphs` in `src/content/swe.ts`, and delete the line in the existing About copy that says the site is "split in two" — it is not any more.

- [ ] **Step 4: Update the e2e section order**

In `e2e/routes.spec.ts`, the expected array becomes:

```ts
    expect(ids).toEqual([
      "section-about",
      "section-experience",
      "section-work",
      "section-skills",
      "section-education",
      "section-interests",
      "section-contact",
      "section-track",
    ]);
```

Add a nav test to the same file:

```ts
  test("nav hides gallery routes until they have content", async ({ page }) => {
    await page.goto("/");
    // Both collections start empty; a nav entry leading to nothing is worse
    // than no nav entry. These assertions flip when the first item ships.
    await expect(page.getByTestId("nav-work")).toBeVisible();
    await expect(page.getByTestId("nav-tools")).toHaveCount(0);
    await expect(page.getByTestId("nav-speaking")).toHaveCount(0);
    // The track section still links into both galleries.
    await expect(page.getByTestId("track-link-tools")).toHaveAttribute(
      "href",
      "/tools",
    );
  });
```

- [ ] **Step 5: Run the gate and e2e**

Run: `npm run lint && npm run typecheck && npm test && npm run test:e2e`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add -A src/components src/content src/app e2e
git commit -m "feat: flatten the navigation and add the MBA track summary"
```

---

### Task 18: Delete the MBA tree and redirect it

The last task: nothing links to `/mba/*` any more, so the routes can go and the redirects can take over.

**Files:**
- Modify: `next.config.ts` (add `redirects()`), `src/app/sitemap.ts`, `src/lib/routes.ts` (delete `legacyRoutes`), `src/lib/routes.test.ts`
- Modify: `e2e/routes.spec.ts`, `e2e/contact-form.spec.ts`
- Delete: `src/app/mba/**`, `src/content/mba.ts`, `src/components/mba-page-header.tsx`, `src/components/mba-empty-state.tsx`

**Interfaces:**
- Produces: `legacyRedirects: Array<{ source: string; destination: string; permanent: true }>` exported from `src/lib/routes.ts` and consumed by `next.config.ts`.

- [ ] **Step 1: Write the failing test**

Replace the `legacyRoutes` test in `src/lib/routes.test.ts` with:

```ts
import { legacyRedirects } from "./routes";

describe("legacy redirects", () => {
  it("maps every old mba path to its new home", () => {
    expect(legacyRedirects).toEqual([
      { source: "/mba", destination: "/", permanent: true },
      { source: "/mba/about", destination: "/#about", permanent: true },
      { source: "/mba/tools", destination: "/tools", permanent: true },
      { source: "/mba/speaking", destination: "/speaking", permanent: true },
      { source: "/mba/journal", destination: "/", permanent: true },
    ]);
  });

  it("issues 308s so link equity and request method survive", () => {
    expect(legacyRedirects.every((r) => r.permanent)).toBe(true);
  });

  it("points every destination at a live route", () => {
    const live = new Set<string>([
      routes.home,
      routes.about,
      routes.tools,
      routes.speaking,
    ]);
    for (const redirect of legacyRedirects) {
      expect(live.has(redirect.destination), redirect.source).toBe(true);
    }
  });
});
```

Also delete the earlier `"still carries the legacy mba tree"` test and drop `legacyRoutes` from the "absolute paths" test.

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/lib/routes.test.ts`
Expected: FAIL — `legacyRedirects` is not exported.

- [ ] **Step 3: Replace legacyRoutes with the redirect table**

In `src/lib/routes.ts`, delete the `legacyRoutes` const and add:

```ts
// The pre-redesign /mba tree. Config redirects run before the filesystem, so
// no page renders at all. `permanent: true` issues a 308, which preserves the
// request method and passes link equity to the new URL.
export const legacyRedirects = [
  { source: "/mba", destination: routes.home, permanent: true },
  { source: "/mba/about", destination: routes.about, permanent: true },
  { source: "/mba/tools", destination: routes.tools, permanent: true },
  { source: "/mba/speaking", destination: routes.speaking, permanent: true },
  { source: "/mba/journal", destination: routes.home, permanent: true },
] as const satisfies ReadonlyArray<{
  source: string;
  destination: string;
  permanent: true;
}>;
```

- [ ] **Step 4: Wire them into next.config.ts**

Read `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` first. Then add to the `nextConfig` object:

```ts
import { legacyRedirects } from "./src/lib/routes";

// ...
  async redirects() {
    return [...legacyRedirects];
  },
```

- [ ] **Step 5: Delete the tree**

```bash
git rm -r src/app/mba
git rm src/content/mba.ts src/components/mba-page-header.tsx src/components/mba-empty-state.tsx
```

- [ ] **Step 6: Update the sitemap**

In `src/app/sitemap.ts`, list the live routes only:

```ts
import { routes } from "@/lib/routes";
import { speaking, tools } from "@/content/track";
import { speakingItem, toolItem } from "@/lib/routes";

const paths = [
  routes.home,
  routes.tools,
  routes.speaking,
  ...tools.map((item) => toolItem(item.slug)),
  ...speaking.map((item) => speakingItem(item.slug)),
];
```

Keep the existing `.map()` shape; set `priority: 1` for `routes.home` and `0.7` otherwise, `changeFrequency: "monthly"` for the galleries and `"yearly"` for items. Redirected `/mba/*` paths must not appear.

- [ ] **Step 7: Migrate the contact-form e2e**

`e2e/contact-form.spec.ts` navigates to `/mba/about` in four tests (lines 5, 17, 38, 64) and asserts `submitted.source === "mba"` at line 48. The MBA contact form is gone; there is one form now, in the contact section on `/`. Change all four navigations to `await page.goto("/#contact")` and the source assertion to `"portfolio"`. Read the whole file first — its form locators may also need testids.

- [ ] **Step 8: Add redirect coverage to the route spec**

In `e2e/routes.spec.ts`, delete the five `/mba/*` route smoke tests and add:

```ts
  test("legacy mba paths 308 to their new homes", async ({ page }) => {
    for (const [from, to] of [
      ["/mba", "/"],
      ["/mba/tools", "/tools"],
      ["/mba/speaking", "/speaking"],
      ["/mba/journal", "/"],
    ] as const) {
      const response = await page.goto(from);
      expect(response?.ok(), from).toBe(true);
      expect(new URL(page.url()).pathname, from).toBe(to);
    }
  });
```

`/mba/about` redirects to `/#about`; a fragment does not survive a server redirect check the same way, so assert its pathname is `/`.

- [ ] **Step 9: Verify nothing references the old tree**

Run: `grep -rn "mba" src/ e2e/ --include="*.ts" --include="*.tsx" | grep -vi "legacyRedirects\|MBA candidate\|MBA at Baruch\|MBA track"`
Expected: no output.

- [ ] **Step 10: Run the full gate**

Run: `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e`
Expected: all pass. The build output should list `/`, `/tools`, `/speaking`, and no `/mba` routes.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: delete the mba tree and 308 its routes to the new homes"
```

---

## Final verification

Before opening the PR, run every gate once on a clean tree and confirm by eye:

- [ ] `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` — all green.
- [ ] Fresh private window, light mode: the overture plays once, unmounts, and the hero resolves to name, one line, `Résumé` + `See work`.
- [ ] Reload: no sequence, hero already resolved.
- [ ] `prefers-reduced-motion: reduce`: no canvas at all, sections fade only.
- [ ] Scroll the whole page in both themes: no moving layer behind any body copy, anywhere.
- [ ] `/tools` and `/speaking` show their empty states; neither appears in the nav.
- [ ] `/mba`, `/mba/tools`, `/mba/speaking`, `/mba/journal`, `/mba/about` all land on their new homes.
- [ ] `grep -rn "periwinkle\|columbia\|celadon\|scrim\|newsreader" src/` returns nothing.

Then use superpowers:requesting-code-review before merging, and superpowers:finishing-a-development-branch to integrate.
