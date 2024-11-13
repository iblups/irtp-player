<template>
  <div class="player-container">
    <video
      id="player"
      class="video-js vjs-16-9 iblups"
      controls
      playsinline
      muted
      autoplay
    ></video>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import videojs from "video.js";
import "@mycujoo/videojs-hls-quality-selector";
import "video.js/dist/video-js.css";
import "@/assets/css/playervideo.css";

const props = defineProps({
  streamUrl: {
    type: String,
    required: true,
  },
});

let player;

onMounted(() => {
  player = videojs("player", {
    preload: "auto",
    autoplay: true,
    muted: true,
    controlBar: {
      fullscreenToggle: true,
      volumePanel: {
        inline: false,
      },
    },
    fluid: true,
    liveui: false,
    playbackRates: false,
    html5: {
      hls: {
        limitRenditionByPlayerDimensions: true,
        useDevicePixelRatio: true,
      },
    },
    bigPlayButton: false, // Desactiva el botón de reproducción grande al centro
  });

  player.hlsQualitySelector({
    displayCurrentQuality: true,
  });

  // Mostrar el spinner de carga hasta que el video esté listo
  player.addClass("vjs-waiting");

  watch(
    () => props.streamUrl,
    (newUrl) => {
      if (newUrl) {
        player.src({
          src: newUrl,
          type: "application/vnd.apple.mpegurl",
        });

        player.ready(() => {
          player.on("playing", () => {
            player.removeClass("vjs-waiting");
          });

          // Manejar la reproducción automática
          player.play().catch((error) => {
            console.error("Error en la reproducción automática:", error);
          });
        });
      }
    },
    { immediate: true }
  );

  player.on("play", () => {
    if (player.hlsQualitySelector) {
      player.hlsQualitySelector.setQuality(1080);
    }
  });
});
</script>

<style scoped>
.player-container {
  width: 100%;
}

.player {
  margin-left: auto;
  margin-right: auto;
  max-width: 780px;
}

/* Estilos personalizados */
.iblups {
  font-size: 15px;
  font-family: "Poppins", sans-serif;
  border-radius: 15px;
}

/* Configura el spinner de carga de Video.js */
.vjs-waiting .vjs-loading-spinner {
  display: block !important;
}

/* Ocultar completamente el botón de reproducción grande al centro */
.vjs-big-play-button {
  display: none !important;
}

.iblups video {
  border-radius: 15px;
}
</style>
