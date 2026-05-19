# TODO — Content review and open items

> Tracking items the user wants to address later. Code is in good shape; these are content/copy/decisions that need an actual human pass.

---

## Phase 2 — SWE portfolio content to redline

All body copy lives in `src/content/swe.ts`. Below is what is currently a **first draft** that the user should approve, edit, or replace.

### Beef up content across the SWE side
The current page reads thin in places — body copy was drafted without deep input. Areas that need fleshing out:
- **Work history** is the biggest gap. Each role currently has a single best-guess sentence. Each role should ideally say:
  - What the team did and what scope/scale it operated at
  - 1–2 concrete things shipped (project name, impact, or measurable outcome)
  - Tech stack actually used (so the Skills section is anchored in real usage)
- **About paragraphs** could be deeper — currently 2 short paragraphs. Add a third paragraph on the consulting-MBA pivot rationale ("why I'm doing this").
- **JHParking** could use 1–2 more sentences on what makes it interesting beyond the elevator pitch.
- **Education** could include a one-line "what I'm focusing on at Baruch" (e.g. data & AI specialization, consulting club involvement).
- **Off-screen blurbs** should be real (covered separately below).


### About paragraphs
> "I'm a software engineer with experience across aerospace, financial services, and legal tech. I'm currently shipping at Collins Aerospace and pursuing my MBA at Baruch's Zicklin School of Business."
>
> "The plan: pair an engineering foundation with the business instincts that turn good code into useful products. On the side I build JHParking, train jiu jitsu, and live in NYC."

### Experience role descriptions (all best-guesses — original doc had no detail)
- **Collins Aerospace · Software Developer** — "Building internal tooling and product features for aerospace systems."
- **Collins Aerospace · Infrastructure PM** — "Drove infrastructure rollout projects across multiple business units as part of the leadership rotation."
- **Collins Aerospace · Applications Licensing Specialist** — "Managed enterprise application licensing and vendor relationships during the first rotation of the leadership program."
- **JP Morgan Chase · Front End Experience Developer** — "Built internal banking experiences with React across the firm's wealth management platform."
- **Dechert LLP · IT Applications Developer** — "Developed internal legal-tech applications used by attorneys and IT staff across the firm."

### JHParking project description
> "A peer-to-peer marketplace for renting parking spots. Owners list driveway and garage availability; drivers book and pay through the app. The live booking layer runs on Firestore, payments on Stripe."

- JHParking link `https://jhparking.app` is a guess — replace with real URL.

### Section headings (editorial — fine to swap)
- Experience: "Six years across aerospace, finance, and legal tech."
- Skills: "The current toolkit."
- Projects: "What I'm building right now."
- Education: "Formal training, in progress."
- About: "Building software, learning business."
- Off-screen: "What I'm doing when I'm not at the keyboard."
- CTA card heading: "Building a portfolio of consulting tools, one per MBA class."

### Off-screen (Interests) — needs real content
Cards currently use placeholder blurbs and lucide icons. Replace with:
- **Real blurbs** in `src/content/swe.ts` (the `interests` array) — each one should sound like the user, not me
- **Real pictures** instead of (or in addition to) the icons — e.g. a jiu jitsu mat photo, a sample photograph, a coffee setup, a travel shot. Requires:
  - Adding image files to `public/interests/` (suggested folder)
  - Updating the `Interest` type in `swe.ts` to include an `image` field
  - Updating `src/components/sections/interests.tsx` to render an `Image` component instead of (or above) the icon badge

Current draft blurbs to redline:
- Jiu jitsu — "Training on the mats keeps me honest about losing and learning."
- Photography — "Cameras taught me composition long before code did."
- Coffee — "Pour-overs at home, espresso when I'm out."
- Traveling — "Notes from new cities tend to end up shaping side projects."

### Hero CTA
- "See work" links to `#projects`. Confirm that's the right destination.

---

## Open visual decisions (Phase 2)

- Hero 3D element — does the icosahedron feel right? size, speed, position. Adjustable in `src/components/hero/wireframe-mesh.tsx`.
- Possible additions to SWE page not in the original doc: "Now" page, writing samples, personal statement. Currently out of scope.

---

## Phase 3 — MBA section content to redline

All MBA copy lives in `src/content/mba.ts`. Drafted by Claude — replace anything that doesn't sound like you.

### Landing (`/mba`)
- Headline: "A working portfolio of consulting tools built one per class."
- Subhead: "Software engineer, MBA candidate. Each class produces a shippable tool — published here as it ships."

### Section pages (`/mba/tools`, `/mba/journal`, `/mba/speaking`)
Each has an eyebrow + headline + subhead + empty-state body. Current drafts:
- **Tools** — "One shippable tool per class." / empty state mentions CIS 9000.
- **Journal** — "Synthesis, not summary." / empty state explains writing starts with first class.
- **Speaking** — "Talks, workshops, panels." / empty state says posted after each event.

### `/mba/about`
- Three bio paragraphs (engineer background → site explanation → consulting target). All drafted; redline.
- Three section-overview card descriptions (Tools / Journal / Speaking).
- Contact form headline ("Get in touch.") + description.

### Resume PDF
- Drop the actual file at `public/resume.pdf` so the `/mba/about` Resume link resolves. Until then it 404s.

---

## Deferred to later phases

- **OG images / rich SEO metadata** — Phase 7 dedicated section. Currently only basic titles + descriptions.
- **Profile photo crop** — me.jpeg is 5 MB. Consider optimizing or replacing.
- **Real interests photos** (covered above under Off-screen) — replace lucide icons with real images.
- **Robust rate limiting** — Phase 4 ships a simple time-based rate limit (using Supabase as the store). If abuse becomes a real concern post-launch, swap to Upstash Ratelimit (free tier, well-tested edge-friendly library).
