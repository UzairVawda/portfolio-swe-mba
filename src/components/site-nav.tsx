import Link from "next/link";

import { MbaMobileNav } from "@/components/mba-mobile-nav";
import { ThemeToggleWithHint } from "@/components/theme-toggle-with-hint";
import { RESUME_DOWNLOAD_NAME, legacyRoutes, routes } from "@/lib/routes";

type Variant = "swe" | "mba";

export function SiteNav({ variant }: { variant: Variant }) {
  const isMba = variant === "mba";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 px-6 backdrop-blur sm:px-8 md:px-12 lg:px-16">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <Link
          href={isMba ? legacyRoutes.mbaHome : routes.home}
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {isMba ? "./uzair/mba" : "./uzair"}
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            href={routes.resume}
            download={RESUME_DOWNLOAD_NAME}
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Resume
          </Link>
          {isMba ? (
            <>
              <Link
                href={legacyRoutes.mbaAbout}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                About
              </Link>
              <Link
                href={legacyRoutes.mbaTools}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Tools
              </Link>
              <Link
                href={legacyRoutes.mbaJournal}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Journal
              </Link>
              <Link
                href={legacyRoutes.mbaSpeaking}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Speaking
              </Link>
              <Link
                href={routes.home}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                ← SWE
              </Link>
              <MbaMobileNav />
            </>
          ) : (
            <Link
              href={legacyRoutes.mbaHome}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              MBA →
            </Link>
          )}
          <ThemeToggleWithHint />
        </div>
      </nav>
    </header>
  );
}
