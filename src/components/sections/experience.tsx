import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { experience } from "@/content/swe";

export function ExperienceSection() {
  return (
    <Section id="experience" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            02 · Experience
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            Six years across aerospace, finance, and legal tech.
          </h2>
        </FadeUp>

        <Stagger className="flex flex-col">
          {experience.map((role, index) => (
            <StaggerItem
              key={`${role.company}-${role.title}`}
              className="group grid grid-cols-1 gap-3 border-t border-border py-8 md:grid-cols-[180px_1fr] md:gap-8"
            >
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground">
                  {role.start} — {role.end}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                  {String(experience.length - index).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-primary">
                    {role.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    {role.company}
                  </span>
                </div>
                <p className="max-w-2xl text-pretty text-base text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
