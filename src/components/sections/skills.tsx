import { Reveal, UnmaskLines } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { skills, skillsIntro } from "@/content/swe";

// One accent, one chip. Colour-coding groups was a function of having three
// pastels; with a single signal, differentiation comes from the group heading.
const chip =
  "rounded-full border border-signal/30 bg-tint px-4 py-1.5 text-sm font-medium text-ink";

export function SkillsSection() {
  const groups = Object.entries(skills);

  return (
    <Section id="skills" data-testid="section-skills">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <Reveal>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
              data-testid="eyebrow-skills"
            >
              {eyebrow("skills")}
            </p>
          </Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            <UnmaskLines
              lines={[skillsIntro.heading]}
              data-testid="heading-skills"
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {groups.map(([group, items], index) => (
            <Reveal
              key={group}
              delay={index * 0.06}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40 md:items-start md:text-left"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {group}
              </h3>
              <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                {items.map((item) => (
                  <li key={item} className={chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
