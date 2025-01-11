<template>
  <div class="poster-container">
    <img
      src="https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg"
      alt="Cover Image"
      class="poster-image"
    />
  </div>
  <div class="audio-container">
    <div class="controls-bar">
      <button @click="togglePlayPause" class="play-pause-btn">
        <template v-if="isPlaying">
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
const status = ref("Idle");
const logs = ref([]);
const reconnectAttempts = ref(0);
const currentTime = ref(0);
const buffer = ref(0);
const maxReconnectAttempts = 5;
let inactivityTimer = null;

const log = (message) => {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  if (logs.value.length > 10) logs.value.pop();
};

const togglePlayPause = async () => {
  if (!player.value) return;

  const mediaElement = player.value.getMediaElement();

  try {
    if (isPlaying.value) {
      mediaElement.pause();
      status.value = "Paused";
    } else {
      await mediaElement.play();
      status.value = "Playing";
      startInactivityChecker(mediaElement);
    }
    isPlaying.value = !mediaElement.paused;
  } catch (error) {
    status.value = "Error";
    log(`Error al reproducir: ${error.message}`);
  }
};

const reconnectStream = async () => {
  if (reconnectAttempts.value >= maxReconnectAttempts) {
    log("Número máximo de intentos de reconexión alcanzado.");
    status.value = "Error";
    return;
  }

  try {
    reconnectAttempts.value++;
    status.value = "Reconnecting";
    log(
      `Intentando reconectar al stream (Intento ${reconnectAttempts.value})...`
    );

    await player.value.load(audioSrc);

    // Forzar reproducción desde el último segmento en vivo
    const seekRange = player.value.seekRange();
    const liveEdge = seekRange.end; // Último segmento menos 0.5 segundos para estabilizar
    player.value.getMediaElement().currentTime = liveEdge;
    log(`Posicionando en el borde en vivo: ${liveEdge.toFixed(2)}s`);

    await player.value.getMediaElement().play();
    isPlaying.value = true;
    status.value = "Playing";
    reconnectAttempts.value = 0;
    log("Reconexión exitosa y reproducción en vivo estabilizada.");
  } catch (error) {
    log(`Error al reconectar al stream: ${error.message}`);
    setTimeout(reconnectStream, 3000); // Reintentar después de 3 segundos
  }
};

const startInactivityChecker = (mediaElement) => {
  clearInterval(inactivityTimer);
  inactivityTimer = setInterval(() => {
    currentTime.value = mediaElement.currentTime;
    const bufferedInfo = player.value.getBufferedInfo();
    buffer.value = bufferedInfo?.audio?.length
      ? bufferedInfo.audio[0].end - currentTime.value
      : 0;

    if (buffer.value > 2) {
      log(`Buffer suficiente: ${buffer.value.toFixed(2)}s.`);
      return; // No reconectar si el buffer es suficiente
    }

    if (mediaElement.currentTime === currentTime.value && isPlaying.value) {
      log("Detección de inactividad: el tiempo de reproducción no avanza.");
      reconnectStream();
    }
  }, 3000); // Comprobar cada 3 segundos
};

onMounted(() => {
  const mediaElement = document.createElement("audio");
  document.body.appendChild(mediaElement);

  player.value = new shaka.Player(mediaElement);

  // Configuración de Shaka Player
  player.value.configure({
    streaming: {
      retryParameters: {
        maxAttempts: 3, // Reducir intentos para acelerar la detección
        baseDelay: 100, // Reducir el retraso inicial
        backoffFactor: 1.2, // Incremento leve entre intentos
        fuzzFactor: 0.1, // Variación aleatoria mínima
      },
      bufferingGoal: 6, // Buffer reducido para baja latencia
      rebufferingGoal: 2, // Reanudar con 2 segundos de datos
      lowLatencyMode: true, // Activar modo de baja latencia
    },
  });

  mediaElement.addEventListener("play", () => {
    isPlaying.value = true;
    status.value = "Playing";
    log("Reproducción en curso.");
    startInactivityChecker(mediaElement);
  });

  mediaElement.addEventListener("pause", () => {
    isPlaying.value = false;
    status.value = "Paused";
    log("Reproducción pausada.");
  });

  mediaElement.addEventListener("ended", () => {
    isPlaying.value = false;
    status.value = "Idle";
    log("Reproducción finalizada.");
  });

  player.value
    .load(audioSrc)
    .then(() => {
      log("Audio cargado correctamente.");
      setupMediaSession(); // Configurar la metadata
    })
    .catch((error) => {
      log(`Error al cargar el audio: ${error.message}`);
      status.value = "Error";
    });
});

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

    navigator.mediaSession.setActionHandler("play", async () => {
      const mediaElement = player.value.getMediaElement();
      await mediaElement.play();
      isPlaying.value = true;
      log("Media Session: Reproducción iniciada desde controles externos.");
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      const mediaElement = player.value.getMediaElement();
      mediaElement.pause();
      isPlaying.value = false;
      log("Media Session: Reproducción pausada desde controles externos.");
    });
  }
};

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy();
    player.value = null;
  }
  clearInterval(inactivityTimer);
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
