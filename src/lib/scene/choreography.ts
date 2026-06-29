export type ShapeId = "icosahedron" | "sphere" | "dispersed";

export interface SceneState {
  fromShape: ShapeId;
  toShape: ShapeId;
  blend: number; // 0..1 within the current segment
  rotationY: number; // radians
  dispersion: number; // 0..1, drives an outward scale
  lineOpacity: number; // 1 at the top, fading to 0 as the wireframe breaks up
  dotOpacity: number; // 0 at the top, rising to 1 as the dots take over
}

// Scroll fraction over which the solid wireframe granulates into the dots. The
// shape is held as the icosahedron across this window (see KEYFRAMES) so the
// dots land exactly on the fading lines.
const BREAKDOWN_END = 0.25;

const KEYFRAMES: { at: number; shape: ShapeId }[] = [
  { at: 0, shape: "icosahedron" },
  // Hold the icosahedron until the line->dot crossfade finishes.
  { at: BREAKDOWN_END, shape: "icosahedron" },
  { at: 0.6, shape: "sphere" },
  { at: 1, shape: "dispersed" },
];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Ken Perlin's smootherstep: zero first AND second derivative at both ends, so
// shape morphs ease in and settle out instead of starting/stopping abruptly.
// Symmetric about 0.5 (smootherstep(0.5) === 0.5), which keeps segment midpoints
// landing exactly halfway.
function smootherstep(t: number): number {
  const x = clamp01(t);
  // Clamp the result too: the polynomial can round a hair past 1.0 in floating
  // point near x=1, and callers rely on the [0,1] range.
  return clamp01(x * x * x * (x * (x * 6 - 15) + 10));
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
  const rawBlend = span > 0 ? clamp01((p - a.at) / span) : 0;

  // Crossfade the wireframe into the dots across the breakdown window.
  const breakdown = smootherstep(clamp01(p / BREAKDOWN_END));

  return {
    fromShape: a.shape,
    toShape: b.shape,
    // Eased so each shape-to-shape transition glides rather than ramps linearly.
    blend: smootherstep(rawBlend),
    // A gentle 1.5 turns across the whole page — present but never busy.
    rotationY: p * Math.PI * 1.5,
    // Eased so the cloud holds its form, then blooms outward late in the scroll.
    dispersion: smootherstep(p),
    lineOpacity: 1 - breakdown,
    dotOpacity: breakdown,
  };
}
