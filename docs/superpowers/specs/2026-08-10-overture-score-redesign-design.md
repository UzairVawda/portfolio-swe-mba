# The Overture Score — portfolio redesign

**Date:** 2026-08-10
**Status:** design approved, pending spec review
**Branch:** `feat/overture-score-redesign`

## Problem

The site is two sites. The SWE side runs a fixed three.js particle canvas behind every
section, which competes with the copy badly enough that two layers of radial-gradient
scrim were added to patch it. The MBA side is clean but nearly static, and four of its
five pages are empty states. Neither side is engaging enough to make a visitor act, and
the split forces every arrival to choose a door before seeing anything.

Audience, in priority order: **recruiters**, then engineers and product people as
near-equal peers. The goal is that people reach out.

## The design

One site. Three zones, each with a different motion treatment.

| Zone | Contents | Treatment |
| --- | --- | --- |
| Hero | Name, one line, two actions | **The Overture** — one three.js sequence on arrival, then it unmounts |
| Narrative | About, experience, education, interests, MBA track summary | **The Scroll Score** — soft reveal on entry, no snapping |
| Work | Projects, concepts, archive | **The Index** — numbered rows that expand in place |

The **MBA track summary** is a section on the main page, not the MBA content itself: a
short statement of what the track is, the latest three or four items, and links into
`/tools` and `/speaking`. The items themselves live at those routes because each one needs
a shareable URL — they get posted to LinkedIn individually. This is the one place the
single-page model is deliberately broken, and the reason is shareability rather than
design preference.

### Governing rule

**Nothing animates behind body copy, anywhere.** This is the rule the whole design exists
to satisfy. It is why the scrims are deleted rather than tuned: with no moving layer under
the text, there is nothing to scrim.

### Motion tiers

1. **The overture** — once per session, ~4s, skippable. The only real animation budget.
2. **Section reveals** — type unmask plus staggered fade on entry. Fire once, never loop.
3. **Micro** — index row expansion, rule-draw on hover. Everything else is still.

`prefers-reduced-motion: reduce` collapses tier 1 to the resolved document and tier 2 to a
≤150ms opacity fade. Tier 3 keeps functioning without transitions.

### Hero sequence

Constellation gathers → holds while the name resolves → disperses → the still document
rises. Ends on: headline, one line of positioning, `Résumé` and `See work`.

Requirements, all non-negotiable:

- Runs **once per session**, gated on `sessionStorage`. Never replays on back-navigation.
- **Skippable** — any keypress, click, or scroll resolves it immediately.
- Reduced-motion and low-end devices skip straight to the resolved document.
- The scene **unmounts** after resolving. No idle GPU cost for the rest of the visit.

Rationale: this is the fast path through two otherwise slow choices. A recruiter can act
within two seconds of the sequence ending, and never sees it twice.

## Palette — "Pine, tinted"

The ground is not white. Every neutral carries a green bias derived from the accent,
including the near-black. The accent works at two strengths: saturated pine under 5% for
marks and actions, and a tint doing all large-area work.

### Light

| Token | Value | Use |
| --- | --- | --- |
| `--ground` | `#EFF3EF` | page background |
| `--surface` | `#F7FAF7` | raised surfaces, nav, footer |
| `--tint` | `#DEEAE2` | active rows, callout bands, expanded detail, tag fills |
| `--ink` | `#0C1310` | body text, headings |
| `--muted` | `#566159` | secondary text, metadata |
| `--rule` | `#D6E0D8` | hairlines |
| `--rule-strong` | `#B9CCC0` | button borders, emphasis rules |
| `--signal` | `#1B6B4A` | links, eyebrows, active marks, primary button, overture |

### Dark

| Token | Value |
| --- | --- |
| `--ground` | `#0B0F0D` |
| `--surface` | `#131A16` |
| `--tint` | `#16241C` |
| `--ink` | `#EFF3EF` |
| `--muted` | `#8E9A92` |
| `--rule` | `#222E28` |
| `--rule-strong` | `#33443B` |
| `--signal` | `#4FBF8B` |

### Contrast — measured, all passing WCAG AA

| Pair | Light | Dark |
| --- | --- | --- |
| ink on ground | 16.79:1 | 17.22:1 |
| muted on ground | 5.77:1 | 6.60:1 |
| signal on ground | 5.77:1 | 8.41:1 |
| signal on tint | 5.22:1 | 7.03:1 |

Pine needs **no darkened link variant** in either theme — unlike the vermilion and amber
candidates, which failed AA as link text on light. This is the cleanest token story of the
six explored.

### Accent discipline

Saturated signal is permitted on: eyebrows, links, the primary button, the active row
name, section rules, tag borders, quote rules, overture particles.

Saturated signal is **forbidden** on: body copy, more than one solid button per screen,
any animated layer behind text, and full-bleed section backgrounds (large areas use
`--tint`).

### Typography

- **Display / body** — Satoshi (already wired via `next/font/local`, verified current)
- **Mono** — JetBrains Mono, unchanged
- **Newsreader is removed.** With the editorial voice not chosen, it is a font loaded for
  nothing.

The `[data-section="mba"]` block that swaps `--font-sans` to Inter is deleted along with
the rest of the second palette.

## Content model

**No MDX.** With the journal dropped, nothing on this site is article-shaped. Tools and
speaking are card-shaped — image, blurb, link — which fits the existing typed
`src/content/` pattern exactly. This avoids `@next/mdx`, `@mdx-js/loader`,
`@mdx-js/react`, `@types/mdx`, a `pageExtensions` config change, and a root
`mdx-components.tsx`. Four dependencies and two config surfaces that buy nothing here.

### The collection type

One shape, two data sources:

```ts
type TrackItem = {
  slug: string;              // the shareable URL segment
  title: string;
  date: string;              // ISO
  blurb: string;             // 1-3 sentences
  image?: { src: StaticImageData; alt: string };
  link?: { label: string; href: string };
};
```

Images are **static imports**, which give Next intrinsic dimensions and a blur placeholder
for free and avoid the `next/image` missing-dimensions error that catches plain string
sources.

### Volume

| Section | Expected over 2 years | Shape |
| --- | --- | --- |
| Tools | 16–20 | card + permalink |
| Speaking | 25–35 | card + permalink, photo-led |
| About | — | **merged into the single site About** |

~45 items across two galleries. At that size a gallery reads as accumulated evidence
rather than clutter, which is the argument for keeping this on one site rather than
splitting it out.

The MBA About merges. A unified site should not introduce its author twice; the
engineer-plus-MBA combination is the thing worth stating once, well.

### Item pages

A `/tools/[slug]` or `/speaking/[slug]` page is **the card, enlarged**: image, blurb,
link, date, and a route back to the gallery. Nothing longer. This is all LinkedIn consumes,
and it keeps publishing an item to a few lines of data rather than a writing task.

`generateStaticParams` prerenders every item; `dynamicParams = false` 404s anything not in
the collection.

### Open Graph images

Each item needs a good LinkedIn preview, since that is the stated distribution channel.

- **Speaking** items use their event photo directly.
- **Anything without a photo** — most tools — falls back to a generated card: the item
  title set on the pine palette via `ImageResponse`.

Implemented as `opengraph-image.tsx` inside each `[slug]` segment. **Version constraint:**
in Next 16 the image-generating function receives `params` as a **Promise** and must await
it. The existing root `opengraph-image.tsx` escapes this only because it takes no props.

## Routes

```
/                      hero + narrative + work index + MBA summary + contact
/tools                 gallery
/tools/[slug]          card, enlarged            shareable
/speaking              gallery
/speaking/[slug]       card, enlarged            shareable
```

**Navigation is flat:** Work · Tools · Speaking · About · Contact, all peers. No MBA hub
and no dropdown — the MBA work sits alongside the engineering work rather than nested
under it, which is the whole point of unifying.

Redirects via `async redirects()` in `next.config.ts` with `permanent: true` (issues 308,
which preserves request method and link equity). Config redirects run before the
filesystem, so no page renders at all:

| From | To |
| --- | --- |
| `/mba` | `/` |
| `/mba/about` | `/#about` |
| `/mba/tools` | `/tools` |
| `/mba/speaking` | `/speaking` |
| `/mba/journal` | `/` |

**Route strings are currently duplicated across seven places** — `navItems`,
`about.overview[].route`, hardcoded links in `site-nav.tsx`, `sitemap.ts`, the
`mba-empty-state` default `ctaHref`, and two e2e specs. A typed route manifest is
extracted first, before anything moves, so renames become one-file changes.

## Deletions

| What | Why |
| --- | --- |
| `.section-scrim`, `.section-scrim-layer` | nothing animates behind text any more |
| `scrim` prop on `Section` | same |
| Hero inline radial gradient | same |
| `[data-section="mba"]` palette blocks (~48 lines) | one identity |
| `--periwinkle`, `--columbia`, `--celadon` | only two consumers, both rewritten |
| Newsreader font | serif voice not chosen |
| `@react-three/drei` | installed but imported nowhere |
| `runtime = "edge"` in `opengraph-image.tsx` | deprecated in Next 16; docs say remove it |

`MbaMobileNav` is currently statically imported into the shared `site-nav.tsx`, pulling
Sheet and lucide into the SWE bundle for a component that never renders there. Resolved by
the nav rewrite.

## Things that must be updated by hand

- **`opengraph-image.tsx`** hardcodes the entire old periwinkle palette. Satori cannot read
  CSS variables, so new values must be written in literally.
- **`layout.tsx` `viewport.themeColor`** duplicates token values as literals.
- **`particle-cloud.tsx`** hardcodes `#9b9bff` on both materials. The scene is currently
  theme-blind; it must read the pine signal and respond to light/dark.

## Test strategy

The suite is tightly coupled to copy and routes, and runs behind a full production build,
so iteration is slow. Known breakages, addressed per stage:

- `e2e/routes.spec.ts` asserts headline strings verbatim, the `01`–`09` eyebrow ladder in
  DOM order, exactly four `resume.pdf` links, and a visible `<canvas>` on `/`. **All four
  break.**
- `e2e/contact-form.spec.ts` navigates to `/mba/about` in four tests.
- `src/content/swe.test.ts` asserts the eyebrow sequence and many literal copy substrings.
- `src/lib/scene/*.test.ts` (~34 tests) stay valid — the scene logic survives, it just
  mounts somewhere else.

**Change:** e2e locators move from copy strings to `data-testid` before the copy changes.
Asserting prose in end-to-end tests makes the lowest-risk part of a redesign the most
expensive one.

**Gap worth closing:** no test asserts any colour, token, or theme state. A full repalette
passes the entire suite green. Stage 1 adds a contrast regression test so the AA guarantees
above are enforced rather than asserted once in a document.

## Staged delivery

One branch, five reviewable PRs, merged to `main` only when the whole thing holds together.

| Stage | Contents |
| --- | --- |
| 1 | Route manifest, `data-testid` migration, contrast test, token rewrite, delete scrims + MBA palette |
| 2 | Overture hero — session gate, skip, unmount, reduced-motion path, theme-aware scene |
| 3 | Work index — expanding rows replacing the project cards |
| 4 | Scroll-score reveals across narrative sections |
| 5 | Tools + speaking galleries and item routes, per-item OG images, route moves and redirects, root OG repaint |

Stage 1 is deliberately unglamorous and deliberately first: it makes every later stage
cheap to verify.

## Risks

1. **Two slow choices stacked in front of the fastest audience.** The overture costs ~3s,
   the scroll score costs a screen per idea. Mitigated by the session gate, the skip, and
   putting `Résumé` in the resolved hero and the persistent nav. If it still measures slow,
   the overture is the first thing to cut — it is deliberately built to be removable.
2. **The eyebrow ladder is asserted in two places** and locks section order. Renumbering is
   a three-file change. Handled in stage 1.
3. **Empty galleries on day one.** Tools and speaking both start at zero, and an empty
   gallery is exactly the problem the current MBA section has. Each ships with an honest
   empty state that states the cadence and when the first item lands — and neither route
   is linked from the main nav until it has at least one item in it. A nav entry leading
   to nothing is worse than no nav entry.
4. **Cadence is a commitment.** ~10 tools and ~15 speaking items a year is the stated
   plan. If it slips, the honest move is to drop the stated cadence from the copy rather
   than let a visible gap accumulate. Nothing on the site should promise a rhythm it
   isn't keeping.
5. **The journal was dropped, not deferred.** Re-adding it later means reintroducing MDX
   or writing prose into typed modules. That's a real cost — worth paying only if you find
   you actually want to write, not on the assumption that you might.
