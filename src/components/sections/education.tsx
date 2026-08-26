import { Reveal, UnmaskLines } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { certifications, education, educationIntro } from "@/content/swe";

export function EducationSection() {
  return (
    <Section id="education" data-testid="section-education">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <Reveal>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
              data-testid="eyebrow-education"
            >
              {eyebrow("education")}
            </p>
          </Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            <UnmaskLines
              lines={[educationIntro.heading]}
              data-testid="heading-education"
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <Reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Schools
              </h3>
            </Reveal>
            {education.map((entry, index) => (
              <Reveal
                key={entry.school}
                delay={(index + 1) * 0.06}
                className="flex w-full flex-col items-center gap-1 border-t border-border pt-6 text-center md:items-start md:text-left"
              >
                <p className="text-sm text-muted-foreground">{entry.school}</p>
                <h4 className="text-lg font-medium tracking-tight">
                  {entry.program}
                </h4>
                <p className="font-mono text-xs text-muted-foreground">
                  {entry.detail}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <Reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Certifications
              </h3>
            </Reveal>
            {certifications.map((cert, index) => (
              <Reveal
                key={cert.name}
                delay={(index + 1) * 0.06}
                className="flex w-full flex-col items-center gap-1 border-t border-border pt-6 text-center md:items-start md:text-left"
              >
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <h4 className="text-lg font-medium tracking-tight">
                  {cert.name}
                </h4>
                <p className="font-mono text-xs text-muted-foreground">
                  {cert.year}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
