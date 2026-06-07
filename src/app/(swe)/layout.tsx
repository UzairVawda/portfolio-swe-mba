import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function SweLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNav variant="swe" />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter variant="swe" />
    </div>
  );
}
