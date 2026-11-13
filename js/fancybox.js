const BASE = new URL("../assets/library/fancybox/", import.meta.url);

const attach = (element) => new Promise((resolve, reject) => {
  element.addEventListener("load", resolve, { once: true });
  element.addEventListener("error", reject, { once: true });
  document.head.append(element);
});

let pending = null;

export default function loadFancybox() {
  if (window.Fancybox) return Promise.resolve(window.Fancybox);
  if (pending) return pending;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = new URL("fancybox.css", BASE).href;
  const script = document.createElement("script");
  script.src = new URL("fancybox.umd.js", BASE).href;

  pending = Promise.all([attach(style), attach(script)])
    .then(() => window.Fancybox)
    .catch((error) => {
      pending = null;
      throw error;
    });
  return pending;
}

export const openWithFancybox = (selector, options) => {
  if (!document.querySelector(selector)) return;
  let bound = false;
  document.addEventListener("click", (event) => {
    const opener = event.target.closest(selector);
    if (!opener || bound) return;
    event.preventDefault();
    event.stopPropagation();
    loadFancybox().then((Fancybox) => {
      if (!bound) Fancybox.bind(selector, options);
      bound = true;
      opener.click();
    }).catch((error) => console.error("Fancybox failed to load", error));
  }, true);
};
