# TODO — Content review and open items

> Tracking items the user wants to address later. Code is in good shape; these are content/copy/decisions that need an actual human pass.

---

## Phase 2 — SWE portfolio content to redline

All body copy lives in `src/content/swe.ts`. Below is what is currently a **first draft** that the user should approve, edit, or replace.

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
- CTA card heading: "Building a portfolio of consulting tools, one per MBA class."

### Hero CTA
- "See work" links to `#projects`. Confirm that's the right destination.

---

## Open visual decisions (Phase 2)

- Hero 3D element — does the icosahedron feel right? size, speed, position. Adjustable in `src/components/hero/wireframe-mesh.tsx`.
- Possible additions to SWE page not in the original doc: "Now" page, writing samples, personal statement. Currently out of scope.

---

## Deferred to later phases

- **OG images / rich SEO metadata** — Phase 7 dedicated section. Currently only basic titles + descriptions.
- **Mobile nav for MBA section** — Tools/Journal/Speaking/About links are hidden under `sm:` breakpoint. Mobile users on `/mba` can only get to `← swe`. Revisit in Phase 3 when building out MBA section.
- **Resume PDF** — needs uploading. Linked from MBA About page.
- **Profile photo crop** — me.jpeg is 5 MB. Consider optimizing or replacing.
