export function initCarousels() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll<HTMLElement>("[data-carousel]:not([data-ready])").forEach((root) => {
    const images = [...root.querySelectorAll("img")];
    if (images.length < 2) return;
    root.dataset.ready = "true";
    let index = 0;

    window.setInterval(() => {
      if (document.hidden) return;
      images[index]?.classList.remove("is-active");
      index = (index + 1) % images.length;
      images[index]?.classList.add("is-active");
    }, 1500);
  });
}
