import type { Metadata } from "next";

import { TrackGallery } from "@/components/track/track-gallery";
import { speaking, trackCopy } from "@/content/track";
import { speakingItem } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Speaking",
  description: trackCopy.speaking.body,
};

export default function SpeakingPage() {
  return (
    <TrackGallery
      items={speaking}
      hrefFor={speakingItem}
      heading={trackCopy.speaking.heading}
      body={trackCopy.speaking.body}
      empty={trackCopy.speaking.empty}
      testId="page-speaking"
    />
  );
}
