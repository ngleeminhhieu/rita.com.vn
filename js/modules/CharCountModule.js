export default function CharCountModule() {
  document.querySelectorAll(".charCountJS").forEach((field) => {
    const output = document.getElementById(field.dataset.countOutput);
    const max = Number(field.getAttribute("maxlength")) || 0;
    if (!output || !max) return;

    const update = () => {
      output.textContent = `${max - field.value.length} characters left`;
    };

    field.addEventListener("input", update);
    field.form?.addEventListener("reset", () => window.requestAnimationFrame(update));
    update();
  });
}
