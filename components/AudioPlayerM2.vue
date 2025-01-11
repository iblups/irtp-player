<template>
  <div class="poster-container">
    <!-- Imagen del poster -->
    <img
      src="https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg"
      alt="Cover Image"
      class="poster-image"
    />
  </div>
  <div class="audio-container">
    <!-- Barra de controles -->
    <div class="controls-bar">
      <!-- Botón Play/Pause minimalista -->
      <button @click="togglePlayPause" class="play-pause-btn">
        <template v-if="isPlaying">
          <!-- Ícono de pausa sólido -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 4h3v12H6V4zm5 0h3v12h-3V4z" />
          </svg>
        </template>
        <template v-else>
          <!-- Ícono de play sólido -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
          </svg>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import shaka from "shaka-player";

const audioSrc =
  "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8";
const player = ref(null);
const isPlaying = ref(false);

const togglePlayPause = () => {
  if (!player.value) return;

  const mediaElement = player.value.getMediaElement();
  if (isPlaying.value) {
    mediaElement.pause();
  } else {
    mediaElement.play();
  }
  isPlaying.value = !isPlaying.value;
};

const setupMediaSession = () => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Radio Nacional",
      artist: "En vivo",
      album: "Radio Nacional",
      artwork: [
        {
          src: "https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg",
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      player.value.getMediaElement().play();
      isPlaying.value = true;
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      player.value.getMediaElement().pause();
      isPlaying.value = false;
    });
  }
};

onMounted(() => {
  const mediaElement = document.createElement("audio");
  document.body.appendChild(mediaElement);

  player.value = new shaka.Player(mediaElement);

  // Configuración de Shaka Player con reintentos y buffering
  player.value.configure({
    streaming: {
      retryParameters: {
        maxAttempts: Infinity, // Reintenta indefinidamente
        baseDelay: 1000, // 1 segundo de retraso inicial
        backoffFactor: 2, // Incremento exponencial del retraso
        fuzzFactor: 0.5, // Variación aleatoria en los reintentos
      },
      bufferingGoal: 60, // Buffer de 60 segundos
      rebufferingGoal: 15, // Rebuffer de 15 segundos
      lowLatencyMode: true, // Habilita modo de baja latencia
    },
  });

  // Escuchar eventos de error y buffering
  player.value.addEventListener("error", (event) => {
    console.error("Shaka Player Error:", event.detail);
  });

  player.value.addEventListener("buffering", (event) => {
    console.log("Buffering:", event.buffering);
  });

  // Cargar el stream HLS
  player.value
    .load(audioSrc)
    .then(() => {
      console.log("Audio cargado correctamente.");
      setupMediaSession(); // Configurar la metadata
    })
    .catch((error) => {
      console.error("Error al cargar el audio:", error);
    });
});

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy();
    player.value = null;
  }
});
</script>

<style scoped>
/* Poster Styles */
.poster-container {
  position: absolute;
  top: 0;
  width: 100%;
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

.poster-image {
  border-radius: 1rem;
  width: 100%;
}

/* Audio Container Styles */
.audio-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto;
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
  background-color: #333;
}

/* Controls Styles */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Botón a la izquierda */
  width: 100%;
  padding: 10px;
  gap: 15px;
}

.play-pause-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  color: #fff;
  transition: color 0.3s ease;
}

.play-pause-btn:hover {
  color: #ccc;
}

.play-pause-btn svg {
  width: 30px;
  height: 30px;
}
</style>
