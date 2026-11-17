import { pointerMoved } from "../pointer.js";

const NAV_DELTA = 8;

export default function HeaderModule() {
  const header = document.querySelector(".siteHeaderJS");
  if (!header) return;

  const parents = [...header.querySelectorAll(".primary-menu > .menu-item-has-children")];
  const searchForm = header.querySelector(".headerSearchJS");
  const touch = window.matchMedia("(hover: none)");

  const linkOf = (item) => item.querySelector(":scope > a");

  const sync = (item) => {
    linkOf(item)?.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
  };

  const setOpen = (item, open) => {
    item.classList.toggle("is-open", open);
    sync(item);
  };

  const closeAll = (except = null) => {
    parents.forEach((item) => {
      if (item !== except) setOpen(item, false);
    });
  };

  const desktop = window.matchMedia("(min-width: 1121px)");
  let lastY = window.scrollY;
  let frame = 0;

  const updateNav = () => {
    frame = 0;
    const y = window.scrollY;
    if (!desktop.matches || y <= header.offsetHeight) {
      header.classList.remove("is-nav-hidden");
      lastY = y;
      return;
    }
    if (Math.abs(y - lastY) < NAV_DELTA) return;
    header.classList.toggle("is-nav-hidden", y > lastY);
    lastY = y;
  };

  window.addEventListener("scroll", () => {
    parents.forEach((item) => {
      if (item.classList.contains("is-open") && !item.contains(document.activeElement)) setOpen(item, false);
    });
    if (!frame) frame = window.requestAnimationFrame(updateNav);
  }, { passive: true });
  desktop.addEventListener("change", updateNav);
  updateNav();

  header.addEventListener("header:search", (event) => {
    if (event.detail) closeAll();
  });

  parents.forEach((item) => {
    const link = linkOf(item);
    link?.setAttribute("aria-haspopup", "true");
    link?.setAttribute("aria-expanded", "false");

    item.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !pointerMoved() || item.classList.contains("is-open")) return;
      if (searchForm?.contains(document.activeElement)) return;
      header.dispatchEvent(new CustomEvent("header:menu"));
      closeAll(item);
      setOpen(item, true);
    });

    item.addEventListener("mouseleave", () => setOpen(item, false));

    link?.addEventListener("click", (event) => {
      if (!touch.matches || item.classList.contains("is-open")) return;
      event.preventDefault();
      closeAll(item);
      setOpen(item, true);
    });

    item.addEventListener("focusin", () => {
      closeAll(item);
      setOpen(item, true);
    });

    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget)) setOpen(item, false);
    });

    item.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !item.classList.contains("is-open")) return;
      setOpen(item, false);
      link?.focus();
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".primary-menu > .menu-item-has-children")) return;
    closeAll();
  });
}
