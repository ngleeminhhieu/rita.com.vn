import { pointerMoved } from "../pointer.js";

const FIELDS = ["s", "product_cat", "filter_packaging", "filter_volume"];
const LABEL_OPEN = "Open search";
const LABEL_CLOSE = "Close search";

export default function HeaderSearchModule() {
  const params = new URLSearchParams(window.location.search);

  document.querySelectorAll('form[role="search"]').forEach((form) => {
    FIELDS.forEach((name) => {
      const value = params.get(name)?.trim();
      const field = form.elements[name];
      if (value && field) field.value = value;
    });
  });

  const header = document.querySelector(".siteHeaderJS");
  const form = header?.querySelector(".headerSearchJS");
  const toggles = [...document.querySelectorAll(".searchToggleJS")];
  if (!header || !form || !toggles.length) return;

  const nav = form.closest(".primary-nav");
  const hoverToggle = nav?.querySelector(".searchToggleJS");
  const input = form.querySelector('input[type="search"]');
  let lastToggle = null;
  let byHover = false;

  const isOpen = () => header.classList.contains("is-searching");

  const setOpen = (open, opener = null, focus = true) => {
    byHover = open && !focus;
    if (open === isOpen()) {
      if (open && focus) input?.focus({ preventScroll: true });
      return;
    }
    header.classList.toggle("is-searching", open);
    form.hidden = !open;

    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? LABEL_CLOSE : LABEL_OPEN);
    });

    header.dispatchEvent(new CustomEvent("header:search", { detail: open }));

    if (open) {
      lastToggle = opener;
      if (focus) input?.focus({ preventScroll: true });
      return;
    }

    if (form.contains(document.activeElement) && lastToggle?.checkVisibility?.()) {
      lastToggle.focus({ preventScroll: true });
    }
  };

  const closeIfHovered = () => {
    if (isOpen() && byHover) setOpen(false);
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (isOpen() && !byHover) {
        setOpen(false);
        return;
      }
      setOpen(true, toggle);
    });
  });

  hoverToggle?.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !pointerMoved() || isOpen()) return;
    setOpen(true, hoverToggle, false);
  });

  nav?.addEventListener("mouseleave", closeIfHovered);
  header.addEventListener("header:menu", closeIfHovered);
  window.addEventListener("scroll", closeIfHovered, { passive: true });

  form.addEventListener("focusin", () => {
    byHover = false;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!isOpen() || form.contains(event.target) || event.target.closest(".searchToggleJS")) return;
    setOpen(false);
  });

  header.querySelector(".primary-menu")?.addEventListener("focusin", () => setOpen(false));

  document.querySelectorAll(".menuOpenJS").forEach((opener) => {
    opener.addEventListener("click", () => setOpen(false));
  });
}
