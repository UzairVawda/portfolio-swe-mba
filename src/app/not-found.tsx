import type { Metadata } from "next";
import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "404 — Not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNav variant="swe" />
      <main className="flex-1">
        <Section className="flex min-h-[60vh] items-center justify-center py-24">
          <div className="flex flex-col items-center gap-6 text-center">
            <FadeUp>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                404
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="text-balance text-5xl font-medium tracking-tight sm:text-6xl">
                Not here.
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="max-w-md text-pretty text-lg text-muted-foreground">
                That page doesn&apos;t exist (yet). The site is small — try one
                of these.
              </p>
            </FadeUp>
            <FadeUp
              delay={0.3}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
              >
                Home
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/mba"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                MBA section
                <span aria-hidden>→</span>
              </Link>
            </FadeUp>
          </div>
        </Section>
      </main>
      <SiteFooter variant="swe" />
    </div>
  );
}
