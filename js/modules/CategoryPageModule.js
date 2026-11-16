export default function CategoryPageModule() {
  const source = document.querySelector(".categoryDataJS");
  if (!source) return;

  const slug = new URLSearchParams(window.location.search).get("category")?.trim();
  if (!slug) return;

  let categories = [];
  try {
    categories = JSON.parse(source.textContent);
  } catch (error) {
    console.error("categoryDataJS is not valid JSON", error);
    return;
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) return;

  const image = document.querySelector(".categoryImageJS");
  if (image) {
    if (category.srcset) image.srcset = category.srcset;
    else image.removeAttribute("srcset");
    image.src = category.image;
    image.alt = category.alt;
    image.width = category.width;
    image.height = category.height;
  }

  const names = document.querySelectorAll(".categoryNameJS");
  const defaultName = names[0]?.textContent.trim();
  names.forEach((el) => {
    el.textContent = category.name;
  });
  if (defaultName) document.title = document.title.replace(defaultName, category.name);

  document.querySelectorAll('.primary-menu a[href*="product-category.html"], .mobile-menu a[href*="product-category.html"]').forEach((link) => {
    const isCurrent = new URL(link.href, window.location.href).searchParams.get("category") === category.slug;
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
    link.closest(".menu-item")?.classList.toggle("current-menu-item", isCurrent);
  });
}
