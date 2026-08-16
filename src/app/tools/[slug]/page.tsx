import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrackDetail } from "@/components/track/track-detail";
import { findItem, tools, trackCopy } from "@/content/track";
import { routes } from "@/lib/routes";

// Prerender every item; 404 anything not in the collection rather than
// rendering an on-demand page for a slug that does not exist. The collection
// is empty today, so this route prerenders nothing and every /tools/<slug>
// is a 404 — which is correct until the first tool ships.
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(tools, slug);
  if (!item) return {};
  return { title: item.title, description: item.blurb };
}

export default async function ToolItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(tools, slug);
  if (!item) notFound();

  return (
    <TrackDetail
      item={item}
      backHref={routes.tools}
      backLabel={trackCopy.tools.heading}
    />
  );
}
