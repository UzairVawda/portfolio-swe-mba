import { Reveal, UnmaskLines } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { experience, experienceIntro } from "@/content/swe";

export function ExperienceSection() {
  return (
    <Section id="experience" data-testid="section-experience">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <Reveal>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
              data-testid="eyebrow-experience"
            >
              {eyebrow("experience")}
            </p>
          </Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            <UnmaskLines
              lines={[experienceIntro.heading]}
              data-testid="heading-experience"
            />
          </h2>
        </div>

        <div className="flex flex-col">
          {experience.map((role, index) => (
            <Reveal
              key={`${role.company}-${role.title}`}
              delay={index * 0.06}
              className="group grid grid-cols-1 gap-3 border-t border-border py-8 md:grid-cols-[140px_1fr] md:gap-10"
            >
              <div className="flex flex-col items-center md:items-start">
                <span className="font-mono text-xs text-muted-foreground">
                  {role.start} — {role.end}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                  {String(experience.length - index).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 md:justify-start">
                  <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-primary">
                    {role.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    {role.company}
                  </span>
                </div>
                <p className="max-w-4xl text-pretty text-lg leading-relaxed text-muted-foreground">
                  {role.description}
                </p>
                {role.note ? (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {role.note}
                  </span>
                ) : null}
                <ul className="mt-2 flex max-w-4xl flex-col gap-2.5 text-left">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative pl-5 text-pretty text-base leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
