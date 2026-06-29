"use client";

import { useSyncExternalStore } from "react";

import { particleBudget } from "@/lib/scene/device";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): number {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return particleBudget(window.innerWidth, coarse);
}

// Server snapshot: assume a desktop budget. The field is mounted ssr:false, so
// this is only a fallback, but it keeps the hook hydration-safe regardless.
function getServerSnapshot(): number {
  return particleBudget(1280, false);
}

export function useParticleBudget(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
