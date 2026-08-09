import { FadeUp } from "@/components/motion/fade-up";
import { Section } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { archive } from "@/content/swe";

export function ArchiveSection() {
  return (
    <Section id="archive" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            04 · Archive
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            Everything before that.
          </h2>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground">
            Coursework, prototypes, and things I built to find out whether I
            could. Most of them taught me something that showed up later.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Accordion className="rounded-3xl border border-border bg-card px-6 py-2 md:px-8">
            {archive.map((group) => (
              <AccordionItem key={group.group} value={group.group}>
                <AccordionTrigger className="py-5 text-base font-medium">
                  {group.group}
                  <span className="ml-3 font-mono text-xs font-normal text-muted-foreground">
                    {group.items.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="flex flex-col gap-5">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex flex-col gap-1 border-l-2 border-border pl-4"
                      >
                        <h3 className="text-sm font-medium tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground/70">
                          {item.stack}
                        </p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </Section>
  );
}
