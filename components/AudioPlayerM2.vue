<template>
  <div class="audio-player">
    <audio
      ref="audio"
      :src="audioSrc"
      @play="handlePlay"
      @pause="handlePause"
      @error="handleError"
    ></audio>
    <div class="controls">
      <button @click="togglePlayPause">
        {{ isPlaying ? "Pause" : "Play" }}
      </button>
    </div>
    <div class="info">
      <p>Service Worker Status: {{ swStatus }}</p>
      <p>Audio State: {{ audioState }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const audioSrc =
  "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8";
const audio = ref(null);
const isPlaying = ref(false);
const swStatus = ref("Not Registered");
const audioState = ref("Idle");

const togglePlayPause = () => {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const handlePlay = () => {
  setupMediaSession();
  isPlaying.value = true;
  audioState.value = "Playing";
};

const handlePause = () => {
  isPlaying.value = false;
  audioState.value = "Paused";
};

const handleError = () => {
  audioState.value = "Error";
};

const setupMediaSession = () => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "RPP En Vivo",
      artist: "RPP Noticias",
      artwork: [
        { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => audio.value.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.value.pause());
  }
};

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        swStatus.value = "Registered";
      })
      .catch(() => {
        swStatus.value = "Failed";
      });
  }
});
</script>

<style scoped>
.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.controls button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.info {
  margin-top: 10px;
}
</style>
