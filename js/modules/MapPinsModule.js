const SHOW_RATIO = 0.25;

export default function MapPinsModule() {
  const maps = [...document.querySelectorAll(".mapPinsJS")];
  if (!maps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio < SHOW_RATIO) return;
      entry.target.classList.remove("is-pending");
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: [0, SHOW_RATIO] });

  maps.forEach((map) => {
    map.classList.add("is-pending");
    observer.observe(map);
  });
}
