const STAGGER_MS = 80;

export default function LoadMoreModule() {
  document.querySelectorAll(".loadMoreJS").forEach((wrap) => {
    const list = wrap.querySelector(".loadMoreListJS");
    const button = wrap.querySelector(".loadMoreButtonJS");
    if (!list || !button) return;

    const items = [...list.children];
    const rows = Number(wrap.dataset.rows) || 2;
    const more = button.closest(".section-more") || button;
    let expanded = false;

    const columns = () => window.getComputedStyle(list).gridTemplateColumns.split(" ").filter(Boolean).length || 1;

    const render = () => {
      const limit = expanded ? items.length : columns() * rows;
      items.forEach((item, index) => {
        item.hidden = index >= limit;
      });
      more.hidden = limit >= items.length;
    };

    button.addEventListener("click", () => {
      const revealed = items.filter((item) => item.hidden);
      revealed.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${index * STAGGER_MS}ms`);
        item.classList.add("is-revealed");
      });
      expanded = true;
      render();
      revealed[0]?.querySelector("a")?.focus({ preventScroll: true });
    });

    let frame = 0;
    window.addEventListener("resize", () => {
      if (expanded || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        render();
      });
    });

    render();
  });
}
