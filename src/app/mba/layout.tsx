import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function MbaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-section="mba"
      className="flex min-h-full flex-1 flex-col bg-background text-foreground"
    >
      <SiteNav variant="mba" />
      <main className="flex-1">{children}</main>
      <SiteFooter variant="mba" />
    </div>
  );
}
