const MOBILE = "(max-width: 680px)";
const AUTOPLAY = { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true };

export default function CardSliderModule() {
  if (typeof window.Swiper !== "function") return;

  document.querySelectorAll(".cardSliderJS").forEach((root) => {
    const track = root.querySelector(".cardSliderTrackJS");
    if (!track || track.children.length < 2) return;
    const query = window.matchMedia(root.dataset.sliderMedia || MOBILE);
    const grouped = root.dataset.slider === "group";
    const size = Number(root.dataset.group) || 2;
    const items = [...track.children];
    let swiper = null;

    const regroupDuplicates = () => {
      root.querySelectorAll(".swiper-slide-duplicate").forEach((slide, index) => {
        slide.querySelectorAll("[data-fancybox]").forEach((link) => {
          link.dataset.fancybox = `${link.dataset.fancybox.split("~")[0]}~${index}`;
          link.tabIndex = -1;
        });
      });
    };

    const options = () => {
      const shared = { speed: 500, loop: true, autoplay: AUTOPLAY, a11y: { enabled: true } };
      if (grouped) return { ...shared, slidesPerView: 1, spaceBetween: 16 };
      return { ...shared, slidesPerView: "auto", centeredSlides: true, loopedSlides: 3, spaceBetween: 12, on: { init: regroupDuplicates } };
    };

    const slides = () => {
      if (!grouped) return items;
      const groups = [];
      for (let index = 0; index < items.length; index += size) {
        const group = document.createElement("li");
        group.className = "card-slider__group";
        const list = document.createElement("ul");
        list.className = "card-slider__group-list";
        list.setAttribute("role", "list");
        list.append(...items.slice(index, index + size));
        group.append(list);
        groups.push(group);
      }
      track.replaceChildren(...groups);
      return groups;
    };

    const enable = () => {
      items.forEach((item) => {
        item.hidden = false;
      });
      root.classList.add("swiper");
      track.classList.add("swiper-wrapper");
      slides().forEach((slide) => slide.classList.add("swiper-slide"));
      swiper = new window.Swiper(root, options());
      regroupDuplicates();
    };

    const disable = () => {
      swiper.destroy(true, true);
      swiper = null;
      root.classList.remove("swiper");
      track.classList.remove("swiper-wrapper");
      if (grouped) track.replaceChildren(...items);
      items.forEach((item) => item.classList.remove("swiper-slide"));
    };

    const sync = () => {
      if (query.matches && !swiper) enable();
      if (!query.matches && swiper) disable();
    };

    query.addEventListener("change", sync);
    sync();
  });
}
