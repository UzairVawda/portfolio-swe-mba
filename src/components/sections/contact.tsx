import { ContactForm } from "@/components/contact-form";
import { Reveal, UnmaskLines } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { contact } from "@/content/swe";

export function ContactSection() {
  return (
    <Section id="contact" className="py-24" data-testid="section-contact">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <Reveal>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
              data-testid="eyebrow-contact"
            >
              {eyebrow("contact")}
            </p>
          </Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            <UnmaskLines
              lines={[contact.headline]}
              data-testid="heading-contact"
            />
          </h2>
          <Reveal delay={0.1}>
            {contact.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} data-testid="reveal-contact-form">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <ContactForm source="portfolio" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
