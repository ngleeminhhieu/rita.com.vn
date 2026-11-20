const rowOf = (list, target) => {
  const tops = [...new Set([...list.children].filter((el) => !el.hidden).map((el) => el.offsetTop))].sort((a, b) => a - b);
  return tops.indexOf(target.offsetTop) + 1;
};

const rowCount = (items) => new Set(items.filter((el) => !el.hidden).map((el) => el.offsetTop)).size;

export default function InlineMoreModule() {
  document.querySelectorAll(".inlineMoreJS").forEach((list) => {
    const more = list.querySelector(".inlineMoreItemJS");
    const button = more && more.querySelector("button");
    if (!button) return;
    const items = [...list.children].filter((el) => el !== more);
    let expanded = false;
    let width = 0;

    const sync = () => {
      if (!list.offsetWidth) return;
      const lines = parseInt(window.getComputedStyle(list).getPropertyValue("--more-lines"), 10) || 2;
      items.forEach((el) => { el.hidden = false; });
      more.hidden = true;
      if (rowCount(items) <= lines) return;
      more.hidden = false;
      if (expanded) return;
      for (let i = items.length - 1; i > 0 && rowOf(list, more) > lines; i -= 1) items[i].hidden = true;
    };

    button.addEventListener("click", () => {
      expanded = !expanded;
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? button.dataset.less : button.dataset.more;
      sync();
      button.focus({ preventScroll: true });
    });

    new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next === width) return;
      width = next;
      sync();
    }).observe(list);
    if (document.fonts) document.fonts.ready.then(sync);
  });
}
