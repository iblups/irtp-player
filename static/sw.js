let isPlayerActive = false;

self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado");
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SET_PLAYER_ACTIVE") {
    isPlayerActive = event.data.active;
    console.log("Player activo:", isPlayerActive);
  }
});

self.addEventListener("fetch", (event) => {
  if (isPlayerActive) {
    const streamUrl =
      "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8";
    if (event.request.url.includes(streamUrl)) {
      console.log("Interceptando solicitud de audio:", event.request.url);
      event.respondWith(fetch(event.request));
    }
  }
});
