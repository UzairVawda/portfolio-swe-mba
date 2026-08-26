import { Camera, Coffee, Plane, Swords } from "lucide-react";

import { Reveal, UnmaskLines } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { interests, interestsIntro, type Interest } from "@/content/swe";

const iconMap: Record<Interest["icon"], typeof Camera> = {
  swords: Swords,
  camera: Camera,
  coffee: Coffee,
  plane: Plane,
};

// One accent, one surface. Colour-coding the icons was a function of having
// three pastels; with a single signal, the icon itself carries the meaning.
const iconSurface = "border border-signal/30 bg-tint text-signal";

export function InterestsSection() {
  return (
    <Section id="off-screen" data-testid="section-interests">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <Reveal>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
              data-testid="eyebrow-interests"
            >
              {eyebrow("interests")}
            </p>
          </Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            <UnmaskLines
              lines={[interestsIntro.heading]}
              data-testid="heading-interests"
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {interests.map((interest, index) => {
            const Icon = iconMap[interest.icon];
            return (
              <Reveal
                key={interest.label}
                delay={index * 0.06}
                className="group flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/40 md:items-start md:p-10 md:text-left"
              >
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${iconSurface}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex flex-col items-center gap-3 md:items-start">
                  <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-primary">
                    {interest.label}
                  </h3>
                  <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                    {interest.blurb}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
