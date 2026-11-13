import { pointerMoved } from "../pointer.js";

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

  window.addEventListener("scroll", () => {
    parents.forEach((item) => {
      if (item.classList.contains("is-open") && !item.contains(document.activeElement)) setOpen(item, false);
    });
  }, { passive: true });

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
