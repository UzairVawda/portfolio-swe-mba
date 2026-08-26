"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Section } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { eyebrow } from "@/content/sections";
import { archive, conceptProjects, projects, workIntro } from "@/content/swe";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type WorkSection = "project" | "concept" | "archive";

// The one place a row slug is constructed. The exported helper below and the
// three <Row> call sites both go through here, so the uniqueness test cannot
// drift away from what the component actually renders.
function rowSlug(section: WorkSection, name: string): string {
  return `${section}-${slugify(name)}`;
}

// Exported so a test can assert the whole set is collision-free. The three
// arrays render as siblings in one Accordion, so their slugs share a namespace
// whether or not the content authors realise it.
export function workRowSlugs(): string[] {
  return [
    ...projects.map((p) => rowSlug("project", p.name)),
    ...conceptProjects.map((c) => rowSlug("concept", c.name)),
    ...archive.map((g) => rowSlug("archive", g.group)),
  ];
}

// One row shell, three callers. The shell owns the numbered trigger and the
// expanding panel; each caller fills the panel with whatever its own content
// shape actually is. Flattening three different shapes into one type with
// five optional fields would just move the branching into the JSX.
function Row({
  index,
  slug,
  name,
  meta,
  children,
}: {
  index: number;
  slug: string;
  name: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={slug} className="border-b border-rule">
      <AccordionTrigger
        data-testid={`work-row-${slug}`}
        className="items-baseline gap-6 py-6 text-left no-underline hover:no-underline data-[panel-open]:text-signal"
      >
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-xl font-medium tracking-tight sm:text-2xl">
          {name}
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          {meta}
        </span>
      </AccordionTrigger>
      <AccordionContent data-testid={`work-panel-${slug}`}>
        <div className="flex flex-col gap-4 bg-tint px-6 py-6">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-signal/30 px-3 py-1 text-xs font-medium text-ink"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function WorkIndexSection() {
  // The ladder numbers run continuously across all three groups, so each
  // caller offsets by what came before it.
  const conceptOffset = projects.length;
  const archiveOffset = conceptOffset + conceptProjects.length;

  return (
    <Section id="work" className="py-24" data-testid="section-work">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {eyebrow("work")}
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            {workIntro.heading}
          </h2>
        </div>

        <Accordion className="border-t border-rule">
          {projects.map((project, index) => (
            <Row
              key={rowSlug("project", project.name)}
              index={index}
              slug={rowSlug("project", project.name)}
              name={project.name}
              meta={`${project.role} · ${project.period}`}
            >
              <Body>{project.description}</Body>
              <Stack items={project.stack} />
              <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {workIntro.helpWantedLabel}
                </span>
                {project.helpWanted}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {project.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-signal underline underline-offset-4"
                  >
                    {link.label} <span aria-hidden>↗</span>
                  </Link>
                ))}
              </div>
            </Row>
          ))}

          {conceptProjects.map((concept, index) => (
            <Row
              key={rowSlug("concept", concept.name)}
              index={conceptOffset + index}
              slug={rowSlug("concept", concept.name)}
              name={concept.name}
              meta={`${workIntro.conceptsLabel} · ${concept.status}`}
            >
              <Body>{concept.description}</Body>
              <Stack items={concept.stack} />
            </Row>
          ))}

          {archive.map((group, index) => (
            <Row
              key={rowSlug("archive", group.group)}
              index={archiveOffset + index}
              slug={rowSlug("archive", group.group)}
              name={group.group}
              meta={workIntro.archiveLabel}
            >
              {index === 0 ? <Body>{workIntro.archiveIntro}</Body> : null}
              <ul className="flex flex-col gap-4">
                {group.items.map((entry) => (
                  <li key={entry.name} className="flex flex-col gap-1">
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {entry.stack}
                    </span>
                  </li>
                ))}
              </ul>
            </Row>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
