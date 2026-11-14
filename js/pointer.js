const last = { x: -1, y: -1 };
let moved = false;

window.addEventListener("pointermove", (event) => {
  moved = event.clientX !== last.x || event.clientY !== last.y;
  last.x = event.clientX;
  last.y = event.clientY;
}, { capture: true, passive: true });

export const pointerMoved = () => moved;
