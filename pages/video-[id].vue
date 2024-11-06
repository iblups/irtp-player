<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <!-- Reproductor de Video -->
    <VideoPlayer :streamUrl="streamUrl" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import VideoPlayer from "@/components/VideoPlayer.vue";

const streamUrl = ref("");
const route = useRoute();

onMounted(() => {
  const playbackId = route.params.id;
  // Generar la URL de reproducción HLS usando el `playbackId`
  streamUrl.value = `https://stream.mux.com/${playbackId}.m3u8`;
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
