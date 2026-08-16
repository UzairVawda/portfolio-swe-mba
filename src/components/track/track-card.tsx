import Image from "next/image";
import Link from "next/link";

import { formatTrackDate } from "@/components/track/format-date";
import type { TrackItem } from "@/content/track";

export function TrackCard({ item, href }: { item: TrackItem; href: string }) {
  return (
    <Link
      href={href}
      data-testid="gallery-item"
      className="group flex flex-col gap-4 rounded-2xl border border-rule bg-surface p-6 transition-colors hover:border-signal"
    >
      {item.image ? (
        <Image
          src={item.image.src}
          alt={item.image.alt}
          placeholder="blur"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[3/2] w-full rounded-lg object-cover"
        />
      ) : null}
      <time
        dateTime={item.date}
        className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
      >
        {formatTrackDate(item.date)}
      </time>
      <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-signal">
        {item.title}
      </h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {item.blurb}
      </p>
    </Link>
  );
}
