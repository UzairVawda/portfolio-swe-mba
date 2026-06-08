// src/components/hero/hero.tsx
import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";

export function Hero() {
  return (
    <Section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden py-12">
      {/* A soft, theme-aware scrim that seats the headline over the particle
          field — keeps the copy crisp while the cloud glows around it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 48% at 50% 46%, color-mix(in srgb, var(--background) 82%, transparent) 0%, color-mix(in srgb, var(--background) 45%, transparent) 42%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-10 text-center">
        <FadeUp>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            uzair vawda · portfolio
          </p>
        </FadeUp>

        <Stagger className="flex flex-col gap-6">
          <StaggerItem>
            <h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Uzair Vawda.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-balance text-xl font-light text-muted-foreground sm:text-2xl">
              Engineer. MBA candidate. NYC.
            </p>
          </StaggerItem>
        </Stagger>

        <FadeUp delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-px"
            >
              See work
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/mba"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              MBA section
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
