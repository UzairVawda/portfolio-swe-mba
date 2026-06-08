"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { AdditiveBlending, CanvasTexture, type Points as ThreePoints } from "three";

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

// A soft radial sprite so each particle reads as a gentle glow rather than a
// hard square — far easier on the eye behind body text, and more premium.
function createSoftSprite(): CanvasTexture {
  const size = 64;
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
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

export function ParticleCloud({ count, scrollRef, pointerRef, reduced }: Props) {
  const pointsRef = useRef<ThreePoints>(null);

  const sprite = useMemo(() => createSoftSprite(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

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

  useFrame((_state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const state = scrollToState(scrollRef.current);
    const from = targets[state.fromShape];
    const to = targets[state.toShape];
    const live = points.geometry.attributes.position.array as Float32Array;
    const ease = reduced ? 1 : 1 - Math.pow(1 - 0.08, delta * 60);

    for (let i = 0; i < live.length; i++) {
      const target = from[i] + (to[i] - from[i]) * state.blend;
      live[i] += (target - live[i]) * ease;
    }
    points.geometry.attributes.position.needsUpdate = true;

    // Y is scroll-driven (authoritative); X lerps toward pointer tilt.
    points.rotation.y = state.rotationY;
    points.scale.setScalar(1 + state.dispersion * 0.3);

    const pointer = pointerRef.current;
    const pointerEase = 1 - Math.pow(0.95, delta * 60);
    points.rotation.x += (pointer.y * 0.2 - points.rotation.x) * pointerEase;
    points.position.x += (pointer.x * 0.3 - points.position.x) * pointerEase;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        map={sprite}
        alphaMap={sprite}
        transparent
        opacity={0.5}
        color="#9b9bff"
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
