import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { speaking, tools, trackCopy } from "@/content/track";
import type { TrackItem } from "@/content/track";
import { routes } from "@/lib/routes";

/**
 * The most recent items across both collections, newest first. Takes the
 * collections rather than closing over them so the ordering is provable
 * against fixtures while the real arrays are still empty. Copies before
 * sorting — the collections are module-level and shared.
 */
export function recentItems(
  toolItems: readonly TrackItem[],
  speakingItems: readonly TrackItem[],
  limit: number,
): TrackItem[] {
  return [...toolItems, ...speakingItems]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

// A summary of the track, not the track content itself: what it is, the most
// recent few items, and links into the galleries. The items live at their own
// routes because each needs a shareable URL.
export function TrackSection() {
  const recent = recentItems(tools, speaking, 4);

  return (
    <Section id="track" data-testid="section-track">
      <div className="flex flex-col gap-8 border-l-2 border-signal bg-tint px-8 py-10 md:px-12 md:py-14">
        <Reveal className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {eyebrow("track")}
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {trackCopy.section.heading}
          </h2>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {trackCopy.section.body}
          </p>
        </Reveal>

        {recent.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {recent.map((item) => (
              <li
                key={item.slug}
                data-testid="track-recent-item"
                className="text-base"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {item.date}
                </span>{" "}
                {item.title}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap gap-6">
          <Link
            href={routes.tools}
            data-testid="track-link-tools"
            className="text-sm text-signal underline underline-offset-4"
          >
            Tools <span aria-hidden>→</span>
          </Link>
          <Link
            href={routes.speaking}
            data-testid="track-link-speaking"
            className="text-sm text-signal underline underline-offset-4"
          >
            Speaking <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
