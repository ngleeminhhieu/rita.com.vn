const SWIPE = 50;
const DRAG_START = 6;

export default function AwardShowModule() {
  document.querySelectorAll(".awardShowJS").forEach((root) => {
    const items = [...root.querySelectorAll(".award-stage__item")];
    const panels = [...root.querySelectorAll(".award-stage__panel")];
    const prevName = root.querySelector(".awardPrevNameJS");
    const nextName = root.querySelector(".awardNextNameJS");
    const body = root.querySelector(".award-stage__body") || root;
    const total = items.length;
    if (total < 2 || panels.length !== total) return;

    let index = 0;

    const render = () => {
      items.forEach((item, i) => {
        const distance = (i - index + total) % total;
        let state = "is-after";
        if (distance === 0) state = "is-active";
        else if (distance === 1) state = "is-next";
        else if (distance === total - 1) state = "is-prev";
        else if (distance > total / 2) state = "is-before";
        item.classList.remove("is-active", "is-next", "is-prev", "is-before", "is-after");
        item.classList.add(state);
        item.setAttribute("aria-hidden", String(distance !== 0));
      });
      panels.forEach((panel, i) => {
        panel.hidden = i !== index;
      });
      if (prevName) prevName.textContent = panels[(index - 1 + total) % total].dataset.short || "";
      if (nextName) nextName.textContent = panels[(index + 1) % total].dataset.short || "";
    };

    const go = (target) => {
      index = (target + total) % total;
      render();
    };

    root.querySelector(".awardPrevJS")?.addEventListener("click", () => go(index - 1));
    root.querySelector(".awardNextJS")?.addEventListener("click", () => go(index + 1));

    root.addEventListener("keydown", (event) => {
      if (event.target.closest?.("input, textarea, select")) return;
      if (event.key === "ArrowLeft") go(index - 1);
      else if (event.key === "ArrowRight") go(index + 1);
    });

    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dragging = false;

    const setDrag = (value) => root.style.setProperty("--drag", `${value}px`);

    body.addEventListener("dragstart", (event) => event.preventDefault());

    body.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button, a, .award-stage__lead, .award-stage__detail")) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dx = 0;
      dragging = false;
    });

    body.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      dx = event.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_START) return;
        if (event.pointerType !== "mouse" && Math.abs(event.clientY - startY) > Math.abs(dx)) {
          pointerId = null;
          return;
        }
        dragging = true;
        body.setPointerCapture?.(pointerId);
        root.classList.add("is-dragging");
      }
      setDrag(dx);
    });

    const end = (event) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      setDrag(0);
      if (Math.abs(dx) >= SWIPE) go(index + (dx < 0 ? 1 : -1));
    };

    body.addEventListener("pointerup", end);
    body.addEventListener("pointercancel", end);

    render();
  });
}
