const clamp01 = (value) => Math.min(1, Math.max(0, value));

export default function SlideStackModule() {
  document.querySelectorAll(".slideStackJS").forEach((root) => {
    const viewport = root.querySelector(".slide-stack__viewport");
    const count = root.querySelectorAll(".slide-stack__item").length;
    if (!viewport || count < 2) return;

    const images = [...root.querySelectorAll("img[loading='lazy']")];
    if (images.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          images.forEach((img) => {
            img.loading = "eager";
          });
        },
        { rootMargin: "100% 0px" },
      );
      observer.observe(root);
    }

    let frame = 0;
    let last = -1;

    const update = () => {
      frame = 0;
      const travel = root.offsetHeight - viewport.offsetHeight;
      const top = parseFloat(window.getComputedStyle(viewport).top) || 0;
      const progress = travel > 0 ? clamp01((top - root.getBoundingClientRect().top) / travel) : 0;
      const value = progress > 0.999 ? 1 : Math.round(progress * 10000) / 10000;
      if (value === last) return;
      last = value;
      root.style.setProperty("--progress", String(value));
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  });
}
