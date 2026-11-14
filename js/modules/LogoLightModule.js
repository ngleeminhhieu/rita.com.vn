export default function LogoLightModule() {
  const header = document.querySelector(".siteHeaderJS");
  const logo = header?.querySelector(".site-logo");
  const zones = [...document.querySelectorAll(".logoLightJS")];
  if (!logo || !zones.length) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    const box = logo.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const light = zones.some((zone) => {
      const rect = zone.getBoundingClientRect();
      return rect.top <= y && rect.bottom > y && rect.left <= x && rect.right > x;
    });
    header.classList.toggle("is-logo-light", light);
  };

  const request = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("load", request);
  request();
}
