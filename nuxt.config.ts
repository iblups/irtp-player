// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
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
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/tailwindcss",
  ],
  plugins: [

  ],
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
});
