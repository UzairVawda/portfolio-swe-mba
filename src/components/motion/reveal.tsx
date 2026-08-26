"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-12% 0px" } as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  "data-testid"?: string;
};

// Tier 2: fires once on entry, never loops, never snaps the scroll.
// Reduced motion collapses it to a <=150ms opacity fade with no travel.
export function Reveal({
  children,
  delay = 0,
  className,
  "data-testid": testId,
}: RevealProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      // `y: 0` is spelled out on the reduced branch rather than omitted.
      // useReducedMotion resolves to false on the server and on the first
      // client render, so the rise is committed to the DOM before the query
      // is known; an opacity-only reduced variant leaves that translate
      // stranded at 20px forever.
      initial={reduced ? { opacity: 0, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={
        reduced
          ? { duration: 0.15, delay: 0 }
          : { duration: 0.7, delay, ease: EASE }
      }
      className={className}
      data-reveal=""
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

type UnmaskLinesProps = {
  lines: string[];
  className?: string;
  "data-testid"?: string;
};

// A type unmask: each line rises out from behind a clipping box, so the text
// appears to be revealed rather than moved. One line at a time, 60ms apart.
export function UnmaskLines({
  lines,
  className,
  "data-testid": testId,
}: UnmaskLinesProps) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.15 }}
        className={className}
        data-testid={testId}
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </motion.span>
    );
  }

  // The observer lives on the OUTER span and the lines animate as variants.
  // It cannot go on the line itself: a line starts at y:110%, which puts it
  // entirely outside its overflow-hidden parent, and IntersectionObserver
  // clips against ancestor overflow. A fully clipped element never reports as
  // intersecting, so whileInView on the line deadlocks — it stays hidden
  // because it never animates, and never animates because it is hidden. The
  // wrapper is never clipped, so its observer always fires.
  return (
    <motion.span
      className={className}
      data-testid={testId}
      initial="masked"
      whileInView="unmasked"
      viewport={VIEWPORT}
    >
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            data-unmask-line=""
            variants={{ masked: { y: "110%" }, unmasked: { y: "0%" } }}
            transition={{ duration: 0.7, delay: index * 0.06, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
