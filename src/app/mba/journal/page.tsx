import type { Metadata } from "next";

import { MbaEmptyState } from "@/components/mba-empty-state";
import { MbaPageHeader } from "@/components/mba-page-header";
import { Section } from "@/components/section";
import { journal } from "@/content/mba";

export const metadata: Metadata = {
  title: "Journal",
  description: journal.subhead,
};

export default function JournalPage() {
  return (
    <Section className="pt-20 pb-32 sm:pt-28">
      <div className="flex flex-col gap-16">
        <MbaPageHeader
          number={journal.number}
          eyebrow={journal.eyebrow}
          headline={journal.headline}
          subhead={journal.subhead}
        />
        <MbaEmptyState
          title={journal.emptyState.title}
          body={journal.emptyState.body}
        />
      </div>
    </Section>
  );
}
