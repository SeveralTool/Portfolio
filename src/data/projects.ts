export interface Media {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  images: Media[];
  href?: string;
  tech: Media[];
}

const icon = (file: string, alt: string): Media => ({
  src: `/images/icons/${file}`,
  alt,
});

const shot = (file: string, alt: string): Media => ({
  src: `/images/${file}`,
  alt,
});

export const projects: Project[] = [
  {
    slug: "dressup",
    title: "Dressup",
    summary:
      "Management tool for a men's suit rental shop. Scheduling, inventory, reservations, and push notifications, built with React Native, Expo, and Firebase.",
    images: [
      "d16.jpg",
      "d8.jpg",
      "d11.jpg",
      "d9.jpg",
      "d4.jpg",
      "d2.jpg",
      "d1.jpg",
      "d10.jpg",
      "d12.jpg",
      "d14.jpg",
      "d7.jpg",
      "d13.jpg",
      "d15.jpg",
      "d6.jpg",
      "d5.jpg",
      "d3.jpg",
    ].map((file) => shot(`dressup/${file}`, "Dressup app screen")),
    tech: [
      icon("physics.png", "React"),
      icon("git.png", "Git"),
      icon("firebase.png", "Firebase"),
      icon("js.png", "JavaScript"),
      icon("ts.png", "TypeScript"),
    ],
  },
  {
    slug: "workdone",
    title: "WorkDone",
    summary:
      "A React Native task app with a local database. Add tasks, edit them, change their status, and delete them.",
    images: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"].map((file) =>
      shot(file, "WorkDone app screen"),
    ),
    href: "https://github.com/SeveralTool/WorkDone",
    tech: [icon("physics.png", "React"), icon("js.png", "JavaScript"), icon("git.png", "Git")],
  },
  {
    slug: "sisgran",
    title: "SISGRAN",
    summary:
      "Web app for running a network of organic gardens. Role-based access, crop and harvest tracking, notifications, stock, PayPal checkout, and invoices.",
    images: Array.from({ length: 10 }, (_, index) =>
      shot(`sisgran${index + 1}.png`, "SISGRAN screen"),
    ),
    href: "https://github.com/SeveralTool/Proyecto-SISGRAN",
    tech: [
      icon("js.png", "JavaScript"),
      icon("css-3.png", "CSS"),
      icon("html-5.png", "HTML"),
      icon("mysql.png", "MySQL"),
      icon("php.png", "PHP"),
      icon("git.png", "Git"),
    ],
  },
  {
    slug: "password-generator",
    title: "Password generator",
    summary:
      "A short Python tool that builds a 32-character password from letters, numbers, and symbols.",
    images: ["pass1.png", "pass2.png", "pass3.png", "pass4.png"].map((file) =>
      shot(file, "Password generator screen"),
    ),
    href: "https://github.com/SeveralTool/Password-Generator-Python",
    tech: [icon("piton.png", "Python")],
  },
  {
    slug: "calculator",
    title: "Android calculator",
    summary:
      "A React Native calculator with the basic operations and a dark mode. The APK is on GitHub.",
    images: ["app1.png", "app2.png", "app3.png", "app4.png", "app5.png", "app6.png"].map((file) =>
      shot(file, "Android calculator screen"),
    ),
    href: "https://github.com/SeveralTool/SV-Calculator",
    tech: [icon("git.png", "Git"), icon("physics.png", "React"), icon("js.png", "JavaScript")],
  },
  {
    slug: "portfolio",
    title: "Portfolio",
    summary:
      "This site. A single place for the work I have shipped and what I am focused on now.",
    images: [shot("port1.png", "Portfolio homepage")],
    href: "https://github.com/SeveralTool/Portfolio",
    tech: [
      icon("js.png", "JavaScript"),
      icon("css-3.png", "CSS"),
      icon("html-5.png", "HTML"),
      icon("physics.png", "React"),
      icon("Three.js.png", "Three.js"),
    ],
  },
  {
    slug: "cryposy",
    title: "Cryposy",
    summary:
      "A React Native app for live cryptocurrency stats, market trends, and portfolio tracking. In progress.",
    images: [shot("cryposy-coming-soon.svg", "Cryposy, coming soon")],
    tech: [
      icon("physics.png", "React"),
      icon("git.png", "Git"),
      icon("ts.png", "TypeScript"),
      icon("firebase.png", "Firebase"),
    ],
  },
];
