export default function HeroModule() {
  const hero = document.querySelector(".heroJS");
  const slider = hero?.querySelector(".heroSliderJS");
  if (!slider || typeof window.Swiper !== "function") return;

  const total = slider.querySelectorAll(".swiper-slide").length;
  const fill = hero.querySelector(".heroProgressJS");

  const restartProgress = () => {
    if (!fill || total < 2) return;
    fill.classList.remove("is-running");
    void fill.offsetWidth;
    fill.classList.add("is-running");
  };

  const swiper = new window.Swiper(slider, {
    slidesPerView: 1,
    speed: 900,
    rewind: total > 1,
    effect: "fade",
    fadeEffect: { crossFade: true },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      prevEl: hero.querySelector(".heroPrevJS"),
      nextEl: hero.querySelector(".heroNextJS"),
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous banner",
      nextSlideMessage: "Next banner",
      firstSlideMessage: "This is the first banner",
      lastSlideMessage: "This is the last banner",
    },
    on: {
      slideChange: restartProgress,
    },
  });

  fill?.addEventListener("animationend", () => swiper.slideNext());
  restartProgress();
}
