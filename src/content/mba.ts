// MBA section copy.

import { legacyRoutes, routes } from "@/lib/routes";

export const landing = {
  number: "01",
  eyebrow: "MBA Portfolio",
  headline:
    "A working portfolio of consulting tools built one per class.",
  subhead:
    "Software engineer, MBA candidate. Each class produces something shippable — published here as it ships, not before.",
};

export const navItems = [
  { href: legacyRoutes.mbaAbout, label: "About" },
  { href: legacyRoutes.mbaTools, label: "Tools" },
  { href: legacyRoutes.mbaJournal, label: "Journal" },
  { href: legacyRoutes.mbaSpeaking, label: "Speaking" },
];

export const tools = {
  number: "02",
  eyebrow: "Tools",
  headline: "One shippable tool per class.",
  subhead:
    "Each MBA class produces a small consulting tool published here. The first ships once the program begins — until then this page is intentionally empty.",
  emptyState: {
    title: "No tools yet.",
    body: "The first one lands at the end of CIS 9000 — IT Strategy. Bookmark this page, or get in touch and I'll send you the launch.",
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
    body: "Writing starts alongside the first class. Until then the contact form below is the best way to reach me — I read every message.",
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
    body: "Each one gets written up here after it happens, never before.",
  },
};

export const about = {
  number: "05",
  eyebrow: "About",
  headline: "Who I am and how to reach me.",
  bio: [
    "I'm Uzair — a software engineer at Collins Aerospace, working mostly on design systems and the AI tooling that builds against them, and an MBA candidate at Baruch's Zicklin School concentrating in AI and product development.",
    "This site is split in two. The main portfolio at uzairvawda.me is the engineering work and the things I'm building on the side. This section is the MBA half: a small consulting tool shipped per class, weekly writing on what's actually landing, and whatever workshops and competitions come out of it.",
    "The thing I'm after is the overlap — building AI-era products and being able to argue for them in business terms, rather than handing that part to someone else. If that's the kind of work you do, say hello below.",
  ],
  overview: [
    {
      route: legacyRoutes.mbaTools,
      label: "Tools",
      description: "Shippable consulting tools — one per class.",
    },
    {
      route: legacyRoutes.mbaJournal,
      label: "Journal",
      description: "Weekly synthesis on what I'm learning.",
    },
    {
      route: legacyRoutes.mbaSpeaking,
      label: "Speaking",
      description: "Talks, workshops, panels — after the fact.",
    },
  ],
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/uzair-vawda/" },
    { label: "GitHub", href: "https://github.com/UzairVawda" },
    { label: "Resume (PDF)", href: routes.resume },
  ],
  contact: {
    headline: "Get in touch.",
    description:
      "Recruiting, collaboration, case competitions, or just a hello — all welcome. I read every message.",
  },
};
