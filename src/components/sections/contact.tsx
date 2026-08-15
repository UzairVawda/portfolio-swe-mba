import { ContactForm } from "@/components/contact-form";
import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { contact } from "@/content/swe";

export function ContactSection() {
  return (
    <Section id="contact" className="py-24">
      <div className="flex flex-col gap-10">
        <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow("contact")}
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {contact.headline}
          </h2>
          {contact.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <ContactForm source="portfolio" />
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
