// Every internal URL on the site, in one place. Nothing else may hardcode a
// path — renaming a route should be a one-file change, and the stage-5 move
// off /mba depends on that being true.

export const routes = {
  home: "/",
  about: "/#about",
  work: "/#work",
  contact: "/#contact",
  tools: "/tools",
  speaking: "/speaking",
  resume: "/resume.pdf",
} as const;

// The pre-redesign MBA tree. Still linked while those pages exist; deleted in
// the same commit that adds the 308 redirects.
export const legacyRoutes = {
  mbaHome: "/mba",
  mbaAbout: "/mba/about",
  mbaTools: "/mba/tools",
  mbaJournal: "/mba/journal",
  mbaSpeaking: "/mba/speaking",
} as const;

export const RESUME_DOWNLOAD_NAME = "Uzair-Vawda-CV.pdf";

export function toolItem(slug: string): string {
  return `${routes.tools}/${slug}`;
}

export function speakingItem(slug: string): string {
  return `${routes.speaking}/${slug}`;
}
