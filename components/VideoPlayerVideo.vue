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
import { onMounted, watch, onBeforeUnmount } from "vue";
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
  // Inicializar el reproductor de video
  player = videojs("player", {
    controls: true,
    autoplay: true,
    muted: true,
    fluid: true,
  });

  // Agregar el selector de calidad HLS
  player.hlsQualitySelector({
    displayCurrentQuality: true,
  });

  // Configurar la fuente del video
  player.src({
    src: props.streamUrl,
    type: "application/x-mpegURL", // o intenta con "application/vnd.apple.mpegurl"
  });

  // Reactivar la fuente si `streamUrl` cambia
  watch(
    () => props.streamUrl,
    (newUrl) => {
      player.src({
        src: newUrl,
        type: "application/x-mpegURL", // o "application/vnd.apple.mpegurl"
      });
    }
  );
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});
</script>

<style scoped>
.player-container {
  width: 100%;
}

.iblups {
  font-size: 15px;
  font-family: "Poppins", sans-serif;
  border-radius: 15px;
}

.iblups video {
  border-radius: 15px;
}
</style>
