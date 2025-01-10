// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/playeraudio.css",
    "~/assets/css/playervideo.css",
    "video.js/dist/video-js.css",
  ],
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  modules: ["@nuxtjs/google-fonts", "@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  plugins: [],
  googleFonts: {
    families: {
      Roboto: true,
      Lato: [100, 300],
      Poppins: [400, 600],
    },
    display: "swap",
    preconnect: true,
    preload: true,
    useStylesheet: true,
    crossorigin: "anonymous",
  },
  app: {
    head: {
      link: [{ rel: "manifest", href: "/manifest.json" }],
    },
  },
  ssr: false, // Desactiva SSR si la app es puramente cliente
  pwa: {
    manifest: {
      name: "Radio en Vivo",
      short_name: "Radio",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#007bff",
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /.*\\.m3u8$/,
          handler: "CacheFirst",
          options: {
            cacheName: "audio-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 7 * 24 * 60 * 60,
            },
          },
        },
      ],
    },
  },
});
