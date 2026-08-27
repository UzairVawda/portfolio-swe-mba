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

  const rotationY =
    (Math.min(t, OVERTURE_DURATION_MS) / OVERTURE_DURATION_MS) * Math.PI * 0.75;

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
      lineOpacity: smootherstep(
        clamp01((t - GATHER_END_MS * 0.6) / (GATHER_END_MS * 0.4)),
      ),
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
