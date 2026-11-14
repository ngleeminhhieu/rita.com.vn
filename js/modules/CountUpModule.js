const DURATION = 1800;
const PATTERN = /^(\D*)(\d[\d,]*)(\.\d+)?(\D*)$/;

const easeOut = (t) => 1 - (1 - t) ** 3;

export default function CountUpModule() {
  const items = new Map();
  document.querySelectorAll(".countUpJS").forEach((el) => {
    const match = el.textContent.trim().match(PATTERN);
    if (!match) return;
    const [, prefix, whole, fraction = "", suffix] = match;
    const digits = Math.max(0, fraction.length - 1);
    const options = { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: whole.includes(",") };
    items.set(el, {
      target: parseFloat(whole.replace(/,/g, "") + fraction),
      format: (value) => `${prefix}${value.toLocaleString("en-US", options)}${suffix}`,
    });
  });
  if (!items.size) return;

  const run = (el) => {
    const { target, format } = items.get(el);
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.textContent = format(target * easeOut(t));
      if (t < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.style.minWidth = "";
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      run(entry.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });

  items.forEach(({ format }, el) => {
    const size = parseFloat(window.getComputedStyle(el).fontSize) || 16;
    el.style.minWidth = `${(el.getBoundingClientRect().width / size).toFixed(3)}em`;
    el.textContent = format(0);
    observer.observe(el);
  });
}
