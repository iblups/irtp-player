self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installed");
});

self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activated");
});

self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch intercepted for:", event.request.url);
});
