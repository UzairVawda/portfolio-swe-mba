import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "404 — Not found",
};

export default function NotFound() {
  // No nav or footer here: the root layout wraps this in the site shell.
  return (
    <div className="flex flex-1 flex-col justify-center">
      <Section className="flex min-h-[60vh] items-center justify-center py-24">
          <div
            className="flex flex-col items-center gap-6 text-center"
            data-testid="not-found"
          >
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                404
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-balance text-5xl font-medium tracking-tight sm:text-6xl">
                Not here.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="max-w-md text-pretty text-lg text-muted-foreground">
                That page doesn&apos;t exist (yet). The site is small — try one
                of these.
              </p>
            </Reveal>
            <Reveal
              delay={0.3}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <Link
                href={routes.home}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
                data-testid="not-found-home"
              >
                Home
                <span aria-hidden>→</span>
              </Link>
              <Link
                href={routes.work}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                data-testid="not-found-work"
              >
                Recent work
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
      </Section>
    </div>
  );
}
