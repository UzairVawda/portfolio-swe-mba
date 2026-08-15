// The page's section order, and the source of the NN · Label eyebrows.
//
// The numbers used to be nine hand-written literals asserted in two test
// files, which meant every reordering was a multi-file change that had
// already broken once. Deriving them from this array makes adding, removing,
// or merging a section a one-line edit that cannot desynchronise.

export const sectionOrder = [
  "about",
  "experience",
  "work",
  "skills",
  "education",
  "interests",
  "contact",
  "track",
] as const;

export type SectionId = (typeof sectionOrder)[number];

export const sectionLabel: Record<SectionId, string> = {
  about: "About",
  experience: "Experience",
  work: "Work",
  skills: "Skills",
  education: "Education & Certifications",
  interests: "Off-screen",
  contact: "Let's talk",
  track: "What's next",
};

export function eyebrow(id: SectionId): string {
  const index = sectionOrder.indexOf(id);
  if (index === -1) throw new Error(`Section "${id}" is not in sectionOrder`);
  return `${String(index + 1).padStart(2, "0")} · ${sectionLabel[id]}`;
}
