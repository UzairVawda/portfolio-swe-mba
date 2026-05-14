import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

type Variant = "swe" | "mba";

export function SiteNav({ variant }: { variant: Variant }) {
  const isMba = variant === "mba";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16">
        <Link
          href={isMba ? "/mba" : "/"}
          className="font-mono text-sm tracking-tight text-foreground hover:text-primary transition-colors"
        >
          {isMba ? "uzair / mba" : "uzair"}
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {isMba ? (
            <>
              <Link
                href="/mba/tools"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline-flex"
              >
                Tools
              </Link>
              <Link
                href="/mba/journal"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline-flex"
              >
                Journal
              </Link>
              <Link
                href="/mba/speaking"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline-flex"
              >
                Speaking
              </Link>
              <Link
                href="/mba/about"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline-flex"
              >
                About
              </Link>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← swe
              </Link>
            </>
          ) : (
            <Link
              href="/mba"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              mba →
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
