<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <!-- Reproductor de Video -->
    <VideoPlayerVideo :streamUrl="streamUrl" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import VideoPlayerVideo from "@/components/VideoPlayerVideo.vue";

const streamUrl = ref("");
const route = useRoute();

onMounted(async () => {
  const videoId = route.params.id;

  try {
    // Llamar a la API para obtener detalles del video
    const response = await $fetch(`/api/video/${videoId}`);

    if (
      response.data &&
      response.data.playback_ids &&
      response.data.playback_ids.length > 0
    ) {
      // Obtener el playbackId del video para construir la URL de transmisión
      const playbackId = response.data.playback_ids[0].id;
      streamUrl.value = `https://stream.mux.com/${playbackId}.m3u8`;
    } else {
      console.error("Error: No se encontró el playbackId para este video.");
    }
  } catch (error) {
    console.error("Error al obtener detalles del video:", error);
  }
});
</script>

<style scoped>
/* Estilos para hacer que el player ocupe toda la pantalla en embed */
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.min-h-screen {
  height: 100vh;
}
</style>
