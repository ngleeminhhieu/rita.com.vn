const DELTA = 8;
const END_GAP = 16;

export default function StickyFilterModule() {
  document.querySelectorAll(".stickyFilterJS").forEach((bar) => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    bar.before(sentinel);
    const grid = bar.parentElement.querySelector(":scope > .card-grid");

    let top = 0;
    let above = false;
    let stuck = false;
    let scrollingUp = false;
    let lastY = window.scrollY;
    let frame = 0;
    let observer = null;

    const nearEnd = () => {
      const last = grid && [...grid.children].reverse().find((item) => !item.hidden);
      if (!last) return false;
      return last.getBoundingClientRect().top < top + bar.offsetHeight + END_GAP;
    };

    const sync = () => {
      const box = bar.parentElement.getBoundingClientRect();
      stuck = above && box.bottom - bar.offsetHeight > top;
      bar.classList.toggle("is-stuck", stuck);
      const tucked = stuck && !bar.classList.contains("is-open") && (scrollingUp || nearEnd());
      bar.classList.toggle("is-tucked", tucked);
      if (tucked && bar.contains(document.activeElement)) document.activeElement.blur();
    };

    const watch = () => {
      observer?.disconnect();
      observer = null;
      above = false;
      const style = window.getComputedStyle(bar);
      if (style.position !== "sticky") {
        sync();
        return;
      }
      top = parseFloat(style.top) || 0;
      observer = new IntersectionObserver(([entry]) => {
        above = !entry.isIntersecting && entry.boundingClientRect.top < top;
        sync();
      }, { rootMargin: `${-Math.ceil(top)}px 0px 0px 0px` });
      observer.observe(sentinel);
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (Math.abs(y - lastY) >= DELTA) {
        scrollingUp = y < lastY;
        lastY = y;
      }
      sync();
    };

    window.addEventListener("scroll", () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    }, { passive: true });
    window.matchMedia("(min-width: 1121px)").addEventListener("change", watch);
    watch();
  });
}
