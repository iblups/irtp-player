<template>
  <div class="poster-container">
    <img
      v-show="showPosterImage"
      src="https://iblups.sfo3.cdn.digitaloceanspaces.com/media/cover-radio2.jpeg"
      alt="Cover Image"
      class="poster-image"
    />
  </div>
  <div class="audio-container">
    <audio
      id="web-player"
      class="video-js vjs-fill audio"
      controls
      playsinline
      autoplay
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Esto se mantiene en caso de que sigas usando Video.js para otras partes del sitio

const props = defineProps({
  streamUrl: {
    type: String,
    default:
      "https://cdnhd.iblups.com/hls/0773874174fd4eba8bb9eff741d190dc.m3u8",
  },
});

const showPosterImage = ref(true);

const hidePoster = () => {
  showPosterImage.value = false;
};

const playAudio = () => {
  const player = document.getElementById("web-player");
  if (player) {
    player.play();
    hidePoster();
  }
};

onMounted(() => {
  const player = document.getElementById("web-player");

  // Configuración del audio en segundo plano utilizando Media Session API
  if (player && "mediaSession" in navigator) {
    player.src = props.streamUrl;
    player.volume = 0.6; // Establecer el volumen inicial al 60%

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

    navigator.mediaSession.setActionHandler("play", () => player.play());
    navigator.mediaSession.setActionHandler("pause", () => player.pause());
    navigator.mediaSession.setActionHandler("stop", () => player.pause());
  }

  // Asegurarse de que el audio comience automáticamente
  player.play().catch((error) => {
    console.log("Autoplay failed: ", error);
  });
});
</script>

<style scoped>
.poster-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

.poster-image {
  border-radius: 1rem;
  width: 100%;
}
.audio-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto;
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}
</style>
