export default function FilterModule() {
  document.querySelectorAll(".filterJS").forEach((root) => {
    const toggle = root.querySelector(".filterToggleJS");
    const panel = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
    if (!toggle || !panel) return;

    root.classList.add("is-enhanced");
    const isOpen = () => root.classList.contains("is-open");

    const setOpen = (open, returnFocus = false) => {
      root.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        panel.querySelector('select, input:not([type="hidden"])')?.focus({ preventScroll: true });
        return;
      }
      if (returnFocus) toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    document.addEventListener("click", (event) => {
      if (isOpen() && !root.contains(event.target)) setOpen(false);
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) setOpen(false, true);
    });
  });
}
