<template>
  <div class="audio-player">
    <audio
      ref="audio"
      :src="audioSrc"
      @play="updateMediaSession"
      @pause="updateMediaSession"
    ></audio>
    <div class="controls">
      <button @click="togglePlayPause">
        {{ isPlaying ? "Pause" : "Play" }}
      </button>
    </div>
    <div v-if="swMessage" class="sw-message">
      {{ swMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const audioSrc =
  "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8";
const audio = ref(null);
const isPlaying = ref(false);
const swMessage = ref("");

const togglePlayPause = () => {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const updateMediaSession = () => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Live Audio Stream",
      artist: "Your Stream",
      album: "Live Stream",
      artwork: [
        { src: "/path-to-image.jpg", sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audio.value.play();
      isPlaying.value = true;
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audio.value.pause();
      isPlaying.value = false;
    });
  }
};

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        swMessage.value = "Service Worker registered successfully!";
      })
      .catch((error) => {
        swMessage.value = `Service Worker registration failed: ${error.message}`;
      });
  } else {
    swMessage.value = "Service Worker not supported in this browser.";
  }
});
</script>

<style scoped>
.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.controls button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.controls button:hover {
  background-color: #0056b3;
}

.sw-message {
  margin-top: 10px;
  font-size: 14px;
  color: green;
}
</style>
