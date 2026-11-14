export default function FormatViewerModule() {
  document.querySelectorAll(".formatViewerJS").forEach((viewer) => {
    const tabs = [...viewer.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
    const images = [...viewer.querySelectorAll(".format-viewer__image")];
    if (!tabs.length || panels.includes(null)) return;

    let current = 0;

    const show = (index, focus = false) => {
      current = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => {
        const active = i === current;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
        if (images[i]) images[i].hidden = !active;
      });
      if (focus) tabs[current].focus();
    };

    tabs.forEach((tab, i) => tab.addEventListener("click", () => show(i)));

    tabs[0].parentElement.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      show(current + step, true);
    });

    viewer.querySelector(".formatPrevJS")?.addEventListener("click", () => show(current - 1));
    viewer.querySelector(".formatNextJS")?.addEventListener("click", () => show(current + 1));
    show(0);
  });
}
