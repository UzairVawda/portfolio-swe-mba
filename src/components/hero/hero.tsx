import Link from "next/link";

import { HeroCanvas } from "@/components/hero/hero-canvas";
import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";

export function Hero() {
  return (
    <Section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10 flex flex-col gap-8">
          <FadeUp>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              uzair vawda · portfolio
            </p>
          </FadeUp>

          <Stagger className="flex flex-col gap-5">
            <StaggerItem>
              <h1 className="text-balance text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                Uzair Vawda.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-balance text-2xl font-light text-muted-foreground sm:text-3xl">
                Engineer. MBA candidate. NYC.
              </p>
            </StaggerItem>
          </Stagger>

          <FadeUp delay={0.4}>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
              >
                See work
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/mba"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                MBA section
                <span aria-hidden>→</span>
              </Link>
            </div>
          </FadeUp>
        </div>

        <div
          className="relative h-[320px] w-full sm:h-[420px] md:h-[480px]"
          aria-hidden
        >
          <HeroCanvas />
        </div>
      </div>
    </Section>
  );
}
