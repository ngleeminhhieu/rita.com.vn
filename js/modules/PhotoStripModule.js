const ALIGN = [0, 0.4];
const SLIDE = [0.25, 0.85];

const clamp = (value) => Math.min(1, Math.max(0, value));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const phase = (progress, [from, to], ease) => ease(clamp((progress - from) / (to - from)));

export default function PhotoStripModule() {
  document.querySelectorAll(".photoStripJS").forEach((strip) => {
    let active = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = strip.getBoundingClientRect();
      const view = window.innerHeight;
      const progress = clamp((view - rect.top) / (view + rect.height));
      strip.style.setProperty("--stagger", (1 - phase(progress, ALIGN, easeOut)).toFixed(4));
      strip.style.setProperty("--slide", phase(progress, SLIDE, easeInOut).toFixed(4));
    };

    const request = () => {
      if (active && !frame) frame = window.requestAnimationFrame(update);
    };

    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      request();
    }, { rootMargin: "200px 0px" }).observe(strip);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  });
}
