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
import { onMounted, watch, ref } from "vue";
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

const player = ref(null);

onMounted(() => {
  if (props.streamUrl) {
    player.value = videojs("player", {
      preload: "auto",
      autoplay: true,
      muted: true,
      controlBar: {
        fullscreenToggle: true,
        volumePanel: { inline: false },
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

    player.value.hlsQualitySelector({ displayCurrentQuality: true });

    player.value.ready(() => {
      player.value.src({
        src: props.streamUrl,
        type: "application/x-mpegURL",
      });
    });

    player.value.on("play", () => {
      player.value.hlsQualitySelector.setQuality(1080);
    });
  }
});

watch(
  () => props.streamUrl,
  (newUrl) => {
    if (player.value && newUrl) {
      player.value.src({
        src: newUrl,
        type: "application/x-mpegURL",
      });
    }
  }
);
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

.iblups {
  font-size: 15px;
  font-family: "Poppins", sans-serif;
  border-radius: 15px;
}

.iblups video {
  border-radius: 15px;
}
</style>
