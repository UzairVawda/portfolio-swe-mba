import Link from "next/link";

import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { eyebrow } from "@/content/sections";
import { conceptProjects, projects, projectsIntro } from "@/content/swe";

export function ProjectsSection() {
  return (
    <Section id="projects" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow("projects")}
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {projectsIntro.heading}
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <StaggerItem
              key={project.name}
              className="group flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/40 md:items-start md:p-12 md:text-left"
            >
              <div className="flex w-full flex-col items-center gap-4 md:flex-row md:flex-wrap md:items-baseline md:justify-between">
                <div className="flex flex-col items-center gap-1 md:items-start">
                  <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {project.role} · {project.period}
                  </p>
                  <span className="mt-1 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {project.status}
                  </span>
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

              <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground/90">
                <span className="font-medium text-foreground">
                  {projectsIntro.helpWantedLabel}
                </span>
                {project.helpWanted}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="flex flex-col gap-6">
          <FadeUp>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {projectsIntro.conceptsLabel}
            </p>
          </FadeUp>
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {conceptProjects.map((project) => (
              <StaggerItem
                key={project.name}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium tracking-tight">
                    {project.name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {project.status}
                  </p>
                </div>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
