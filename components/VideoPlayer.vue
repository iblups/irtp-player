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
import "videojs-mux"; // Asegura la importación de Mux

const props = defineProps({
  streamUrl: {
    type: String,
    required: true,
  },
  videoId: {
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
    html5: {
      hls: {
        limitRenditionByPlayerDimensions: true,
        useDevicePixelRatio: true,
      },
    },
    plugins: {
      mux: {
        debug: false,
        data: {
          env_key: "arce6netr7dj69b43pqvfq44k", // Clave de entorno de Mux
          player_name: "iblups_player_tvperu2024",
          player_version: "1.0.1",
          video_id: props.videoId,
          video_stream_type: "live",
          video_title: props.videoId,
        },
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
  font-size: 15px;
  font-family: "Poppins", sans-serif;
  border-radius: 15px;
}

.iblups video {
  border-radius: 15px;
}
</style>
