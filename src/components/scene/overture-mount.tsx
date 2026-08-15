"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import {
  useCallback,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { hasPlayedOverture } from "@/lib/scene/session";

const OvertureScene = dynamic(
  () => import("./overture-scene").then((m) => m.OvertureScene),
  { ssr: false, loading: () => null },
);

// The session flag is not a React value and nothing broadcasts changes to it,
// so there is nothing to subscribe to.
function subscribe() {
  return () => {};
}

function playedOnClient(): boolean {
  return hasPlayedOverture(window.sessionStorage);
}

// The server has no sessionStorage, so it renders the resolved document: the
// copy is in the HTML and visible by default, and a JS failure leaves a
// readable page. The client re-reads after hydration and starts the sequence
// only if this session has not seen it.
function playedOnServer(): boolean {
  return true;
}

// Takes the hero document as children and owns its reveal directly, rather
// than signalling through a data attribute and a stylesheet.
export function OvertureMount({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  // Read through useSyncExternalStore rather than in an effect: reading
  // sessionStorage during render would break hydration, and this is the
  // sanctioned way to hand React a different client and server value.
  const played = useSyncExternalStore(
    subscribe,
    playedOnClient,
    playedOnServer,
  );
  const [resolved, setResolved] = useState(false);
  const onResolved = useCallback(() => setResolved(true), []);

  // Reduced motion is checked HERE rather than only in the scene. Letting the
  // scene mount and resolve itself would hide the copy for one commit first —
  // a flash shown to exactly the people who asked for less motion.
  const playing = !reduced && !played && !resolved;

  return (
    <>
      {playing ? <OvertureScene onResolved={onResolved} /> : null}
      <div
        data-testid="hero-document"
        style={{
          opacity: playing ? 0 : 1,
          transition: reduced
            ? undefined
            : "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative z-10 flex flex-col items-center gap-10 text-center"
      >
        {children}
      </div>
    </>
  );
}
