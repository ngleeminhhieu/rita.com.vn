const SPEED = 60;
const NBSP = " ";
const GAP = NBSP.repeat(4);
const MAX_COPIES = 12;

export default function WaveRibbonModule() {
  document.querySelectorAll(".waveRibbonJS").forEach((svg) => {
    const textPath = svg.querySelector(".waveRibbonTextJS");
    const path = textPath && svg.querySelector(textPath.getAttribute("href"));
    const phrase = textPath?.textContent.replace(/\s+/g, " ").trim().replace(/\s*([×✱→])\s*/g, `${GAP}$1${GAP}`);
    if (!path || !phrase) return;

    const unit = phrase.endsWith(NBSP) ? phrase : `${phrase}${GAP}`;
    let step = 0;
    let offset = 0;
    let last = 0;
    let frame = 0;

    const prepare = () => {
      const total = path.getTotalLength();
      textPath.textContent = unit;
      const length = textPath.getComputedTextLength();
      if (!total || length < total / MAX_COPIES) return false;
      step = length;
      textPath.textContent = unit.repeat(Math.ceil(total / step) + 1);
      return true;
    };

    const tick = (now) => {
      if (last) offset = (offset + ((now - last) / 1000) * SPEED) % step;
      last = now;
      textPath.setAttribute("startOffset", (offset - step).toFixed(2));
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) {
        if (!step && !prepare()) return;
        last = 0;
        frame = window.requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    document.fonts.ready.then(() => observer.observe(svg));
  });
}
