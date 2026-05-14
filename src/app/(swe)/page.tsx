import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/hero/hero";
import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import { AboutSection } from "@/components/sections/about";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { InterestsSection } from "@/components/sections/interests";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";

export const metadata: Metadata = {
  title: { absolute: "Uzair Vawda — Engineer, MBA candidate" },
  description:
    "Software engineer and MBA candidate based in NYC. Six years across aerospace, finance, and legal tech. Currently shipping at Collins Aerospace.",
};

export default function SwePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <InterestsSection />
      <Section className="py-24">
        <FadeUp>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/30 bg-primary/5 p-10 text-center md:items-start md:p-14 md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              07 · What&apos;s next
            </p>
            <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              Building a portfolio of consulting tools, one per MBA class.
            </h2>
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
              The MBA section is a separate, evolving project — shippable tools
              tied to each class, written up as case studies.
            </p>
            <Link
              href="/mba"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
            >
              Visit MBA section
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
