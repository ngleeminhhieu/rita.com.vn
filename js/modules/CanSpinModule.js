const TAU = Math.PI * 2;

const DEFAULTS = { cx: 256.5, r: 219.5, y0: 127, y1: 1063, start: 0.1, turns: 1, copies: 2 };

const load = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.decoding = "async";
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`${src} failed to load`));
  image.src = src;
});

const composeLabels = (labels) => {
  const [first] = labels;
  const sheet = document.createElement("canvas");
  sheet.width = first.width;
  sheet.height = first.height;
  const ctx = sheet.getContext("2d");
  ctx.drawImage(first, 0, 0);
  ctx.globalCompositeOperation = "multiply";
  for (let k = 1; k < labels.length; k += 1) {
    const dx = Math.round((k * sheet.width) / labels.length);
    ctx.drawImage(labels[k], dx, 0, sheet.width, sheet.height);
    ctx.drawImage(labels[k], dx - sheet.width, 0, sheet.width, sheet.height);
  }
  return sheet;
};

export default function CanSpinModule() {
  document.querySelectorAll(".canSpinJS").forEach(async (canvas) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !canvas.dataset.base || !canvas.dataset.label) return;

    const opt = { ...DEFAULTS };
    Object.keys(DEFAULTS).forEach((key) => {
      const value = parseFloat(canvas.dataset[key]);
      if (Number.isFinite(value)) opt[key] = value;
    });

    let base;
    let label;
    let back;
    try {
      [base, label, back] = await Promise.all([
        load(canvas.dataset.base),
        load(canvas.dataset.label),
        canvas.dataset.labelBack ? load(canvas.dataset.labelBack) : null,
      ]);
    } catch (error) {
      console.error(error);
      return;
    }

    const labels = back ? [label, back] : Array.from({ length: Math.max(1, Math.round(opt.copies)) }, () => label);
    const sheet = labels.length > 1 ? composeLabels(labels) : label;
    const x0 = Math.ceil(opt.cx - opt.r);
    const x1 = Math.floor(opt.cx + opt.r);

    const draw = (rot) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.globalCompositeOperation = "multiply";
      for (let x = x0; x < x1; x += 1) {
        const s = Math.max(-1, Math.min(1, (x + 0.5 - opt.cx) / opt.r));
        let u = 0.5 + (Math.asin(s) - rot) / TAU;
        u -= Math.floor(u);
        const sx = Math.min(sheet.width - 1, Math.floor(u * sheet.width));
        ctx.drawImage(sheet, sx, 0, 1, sheet.height, x, opt.y0, 1, opt.y1 - opt.y0);
      }
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(base, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    };

    let current = NaN;
    const render = (progress) => {
      const rot = opt.start + progress * opt.turns * TAU;
      if (rot === current) return;
      current = rot;
      draw(rot);
    };

    const root = canvas.closest(".stackRevealJS");
    render(root?.stackProgress ?? 0);
    canvas.classList.add("is-ready");
    root?.addEventListener("stack:progress", (event) => render(event.detail));
  });
}
