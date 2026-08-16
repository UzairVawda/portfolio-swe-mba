import type { Metadata } from "next";

import { Hero } from "@/components/hero/hero";
import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { InterestsSection } from "@/components/sections/interests";
import { SkillsSection } from "@/components/sections/skills";
import { TrackSection } from "@/components/sections/track";
import { WorkIndexSection } from "@/components/sections/work-index";
import { metaDescription } from "@/content/swe";

export const metadata: Metadata = {
  title: { absolute: "Uzair Vawda — Engineer, MBA candidate" },
  description: metaDescription,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <WorkIndexSection />
      <SkillsSection />
      <EducationSection />
      <InterestsSection />
      <ContactSection />
      <TrackSection />
    </>
  );
}
