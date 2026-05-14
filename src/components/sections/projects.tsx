import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { projects } from "@/content/swe";

export function ProjectsSection() {
  return (
    <Section id="projects" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            04 · Projects
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            What I&apos;m building right now.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <StaggerItem
              key={project.name}
              className="group flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/40 md:p-12"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {project.role} · {project.period}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {project.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
                    </Link>
                  ))}
                </div>
              </div>

              <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
