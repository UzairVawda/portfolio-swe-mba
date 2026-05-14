import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";

export function MbaEmptyState({
  title,
  body,
  ctaHref = "/mba/about",
  ctaLabel = "Get in touch",
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <FadeUp delay={0.2}>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-3xl border border-dashed border-border bg-card/60 px-8 py-16 text-center md:items-start md:text-left">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Empty for now
        </span>
        <h2 className="font-serif text-3xl font-light tracking-tight">
          {title}
        </h2>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          {body}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </FadeUp>
  );
}
