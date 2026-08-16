import type { Metadata } from "next";

import { TrackGallery } from "@/components/track/track-gallery";
import { tools, trackCopy } from "@/content/track";
import { toolItem } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Tools",
  description: trackCopy.tools.body,
};

export default function ToolsPage() {
  return (
    <TrackGallery
      items={tools}
      hrefFor={toolItem}
      heading={trackCopy.tools.heading}
      body={trackCopy.tools.body}
      empty={trackCopy.tools.empty}
      testId="page-tools"
    />
  );
}
