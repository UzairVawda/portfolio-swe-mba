import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrackDetail } from "@/components/track/track-detail";
import { findItem, speaking, trackCopy } from "@/content/track";
import { routes } from "@/lib/routes";

// Deliberately a copy of src/app/tools/[slug]/page.tsx with a different
// collection rather than a shared factory: two ten-line route files that
// differ by one import are clearer than one indirection that has to be read
// to be understood.
export const dynamicParams = false;

export function generateStaticParams() {
  return speaking.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(speaking, slug);
  if (!item) return {};
  return { title: item.title, description: item.blurb };
}

export default async function SpeakingItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(speaking, slug);
  if (!item) notFound();

  return (
    <TrackDetail
      item={item}
      backHref={routes.speaking}
      backLabel={trackCopy.speaking.heading}
    />
  );
}
