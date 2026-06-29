"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  type Group,
  type LineBasicMaterial,
  type LineSegments,
  type Points as ThreePoints,
  type PointsMaterial,
} from "three";

import { scrollToState, type ShapeId } from "@/lib/scene/choreography";
import {
  dispersedPoints,
  icosahedronEdges,
  icosahedronPoints,
  spherePoints,
} from "@/lib/scene/shapes";

type Props = {
  count: number;
  scrollRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  reduced: boolean;
};

// A crisp radial sprite: a defined dot with just a thin soft edge for
// anti-aliasing, rather than a fuzzy glow. Reads clean and sharp while still
// avoiding the harshness of a hard square.
function createSoftSprite(): CanvasTexture {
  const size = 128;
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
  // Solid core out to ~half the radius, then a quick falloff to a clean edge.
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.95)");
  g.addColorStop(0.8, "rgba(255,255,255,0.2)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

// Base scale of the whole shape (bigger = more presence in the hero).
const BASE_SCALE = 1.5;
// Peak opacities for the two representations (modulated by the scroll crossfade).
const DOT_OPACITY = 0.65;
const LINE_OPACITY = 0.85;

export function ParticleCloud({ count, scrollRef, pointerRef, reduced }: Props) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<ThreePoints>(null);
  const linesRef = useRef<LineSegments>(null);

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

  // Static wireframe: the icosahedron edges the dots are sampled along.
  const edges = useMemo(() => icosahedronEdges(), []);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const points = pointsRef.current;
    if (!group || !points) return;

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

    // Crossfade the wireframe out as the dots come in.
    (points.material as PointsMaterial).opacity = DOT_OPACITY * state.dotOpacity;
    const lines = linesRef.current;
    if (lines) {
      (lines.material as LineBasicMaterial).opacity =
        LINE_OPACITY * state.lineOpacity;
      lines.visible = state.lineOpacity > 0.001;
    }

    // The whole shape (lines + dots) shares one transform so they stay aligned.
    // Y is scroll-driven (authoritative); X lerps toward pointer tilt.
    group.rotation.y = state.rotationY;
    group.scale.setScalar(BASE_SCALE * (1 + state.dispersion * 0.3));

    const pointer = pointerRef.current;
    const pointerEase = 1 - Math.pow(0.95, delta * 60);
    group.rotation.x += (pointer.y * 0.2 - group.rotation.x) * pointerEase;
    group.position.x += (pointer.x * 0.3 - group.position.x) * pointerEase;
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          opacity={LINE_OPACITY}
          color="#9b9bff"
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          sizeAttenuation
          map={sprite}
          alphaMap={sprite}
          transparent
          opacity={0}
          color="#9b9bff"
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
