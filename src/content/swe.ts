// Single source of truth for the SWE portfolio content.
// Body copy here is a first draft — redline anything that doesn't sound like you.

export const about = {
  paragraphs: [
    "I'm a software engineer with experience across aerospace, financial services, and legal tech. I'm currently shipping at Collins Aerospace and pursuing my MBA at Baruch's Zicklin School of Business.",
    "The plan: pair an engineering foundation with the business instincts that turn good code into useful products. On the side I build JHParking, train jiu jitsu, and live in NYC.",
  ],
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

export const skills = {
  Languages: ["TypeScript", "JavaScript", "Python", "C#", "HTML", "CSS", "LESS", "SASS"],
  Frameworks: [
    "React",
    "Vue",
    "Node",
    "Express",
    "Vuetify",
    "Vuex",
    "Pinia",
    "jQuery",
    "Django",
    "Bootstrap",
  ],
  Tools: ["Visual Studio", "SSMS", "SQL Workbench", "Tableau", "npm", "yarn"],
  Databases: ["Firebase", "MySQL", "MongoDB", "MariaDB", "SQLite"],
};

export type Project = {
  name: string;
  role: string;
  period: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: "JHParking",
    role: "Full Stack Developer",
    period: "Jun 2025 — Present",
    description:
      "A peer-to-peer marketplace for renting parking spots. Owners list driveway and garage availability; drivers book and pay through the app. The live booking layer runs on Firestore, payments on Stripe.",
    stack: ["React", "TailwindCSS", "Stripe", "Firestore"],
    links: [
      { label: "Site", href: "https://jhparking.app" },
    ],
  },
];

export type EducationEntry = {
  school: string;
  program: string;
  detail: string;
};

export const education: EducationEntry[] = [
  {
    school: "Baruch College · Zicklin School of Business",
    program: "Master of Business Administration",
    detail: "In progress",
  },
  {
    school: "Drexel University · College of Computing and Informatics",
    program: "B.S. Software Engineering",
    detail: "Graduated",
  },
];

export const certifications = [
  { name: "Certified Scrum Master", issuer: "Scrum Alliance", year: "2022" },
  {
    name: "Certified Scrum Product Owner",
    issuer: "Scrum Alliance",
    year: "2022",
  },
  {
    name: "100 Days of Front-End Development",
    issuer: "Udemy",
    year: "2022",
  },
];

export type Interest = {
  label: string;
  blurb: string;
  icon: "swords" | "camera" | "coffee" | "plane";
};

export const interests: Interest[] = [
  {
    label: "Jiu jitsu",
    blurb: "Training on the mats keeps me honest about losing and learning.",
    icon: "swords",
  },
  {
    label: "Photography",
    blurb: "Cameras taught me composition long before code did.",
    icon: "camera",
  },
  {
    label: "Coffee",
    blurb: "Pour-overs at home, espresso when I'm out.",
    icon: "coffee",
  },
  {
    label: "Traveling",
    blurb: "Notes from new cities tend to end up shaping side projects.",
    icon: "plane",
  },
];
