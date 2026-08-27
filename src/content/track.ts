// Single source of truth for the MBA track: the tools and the speaking.
//
// One shape, two collections. Everything here is card-shaped — image, blurb,
// link — which is all a link preview consumes, and all that publishing an item
// should cost. Nothing here is article-shaped, which is why there is no MDX.

import type { StaticImageData } from "next/image";

export type TrackItem = {
  /** The shareable URL segment. Lower-case, hyphenated, unique per collection. */
  slug: string;
  title: string;
  /** ISO calendar date, YYYY-MM-DD. */
  date: string;
  /** One to three sentences. Long enough to say something, short enough to preview. */
  blurb: string;
  /**
   * Static imports only: next/image reads the intrinsic dimensions off the
   * import and generates a blur placeholder from them. A plain string src
   * throws at build time.
   */
  image?: { src: StaticImageData; alt: string };
  link?: { label: string; href: string };
};

// Newest first, in both collections.
//
// Both start empty, and they start empty on purpose — an item goes up once it
// exists and not before. The galleries ship with an honest empty state saying
// exactly that, and neither route is linked from the nav until it has an item.

export const tools: TrackItem[] = [];

export const speaking: TrackItem[] = [];

export const trackCopy = {
  section: {
    heading: "The MBA track, in public.",
    body: "Evenings are an MBA at Baruch's Zicklin School. Every class ends in a deliverable, so each one ends in something shippable instead — a small consulting tool — and the workshops, panels, and case competitions get written up after the fact. Both land here when they land.",
  },
  tools: {
    heading: "One shippable tool per class.",
    body: "Small consulting tools built alongside the coursework — an IT maturity assessment, a market-sizing dashboard, whatever the class actually asks for.",
    empty: {
      title: "No tools published yet.",
      body: "The first one goes up when the first one is finished. Nothing is listed here before it is built.",
    },
  },
  speaking: {
    heading: "Talks, workshops, panels.",
    body: "Written up after they happen — what the room pushed back on, and what I would say differently the second time.",
    empty: {
      title: "No events written up yet.",
      body: "Each one gets documented here afterward. Nothing is announced in advance.",
    },
  },
} as const;

/** Looks an item up by its exact slug. Returns undefined when nothing matches. */
export function findItem(
  collection: TrackItem[],
  slug: string,
): TrackItem | undefined {
  return collection.find((item) => item.slug === slug);
}
