"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { NavLink } from "@/components/site-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The links arrive as a prop rather than being computed here, so the desktop
// list and this one are the same array. A mobile nav that derives its own
// links is a mobile nav that drifts.
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        data-testid="mobile-nav-trigger"
        aria-label="Open menu"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-3/4 max-w-xs">
        <SheetHeader>
          <SheetTitle className="font-mono text-sm">./uzair</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4 pb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`mobile-${link.testId}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base text-foreground transition-colors hover:text-signal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
