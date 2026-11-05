export interface Media {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  variant: "mobile" | "desktop";
  align: "left" | "right";
  images: Media[];
  es: string;
  en: string;
  href?: string;
  tech: Media[];
}

const icon = (file: string, alt: string): Media => ({
  src: `/images/icons/${file}`,
  alt,
});

const photo = (file: string, alt: string): Media => ({
  src: `/images/${file}`,
  alt,
});

const dressup = (file: string): Media => photo(`dressup/${file}`, "dressup");

export const projects: Project[] = [
  {
    slug: "dressup",
    title: "Dressup App",
    variant: "mobile",
    align: "left",
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
    ].map(dressup),
    es: "Herramienta de gestión desarrollada en React Native para el propietario de una tienda de alquiler de trajes masculinos. Ofrece funcionalidades como agenda, sistema de inventario, reservas, push notifications, etc. Impulsada por Expo y Firebase.",
    en: "Management tool developed in React Native for the owner of a men's suit rental store. It offers functionalities such as agenda, inventory system, reservations, push notifications, etc. Powered by Expo and Firebase.",
    tech: [
      icon("physics.png", "React"),
      icon("git.png", "Git"),
      icon("firebase.png", "Firebase"),
      icon("js.png", "JavaScript"),
      icon("ts.png", "TypeScript"),
    ],
  },
  {
    slug: "todo-app",
    title: "WorkDone App",
    variant: "mobile",
    align: "right",
    images: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"].map((file) =>
      photo(file, "soon"),
    ),
    es: "Aplicacion desarrollada con React Native, base de datos local. Funcionalidades como agregar tareas, editarlas, modificar su estado y eliminarlas.",
    en: "Application developed with React Native, local database. Features include adding tasks, editing them, changing their status, and deleting them",
    href: "https://github.com/SeveralTool/WorkDone",
    tech: [icon("physics.png", "React"), icon("js.png", "JavaScript"), icon("git.png", "Git")],
  },
  {
    slug: "sisgran",
    title: "SISGRAN",
    variant: "desktop",
    align: "left",
    images: Array.from({ length: 10 }, (_, index) =>
      photo(`sisgran${index + 1}.png`, "sisgran"),
    ),
    es: "Aplicación web para el control y administración de un sistema de huertas ecológicas. Cuenta con acceso y regístro funcional con control de acceso por administración, sistema de cosecha y cultivos, control de tiempos automáticos, sistema de notificaciones, sistema de compras con control de stock, métodos de pago a través de PayPal(API), salída de facturación y más.",
    en: "It is a web application for the control and administration of a system of organic gardens. It has login and functional registration with access control by administration, harvest system and crops, with control of automatic times, notification system, purchasing system with stock control, payment methods through PayPal(API), billing output and more.",
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
    slug: "passgenerator",
    title: "PASSWORD GENERATOR",
    variant: "desktop",
    align: "left",
    images: ["pass1.png", "pass2.png", "pass3.png", "pass4.png"].map((file) =>
      photo(file, "pass generator severaltool"),
    ),
    es: "Este es un proyecto corto, pero muy útil que desarrolle en Python. La herramienta combina símbolos, números y letras de manera aleatoria, alcanzando los 32 caracteres por defecto.",
    en: "This is a short, but very useful project I developed it in Python, The tool combines symbols, numbers and letters of randomly reaching 32 characters by default.",
    href: "https://github.com/SeveralTool/Password-Generator-Python",
    tech: [icon("piton.png", "Python")],
  },
  {
    slug: "app-calculator",
    title: "Calculadora Android",
    variant: "mobile",
    align: "left",
    images: ["app1.png", "app2.png", "app3.png", "app4.png", "app5.png", "app6.png"].map(
      (file) => photo(file, "gallery by severaltool"),
    ),
    es: "Calculadora desarrollada en React Native, con funciones básicas y modo oscuro. Les dejo el archivo .apk en GitHub para que puedan probarla",
    en: "Calculator developed in React Native, has dark-mode and the basic functions. I leave your .apk in GitHub so you can test it.",
    href: "https://github.com/SeveralTool/SV-Calculator",
    tech: [icon("git.png", "Git"), icon("physics.png", "React"), icon("js.png", "JavaScript")],
  },
  {
    slug: "portfolio",
    title: "PORTFOLIO",
    variant: "desktop",
    align: "right",
    images: [photo("port1.png", "portfolio severaltool")],
    es: "El Portfolio es para poder concentrar todos mis trabajos y proyectos. En este sitio voy a estar actualizándolos y contando en que estoy enfocado actualmente, para no perder el hilo de mi desarrollo.",
    en: "I developed this page to be able to concentrate all my work and current and future projects. In this site I will be updating them and counting on what I am currently focused so as not to lose the thread of my development.",
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
    slug: "crypto",
    title: "Cryposy",
    variant: "mobile",
    align: "left",
    images: [photo("coming soon.jpg", "dressup")],
    es: "Desarrollo una aplicación móvil en React Native que ofrece un análisis detallado y en tiempo real de estadísticas relacionadas con criptomonedas. La app permite a los usuarios monitorear el rendimiento del mercado, ver tendencias y gestionar su portafolio de manera eficiente.",
    en: "I develop a mobile application in React Native that offers detailed, real-time analysis of cryptocurrency-related statistics. The app allows users to monitor market performance, see trends and manage their portfolio efficiently.",
    tech: [
      icon("physics.png", "React"),
      icon("git.png", "Git"),
      icon("ts.png", "TypeScript"),
      icon("firebase.png", "Firebase"),
    ],
  },
];
