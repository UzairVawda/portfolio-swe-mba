import type { Metadata } from "next";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "MBA Portfolio",
  description:
    "A working portfolio of consulting tools, journal entries, and case studies — one per MBA class at Baruch's Zicklin School of Business.",
};

export default function MbaLandingPage() {
  return (
    <Section className="pt-24 pb-24 sm:pt-32">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex items-baseline gap-4">
          <span className="font-serif text-5xl font-light text-primary tabular-nums">
            01
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            MBA Portfolio
          </span>
        </FadeUp>

        <Stagger className="flex flex-col gap-6">
          <StaggerItem>
            <h1 className="font-serif text-balance text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              A working portfolio of{" "}
              <span className="italic text-primary">consulting tools</span>{" "}
              built one per class.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Software engineer, MBA candidate. Each class produces a shippable
              tool — published here as it ships.
            </p>
          </StaggerItem>
        </Stagger>

        <FadeUp delay={0.4} className="pt-12">
          <p className="font-mono text-sm text-muted-foreground">
            Phase 3 will fill in /tools, /journal, /speaking, /about.
          </p>
        </FadeUp>
      </div>
    </Section>
  );
}
