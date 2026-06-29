# SWE Persistent Particle Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero-boxed wireframe icosahedron with one persistent, scroll-driven particle cloud that lives behind the entire SWE page.

**Architecture:** A single fixed `<Canvas>` is mounted once in the SWE layout, full-bleed and behind content. Pure, testable math in `src/lib/scene/` generates shape position targets and maps scroll progress to a blend state; thin R3F glue in `src/components/scene/` reads scroll/cursor through refs (never React state) and lerps the cloud each frame. SWE-only; the MBA section is untouched.

**Tech Stack:** Next.js 16, React 19, `@react-three/fiber` 9, `three` r184, `motion` (Framer Motion v12, for `useReducedMotion`), Tailwind v4, Vitest, Playwright.

---

## File Structure

**Create (pure logic, unit-tested):**
- `src/lib/scene/prng.ts` — deterministic seeded PRNG (`mulberry32`).
- `src/lib/scene/shapes.ts` — `icosahedronPoints`, `spherePoints`, `dispersedPoints`.
- `src/lib/scene/choreography.ts` — `scrollToState(progress)`.
- `src/lib/scene/device.ts` — `particleBudget(width, coarsePointer)`.

**Create (React/R3F glue):**
- `src/components/scene/use-particle-budget.ts` — SSR-safe budget hook.
- `src/components/scene/particle-cloud.tsx` — the `Points` object + `useFrame` lerp.
- `src/components/scene/particle-field.tsx` — fixed `<Canvas>` wrapper + input listeners.
- `src/components/scene/particle-field-mount.tsx` — `dynamic(..., { ssr:false })` boundary.

**Create (tests):**
- `src/lib/scene/prng.test.ts`, `shapes.test.ts`, `choreography.test.ts`, `device.test.ts`.

**Modify:**
- `src/app/(swe)/layout.tsx` — mount `<ParticleFieldMount />`.
- `src/components/hero/hero.tsx` — drop the 2-col grid + `HeroCanvas`, re-center text.
- `e2e/routes.spec.ts` — assert canvas present + no console errors.

**Delete:**
- `src/components/hero/hero-canvas.tsx`
- `src/components/hero/wireframe-mesh.tsx`

---

## Task 1: Seeded PRNG

**Files:**
- Create: `src/lib/scene/prng.ts`
- Test: `src/lib/scene/prng.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/scene/prng.test.ts
import { describe, expect, it } from "vitest";

import { mulberry32 } from "./prng";

describe("mulberry32", () => {
  it("produces numbers in [0, 1)", () => {
    const rand = mulberry32(123);
    for (let i = 0; i < 1000; i++) {
      const n = rand();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it("is deterministic for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("differs for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scene/prng.test.ts`
Expected: FAIL — cannot find module `./prng`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/scene/prng.ts
// Small deterministic PRNG so particle shapes are reproducible across renders
// and testable. Returns a function yielding floats in [0, 1).
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scene/prng.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene/prng.ts src/lib/scene/prng.test.ts
git commit -m "feat(scene): add deterministic seeded PRNG"
```

---

## Task 2: Shape position generators

**Files:**
- Create: `src/lib/scene/shapes.ts`
- Test: `src/lib/scene/shapes.test.ts`

Each generator returns a `Float32Array` of length `n * 3` (x, y, z per particle). The icosahedron and sphere targets sit on/within a unit radius; dispersed fills a box of half-extent `spread`.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/scene/shapes.test.ts
import { describe, expect, it } from "vitest";

import { dispersedPoints, icosahedronPoints, spherePoints } from "./shapes";

function radius(arr: Float32Array, i: number): number {
  const x = arr[i * 3];
  const y = arr[i * 3 + 1];
  const z = arr[i * 3 + 2];
  return Math.sqrt(x * x + y * y + z * z);
}

describe("icosahedronPoints", () => {
  it("returns n*3 values", () => {
    expect(icosahedronPoints(300)).toHaveLength(900);
  });

  it("keeps every point within the unit sphere", () => {
    const pts = icosahedronPoints(300);
    for (let i = 0; i < 300; i++) {
      expect(radius(pts, i)).toBeLessThanOrEqual(1.0001);
    }
  });

  it("is deterministic", () => {
    expect(Array.from(icosahedronPoints(60))).toEqual(
      Array.from(icosahedronPoints(60)),
    );
  });

  it("handles n=0", () => {
    expect(icosahedronPoints(0)).toHaveLength(0);
  });
});

describe("spherePoints", () => {
  it("returns n*3 values", () => {
    expect(spherePoints(500)).toHaveLength(1500);
  });

  it("places points on the unit sphere", () => {
    const pts = spherePoints(500);
    for (let i = 0; i < 500; i++) {
      expect(radius(pts, i)).toBeCloseTo(1, 1);
    }
  });

  it("is deterministic", () => {
    expect(Array.from(spherePoints(50))).toEqual(Array.from(spherePoints(50)));
  });
});

describe("dispersedPoints", () => {
  it("returns n*3 values", () => {
    expect(dispersedPoints(400, 1)).toHaveLength(1200);
  });

  it("stays within the spread bounds", () => {
    const spread = 3;
    const pts = dispersedPoints(400, 1, spread);
    for (let i = 0; i < pts.length; i++) {
      expect(Math.abs(pts[i])).toBeLessThanOrEqual(spread);
    }
  });

  it("is deterministic per seed and varies across seeds", () => {
    expect(Array.from(dispersedPoints(40, 7))).toEqual(
      Array.from(dispersedPoints(40, 7)),
    );
    expect(Array.from(dispersedPoints(40, 7))).not.toEqual(
      Array.from(dispersedPoints(40, 8)),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scene/shapes.test.ts`
Expected: FAIL — cannot find module `./shapes`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/scene/shapes.ts
import { mulberry32 } from "./prng";

// The 12 vertices of a regular icosahedron (golden-ratio construction),
// normalized to the unit sphere.
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTICES: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const VERTICES: [number, number, number][] = RAW_VERTICES.map(([x, y, z]) => {
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len];
});
// The 30 edges (vertex index pairs) of the icosahedron.
const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9],
  [10, 11],
];

// Particles distributed evenly along the icosahedron's wireframe edges, so the
// cloud reads as the wireframe icosahedron from the hero.
export function icosahedronPoints(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  if (n === 0) return out;
  const perEdge = Math.ceil(n / EDGES.length);
  for (let i = 0; i < n; i++) {
    const [a, b] = EDGES[i % EDGES.length];
    const step = Math.floor(i / EDGES.length);
    const t = perEdge > 1 ? step / (perEdge - 1) : 0.5;
    const va = VERTICES[a];
    const vb = VERTICES[b];
    out[i * 3] = va[0] + (vb[0] - va[0]) * t;
    out[i * 3 + 1] = va[1] + (vb[1] - va[1]) * t;
    out[i * 3 + 2] = va[2] + (vb[2] - va[2]) * t;
  }
  return out;
}

// Even distribution on the unit sphere via the Fibonacci lattice.
export function spherePoints(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  if (n === 0) return out;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.sin(theta) * r;
  }
  return out;
}

// Random cloud filling a box of half-extent `spread`, deterministic per seed.
export function dispersedPoints(n: number, seed: number, spread = 3): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(seed);
  for (let i = 0; i < n * 3; i++) {
    out[i] = (rand() * 2 - 1) * spread;
  }
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scene/shapes.test.ts`
Expected: PASS (all describe blocks green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene/shapes.ts src/lib/scene/shapes.test.ts
git commit -m "feat(scene): add icosahedron/sphere/dispersed point generators"
```

---

## Task 3: Scroll choreography

**Files:**
- Create: `src/lib/scene/choreography.ts`
- Test: `src/lib/scene/choreography.test.ts`

`scrollToState(progress)` maps page scroll `0→1` onto a keyframe timeline of shapes and returns the two shapes to blend between plus the blend factor, rotation, and dispersion.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/scene/choreography.test.ts
import { describe, expect, it } from "vitest";

import { scrollToState } from "./choreography";

describe("scrollToState", () => {
  it("starts as the icosahedron at progress 0", () => {
    const s = scrollToState(0);
    expect(s.fromShape).toBe("icosahedron");
    expect(s.blend).toBe(0);
  });

  it("ends fully dispersed at progress 1", () => {
    const s = scrollToState(1);
    expect(s.toShape).toBe("dispersed");
    expect(s.blend).toBe(1);
  });

  it("blends icosahedron->sphere in the first half", () => {
    const s = scrollToState(0.25);
    expect(s.fromShape).toBe("icosahedron");
    expect(s.toShape).toBe("sphere");
    expect(s.blend).toBeCloseTo(0.5, 5);
  });

  it("blends sphere->dispersed in the second half", () => {
    const s = scrollToState(0.75);
    expect(s.fromShape).toBe("sphere");
    expect(s.toShape).toBe("dispersed");
    expect(s.blend).toBeCloseTo(0.5, 5);
  });

  it("keeps blend within [0,1] across the range", () => {
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const s = scrollToState(p);
      expect(s.blend).toBeGreaterThanOrEqual(0);
      expect(s.blend).toBeLessThanOrEqual(1);
    }
  });

  it("clamps out-of-range input", () => {
    expect(scrollToState(-1)).toEqual(scrollToState(0));
    expect(scrollToState(2)).toEqual(scrollToState(1));
  });

  it("rotation increases monotonically with progress", () => {
    expect(scrollToState(0.6).rotationY).toBeGreaterThan(
      scrollToState(0.3).rotationY,
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scene/choreography.test.ts`
Expected: FAIL — cannot find module `./choreography`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/scene/choreography.ts
export type ShapeId = "icosahedron" | "sphere" | "dispersed";

export interface SceneState {
  fromShape: ShapeId;
  toShape: ShapeId;
  blend: number; // 0..1 within the current segment
  rotationY: number; // radians
  dispersion: number; // 0..1, drives an outward scale
}

const KEYFRAMES: { at: number; shape: ShapeId }[] = [
  { at: 0, shape: "icosahedron" },
  { at: 0.5, shape: "sphere" },
  { at: 1, shape: "dispersed" },
];

const TWO_PI = Math.PI * 2;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function scrollToState(progress: number): SceneState {
  const p = clamp01(progress);

  let i = 0;
  for (; i < KEYFRAMES.length - 2; i++) {
    if (p <= KEYFRAMES[i + 1].at) break;
  }
  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const span = b.at - a.at;
  const blend = span > 0 ? clamp01((p - a.at) / span) : 0;

  return {
    fromShape: a.shape,
    toShape: b.shape,
    blend,
    rotationY: p * TWO_PI,
    dispersion: p,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scene/choreography.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene/choreography.ts src/lib/scene/choreography.test.ts
git commit -m "feat(scene): map scroll progress to particle shape state"
```

---

## Task 4: Device particle budget

**Files:**
- Create: `src/lib/scene/device.ts`
- Test: `src/lib/scene/device.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/scene/device.test.ts
import { describe, expect, it } from "vitest";

import { particleBudget } from "./device";

describe("particleBudget", () => {
  it("gives the full budget to wide fine-pointer screens", () => {
    expect(particleBudget(1920, false)).toBe(5000);
    expect(particleBudget(1280, false)).toBe(5000);
  });

  it("gives a mid budget to tablet-width screens", () => {
    expect(particleBudget(1279, false)).toBe(1500);
    expect(particleBudget(768, false)).toBe(1500);
  });

  it("gives the small budget to narrow screens", () => {
    expect(particleBudget(767, false)).toBe(700);
    expect(particleBudget(375, false)).toBe(700);
  });

  it("treats any coarse-pointer device as small regardless of width", () => {
    expect(particleBudget(1920, true)).toBe(700);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scene/device.test.ts`
Expected: FAIL — cannot find module `./device`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/scene/device.ts
// Pick a particle count that stays smooth on the target device. Coarse pointer
// (touch) always gets the smallest budget to protect battery and frame rate.
export function particleBudget(width: number, coarsePointer: boolean): number {
  if (coarsePointer || width < 768) return 700;
  if (width < 1280) return 1500;
  return 5000;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scene/device.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene/device.ts src/lib/scene/device.test.ts
git commit -m "feat(scene): add device-scaled particle budget"
```

---

## Task 5: SSR-safe particle budget hook

**Files:**
- Create: `src/components/scene/use-particle-budget.ts`

No unit test — this is a thin DOM subscription wrapping the already-tested `particleBudget`. It uses `useSyncExternalStore` so there is no hydration mismatch and it re-reads on resize.

- [ ] **Step 1: Write the hook**

```typescript
// src/components/scene/use-particle-budget.ts
"use client";

import { useSyncExternalStore } from "react";

import { particleBudget } from "@/lib/scene/device";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): number {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return particleBudget(window.innerWidth, coarse);
}

// Server snapshot: assume a desktop budget. The field is mounted ssr:false, so
// this is only a fallback, but it keeps the hook hydration-safe regardless.
function getServerSnapshot(): number {
  return particleBudget(1280, false);
}

export function useParticleBudget(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/scene/use-particle-budget.ts
git commit -m "feat(scene): add SSR-safe particle budget hook"
```

---

## Task 6: Particle cloud object

**Files:**
- Create: `src/components/scene/particle-cloud.tsx`

The `Points` object. Positions live in one `BufferAttribute` mutated in place each frame; scroll/pointer come in through refs. When `reduced` is true the lerp snaps instantly (one static frame in the icosahedron state).

- [ ] **Step 1: Write the component**

```tsx
// src/components/scene/particle-cloud.tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { AdditiveBlending, type Points as ThreePoints } from "three";

import { scrollToState, type ShapeId } from "@/lib/scene/choreography";
import {
  dispersedPoints,
  icosahedronPoints,
  spherePoints,
} from "@/lib/scene/shapes";

type Props = {
  count: number;
  scrollRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  reduced: boolean;
};

export function ParticleCloud({ count, scrollRef, pointerRef, reduced }: Props) {
  const pointsRef = useRef<ThreePoints>(null);

  const { positions, targets } = useMemo(() => {
    const icosahedron = icosahedronPoints(count);
    const targets: Record<ShapeId, Float32Array> = {
      icosahedron,
      sphere: spherePoints(count),
      dispersed: dispersedPoints(count, 1),
    };
    // Start the live buffer in the icosahedron state.
    return { positions: Float32Array.from(icosahedron), targets };
  }, [count]);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    const state = scrollToState(scrollRef.current);
    const from = targets[state.fromShape];
    const to = targets[state.toShape];
    const live = points.geometry.attributes.position.array as Float32Array;
    const ease = reduced ? 1 : 0.08;

    for (let i = 0; i < live.length; i++) {
      const target = from[i] + (to[i] - from[i]) * state.blend;
      live[i] += (target - live[i]) * ease;
    }
    points.geometry.attributes.position.needsUpdate = true;

    points.rotation.y = state.rotationY;
    points.scale.setScalar(1 + state.dispersion * 0.3);

    const pointer = pointerRef.current;
    points.rotation.x += (pointer.y * 0.2 - points.rotation.x) * 0.05;
    points.position.x += (pointer.x * 0.3 - points.position.x) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.25}
        color="#8b8bff"
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/scene/particle-cloud.tsx
git commit -m "feat(scene): add scroll-driven particle cloud object"
```

---

## Task 7: Particle field canvas wrapper

**Files:**
- Create: `src/components/scene/particle-field.tsx`

Owns the fixed `<Canvas>`, the passive scroll/pointer listeners (writing to refs, no re-render), and the `frameloop` switch for reduced-motion / hidden-tab.

- [ ] **Step 1: Write the component**

```tsx
// src/components/scene/particle-field.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { ParticleCloud } from "./particle-cloud";
import { useParticleBudget } from "./use-particle-budget";

export function ParticleField() {
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  const budget = useParticleBudget();
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    const onPointer = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const onVisibility = () => setVisible(!document.hidden);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Reduced-motion or a backgrounded tab => render on demand (one frame, no
  // continuous GPU work). Otherwise animate every frame.
  const frameloop = reduced || !visible ? "demand" : "always";

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleCloud
          count={budget}
          scrollRef={scrollRef}
          pointerRef={pointerRef}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/scene/particle-field.tsx
git commit -m "feat(scene): add fixed canvas wrapper with scroll/pointer input"
```

---

## Task 8: Client-only mount boundary

**Files:**
- Create: `src/components/scene/particle-field-mount.tsx`

WebGL must not run during SSR; this is the `dynamic(..., { ssr:false })` seam the layout imports.

- [ ] **Step 1: Write the component**

```tsx
// src/components/scene/particle-field-mount.tsx
"use client";

import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("./particle-field").then((m) => m.ParticleField),
  {
    ssr: false,
    loading: () => null,
  },
);

export function ParticleFieldMount() {
  return <ParticleField />;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/scene/particle-field-mount.tsx
git commit -m "feat(scene): add ssr:false mount boundary for the particle field"
```

---

## Task 9: Mount the field in the SWE layout

**Files:**
- Modify: `src/app/(swe)/layout.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/app/(swe)/layout.tsx
import { ParticleFieldMount } from "@/components/scene/particle-field-mount";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function SweLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <ParticleFieldMount />
      <SiteNav variant="swe" />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter variant="swe" />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Manual check**

Run: `npm run dev` (if not already running) and open `http://localhost:3000/`.
Expected: faint particle cloud visible behind the page; it shifts as you scroll and moves slightly with the cursor. (The hero still shows its old boxed canvas — fixed in the next task.)

- [ ] **Step 4: Commit**

```bash
git add "src/app/(swe)/layout.tsx"
git commit -m "feat(swe): mount persistent particle field behind the page"
```

---

## Task 10: Re-center the hero and remove the boxed canvas

**Files:**
- Modify: `src/components/hero/hero.tsx`
- Delete: `src/components/hero/hero-canvas.tsx`
- Delete: `src/components/hero/wireframe-mesh.tsx`

- [ ] **Step 1: Replace `hero.tsx` contents**

```tsx
// src/components/hero/hero.tsx
import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";

export function Hero() {
  return (
    <Section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden py-12">
      <div className="relative z-10 flex flex-col items-center gap-10 text-center">
        <FadeUp>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            uzair vawda · portfolio
          </p>
        </FadeUp>

        <Stagger className="flex flex-col gap-6">
          <StaggerItem>
            <h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Uzair Vawda.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-balance text-xl font-light text-muted-foreground sm:text-2xl">
              Engineer. MBA candidate. NYC.
            </p>
          </StaggerItem>
        </Stagger>

        <FadeUp delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-px"
            >
              See work
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/mba"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              MBA section
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Delete the superseded files**

```bash
git rm src/components/hero/hero-canvas.tsx src/components/hero/wireframe-mesh.tsx
```

- [ ] **Step 3: Typecheck + lint**

Run: `npm run typecheck && npx eslint src`
Expected: PASS, no errors (no dangling imports of the deleted files).

- [ ] **Step 4: Manual check**

Open `http://localhost:3000/`.
Expected: hero text is centered, no boxed object on the right; the particle cloud is the only hero visual and it threads down the whole page as you scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/hero.tsx
git commit -m "feat(hero): re-center hero over the particle field, drop boxed canvas"
```

---

## Task 11: E2E coverage for the field

**Files:**
- Modify: `e2e/routes.spec.ts`

- [ ] **Step 1: Add the test to the `route smoke tests` describe block**

Add this `test` inside the existing `test.describe("route smoke tests", ...)` block in `e2e/routes.spec.ts` (place it after the existing `/` heading loop, before the closing `});` of the describe):

```typescript
  test("SWE page renders the particle canvas without console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();

    // Scroll the full page to exercise the scroll-driven animation.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });
```

- [ ] **Step 2: Run the e2e suite**

Run: `npm run test:e2e`
Expected: PASS — all prior tests plus the new one. (The webServer builds and starts automatically.)

- [ ] **Step 3: Commit**

```bash
git add e2e/routes.spec.ts
git commit -m "test(e2e): assert SWE particle canvas renders without console errors"
```

---

## Task 12: Full verification

**Files:** none (verification + final push).

- [ ] **Step 1: Run the full unit suite**

Run: `npx vitest run`
Expected: PASS — all existing tests plus the four new `src/lib/scene/*` files.

- [ ] **Step 2: Typecheck and lint the whole project**

Run: `npm run typecheck && npx eslint src`
Expected: PASS, zero errors/warnings.

- [ ] **Step 3: Production build smoke**

Run: `npm run build`
Expected: build succeeds (an edge-runtime info warning is fine).

- [ ] **Step 4: Push**

```bash
git push origin main
```

Expected: push succeeds; Vercel begins a deploy.

- [ ] **Step 5: Manual tuning pass (live)**

In the running dev server, eyeball feel and adjust these literals if needed (all in `src/components/scene/particle-cloud.tsx` unless noted):
- `opacity={0.25}` and `color="#8b8bff"` — particle subtlety / hue (theme).
- `size={0.02}` — dot size.
- `ease` (`0.08`) — how quickly the cloud chases the scroll target.
- `points.scale.setScalar(1 + state.dispersion * 0.3)` — how much it blooms.
- `KEYFRAMES` in `choreography.ts` — the shape timeline.
- `dpr={[1, 1.5]}` / `camera fov` in `particle-field.tsx` — sharpness / framing.

Re-run `npx vitest run` after any change to `choreography.ts`/`shapes.ts` to keep the math tests green, then commit and push.

---

## Self-Review Notes

- **Spec coverage:** persistent fixed canvas (Tasks 7–9), particle cloud assembling into the icosahedron (Tasks 2, 6), abstract scroll flow condense/rotate/disperse (Tasks 3, 6), subtle full-bleed low-opacity (Task 6 material + Task 7 `-z-10`), device-scaled budget (Tasks 4–5), pause-when-hidden + reduced-motion static frame (Task 7 `frameloop`), hero re-center + dead-code removal (Task 10), unit + e2e tests (Tasks 1–4, 11), no new runtime dependency (all generators hand-written).
- **No placeholders:** every code step contains complete code; every run step has an expected result.
- **Type consistency:** `ShapeId`/`SceneState` defined in Task 3 are consumed unchanged in Task 6; `particleBudget` signature (Task 4) matches its call in Task 5; `ParticleCloud` prop types (Task 6) match the call site in Task 7.
