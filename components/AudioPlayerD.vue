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
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  flex-direction: column; /* Asegurar que los elementos estén uno debajo del otro */
  width: 100%;
  max-width: 780px;
  height: 350px; /* Establecer la altura total */
  background-color: #f0f0f0; /* Fondo opcional para resaltar el área */
  border-radius: 10px; /* Opcional: añadir bordes redondeados */
  margin: 0 auto; /* Asegura que esté centrado horizontalmente en la página */
}

.poster-image {
  width: 100%;
  max-width: 100%; /* Asegurar que la imagen no se pase del contenedor */
  height: auto; /* Mantener la proporción de la imagen */
  border-top-left-radius: 15px; /* Radio del borde en la esquina inferior izquierda */
  border-top-right-radius: 15px; /* Radio del borde en la esquina inferior derecha */
}

.video-container {
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  width: 100%;
  max-width: 780px;
  height: 45px; /* Ajusta la altura del contenedor de video a 10px */

  margin: 0 auto; /* Centrar el contenedor en la página */
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
  max-width: 780px;
}
</style>
