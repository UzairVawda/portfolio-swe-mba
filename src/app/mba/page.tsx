import type { Metadata } from "next";
import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { landing } from "@/content/mba";
import { legacyRoutes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "MBA Portfolio",
  description:
    "A working portfolio of consulting tools, journal entries, and case studies — one per MBA class at Baruch's Zicklin School of Business.",
};

export default function MbaLandingPage() {
  return (
    <Section
      className="flex flex-1 flex-col justify-center py-12"
      data-testid="page-mba"
    >
      <div className="flex flex-col items-center gap-10 text-center md:items-start md:text-left">
        <FadeUp className="flex items-baseline gap-4">
          <span className="text-5xl font-light text-primary tabular-nums">
            {landing.number}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {landing.eyebrow}
          </span>
        </FadeUp>

        <Stagger className="flex flex-col items-center gap-6 md:items-start">
          <StaggerItem>
            <h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {landing.headline}
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="max-w-2xl text-pretty text-xl font-light leading-relaxed text-muted-foreground sm:text-2xl">
              {landing.subhead}
            </p>
          </StaggerItem>
        </Stagger>

        <FadeUp
          delay={0.4}
          className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start"
        >
          <Link
            href={legacyRoutes.mbaAbout}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-px"
          >
            About
            <span aria-hidden>→</span>
          </Link>
          <Link
            href={legacyRoutes.mbaTools}
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Tools
            <span aria-hidden>→</span>
          </Link>
        </FadeUp>
      </div>
    </Section>
  );
}
