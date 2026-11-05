type Lang = "es" | "en";

function isLang(value: string | null): value is Lang {
  return value === "es" || value === "en";
}

export function initLanguage() {
  const root = document.documentElement;
  const spanish = document.getElementById("es");
  const english = document.getElementById("en");
  if (!spanish || !english) return;

  const labels: Record<string, Record<Lang, string>> = {
    "intro-box": { es: "h2-es", en: "h2-en" },
    skills: { es: "h2-skills-es", en: "h2-skills-en" },
    projects: { es: "h2-projects-es", en: "h2-projects-en" },
  };

  const apply = (lang: Lang) => {
    root.dataset.lang = lang;
    root.lang = lang;
    spanish.setAttribute("aria-pressed", String(lang === "es"));
    english.setAttribute("aria-pressed", String(lang === "en"));
    for (const [sectionId, ids] of Object.entries(labels)) {
      document.getElementById(sectionId)?.setAttribute("aria-labelledby", ids[lang]);
    }
  };

  spanish.addEventListener("click", () => {
    localStorage.setItem("idioma", "es");
    apply("es");
  });

  english.addEventListener("click", () => {
    localStorage.setItem("idioma", "en");
    apply("en");
  });

  const stored = localStorage.getItem("idioma");
  apply(isLang(stored) ? stored : "es");
}
