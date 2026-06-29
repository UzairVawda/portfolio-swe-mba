# SWE Persistent Particle Field — Design

**Date:** 2026-06-07
**Status:** Approved (brainstorm), pending implementation plan
**Scope:** SWE portfolio page (`/`) only. The MBA section is untouched.

## Summary

Replace the hero-boxed wireframe icosahedron with a single **persistent particle
cloud** that lives behind the entire SWE page. The cloud assembles into the
icosahedron in the hero, then — driven by page scroll — abstractly condenses,
rotates, and disperses as the visitor moves down, with gentle cursor parallax.
It sits full-bleed behind all content at low opacity so text always wins.

This threads one continuous visual element through the whole page instead of an
animation that is stranded in the hero.

## Decisions (from brainstorm)

| Question | Decision |
| --- | --- |
| What follows the page? | A single persistent 3D object behind all content |
| Object form | A **particle system** (points), assembling into the icosahedron |
| Morph behaviour | **Abstract flow** — condense / rotate / disperse with scroll; no literal per-section shapes |
| Prominence | **Subtle, full-bleed** behind text, low opacity (~0.2). Text is always the hero. |
| Mobile | **Scaled-down but still animated.** Particle count by device; static frame for reduced-motion. |
| Implementation approach | **A** — `@react-three/fiber` + JS-interpolated positions (no custom GLSL) |
| Hero layout | Re-centered single column; boxed hero canvas removed |

### Approaches considered

- **A (chosen):** `@react-three/fiber` with JS-interpolated positions. Genuinely 3D,
  continuous with the current hero object, tunable without shader expertise,
  pure/testable math, comfortably handles the chosen 700–5000 particle budgets. Shape
  targets are generated from three's built-in geometry (e.g. `IcosahedronGeometry`
  vertices) plus a small seeded PRNG for deterministic dispersion — **no new runtime
  dependency** (`@react-three/fiber`, `three`, and `@react-three/drei` are already
  installed; `maath` is optional and not required).
- **B:** custom GPU vertex shader (GPGPU-lite). Supports 10k+ particles but is overkill
  for a low-opacity ambient backdrop and harder to maintain.
- **C:** 2D `<canvas>` particle field. Lightest, but no real depth and cannot morph
  convincingly from the icosahedron — discards the look already approved.

## Architecture

A single fixed `<Canvas>` is mounted once in `src/app/(swe)/layout.tsx`, full-bleed
behind all content (`fixed inset-0 -z-10 pointer-events-none`), dynamically imported
with `ssr: false`. It renders one `Points` cloud that persists for the whole page.

Guiding principle: **pure, testable math in `src/lib/scene/`; thin R3F glue in
`src/components/scene/`.** Scroll and cursor feed the cloud through **refs, never React
state**, so scrolling never triggers a React re-render.

### Components & files

**Pure logic (unit-tested, no React/three rendering):**

- `src/lib/scene/shapes.ts` — position-target generators returning `Float32Array`:
  - `icosahedronPoints(n): Float32Array`
  - `spherePoints(n): Float32Array`
  - `dispersedPoints(n, seed?): Float32Array`
  - All deterministic for a given input. Length is always `n * 3`.
- `src/lib/scene/choreography.ts` — `scrollToState(progress: number): SceneState`
  where `SceneState = { fromShape, toShape, blend, rotationY, dispersion }`.
  Maps page scroll `0→1` onto the keyframe timeline (hero = crisp icosahedron,
  mid = condense/rotate, between-sections = soft disperse). Clamps inputs outside `[0,1]`.
- `src/lib/scene/device.ts` — `particleBudget(width: number, coarsePointer: boolean): number`
  returning `700 | 1500 | 5000`.

**R3F glue (client components):**

- `src/components/scene/particle-field.tsx` — the fixed `<Canvas>` wrapper. Sets up
  passive `scroll` and `pointermove` listeners that write to refs; clamps `dpr` to
  `[1, 1.5]`; switches `frameloop` to `"demand"` for reduced-motion or a hidden tab.
- `src/components/scene/particle-cloud.tsx` — the `Points` object. In `useFrame`:
  read `scrollRef` → `scrollToState()` → `lerp` current positions toward the blended
  target, apply rotation and pointer parallax on the parent group.
- `src/components/scene/particle-field-mount.tsx` — the `dynamic(..., { ssr: false })`
  boundary that the layout imports.

**Removed:** `src/components/hero/hero-canvas.tsx` and
`src/components/hero/wireframe-mesh.tsx` — the particle icosahedron supersedes them.

### Data flow

```
passive scroll listener  ──► scrollRef (0..1) ─┐
passive pointer listener ──► pointerRef {x,y} ─┤
                                               ▼
                 useFrame (every frame, no React render):
                   state = scrollToState(scrollRef.current)
                   positions.lerp(toward blended shape target)
                   group.rotation / parallax ← state + pointerRef
                   geometry.attributes.position.needsUpdate = true
```

No allocations occur inside the render loop; the single position `BufferAttribute`
is mutated in place.

## Performance & device scaling

- **Particle budget** is chosen once on mount via `particleBudget()`:
  desktop `~5000`, tablet `~1500`, phone `~700`.
- **SSR-safe detection** uses the `useSyncExternalStore` pattern (server snapshot =
  desktop default, corrected after hydration) so there is no hydration mismatch.
- **`dpr` clamped** to `[1, 1.5]` so retina phones don't oversample.
- **Pause when hidden:** `visibilitychange` flips `frameloop` to `"demand"` while the
  tab is backgrounded — zero GPU work when not visible.
- **Reduced-motion:** `frameloop="demand"`, render exactly one frame with the cloud in
  the icosahedron state. Static and respectful, still on-brand.
- **Material:** `PointsMaterial` with `sizeAttenuation`, opacity `~0.2`, additive
  blending; color pulled from the theme accent so it reads on both light and dark.

## Hero layout change

`src/components/hero/hero.tsx` drops the two-column grid and the boxed `HeroCanvas`.
The text column re-centers (`items-center text-center`) inside the existing
full-viewport `Section`, with the cloud showing through behind it. All other sections
are untouched and keep their existing `FadeUp` / `Stagger` reveals, now over a living
backdrop.

## Testing

**Unit (Vitest):**

- `src/lib/scene/shapes.test.ts` — each generator returns `length === n * 3`, points
  fall within expected bounds/radius, output is deterministic, and `n = 0` is handled.
- `src/lib/scene/choreography.test.ts` — `progress = 0` yields the hero/icosahedron
  state, `progress = 1` yields the end state, `blend` stays within `[0, 1]`, inputs
  outside `[0, 1]` clamp, and transitions are continuous (no discontinuous jumps).
- `src/lib/scene/device.test.ts` — width / pointer thresholds map to the correct budget.

**E2E (Playwright):** extend `e2e/routes.spec.ts` — `/` still renders its heading, a
`<canvas>` element is present, and no console errors fire on load and after a scroll.

**Manual:** tune feel (speed, dispersion, opacity, color) live in the dev server.

## Out of scope

- MBA section visuals.
- Per-section thematic/literal particle shapes (explicitly rejected in favour of
  abstract flow).
- Custom GLSL / GPGPU particle simulation.

## Risks & mitigations

- **Mobile jank / battery** → device-scaled budget, `dpr` clamp, pause-when-hidden,
  reduced-motion static frame.
- **Text readability over a moving backdrop** → low opacity (~0.2), subtle motion,
  theme-aware color; text remains the focal point.
- **Hydration mismatch from device/motion detection** → `useSyncExternalStore` with a
  stable server snapshot.
