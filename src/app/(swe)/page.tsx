import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/hero/hero";
import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import { AboutSection } from "@/components/sections/about";
import { ArchiveSection } from "@/components/sections/archive";
import { ContactSection } from "@/components/sections/contact";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { InterestsSection } from "@/components/sections/interests";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";
import { mbaTeaser, metaDescription } from "@/content/swe";

export const metadata: Metadata = {
  title: { absolute: "Uzair Vawda — Engineer, MBA candidate" },
  description: metaDescription,
};

export default function SwePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ArchiveSection />
      <SkillsSection />
      <EducationSection />
      <InterestsSection />
      <ContactSection />
      <Section className="py-24">
        <FadeUp>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/30 bg-primary/5 p-10 text-center md:items-start md:p-14 md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {mbaTeaser.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              {mbaTeaser.heading}
            </h2>
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
              {mbaTeaser.body}
            </p>
            <Link
              href="/mba"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
            >
              {mbaTeaser.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
