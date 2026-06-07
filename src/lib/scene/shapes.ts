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
