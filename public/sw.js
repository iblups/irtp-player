"use strict";

// Evento de instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(self.skipWaiting());
});

// Evento de activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(self.clients.claim());
});

// Evento fetch para interceptar solicitudes de red
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(".m3u8")) {
    console.log("[ServiceWorker] Handling HLS request:", event.request.url);
  }
});

// Manejo de mensajes desde el cliente
self.addEventListener("message", (event) => {
  console.log("[ServiceWorker] Message received:", event.data);

  if (event.data === "keep-alive") {
    // Mantener la conexión activa
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) =>
        client.postMessage("Stream is active and managed by the Service Worker")
      );
    });
  }
});
