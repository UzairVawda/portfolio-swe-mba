import { ImageResponse } from "next/og";

import { OG_SIZE, ogCard } from "@/app/og/card";
import { findItem, speaking } from "@/content/track";

export const alt = "Uzair Vawda — speaking";
export const size = OG_SIZE;
export const contentType = "image/png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzairvawda.me";

// Match the page: a slug outside the collection is a 404, not an on-demand
// render. Without this the page 404s while its preview image still returns a
// card, which is how a link to nothing ends up looking like a real page.
export const dynamicParams = false;

export function generateStaticParams() {
  return speaking.map((item) => ({ slug: item.slug }));
}

// Next 16: params is a Promise here and must be awaited.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(speaking, slug);

  if (item?.image) {
    // The event photo is the better preview; serve it rather than a card.
    // Satori draws a raw <img> — next/image does not exist in this renderer —
    // and needs an absolute URL because the static asset path is site-relative.
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <img
            src={new URL(item.image.src.src, siteUrl).toString()}
            alt=""
            width={size.width}
            height={size.height}
            style={{ objectFit: "cover" }}
          />
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    ogCard({
      eyebrow: "speaking",
      title: item?.title ?? "Speaking",
      subtitle: item?.blurb ?? "Talks, workshops, panels.",
    }),
    { ...size },
  );
}
