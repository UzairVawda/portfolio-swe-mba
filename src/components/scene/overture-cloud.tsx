"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  type Group,
  type LineBasicMaterial,
  type LineSegments,
  type Points as ThreePoints,
  type PointsMaterial,
} from "three";

import { overtureState, type ShapeId } from "@/lib/scene/overture";
import {
  dispersedPoints,
  icosahedronEdges,
  icosahedronPoints,
} from "@/lib/scene/shapes";

type Props = {
  count: number;
  color: string;
  onSettled: () => void;
};

const BASE_SCALE = 1.5;
const DOT_OPACITY = 0.75;
const LINE_OPACITY = 0.85;

// A crisp radial sprite: a defined dot with a thin soft edge for
// anti-aliasing, rather than a fuzzy glow.
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
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.95)");
  g.addColorStop(0.8, "rgba(255,255,255,0.2)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

export function OvertureCloud({ count, color, onSettled }: Props) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<ThreePoints>(null);
  const linesRef = useRef<LineSegments>(null);
  const settledRef = useRef(false);
  // The clock starts on the first rendered frame, not on the React render, so
  // a slow first paint cannot eat the opening of the sequence.
  const startedAtRef = useRef<number | null>(null);

  const sprite = useMemo(() => createSoftSprite(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  const { positions, targets } = useMemo(() => {
    const dispersed = dispersedPoints(count, 1);
    const shapes: Record<ShapeId, Float32Array> = {
      dispersed,
      icosahedron: icosahedronPoints(count),
      // Unused by the overture, present so the record is total.
      sphere: icosahedronPoints(count),
    };
    return { positions: Float32Array.from(dispersed), targets: shapes };
  }, [count]);

  const edges = useMemo(() => icosahedronEdges(), []);

  useFrame(() => {
    const group = groupRef.current;
    const points = pointsRef.current;
    if (!group || !points) return;

    const now = performance.now();
    startedAtRef.current ??= now;
    const state = overtureState(now - startedAtRef.current);
    const from = targets[state.fromShape];
    const to = targets[state.toShape];
    const live = points.geometry.attributes.position.array as Float32Array;

    // Positions are driven straight off the clock rather than eased toward a
    // target: the sequence must land on time regardless of frame rate.
    for (let i = 0; i < live.length; i++) {
      live[i] = from[i] + (to[i] - from[i]) * state.blend;
    }
    points.geometry.attributes.position.needsUpdate = true;

    (points.material as PointsMaterial).opacity = DOT_OPACITY * state.dotOpacity;
    const lines = linesRef.current;
    if (lines) {
      (lines.material as LineBasicMaterial).opacity =
        LINE_OPACITY * state.lineOpacity;
      lines.visible = state.lineOpacity > 0.001;
    }

    group.rotation.y = state.rotationY;
    group.scale.setScalar(BASE_SCALE * (1 + state.dispersion * 0.4));

    if (state.phase === "settled" && !settledRef.current) {
      settledRef.current = true;
      onSettled();
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          opacity={0}
          color={color}
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
          color={color}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
