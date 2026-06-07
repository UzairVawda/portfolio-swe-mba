import Link from "next/link";

import { HeroCanvas } from "@/components/hero/hero-canvas";
import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";

export function Hero() {
  return (
    <Section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden py-12">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_1fr]">
        <div className="relative z-10 flex flex-col items-center gap-10 text-center md:items-start md:text-left">
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
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
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

        <div
          className="relative h-[380px] w-full sm:h-[500px] md:h-[580px]"
          aria-hidden
        >
          <HeroCanvas />
        </div>
      </div>
    </Section>
  );
}
