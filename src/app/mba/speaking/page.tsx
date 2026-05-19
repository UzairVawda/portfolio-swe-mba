import type { Metadata } from "next";

import { MbaEmptyState } from "@/components/mba-empty-state";
import { MbaPageHeader } from "@/components/mba-page-header";
import { Section } from "@/components/section";
import { speaking } from "@/content/mba";

export const metadata: Metadata = {
  title: "Speaking",
  description: speaking.subhead,
};

export default function SpeakingPage() {
  return (
    <Section className="pt-20 pb-32 sm:pt-28">
      <div className="flex flex-col gap-16">
        <MbaPageHeader
          number={speaking.number}
          eyebrow={speaking.eyebrow}
          headline={speaking.headline}
          subhead={speaking.subhead}
        />
        <MbaEmptyState
          title={speaking.emptyState.title}
          body={speaking.emptyState.body}
        />
      </div>
    </Section>
  );
}
