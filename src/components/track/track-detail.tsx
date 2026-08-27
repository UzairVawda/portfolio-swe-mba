import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/section";
import { formatTrackDate } from "@/components/track/format-date";
import type { TrackItem } from "@/content/track";

// The card, enlarged. Nothing longer — this is all a link preview consumes,
// and it keeps publishing an item to a few lines of data rather than a
// writing task.
export function TrackDetail({
  item,
  backHref,
  backLabel,
}: {
  item: TrackItem;
  backHref: string;
  backLabel: string;
}) {
  return (
    <Section as="main" className="py-24" data-testid="page-track-item">
      <article className="flex max-w-3xl flex-col gap-8">
        <Link
          href={backHref}
          data-testid="track-item-back"
          className="w-fit font-mono text-xs uppercase tracking-[0.16em] text-signal underline-offset-4 hover:underline"
        >
          <span aria-hidden>← </span>
          {backLabel}
        </Link>

        <div className="flex flex-col gap-3">
          <time
            dateTime={item.date}
            className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
          >
            {formatTrackDate(item.date)}
          </time>
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            {item.title}
          </h1>
        </div>

        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            placeholder="blur"
            sizes="(min-width: 768px) 768px, 100vw"
            className="w-full rounded-2xl border border-rule object-cover"
          />
        ) : null}

        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          {item.blurb}
        </p>

        {item.link ? (
          <Link
            href={item.link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
          >
            {item.link.label}
            <span aria-hidden> ↗</span>
          </Link>
        ) : null}
      </article>
    </Section>
  );
}
