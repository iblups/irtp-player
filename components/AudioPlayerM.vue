<template>
  <div class="audio-container">
    <img
      v-show="showPosterImage"
      src="https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg"
      alt="Cover Image"
      class="poster-image"
    />
    <audio
      id="web-player"
      class="video-js vjs-fill audio"
      controls
      playsinline
      preload="auto"
      muted
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Hls from "hls.js";

const props = defineProps({
  streamUrl: {
    type: String,
    default:
      "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8",
  },
});

const showPosterImage = ref(true);

onMounted(() => {
  const player = document.getElementById("web-player");

  if (player) {
    // Integración de HLS.js para mayor compatibilidad
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(props.streamUrl);
      hls.attachMedia(player);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        player.play().catch((error) => {
          console.log("Autoplay failed:", error);
        });
      });
    } else if (player.canPlayType("application/vnd.apple.mpegurl")) {
      // Soporte nativo para HLS
      player.src = props.streamUrl;
      player.play().catch((error) => {
        console.log("Error reproduciendo HLS:", error);
      });
    }

    player.volume = 0.6; // Volumen inicial

    // Configuración de Media Session API
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Radio Nacional",
        artist: "En vivo",
        artwork: [
          {
            src: "https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => player.play());
      navigator.mediaSession.setActionHandler("pause", () => player.pause());
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        player.currentTime = Math.max(player.currentTime - 10, 0);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        player.currentTime = Math.min(player.currentTime + 10, player.duration);
      });

      // Informar al sistema que se está reproduciendo
      navigator.mediaSession.playbackState = "playing";
    }

    // Manejar cambios de visibilidad para Android
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && player.paused) {
        player.play().catch((error) => {
          console.log("Error al intentar reanudar el audio:", error);
        });
      }
    });

    // Intentar reproducir automáticamente
    player.play().catch((error) => {
      console.log("Autoplay failed:", error);
      showPosterImage.value = false; // Oculta la imagen después de la interacción del usuario
    });
  }
});
</script>

<style scoped>
.audio-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto;
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

.poster-image {
  width: 100%;
  border-radius: 0.75rem;
}
</style>
