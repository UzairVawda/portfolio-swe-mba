import type { Metadata } from "next";

import { MbaEmptyState } from "@/components/mba-empty-state";
import { MbaPageHeader } from "@/components/mba-page-header";
import { Section } from "@/components/section";
import { tools } from "@/content/mba";

export const metadata: Metadata = {
  title: "Tools",
  description: tools.subhead,
};

export default function ToolsPage() {
  return (
    <Section className="pt-20 pb-32 sm:pt-28">
      <div className="flex flex-col gap-16">
        <MbaPageHeader
          number={tools.number}
          eyebrow={tools.eyebrow}
          headline={tools.headline}
          subhead={tools.subhead}
        />
        <MbaEmptyState
          title={tools.emptyState.title}
          body={tools.emptyState.body}
        />
      </div>
    </Section>
  );
}
