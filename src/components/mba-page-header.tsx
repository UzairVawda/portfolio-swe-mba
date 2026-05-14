import { FadeUp } from "@/components/motion/fade-up";

export function MbaPageHeader({
  number,
  eyebrow,
  headline,
  subhead,
}: {
  number: string;
  eyebrow: string;
  headline: string;
  subhead?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
      <FadeUp className="flex items-baseline gap-4">
        <span className="font-serif text-5xl font-light text-primary tabular-nums">
          {number}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </span>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h1 className="font-serif text-balance text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          {headline}
        </h1>
      </FadeUp>
      {subhead ? (
        <FadeUp delay={0.1}>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {subhead}
          </p>
        </FadeUp>
      ) : null}
    </div>
  );
}
