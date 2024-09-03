export default defineNuxtPlugin(() => {
  if (process.client && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Service Worker registrado.");
      })
      .catch((error) => {
        console.error("Error al registrar el Service Worker:", error);
      });
  }
});
