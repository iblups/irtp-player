<template>
  <div class="audio-player">
    <audio
      ref="audio"
      :src="audioSrc"
      @play="handlePlay"
      @pause="handlePause"
    ></audio>
    <div class="controls">
      <button @click="togglePlayPause">
        {{ isPlaying ? "Pause" : "Play" }}
      </button>
    </div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const audioSrc =
  "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8"; // URL del stream en vivo
const audio = ref(null);
const isPlaying = ref(false);
const message = ref("");

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
};

const handlePause = () => {
  isPlaying.value = false;
};

const setupMediaSession = () => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "RPP En Vivo",
      artist: "RPP Noticias",
      artwork: [
        { src: "/path/to/artwork.jpg", sizes: "512x512", type: "image/jpeg" },
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
        message.value = "Service Worker registered successfully!";
      })
      .catch((error) => {
        message.value = `Service Worker registration failed: ${error.message}`;
      });
  } else {
    message.value = "Service Worker not supported in this browser.";
  }
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause();
  }
});
</script>

<style scoped>
.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
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

.message {
  margin-top: 10px;
  font-size: 14px;
  color: green;
}
</style>
