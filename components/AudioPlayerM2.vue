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
      <p>Audio Consumption: {{ audioConsumption }} KB</p>
      <p>Audio State: {{ audioState }}</p>
      <p>Network State: {{ networkState }}</p>
      <p>MediaSession Supported: {{ mediaSessionSupported }}</p>
      <p>AudioContext Supported: {{ audioContextSupported }}</p>
    </div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const audioSrc =
  "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8";
const audio = ref(null);
const isPlaying = ref(false);
const message = ref("");
const swStatus = ref("Not Registered");
const audioConsumption = ref(0);
const audioState = ref("Idle");
const networkState = ref("");
const mediaSessionSupported = ref(false);
const audioContextSupported = ref(false);
let consumptionInterval = null;

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
  startMonitoringConsumption();
  isPlaying.value = true;
  audioState.value = "Playing";
};

const handlePause = () => {
  stopMonitoringConsumption();
  isPlaying.value = false;
  audioState.value = "Paused";
};

const handleError = () => {
  audioState.value = "Error";
  message.value = "Audio playback encountered an error.";
};

const setupMediaSession = () => {
  if ("mediaSession" in navigator) {
    mediaSessionSupported.value = true;
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
  } else {
    mediaSessionSupported.value = false;
  }
};

const startMonitoringConsumption = () => {
  if (consumptionInterval) return;

  consumptionInterval = setInterval(() => {
    if (
      audio.value &&
      audio.value.networkState === HTMLMediaElement.NETWORK_LOADING
    ) {
      audioConsumption.value += 50; // Aproximación: 50 KB por intervalo de 5 segundos
    }
    networkState.value = getNetworkState(audio.value.networkState);
  }, 5000);
};

const stopMonitoringConsumption = () => {
  if (consumptionInterval) {
    clearInterval(consumptionInterval);
    consumptionInterval = null;
  }
};

const getNetworkState = (state) => {
  switch (state) {
    case HTMLMediaElement.NETWORK_EMPTY:
      return "No information available";
    case HTMLMediaElement.NETWORK_IDLE:
      return "Not actively seeking data";
    case HTMLMediaElement.NETWORK_LOADING:
      return "Loading data";
    case HTMLMediaElement.NETWORK_NO_SOURCE:
      return "No source found";
    default:
      return "Unknown state";
  }
};

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        swStatus.value = "Registered";
      })
      .catch((error) => {
        swStatus.value = `Failed: ${error.message}`;
      });
  } else {
    swStatus.value = "Not Supported";
  }

  audioContextSupported.value = !!(
    window.AudioContext || window.webkitAudioContext
  );
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause();
  }
  stopMonitoringConsumption();
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

.info {
  margin-top: 15px;
  font-size: 14px;
}

.message {
  margin-top: 10px;
  font-size: 14px;
  color: green;
}
</style>
