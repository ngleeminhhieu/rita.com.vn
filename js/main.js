import HeaderModule from "./modules/HeaderModule.js";
import HeaderSearchModule from "./modules/HeaderSearchModule.js";
import SiteMenuModule from "./modules/SiteMenuModule.js";
import MobileMenuModule from "./modules/MobileMenuModule.js";
import LetterSwapModule from "./modules/LetterSwapModule.js";

const SHARED = [
  HeaderModule,
  HeaderSearchModule,
  SiteMenuModule,
  MobileMenuModule,
  LetterSwapModule,
];

const ON_DEMAND = [
  [".heroJS", () => import("./modules/HeroModule.js")],
  ["[data-fancybox]", () => import("./modules/LightboxModule.js")],
];

const start = (module) => {
  try {
    module();
  } catch (error) {
    console.error(`${module.name || "module"} failed to start`, error);
  }
};

const init = () => {
  SHARED.forEach(start);
  ON_DEMAND.forEach(([selector, load]) => {
    if (!document.querySelector(selector)) return;
    load()
      .then(({ default: module }) => start(module))
      .catch((error) => console.error(`module for ${selector} failed to load`, error));
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
