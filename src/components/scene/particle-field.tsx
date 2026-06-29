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
        dpr={[1, 2]}
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
