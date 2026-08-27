import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { TrackCard } from "@/components/track/track-card";
import type { TrackItem } from "@/content/track";
import { routes } from "@/lib/routes";

export function TrackGallery({
  items,
  hrefFor,
  heading,
  body,
  empty,
  testId,
}: {
  items: TrackItem[];
  hrefFor: (slug: string) => string;
  heading: string;
  body: string;
  empty: { title: string; body: string };
  testId: string;
}) {
  return (
    <Section className="py-24" data-testid={testId}>
      <div className="flex flex-col gap-12">
        <Reveal className="flex flex-col gap-3">
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            {heading}
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
            {body}
          </p>
        </Reveal>

        {items.length === 0 ? (
          // An empty gallery is the exact problem this redesign is fixing, so
          // the page says plainly that it is empty and what would change that.
          // No skeleton cards, no ghost grid, no countdown to unshipped work —
          // and a way out to the pages that do have something on them.
          <Reveal delay={0.1}>
            <div
              data-testid="gallery-empty"
              className="flex max-w-2xl flex-col gap-4 border-l-2 border-signal bg-tint px-6 py-8 sm:px-8"
            >
              <h2 className="text-balance text-xl font-medium tracking-tight">
                {empty.title}
              </h2>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {empty.body}
              </p>
              <Link
                href={routes.work}
                data-testid="gallery-empty-link"
                className="w-fit font-mono text-sm text-signal underline-offset-4 hover:underline"
              >
                See the work that is shipped
                <span aria-hidden> →</span>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <TrackCard
                key={item.slug}
                item={item}
                href={hrefFor(item.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
