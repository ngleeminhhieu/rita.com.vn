const DEFAULT_INTERVAL = 4000;

export default function FadeSlidesModule() {
  document.querySelectorAll(".fadeSlidesJS").forEach((root) => {
    const slides = [...root.querySelectorAll(".fade-slides__item")];
    if (slides.length < 2) return;

    const interval = Number(root.dataset.interval) || DEFAULT_INTERVAL;
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    slides[index].classList.add("is-active");

    window.setInterval(() => {
      if (document.hidden) return;
      const next = (index + 1) % slides.length;
      const image = slides[next];
      if (image.tagName === "IMG" && !image.complete) {
        image.loading = "eager";
        return;
      }
      slides[index].classList.remove("is-active");
      image.classList.add("is-active");
      index = next;
    }, interval);
  });
}
