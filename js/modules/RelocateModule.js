const MOBILE = "(max-width: 680px)";

export default function RelocateModule() {
  document.querySelectorAll(".relocateJS").forEach((element) => {
    const slot = document.querySelector(element.dataset.relocateTo);
    if (!slot) return;
    const query = window.matchMedia(element.dataset.relocateMedia || MOBILE);
    const home = document.createComment("relocate");
    element.before(home);

    const sync = () => {
      if (query.matches) slot.append(element);
      else home.after(element);
    };

    query.addEventListener("change", sync);
    sync();
  });
}
