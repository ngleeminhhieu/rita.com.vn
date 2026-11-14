export default function PopupModule() {
  document.querySelectorAll(".popupJS").forEach((dialog) => {
    if (typeof dialog.showModal !== "function") return;

    dialog.querySelectorAll(".popupCloseJS").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    document.querySelectorAll(`.popupOpenJS[aria-controls="${dialog.id}"]`).forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        dialog.showModal();
      });
    });
  });
}
