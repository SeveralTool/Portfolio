const levels = [
  { section: "nivel1", icon: "icon-nav-1", rule: "hr1" },
  { section: "intro-box", icon: "icon-nav-2", rule: "hr2" },
  { section: "skills", icon: "icon-nav-3", rule: "hr3" },
  { section: "projects", icon: "icon-nav-4", rule: "hr4" },
  { section: "security", icon: "icon-nav-5", rule: "hr5" },
  { section: "cv", icon: "icon-nav-6", rule: "hr5" },
];

function activate(sectionId: string) {
  const current = levels.find((level) => level.section === sectionId);
  if (!current) return;

  for (const level of levels) {
    const icon = document.getElementById(level.icon);
    const active = level.icon === current.icon;
    icon?.classList.toggle("is-active", active);
    const link = icon?.closest("a");
    if (!link) continue;
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }

  for (const id of ["hr1", "hr2", "hr3", "hr4", "hr5"]) {
    document.getElementById(id)?.classList.toggle("is-active", id === current.rule);
  }
}

export function initNav() {
  const sections = levels
    .map((level) => document.getElementById(level.section))
    .filter((section): section is HTMLElement => section !== null);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) activate(visible.target.id);
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
  );

  for (const section of sections) observer.observe(section);
}
