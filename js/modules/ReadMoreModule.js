const SLACK = 80;

const limitOf = (body) => {
  const style = window.getComputedStyle(body);
  return parseFloat(style.getPropertyValue("--read-more-h")) || parseFloat(style.maxHeight) || 0;
};

export default function ReadMoreModule() {
  document.querySelectorAll(".readMoreJS").forEach((button) => {
    const body = document.getElementById(button.getAttribute("aria-controls") || "");
    const wrap = button.closest(".read-more__toggle");
    if (!body || !wrap) return;
    const label = button.querySelector(".button__text") || button;
    const slack = Number(body.dataset.slack ?? SLACK);

    const sync = () => {
      const limit = limitOf(body);
      const fits = !limit || body.scrollHeight <= limit + slack;
      body.classList.toggle("is-fit", fits);
      wrap.hidden = fits;
    };

    button.addEventListener("click", () => {
      const open = !body.classList.contains("is-expanded");
      body.classList.toggle("is-expanded", open);
      button.setAttribute("aria-expanded", String(open));
      label.textContent = open ? button.dataset.less : button.dataset.more;
      if (!open && body.getBoundingClientRect().top < 0) body.scrollIntoView({ block: "start" });
    });

    sync();
    new ResizeObserver(sync).observe(body);
    new MutationObserver(sync).observe(body, { childList: true, subtree: true });
  });
}
