import { Camera, Coffee, Plane, Swords } from "lucide-react";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { interests, type Interest } from "@/content/swe";

const iconMap: Record<Interest["icon"], typeof Camera> = {
  swords: Swords,
  camera: Camera,
  coffee: Coffee,
  plane: Plane,
};

const surfaces = [
  "bg-primary/10 text-primary",
  "bg-periwinkle/30 text-foreground dark:bg-periwinkle/20",
  "bg-columbia/40 text-foreground dark:bg-columbia/20",
  "bg-celadon/40 text-foreground dark:bg-celadon/20",
];

export function InterestsSection() {
  return (
    <Section id="off-screen" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            06 · Off-screen
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            What I&apos;m doing when I&apos;m not at the keyboard.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {interests.map((interest, index) => {
            const Icon = iconMap[interest.icon];
            return (
              <StaggerItem
                key={interest.label}
                className="group flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/40 md:p-10"
              >
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${surfaces[index % surfaces.length]}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-primary">
                    {interest.label}
                  </h3>
                  <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                    {interest.blurb}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
