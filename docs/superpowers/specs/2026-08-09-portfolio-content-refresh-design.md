# Portfolio Content Refresh & CV Attachment — Design

**Date:** 2026-08-09
**Status:** Approved (brainstorm), pending implementation plan
**Scope:** Both sections — SWE portfolio (`/`) and MBA section (`/mba`). Content and
copy only, plus three new sections and CV links. No changes to the particle field,
theming, or the contact API.

## Summary

The site's copy has never been personalized. Both content files still carry the note
*"Drafted by Claude — redline anything that doesn't sound like you."* Experience entries
are one generic line each, only one project is listed, the skills list reads like a 2021
front-end developer, and `public/resume.pdf` is stale.

This replaces all of it with real content drawn from the master CV
(`Uzair-Vawda-CV-MASTER.md`), rewrites the site in a warm story-driven first-person
voice, attaches the current CV PDF in four places, and adds three new sections:
**Archive**, **Let's talk** (contact), and status-badged project cards.

The organizing idea: the site is an **open invitation**, not a closed résumé. Every
project appears regardless of stage — shipped, piloting, in development, or still a
document — each labeled honestly and each open to collaboration.

## Decisions (from brainstorm)

| Question | Decision |
| --- | --- |
| Which projects appear? | **All of them**, every stage, honestly labeled |
| How do people connect? | **One open invitation** after the projects, with a contact form |
| Collins metrics | **Scale metrics yes, dollar figures no** |
| CV placement | **All four**: hero button, nav, footer, inline in About |
| Interests | All four are real (jiu jitsu, photography, coffee, traveling); rewrite blurbs only |
| Voice | **Story-driven** — leads with the why behind each thing |
| Positioning | **AI-era product engineer × engineer/business hybrid** |
| MBA section | **Rewrite copy, keep empty states honest** |
| MIST | Surfaced as a leadership entry in Experience, not a hobby card |

## Content principles

1. **Data-driven.** All copy lives in `src/content/swe.ts` and `src/content/mba.ts`.
   No prose hardcoded into components. Future edits are one file, not a hunt.
2. **Honest staging.** Nothing unbuilt is described as if it ships. Status badges are
   load-bearing, not decorative.
3. **No invented biography.** Every personal claim traces to the master CV or to
   material the author supplied directly. See *Outstanding dependency* below.
4. **Metrics without employer financials.** Scale and impact figures are used freely;
   internal dollar amounts are not.

## Page flow

**Current:** Hero → About `01` → Experience `02` → Skills `03` → Projects `04` →
Education `05` → Interests `06` → MBA CTA `07`

**New:** Hero → About `01` → Experience `02` → **Projects `03`** → **Archive `04`** →
Skills `05` → Education `06` → Off-screen `07` → **Let's talk `08`** → MBA CTA

Projects moves ahead of Skills — it is the strongest material and the section the
collaboration invitation depends on. Section eyebrow numbers renumber accordingly.

## Section detail

### About `01`

Story-driven first person. Opens on the pattern behind the work (notice friction, sit
with it, build the thing), then places the day job, the MBA, and the side projects.
Includes an inline CV link phrased as an invitation rather than a download button.

Photo and sticky-column layout unchanged.

### Experience `02`

`Role` type gains `highlights: string[]`. Each role carries real bullets.

- **Collins Aerospace — Software Engineer** (Nov 2022–Present). RFCC design system,
  the Poolside AI agent, and Skyler appear as highlights inline rather than as separate
  case-study routes — one scroll, no new pages to maintain. Metrics used: 50+ accessible
  components, adopted by 5+ projects, ~80% faster component creation, 5 custom components
  shipped by the agent, platform-wide TypeScript migration.
- **Collins Aerospace — Infrastructure Project Manager, LDP** (Mar–Oct 2022). 6 projects,
  2 delivered, Scrum practices introduced, PM artifacts standardized org-wide.
- **Collins Aerospace — Applications Licensing Specialist, LDP** (Jul 2021–Feb 2022).
  18% license reduction, 75+ applications consolidated across 6 servers, React/Python
  tracking tool.
- **J.P. Morgan Chase & Co. — Front-End Experience Developer** (Apr–Oct 2020). Marked as
  a Drexel co-op.
- **Dechert LLP — IT Applications Developer** (Apr–Oct 2019). Marked as a Drexel co-op.
- **MIST — Finance Coordinator** (2017–2021). Budget ownership across four tournament
  cycles, 5–20% YoY growth, corporate sponsorship including PwC, live event production.

Marking JPM and Dechert as co-ops explains the 2019–2020 gaps rather than leaving them
reading as short stints.

**Excluded:** the ~$25K retired-tooling figure and the $66K/yr licensing saving.

### Projects `03`

`Project` type gains `status: string` and `helpWanted: string` (one line on what
collaboration would actually be useful).

**Full cards — active work:**

| Project | Status |
| --- | --- |
| JHParking | Piloting · 7 beta users |
| MatAI | In development |
| CoachMe | Design stage · 5 coaches committed |

Each surfaces one or two lines of actual reasoning, not just a category label — for
MatAI, why relational dyad-state classification beats conventional multi-object tracking
under grappling occlusion; for CoachMe, why separate charges and transfers were chosen
over destination charges so funds can sit in escrow. This reasoning is the strongest
evidence of product judgment in the source material and is wasted if compressed to
"AI video analysis."

**Compact three-up grid — earlier concepts:** PageKeeper, MBA-Engineered, Connect.

Everything is included; the active work is not buried under the concepts.

### Archive `04`

New section. Accordion, collapsed by default, using the existing
`src/components/ui/accordion.tsx`. Grouped as the master CV groups them:

- **Marketplaces & Products** — ParkForLess, 718SNKRS, Reddit Clone
- **Web & Full-Stack** — DragonFeed, Curriculum App, Project Tracker, ExpressBlog,
  ChatApp, Dynamic Site / Hosting, Web Portfolio
- **Automation & Data** — Send a Script, Investment Tracker (invs)

Each entry: name, one line, stack.

### Skills `05`

Replaces the four technical buckets (Languages / Frameworks / Tools / Databases) with
the master CV's four:

- **Engineering & Platform**
- **AI & Data**
- **Product Management**
- **Strategy & Advisory**

This is where the chosen positioning becomes visible in evidence rather than asserted in
prose. The current buckets actively work against it.

### Education `06`

- **Baruch College, Zicklin** — MBA, Artificial Intelligence & Product Development
  concentration, expected June 2028.
- **Drexel University, CCI** — B.S. Software Engineering, 3.5 GPA, co-op program.

Certifications: PMP (expected Dec 2026), CSM (Apr 2022), CSPO (Oct 2022), 100 Days of
Front-End Development (Aug 2022).

### Off-screen `07`

All four existing interests retained — jiu jitsu, photography, coffee, traveling — with
blurbs rewritten in the story voice. A fifth card covers languages (English, Urdu,
Gujarati, conversational Spanish). MIST moves out of this section into Experience.

### Let's talk `08`

New section. Warm open invitation — any of these projects interesting, whether that means
writing code or just talking the idea through — above a contact form.

Reuses the existing `ContactForm`. The component currently hardcodes
`defaultValues.source = "mba"`; it gains a `source` prop. The Zod schema at
`src/lib/validation/contact.ts` already accepts `"portfolio"`, so no schema, API, or
database change is required.

### MBA section

Same voice and the updated positioning. Empty states stay honest — no fabricated tools,
posts, or speaking events. The substantive change is the bio: "targeting consulting roles
where the work is technical" is replaced by the AI-product-engineering and
engineer/business-hybrid framing, so the two halves of the site stop contradicting each
other. The AI & Product Development concentration is named.

## CV attachment

The new PDF (`/Users/uzairvawda/Documents/Uzair-Vawda-CV.pdf`) replaces
`public/resume.pdf`. The path is kept so the existing `/mba/about` link does not break.

Links carry `download="Uzair-Vawda-CV.pdf"` so the file saves under a meaningful name
rather than "resume.pdf".

Placement:

| Location | Treatment |
| --- | --- |
| Hero | Button beside "See work" |
| Nav | Persistent link, both `swe` and `mba` variants |
| Footer | Beside GitHub and LinkedIn, both variants |
| About `01` | Inline in the closing paragraph |

## Files

**New:**

- `src/components/sections/archive.tsx`
- `src/components/sections/contact.tsx`

**Modified:**

- `src/content/swe.ts` — rewritten; types extended
- `src/content/mba.ts` — bio and empty-state copy
- `src/components/contact-form.tsx` — `source` prop
- `src/components/hero/hero.tsx` — CV button
- `src/components/site-nav.tsx` — CV link, both variants
- `src/components/site-footer.tsx` — CV link, both variants
- `src/components/sections/about.tsx` — inline CV link
- `src/components/sections/experience.tsx` — render highlights
- `src/components/sections/projects.tsx` — status badge, help-wanted line, compact variant
- `src/components/sections/skills.tsx` — new bucket structure
- `src/components/sections/education.tsx` — detail fields
- `src/components/sections/interests.tsx` — fifth icon (languages)
- `src/app/(swe)/page.tsx` — section order, new sections, metadata
- `public/resume.pdf` — replaced

## Testing

Existing tests assert form validation behaviour, not copy, so content changes do not
break them. `e2e/contact-form.spec.ts` targets the MBA form; a case is added for the new
portfolio-side form, including that it submits `source: "portfolio"`.

Gate before completion: `npm run lint`, `npm run typecheck`, `npm run test`,
`npm run test:e2e`, `npm run build`.

## Out of scope

- Per-project contact CTAs that pre-fill the form (considered; one invitation chosen)
- Separate case-study routes for RFCC, Skyler, or the ventures
- Seeding real MBA tools, journal posts, or speaking events
- Merging the SWE and MBA sections into one story
- Design-system, theming, or particle-field changes

## Outstanding dependency

**The origin stories are required before the copy can be written.** The chosen
story-driven voice depends on true specifics — what actually prompted JHParking (and why
ParkForLess was revived), the moment that prompted MatAI, how the five CoachMe coaches
came about, what was broken at Collins before RFCC and Poolside, and the jiu jitsu
background. None of this is in the master CV.

Placeholder or plausible-sounding invented detail is explicitly not acceptable here: it
would be a worse outcome than the generic copy being replaced, because it would read as
personal and be false. Structural implementation may proceed ahead of these; the About
section, project narrative lines, and interest blurbs cannot be finalized without them.
