export default defineNuxtPlugin(() => {
  if (process.client && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registrado globalmente.");

        // Comunicación con el Service Worker
        window.setPlayerActive = (active) => {
          if (registration.active) {
            registration.active.postMessage({
              type: "SET_PLAYER_ACTIVE",
              active: active,
            });
          }
        };
      })
      .catch((error) =>
        console.error("Error al registrar el Service Worker:", error)
      );
  }
});
