import HeaderModule from "./modules/HeaderModule.js";
import HeaderSearchModule from "./modules/HeaderSearchModule.js";
import SiteMenuModule from "./modules/SiteMenuModule.js";
import MobileMenuModule from "./modules/MobileMenuModule.js";

const SHARED = [
  HeaderModule,
  HeaderSearchModule,
  SiteMenuModule,
  MobileMenuModule,
];

const ON_DEMAND = [
  [".welcomeScreenJS", () => import("./modules/WelcomeScreenModule.js")],
  [".waveRibbonJS", () => import("./modules/WaveRibbonModule.js")],
  [".productLineupJS", () => import("./modules/ProductLineupModule.js")],
  [".heroJS", () => import("./modules/HeroModule.js")],
  [".loadMoreJS", () => import("./modules/LoadMoreModule.js")],
  [".filterJS", () => import("./modules/FilterModule.js")],
  [".stackRevealJS", () => import("./modules/StackRevealModule.js")],
  [".canSpinJS", () => import("./modules/CanSpinModule.js")],
  [".logoLightJS", () => import("./modules/LogoLightModule.js")],
  [".countUpJS", () => import("./modules/CountUpModule.js")],
  [".cardDeckJS", () => import("./modules/CardDeckModule.js")],
  [".popupJS", () => import("./modules/PopupModule.js")],
  [".formatViewerJS", () => import("./modules/FormatViewerModule.js")],
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
