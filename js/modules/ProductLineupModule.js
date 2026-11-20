const FRICTION = 0.92;
const MIN_SPEED = 0.02;
const IDLE = 80;
const DOCK_MEDIA = "(min-width: 1121px) and (hover: hover) and (pointer: fine)";
const DOCK_MIN_SPAN = 6;
const DOCK_FLOOR = 0.3;
const DOCK_CURVE = 3;
const DOCK_NEAR_FADE = 0.55;
const DOCK_FAR_FADE = 0.3;
const DOCK_EASE = 0.2;
const DOCK_FOLLOW = 0.35;
const DOCK_SHIFT = 0.25;
const DOCK_HOLD = 6;

const EDGE_ZONE = 50;
const EDGE_SPEED = 0.6;
const EDGE_BASE = 0.4;
const EDGE_EASE = 0.12;

const setupEdgeScroll = (row, move, isDragging, onMove, onEdge) => {
  let target = 0;
  let speed = 0;
  let frame = 0;
  let last = 0;

  const step = (now) => {
    const dt = last ? Math.min(48, now - last) : 16;
    last = now;
    speed += (target - speed) * EDGE_EASE;
    if (target === 0 && Math.abs(speed) < 0.01) {
      speed = 0;
      frame = 0;
      last = 0;
      return;
    }
    move(-speed * dt);
    onMove();
    frame = window.requestAnimationFrame(step);
  };

  const stop = () => {
    target = 0;
    speed = 0;
    window.cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };

  row.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || isDragging()) {
      target = 0;
      return;
    }
    const box = (row.parentElement ?? row).getBoundingClientRect();
    const left = Math.max(0, box.left);
    const right = Math.min(document.documentElement.clientWidth, box.right);
    const fromLeft = event.clientX - left;
    const fromRight = right - event.clientX;
    const depth = (distance) => EDGE_BASE + (1 - EDGE_BASE) * (1 - Math.max(0, distance) / EDGE_ZONE);
    if (fromRight < EDGE_ZONE) target = EDGE_SPEED * depth(fromRight);
    else if (fromLeft < EDGE_ZONE) target = -EDGE_SPEED * depth(fromLeft);
    else target = 0;
    onEdge(target !== 0);
    if (target && !frame) frame = window.requestAnimationFrame(step);
  });

  row.addEventListener("pointerleave", () => {
    target = 0;
    onEdge(false);
  });

  row.addEventListener("pointerdown", stop);
};

const dockHeight = (peak, k, span) => {
  const slope = 1 - Math.min(k, span) / span;
  return peak * (DOCK_FLOOR + (1 - DOCK_FLOOR) * slope ** DOCK_CURVE);
};

const dockFade = (k, span) => {
  if (k < 1) return 1 - (1 - DOCK_NEAR_FADE) * k;
  return DOCK_NEAR_FADE - (DOCK_NEAR_FADE - DOCK_FAR_FADE) * Math.min(1, (k - 1) / (span - 1));
};

const setupDock = (row, getOffset, isDragging, getEdges, count) => {
  const items = [...row.querySelectorAll(":scope > .product-lineup__item")];
  const desktop = window.matchMedia(DOCK_MEDIA);
  let layout = [];
  let drawn = [];
  let peak = 1;
  let span = DOCK_MIN_SPAN;
  let pointer = null;
  let follow = null;
  let focus = 0;
  let center = 0;
  let level = 0;
  let target = 0;
  let frame = 0;
  let held = false;
  let inside = false;

  const measure = () => {
    layout = items.map((el) => ({ el, left: el.offsetLeft, width: el.offsetWidth, rest: el.offsetHeight || 1 }));
    peak = Math.max(1, ...layout.map(({ rest }) => rest));
    const pitch = layout.length > 1 ? (layout[layout.length - 1].left - layout[0].left) / (layout.length - 1) : 0;
    span = pitch > 0 ? Math.max(DOCK_MIN_SPAN, Math.ceil(row.clientWidth / pitch)) : DOCK_MIN_SPAN;
    span = Math.max(span, count - 1);
  };

  const reset = () => {
    drawn = [];
    items.forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
    });
  };

  const render = () => {
    frame = 0;
    const entering = level < 0.002;
    level += (target - level) * DOCK_EASE;
    if (pointer !== null) follow = follow === null ? pointer : follow + (pointer - follow) * DOCK_FOLLOW;
    if (target === 0 && level < 0.002) {
      level = 0;
      reset();
      return;
    }
    const offset = getOffset();
    const cursor = follow - offset;
    const centers = drawn.length === layout.length ? drawn : layout.map(({ left, width }) => left + width / 2);
    let nearest = entering ? Infinity : Math.abs(centers[focus] - cursor) - DOCK_HOLD;
    centers.forEach((middle, i) => {
      const distance = Math.abs(middle - cursor);
      if (distance < nearest) {
        nearest = distance;
        focus = i;
      }
    });
    center = entering ? focus : center + (focus - center) * DOCK_SHIFT;
    const scales = layout.map(({ rest }, i) => 1 + (dockHeight(peak, Math.abs(i - center), span) / rest - 1) * level);
    let anchor = 0;
    let total = 0;
    layout.forEach(({ left, width }, i) => {
      anchor += width * (scales[i] - 1) * Math.min(1, Math.max(0, (cursor - left) / width));
      total += width * (scales[i] - 1);
    });
    const edges = getEdges?.();
    if (edges && layout.length) {
      const start = layout[0].left + offset;
      const tail = layout[layout.length - 1];
      const end = tail.left + tail.width + offset;
      if (start >= edges.low - 1) anchor = Math.min(anchor, start - edges.low);
      if (end <= edges.high + 1) anchor = Math.max(anchor, end + total - edges.high);
    }
    let shift = 0;
    drawn = layout.map(({ el, left, width }, i) => {
      const extra = width * (scales[i] - 1);
      const move = shift + extra / 2 - anchor;
      el.style.transform = `translateX(${move.toFixed(2)}px) scale(${scales[i].toFixed(4)})`;
      el.style.opacity = (1 - (1 - dockFade(Math.abs(i - center), span)) * level).toFixed(3);
      shift += extra;
      return left + width / 2 + move;
    });
    if (Math.abs(target - level) > 0.002 || Math.abs(pointer - follow) > 0.5 || Math.abs(focus - center) > 0.005) {
      frame = window.requestAnimationFrame(render);
    }
  };

  const request = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  row.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !desktop.matches) return;
    inside = true;
    pointer = event.clientX - row.getBoundingClientRect().left;
    target = isDragging() || held ? 0 : 1;
    request();
  });

  row.addEventListener("pointerleave", () => {
    inside = false;
    target = 0;
    request();
  });

  row.addEventListener("pointerdown", () => {
    target = 0;
    request();
  });

  desktop.addEventListener("change", () => {
    if (desktop.matches) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
    level = 0;
    target = 0;
    reset();
  });

  new ResizeObserver(measure).observe(row);
  measure();

  const hold = (on) => {
    if (on === held) return;
    held = on;
    target = !held && inside && desktop.matches && !isDragging() ? 1 : 0;
    request();
  };

  return { refresh: () => level > 0 && request(), hold };
};

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
    const loops = row.dataset.loop !== "false";
    const first = originals[0];
    const last = originals[originals.length - 1];
    const before = loops ? originals.map(copy) : [];
    if (loops) {
      first.before(...before);
      last.after(...originals.map(copy));
    }

    let x = 0;
    let loop = 0;
    let min = 0;
    let max = 0;
    let placed = false;
    const edges = { low: 0, high: 0 };
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let frame = 0;

    const apply = () => {
      if (loop > 0) x = ((((x + loop / 2) % loop) + loop) % loop) - loop / 2;
      if (!loops) x = Math.min(max, Math.max(min, x));
      row.style.setProperty("--x", `${x.toFixed(2)}px`);
    };

    const bound = () => {
      const box = row.getBoundingClientRect();
      const view = (row.parentElement ?? row).getBoundingClientRect();
      const viewLeft = Math.max(0, view.left - box.left);
      const viewRight = Math.min(row.clientWidth, view.right - box.left);
      const gap = originals.length > 1 ? originals[1].offsetLeft - first.offsetLeft - first.offsetWidth : 0;
      const start = first.offsetLeft;
      const end = last.offsetLeft + last.offsetWidth;
      edges.low = viewLeft + gap;
      edges.high = viewRight - gap;
      min = edges.high - end;
      max = edges.low - start;
      if (min > max) {
        min = (viewLeft + viewRight - start - end) / 2;
        max = min;
      }
      if (!placed) {
        x = max;
        placed = true;
      }
    };

    const measure = () => {
      if (loops) {
        const previous = loop;
        loop = first.offsetLeft - before[0].offsetLeft;
        if (previous > 0 && loop > 0) x *= loop / previous;
      } else {
        bound();
      }
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
          const free = x;
          velocity *= FRICTION ** (dt / 16);
          apply();
          if (!loops && x !== free) velocity = 0;
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

    const dock = row.hasAttribute("data-dock") ? setupDock(row, () => x, () => dragging, loops ? null : () => edges, originals.length) : null;

    if (row.hasAttribute("data-edge-scroll")) {
      const move = (dx) => {
        stopGlide();
        x += dx;
        apply();
      };
      setupEdgeScroll(row, move, () => dragging, () => dock?.refresh(), (on) => dock?.hold(on));
    }
  });
}
