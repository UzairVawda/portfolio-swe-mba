"use client";

import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("./particle-field").then((m) => m.ParticleField),
  {
    ssr: false,
    loading: () => null,
  },
);

export function ParticleFieldMount() {
  return <ParticleField />;
}
