const last = { x: -1, y: -1 };
let moved = false;

// Trình duyệt phát pointermove giả sau khi cuộn / đổi layout (toạ độ không đổi) → so toạ độ ở pha capture, chạy trước
// listener của từng phần tử, để chỉ mở menu / tìm kiếm khi chuột thật sự di chuyển
window.addEventListener("pointermove", (event) => {
  moved = event.clientX !== last.x || event.clientY !== last.y;
  last.x = event.clientX;
  last.y = event.clientY;
}, { capture: true, passive: true });

export const pointerMoved = () => moved;
