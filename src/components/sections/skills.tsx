import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/section";
import { skills } from "@/content/swe";

const palette = [
  "bg-primary/15 text-foreground dark:bg-primary/20",
  "bg-periwinkle/30 text-foreground dark:bg-periwinkle/20",
  "bg-columbia/40 text-foreground dark:bg-columbia/20",
  "bg-celadon/40 text-foreground dark:bg-celadon/20",
];

export function SkillsSection() {
  const groups = Object.entries(skills);

  return (
    <Section id="skills" className="py-24">
      <div className="flex flex-col gap-12">
        <FadeUp className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            03 · Skills
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            The current toolkit.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {groups.map(([group, items], index) => (
            <StaggerItem
              key={group}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {group}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium ${palette[index % palette.length]}`}
                  >
                    {item}
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
