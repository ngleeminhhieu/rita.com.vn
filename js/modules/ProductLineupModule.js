const FRICTION = 0.92;
const MIN_SPEED = 0.02;
const IDLE = 80;

export default function ProductLineupModule() {
  document.querySelectorAll(".productLineupJS").forEach((row) => {
    const originals = [...row.querySelectorAll(":scope > .product-lineup__item")];
    if (!originals.length) return;

    const copy = (item) => {
      const clone = item.cloneNode(true);
      clone.alt = "";
      clone.setAttribute("aria-hidden", "true");
      return clone;
    };
    const before = originals.map(copy);
    originals[0].before(...before);
    originals[originals.length - 1].after(...originals.map(copy));

    let x = 0;
    let loop = 0;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let frame = 0;

    const apply = () => {
      if (loop > 0) x = ((((x + loop / 2) % loop) + loop) % loop) - loop / 2;
      row.style.setProperty("--x", `${x.toFixed(2)}px`);
    };

    const measure = () => {
      const previous = loop;
      loop = originals[0].offsetLeft - before[0].offsetLeft;
      if (previous > 0 && loop > 0) x *= loop / previous;
      apply();
    };

    const stopGlide = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const glide = () => {
      let last = 0;
      const step = (now) => {
        if (last) {
          const dt = now - last;
          x += velocity * dt;
          velocity *= FRICTION ** (dt / 16);
          apply();
        }
        last = now;
        frame = Math.abs(velocity) > MIN_SPEED ? window.requestAnimationFrame(step) : 0;
      };
      frame = window.requestAnimationFrame(step);
    };

    const release = (event) => {
      if (!dragging) return;
      dragging = false;
      row.classList.remove("is-dragging");
      if (row.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
      if (event.timeStamp - lastTime > IDLE) velocity = 0;
      glide();
    };

    row.addEventListener("dragstart", (event) => event.preventDefault());

    row.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      stopGlide();
      dragging = true;
      startX = event.clientX;
      startOffset = x;
      lastX = event.clientX;
      lastTime = event.timeStamp;
      velocity = 0;
      row.classList.add("is-dragging");
      row.setPointerCapture(event.pointerId);
    });

    row.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dt = event.timeStamp - lastTime;
      if (dt > 0) velocity = velocity * 0.2 + ((event.clientX - lastX) / dt) * 0.8;
      lastX = event.clientX;
      lastTime = event.timeStamp;
      x = startOffset + event.clientX - startX;
      apply();
    });

    row.addEventListener("pointerup", release);
    row.addEventListener("pointercancel", release);

    row.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      stopGlide();
      x -= event.deltaX;
      apply();
    }, { passive: false });

    new ResizeObserver(measure).observe(row);
    measure();
  });
}
