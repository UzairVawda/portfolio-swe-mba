// src/components/hero/hero.tsx
import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { RESUME_DOWNLOAD_NAME, legacyRoutes, routes } from "@/lib/routes";

export function Hero() {
  return (
    <Section className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-12">
      <div className="flex flex-col items-center gap-10 text-center">
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
              href={routes.resume}
              download={RESUME_DOWNLOAD_NAME}
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Resume
              <span aria-hidden>↓</span>
            </Link>
            <Link
              href={legacyRoutes.mbaHome}
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
