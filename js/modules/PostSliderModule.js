const MODES = [
  { query: "(max-width: 680px)", options: { slidesPerView: "auto", centeredSlides: true, spaceBetween: 8 } },
  { query: "(min-width: 681px) and (max-width: 1120px)", options: { slidesPerView: 2, spaceBetween: 16 } },
  { query: "(min-width: 1121px)", options: { slidesPerView: 4, spaceBetween: 24 } },
];

export default function PostSliderModule() {
  if (typeof window.Swiper !== "function") return;

  document.querySelectorAll(".postSliderJS").forEach((root) => {
    const viewport = root.querySelector(".swiper");
    const count = viewport ? viewport.querySelectorAll(".swiper-slide").length : 0;
    if (count < 2) return;
    let swiper = null;

    const measure = () => {
      const media = viewport.querySelector(".post-card__media");
      if (media) root.style.setProperty("--media-h", `${media.offsetHeight}px`);
    };

    const build = () => {
      const mode = MODES.find((entry) => window.matchMedia(entry.query).matches) || MODES[MODES.length - 1];
      swiper?.destroy(true, true);
      swiper = new window.Swiper(viewport, {
        ...mode.options,
        loop: true,
        loopedSlides: count,
        autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        speed: 600,
        grabCursor: true,
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: {
          prevEl: root.querySelector(".postSliderPrevJS"),
          nextEl: root.querySelector(".postSliderNextJS"),
        },
        a11y: { enabled: true, prevSlideMessage: "Previous post", nextSlideMessage: "Next post" },
        on: { resize: measure },
      });
      measure();
    };

    MODES.forEach((entry) => {
      window.matchMedia(entry.query).addEventListener("change", (event) => {
        if (event.matches) build();
      });
    });
    build();
  });
}
