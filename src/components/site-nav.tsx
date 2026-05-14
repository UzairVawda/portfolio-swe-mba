import Link from "next/link";

import { MbaMobileNav } from "@/components/mba-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

type Variant = "swe" | "mba";

export function SiteNav({ variant }: { variant: Variant }) {
  const isMba = variant === "mba";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 px-6 backdrop-blur sm:px-8 md:px-12 lg:px-16">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <Link
          href={isMba ? "/mba" : "/"}
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {isMba ? "./uzair/mba" : "./uzair"}
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {isMba ? (
            <>
              <Link
                href="/mba/tools"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Tools
              </Link>
              <Link
                href="/mba/journal"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Journal
              </Link>
              <Link
                href="/mba/speaking"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Speaking
              </Link>
              <Link
                href="/mba/about"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                About
              </Link>
              <Link
                href="/"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                ← swe
              </Link>
              <MbaMobileNav />
            </>
          ) : (
            <Link
              href="/mba"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              MBA →
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
