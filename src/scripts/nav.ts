const levels = [
  { section: "top", icon: "icon-nav-1" },
  { section: "about", icon: "icon-nav-2" },
  { section: "skills", icon: "icon-nav-3" },
  { section: "work", icon: "icon-nav-4" },
];

const lines = ["hr1", "hr2", "hr3"];

function placeMarker(iconId: string) {
  const marker = document.getElementById("rail-marker");
  const icon = document.getElementById(iconId);
  const rail = icon?.closest(".rail");
  if (!marker || !icon || !rail) return;

  const railBox = rail.getBoundingClientRect();
  const iconBox = icon.getBoundingClientRect();
  const y = iconBox.top - railBox.top + iconBox.height / 2 - marker.offsetHeight / 2;
  marker.style.transform = `translateY(${y}px)`;
}

function activate(sectionId: string) {
  const index = levels.findIndex((level) => level.section === sectionId);
  if (index < 0) return;
  const current = levels[index];

  for (const level of levels) {
    const icon = document.getElementById(level.icon);
    const active = level.icon === current.icon;
    icon?.classList.toggle("is-active", active);
    const link = icon?.closest("a");
    if (!link) continue;
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }

  lines.forEach((id, lineIndex) => {
    document.getElementById(id)?.classList.toggle("is-active", lineIndex < index);
  });

  placeMarker(current.icon);
}

export function initNav() {
  const sections = levels
    .map((level) => document.getElementById(level.section))
    .filter((section): section is HTMLElement => section !== null);

  if (sections.length === 0) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    const marker = window.innerHeight * 0.42;
    let active = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) active = section.id;
    }
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (atBottom) active = sections[sections.length - 1].id;
    activate(active);
  };

  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}
