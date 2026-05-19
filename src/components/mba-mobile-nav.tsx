"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/content/mba";

const triggerStyles =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted hover:text-primary sm:hidden";

const navLinkStyles =
  "rounded-md px-3 py-3 font-serif text-2xl text-foreground transition-colors hover:bg-muted hover:text-primary";

const footerLinkStyles =
  "mt-auto rounded-md px-3 py-3 font-mono text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function MbaMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={triggerStyles} aria-label="Open MBA menu">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-72 flex-col gap-8 bg-background"
      >
        <SheetHeader>
          <SheetTitle className="font-mono text-sm font-normal tracking-tight">
            ./uzair/mba
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SheetClose
              key={item.href}
              render={<Link href={item.href} />}
              className={navLinkStyles}
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>
        <SheetClose
          render={<Link href="/" />}
          className={footerLinkStyles}
        >
          ← SWE portfolio
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
