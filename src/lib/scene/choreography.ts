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
