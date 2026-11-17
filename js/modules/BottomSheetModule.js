const SWITCH_MS = 700;

export default function BottomSheetModule() {
  const sheets = [...document.querySelectorAll(".bottomSheetJS")];
  const layers = [...document.querySelectorAll(".bottomSheetJS, .siteMenuJS")];

  const isShown = (layer) => layer.matches(":popover-open") || window.getComputedStyle(layer).display !== "none";

  layers.forEach((layer) => {
    let timer = 0;

    layer.addEventListener("beforetoggle", (event) => {
      if (event.newState !== "open") return;
      const others = layers.filter((other) => other !== layer);
      const switching = others.some(isShown);
      others.forEach((other) => {
        other.classList.add("is-instant");
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => other.classList.remove("is-instant")));
      });
      if (!switching) return;
      layer.classList.add("is-switching");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => layer.classList.remove("is-switching"), SWITCH_MS);
    });
  });

  sheets.forEach((sheet) => {
    const openers = [...document.querySelectorAll(`[popovertarget="${sheet.id}"]`)];

    sheet.addEventListener("click", (event) => {
      if (event.target === sheet) sheet.hidePopover();
    });

    sheet.addEventListener("toggle", (event) => {
      openers.forEach((button) => button.setAttribute("aria-expanded", String(event.newState === "open")));
    });
  });
}
