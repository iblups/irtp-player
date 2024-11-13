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
import "@/assets/css/playervideo.css"; // Asegúrate de importar tu CSS personalizado

const props = defineProps({
  streamUrl: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  const player = videojs("player", {
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
  });

  player.hlsQualitySelector({
    displayCurrentQuality: true,
  });

  const qualityLevels = player.qualityLevels();

  qualityLevels.addQualityLevel({
    id: 1080,
    width: 1080,
    enabled: (enabled) => !enabled,
  });
  qualityLevels.addQualityLevel({
    id: 720,
    width: 720,
    enabled: (enabled) => !enabled,
  });
  qualityLevels.addQualityLevel({
    id: 480,
    width: 480,
    src: props.streamUrl,
    enabled: (enabled) => !enabled,
  });

  player.ready(() => {
    player.src({
      src: props.streamUrl,
      type: "application/x-mpegURL",
    });
  });

  player.on("play", () => {
    player.hlsQualitySelector.setQuality(1080);
  });

  watch(
    () => props.streamUrl,
    (newUrl) => {
      player.src({
        src: newUrl,
        type: "application/x-mpegURL",
      });
    }
  );
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
  font-size: 15px; /* Aumentar el tamaño de la fuente */
  font-family: "Poppins", sans-serif; /* Cambiar el tipo de letra */
  border-radius: 15px;
}

.iblups video {
  border-radius: 15px;
}
</style>
