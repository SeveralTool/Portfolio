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
  useHTML?: boolean;
};

interface Cloud {
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  interval?: { value?: number } | null;
}

let cloud: Cloud | null = null;
let started = false;

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
    radius: Math.min(width * 0.46, 190),
    maxSpeed: "fast",
    initSpeed: "normal",
    keep: false,
    direction: 135,
    useHTML: true,
  };

  cloud = TagCloud(
    host,
    SKILLS.map(
      ([src, alt]) => `<img class="img-canvas" src="${src}" alt="${alt}" width="56" height="56">`,
    ),
    options,
  ) as Cloud;

  if (document.hidden) cloud?.pause();
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
    if (document.hidden) cloud.pause();
    else cloud.resume();
  });
}
