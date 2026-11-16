const DESKTOP = "(min-width: 1121px)";

const slugify = (text) => text
  .normalize("NFD")
  .replace(/\p{M}/gu, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const initToc = () => {
  const toc = document.querySelector(".tocJS");
  const list = toc?.querySelector(".tocListJS");
  const content = document.querySelector(".postContentJS");
  if (!toc || !list || !content) return;

  const headings = [...content.querySelectorAll("h2, h3")];
  if (!headings.length) {
    toc.closest(".post-side")?.remove();
    return;
  }

  const used = new Set();
  headings.forEach((heading, index) => {
    if (heading.id) return;
    let id = slugify(heading.textContent) || `section-${index + 1}`;
    while (used.has(id) || document.getElementById(id)) id = `${id}-${index + 1}`;
    used.add(id);
    heading.id = id;
  });

  const makeLink = (heading, isSub) => {
    const link = document.createElement("a");
    link.className = isSub ? "toc__link toc__link--sub" : "toc__link";
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    return link;
  };

  const groups = [];

  const setGroup = (target, open) => {
    target.item.classList.toggle("is-open", open);
    target.toggle.setAttribute("aria-expanded", String(open));
    target.wrap.inert = !open;
  };

  const openOnly = (target) => {
    groups.forEach((entry) => setGroup(entry, entry === target));
  };

  const addSubList = (target) => {
    const wrap = document.createElement("div");
    wrap.className = "toc__sub-wrap";
    wrap.id = `toc-sub-${groups.length + 1}`;
    const sub = document.createElement("ol");
    sub.className = "toc__sub";
    wrap.append(sub);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "toc__toggle";
    toggle.setAttribute("aria-controls", wrap.id);
    toggle.setAttribute("aria-label", `Show or hide the subsections of “${target.link.textContent}”`);
    target.row.append(toggle);
    target.item.append(wrap);

    Object.assign(target, { sub, wrap, toggle });
    groups.push(target);
    setGroup(target, false);
    toggle.addEventListener("click", () => {
      if (target.item.classList.contains("is-open")) setGroup(target, false);
      else openOnly(target);
    });
  };

  let group = null;

  const entries = headings.map((heading) => {
    const item = document.createElement("li");

    if (heading.tagName === "H2" || !group) {
      const link = makeLink(heading, false);
      const row = document.createElement("div");
      row.className = "toc__row";
      row.append(link);
      item.className = "toc__item";
      item.append(row);
      list.append(item);
      group = { item, row, link, sub: null };
      return { heading, link, group: null };
    }

    if (!group.sub) addSubList(group);
    const link = makeLink(heading, true);
    item.append(link);
    group.sub.append(item);
    return { heading, link, group };
  });

  const desktop = window.matchMedia(DESKTOP);
  const syncOpen = () => {
    toc.open = desktop.matches;
  };
  syncOpen();
  desktop.addEventListener("change", syncOpen);

  list.addEventListener("click", (event) => {
    if (event.target.closest(".toc__link") && !desktop.matches) toc.open = false;
  });

  let active = null;
  const setActive = (entry) => {
    if (entry === active) return;
    active?.link.classList.remove("is-active");
    active?.link.removeAttribute("aria-current");
    active?.group?.link.classList.remove("is-parent");
    entry.link.classList.add("is-active");
    entry.link.setAttribute("aria-current", "location");
    entry.group?.link.classList.add("is-parent");
    const ownGroup = entry.group || groups.find((target) => target.link === entry.link) || null;
    openOnly(ownGroup);
    active = entry;
    if (toc.scrollHeight > toc.clientHeight) {
      const box = toc.getBoundingClientRect();
      const linkBox = entry.link.getBoundingClientRect();
      if (linkBox.top < box.top || linkBox.bottom > box.bottom) {
        toc.scrollTo({ top: toc.scrollTop + linkBox.top - box.top - toc.clientHeight / 2, behavior: "smooth" });
      }
    }
  };

  const spy = () => {
    const line = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 8;
    let current = entries[0];
    entries.forEach((entry) => {
      if (entry.heading.getBoundingClientRect().top <= line) current = entry;
    });
    setActive(current);
  };

  let frame = 0;
  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(() => {
      frame = 0;
      spy();
    });
  }, { passive: true });
  spy();
};

const initShare = () => {
  document.querySelectorAll(".shareJS").forEach((share) => {
    const pageUrl = window.location.href.split("#")[0];
    const url = encodeURIComponent(pageUrl);
    const title = encodeURIComponent(document.querySelector("h1")?.textContent.trim() || document.title);
    const status = share.querySelector(".share__status");
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    };

    share.querySelectorAll("a[data-share]").forEach((link) => {
      if (targets[link.dataset.share]) link.href = targets[link.dataset.share];
    });

    const copy = share.querySelector("[data-share='copy']");
    let timer = 0;
    copy?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pageUrl);
        copy.classList.add("is-copied");
        if (status) status.textContent = "Link copied";
      } catch {
        if (status) status.textContent = "Could not copy, please copy the address bar";
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copy.classList.remove("is-copied");
        if (status) status.textContent = "";
      }, 2400);
    });
  });
};

const initTables = () => {
  document.querySelectorAll(".postContentJS table").forEach((table) => {
    if (table.parentElement.classList.contains("content-detail__table")) return;
    const wrap = document.createElement("div");
    wrap.className = "content-detail__table";
    table.before(wrap);
    wrap.append(table);
    const sync = () => {
      if (wrap.scrollWidth > wrap.clientWidth + 1) {
        wrap.tabIndex = 0;
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", "Table, scroll sideways to see all columns");
      } else {
        wrap.removeAttribute("tabindex");
        wrap.removeAttribute("role");
        wrap.removeAttribute("aria-label");
      }
    };
    sync();
    new ResizeObserver(sync).observe(wrap);
  });
};

const initCategories = () => {
  const list = document.querySelector(".blogCategoriesJS");
  if (!list) return;
  const slug = new URLSearchParams(window.location.search).get("category") || "";
  const items = [...list.querySelectorAll("li")];
  const target = items.find((item) => {
    const link = item.querySelector("a");
    return link && (new URL(link.href).searchParams.get("category") || "") === slug;
  });
  if (!target) return;
  items.forEach((item) => {
    const link = item.querySelector("a");
    const current = item === target;
    item.classList.toggle("current-cat", current);
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (target !== items[0]) target.scrollIntoView({ block: "nearest", inline: "center" });
};

export default function BlogModule() {
  initTables();
  initToc();
  initShare();
  initCategories();
}
