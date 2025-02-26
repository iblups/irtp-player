<template>
  <div v-if="!isMobile" class="poster-container" @click="playVideo">
    <img
      v-show="showPosterImage"
      src="https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg"
      alt="Cover Image"
      class="poster-image"
    />
  </div>
  <div class="video-container">
    <video
      v-if="!isMobile"
      id="web-player"
      class="video-js vjs-fill audio"
      controls
      playsinline
      muted
      autoplay
      @play="showPoster"
      @pause="showPoster"
    ></video>
    <div v-else class="mobile-player" @click="playMobileStream">
      <img
        src="https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg"
        alt="Cover Image"
        class="cover-image"
      />
      <button class="play-button">Play Audio</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@/assets/css/playeraudio.css"; // Asegúrate de importar tu CSS personalizado

const props = defineProps({
  streamUrl: {
    type: String,
    default:
      "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8",
  },
});

const isMobile = ref(false);
const showPosterImage = ref(true);
let player;

const detectMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Detecta si es un dispositivo móvil
  return /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

const playMobileStream = () => {
  window.open(props.streamUrl, "_blank");
};

const showPoster = () => {
  showPosterImage.value = true;
};

const hidePoster = () => {
  showPosterImage.value = false;
};

const playVideo = () => {
  if (player) {
    player.play();
    hidePoster();
  }
};

onMounted(() => {
  isMobile.value = detectMobileDevice();

  if (!isMobile.value) {
    player = videojs("web-player", {
      preload: "auto",
      muted: true,
      autoplay: true,
      controlBar: {
        fullscreenToggle: false,
        volumePanel: {
          inline: false,
        },
      },
      fill: true,
      liveui: false,
      playbackRates: false,
      html5: {
        hls: {
          limitRenditionByPlayerDimensions: true,
          useDevicePixelRatio: true,
        },
      },
      backgroundPlayback: true, // Esta línea habilita la reproducción en segundo plano
      loadingSpinner: false, // Desactivar el preloader
    });

    player.ready(() => {
      player.src({
        src: props.streamUrl,
        type: "application/x-mpegURL",
      });
      player.volume(0.6); // Establecer el volumen inicial al 60%
    });

    player.on("play", showPoster);
    player.on("pause", showPoster);
  }
});
</script>

<style scoped>
.poster-container {
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
}

.poster-image {
  border-radius: 1rem;
  height: auto;
  max-width: 100%;
  width: 100%;
}

.video-container {
  height: 100%;
  max-height: 450px;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

/* Estilos personalizados */
.audio {
  font-size: 15px; /* Aumentar el tamaño de la fuente */
  font-family: "Poppins", sans-serif; /* Cambiar el tipo de letra */
  border-bottom-left-radius: 15px; /* Radio del borde en la esquina inferior izquierda */
  border-bottom-right-radius: 15px; /* Radio del borde en la esquina inferior derecha */
}

.cover-image {
  width: 100%;
  max-width: 900px;
}
.video-js {
  background-color: transparent;
}
.video-js .vjs-tech {
  left: 0;
  position: absolute;
  top: 0;
  opacity: 0;
}
</style>
