const MOBILE = "(max-width: 680px)";

export default function CardSliderModule() {
  if (typeof window.Swiper !== "function") return;
  const query = window.matchMedia(MOBILE);

  document.querySelectorAll(".cardSliderJS").forEach((root) => {
    const track = root.querySelector(".cardSliderTrackJS");
    if (!track || track.children.length < 2) return;
    let swiper = null;

    const regroupDuplicates = () => {
      root.querySelectorAll(".swiper-slide-duplicate").forEach((slide, index) => {
        slide.querySelectorAll("[data-fancybox]").forEach((link) => {
          link.dataset.fancybox = `${link.dataset.fancybox.split("~")[0]}~${index}`;
          link.tabIndex = -1;
        });
      });
    };

    const enable = () => {
      root.classList.add("swiper");
      track.classList.add("swiper-wrapper");
      [...track.children].forEach((slide) => slide.classList.add("swiper-slide"));
      swiper = new window.Swiper(root, {
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        loopedSlides: 3,
        spaceBetween: 12,
        speed: 500,
        a11y: { enabled: true },
        on: { init: regroupDuplicates },
      });
      regroupDuplicates();
    };

    const disable = () => {
      swiper.destroy(true, true);
      swiper = null;
      root.classList.remove("swiper");
      track.classList.remove("swiper-wrapper");
      [...track.children].forEach((slide) => slide.classList.remove("swiper-slide"));
    };

    const sync = () => {
      if (query.matches && !swiper) enable();
      if (!query.matches && swiper) disable();
    };

    query.addEventListener("change", sync);
    sync();
  });
}
