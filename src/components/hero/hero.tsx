import Link from "next/link";

import { OvertureMount } from "@/components/scene/overture-mount";
import { Section } from "@/components/section";
import { hero } from "@/content/swe";
import { RESUME_DOWNLOAD_NAME, routes } from "@/lib/routes";

export function Hero() {
  return (
    <Section
      data-testid="hero"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-12"
    >
      <OvertureMount>
        <h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          {hero.name}
        </h1>
        <p className="max-w-2xl text-balance text-xl font-light text-muted-foreground sm:text-2xl">
          {hero.positioning}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            data-testid="hero-cta-resume"
            href={routes.resume}
            download={RESUME_DOWNLOAD_NAME}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-px"
          >
            {hero.actions.resume}
            <span aria-hidden>↓</span>
          </Link>
          <Link
            data-testid="hero-cta-work"
            href={routes.work}
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-7 py-3.5 text-base text-foreground transition-colors hover:border-signal hover:text-signal"
          >
            {hero.actions.work}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </OvertureMount>
    </Section>
  );
}
