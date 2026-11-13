import { openWithFancybox } from "../fancybox.js";

export default function LightboxModule() {
  openWithFancybox("[data-fancybox]", {
    dragToClose: true,
  });
}
