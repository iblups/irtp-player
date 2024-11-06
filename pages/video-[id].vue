<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <!-- Reproductor de Video -->
    <VideoPlayer v-if="streamUrl" :streamUrl="streamUrl" />
    <p v-else class="text-white">Cargando video...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import VideoPlayer from "@/components/VideoPlayer.vue";

const streamUrl = ref("");
const route = useRoute();

onMounted(async () => {
  const videoId = route.params.id;

  try {
    // Llamar al API para obtener el playbackId
    const response = await $fetch(`/api/video/${videoId}`);

    if (response.status === "success" && response.playbackId) {
      // Construir la URL de transmisión HLS usando el playbackId
      streamUrl.value = `https://stream.mux.com/${response.playbackId}.m3u8`;
    } else {
      console.error("Error: No se pudo obtener el playbackId.");
    }
  } catch (error) {
    console.error("Error al cargar el video:", error);
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
