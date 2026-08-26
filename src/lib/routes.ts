// Every internal URL on the site, in one place. Nothing else may hardcode a
// path — renaming a route should be a one-file change. The redirect table
// below is the receipt: the move off /mba was one edit here plus one in
// next.config.ts.

export const routes = {
  home: "/",
  about: "/#about",
  work: "/#work",
  contact: "/#contact",
  tools: "/tools",
  speaking: "/speaking",
  resume: "/resume.pdf",
} as const;

// The pre-redesign /mba tree. Config redirects run before the filesystem, so
// no page renders at all. `permanent: true` issues a 308, which preserves the
// request method and passes link equity to the new URL.
export const legacyRedirects = [
  { source: "/mba", destination: routes.home, permanent: true },
  { source: "/mba/about", destination: routes.about, permanent: true },
  { source: "/mba/tools", destination: routes.tools, permanent: true },
  { source: "/mba/speaking", destination: routes.speaking, permanent: true },
  { source: "/mba/journal", destination: routes.home, permanent: true },
] as const satisfies ReadonlyArray<{
  source: string;
  destination: string;
  permanent: true;
}>;

export const RESUME_DOWNLOAD_NAME = "Uzair-Vawda-CV.pdf";

export function toolItem(slug: string): string {
  return `${routes.tools}/${slug}`;
}

export function speakingItem(slug: string): string {
  return `${routes.speaking}/${slug}`;
}

// Same-page anchors need the bare fragment, not the full "/#work". A Next
// <Link> pointing at "/#work" while the URL is ALREADY "/#work" is treated as
// a route navigation and scrolls to the top of the page instead of the anchor
// — so on-page CTAs use a plain <a> with this. Derived from the manifest so a
// renamed route still can't drift.
export function fragment(route: string): string {
  const hash = route.indexOf("#");
  return hash === -1 ? route : route.slice(hash);
}
