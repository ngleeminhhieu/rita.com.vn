export default function SiteMenuModule() {
  const menu = document.querySelector(".siteMenuJS");
  const openers = [...document.querySelectorAll(".menuOpenJS")];
  if (!menu || !openers.length || typeof menu.showPopover !== "function") return;

  const nav = menu.querySelector(".site-menu__nav");

  menu.addEventListener("click", (event) => {
    if (event.target === menu) menu.hidePopover();
  });

  menu.addEventListener("beforetoggle", (event) => {
    if (event.newState === "open") nav?.scrollTo({ top: 0 });
  });

  menu.addEventListener("toggle", (event) => {
    const open = event.newState === "open";
    openers.forEach((opener) => {
      opener.setAttribute("aria-expanded", String(open));
      opener.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  });
}
