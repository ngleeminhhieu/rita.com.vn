const FLOAT_BOTTOM_GAP = 24;
const FLOAT_MIN_H = 240;
const FLOAT_MAX_HIDDEN = 0.2;
const HEIGHT_JITTER = 150;
const RUN_DISTANCE = 120;
const ENTER_STEP = 0.08;
const ENTER_SPAN = 0.7;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const segment = (value, start, span) => clamp01((value - start) / span);
const easeOut = (t) => 1 - (1 - t) ** 3;

export default function StackRevealModule() {
  document.querySelectorAll(".stackRevealJS").forEach((root) => {
    const back = root.querySelector(".stack-reveal__back");
    const front = root.querySelector(".stack-reveal__front");
    const anchor = root.querySelector(".stackAnchorJS");
    const float = root.querySelector(".stackFloatJS");
    if (!back || !front) return;

    const lines = [...root.querySelectorAll(".stackLineJS")].map((el, index) => ({
      el,
      index,
      dir: Number(el.dataset.run) || 1,
    }));
    const ratio = float?.width && float?.height ? float.height / float.width : 0;
    let stackTop = 0;
    let lastSize = { w: 0, h: 0 };

    const layout = () => {
      const vh = window.innerHeight;
      const style = window.getComputedStyle(root);
      const floatW = parseFloat(style.getPropertyValue("--float-w")) || 0;
      const overlap = parseFloat(style.getPropertyValue("--float-overlap")) || 0;
      const rise = parseFloat(style.getPropertyValue("--float-rise")) || 0;
      const anchorBottom = anchor ? anchor.getBoundingClientRect().bottom - back.getBoundingClientRect().top : 0;
      const floatTop = anchorBottom - overlap;
      const idealH = floatW * ratio;
      const fitH = (vh - floatTop - FLOAT_BOTTOM_GAP) / (1 - FLOAT_MAX_HIDDEN);
      const floatH = Math.max(Math.min(idealH, fitH), Math.min(idealH, FLOAT_MIN_H));

      stackTop = Math.round(floatTop + floatH * rise);
      lastSize = { w: window.innerWidth, h: vh };
      root.style.setProperty("--float-h", `${Math.round(floatH)}px`);
      root.style.setProperty("--stack-top", `${stackTop}px`);
    };

    const runLines = (enter) => {
      lines.forEach(({ el, index, dir }) => {
        const shown = easeOut(segment(enter, index * ENTER_STEP, ENTER_SPAN));
        const x = dir * RUN_DISTANCE * (shown - 1);
        el.style.translate = Math.abs(x) < 0.01 ? "" : `${x.toFixed(2)}% 0`;
      });
    };

    let frame = 0;
    let last = "";

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const enter = clamp01(1 - back.getBoundingClientRect().top / vh);
      const slid = stackTop - front.getBoundingClientRect().top;
      const progress = stackTop > 0 ? Math.min(1, Math.max(-vh, slid) / stackTop) : 0;
      const key = `${enter.toFixed(4)}|${progress.toFixed(4)}`;
      if (key === last) return;
      last = key;
      runLines(enter);
      root.stackProgress = progress;
      root.dispatchEvent(new CustomEvent("stack:progress", { detail: progress }));
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("resize", () => {
      if (window.innerWidth === lastSize.w && Math.abs(window.innerHeight - lastSize.h) < HEIGHT_JITTER) return;
      layout();
      request();
    });

    if (anchor && "ResizeObserver" in window) {
      new ResizeObserver(() => {
        layout();
        request();
      }).observe(anchor);
    }

    window.addEventListener("scroll", request, { passive: true });
    layout();
    update();
  });
}
