const RESTORE_DELAY = 220;

export default function SpotLinkModule() {
  const timers = new WeakMap();

  document.querySelectorAll(".spotLinkJS[data-spot]").forEach((link) => {
    const spot = document.querySelector(`[data-spot-id="${link.dataset.spot}"]`);
    const map = spot?.closest(".world-map");
    if (!spot || !map) return;

    const show = () => {
      window.clearTimeout(timers.get(map));
      map.querySelectorAll(".map-spot.is-active").forEach((el) => {
        if (el !== spot) el.classList.remove("is-active");
      });
      spot.classList.add("is-active");
      map.classList.add("has-spot");
    };

    const hide = () => {
      window.clearTimeout(timers.get(map));
      timers.set(map, window.setTimeout(() => {
        spot.classList.remove("is-active");
        map.classList.remove("has-spot");
      }, RESTORE_DELAY));
    };

    link.addEventListener("mouseenter", show);
    link.addEventListener("mouseleave", hide);
    link.addEventListener("focus", show);
    link.addEventListener("blur", hide);
  });
}
