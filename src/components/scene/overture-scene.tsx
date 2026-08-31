"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { particleBudget } from "@/lib/scene/device";
import { markOverturePlayed } from "@/lib/scene/session";
import { tokens } from "@/lib/theme/tokens";

import { OvertureCloud } from "./overture-cloud";

// Any of these resolve the sequence immediately. Scroll is included because a
// visitor who scrolls has already decided to skip the show.
const SKIP_EVENTS = [
  "keydown",
  "pointerdown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

export function OvertureScene({ onResolved }: { onResolved: () => void }) {
  const reduced = useReducedMotion() ?? false;
  // three.js materials take a literal colour — they cannot read CSS
  // variables, so the hex comes from the token module. The root layout pins
  // defaultTheme="light" with enableSystem={false}, which makes the light
  // signal the correct pre-hydration value rather than a guess.
  const { resolvedTheme } = useTheme();
  const color =
    resolvedTheme === "dark" ? tokens.dark.signal : tokens.light.signal;
  // The budget is sampled once, at mount: it sizes the geometry buffers, and
  // a mid-sequence resize must not reallocate them for a 4s one-shot.
  const [budget] = useState(() =>
    particleBudget(
      window.innerWidth,
      window.matchMedia("(pointer: coarse)").matches,
    ),
  );
  const resolvedRef = useRef(false);

  const resolve = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    markOverturePlayed(
      typeof window === "undefined" ? null : window.sessionStorage,
    );
    onResolved();
  }, [onResolved]);

  useEffect(() => {
    // Reduced motion skips straight to the resolved document. The mount
    // already refuses to render this component in that case; this is the
    // belt to that braces.
    if (reduced) {
      resolve();
      return;
    }
    for (const type of SKIP_EVENTS) {
      window.addEventListener(type, resolve, { passive: true, once: true });
    }
    return () => {
      for (const type of SKIP_EVENTS) {
        window.removeEventListener(type, resolve);
      }
    };
  }, [reduced, resolve]);

  if (reduced) return null;

  return (
    <div
      data-testid="overture"
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
      >
        <OvertureCloud count={budget} color={color} onSettled={resolve} />
      </Canvas>
    </div>
  );
}
