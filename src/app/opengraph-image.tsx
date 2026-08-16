import { ImageResponse } from "next/og";

import { OG_SIZE, ogCard } from "@/app/og/card";

export const alt = "Uzair Vawda — Engineer, MBA candidate";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    ogCard({
      eyebrow: "./uzair · portfolio",
      title: "Uzair Vawda.",
      subtitle: "Engineer. MBA candidate. NYC.",
    }),
    { ...size },
  );
}
