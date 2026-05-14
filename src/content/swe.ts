// Single source of truth for the SWE portfolio content.
// Body copy here is a first draft — redline anything that doesn't sound like you.

export const about = {
  paragraphs: [
    "I'm a software engineer with experience across aerospace, financial services, and legal tech. I'm currently shipping at Collins Aerospace and pursuing my MBA at Baruch's Zicklin School of Business.",
    "The plan: pair an engineering foundation with the business instincts that turn good code into useful products. On the side I build JHParking, train jiu jitsu, and live in NYC.",
  ],
};

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  description: string;
};

export const experience: Role[] = [
  {
    company: "Collins Aerospace",
    title: "Software Developer",
    start: "Nov 2022",
    end: "Present",
    description:
      "Building internal tooling and product features for aerospace systems.",
  },
  {
    company: "Collins Aerospace",
    title: "Infrastructure Project Manager · Leadership Program",
    start: "Mar 2022",
    end: "Oct 2022",
    description:
      "Drove infrastructure rollout projects across multiple business units as part of the leadership rotation.",
  },
  {
    company: "Collins Aerospace",
    title: "Applications Licensing Specialist · Leadership Program",
    start: "Jul 2021",
    end: "Feb 2022",
    description:
      "Managed enterprise application licensing and vendor relationships during the first rotation of the leadership program.",
  },
  {
    company: "JP Morgan Chase & Co.",
    title: "Front End Experience Developer",
    start: "Apr 2020",
    end: "Oct 2020",
    description:
      "Built internal banking experiences with React across the firm's wealth management platform.",
  },
  {
    company: "Dechert LLP",
    title: "IT Applications Developer",
    start: "Apr 2019",
    end: "Oct 2019",
    description:
      "Developed internal legal-tech applications used by attorneys and IT staff across the firm.",
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
