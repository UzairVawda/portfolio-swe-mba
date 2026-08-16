import Link from "next/link";

import { ThemeToggleWithHint } from "@/components/theme-toggle-with-hint";
import { speaking, tools } from "@/content/track";
import { RESUME_DOWNLOAD_NAME, routes } from "@/lib/routes";

export type NavLink = { href: string; label: string; testId: string };

// Flat: Work · Tools · Speaking · About · Contact, all peers. No MBA hub and
// no dropdown — the MBA work sits alongside the engineering work, which is
// also why this component no longer takes a `variant`.
//
// Tools and Speaking appear only once they have something in them. A nav
// entry leading to an empty page is worse than no nav entry. Taking the
// counts as an argument rather than reading the collections directly is what
// makes both sides of that gate testable while both collections are empty.
export function navLinks(counts: {
  tools: number;
  speaking: number;
}): NavLink[] {
  return [
    { href: routes.work, label: "Work", testId: "nav-work", show: true },
    {
      href: routes.tools,
      label: "Tools",
      testId: "nav-tools",
      show: counts.tools > 0,
    },
    {
      href: routes.speaking,
      label: "Speaking",
      testId: "nav-speaking",
      show: counts.speaking > 0,
    },
    { href: routes.about, label: "About", testId: "nav-about", show: true },
    {
      href: routes.contact,
      label: "Contact",
      testId: "nav-contact",
      show: true,
    },
  ]
    .filter((link) => link.show)
    .map(({ href, label, testId }) => ({ href, label, testId }));
}

export function SiteNav() {
  const links = navLinks({ tools: tools.length, speaking: speaking.length });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-background/80 px-6 backdrop-blur sm:px-8 md:px-12 lg:px-16">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
        <Link
          href={routes.home}
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-signal"
        >
          ./uzair
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={link.testId}
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={routes.resume}
            download={RESUME_DOWNLOAD_NAME}
            data-testid="nav-resume"
            className="text-sm text-signal transition-colors hover:text-foreground"
          >
            Résumé
          </Link>
          <ThemeToggleWithHint />
        </div>
      </nav>
    </header>
  );
}
