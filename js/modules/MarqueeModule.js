const SPEED = 40;

export default function MarqueeModule() {
  document.querySelectorAll(".marqueeJS").forEach((marquee) => {
    const track = marquee.querySelector(".marquee__track");
    const originals = track ? [...track.children] : [];
    if (!originals.length) return;

    let sets = 0;

    const addSet = () => {
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img").forEach((img) => {
          img.alt = "";
        });
        track.append(clone);
      });
      sets += 1;
    };

    const measure = () => {
      const start = originals[0].getBoundingClientRect().left;
      const set = track.children[originals.length].getBoundingClientRect().left - start;
      if (set <= 0) return;
      while (set * sets < marquee.clientWidth) addSet();
      track.style.setProperty("--marquee-shift", `${(-set).toFixed(2)}px`);
      track.style.setProperty("--marquee-dur", `${(set / SPEED).toFixed(2)}s`);
    };

    addSet();
    marquee.classList.add("is-running");
    new ResizeObserver(measure).observe(marquee);
    new IntersectionObserver(([entry]) => {
      marquee.classList.toggle("is-paused", !entry.isIntersecting);
    }).observe(marquee);
  });
}
