import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  as: Tag = "section",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: "section" | "div" | "main" }) {
  return (
    <Tag
      className={cn("w-full px-6 py-16 sm:px-8 md:px-12 lg:px-16", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Tag>
  );
}
