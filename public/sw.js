self.addEventListener("install", (event) => {
  console.log("Service Worker instalado.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado.");
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("m3u8")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error en fetch:", error);
          throw error;
        })
    );
  }
});
