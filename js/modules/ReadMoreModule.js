const SLACK = 80;

export default function ReadMoreModule() {
  document.querySelectorAll(".readMoreJS").forEach((button) => {
    const body = document.getElementById(button.getAttribute("aria-controls") || "");
    const wrap = button.closest(".read-more__toggle");
    if (!body || !wrap) return;
    const label = button.querySelector(".button__text") || button;
    const limit = parseFloat(window.getComputedStyle(body).maxHeight) || 0;

    const sync = () => {
      const fits = !limit || body.scrollHeight <= limit + SLACK;
      body.classList.toggle("is-fit", fits);
      wrap.hidden = fits;
    };

    button.addEventListener("click", () => {
      const open = !body.classList.contains("is-expanded");
      body.classList.toggle("is-expanded", open);
      button.setAttribute("aria-expanded", String(open));
      label.textContent = open ? button.dataset.less : button.dataset.more;
      if (!open) body.scrollIntoView({ block: "start" });
    });

    sync();
    new ResizeObserver(sync).observe(body);
    new MutationObserver(sync).observe(body, { childList: true, subtree: true });
  });
}
