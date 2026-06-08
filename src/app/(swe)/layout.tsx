import { ParticleFieldMount } from "@/components/scene/particle-field-mount";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function SweLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <ParticleFieldMount />
      <SiteNav variant="swe" />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter variant="swe" />
    </div>
  );
}
