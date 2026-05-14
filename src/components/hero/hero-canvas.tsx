"use client";

import dynamic from "next/dynamic";

const WireframeMesh = dynamic(() => import("./wireframe-mesh"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden />,
});

export function HeroCanvas() {
  return <WireframeMesh />;
}
