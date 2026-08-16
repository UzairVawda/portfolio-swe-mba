import { SiteShell } from "@/components/site-shell";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
