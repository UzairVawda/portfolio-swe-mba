// Single source of truth for the SWE portfolio content.
// Body copy here is a first draft — redline anything that doesn't sound like you.

export const aboutIntro = {
  eyebrow: "01 · About",
  heading: "I build things, then figure out what they're worth.",
};

export const about = {
  paragraphs: [
    "Most of what I build starts with something I kept running into. JHParking is a peer-to-peer parking marketplace — I took a first run at it years ago as ParkForLess, shelved it, and came back because I still thought the idea was right. MatAI and CoachMe both came out of the jiu jitsu gym. The pattern is roughly: notice the friction, sit with it longer than is reasonable, then build the thing.",
    "By day I'm a software engineer at Collins Aerospace. Most of my time there has gone into a design system that a handful of teams now build on, and — more recently — an AI agent that writes components against it. That second part has changed how I work more than anything else in the last few years.",
    "Evenings are an MBA at Baruch's Zicklin School, concentrating in AI and product development. The point isn't to stop engineering. It's to be the person who can write the business case and then go build the thing it argues for.",
  ],
  cvLine: {
    before: "I'm in NYC. If you want the long version, ",
    label: "my CV has it",
    after: " — otherwise, keep scrolling.",
  },
};

export const experienceIntro =
  "Five-plus years across aerospace, finance, and legal tech.";

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  description: string;
  highlights: string[];
  note?: string;
};

export const experience: Role[] = [
  {
    company: "Collins Aerospace",
    title: "Software Engineer",
    start: "Nov 2022",
    end: "Present",
    description:
      "Design systems, AI tooling, and platform work for aerospace engineering teams.",
    highlights: [
      "Built and shipped an internal React and TypeScript design system — 50+ accessible, themeable components on Figma's Simple Design System, published to the internal npm registry with Storybook, a live component dashboard, and a documented release pipeline. Open to every developer in the org and adopted by 5+ projects.",
      "Built Poolside, an in-house AI agent that learns the design system's patterns and generates components on demand — cutting component creation time by up to 80% and retiring the paid tooling we had been leaning on. Five custom, project-specific components have shipped through it, and it is rolling out to new teams.",
      "Built Skyler, an Angular configuration interface for a radar sensor platform: live telemetry visualizations — array tilt, azimuth compass, pitch and roll attitude indicators, MapLibre GL mapping — plus full scan-mission management across STARE, PPI, RHI, and raster patterns.",
      "Led a platform-wide TypeScript migration and the move to modern CSS with Tailwind, improving maintainability and developer experience.",
      "Owned end-to-end platform work — performance, testing infrastructure, observability, and CI/CD — alongside React and GraphQL application development.",
    ],
  },
  {
    company: "Collins Aerospace",
    title: "Infrastructure Project Manager · Leadership Development Program",
    start: "Mar 2022",
    end: "Oct 2022",
    description:
      "Ran infrastructure delivery across business units during the second rotation.",
    highlights: [
      "Managed a portfolio of 6 infrastructure projects across lifecycle stages, delivering 2 to completion while balancing competing stakeholders.",
      "Introduced Scrum practices that lifted team velocity and cross-functional collaboration.",
      "Standardized company-wide PM artifacts — project charter, RACI matrix — that were adopted well beyond my own team.",
    ],
  },
  {
    company: "Collins Aerospace",
    title: "Applications Licensing Specialist · Leadership Development Program",
    start: "Jul 2021",
    end: "Feb 2022",
    description:
      "Owned enterprise application licensing during the first rotation.",
    highlights: [
      "Drove a software license rationalization that cut license count 18% year over year.",
      "Consolidated 75+ applications across 6 servers, reducing redundancy and improving accessibility.",
      "Built a React and Python license-tracking tool giving stakeholders real-time visibility into server status.",
    ],
  },
  {
    company: "J.P. Morgan Chase & Co.",
    title: "Front-End Experience Developer",
    start: "Apr 2020",
    end: "Oct 2020",
    description:
      "Shared front-end components for the firm's public-facing experiences.",
    note: "Drexel co-op",
    highlights: [
      "Built reusable JavaScript and HTML5 components deployed across multiple sites, establishing shared front-end patterns.",
      "Delivered responsive, maintainable code against stakeholder requirements, using BitBucket and SonarQube for version control and code quality.",
    ],
  },
  {
    company: "Dechert LLP",
    title: "IT Applications Developer",
    start: "Apr 2019",
    end: "Oct 2019",
    description: "Reporting automation and analytics for internal legal teams.",
    note: "Drexel co-op",
    highlights: [
      "Automated reporting and ETL workflows in SQL and Python for internal clients.",
      "Built Tableau dashboards surfacing application usage, performance, and adoption patterns.",
    ],
  },
  {
    company: "MIST",
    title: "Finance Coordinator · Muslim Interscholastic Tournament",
    start: "2017",
    end: "2021",
    description:
      "Budget ownership and live event production across four tournament cycles.",
    highlights: [
      "Owned the tournament budget across four cycles, managing spend against sponsorship revenue and growing the budget 5–20% year over year.",
      "Secured and managed corporate sponsors including PwC — owning outreach, deliverables, and the relationship.",
      "Ran live interscholastic competitions end to end: run-of-show, speaker and judge coordination, venue and vendor management, volunteer staffing, and day-of execution across concurrent tracks.",
    ],
  },
];

export const skillsIntro = {
  eyebrow: "05 · Skills",
  heading: "What I bring to the table.",
};

export const skills: Record<string, string[]> = {
  "Engineering & Platform": [
    "TypeScript",
    "JavaScript",
    "Python",
    "C#",
    "SQL",
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Node",
    "Express",
    "GraphQL",
    "Design systems",
    "PostgreSQL",
    "Firebase",
    "MongoDB",
    "Stripe",
    "CI/CD",
  ],
  "AI & Data": [
    "AI-assisted development",
    "Agentic workflows",
    "LLMs",
    "Vision-language models",
    "Prompt engineering",
    "Evaluation & benchmarking",
    "RAG",
    "Tableau",
    "Data visualization",
  ],
  "Product Management": [
    "Roadmapping",
    "PRD authoring",
    "MVP scoping",
    "User research",
    "Marketplace monetization",
    "Unit economics",
    "Trust & safety",
    "KPIs & A/B testing",
    "Agile / Scrum",
  ],
  "Strategy & Advisory": [
    "Technology & product strategy",
    "Business case development",
    "Cost optimization",
    "Market & competitive analysis",
    "Go-to-market",
    "Change management",
    "Stakeholder management",
  ],
};

export type Project = {
  name: string;
  role: string;
  period: string;
  status: string;
  description: string;
  stack: string[];
  helpWanted: string;
  links: { label: string; href: string }[];
};

export type ConceptProject = {
  name: string;
  status: string;
  description: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "JHParking",
    role: "Founder · Full-Stack",
    period: "Jun 2025 — Present",
    status: "Piloting · 7 beta users",
    description:
      "A peer-to-peer parking marketplace. People with a driveway or an empty spot list it; drivers book and pay by the hour. React and Tailwind on the front, Firestore running the live booking layer, Stripe handling payments. It is deliberately scoped as a focused local solution rather than an everywhere-app, and it is in the hands of seven beta users right now. This is the second run at the idea — the first was ParkForLess, which I shelved and came back to because I still thought it was right.",
    stack: ["React", "TailwindCSS", "Stripe", "Firestore"],
    helpWanted:
      "I would happily talk to anyone who has built a two-sided marketplace — especially about cold-starting the supply side.",
    links: [{ label: "Site", href: "https://jhparking.app" }],
  },
  {
    name: "MatAI",
    role: "Founder · Product & Engineering",
    period: "Jul 2026 — Present",
    status: "In development",
    description:
      "An AI system that watches jiu jitsu footage and hands back a timestamped map of the match: what position you were in and when, where submissions were attempted, and what to work on. The hard part is that conventional tracking falls apart here — in grappling two athletes overlap almost completely and trackers permanently swap their identities. So instead of tracking two bodies, it classifies the position they are in together. Closed guard describes a relationship, not a person. Roles bind to athletes through appearance descriptors captured once, up front, and scramble and unclear are first-class labels so the model can decline to guess rather than confabulate.",
    stack: ["Python", "FastAPI", "ffmpeg", "Claude API", "SQLite"],
    helpWanted:
      "I would love to hear from anyone working on video understanding or evaluation design — and from anyone willing to let me test against their footage.",
    links: [],
  },
  {
    name: "CoachMe",
    role: "Founder · Product & Technical Design",
    period: "In development",
    status: "Design stage · 5 coaches committed",
    description:
      "A marketplace where competitive jiu jitsu athletes buy video review from vetted high-level coaches, with feedback anchored to the footage itself — notes pinned to exact timestamps, voiceover recorded against the timeline, drawings on paused frames. The money layer runs on Stripe Connect using separate charges and transfers rather than destination charges, specifically so funds can sit in escrow between purchase and acceptance; destination charges settle immediately and leave nothing to hold, which would make the delivery guarantee unenforceable. Five coaches are committed. No athletes yet — that is the next problem.",
    stack: ["Next.js", "Expo", "Postgres", "Stripe Connect", "Mux", "Inngest"],
    helpWanted:
      "Looking for athletes to test with, and for anyone who has run trust-and-safety or dispute flows on a marketplace.",
    links: [],
  },
];

export const conceptProjects: ConceptProject[] = [
  {
    name: "PageKeeper",
    status: "Concept · full PRD",
    description:
      "A reading-habit app — streaks, goals, gentle friend accountability, a reading journal. Specced end to end, including the security and compliance architecture and an intentionally un-manipulative monetization model.",
    stack: ["React Native", "Firebase"],
  },
  {
    name: "MBA-Engineered",
    status: "Ongoing",
    description:
      "One small consulting tool per MBA class — an IT maturity assessment, a market-sizing dashboard, a Porter's Five Forces analyzer, an Ask My MBA retrieval app. The premise is that advising on a deliverable and building it should not be different people.",
    stack: ["Next.js", "RAG"],
  },
  {
    name: "Connect.",
    status: "Concept · prototype",
    description:
      "An all-in-one platform pairing companies with influencers to optimize reach. Early product and business framing, built as a Vue prototype.",
    stack: ["Vue"],
  },
];

export type EducationEntry = {
  school: string;
  program: string;
  detail: string;
};

export const educationIntro = {
  eyebrow: "06 · Education & Certifications",
  heading: "Formal training, in progress.",
};

export const education: EducationEntry[] = [
  {
    school: "Baruch College · Zicklin School of Business",
    program: "Master of Business Administration",
    detail:
      "Concentrating in Artificial Intelligence & Product Development · expected June 2028",
  },
  {
    school: "Drexel University · College of Computing and Informatics",
    program: "B.S. Software Engineering",
    detail: "3.5 GPA · co-op program · 2021",
  },
];

export const certifications = [
  {
    name: "Project Management Professional (PMP)",
    issuer: "Project Management Institute",
    year: "Expected Dec 2026",
  },
  { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2022" },
  { name: "Certified Scrum Master", issuer: "Scrum Alliance", year: "2022" },
  {
    name: "100 Days of Front-End Development",
    issuer: "Udemy",
    year: "2022",
  },
];

export type ArchiveGroup = {
  group: string;
  items: { name: string; description: string; stack: string }[];
};

export const archive: ArchiveGroup[] = [
  {
    group: "Marketplaces & Products",
    items: [
      {
        name: "ParkForLess",
        description:
          "The first run at peer-to-peer parking, and the direct precursor to JHParking.",
        stack: "React · Firebase · Leaflet",
      },
      {
        name: "718SNKRS",
        description:
          "A sneaker storefront with real auth, sessions, and checkout.",
        stack: "Express · MongoDB · Stripe",
      },
      {
        name: "Reddit Clone",
        description:
          "A full Reddit-style app — posts, votes, communities, the whole thing.",
        stack: "Next.js · TypeScript · Chakra UI · Firebase · Recoil",
      },
    ],
  },
  {
    group: "Web & Full-Stack",
    items: [
      {
        name: "DragonFeed",
        description: "A campus events and news aggregator for Drexel.",
        stack: "Academic project",
      },
      {
        name: "Curriculum App",
        description: "A course and curriculum planning tool, built for INFO 420.",
        stack: "Vue · Node",
      },
      {
        name: "Project Tracker",
        description: "Project tracking with live updates and a clean board view.",
        stack: "Vue · Firebase · Vuetify",
      },
      {
        name: "ExpressBlog",
        description: "A blogging platform with authentication and drafts.",
        stack: "Express · MongoDB · EJS",
      },
      {
        name: "ChatApp",
        description: "Real-time chat over sockets.",
        stack: "MERN",
      },
      {
        name: "Dynamic Site / Hosting",
        description: "A server-rendered dynamic site, deployed and self-hosted.",
        stack: "Express · EJS · MongoDB",
      },
      {
        name: "Web Portfolio",
        description: "Earlier versions of this site.",
        stack: "uzairvawda.me",
      },
    ],
  },
  {
    group: "Automation & Data",
    items: [
      {
        name: "Send a Script",
        description:
          "Python automation that delivers movie scripts over iMessage, Messenger, and WhatsApp.",
        stack: "Python",
      },
      {
        name: "Investment Tracker",
        description:
          "Trade history, monthly rollups, and metrics over my own investing data.",
        stack: "Python · Visualization",
      },
    ],
  },
];

export const interestsIntro = {
  eyebrow: "07 · Off-screen",
  heading: "What I'm doing when I'm not at the keyboard.",
};

export type Interest = {
  label: string;
  blurb: string;
  icon: "swords" | "camera" | "coffee" | "plane" | "languages";
};

export const interests: Interest[] = [
  {
    label: "Jiu jitsu",
    blurb:
      "The mats keep me honest about losing and learning. Two of my three side projects came out of this room, which tells you roughly how much of my head it occupies.",
    icon: "swords",
  },
  {
    label: "Photography",
    blurb:
      "Cameras taught me composition long before code did — what to leave out, mostly.",
    icon: "camera",
  },
  {
    label: "Coffee",
    blurb: "Pour-overs at home, espresso when I'm out, opinions either way.",
    icon: "coffee",
  },
  {
    label: "Traveling",
    blurb:
      "Notes from new cities have a habit of turning into side projects a few months later.",
    icon: "plane",
  },
  {
    label: "Languages",
    blurb:
      "English, Urdu, and Gujarati at home; Spanish well enough to get into trouble and most of the way out.",
    icon: "languages",
  },
];

export const contact = {
  eyebrow: "08 · Let's talk",
  headline: "Any of this sound interesting?",
  paragraphs: [
    "Every project up there is open. If you want to write code on one, poke holes in the idea, test an early build, or just talk it through over coffee — I'd genuinely like to hear from you.",
    "Recruiting, collaboration, or a plain hello all land in the same inbox, and I read every message.",
  ],
};

export const mbaTeaser = {
  eyebrow: "09 · What's next",
  heading: "Building a portfolio of consulting tools, one per MBA class.",
  body: "The MBA section is a separate, evolving project — shippable tools tied to each class, written up as case studies.",
  cta: "Visit MBA section",
};

// Page-level <meta description> for the SWE page. Kept in content so the
// dollar-figure and tenure guard tests in swe.test.ts can scan it — the
// string previously lived inline in page.tsx, outside their reach.
export const metaDescription =
  "Software engineer and MBA candidate in NYC. Design systems and AI tooling at Collins Aerospace; a parking marketplace and two jiu jitsu products on the side. Five-plus years across aerospace, finance, and legal tech.";
