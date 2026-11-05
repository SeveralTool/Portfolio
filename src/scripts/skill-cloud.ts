import TagCloud from "TagCloud";

const SKILLS: Array<[string, string]> = [
  ["/images/icons/css-3.png", "CSS"],
  ["/images/icons/Django-Logo.png", "Django"],
  ["/images/icons/docker.png", "Docker"],
  ["/images/icons/fast.png", "FastAPI"],
  ["/images/icons/git.png", "Git"],
  ["/images/icons/js.png", "JavaScript"],
  ["/images/icons/ts.png", "TypeScript"],
  ["/images/icons/firebase.png", "Firebase"],
  ["/images/icons/htmx.png", "HTMX"],
  ["/images/icons/linux.png", "Linux"],
  ["/images/icons/mysql.png", "MySQL"],
  ["/images/icons/physics.png", "React"],
  ["/images/icons/piton.png", "Python"],
  ["/images/icons/Three.js.png", "Three.js"],
];

type CloudOptions = NonNullable<Parameters<typeof TagCloud>[2]> & {
  direction?: number;
};

interface Cloud {
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  interval?: { value?: number } | null;
}

let cloud: Cloud | null = null;
let started = false;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function stopCloud() {
  if (cloud?.interval?.value) window.cancelAnimationFrame(cloud.interval.value);
  cloud?.destroy();
  cloud = null;
}

function mountCloud() {
  const host = document.getElementById("canvas");
  if (!host) return;
  const width = host.clientWidth;
  if (width < 40) return;

  stopCloud();
  host.replaceChildren();

  const options: CloudOptions = {
    radius: width * 0.5,
    maxSpeed: "normal",
    initSpeed: "slow",
    keep: true,
    direction: 605,
  };

  cloud = TagCloud(
    host,
    SKILLS.map(() => ""),
    options,
  ) as Cloud;

  host.querySelectorAll(".tagcloud--item").forEach((tag, index) => {
    const skill = SKILLS[index];
    if (!skill) return;
    const image = document.createElement("img");
    image.src = skill[0];
    image.alt = skill[1];
    image.className = "img-canvas";
    tag.appendChild(image);
  });

  if (reducedMotion() || document.hidden) cloud?.pause();
}

export function initSkillCloud() {
  if (started) return;
  started = true;

  const paint = () => {
    if ((document.getElementById("canvas")?.clientWidth ?? 0) < 40) {
      window.requestAnimationFrame(paint);
      return;
    }
    mountCloud();
  };
  paint();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(mountCloud, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (!cloud) return;
    if (document.hidden || reducedMotion()) cloud.pause();
    else cloud.resume();
  });

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
    if (!cloud) return;
    if (reducedMotion()) cloud.pause();
    else cloud.resume();
  });
}
