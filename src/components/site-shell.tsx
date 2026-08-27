import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

// The one chrome the whole site wears: nav, main, footer. Now that the nav is
// flat there is no second variant of it, so this mounts once in the root
// layout and every route — the home page, the galleries, the item permalinks,
// the 404 — inherits the same header and footer. Nothing below the root may
// render it again; two of these is two navs.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNav />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
