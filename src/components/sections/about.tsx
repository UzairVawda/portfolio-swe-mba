import Image from "next/image";
import Link from "next/link";

import { Reveal, UnmaskLines } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { about, aboutIntro } from "@/content/swe";
import { RESUME_DOWNLOAD_NAME, routes } from "@/lib/routes";

export function AboutSection() {
  return (
    <Section id="about" className="py-24" data-testid="section-about">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="flex justify-center md:sticky md:top-28 md:block">
          <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src="/me.jpeg"
              alt="Portrait of Uzair Vawda"
              fill
              sizes="(max-width: 768px) 80vw, 400px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <Reveal>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
              data-testid="eyebrow-about"
            >
              {eyebrow("about")}
            </p>
          </Reveal>

          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            <UnmaskLines
              lines={[aboutIntro.heading]}
              data-testid="heading-about"
            />
          </h2>

          <div className="flex flex-col gap-5">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={0.15 + index * 0.05}>
                <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35}>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {about.cvLine.before}
              <Link
                href={routes.resume}
                download={RESUME_DOWNLOAD_NAME}
                data-testid="about-cv-link"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                {about.cvLine.label}
              </Link>
              {about.cvLine.after}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
