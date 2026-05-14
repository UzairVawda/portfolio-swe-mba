import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { certifications, education } from "@/content/swe";

export function EducationSection() {
  return (
    <Section id="education" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            05 · Education &amp; Certifications
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            Formal training, in progress.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Stagger className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <StaggerItem>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Schools
              </h3>
            </StaggerItem>
            {education.map((entry) => (
              <StaggerItem
                key={entry.school}
                className="flex w-full flex-col items-center gap-1 border-t border-border pt-6 text-center md:items-start md:text-left"
              >
                <p className="text-sm text-muted-foreground">{entry.school}</p>
                <h4 className="text-lg font-medium tracking-tight">
                  {entry.program}
                </h4>
                <p className="font-mono text-xs text-muted-foreground">
                  {entry.detail}
                </p>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <StaggerItem>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Certifications
              </h3>
            </StaggerItem>
            {certifications.map((cert) => (
              <StaggerItem
                key={cert.name}
                className="flex w-full flex-col items-center gap-1 border-t border-border pt-6 text-center md:items-start md:text-left"
              >
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <h4 className="text-lg font-medium tracking-tight">
                  {cert.name}
                </h4>
                <p className="font-mono text-xs text-muted-foreground">
                  {cert.year}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
