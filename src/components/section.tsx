import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  as: Tag = "section",
  scrim = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "main";
  /**
   * Lay a wash of page background between the fixed particle canvas and this
   * section's copy. For text-dense sections where the animation competes with
   * the text. `isolate` keeps the -z-10 layer inside this section's stacking
   * context, so it covers the canvas without sinking behind it.
   */
  scrim?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "w-full px-6 py-16 sm:px-8 md:px-12 lg:px-16",
        scrim && "section-scrim relative isolate",
        className,
      )}
      {...props}
    >
      {scrim ? (
        <div
          aria-hidden
          className="section-scrim-layer pointer-events-none absolute inset-0 -z-10"
        />
      ) : null}
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Tag>
  );
}
