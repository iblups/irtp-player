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

// Interceptar solicitudes de red relacionadas con audio HLS
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(".m3u8")) {
    console.log("[ServiceWorker] HLS request intercepted:", event.request.url);
    event.respondWith(fetch(event.request));
  }
});

// Mantener el Service Worker activo
self.addEventListener("message", (event) => {
  if (event.data === "keep-alive") {
    console.log("[ServiceWorker] Keeping connection alive.");
    setTimeout(() => {
      event.source.postMessage("Still active");
    }, 10000);
  }
});
