const BADGE_TURN = 0.2;

export default function CardDeckModule() {
  document.querySelectorAll(".cardDeckJS").forEach((section) => {
    const deck = section.querySelector(".card-deck");
    const cards = [...section.querySelectorAll(".card-deck__card")];
    if (!deck || cards.length < 2) return;

    const last = cards.length - 1;
    let active = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const span = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top;
      const progress = span > 0 ? Math.min(1, Math.max(0, -top / span)) * last : 0;
      const fall = Math.max(0, window.innerHeight - deck.getBoundingClientRect().top);
      cards.forEach((card, i) => {
        const drop = Math.min(1, Math.max(0, progress - i));
        card.style.setProperty("--k", Math.max(0, i - progress).toFixed(4));
        card.style.setProperty("--drop", `${(drop * drop * fall).toFixed(1)}px`);
      });
      section.style.setProperty("--spin", `${((window.scrollY * BADGE_TURN) % 360).toFixed(1)}deg`);
    };

    const request = () => {
      if (active && !frame) frame = window.requestAnimationFrame(update);
    };

    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      request();
    }, { rootMargin: "200px 0px" }).observe(section);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  });
}
