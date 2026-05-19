// MBA section copy. Drafted by Claude — redline anything that doesn't sound like you.

export const landing = {
  number: "01",
  eyebrow: "MBA Portfolio",
  headline:
    "A working portfolio of consulting tools built one per class.",
  subhead:
    "Software engineer, MBA candidate. Each class produces a shippable tool — published here as it ships.",
};

export const navItems = [
  { href: "/mba/tools", label: "Tools" },
  { href: "/mba/journal", label: "Journal" },
  { href: "/mba/speaking", label: "Speaking" },
  { href: "/mba/about", label: "About" },
];

export const tools = {
  number: "02",
  eyebrow: "Tools",
  headline: "One shippable tool per class.",
  subhead:
    "Each MBA class produces a small consulting tool published here. The first ships once the program begins — until then this page is intentionally empty.",
  emptyState: {
    title: "No tools yet.",
    body: "The first one lands at the end of CIS 9000 — IT Strategy. Bookmark this page or get in touch and I'll send you the launch.",
  },
};

export const journal = {
  number: "03",
  eyebrow: "Journal",
  headline: "Synthesis, not summary.",
  subhead:
    "Short weekly posts on what I'm learning and where it changes how I think about consulting and engineering.",
  emptyState: {
    title: "No posts yet.",
    body: "Writing begins alongside the first class. Until then, the contact form on /about is the best way to reach me.",
  },
};

export const speaking = {
  number: "04",
  eyebrow: "Speaking",
  headline: "Talks, workshops, panels.",
  subhead:
    "Documentation of workshops led, case competitions, and panels participated in throughout the MBA.",
  emptyState: {
    title: "No events yet.",
    body: "Each event is documented here after it happens — never beforehand.",
  },
};

export const about = {
  number: "05",
  eyebrow: "About",
  headline: "Who I am and how to reach me.",
  bio: [
    "I'm Uzair — a software engineer with experience across aerospace, finance, and legal tech, pursuing my MBA at Baruch's Zicklin School of Business.",
    "This site is split in two. The main portfolio at uzairvawda.me is the engineering work. This section is the MBA pivot: tools shipped per class, weekly synthesis writing, workshops and case competitions, and the connections that fall out of all of it.",
    "I'm targeting consulting roles where the work is technical and the clients are real. If that overlaps with what you do, message below.",
  ],
  overview: [
    {
      route: "/mba/tools",
      label: "Tools",
      description: "Shippable consulting tools — one per class.",
    },
    {
      route: "/mba/journal",
      label: "Journal",
      description: "Weekly synthesis on what I'm learning.",
    },
    {
      route: "/mba/speaking",
      label: "Speaking",
      description: "Talks, workshops, panels — after the fact.",
    },
  ],
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/uzair-vawda/" },
    { label: "GitHub", href: "https://github.com/UzairVawda" },
    { label: "Resume (PDF)", href: "/resume.pdf" },
  ],
  contact: {
    headline: "Get in touch.",
    description:
      "Recruiting, collaboration, case competitions, or just a hello — all welcome. I read every message.",
  },
};
