import { ImageResponse } from "next/og";

import { OG_SIZE, ogCard } from "@/app/og/card";
import { findItem, tools } from "@/content/track";

export const alt = "Uzair Vawda — tool";
export const size = OG_SIZE;
export const contentType = "image/png";

// Match the page: a slug outside the collection is a 404, not an on-demand
// render. Without this the page 404s while its preview image still returns a
// card, which is how a link to nothing ends up looking like a real page.
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((item) => ({ slug: item.slug }));
}

// Next 16: params is a Promise here and must be awaited.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(tools, slug);

  return new ImageResponse(
    ogCard({
      eyebrow: "tools",
      title: item?.title ?? "Tools",
      subtitle: item?.blurb ?? "One shippable tool per class.",
    }),
    { ...size },
  );
}
