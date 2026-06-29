import { describe, expect, it } from "vitest";

import {
  dispersedPoints,
  icosahedronEdges,
  icosahedronPoints,
  spherePoints,
} from "./shapes";

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

describe("icosahedronEdges", () => {
  it("returns one segment per edge: 30 edges * 2 verts * 3 = 180 values", () => {
    expect(icosahedronEdges()).toHaveLength(180);
  });

  it("places every endpoint on the unit sphere", () => {
    const edges = icosahedronEdges();
    for (let i = 0; i < edges.length / 3; i++) {
      expect(radius(edges, i)).toBeCloseTo(1, 5);
    }
  });

  it("is deterministic", () => {
    expect(Array.from(icosahedronEdges())).toEqual(
      Array.from(icosahedronEdges()),
    );
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
