"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";

function RotatingIcosahedron({ reduced }: { reduced: boolean }) {
  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const handleMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      target.current = { x, y };
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reduced]);

  useFrame((_, delta) => {
    if (!outer.current || !inner.current) return;
    if (reduced) return;

    outer.current.rotation.y += delta * 0.18;
    outer.current.rotation.x += delta * 0.05;
    inner.current.rotation.y -= delta * 0.28;
    inner.current.rotation.z += delta * 0.09;

    const tx = target.current.x * 0.25;
    const ty = -target.current.y * 0.25;
    outer.current.position.x += (tx - outer.current.position.x) * 0.05;
    outer.current.position.y += (ty - outer.current.position.y) * 0.05;
  });

  return (
    <>
      <group ref={outer}>
        <mesh>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial wireframe color="#6666ff" />
        </mesh>
      </group>
      <group ref={inner}>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial
            wireframe
            color="#b8baff"
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </>
  );
}

export default function WireframeMesh() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden
    >
      <RotatingIcosahedron reduced={reduced} />
    </Canvas>
  );
}
