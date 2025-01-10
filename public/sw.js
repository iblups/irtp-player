"use strict";

// Evento de instalación
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(self.skipWaiting());
});

// Evento de activación
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");
  event.waitUntil(self.clients.claim());
});

// Manejo de solicitudes de red
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(".m3u8")) {
    console.log("[Service Worker] Handling HLS request:", event.request.url);
    event.respondWith(fetch(event.request));
  }
});

// Mantener el SW activo
self.addEventListener("message", (event) => {
  if (event.data === "keep-alive") {
    console.log("[Service Worker] Keeping connection alive.");
  }
});
