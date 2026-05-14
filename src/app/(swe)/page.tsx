import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";

export default function SwePage() {
  return (
    <Section className="pt-24 pb-24 sm:pt-32">
      <div className="flex flex-col gap-10">
        <FadeUp>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            v0.1 · phase 1 preview
          </p>
        </FadeUp>

        <Stagger className="flex flex-col gap-6">
          <StaggerItem>
            <h1 className="text-balance text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl">
              Uzair Vawda.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Software engineer. MBA candidate. Building tools, shipping ideas,
              and{" "}
              <span className="text-primary">documenting it all publicly</span>.
            </p>
          </StaggerItem>

          <StaggerItem className="flex items-center gap-3 pt-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-primary" />
            <span className="inline-flex h-3 w-3 rounded-full bg-periwinkle" />
            <span className="inline-flex h-3 w-3 rounded-full bg-columbia" />
            <span className="inline-flex h-3 w-3 rounded-full bg-celadon" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              palette
            </span>
          </StaggerItem>
        </Stagger>

        <FadeUp delay={0.4} className="pt-12">
          <p className="font-mono text-sm text-muted-foreground">
            Phase 1 wiring up. Hero, experience, projects in Phase 2.
          </p>
        </FadeUp>
      </div>
    </Section>
  );
}
