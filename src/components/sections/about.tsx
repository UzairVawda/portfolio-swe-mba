import Image from "next/image";

import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import { about } from "@/content/swe";

export function AboutSection() {
  return (
    <Section id="about" className="py-24">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <FadeUp className="md:sticky md:top-28">
          <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src="/me.jpeg"
              alt="Portrait of Uzair Vawda"
              fill
              sizes="(max-width: 768px) 80vw, 400px"
              className="object-cover"
            />
          </div>
        </FadeUp>

        <div className="flex flex-col gap-6">
          <FadeUp>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              01 · About
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              Building software, learning business.
            </h2>
          </FadeUp>

          <div className="flex flex-col gap-5">
            {about.paragraphs.map((paragraph, index) => (
              <FadeUp key={index} delay={0.15 + index * 0.05}>
                <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
