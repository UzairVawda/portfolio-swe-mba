import Link from "next/link";

export function SiteFooter({ variant }: { variant: "swe" | "mba" }) {
  const isMba = variant === "mba";

  return (
    <footer className="mt-auto w-full border-t border-border/60 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p className="font-mono">© {new Date().getFullYear()} Uzair Vawda</p>
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/UzairVawda"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/uzair-vawda/"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </Link>
          <Link
            href={isMba ? "/" : "/mba"}
            className="transition-colors hover:text-foreground"
          >
            {isMba ? "← SWE" : "MBA →"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
