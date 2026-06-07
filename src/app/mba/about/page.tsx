import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { MbaPageHeader } from "@/components/mba-page-header";
import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { about } from "@/content/mba";

export const metadata: Metadata = {
  title: "About",
  description: about.bio[0],
};

export default function MbaAboutPage() {
  return (
    <>
      <Section className="pt-20 pb-12 sm:pt-28">
        <div className="flex flex-col gap-16">
          <MbaPageHeader
            number={about.number}
            eyebrow={about.eyebrow}
            headline={about.headline}
          />

          <Stagger className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            {about.bio.map((paragraph, index) => (
              <StaggerItem key={index}>
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section className="py-12">
        <div className="flex flex-col gap-10">
          <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Sections
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight">
              What you&apos;ll find here.
            </h2>
          </FadeUp>

          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {about.overview.map((section) => (
              <StaggerItem
                key={section.route}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40 md:items-start md:text-left"
              >
                <Link
                  href={section.route}
                  className="font-serif text-2xl font-light tracking-tight transition-colors hover:text-primary"
                >
                  {section.label}
                </Link>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section className="py-12">
        <div className="flex flex-col gap-6">
          <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Links
            </p>
          </FadeUp>
          <Stagger className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {about.links.map((link) => {
              // External links and the resume PDF open in a new tab so the
              // visitor never navigates away from the portfolio.
              const opensNewTab =
                link.href.startsWith("http") || link.href.endsWith(".pdf");
              return (
              <StaggerItem
                key={link.href}
                as="span"
                className="inline-flex"
              >
                <Link
                  href={link.href}
                  target={opensNewTab ? "_blank" : undefined}
                  rel={opensNewTab ? "noreferrer noopener" : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                  <span aria-hidden>↗</span>
                </Link>
              </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Section>

      <Section className="py-12 pb-32">
        <div className="flex flex-col gap-10">
          <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight">
              {about.contact.headline}
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              {about.contact.description}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
              <ContactForm />
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
