import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

// The one chrome every non-legacy route wears: nav, main, footer. It lives in
// a component rather than in the root layout because /mba still ships its own
// mba-variant chrome until that tree is deleted, and a root-level nav would
// render twice there.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNav variant="swe" />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter variant="swe" />
    </div>
  );
}
