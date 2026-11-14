const LEAVE_FALLBACK = 1400;
const RIBBON_EXIT = 600;
const SWIPE = 42;
const DOWN_KEYS = new Set(["ArrowDown", "PageDown", "End", " ", "Escape"]);
const UP_KEYS = new Set(["ArrowUp", "PageUp", "Home"]);

export default function WelcomeScreenModule() {
  const root = document.documentElement;
  const screen = document.querySelector(".welcomeScreenJS");
  if (!screen || !root.classList.contains("is-welcome")) return;

  const others = [...document.body.children]
    .filter((el) => el !== screen && el.tagName !== "SCRIPT")
    .map((el) => ({ el, inert: el.inert }));
  const restoration = "scrollRestoration" in window.history ? window.history.scrollRestoration : null;
  let leaving = false;
  let touch = null;

  const toTop = () => {
    const behavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = behavior;
  };

  const onWheel = (event) => {
    if (event.ctrlKey) return;
    event.preventDefault();
    if (event.deltaY > Math.abs(event.deltaX)) dismiss();
  };

  const onTouchStart = (event) => {
    touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  };

  const onTouchMove = (event) => {
    if (event.cancelable) event.preventDefault();
    if (!touch || event.touches.length !== 1) return;
    const up = touch.y - event.touches[0].clientY;
    if (up >= SWIPE && up > Math.abs(event.touches[0].clientX - touch.x)) {
      touch = null;
      dismiss();
    }
  };

  const onTouchEnd = () => {
    touch = null;
  };

  const onKeydown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (UP_KEYS.has(event.key)) {
      event.preventDefault();
      return;
    }
    if (!DOWN_KEYS.has(event.key) || (event.key === " " && event.target.closest?.("a, button"))) return;
    event.preventDefault();
    dismiss({ focusPage: true });
  };

  const listen = (on) => {
    const method = on ? "addEventListener" : "removeEventListener";
    window[method]("wheel", onWheel, { passive: false });
    window[method]("touchstart", onTouchStart, { passive: true });
    window[method]("touchmove", onTouchMove, { passive: false });
    window[method]("touchend", onTouchEnd, { passive: true });
    window[method]("touchcancel", onTouchEnd, { passive: true });
    window[method]("keydown", onKeydown);
  };

  const split = (focusPage) => {
    const lower = screen.cloneNode(true);
    lower.classList.remove("welcomeScreenJS");
    lower.classList.add("welcome-screen--lower");
    lower.removeAttribute("role");
    lower.setAttribute("aria-hidden", "true");
    lower.inert = true;
    lower.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    lower.querySelectorAll("img").forEach((img) => {
      img.loading = "eager";
      img.decoding = "sync";
    });
    screen.classList.add("is-split");
    screen.after(lower);
    void lower.offsetWidth;
    screen.classList.add("is-open");
    lower.classList.add("is-open");

    let timer = 0;
    const finish = (event) => {
      if (event && (event.target !== screen || event.propertyName !== "translate")) return;
      window.clearTimeout(timer);
      screen.removeEventListener("transitionend", finish);
      lower.remove();
      screen.hidden = true;
      root.classList.remove("is-welcome");
      others.forEach(({ el, inert }) => {
        el.inert = inert;
      });
      if (restoration !== null) window.history.scrollRestoration = restoration;
      if (focusPage) document.querySelector(".site-logo")?.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent("welcome:dismissed"));
    };
    screen.addEventListener("transitionend", finish);
    timer = window.setTimeout(() => finish(), LEAVE_FALLBACK);
  };

  function dismiss({ focusPage = false } = {}) {
    if (leaving) return;
    leaving = true;
    listen(false);
    screen.querySelectorAll(".wave-ribbon").forEach((ribbon) => ribbon.classList.add("is-exiting"));
    window.setTimeout(() => split(focusPage), RIBBON_EXIT);
  }

  others.forEach(({ el }) => {
    el.inert = true;
  });
  if (restoration !== null) window.history.scrollRestoration = "manual";
  toTop();
  window.addEventListener("load", toTop, { once: true });
  listen(true);
  screen.querySelector(".welcomeDismissJS")?.addEventListener("click", () => dismiss({ focusPage: true }));
  screen.classList.add("is-ready");
  screen.focus({ preventScroll: true });
}
